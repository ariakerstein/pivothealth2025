import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PlayCircle, Pause } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

export function WelcomeVideo({ isOpen, onClose, userName = "there" }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setProgress(100);
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.target as HTMLVideoElement;
    const percentage = (video.currentTime / video.duration) * 100;
    setProgress(percentage);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={() => onClose()}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl">
            Welcome to Pivot Health, {userName}! 👋
          </AlertDialogTitle>
          <AlertDialogDescription className="text-lg">
            Let's start your personalized healthcare journey together.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="my-4 relative rounded-lg overflow-hidden bg-black aspect-video">
          <video
            className="w-full"
            src="/welcome-video.mp4"
            onEnded={handleVideoEnd}
            onTimeUpdate={handleTimeUpdate}
            onClick={() => setIsPlaying(!isPlaying)}
          />
          <button
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause className="h-16 w-16 text-white" />
            ) : (
              <PlayCircle className="h-16 w-16 text-white" />
            )}
          </button>
          <Progress value={progress} className="absolute bottom-0 left-0 right-0" />
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">What's next?</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
              Complete your health profile
            </li>
            <li className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
              Connect with your healthcare providers
            </li>
            <li className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
              Explore personalized recommendations
            </li>
          </ul>
        </div>

        <AlertDialogFooter>
          <Button onClick={onClose} className="w-full">
            Get Started
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
