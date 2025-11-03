//todo implement account, contact and opportunity search functionality along with selection and live results in the divs below the search inputs for the account, contact and opportunity sections

"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight, Search, X } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { useToast } from "@/components/toast-provider";

interface ConvertLeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: number;
  leadData: {
    name: string;
    firstName: string;
    lastName: string;
    salutation: string;
    company: string;
  };
}

export default function ConvertLeadModal({
  open,
  onOpenChange,
  leadId,
  leadData,
}: ConvertLeadModalProps) {
  const { showToast } = useToast();
  const [isConverting, setIsConverting] = useState(false);

  const [accountOption, setAccountOption] = useState<"new" | "existing">("new");
  const [contactOption, setContactOption] = useState<"new" | "existing">("new");
  const [opportunityOption, setOpportunityOption] = useState<
    "new" | "existing"
  >("new");
  const [dontCreateOpportunity, setDontCreateOpportunity] = useState(false);

  const [accountName, setAccountName] = useState(leadData.company);
  const [contactName, setContactName] = useState(
    `${leadData.salutation} ${leadData.firstName} ${leadData.lastName}`
  );
  const [opportunityName, setOpportunityName] = useState(`${leadData.name}-`);
  const [convertedStatus, setConvertedStatus] = useState("Qualified");
  const [recordOwner, setRecordOwner] = useState("Rishab Nagwani");

  const [accountSearchQuery, setAccountSearchQuery] = useState("");
  const [contactSearchQuery, setContactSearchQuery] = useState("");

  const [isAccountExpanded, setIsAccountExpanded] = useState(true);
  const [isContactExpanded, setIsContactExpanded] = useState(true);
  const [isOpportunityExpanded, setIsOpportunityExpanded] = useState(true);

  const handleConvert = async () => {
    setIsConverting(true);
    try {
      const response = await axios.post("/api/v1/actions/convert-lead", {
        leadId: leadId,
      });

      if (response.status === 200) {
        showToast("Lead converted successfully.", {
          label: "View Records",
          onClick: () => {},
        });
        onOpenChange(false);
      }
    } catch (error: any) {
      console.error("Error converting lead:", error);
      const message =
        error.response?.data?.message || "Failed to convert lead.";
      showToast(message, {
        label: "Dismiss",
        onClick: () => {},
      });
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="min-w-4xl max-h-[90vh] flex flex-col p-0 rounded-t-3xl rounded-b-none"
        showCloseButton={false}
      >
        {/* Custom Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white border-2 border-[#0176d3] flex items-center justify-center hover:bg-gray-50 transition-colors z-20"
        >
          <X className="w-5 h-5 text-[#0176d3]" />
        </button>

        <div className="overflow-y-auto">
          <DialogHeader className="px-6 py-4 border-b-2 border-gray-300">
            <DialogTitle className="text-xl font-normal text-[#181818] flex-1 text-center">
              Convert Lead
            </DialogTitle>
          </DialogHeader>

          {/* Required Info text */}
          <div className="px-6 text-right">
            <p className="text-xs text-[#000000]">
              <span className="text-red-500">*</span> = Required Information
            </p>
          </div>

          <div className="px-0.5 py-4 space-y-4">
            {/* Account Section */}
            <Collapsible
              open={isAccountExpanded}
              onOpenChange={setIsAccountExpanded}
              className="bg-[#f2f2f2] p-4"
            >
              <div className="pb-4">
                <CollapsibleTrigger className="flex items-center gap-2 w-full text-left mb-4">
                  <ChevronRight
                    className={`w-5 h-5 text-[#706e6b] transition-transform ${
                      isAccountExpanded ? "rotate-90" : ""
                    }`}
                  />
                  <h3 className="text-xl font-normal text-gray-800">Account</h3>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="grid grid-cols-[1fr_auto_1fr] gap-6 items-start">
                    {/* Create New Account */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <RadioGroup
                          value={accountOption}
                          onValueChange={(value) =>
                            setAccountOption(value as "new" | "existing")
                          }
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="new" id="account-new" />
                            <Label
                              htmlFor="account-new"
                              className="text-sm font-normal text-[#0176d3] cursor-pointer"
                            >
                              Create New Account
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {accountOption === "new" && (
                        <div className="space-y-2">
                          <Label
                            htmlFor="account-name"
                            className="text-sm text-[#181818]"
                          >
                            <span className="text-red-600">*</span> Account Name
                          </Label>
                          <Input
                            id="account-name"
                            value={accountName}
                            onChange={(e) => setAccountName(e.target.value)}
                            className="border-[#000000]"
                          />
                        </div>
                      )}
                    </div>

                    {/* OR Separator */}
                    <div className="flex items-center justify-center pt-8">
                      <span className="text-sm font-semibold text-[#706e6b]">
                        - OR -
                      </span>
                    </div>

                    {/* Choose Existing Account */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <RadioGroup
                          value={accountOption}
                          onValueChange={(value) =>
                            setAccountOption(value as "new" | "existing")
                          }
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem
                              value="existing"
                              id="account-existing"
                            />
                            <Label
                              htmlFor="account-existing"
                              className="text-sm font-normal text-[#0176d3] cursor-pointer"
                            >
                              Choose Existing Account
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="account-search"
                          className="text-sm text-[#181818]"
                        >
                          Account Search
                        </Label>
                        <div className="relative">
                          <Input
                            id="account-search"
                            placeholder="Search for matching accounts"
                            value={accountSearchQuery}
                            onChange={(e) =>
                              setAccountSearchQuery(e.target.value)
                            }
                            className="border-[#000000] pr-10"
                          />
                          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#706e6b]" />
                        </div>
                        <div className="border border-[#000000] rounded p-4 min-h-[120px] bg-[#f3f2f2]">
                          <p className="text-sm text-[#706e6b]">
                            0 Account Matches
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
            <hr className="border-b border-gray-400 w-full" />
            {/* Contact Section */}
            <Collapsible
              open={isContactExpanded}
              onOpenChange={setIsContactExpanded}
              className="bg-[#f2f2f2] p-4"
            >
              <div className="pb-4">
                <CollapsibleTrigger className="flex items-center gap-2 w-full text-left mb-4">
                  <ChevronRight
                    className={`w-5 h-5 text-[#706e6b] transition-transform ${
                      isContactExpanded ? "rotate-90" : ""
                    }`}
                  />
                  <h3 className="text-xl font-normal text-gray-800">Contact</h3>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="grid grid-cols-[1fr_auto_1fr] gap-6 items-start">
                    {/* Create New Contact */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <RadioGroup
                          value={contactOption}
                          onValueChange={(value) =>
                            setContactOption(value as "new" | "existing")
                          }
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="new" id="contact-new" />
                            <Label
                              htmlFor="contact-new"
                              className="text-sm font-normal text-[#0176d3] cursor-pointer"
                            >
                              Create New Contact
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {contactOption === "new" && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-sm text-[#181818]">
                              Salutation
                            </Label>
                            <Select defaultValue={leadData.salutation}>
                              <SelectTrigger className="border-[#000000] w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="--None--">
                                  --None--
                                </SelectItem>
                                <SelectItem value="Mr.">Mr.</SelectItem>
                                <SelectItem value="Ms.">Ms.</SelectItem>
                                <SelectItem value="Mrs.">Mrs.</SelectItem>
                                <SelectItem value="Dr.">Dr.</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm text-[#181818]">
                              First Name
                            </Label>
                            <Input
                              defaultValue={leadData.firstName}
                              className="border-[#000000]"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm text-[#181818]">
                              <span className="text-red-600">*</span> Last Name
                            </Label>
                            <Input
                              defaultValue={leadData.lastName}
                              className="border-[#000000]"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* OR Separator */}
                    <div className="flex items-center justify-center pt-8">
                      <span className="text-sm font-semibold text-[#706e6b]">
                        - OR -
                      </span>
                    </div>

                    {/* Choose Existing Contact */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <RadioGroup
                          value={contactOption}
                          onValueChange={(value) =>
                            setContactOption(value as "new" | "existing")
                          }
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem
                              value="existing"
                              id="contact-existing"
                            />
                            <Label
                              htmlFor="contact-existing"
                              className="text-sm font-normal text-[#0176d3] cursor-pointer"
                            >
                              Choose Existing Contact
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="contact-search"
                          className="text-sm text-[#181818]"
                        >
                          Contact Search
                        </Label>
                        <div className="relative">
                          <Input
                            id="contact-search"
                            placeholder="Search for matching contacts"
                            value={contactSearchQuery}
                            onChange={(e) =>
                              setContactSearchQuery(e.target.value)
                            }
                            className="border-[#000000] pr-10"
                          />
                          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#706e6b]" />
                        </div>
                        <div className="border border-[#000000] rounded p-4 min-h-[120px] bg-[#f3f2f2]">
                          <p className="text-sm text-[#706e6b]">
                            0 Contact Matches
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="update-lead-source" />
                          <Label
                            htmlFor="update-lead-source"
                            className="text-sm text-[#181818] cursor-pointer"
                          >
                            Update Lead Source
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
            <hr className="border-b border-gray-400 w-full" />

            {/* Opportunity Section */}
            <Collapsible
              open={isOpportunityExpanded}
              onOpenChange={setIsOpportunityExpanded}
              className="bg-[#f2f2f2] p-4"
            >
              <div className="pb-4">
                <CollapsibleTrigger className="flex items-center gap-2 w-full text-left mb-4">
                  <ChevronRight
                    className={`w-5 h-5 text-[#706e6b] transition-transform ${
                      isOpportunityExpanded ? "rotate-90" : ""
                    }`}
                  />
                  <h3 className="text-xl font-normal text-gray-800">
                    Opportunity
                  </h3>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="grid grid-cols-[1fr_auto_1fr] gap-6 items-start">
                    {/* Create New Opportunity */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <RadioGroup
                          value={opportunityOption}
                          onValueChange={(value) =>
                            setOpportunityOption(value as "new" | "existing")
                          }
                          disabled={dontCreateOpportunity}
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem
                              value="new"
                              id="opportunity-new"
                              disabled={dontCreateOpportunity}
                            />
                            <Label
                              htmlFor="opportunity-new"
                              className={`text-sm font-normal cursor-pointer ${
                                dontCreateOpportunity
                                  ? "text-[#706e6b]"
                                  : "text-[#0176d3]"
                              }`}
                            >
                              Create New Opportunity
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {opportunityOption === "new" &&
                        !dontCreateOpportunity && (
                          <div className="space-y-2">
                            <Label
                              htmlFor="opportunity-name"
                              className="text-sm text-[#181818]"
                            >
                              <span className="text-red-600">*</span>{" "}
                              Opportunity Name
                            </Label>
                            <Input
                              id="opportunity-name"
                              value={opportunityName}
                              onChange={(e) =>
                                setOpportunityName(e.target.value)
                              }
                              className="border-[#000000]"
                            />
                          </div>
                        )}

                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="dont-create-opportunity"
                          checked={dontCreateOpportunity}
                          onCheckedChange={(checked) =>
                            setDontCreateOpportunity(checked as boolean)
                          }
                        />
                        <Label
                          htmlFor="dont-create-opportunity"
                          className="text-sm text-[#181818] cursor-pointer"
                        >
                          Don&apos;t create an opportunity upon conversion
                        </Label>
                      </div>
                    </div>

                    {/* OR Separator */}
                    <div className="flex items-center justify-center pt-8">
                      <span className="text-sm font-semibold text-[#706e6b]">
                        - OR -
                      </span>
                    </div>

                    {/* Choose Existing Opportunity */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <RadioGroup
                          value={opportunityOption}
                          onValueChange={(value) =>
                            setOpportunityOption(value as "new" | "existing")
                          }
                          disabled={dontCreateOpportunity}
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem
                              value="existing"
                              id="opportunity-existing"
                              disabled={true}
                            />
                            <Label
                              htmlFor="opportunity-existing"
                              className="text-sm font-normal text-[#706e6b] cursor-not-allowed"
                            >
                              Choose Existing Opportunity
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="border border-[#000000] rounded p-4 min-h-[120px] bg-[#f3f2f2]">
                        <p className="text-sm text-[#706e6b]">
                          To find opportunity, choose an existing account
                        </p>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
            <hr className="border-b border-gray-400 w-full" />

            {/* Record Owner and Converted Status */}
            <div className="grid grid-cols-2 gap-6 pt-4 px-4">
              <div className="space-y-2">
                <Label
                  htmlFor="record-owner"
                  className="text-sm text-[#181818]"
                >
                  <span className="text-red-600">*</span> Record Owner
                </Label>
                <div className="flex items-center gap-2 border border-[#000000] rounded px-3 py-2">
                  <Image src="/owner-icon.png" alt="" width={20} height={20} />
                  <span className="text-sm text-[#181818]">{recordOwner}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="converted-status"
                  className="text-sm text-[#181818]"
                >
                  <span className="text-red-600">*</span> Converted Status
                </Label>
                <Select
                  value={convertedStatus}
                  onValueChange={setConvertedStatus}
                >
                  <SelectTrigger className="border-[#000000] w-full">
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
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-400">
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-white text-[#066afe] hover:bg-gray-50 border border-black h-9 px-4 text-sm rounded-4xl"
            disabled={isConverting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConvert}
            className="bg-[#066afe] text-white hover:bg-[#066afe] h-9 px-4 text-sm rounded-4xl"
            disabled={isConverting}
          >
            {isConverting ? "Converting..." : "Convert"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
