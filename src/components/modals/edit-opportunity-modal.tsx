"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Calendar, Building2 } from "lucide-react"

interface Opportunity {
  id: number
  opportunityName: string
  accountName: string
  stage: string
  closeDate: string
  opportunityOwnerAlias: string
  amount?: string
  description?: string
  probability?: string
  forecastCategory?: string
  nextStep?: string
}

interface EditOpportunityModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  opportunity: Opportunity | null
  onSave: (opportunity: Opportunity) => void
}

export default function EditOpportunityModal({ open, onOpenChange, opportunity, onSave }: EditOpportunityModalProps) {
  const [formData, setFormData] = useState<Opportunity>(
    opportunity || {
      id: 0,
      opportunityName: "",
      accountName: "",
      stage: "",
      closeDate: "",
      opportunityOwnerAlias: "",
      amount: "",
      description: "",
      probability: "",
      forecastCategory: "",
      nextStep: "",
    },
  )

  // Update form data when opportunity prop changes
  useState(() => {
    if (opportunity) {
      setFormData(opportunity)
    }
  })

  const handleSave = () => {
    onSave(formData)
    onOpenChange(false)
  }

  const handleSaveAndNew = () => {
    onSave(formData)
    // Reset form for new entry
    setFormData({
      id: 0,
      opportunityName: "",
      accountName: "",
      stage: "",
      closeDate: "",
      opportunityOwnerAlias: "",
      amount: "",
      description: "",
      probability: "",
      forecastCategory: "",
      nextStep: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0" showCloseButton={false}>
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-full p-2 hover:bg-gray-100 transition-colors z-10"
        >
          <X className="h-5 w-5 text-[#0176d3]" />
        </button>

        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl font-normal text-center text-gray-700">
            Edit {opportunity?.opportunityName}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4">
          <div className="flex justify-end mb-4">
            <span className="text-sm text-gray-600">
              <span className="text-red-600">*</span> = Required Information
            </span>
          </div>

          {/* About Section */}
          <div className="mb-6">
            <div className="bg-[#f3f2f2] px-4 py-2 mb-4">
              <h3 className="text-base font-normal text-gray-700">About</h3>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-normal text-gray-700">
                  <span className="text-red-600">*</span> Opportunity Name
                </Label>
                <Input
                  value={formData.opportunityName}
                  onChange={(e) => setFormData({ ...formData, opportunityName: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-normal text-gray-700">
                  <span className="text-red-600">*</span> Account Name
                </Label>
                <div className="relative mt-1">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0176d3]" />
                  <Input
                    value={formData.accountName}
                    onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                    className="pl-10 pr-10"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>

              <div>
                <Label className="text-sm font-normal text-gray-700">
                  <span className="text-red-600">*</span> Close Date
                </Label>
                <div className="relative mt-1">
                  <Input
                    type="text"
                    value={formData.closeDate}
                    onChange={(e) => setFormData({ ...formData, closeDate: e.target.value })}
                    placeholder="DD/MM/YYYY"
                    className="pr-10"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0176d3]" />
                </div>
              </div>

              <div>
                <Label className="text-sm font-normal text-gray-700">Amount</Label>
                <Input
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="$0.00"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-normal text-gray-700">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 min-h-[80px]"
                />
              </div>
            </div>
          </div>

          {/* Opportunity Owner Section */}
          <div className="mb-6">
            <Label className="text-sm font-normal text-gray-700 mb-2 block">Opportunity Owner</Label>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-sm text-gray-600">RN</span>
              </div>
              <span className="text-sm text-gray-700">Rishab Nagwani</span>
            </div>
          </div>

          {/* Status Section */}
          <div className="mb-6">
            <div className="bg-[#f3f2f2] px-4 py-2 mb-4">
              <h3 className="text-base font-normal text-gray-700">Status</h3>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-normal text-gray-700">
                  <span className="text-red-600">*</span> Stage
                </Label>
                <Select value={formData.stage} onValueChange={(value) => setFormData({ ...formData, stage: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Prospecting">Prospecting</SelectItem>
                    <SelectItem value="Qualification">Qualification</SelectItem>
                    <SelectItem value="Needs Analysis">Needs Analysis</SelectItem>
                    <SelectItem value="Value Proposition">Value Proposition</SelectItem>
                    <SelectItem value="Propose">Propose</SelectItem>
                    <SelectItem value="Negotiation">Negotiation</SelectItem>
                    <SelectItem value="Closed Won">Closed Won</SelectItem>
                    <SelectItem value="Closed Lost">Closed Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-normal text-gray-700">Probability (%)</Label>
                <Input
                  value={formData.probability}
                  onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
                  placeholder="0%"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-normal text-gray-700">
                  <span className="text-red-600">*</span> Forecast Category
                </Label>
                <Select
                  value={formData.forecastCategory}
                  onValueChange={(value) => setFormData({ ...formData, forecastCategory: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pipeline">Pipeline</SelectItem>
                    <SelectItem value="Best Case">Best Case</SelectItem>
                    <SelectItem value="Commit">Commit</SelectItem>
                    <SelectItem value="Omitted">Omitted</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-normal text-gray-700">Next Step</Label>
                <Input
                  value={formData.nextStep}
                  onChange={(e) => setFormData({ ...formData, nextStep: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* History Section */}
          <div className="mb-6">
            <div className="bg-[#f3f2f2] px-4 py-2 mb-4">
              <h3 className="text-base font-normal text-gray-700">History</h3>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-normal text-gray-700 mb-2 block">Created By</Label>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-sm text-gray-600">RN</span>
                  </div>
                  <span className="text-sm text-gray-700">Rishab Nagwani, 28/10/2025, 2:03 pm</span>
                </div>
              </div>

              <div>
                <Label className="text-sm font-normal text-gray-700 mb-2 block">Last Modified By</Label>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-sm text-gray-600">RN</span>
                  </div>
                  <span className="text-sm text-gray-700">Rishab Nagwani, 28/10/2025, 2:03 pm</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t bg-white sticky bottom-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[#0176d3] text-[#0176d3] hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={handleSaveAndNew}
            className="border-[#0176d3] text-[#0176d3] hover:bg-gray-50 bg-transparent"
          >
            Save & New
          </Button>
          <Button onClick={handleSave} className="bg-[#0176d3] hover:bg-[#0159a8] text-white">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
