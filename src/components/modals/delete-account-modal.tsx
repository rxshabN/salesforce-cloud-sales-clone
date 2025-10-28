"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface DeleteAccountModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  accountName: string
  onConfirm: () => void
}

export default function DeleteAccountModal({ open, onOpenChange, accountName, onConfirm }: DeleteAccountModalProps) {
  const handleDelete = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0" showCloseButton={false}>
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-normal text-gray-700">Delete Account</DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </DialogHeader>

        <div className="px-6 py-8">
          <p className="text-gray-700">Are you sure you want to delete this account?</p>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t bg-gray-50">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-[#0176d3] text-[#0176d3]">
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
