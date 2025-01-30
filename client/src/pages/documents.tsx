import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Loader2, FileText, Upload, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { fetchEpicDocuments } from "@/lib/epic-client";
import EHRWizard from "@/components/ehr/EHRWizard";
import { Badge } from "@/components/ui/badge";

interface Document {
  id: number;
  filename: string;
  contentType: string;
  documentType: string;
  uploadedAt: string;
  source?: string; // Added for EPIC integration
  metadata: {
    size: number;
    lastModified: string;
    tags?: string[];
  };
}

export default function Documents() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>("medical_record");
  const [showEHRWizard, setShowEHRWizard] = useState(false);
  const { toast } = useToast();

  // Fetch local documents
  const { data: localDocuments, isLoading: loadingLocal, refetch: refetchLocal } = useQuery<Document[]>({
    queryKey: ['/api/documents'],
    queryFn: async () => {
      const response = await fetch('/api/documents');
      if (!response.ok) {
        throw new Error('Failed to fetch local documents');
      }
      return response.json();
    }
  });

  // Fetch EPIC documents
  const { data: epicDocuments, isLoading: loadingEpic } = useQuery({
    queryKey: ['epic-documents'],
    queryFn: fetchEpicDocuments,
    // Disable by default until connected
    enabled: false,
  });

  // Combine local and EPIC documents
  const documents = [
    ...(localDocuments || []).map(doc => ({ ...doc, source: 'Local' })),
    ...(epicDocuments || [])
  ];

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Document Uploaded",
        description: "Your document has been securely uploaded and encrypted.",
      });
      setSelectedFile(null);
      refetchLocal();
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

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const handleEHRConnect = () => {
    setShowEHRWizard(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* EHR Integration Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            Connect with EPIC
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Connect with EPIC sandbox to test importing your medical documents and records.
          </p>
          <div className="flex gap-4">
            <Button onClick={handleEHRConnect} className="bg-blue-600 hover:bg-blue-700">
              Connect to EPIC Sandbox
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* EHR Connection Wizard */}
      <Dialog open={showEHRWizard} onOpenChange={setShowEHRWizard}>
        <DialogContent className="max-w-4xl">
          <DialogTitle>Connect to EPIC Sandbox</DialogTitle>
          <EHRWizard onClose={() => setShowEHRWizard(false)} />
        </DialogContent>
      </Dialog>

      {/* Upload Document Card */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
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
                  <SelectItem value="medical_record">Medical Record</SelectItem>
                  <SelectItem value="lab_result">Lab Result</SelectItem>
                  <SelectItem value="prescription">Prescription</SelectItem>
                  <SelectItem value="imaging">Imaging</SelectItem>
                  <SelectItem value="insurance">Insurance Document</SelectItem>
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
          <CardTitle>My Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingLocal || loadingEpic ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : documents?.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No documents uploaded yet
            </p>
          ) : (
            <div className="space-y-4">
              {documents?.map((doc: any) => (
                <Card key={doc.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center">
                      <FileText className="h-8 w-8 text-blue-500 mr-4" />
                      <div>
                        <h3 className="font-medium">{doc.filename}</h3>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-muted-foreground">
                            {new Date(doc.uploadedAt).toLocaleDateString()}
                            {doc.metadata?.size && ` • ${formatBytes(doc.metadata.size)}`}
                          </p>
                          {doc.source && (
                            <Badge variant="outline" className="text-xs">
                              {doc.source}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" asChild>
                      <a href={doc.source === 'EPIC Sandbox' ? `/api/epic/documents/${doc.id}` : `/api/documents/${doc.id}`} target="_blank" rel="noopener">
                        View
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}