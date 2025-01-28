import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SchedulingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SchedulingModal({ open, onOpenChange }: SchedulingModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Schedule Your First Consultation</DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-[500px]">
          <iframe
            src="https://calendly.com/YOUR_CALENDLY_USERNAME"
            width="100%"
            height="100%"
            frameBorder="0"
            title="Schedule Appointment"
            className="min-h-[500px]"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
