import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Loader2, FileText, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { medplum } from "@/lib/medplum";
import { DocumentReference, Bundle } from "@medplum/fhirtypes";

export default function Documents() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>("clinical-note");
  const { toast } = useToast();

  const { data: documents, isLoading, refetch } = useQuery<Bundle>({
    queryKey: ['/DocumentReference'],
    queryFn: async () => {
      return medplum.search('DocumentReference', {
        _sort: '-_lastUpdated',
      });
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const file = formData.get('file') as File;
      const contentType = file.type;

      // First upload the binary
      const binary = await medplum.uploadMedia(file, contentType);

      // Create a DocumentReference
      const docRef: DocumentReference = {
        resourceType: 'DocumentReference',
        status: 'current',
        docStatus: 'final',
        type: {
          coding: [{
            system: 'http://loinc.org',
            code: documentType,
          }],
        },
        content: [{
          attachment: {
            contentType: contentType,
            url: binary.url,
            title: file.name,
          },
        }],
        description: `Uploaded on ${new Date().toISOString()}`,
      };

      return medplum.createResource(docRef);
    },
    onSuccess: () => {
      toast({
        title: "Document Uploaded",
        description: "Your document has been securely uploaded to Medplum.",
      });
      setSelectedFile(null);
      refetch();
    },
    onError: () => {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your document.",
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('documentType', documentType);

    uploadMutation.mutate(formData);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Medical Document</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Document Type</label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clinical-note">Clinical Note</SelectItem>
                  <SelectItem value="diagnostic-report">Diagnostic Report</SelectItem>
                  <SelectItem value="discharge-summary">Discharge Summary</SelectItem>
                  <SelectItem value="imaging">Imaging</SelectItem>
                  <SelectItem value="laboratory">Laboratory Report</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">File</label>
              <Input 
                type="file" 
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
            </div>

            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploadMutation.isPending}
            >
              {uploadMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Upload Document
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Medical Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : !documents?.entry?.length ? (
            <p className="text-center text-muted-foreground py-8">
              No documents uploaded yet
            </p>
          ) : (
            <div className="space-y-4">
              {documents.entry.map((entry) => {
                const doc = entry.resource as DocumentReference;
                const attachment = doc.content?.[0]?.attachment;

                return (
                  <Card key={doc.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center">
                        <FileText className="h-8 w-8 text-blue-500 mr-4" />
                        <div>
                          <h3 className="font-medium">{attachment?.title || 'Untitled Document'}</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(doc.date || '')} • {doc.type?.coding?.[0]?.code}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" asChild>
                        <a href={attachment?.url} target="_blank" rel="noopener">
                          View
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}