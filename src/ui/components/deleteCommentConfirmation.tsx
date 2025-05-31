import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
} from "@/ui/components/dialog";
import { Button } from "@/ui/components/button";
import { Trash2 } from "lucide-react";

type DeleteDialogProps = {
  onConfirm: (commentId: string) => Promise<void>;
  commentId: string;
};

export default function DeleteCommentConfirmation({
  onConfirm,
  commentId,
}: DeleteDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Trash2
        onClick={() => setIsOpen(true)}
        className="text-red-400 cursor-pointer w-7 h-7 hover:text-red-600 transition"
      />
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogTitle className="text-slate-900">Delete Comment</DialogTitle>
          <DialogDescription className="text-slate-700">
            Are you sure you want to delete your comment? This action cannot be
            undone.
          </DialogDescription>
          <DialogFooter>
            <Button onClick={() => setIsOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button
              onClick={() => {
                onConfirm(commentId);
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
