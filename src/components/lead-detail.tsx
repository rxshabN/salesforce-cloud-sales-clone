"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  ChevronDown,
  Pencil,
  Mail,
  Calendar,
  Phone,
  Plus,
  User,
  Check,
  Settings,
  Edit,
} from "lucide-react";
import ConvertLeadModal from "@/components/modals/convert-lead-modal";
import { useToast } from "@/components/toast-provider";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ButtonGroup } from "./ui/button-group";

interface LeadDetailProps {
  leadId: number;
}

type SalesTab =
  | "leads"
  | "contacts"
  | "accounts"
  | "opportunities"
  | "products"
  | "price-books"
  | "calendar"
  | "analytics";

export default function LeadDetail({ leadId }: LeadDetailProps) {
  const [activeTab, setActiveTab] = useState<SalesTab>("leads");
  const tabs = [
    { id: "leads" as SalesTab, label: "Leads" },
    { id: "contacts" as SalesTab, label: "Contacts" },
    { id: "accounts" as SalesTab, label: "Accounts" },
    { id: "opportunities" as SalesTab, label: "Opportunities" },
    { id: "products" as SalesTab, label: "Products" },
    { id: "price-books" as SalesTab, label: "Price Books" },
    { id: "calendar" as SalesTab, label: "Calendar" },
    { id: "analytics" as SalesTab, label: "Analytics" },
  ];
  const router = useRouter();
  const { showToast } = useToast();
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAboutExpanded, setIsAboutExpanded] = useState(true);
  const [isGetInTouchExpanded, setIsGetInTouchExpanded] = useState(true);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(true);
  const [isSegmentExpanded, setIsSegmentExpanded] = useState(true);
  const [isUpcomingExpanded, setIsUpcomingExpanded] = useState(true);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isInlineEditing, setIsInlineEditing] = useState(false);

  // Form state for inline editing
  const [editFormData, setEditFormData] = useState<any>({});

  // Define lead status stages
  const statusStages = [
    "New",
    "Contacted",
    "Nurturing",
    "Unqualified",
    "Converted",
  ];

  // Fetch lead data
  const fetchLead = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/sobjects/leads/${leadId}`);
      setLead(response.data);
      setEditFormData({
        salutation: response.data.salutation || "",
        first_name: response.data.first_name || "",
        last_name: response.data.last_name || "",
        title: response.data.title || "",
        company: response.data.company || "",
        website: response.data.website || "",
        description: response.data.description || "",
        email: response.data.email || "",
        phone: response.data.phone || "",
        country: response.data.country || "",
        street: response.data.street || "",
        city: response.data.city || "",
        state_province: response.data.state_province || "",
        zip_postal_code: response.data.zip_postal_code || "",
        number_of_employees: response.data.number_of_employees || "",
        annual_revenue: response.data.annual_revenue || "",
        lead_source: response.data.lead_source || "",
        industry: response.data.industry || "",
      });
    } catch (error) {
      console.error("Error fetching lead:", error);
      showToast("Failed to load lead. Please try again.", {
        label: "Dismiss",
        onClick: () => {},
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLead();
  }, [leadId]);

  // Mark status as complete (progress to next stage)
  const handleMarkStatusComplete = async () => {
    if (!lead) return;

    const currentStatusIndex = statusStages.indexOf(lead.status);
    if (
      currentStatusIndex === -1 ||
      currentStatusIndex === statusStages.length - 1
    ) {
      showToast("Cannot progress lead status further.", {
        label: "Dismiss",
        onClick: () => {},
      });
      return;
    }

    const nextStatus = statusStages[currentStatusIndex + 1];

    try {
      await axios.patch(`/api/v1/sobjects/leads/${leadId}`, {
        status: nextStatus,
      });
      showToast(`Lead status updated to "${nextStatus}".`, {
        label: "Undo",
        onClick: () => console.log("Undo status change"),
      });
      fetchLead();
    } catch (error) {
      console.error("Error updating lead status:", error);
      showToast("Failed to update lead status. Please try again.", {
        label: "Dismiss",
        onClick: () => {},
      });
    }
  };

  // Handle inline edit save
  const handleInlineSave = async () => {
    try {
      await axios.patch(`/api/v1/sobjects/leads/${leadId}`, editFormData);
      showToast("Lead updated successfully.", {
        label: "Undo",
        onClick: () => console.log("Undo lead update"),
      });
      setIsInlineEditing(false);
      fetchLead();
    } catch (error) {
      console.error("Error updating lead:", error);
      showToast("Failed to update lead. Please try again.", {
        label: "Dismiss",
        onClick: () => {},
      });
    }
  };

  // Get current status index
  const getCurrentStatusIndex = () => {
    if (!lead) return -1;
    return statusStages.indexOf(lead.status);
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#f3f2f2]">
        <p className="text-[#706e6b]">Loading lead...</p>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="h-full flex items-center justify-center bg-[#f3f2f2]">
        <p className="text-[#706e6b]">Lead not found.</p>
      </div>
    );
  }

  const currentStatusIndex = getCurrentStatusIndex();
  const fullName = `${lead.salutation ? lead.salutation + " " : ""}${
    lead.first_name
  } ${lead.last_name}`;
  const fullAddress = [
    lead.street,
    lead.city,
    lead.state_province,
    lead.zip_postal_code,
    lead.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="overflow-y-auto h-full flex flex-col bg-[#f3f2f2]">
      <div className="fixed bg-white border-b border-gray-200 px-8 py-4 shrink-0 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-normal text-[#080707]">Sales</h1>

            {/* Tab Navigation */}
            <div className="flex items-center gap-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 pb-3 font-normal transition-colors relative ${
                    activeTab === tab.id
                      ? "text-[#0176d3]"
                      : "text-gray-700 hover:text-[#0176d3]"
                  }`}
                >
                  {tab.label}
                  <ChevronDown className="w-4 h-4" />
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0176d3]" />
                  )}
                </button>
              ))}
            </div>
          </div>
          <button className="text-gray-600 hover:text-[#0176d3] transition-colors">
            <Edit className="w-5 h-5" />
          </button>
        </div>
      </div>
      {/* Lead Header */}
      <div className="bg-transparent px-6 py-4 mt-20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#06a59a] flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-[#706e6b]">Lead</p>
              <h1 className="text-2xl font-normal text-[#181818]">
                {fullName}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ButtonGroup
              buttons={[
                {
                  label: "Convert",
                  onClick: () => setIsConvertModalOpen(true),
                },
                {
                  label: "Edit",
                  onClick: () => setIsInlineEditing(true),
                },
              ]}
            />
            <div className="relative">
              <Button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                variant="outline"
                className="h-9 w-9 p-0 border-[#dddbda] bg-white hover:bg-gray-50"
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-2 flex items-center justify-between">
          <div className="flex items-center">
            {statusStages.map((stage, index) => {
              const isCompleted = index < currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              const isFirst = index === 0;
              const isLast = index === statusStages.length - 1;

              return (
                <div
                  key={stage}
                  className={`relative h-10 flex items-center justify-center ${
                    isCompleted
                      ? "bg-[#acf3e4]"
                      : isCurrent
                      ? "bg-[#032d60]"
                      : "bg-[#c9c9c9]"
                  }`}
                  style={{
                    width:
                      index === statusStages.length - 1 ||
                      index === statusStages.length - 2
                        ? "240px"
                        : "200px",
                    clipPath: isFirst
                      ? "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%, 0 0)"
                      : isLast
                      ? "polygon(20px 0, 100% 0, 100% 100%, 20px 100%, 0 50%)"
                      : "polygon(20px 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 20px 100%, 0 50%)",
                    ...(isFirst && {
                      borderTopLeftRadius: "20px",
                      borderBottomLeftRadius: "20px",
                    }),
                    ...(isLast && {
                      borderTopRightRadius: "20px",
                      borderBottomRightRadius: "20px",
                    }),
                  }}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-green-700" />
                  ) : (
                    <span
                      className={`text-sm font-medium ${
                        isCurrent ? "text-white" : "text-[#706e6b]"
                      }`}
                    >
                      {stage}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mark Status as Complete Button */}
          <div className="ml-6">
            <Button
              onClick={handleMarkStatusComplete}
              className="bg-[#066afe] text-white hover:bg-[#0159a8] h-9 px-4 text-sm rounded-3xl flex items-center gap-2"
              disabled={
                currentStatusIndex === -1 ||
                currentStatusIndex === statusStages.length - 1
              }
            >
              <Check className="w-4 h-4" />
              Mark Status as Complete
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="grid grid-cols-[380px_1fr_380px] gap-4 p-3">
          <div className="bg-white border-r border-[#dddbda] p-2 space-y-6 rounded-2xl">
            {isInlineEditing ? (
              <div className="flex-1 bg-white py-2 px-4">
                <h2 className="text-xl font-normal text-[#181818] mb-2">
                  Edit Lead Information
                </h2>
                <div className="max-w-4xl space-y-6 px-3">
                  {/* About Section */}
                  <div>
                    <h3 className="text-base font-normal text-[#181818] bg-[#f3f2f2] px-4 py-2 -mx-6 mb-4 rounded-2xl">
                      About
                    </h3>
                    <div className="grid grid-cols-2 gap-2 -mx-4">
                      <div>
                        <label className="block text-sm text-[#181818] mb-1">
                          Salutation
                        </label>
                        <select
                          value={editFormData.salutation}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              salutation: e.target.value,
                            })
                          }
                          className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm"
                        >
                          <option value="">--None--</option>
                          <option value="Mr.">Mr.</option>
                          <option value="Ms.">Ms.</option>
                          <option value="Mrs.">Mrs.</option>
                          <option value="Dr.">Dr.</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-[#181818] mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={editFormData.first_name}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              first_name: e.target.value,
                            })
                          }
                          className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#181818] mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={editFormData.last_name}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              last_name: e.target.value,
                            })
                          }
                          className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#181818] mb-1">
                          Company
                        </label>
                        <input
                          type="text"
                          value={editFormData.company}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              company: e.target.value,
                            })
                          }
                          className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#181818] mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={editFormData.title}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              title: e.target.value,
                            })
                          }
                          className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#181818] mb-1">
                          Website
                        </label>
                        <input
                          type="text"
                          value={editFormData.website}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              website: e.target.value,
                            })
                          }
                          className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm text-[#181818] mb-1">
                          Description
                        </label>
                        <textarea
                          value={editFormData.description}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              description: e.target.value,
                            })
                          }
                          className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm min-h-20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Get in Touch Section */}
                  <div>
                    <h3 className="text-base font-normal text-[#181818] bg-[#f3f2f2] px-4 py-2 -mx-6 mb-4 rounded-2xl">
                      Get in Touch
                    </h3>
                    <div className="grid grid-cols-2 gap-4 -mx-4">
                      <div>
                        <label className="block text-sm text-[#181818] mb-1">
                          Phone
                        </label>
                        <input
                          type="text"
                          value={editFormData.phone}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              phone: e.target.value,
                            })
                          }
                          className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#181818] mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={editFormData.email}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              email: e.target.value,
                            })
                          }
                          className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm text-[#181818] mb-1">
                          Street
                        </label>
                        <textarea
                          value={editFormData.street}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              street: e.target.value,
                            })
                          }
                          className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm min-h-20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#181818] mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          value={editFormData.city}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              city: e.target.value,
                            })
                          }
                          className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#181818] mb-1">
                          State/Province
                        </label>
                        <input
                          type="text"
                          value={editFormData.state_province}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              state_province: e.target.value,
                            })
                          }
                          className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#181818] mb-1">
                          Zip/Postal Code
                        </label>
                        <input
                          type="text"
                          value={editFormData.zip_postal_code}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              zip_postal_code: e.target.value,
                            })
                          }
                          className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#181818] mb-1">
                          Country
                        </label>
                        <input
                          type="text"
                          value={editFormData.country}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              country: e.target.value,
                            })
                          }
                          className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Segment Section */}
                  <div>
                    <h3 className="text-base font-normal text-[#181818] bg-[#f3f2f2] px-4 py-2 -mx-6 mb-4 rounded-2xl">
                      Segment
                    </h3>
                    <div className="grid grid-cols-2 gap-4 -mx-4">
                      <div>
                        <label className="block text-sm text-[#181818] mb-1">
                          No. of Employees
                        </label>
                        <input
                          type="number"
                          value={editFormData.number_of_employees}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              number_of_employees: e.target.value,
                            })
                          }
                          className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#181818] mb-1">
                          Annual Revenue
                        </label>
                        <input
                          type="text"
                          value={editFormData.annual_revenue}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              annual_revenue: e.target.value,
                            })
                          }
                          className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#181818] mb-1">
                          Lead Source
                        </label>
                        <input
                          type="text"
                          value={editFormData.lead_source}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              lead_source: e.target.value,
                            })
                          }
                          className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#181818] mb-1">
                          Industry
                        </label>
                        <input
                          type="text"
                          value={editFormData.industry}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              industry: e.target.value,
                            })
                          }
                          className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="justify-center flex items-center gap-3 pt-4 border-t border-black">
                    <Button
                      onClick={() => setIsInlineEditing(false)}
                      className="bg-white text-[#066afe] hover:bg-gray-50 border border-black h-9 px-4 text-sm rounded-3xl"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleInlineSave}
                      className="bg-[#066afe] text-white hover:bg-[] h-9 px-4 text-sm rounded-3xl"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <button
                    onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                    className="bg-gray-100 flex items-center gap-2 w-full text-left mb-4 px-2 py-1 rounded-2xl"
                  >
                    <ChevronDown
                      className={`w-5 h-5 text-[#706e6b] transition-transform ${
                        !isAboutExpanded ? "-rotate-90" : ""
                      }`}
                    />
                    <h2 className="text-base font-normal text-[#181818]">
                      About
                    </h2>
                  </button>
                  {isAboutExpanded && (
                    <div className="space-y-4 pl-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-[#706e6b] mb-1">Name</p>
                          <p className="text-sm text-[#181818]">{fullName}</p>
                        </div>
                        <Pencil
                          className="w-4 h-4 text-[#706e6b] cursor-pointer"
                          onClick={() => setIsInlineEditing(true)}
                        />
                      </div>
                      <hr className="w-full h-px -mt-2 border-black" />
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-[#706e6b] mb-1">Company</p>
                          <p className="text-sm text-[#181818]">
                            {lead.company || "—"}
                          </p>
                        </div>
                        <Pencil
                          className="w-4 h-4 text-[#706e6b] cursor-pointer"
                          onClick={() => setIsInlineEditing(true)}
                        />
                      </div>
                      <hr className="w-full h-px -mt-2 border-black" />
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-[#706e6b] mb-1">Title</p>
                          <p className="text-sm text-[#181818]">
                            {lead.title || "—"}
                          </p>
                        </div>
                        <Pencil
                          className="w-4 h-4 text-[#706e6b] cursor-pointer"
                          onClick={() => setIsInlineEditing(true)}
                        />
                      </div>
                      <hr className="w-full h-px -mt-2 border-black" />
                      {lead.website && (
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs text-[#706e6b] mb-1">
                              Website
                            </p>
                            <a
                              href={lead.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-[#0176d3] hover:underline"
                            >
                              {lead.website}
                            </a>
                          </div>
                          <Pencil
                            className="w-4 h-4 text-[#706e6b] cursor-pointer"
                            onClick={() => setIsInlineEditing(true)}
                          />
                        </div>
                      )}
                      {lead.description && (
                        <>
                          <hr className="w-full h-px -mt-2 border-black" />
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-xs text-[#706e6b] mb-1">
                                Description
                              </p>
                              <p className="text-sm text-[#181818]">
                                {lead.description}
                              </p>
                            </div>
                            <Pencil
                              className="w-4 h-4 text-[#706e6b] cursor-pointer"
                              onClick={() => setIsInlineEditing(true)}
                            />
                          </div>
                          <hr className="w-full h-px -mt-2 border-black" />
                        </>
                      )}
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-[#706e6b] mb-1">
                            Lead Status
                          </p>
                          <p className="text-sm text-[#181818]">
                            {lead.status}
                          </p>
                        </div>
                        <Pencil className="w-4 h-4 text-[#706e6b] cursor-pointer" />
                      </div>
                      <hr className="w-full h-px -mt-2 border-black" />
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-[#706e6b] mb-1">
                            Lead Owner
                          </p>
                          <div className="flex items-center gap-2">
                            <Image
                              src="/owner-icon.png"
                              alt=""
                              width={20}
                              height={20}
                            />
                            <span className="text-sm text-[#0176d3]">
                              {lead.lead_owner}
                            </span>
                          </div>
                        </div>
                        <User className="w-4 h-4 text-[#0176d3] cursor-pointer" />
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <button
                    onClick={() =>
                      setIsGetInTouchExpanded(!isGetInTouchExpanded)
                    }
                    className="bg-gray-100 flex items-center gap-2 w-full text-left mb-4 px-2 py-1 rounded-2xl"
                  >
                    <ChevronDown
                      className={`w-5 h-5 text-[#706e6b] transition-transform ${
                        !isGetInTouchExpanded ? "-rotate-90" : ""
                      }`}
                    />
                    <h2 className="text-base font-normal text-[#181818]">
                      Get in Touch
                    </h2>
                  </button>
                  {isGetInTouchExpanded && (
                    <div className="space-y-4 pl-3">
                      {lead.phone && (
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs text-[#706e6b] mb-1">Phone</p>
                            <a
                              href={`tel:${lead.phone}`}
                              className="text-sm text-[#0176d3] hover:underline"
                            >
                              {lead.phone}
                            </a>
                          </div>
                          <Pencil
                            className="w-4 h-4 text-[#706e6b] cursor-pointer"
                            onClick={() => setIsInlineEditing(true)}
                          />
                        </div>
                      )}
                      {lead.email && (
                        <>
                          <hr className="w-full h-px -mt-2 border-black" />
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-xs text-[#706e6b] mb-1">
                                Email
                              </p>
                              <a
                                href={`mailto:${lead.email}`}
                                className="text-sm text-[#0176d3] hover:underline"
                              >
                                {lead.email}
                              </a>
                            </div>
                            <Pencil
                              className="w-4 h-4 text-[#706e6b] cursor-pointer"
                              onClick={() => setIsInlineEditing(true)}
                            />
                          </div>
                        </>
                      )}
                      {fullAddress && (
                        <>
                          <hr className="w-full h-px -mt-2 border-black" />
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-xs text-[#706e6b] mb-1">
                                Address
                              </p>
                              <p className="text-sm text-[#181818]">
                                {fullAddress}
                              </p>
                            </div>
                            <Pencil
                              className="w-4 h-4 text-[#706e6b] cursor-pointer"
                              onClick={() => setIsInlineEditing(true)}
                            />
                          </div>
                          <hr className="w-full h-px -mt-2 border-black" />
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Segment Section */}
                <div>
                  <button
                    onClick={() => setIsSegmentExpanded(!isSegmentExpanded)}
                    className="bg-gray-100 flex items-center gap-2 w-full text-left mb-4 px-2 py-1 rounded-2xl"
                  >
                    <ChevronDown
                      className={`w-5 h-5 text-[#706e6b] transition-transform ${
                        !isSegmentExpanded ? "-rotate-90" : ""
                      }`}
                    />
                    <h2 className="text-base font-normal text-[#181818]">
                      Segment
                    </h2>
                  </button>
                  {isSegmentExpanded && (
                    <div className="space-y-4 pl-3">
                      {lead.number_of_employees && (
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs text-[#706e6b] mb-1">
                              No. of Employees
                            </p>
                            <p className="text-sm text-[#181818]">
                              {lead.number_of_employees}
                            </p>
                          </div>
                          <Pencil
                            className="w-4 h-4 text-[#706e6b] cursor-pointer"
                            onClick={() => setIsInlineEditing(true)}
                          />
                        </div>
                      )}
                      {lead.annual_revenue && (
                        <>
                          <hr className="w-full h-px -mt-2 border-black" />
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-xs text-[#706e6b] mb-1">
                                Annual Revenue
                              </p>
                              <p className="text-sm text-[#181818]">
                                {lead.annual_revenue}
                              </p>
                            </div>
                            <Pencil
                              className="w-4 h-4 text-[#706e6b] cursor-pointer"
                              onClick={() => setIsInlineEditing(true)}
                            />
                          </div>
                        </>
                      )}
                      {lead.lead_source && (
                        <>
                          <hr className="w-full h-px -mt-2 border-black" />
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-xs text-[#706e6b] mb-1">
                                Lead Source
                              </p>
                              <p className="text-sm text-[#181818]">
                                {lead.lead_source}
                              </p>
                            </div>
                            <Pencil
                              className="w-4 h-4 text-[#706e6b] cursor-pointer"
                              onClick={() => setIsInlineEditing(true)}
                            />
                          </div>
                        </>
                      )}
                      {lead.industry && (
                        <>
                          <hr className="w-full h-px -mt-2 border-black" />
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-xs text-[#706e6b] mb-1">
                                Industry
                              </p>
                              <p className="text-sm text-[#181818]">
                                {lead.industry}
                              </p>
                            </div>
                            <Pencil
                              className="w-4 h-4 text-[#706e6b] cursor-pointer"
                              onClick={() => setIsInlineEditing(true)}
                            />
                          </div>
                          <hr className="w-full h-px -mt-2 border-black" />
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* History Section */}
                <div>
                  <button
                    onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                    className="bg-gray-100 flex items-center gap-2 w-full text-left mb-4 px-2 py-1 rounded-2xl"
                  >
                    <ChevronDown
                      className={`w-5 h-5 text-[#706e6b] transition-transform ${
                        !isHistoryExpanded ? "-rotate-90" : ""
                      }`}
                    />
                    <h2 className="text-base font-normal text-[#181818]">
                      History
                    </h2>
                  </button>
                  {isHistoryExpanded && (
                    <div className="space-y-4 pl-3">
                      <div>
                        <p className="text-xs text-[#706e6b] mb-1">
                          Created By
                        </p>
                        <div className="flex items-center gap-2">
                          <Image
                            src="/owner-icon.png"
                            alt=""
                            width={20}
                            height={20}
                          />
                          <span className="text-sm text-[#0176d3]">
                            {lead.lead_owner}
                          </span>
                          <span className="text-sm text-[#706e6b]">
                            , {formatDate(lead.created_at)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-[#706e6b] mb-1">
                          Last Modified By
                        </p>
                        <div className="flex items-center gap-2">
                          <Image
                            src="/owner-icon.png"
                            alt=""
                            width={20}
                            height={20}
                          />
                          <span className="text-sm text-[#0176d3]">
                            {lead.lead_owner}
                          </span>
                          <span className="text-sm text-[#706e6b]">
                            , {formatDate(lead.updated_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Middle Column - Activity Timeline */}
          <div className="bg-white p-6 rounded-2xl">
            {/* Action Buttons */}
            <div className="flex items-center gap-2 mb-6">
              <button className="w-10 h-10 rounded-full border-2 border-[#dddbda] bg-white flex items-center justify-center hover:shadow-md transition-all">
                <Mail className="w-5 h-5 text-[#706e6b]" />
              </button>
              <button className="w-10 h-10 rounded-full border-2 border-[#dddbda] bg-white flex items-center justify-center hover:shadow-md transition-all">
                <Calendar className="w-5 h-5 text-[#706e6b]" />
              </button>
              <button className="w-10 h-10 rounded-full border-2 border-[#dddbda] bg-white flex items-center justify-center hover:shadow-md transition-all">
                <Phone className="w-5 h-5 text-[#706e6b]" />
              </button>
              <button className="w-10 h-10 rounded-full border-2 border-[#dddbda] bg-white flex items-center justify-center hover:shadow-md transition-all">
                <Plus className="w-5 h-5 text-[#706e6b]" />
              </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-[#706e6b]">
                  Filters: Within 2 months • All activities • All types
                </p>
                <button className="text-[#0176d3] hover:underline">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <button className="text-[#0176d3] hover:underline">
                  Refresh
                </button>
                <span className="text-[#706e6b]">•</span>
                <button className="text-[#0176d3] hover:underline">
                  Expand All
                </button>
              </div>
            </div>

            {/* Upcoming & Overdue */}
            <div className="bg-white rounded mb-4">
              <button
                onClick={() => setIsUpcomingExpanded(!isUpcomingExpanded)}
                className="w-full flex items-center gap-2 p-4 text-left"
              >
                <ChevronDown
                  className={`w-5 h-5 text-[#706e6b] transition-transform ${
                    !isUpcomingExpanded ? "-rotate-90" : ""
                  }`}
                />
                <h3 className="text-sm font-medium text-[#181818]">
                  Upcoming & Overdue
                </h3>
              </button>
              {isUpcomingExpanded && (
                <div className="px-4 pb-4">
                  <div className="bg-[#f3f2f2] rounded p-6 text-center">
                    <p className="text-sm text-[#706e6b] mb-2">
                      No activities to show.
                    </p>
                    <p className="text-xs text-[#706e6b]">
                      Get started by sending an email, scheduling a task, and
                      more.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Show All Activities Button */}
            <div className="text-center">
              <Button className="bg-[#066afe] rounded-3xl text-white hover:bg-[#0159a8] h-9 px-6 text-sm">
                Show All Activities
              </Button>
            </div>
          </div>

          {/* Right Column - Notes */}
          <div className="bg-white rounded-2xl border-l border-[#dddbda] p-6">
            <h2 className="text-lg font-normal text-[#181818] mb-6">
              Notes & Attachments
            </h2>
            <div className="bg-[#f3f2f2] rounded p-6 text-center">
              <p className="text-sm text-[#706e6b] mb-2">
                No notes or attachments to show.
              </p>
              <p className="text-xs text-[#706e6b]">
                Add notes or attach files to this lead.
              </p>
            </div>
          </div>
        </div>
      </div>
      <ConvertLeadModal
        open={isConvertModalOpen}
        onOpenChange={setIsConvertModalOpen}
        leadId={lead.id}
        leadData={{
          name: fullName,
          firstName: lead.first_name,
          lastName: lead.last_name,
          salutation: lead.salutation || "",
          company: lead.company || "",
        }}
      />
    </div>
  );
}
