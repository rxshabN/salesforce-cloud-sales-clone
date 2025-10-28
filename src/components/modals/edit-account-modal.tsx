"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"

interface Account {
  id: number
  accountName: string
  phone: string
  accountOwnerAlias: string
  website?: string
  type?: string
  description?: string
  parentAccount?: string
  billingCountry?: string
  billingStreet?: string
  billingCity?: string
  billingZip?: string
  billingState?: string
  shippingCountry?: string
  shippingStreet?: string
  shippingCity?: string
  shippingZip?: string
  shippingState?: string
}

interface EditAccountModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  account: Account | null
  onSave: (account: Account) => void
}

export default function EditAccountModal({ open, onOpenChange, account, onSave }: EditAccountModalProps) {
  const [formData, setFormData] = useState<Account>(
    account || {
      id: 0,
      accountName: "",
      phone: "",
      accountOwnerAlias: "RNagw",
    },
  )

  const handleSave = () => {
    onSave(formData)
    onOpenChange(false)
  }

  const handleSaveAndNew = () => {
    onSave(formData)
    // Reset form for new account
    setFormData({
      id: 0,
      accountName: "",
      phone: "",
      accountOwnerAlias: "RNagw",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0" showCloseButton={false}>
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-normal text-gray-700">
              Edit {account?.accountName || "Account"}
            </DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </DialogHeader>

        <div className="px-6 py-4">
          <div className="text-right text-sm text-gray-600 mb-4">
            <span className="text-red-600">*</span> = Required Information
          </div>

          {/* About Section */}
          <div className="mb-6">
            <div className="bg-gray-100 px-4 py-2 mb-4">
              <h3 className="text-sm font-medium text-gray-700">About</h3>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="accountName" className="text-sm font-medium text-gray-700">
                  <span className="text-red-600">*</span> Account Name
                </Label>
                <Input
                  id="accountName"
                  value={formData.accountName}
                  onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="website" className="text-sm font-medium text-gray-700">
                  Website
                </Label>
                <Input
                  id="website"
                  value={formData.website || ""}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="type" className="text-sm font-medium text-gray-700">
                  Type
                </Label>
                <Select
                  value={formData.type || "Analyst"}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Analyst">Analyst</SelectItem>
                    <SelectItem value="Competitor">Competitor</SelectItem>
                    <SelectItem value="Customer">Customer</SelectItem>
                    <SelectItem value="Integrator">Integrator</SelectItem>
                    <SelectItem value="Investor">Investor</SelectItem>
                    <SelectItem value="Partner">Partner</SelectItem>
                    <SelectItem value="Press">Press</SelectItem>
                    <SelectItem value="Prospect">Prospect</SelectItem>
                    <SelectItem value="Reseller">Reseller</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 min-h-[80px]"
                />
              </div>

              <div>
                <Label htmlFor="parentAccount" className="text-sm font-medium text-gray-700">
                  Parent Account
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="parentAccount"
                    placeholder="Search Accounts..."
                    value={formData.parentAccount || ""}
                    onChange={(e) => setFormData({ ...formData, parentAccount: e.target.value })}
                    className="pr-10"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Account Owner Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium text-gray-700">Account Owner</Label>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">RN</span>
              </div>
              <span className="text-sm text-gray-700">Rishab Nagwani</span>
            </div>
          </div>

          {/* Get in Touch Section */}
          <div className="mb-6">
            <div className="bg-gray-100 px-4 py-2 mb-4">
              <h3 className="text-sm font-medium text-gray-700">Get in Touch</h3>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1"
                />
              </div>

              {/* Billing Address */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Billing Address</h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="billingCountry" className="text-sm font-medium text-gray-700">
                      Billing Country
                    </Label>
                    <Select
                      value={formData.billingCountry || "Afghanistan"}
                      onValueChange={(value) => setFormData({ ...formData, billingCountry: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Afghanistan">Afghanistan</SelectItem>
                        <SelectItem value="Albania">Albania</SelectItem>
                        <SelectItem value="India">India</SelectItem>
                        <SelectItem value="United States">United States</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="billingStreet" className="text-sm font-medium text-gray-700">
                      Billing Street
                    </Label>
                    <Textarea
                      id="billingStreet"
                      value={formData.billingStreet || ""}
                      onChange={(e) => setFormData({ ...formData, billingStreet: e.target.value })}
                      className="mt-1 min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="billingCity" className="text-sm font-medium text-gray-700">
                      Billing City
                    </Label>
                    <Input
                      id="billingCity"
                      value={formData.billingCity || ""}
                      onChange={(e) => setFormData({ ...formData, billingCity: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="billingZip" className="text-sm font-medium text-gray-700">
                        Billing Zip/Postal Code
                      </Label>
                      <Input
                        id="billingZip"
                        value={formData.billingZip || ""}
                        onChange={(e) => setFormData({ ...formData, billingZip: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="billingState" className="text-sm font-medium text-gray-700">
                        Billing State/Province
                      </Label>
                      <Select
                        value={formData.billingState || "--None--"}
                        onValueChange={(value) => setFormData({ ...formData, billingState: value })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="--None--">--None--</SelectItem>
                          <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                          <SelectItem value="California">California</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Shipping Address</h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="shippingCountry" className="text-sm font-medium text-gray-700">
                      Shipping Country
                    </Label>
                    <Select
                      value={formData.shippingCountry || "Aland Islands"}
                      onValueChange={(value) => setFormData({ ...formData, shippingCountry: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aland Islands">Aland Islands</SelectItem>
                        <SelectItem value="Afghanistan">Afghanistan</SelectItem>
                        <SelectItem value="Albania">Albania</SelectItem>
                        <SelectItem value="India">India</SelectItem>
                        <SelectItem value="United States">United States</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="shippingStreet" className="text-sm font-medium text-gray-700">
                      Shipping Street
                    </Label>
                    <Textarea
                      id="shippingStreet"
                      value={formData.shippingStreet || ""}
                      onChange={(e) => setFormData({ ...formData, shippingStreet: e.target.value })}
                      className="mt-1 min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="shippingCity" className="text-sm font-medium text-gray-700">
                      Shipping City
                    </Label>
                    <Input
                      id="shippingCity"
                      value={formData.shippingCity || ""}
                      onChange={(e) => setFormData({ ...formData, shippingCity: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="shippingZip" className="text-sm font-medium text-gray-700">
                        Shipping Zip/Postal Code
                      </Label>
                      <Input
                        id="shippingZip"
                        value={formData.shippingZip || ""}
                        onChange={(e) => setFormData({ ...formData, shippingZip: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="shippingState" className="text-sm font-medium text-gray-700">
                        Shipping State/Province
                      </Label>
                      <Select
                        value={formData.shippingState || "--None--"}
                        onValueChange={(value) => setFormData({ ...formData, shippingState: value })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="--None--">--None--</SelectItem>
                          <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                          <SelectItem value="California">California</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* History Section */}
          <div className="mb-6">
            <div className="bg-gray-100 px-4 py-2 mb-4">
              <h3 className="text-sm font-medium text-gray-700">History</h3>
            </div>

            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-gray-700">Created By</Label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">RN</span>
                  </div>
                  <span className="text-sm text-gray-700">Rishab Nagwani, 28/10/2025, 2:01 pm</span>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Last Modified By</Label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">RN</span>
                  </div>
                  <span className="text-sm text-gray-700">Rishab Nagwani, 28/10/2025, 2:01 pm</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t bg-gray-50">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-[#0176d3] text-[#0176d3]">
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={handleSaveAndNew}
            className="border-[#0176d3] text-[#0176d3] bg-transparent"
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
