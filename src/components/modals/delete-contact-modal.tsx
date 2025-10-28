"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface DeleteContactModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contactName: string
  onConfirm: () => void
}

export default function DeleteContactModal({ open, onOpenChange, contactName, onConfirm }: DeleteContactModalProps) {
  const handleDelete = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0" showCloseButton={false}>
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <DialogTitle className="text-xl font-normal text-gray-800">Delete Contact</DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="w-8 h-8 rounded-full bg-white border-2 border-[#0176d3] flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <X className="w-5 h-5 text-[#0176d3]" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          <p className="text-center text-gray-700">Are you sure you want to delete this contact?</p>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="px-6 py-2 border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button onClick={handleDelete} className="px-6 py-2 bg-[#0176d3] text-white hover:bg-[#0159a8]">
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
