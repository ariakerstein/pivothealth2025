import { useState } from "react";
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
  const [activeTab, setActiveTab] = useState("similar-patients");

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
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Patient Community</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Connect with others on similar cancer journeys, share experiences, and find support
        </p>
      </div>

      <Tabs defaultValue="similar-patients" className="space-y-8">
        <TabsList className="grid grid-cols-5 gap-4 bg-muted p-1 rounded-lg">
          <TabsTrigger value="similar-patients" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Similar Patients
          </TabsTrigger>
          <TabsTrigger value="discussions" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Discussions
          </TabsTrigger>
          <TabsTrigger value="mentor-others" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Mentor Others
          </TabsTrigger>
          <TabsTrigger value="success-stories" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Success Stories
          </TabsTrigger>
          <TabsTrigger value="support-groups" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Support Groups
          </TabsTrigger>
        </TabsList>

        <TabsContent value="similar-patients">
          <div className="grid md:grid-cols-2 gap-6">
            {similarPatients?.map((patient) => (
              <Card key={patient.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={`/avatars/${patient.id}.png`} />
                        <AvatarFallback>{patient.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{patient.name}</CardTitle>
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
                      <p>{patient.treatmentPhase}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Common Interests</p>
                      <div className="flex flex-wrap gap-2">
                        {patient.interests.map((interest) => (
                          <Badge key={interest} variant="outline">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full" variant="outline">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="discussions">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Discussion Topics</CardTitle>
                <Button>Start New Discussion</Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {discussionTopics?.map((topic) => (
                    <Card key={topic.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{topic.title}</CardTitle>
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
                            <Badge key={tag} variant="outline">
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

        <TabsContent value="mentor-others">
          <div className="grid gap-6">
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

            {/* Current Mentees Section */}
            <Card>
              <CardHeader>
                <CardTitle>Your Current Mentees</CardTitle>
                <CardDescription>Patients you're currently mentoring</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {mentees?.map((mentee) => (
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
                                <Button variant="outline" size="sm">Message</Button>
                                <Button variant="outline" size="sm">Schedule Call</Button>
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
          </div>
        </TabsContent>

        <TabsContent value="success-stories">
          <Card>
            <CardHeader>
              <CardTitle>Success Stories</CardTitle>
              <CardDescription>
                Read inspiring stories from patients who've completed their treatment journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                Coming soon! Share your success story and inspire others.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support-groups">
          <Card>
            <CardHeader>
              <CardTitle>Virtual Support Groups</CardTitle>
              <CardDescription>
                Join moderated group sessions with patients sharing similar experiences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                Support group scheduling coming soon!
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}