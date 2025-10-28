"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface Contact {
  id: number
  name: string
  accountName: string
  phone: string
  email: string
  contactOwnerAlias: string
}

interface EditContactModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contact: Contact | null
  onSave: (contact: Contact) => void
}

export default function EditContactModal({ open, onOpenChange, contact, onSave }: EditContactModalProps) {
  const [formData, setFormData] = useState({
    salutation: "Ms.",
    firstName: contact?.name.split(" ")[0] || "",
    lastName: contact?.name.split(" ").slice(1).join(" ") || "",
    accountName: contact?.accountName || "",
    title: "dgfdgdfg",
    reportsTo: "",
    description: "dfgfdgdfgdfg",
    phone: contact?.phone || "",
    email: contact?.email || "",
    mailingCountry: "Albania",
    mailingStreet: "B-302 Greenwoods CHS, Near WEH Metro Station, Andheri-Kurla Road, Andheri East,",
    mailingCity: "Mumbai",
    mailingZip: "400093",
    mailingState: "--None--",
  })

  const handleSave = () => {
    if (contact) {
      onSave({
        ...contact,
        name: `${formData.firstName} ${formData.lastName}`,
        accountName: formData.accountName,
        phone: formData.phone,
        email: formData.email,
      })
    }
    onOpenChange(false)
  }

  const handleSaveAndNew = () => {
    handleSave()
    // Logic to open a new contact form would go here
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0" showCloseButton={false}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <DialogTitle className="text-xl font-normal text-gray-800">Edit {contact?.name || "Contact"}</DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="w-8 h-8 rounded-full bg-white border-2 border-[#0176d3] flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <X className="w-5 h-5 text-[#0176d3]" />
          </button>
        </div>

        {/* Required Information Notice */}
        <div className="px-6 pt-4">
          <p className="text-sm text-gray-600 text-right">
            <span className="text-red-600">*</span> = Required Information
          </p>
        </div>

        {/* Form Content */}
        <div className="px-6 pb-6 space-y-6">
          {/* About Section */}
          <div>
            <h3 className="text-base font-normal bg-[#f3f2f2] px-4 py-2 mb-4">About</h3>
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="text-red-600">*</span> Name
                </label>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Salutation</label>
                    <select
                      value={formData.salutation}
                      onChange={(e) => setFormData({ ...formData, salutation: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-[#0176d3] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                    >
                      <option>Ms.</option>
                      <option>Mr.</option>
                      <option>Mrs.</option>
                      <option>Dr.</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      <span className="text-red-600">*</span> Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Account Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="text-red-600">*</span> Account Name
                </label>
                <div className="relative">
                  <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md">
                    <svg className="w-4 h-4 text-[#0176d3]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
                    </svg>
                    <input
                      type="text"
                      value={formData.accountName}
                      onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                      className="flex-1 outline-none"
                      required
                    />
                    <button className="text-gray-400 hover:text-gray-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                />
              </div>

              {/* Reports To */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reports To</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search Contacts..."
                    value={formData.reportsTo}
                    onChange={(e) => setFormData({ ...formData, reportsTo: e.target.value })}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                  />
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0176d3] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Contact Owner */}
          <div>
            <h3 className="text-base font-normal bg-[#f3f2f2] px-4 py-2 mb-4">Contact Owner</h3>
            <div className="flex items-center gap-2 px-4">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">RN</span>
              </div>
              <span className="text-sm text-gray-700">Rishab Nagwani</span>
            </div>
          </div>

          {/* Get in Touch Section */}
          <div>
            <h3 className="text-base font-normal bg-[#f3f2f2] px-4 py-2 mb-4">Get in Touch</h3>
            <div className="space-y-4">
              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                />
              </div>

              {/* Mailing Address */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Mailing Address</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Mailing Country</label>
                    <select
                      value={formData.mailingCountry}
                      onChange={(e) => setFormData({ ...formData, mailingCountry: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                    >
                      <option>Albania</option>
                      <option>India</option>
                      <option>United States</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Mailing Street</label>
                    <textarea
                      value={formData.mailingStreet}
                      onChange={(e) => setFormData({ ...formData, mailingStreet: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0176d3] resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Mailing City</label>
                    <input
                      type="text"
                      value={formData.mailingCity}
                      onChange={(e) => setFormData({ ...formData, mailingCity: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Mailing Zip/Postal Code</label>
                      <input
                        type="text"
                        value={formData.mailingZip}
                        onChange={(e) => setFormData({ ...formData, mailingZip: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Mailing State/Province</label>
                      <select
                        value={formData.mailingState}
                        onChange={(e) => setFormData({ ...formData, mailingState: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                      >
                        <option>--None--</option>
                        <option>Maharashtra</option>
                        <option>California</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* History Section */}
          <div>
            <h3 className="text-base font-normal bg-[#f3f2f2] px-4 py-2 mb-4">History</h3>
            <div className="space-y-3 px-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Created By</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">RN</span>
                  </div>
                  <span className="text-sm text-gray-700">Rishab Nagwani, 28/10/2025, 2:01 pm</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Last Modified By</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">RN</span>
                  </div>
                  <span className="text-sm text-gray-700">Rishab Nagwani, 28/10/2025, 2:01 pm</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="px-6 py-2 border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={handleSaveAndNew}
            className="px-6 py-2 border-2 border-[#0176d3] text-[#0176d3] hover:bg-blue-50 bg-transparent"
          >
            Save & New
          </Button>
          <Button onClick={handleSave} className="px-6 py-2 bg-[#0176d3] text-white hover:bg-[#0159a8]">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
