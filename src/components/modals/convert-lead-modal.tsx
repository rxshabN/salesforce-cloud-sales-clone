"use client";

import { useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";
import useDebounce from "@/hooks/use-debounce";
import { SearchResultList } from "../search-result-list";

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
  const router = useRouter();
  const [accountName, setAccountName] = useState(leadData.company);
  const [opportunityName, setOpportunityName] = useState(`${leadData.name}-`);
  const [convertedStatus, setConvertedStatus] = useState("Qualified");
  const [recordOwner, setRecordOwner] = useState("Rishab Nagwani");

  const [isAccountExpanded, setIsAccountExpanded] = useState(true);
  const [isContactExpanded, setIsContactExpanded] = useState(true);
  const [isOpportunityExpanded, setIsOpportunityExpanded] = useState(true);

  const [accountSearchQuery, setAccountSearchQuery] = useState("");
  const [contactSearchQuery, setContactSearchQuery] = useState("");
  const [opportunitySearchQuery, setOpportunitySearchQuery] = useState(""); // [NEW]

  // [NEW] Search Results States
  const [accountSearchResults, setAccountSearchResults] = useState<any[]>([]);
  const [isAccountLoading, setIsAccountLoading] = useState(false);
  const [contactSearchResults, setContactSearchResults] = useState<any[]>([]);
  const [isContactLoading, setIsContactLoading] = useState(false);
  const [opportunitySearchResults, setOpportunitySearchResults] = useState<
    any[]
  >([]);
  const [isOpportunityLoading, setIsOpportunityLoading] = useState(false);

  // [NEW] Debounced Search Values
  const debouncedAccountSearch = useDebounce(accountSearchQuery, 300);
  const debouncedContactSearch = useDebounce(contactSearchQuery, 300);
  const debouncedOpportunitySearch = useDebounce(opportunitySearchQuery, 300);

  // [NEW] Selected existing records
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    null
  );
  const [selectedContactId, setSelectedContactId] = useState<number | null>(
    null
  );
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<
    number | null
  >(null);

  // [NEW] Option Change Handlers (to reset search)
  const handleAccountOptionChange = (value: "new" | "existing") => {
    setAccountOption(value);
    setSelectedAccountId(null);
    setAccountSearchQuery(value === "new" ? leadData.company : ""); // Reset or set to default
    setAccountName(value === "new" ? leadData.company : ""); // Reset account name
    setAccountSearchResults([]);
    // If switching to 'new', also disable opportunity search
    if (value === "new") {
      handleOpportunityOptionChange("new");
    }
  };

  const handleContactOptionChange = (value: "new" | "existing") => {
    setContactOption(value);
    setSelectedContactId(null);
    setContactSearchQuery("");
    setContactSearchResults([]);
  };

  const handleOpportunityOptionChange = (value: "new" | "existing") => {
    setOpportunityOption(value);
    setSelectedOpportunityId(null);
    setOpportunitySearchQuery("");
    setOpportunitySearchResults([]);
  };

  // [NEW] Effect for Account Search
  useEffect(() => {
    if (debouncedAccountSearch && accountOption === "existing") {
      setIsAccountLoading(true);
      axios
        .get(
          `/api/v1/sobjects/accounts?name=${encodeURIComponent(
            debouncedAccountSearch
          )}`
        )
        .then((res) => {
          setAccountSearchResults(
            res.data.map((acc: any) => ({ id: acc.id, name: acc.name }))
          );
        })
        .catch((err) => console.error("Error searching accounts:", err))
        .finally(() => setIsAccountLoading(false));
    } else {
      setAccountSearchResults([]);
    }
  }, [debouncedAccountSearch, accountOption]);

  // [NEW] Effect for Contact Search
  useEffect(() => {
    if (debouncedContactSearch && contactOption === "existing") {
      setIsContactLoading(true);
      axios
        .get(
          `/api/v1/sobjects/contacts?search=${encodeURIComponent(
            debouncedContactSearch
          )}`
        )
        .then((res) => {
          setContactSearchResults(
            res.data.map((c: any) => ({
              id: c.id,
              name: `${c.first_name || ""} ${c.last_name || ""}`.trim(),
            }))
          );
        })
        .catch((err) => console.error("Error searching contacts:", err))
        .finally(() => setIsContactLoading(false));
    } else {
      setContactSearchResults([]);
    }
  }, [debouncedContactSearch, contactOption]);

  // [NEW] Effect for Opportunity Search (only if an account is selected)
  useEffect(() => {
    if (
      debouncedOpportunitySearch &&
      opportunityOption === "existing" &&
      selectedAccountId
    ) {
      setIsOpportunityLoading(true);
      axios
        .get(
          `/api/v1/sobjects/opportunities?search=${encodeURIComponent(
            debouncedOpportunitySearch
          )}`
        )
        .then((res) => {
          // Filter ops by selected account
          const accountOps = res.data.filter(
            (op: any) => op.account_id === selectedAccountId
          );
          setOpportunitySearchResults(
            accountOps.map((op: any) => ({ id: op.id, name: op.name }))
          );
        })
        .catch((err) => console.error("Error searching opportunities:", err))
        .finally(() => setIsOpportunityLoading(false));
    } else {
      setOpportunitySearchResults([]);
    }
  }, [debouncedOpportunitySearch, opportunityOption, selectedAccountId]);

  // [MODIFIED] handleConvert now sends the full payload
  const handleConvert = async () => {
    setIsConverting(true);

    // Validation
    if (accountOption === "new" && !accountName.trim()) {
      showToast("Account Name is required.", {
        label: "Dismiss",
        onClick: () => {},
      });
      setIsConverting(false);
      return;
    }
    if (accountOption === "existing" && !selectedAccountId) {
      showToast("Please select an existing account.", {
        label: "Dismiss",
        onClick: () => {},
      });
      setIsConverting(false);
      return;
    }
    if (
      opportunityOption === "new" &&
      !dontCreateOpportunity &&
      !opportunityName.trim()
    ) {
      showToast("Opportunity Name is required.", {
        label: "Dismiss",
        onClick: () => {},
      });
      setIsConverting(false);
      return;
    }

    try {
      const payload = {
        leadId: leadId,
        convertedStatus: convertedStatus, // This status is used by the backend to update the lead
        dontCreateOpportunity: dontCreateOpportunity,

        accountId: accountOption === "existing" ? selectedAccountId : null,
        newAccountName: accountOption === "new" ? accountName : null,

        contactId: contactOption === "existing" ? selectedContactId : null,

        opportunityId:
          opportunityOption === "existing" ? selectedOpportunityId : null,
        newOpportunityName:
          opportunityOption === "new" && !dontCreateOpportunity
            ? opportunityName
            : null,
      };

      const response = await axios.post(
        "/api/v1/actions/convert-lead",
        payload
      );

      if (response.status === 200) {
        showToast("Lead converted successfully.", {
          label: "View Records",
          onClick: () => {
            // After conversion, redirect to the new/existing Account page
            const newAccountId = response.data?.account?.id;
            if (newAccountId) {
              router.push(`/accounts/${newAccountId}`);
            } else {
              router.refresh();
            }
          },
        });
        onOpenChange(false);
        router.refresh(); // Refresh the page to update the leads list
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
                            handleAccountOptionChange(
                              value as "new" | "existing"
                            )
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
                            handleAccountOptionChange(
                              value as "new" | "existing"
                            )
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
                            disabled={accountOption !== "existing"}
                          />
                          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#706e6b]" />
                        </div>
                        <SearchResultList
                          isLoading={isAccountLoading}
                          results={accountSearchResults}
                          onSelect={(item) => {
                            setAccountSearchQuery(item.name);
                            setSelectedAccountId(item.id);
                            setAccountSearchResults([]);
                            if (opportunityOption === "new") {
                              setOpportunityName(`${item.name}-`);
                            }
                          }}
                          noResultsMessage={
                            accountSearchQuery
                              ? "0 Account Matches"
                              : "Type to search..."
                          }
                        />
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
                            handleContactOptionChange(
                              value as "new" | "existing"
                            )
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
                            <Select
                              defaultValue={leadData.salutation || "--None--"}
                            >
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
                              readOnly
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm text-[#181818]">
                              <span className="text-red-600">*</span> Last Name
                            </Label>
                            <Input
                              defaultValue={leadData.lastName}
                              className="border-[#000000]"
                              readOnly
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
                            handleContactOptionChange(
                              value as "new" | "existing"
                            )
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
                            disabled={contactOption !== "existing"}
                          />
                          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#706e6b]" />
                        </div>
                        <SearchResultList
                          isLoading={isContactLoading}
                          results={contactSearchResults}
                          onSelect={(item) => {
                            setContactSearchQuery(item.name);
                            setSelectedContactId(item.id);
                            setContactSearchResults([]);
                          }}
                          noResultsMessage={
                            contactSearchQuery
                              ? "0 Contact Matches"
                              : "Type to search..."
                          }
                        />
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
                            handleOpportunityOptionChange(
                              value as "new" | "existing"
                            )
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
                            handleOpportunityOptionChange(
                              value as "new" | "existing"
                            )
                          }
                          disabled={dontCreateOpportunity}
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem
                              value="existing"
                              id="opportunity-existing"
                              disabled={
                                dontCreateOpportunity ||
                                accountOption === "new" ||
                                !selectedAccountId
                              }
                            />
                            <Label
                              htmlFor="opportunity-existing"
                              className={`text-sm font-normal ${
                                dontCreateOpportunity ||
                                accountOption === "new" ||
                                !selectedAccountId
                                  ? "text-[#706e6b] cursor-not-allowed"
                                  : "text-[#0176d3] cursor-pointer"
                              }`}
                            >
                              Choose Existing Opportunity
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="opportunity-search"
                          className="text-sm text-[#181818]"
                        >
                          Opportunity Search
                        </Label>
                        <div className="relative">
                          <Input
                            id="opportunity-search"
                            placeholder="Search Opportunities..."
                            value={opportunitySearchQuery}
                            onChange={(e) =>
                              setOpportunitySearchQuery(e.target.value)
                            }
                            className="border-[#000000] pr-10"
                            disabled={
                              opportunityOption !== "existing" ||
                              accountOption === "new" ||
                              !selectedAccountId
                            }
                          />
                          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#706e6b]" />
                        </div>
                        <SearchResultList
                          isLoading={isOpportunityLoading}
                          results={opportunitySearchResults}
                          onSelect={(item) => {
                            setOpportunitySearchQuery(item.name);
                            setSelectedOpportunityId(item.id);
                            setOpportunitySearchResults([]);
                          }}
                          noResultsMessage={
                            accountOption === "new" || !selectedAccountId
                              ? "To find opportunity, choose an existing account"
                              : opportunitySearchQuery
                              ? "0 Opportunity Matches"
                              : "Type to search..."
                          }
                        />
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
                    {/* Add other valid *final* lead statuses here if needed */}
                    <SelectItem value="Converted">Converted</SelectItem>
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
            className="bg-white text-[#066afe] hover:bg-gray-50 border border-black h-9 px-4 text-sm rounded-3xl"
            disabled={isConverting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConvert}
            className="bg-[#066afe] text-white hover:bg-[#066afe] h-9 px-4 text-sm rounded-3xl"
            disabled={isConverting}
          >
            {isConverting ? "Converting..." : "Convert"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
