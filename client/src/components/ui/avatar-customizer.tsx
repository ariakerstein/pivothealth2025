import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

const AVATAR_STYLES = [
  'adventurer',
  'adventurer-neutral',
  'avataaars',
  'big-ears',
  'big-ears-neutral',
  'big-smile',
  'bottts',
  'croodles',
  'fun-emoji',
  'icons',
  'identicon',
  'micah',
  'miniavs',
  'personas',
  'pixel-art'
];

interface AvatarCustomizerProps {
  initialAvatarUrl?: string;
  onSave?: (avatarUrl: string) => void;
}

export function AvatarCustomizer({ initialAvatarUrl, onSave }: AvatarCustomizerProps) {
  const [selectedStyle, setSelectedStyle] = useState(AVATAR_STYLES[0]);
  const [seed, setSeed] = useState(() => Math.random().toString(36).substring(7));
  const { toast } = useToast();

  const updateAvatarMutation = useMutation({
    mutationFn: async (avatarUrl: string) => {
      const response = await fetch('/api/user/avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatarUrl }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update avatar');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Avatar Updated",
        description: "Your avatar has been successfully updated!",
      });
      onSave?.(data.avatarUrl);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update avatar. Please try again.",
      });
    },
  });

  const generateAvatarUrl = (style: string) => {
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
  };

  const handleStyleSelect = (style: string) => {
    setSelectedStyle(style);
  };

  const handleRandomize = () => {
    setSeed(Math.random().toString(36).substring(7));
  };

  const handleSave = () => {
    const avatarUrl = generateAvatarUrl(selectedStyle);
    updateAvatarMutation.mutate(avatarUrl);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customize Your Avatar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          {/* Preview */}
          <Avatar className="w-32 h-32">
            <AvatarImage src={generateAvatarUrl(selectedStyle)} alt="Avatar preview" />
            <AvatarFallback>Preview</AvatarFallback>
          </Avatar>

          {/* Style Selection */}
          <ScrollArea className="h-48 w-full rounded-md border">
            <div className="p-4 grid grid-cols-2 gap-4">
              {AVATAR_STYLES.map((style) => (
                <Button
                  key={style}
                  variant={selectedStyle === style ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => handleStyleSelect(style)}
                >
                  <Avatar className="w-8 h-8 mr-2">
                    <AvatarImage src={generateAvatarUrl(style)} />
                    <AvatarFallback>ST</AvatarFallback>
                  </Avatar>
                  {style.replace(/-/g, ' ')}
                </Button>
              ))}
            </div>
          </ScrollArea>

          {/* Actions */}
          <div className="flex gap-4">
            <Button onClick={handleRandomize} variant="outline">
              Randomize
            </Button>
            <Button onClick={handleSave}>
              Save Avatar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
