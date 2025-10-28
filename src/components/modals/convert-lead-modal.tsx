"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronRight, Search, User, X } from "lucide-react"

interface ConvertLeadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  leadData: {
    name: string
    firstName: string
    lastName: string
    salutation: string
    company: string
  }
}

export default function ConvertLeadModal({ open, onOpenChange, leadData }: ConvertLeadModalProps) {
  const [accountOption, setAccountOption] = useState<"new" | "existing">("new")
  const [contactOption, setContactOption] = useState<"new" | "existing">("new")
  const [opportunityOption, setOpportunityOption] = useState<"new" | "existing">("new")
  const [dontCreateOpportunity, setDontCreateOpportunity] = useState(false)

  const [accountName, setAccountName] = useState(leadData.company)
  const [contactName, setContactName] = useState(`${leadData.salutation} ${leadData.firstName} ${leadData.lastName}`)
  const [opportunityName, setOpportunityName] = useState(`${leadData.name}-`)
  const [convertedStatus, setConvertedStatus] = useState("Qualified")
  const [recordOwner, setRecordOwner] = useState("Rishab Nagwani")

  const [accountSearchQuery, setAccountSearchQuery] = useState("")
  const [contactSearchQuery, setContactSearchQuery] = useState("")

  const [isAccountExpanded, setIsAccountExpanded] = useState(true)
  const [isContactExpanded, setIsContactExpanded] = useState(true)
  const [isOpportunityExpanded, setIsOpportunityExpanded] = useState(true)

  const handleConvert = () => {
    // Handle lead conversion logic here
    console.log("[v0] Converting lead with:", {
      accountOption,
      accountName,
      contactOption,
      contactName,
      opportunityOption,
      opportunityName,
      dontCreateOpportunity,
      convertedStatus,
      recordOwner,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1300px] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-[#dddbda]">
          <DialogTitle className="text-2xl font-normal text-[#181818]">Convert Lead</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 space-y-4">
          {/* Account Section */}
          <Collapsible open={isAccountExpanded} onOpenChange={setIsAccountExpanded}>
            <div className="border-b border-[#dddbda] pb-4">
              <CollapsibleTrigger className="flex items-center gap-2 w-full text-left mb-4">
                <ChevronRight
                  className={`w-5 h-5 text-[#706e6b] transition-transform ${isAccountExpanded ? "rotate-90" : ""}`}
                />
                <h3 className="text-base font-semibold text-[#181818]">Account</h3>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="grid grid-cols-[1fr_auto_1fr] gap-6 items-start">
                  {/* Create New Account */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <RadioGroup
                        value={accountOption}
                        onValueChange={(value) => setAccountOption(value as "new" | "existing")}
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="new" id="account-new" />
                          <Label htmlFor="account-new" className="text-sm font-normal text-[#0176d3] cursor-pointer">
                            Create New Account
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {accountOption === "new" && (
                      <div className="space-y-2">
                        <Label htmlFor="account-name" className="text-sm text-[#181818]">
                          <span className="text-red-600">*</span> Account Name
                        </Label>
                        <Input
                          id="account-name"
                          value={accountName}
                          onChange={(e) => setAccountName(e.target.value)}
                          className="border-[#dddbda]"
                        />
                      </div>
                    )}
                  </div>

                  {/* OR Separator */}
                  <div className="flex items-center justify-center pt-8">
                    <span className="text-sm text-[#706e6b]">- OR -</span>
                  </div>

                  {/* Choose Existing Account */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <RadioGroup
                        value={accountOption}
                        onValueChange={(value) => setAccountOption(value as "new" | "existing")}
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="existing" id="account-existing" />
                          <Label
                            htmlFor="account-existing"
                            className="text-sm font-normal text-[#0176d3] cursor-pointer"
                          >
                            Choose Existing Account
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {accountOption === "existing" && (
                      <div className="space-y-2">
                        <Label htmlFor="account-search" className="text-sm text-[#181818]">
                          Account Search
                        </Label>
                        <div className="relative">
                          <Input
                            id="account-search"
                            placeholder="Search for matching accounts"
                            value={accountSearchQuery}
                            onChange={(e) => setAccountSearchQuery(e.target.value)}
                            className="border-[#dddbda] pr-10"
                          />
                          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#706e6b]" />
                        </div>
                        <div className="border border-[#dddbda] rounded p-4 min-h-[120px] bg-[#f3f2f2]">
                          <p className="text-sm text-[#706e6b]">0 Account Matches</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Contact Section */}
          <Collapsible open={isContactExpanded} onOpenChange={setIsContactExpanded}>
            <div className="border-b border-[#dddbda] pb-4">
              <CollapsibleTrigger className="flex items-center gap-2 w-full text-left mb-4">
                <ChevronRight
                  className={`w-5 h-5 text-[#706e6b] transition-transform ${isContactExpanded ? "rotate-90" : ""}`}
                />
                <h3 className="text-base font-semibold text-[#181818]">Contact</h3>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="grid grid-cols-[1fr_auto_1fr] gap-6 items-start">
                  {/* Create New Contact */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <RadioGroup
                        value={contactOption}
                        onValueChange={(value) => setContactOption(value as "new" | "existing")}
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="new" id="contact-new" />
                          <Label htmlFor="contact-new" className="text-sm font-normal text-[#0176d3] cursor-pointer">
                            Create New Contact
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {contactOption === "new" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-sm text-[#181818]">Salutation</Label>
                          <Select defaultValue={leadData.salutation}>
                            <SelectTrigger className="border-[#dddbda]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Mr.">Mr.</SelectItem>
                              <SelectItem value="Ms.">Ms.</SelectItem>
                              <SelectItem value="Mrs.">Mrs.</SelectItem>
                              <SelectItem value="Dr.">Dr.</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm text-[#181818]">First Name</Label>
                          <Input defaultValue={leadData.firstName} className="border-[#dddbda]" />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm text-[#181818]">
                            <span className="text-red-600">*</span> Last Name
                          </Label>
                          <Input defaultValue={leadData.lastName} className="border-[#dddbda]" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* OR Separator */}
                  <div className="flex items-center justify-center pt-8">
                    <span className="text-sm text-[#706e6b]">- OR -</span>
                  </div>

                  {/* Choose Existing Contact */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <RadioGroup
                        value={contactOption}
                        onValueChange={(value) => setContactOption(value as "new" | "existing")}
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="existing" id="contact-existing" />
                          <Label
                            htmlFor="contact-existing"
                            className="text-sm font-normal text-[#0176d3] cursor-pointer"
                          >
                            Choose Existing Contact
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {contactOption === "existing" && (
                      <div className="space-y-2">
                        <Label htmlFor="contact-search" className="text-sm text-[#181818]">
                          Contact Search
                        </Label>
                        <div className="relative">
                          <Input
                            id="contact-search"
                            placeholder="Search for matching contacts"
                            value={contactSearchQuery}
                            onChange={(e) => setContactSearchQuery(e.target.value)}
                            className="border-[#dddbda] pr-10"
                          />
                          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#706e6b]" />
                        </div>
                        <div className="border border-[#dddbda] rounded p-4 min-h-[120px] bg-[#f3f2f2]">
                          <p className="text-sm text-[#706e6b]">0 Contact Matches</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="update-lead-source" />
                          <Label htmlFor="update-lead-source" className="text-sm text-[#181818] cursor-pointer">
                            Update Lead Source
                          </Label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Opportunity Section */}
          <Collapsible open={isOpportunityExpanded} onOpenChange={setIsOpportunityExpanded}>
            <div className="border-b border-[#dddbda] pb-4">
              <CollapsibleTrigger className="flex items-center gap-2 w-full text-left mb-4">
                <ChevronRight
                  className={`w-5 h-5 text-[#706e6b] transition-transform ${isOpportunityExpanded ? "rotate-90" : ""}`}
                />
                <h3 className="text-base font-semibold text-[#181818]">Opportunity</h3>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="grid grid-cols-[1fr_auto_1fr] gap-6 items-start">
                  {/* Create New Opportunity */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <RadioGroup
                        value={opportunityOption}
                        onValueChange={(value) => setOpportunityOption(value as "new" | "existing")}
                        disabled={dontCreateOpportunity}
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="new" id="opportunity-new" disabled={dontCreateOpportunity} />
                          <Label
                            htmlFor="opportunity-new"
                            className={`text-sm font-normal cursor-pointer ${dontCreateOpportunity ? "text-[#706e6b]" : "text-[#0176d3]"}`}
                          >
                            Create New Opportunity
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {opportunityOption === "new" && !dontCreateOpportunity && (
                      <div className="space-y-2">
                        <Label htmlFor="opportunity-name" className="text-sm text-[#181818]">
                          <span className="text-red-600">*</span> Opportunity Name
                        </Label>
                        <Input
                          id="opportunity-name"
                          value={opportunityName}
                          onChange={(e) => setOpportunityName(e.target.value)}
                          className="border-[#dddbda]"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="dont-create-opportunity"
                        checked={dontCreateOpportunity}
                        onCheckedChange={(checked) => setDontCreateOpportunity(checked as boolean)}
                      />
                      <Label htmlFor="dont-create-opportunity" className="text-sm text-[#181818] cursor-pointer">
                        Don't create an opportunity upon conversion
                      </Label>
                    </div>
                  </div>

                  {/* OR Separator */}
                  <div className="flex items-center justify-center pt-8">
                    <span className="text-sm text-[#706e6b]">- OR -</span>
                  </div>

                  {/* Choose Existing Opportunity */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <RadioGroup
                        value={opportunityOption}
                        onValueChange={(value) => setOpportunityOption(value as "new" | "existing")}
                        disabled={dontCreateOpportunity}
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="existing" id="opportunity-existing" disabled={true} />
                          <Label
                            htmlFor="opportunity-existing"
                            className="text-sm font-normal text-[#706e6b] cursor-not-allowed"
                          >
                            Choose Existing Opportunity
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="border border-[#dddbda] rounded p-4 min-h-[120px] bg-[#f3f2f2]">
                      <p className="text-sm text-[#706e6b]">To find opportunity, choose an existing account</p>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Record Owner and Converted Status */}
          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="record-owner" className="text-sm text-[#181818]">
                <span className="text-red-600">*</span> Record Owner
              </Label>
              <div className="relative">
                <div className="flex items-center gap-2 border border-[#dddbda] rounded px-3 py-2">
                  <User className="w-4 h-4 text-[#0176d3]" />
                  <span className="text-sm text-[#181818]">{recordOwner}</span>
                  <button className="ml-auto">
                    <X className="w-4 h-4 text-[#706e6b]" />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="converted-status" className="text-sm text-[#181818]">
                <span className="text-red-600">*</span> Converted Status
              </Label>
              <Select value={convertedStatus} onValueChange={setConvertedStatus}>
                <SelectTrigger className="border-[#dddbda]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Qualified">Qualified</SelectItem>
                  <SelectItem value="Unqualified">Unqualified</SelectItem>
                  <SelectItem value="Contacted">Contacted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#dddbda]">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[#dddbda] text-[#0176d3] hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button onClick={handleConvert} className="bg-[#0176d3] text-white hover:bg-[#0159a8]">
            Convert
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
