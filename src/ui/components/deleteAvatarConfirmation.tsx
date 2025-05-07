import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
} from "@/ui/components/dialog";
import { Button } from "@/ui/components/button";

type DeleteDialogProps = {
  onConfirm: () => void;
};

export default function DeleteAvatarConfirmation({
  onConfirm,
}: DeleteDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="destructive">
        Remove Photo
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogTitle className="text-slate-900">
            Delete Avatar Photo
          </DialogTitle>
          <DialogDescription className="text-slate-700">
            Are you sure you want to delete your avatar photo? This action
            cannot be undone.
          </DialogDescription>
          <DialogFooter>
            <Button onClick={() => setIsOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button
              onClick={() => {
                onConfirm();
                setIsOpen(false);
              }}
              variant="destructive"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
