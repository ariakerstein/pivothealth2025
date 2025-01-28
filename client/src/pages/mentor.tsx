import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Calendar, Users, MessageSquare, Award, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function MentorPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");

  const { data: mentorProfile } = useQuery({
    queryKey: ['/api/mentor/profile'],
  });

  const { data: mentees } = useQuery({
    queryKey: ['/api/mentor/mentees'],
  });

  const { data: requests } = useQuery({
    queryKey: ['/api/mentor/requests'],
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: any) =>
      fetch("/api/mentor/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((res) => res.json()),
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your mentor profile has been updated successfully.",
      });
    },
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Mentor Others</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Share your experience and support others on their cancer journey
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList className="grid w-full grid-cols-4 gap-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Mentor Profile
          </TabsTrigger>
          <TabsTrigger value="availability" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Availability
          </TabsTrigger>
          <TabsTrigger value="mentees" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Current Mentees
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Requests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Your Mentor Profile</CardTitle>
              <CardDescription>
                Share your experience to help match you with patients who can benefit from your journey
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Areas of Expertise</label>
                  <div className="flex flex-wrap gap-2">
                    {["Breast Cancer", "Lung Cancer", "Chemotherapy", "Radiation", "Surgery", "Clinical Trials", "Lifestyle Changes", "Emotional Support"].map((tag) => (
                      <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Your Story</label>
                  <Textarea 
                    placeholder="Share your cancer journey and what you learned..."
                    className="min-h-[150px]"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">How You Can Help</label>
                  <Textarea 
                    placeholder="Describe how you'd like to support other patients..."
                    className="min-h-[100px]"
                  />
                </div>

                <Button className="w-full">Save Profile</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability">
          <Card>
            <CardHeader>
              <CardTitle>Set Your Availability</CardTitle>
              <CardDescription>
                Define when you're available for mentoring sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                Calendar integration coming soon!
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mentees">
          <Card>
            <CardHeader>
              <CardTitle>Your Current Mentees</CardTitle>
              <CardDescription>
                Patients you're currently mentoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {mentees?.map((mentee: any) => (
                    <Card key={mentee.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={mentee.avatar} />
                            <AvatarFallback>{mentee.name.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-semibold">{mentee.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {mentee.diagnosis} • Stage {mentee.stage}
                            </p>
                            <div className="flex gap-2 mt-2">
                              <Button variant="outline" size="sm">
                                Message
                              </Button>
                              <Button variant="outline" size="sm">
                                Schedule Call
                              </Button>
                            </div>
                          </div>
                          <Badge variant="outline" className="mt-1">
                            {mentee.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Mentorship Requests</CardTitle>
              <CardDescription>
                Patients seeking your guidance and support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {requests?.map((request: any) => (
                    <Card key={request.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={request.avatar} />
                            <AvatarFallback>{request.name.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-semibold">{request.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {request.diagnosis} • Stage {request.stage}
                            </p>
                            <p className="text-sm">
                              "{request.message}"
                            </p>
                            <div className="flex gap-2 mt-4">
                              <Button className="w-full" size="sm">
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Accept Request
                              </Button>
                              <Button variant="outline" size="sm" className="w-full">
                                Message First
                              </Button>
                            </div>
                          </div>
                          <Badge variant="secondary">
                            New Request
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
