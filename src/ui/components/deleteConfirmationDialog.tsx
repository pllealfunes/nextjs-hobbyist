"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/ui/components/dialog";
import { Button } from "@/ui/components/button";
import { useState } from "react";

type DeleteConfirmationDialogProps = {
  onConfirm: () => Promise<void>;
  trigger: React.ReactNode;
};

export default function DeleteConfirmationDialog({
  onConfirm,
  trigger,
}: DeleteConfirmationDialogProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await onConfirm(); // expects deletePost() that returns a promise
      setOpen(false); // close modal only after success
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-slate-900">Delete Post</DialogTitle>
          <DialogDescription className="text-slate-700">
            Are you sure you want to delete this post? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild disabled={loading}>
            <Button variant="secondary" disabled={loading}>
              No
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Yes, Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
