import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Users, UserPlus, Heart, Calendar, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PatientProfile {
  id: number;
  name: string;
  cancerType: string;
  stage: string;
  treatmentPhase: string;
  interests: string[];
  matchScore: number;
}

interface DiscussionTopic {
  id: number;
  title: string;
  author: string;
  replies: number;
  lastActivity: string;
  tags: string[];
}

interface Mentee {
  id: number;
  name: string;
  avatar?: string;
  diagnosis: string;
  stage: string;
  status: string;
}

export default function CommunityPage() {
  const { toast } = useToast();
  const [location, setLocation] = useLocation();

  // Determine active tab based on current route
  const getActiveTab = () => {
    switch (location) {
      case "/community/patients":
        return "similar-patients";
      case "/community/topics":
        return "discussions";
      case "/community/mentor":
        return "mentor-others";
      case "/community/success-stories":
        return "success-stories";
      case "/community/groups":
        return "support-groups";
      default:
        return "similar-patients";
    }
  };

  // Handle tab changes by updating the URL
  const handleTabChange = (value: string) => {
    switch (value) {
      case "similar-patients":
        setLocation("/community/patients");
        break;
      case "discussions":
        setLocation("/community/topics");
        break;
      case "mentor-others":
        setLocation("/community/mentor");
        break;
      case "success-stories":
        setLocation("/community/success-stories");
        break;
      case "support-groups":
        setLocation("/community/groups");
        break;
    }
  };

  const { data: similarPatients = [] } = useQuery<PatientProfile[]>({
    queryKey: ['/api/community/similar-patients'],
  });

  const { data: discussionTopics = [] } = useQuery<DiscussionTopic[]>({
    queryKey: ['/api/community/discussions'],
  });

  const { data: mentorProfile } = useQuery({
    queryKey: ['/api/mentor/profile'],
  });

  const { data: mentees = [] } = useQuery<Mentee[]>({
    queryKey: ['/api/mentor/mentees'],
  });

  const { data: requests = [] } = useQuery<Mentee[]>({
    queryKey: ['/api/mentor/requests'],
  });

  return (
    <div className="container mx-auto py-4 sm:py-8 px-4">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-4">Patient Community</h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Connect with others on similar cancer journeys, share experiences, and find support
        </p>
      </div>

      <Tabs value={getActiveTab()} onValueChange={handleTabChange} className="space-y-6 sm:space-y-8">
        <TabsList className="w-full overflow-x-auto flex sm:grid sm:grid-cols-5 gap-2 sm:gap-4 bg-muted p-1 rounded-lg">
          <TabsTrigger value="similar-patients" className="flex items-center gap-2 min-w-max">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Similar Patients</span>
            <span className="sm:hidden">Patients</span>
          </TabsTrigger>
          <TabsTrigger value="discussions" className="flex items-center gap-2 min-w-max">
            <MessageCircle className="h-4 w-4" />
            Topics
          </TabsTrigger>
          <TabsTrigger value="mentor-others" className="flex items-center gap-2 min-w-max">
            <Award className="h-4 w-4" />
            Mentor
          </TabsTrigger>
          <TabsTrigger value="success-stories" className="flex items-center gap-2 min-w-max">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Success Stories</span>
            <span className="sm:hidden">Success</span>
          </TabsTrigger>
          <TabsTrigger value="support-groups" className="flex items-center gap-2 min-w-max">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Support Groups</span>
            <span className="sm:hidden">Groups</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="similar-patients">
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {similarPatients?.map((patient) => (
              <Card key={patient.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 sm:h-12 w-10 sm:w-12">
                        <AvatarImage src={`/avatars/${patient.id}.png`} />
                        <AvatarFallback>{patient.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base sm:text-lg">{patient.name}</CardTitle>
                        <CardDescription>
                          {patient.cancerType} • Stage {patient.stage}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={patient.matchScore > 80 ? "default" : "secondary"}>
                      {patient.matchScore}% Match
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Treatment Phase</p>
                      <p className="text-sm sm:text-base">{patient.treatmentPhase}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Common Interests</p>
                      <div className="flex flex-wrap gap-2">
                        {patient.interests.map((interest) => (
                          <Badge key={interest} variant="outline" className="text-xs sm:text-sm">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full" variant="outline" size="sm">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="discussions" className="min-h-[300px]">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>Discussion Topics</CardTitle>
                <Button>Start New Discussion</Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] sm:h-[600px]">
                <div className="space-y-4">
                  {discussionTopics?.map((topic) => (
                    <Card key={topic.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base sm:text-lg">{topic.title}</CardTitle>
                            <CardDescription>
                              Started by {topic.author} • {topic.lastActivity}
                            </CardDescription>
                          </div>
                          <Badge variant="secondary">{topic.replies} replies</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {topic.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs sm:text-sm">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mentor-others" className="min-h-[300px]">
          <Card>
            <CardHeader>
              <CardTitle>Your Mentor Profile</CardTitle>
              <CardDescription>
                Share your experience to help match you with patients who can benefit from your journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                Please visit the dedicated Mentor page for the full mentoring experience.
                <div className="mt-4">
                  <Button onClick={() => setLocation("/community/mentor")}>
                    Go to Mentor Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="success-stories" className="min-h-[300px]">
          <Card>
            <CardHeader>
              <CardTitle>Success Stories</CardTitle>
              <CardDescription>
                Read inspiring stories from patients who've completed their treatment journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 sm:py-12 text-muted-foreground">
                Coming soon! Share your success story and inspire others.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support-groups" className="min-h-[300px]">
          <Card>
            <CardHeader>
              <CardTitle>Virtual Support Groups</CardTitle>
              <CardDescription>
                Join moderated group sessions with patients sharing similar experiences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 sm:py-12 text-muted-foreground">
                Support group scheduling coming soon!
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}