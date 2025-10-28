"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface DeleteOpportunityModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export default function DeleteOpportunityModal({ open, onOpenChange, onConfirm }: DeleteOpportunityModalProps) {
  const handleDelete = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0" showCloseButton={false}>
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-full p-2 hover:bg-gray-100 transition-colors z-10"
        >
          <X className="h-5 w-5 text-[#0176d3]" />
        </button>

        <DialogHeader className="px-6 py-6 border-b">
          <DialogTitle className="text-xl font-normal text-center text-gray-700">Delete Opportunity</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-8">
          <p className="text-center text-gray-600">Are you sure you want to delete this opportunity?</p>
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[#0176d3] text-[#0176d3] hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button onClick={handleDelete} className="bg-[#0176d3] hover:bg-[#0159a8] text-white">
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
