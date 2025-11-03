"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface DeleteContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactName: string;
  onConfirm: () => void;
}

export default function DeleteContactModal({
  open,
  onOpenChange,
  onConfirm,
}: DeleteContactModalProps) {
  const handleDelete = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="min-w-2xl p-0 h-44 rounded-3xl"
        showCloseButton={false}
      >
        {/* Header */}
        <div className="border-b border-gray-400 px-6 flex items-center justify-between">
          <DialogTitle className="text-2xl font-normal text-gray-800 mx-auto">
            Delete Contact
          </DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="w-8 h-8 rounded-full bg-white border-2 border-[#0176d3] flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <X className="w-5 h-5 text-[#0176d3]" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pl-4">
          <p className="text-center text-xs text-gray-700 -mb-7">
            Are you sure you want to delete this contact?
          </p>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-400 px-6 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="px-4 py-1 border-2 border-black text-[#066afe] hover:bg-gray-50 hover:shadow-sm hover:shadow-black hover:-translate-y-0.5 duration-300 rounded-4xl"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            className="px-4 py-1 bg-[#066afe] text-white hover:bg-[#066afe] hover:shadow-sm hover:shadow-black hover:-translate-y-0.5 duration-300 rounded-4xl"
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
