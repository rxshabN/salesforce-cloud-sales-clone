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
  AlertTriangle,
  Settings,
  Upload,
  Building2,
  Edit,
} from "lucide-react";
import { useToast } from "@/components/toast-provider";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ButtonGroup } from "./ui/button-group";
import OpportunityFormModal, {
  OpportunityFormData,
} from "./modals/opportunity-form-modal";

interface ContactDetailProps {
  contactId: number;
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

export default function ContactDetail({ contactId }: ContactDetailProps) {
  const [activeTab, setActiveTab] = useState<SalesTab>("contacts");
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
  const [contact, setContact] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAboutExpanded, setIsAboutExpanded] = useState(true);
  const [isGetInTouchExpanded, setIsGetInTouchExpanded] = useState(true);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(true);
  const [isUpcomingExpanded, setIsUpcomingExpanded] = useState(true);
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Opportunity Modal State
  const [isOpportunityModalOpen, setIsOpportunityModalOpen] = useState(false);
  const [opportunityFormData, setOpportunityFormData] =
    useState<OpportunityFormData>({
      opportunityName: "",
      accountName: "",
      closeDate: "",
      amount: "",
      description: "",
      stage: "",
      probability: "",
      forecastCategory: "",
      nextStep: "",
    });
  const [opportunityErrors, setOpportunityErrors] = useState<
    Record<string, boolean>
  >({});
  const [isSavingOpportunity, setIsSavingOpportunity] = useState(false);

  // Form state for inline editing
  const [editFormData, setEditFormData] = useState<any>({});

  // Fetch contact data
  const fetchContact = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/v1/sobjects/contacts/${contactId}`
      );
      setContact(response.data);
      setEditFormData({
        first_name: response.data.first_name || "",
        last_name: response.data.last_name || "",
        email: response.data.email || "",
        phone: response.data.phone || "",
        title: response.data.title || "",
        description: response.data.description || "",
        mailing_street: response.data.mailing_street || "",
        mailing_city: response.data.mailing_city || "",
        mailing_state_province: response.data.mailing_state_province || "",
        mailing_zip_postal_code: response.data.mailing_zip_postal_code || "",
        mailing_country: response.data.mailing_country || "",
      });
    } catch (error) {
      console.error("Error fetching contact:", error);
      showToast("Failed to load contact. Please try again.", {
        label: "Dismiss",
        onClick: () => {},
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContact();
  }, [contactId]);

  const handleNewOpportunityClick = () => {
    setOpportunityFormData({
      opportunityName: contact?.accounts?.name
        ? `${contact.accounts.name}-`
        : "",
      accountName: contact?.accounts?.name || "",
      closeDate: "",
      amount: "",
      description: "",
      stage: "",
      probability: "",
      forecastCategory: "",
      nextStep: "",
    });
    setOpportunityErrors({});
    setIsOpportunityModalOpen(true);
  };

  const handleOpportunityModalClose = () => {
    setIsOpportunityModalOpen(false);
  };

  const validateOpportunityForm = () => {
    const errors: Record<string, boolean> = {};
    if (!opportunityFormData.opportunityName.trim())
      errors.opportunityName = true;
    if (!opportunityFormData.accountName.trim()) errors.accountName = true;
    if (!opportunityFormData.closeDate.trim()) errors.closeDate = true;
    if (!opportunityFormData.stage || opportunityFormData.stage === "--None--")
      errors.stage = true;
    setOpportunityErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpportunitySave = async (isSaveAndNew: boolean = false) => {
    if (!validateOpportunityForm()) return;

    setIsSavingOpportunity(true);
    try {
      const opportunityData = {
        name: opportunityFormData.opportunityName,
        account_id: contact.account_id,
        close_date: opportunityFormData.closeDate,
        stage: opportunityFormData.stage,
        amount: opportunityFormData.amount
          ? parseFloat(opportunityFormData.amount)
          : null,
        probability: opportunityFormData.probability
          ? parseFloat(opportunityFormData.probability)
          : null,
        forecast_category: opportunityFormData.forecastCategory || null,
        description: opportunityFormData.description || null,
        next_step: opportunityFormData.nextStep || null,
        opportunity_owner: "Rishab Nagwani",
      };

      await axios.post("/api/v1/sobjects/opportunities", opportunityData);
      showToast(
        `Opportunity "${opportunityFormData.opportunityName}" was created.`,
        {
          label: "Dismiss",
          onClick: () => {},
        }
      );

      if (isSaveAndNew) {
        handleNewOpportunityClick(); // Resets form for new entry
      } else {
        setIsOpportunityModalOpen(false);
      }
    } catch (error) {
      console.error("Error creating opportunity:", error);
      showToast("Failed to create opportunity. Please try again.", {
        label: "Dismiss",
        onClick: () => {},
      });
    } finally {
      setIsSavingOpportunity(false);
    }
  };

  // Handle inline edit save
  const handleInlineSave = async () => {
    try {
      await axios.patch(`/api/v1/sobjects/contacts/${contactId}`, editFormData);
      showToast("Contact updated successfully.", {
        label: "Undo",
        onClick: () => console.log("Undo contact update"),
      });
      setIsInlineEditing(false);
      fetchContact();
    } catch (error) {
      console.error("Error updating contact:", error);
      showToast("Failed to update contact. Please try again.", {
        label: "Dismiss",
        onClick: () => {},
      });
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this contact?")) return;

    try {
      await axios.delete(`/api/v1/sobjects/contacts/${contactId}`);
      showToast("Contact deleted successfully.", {
        label: "Dismiss",
        onClick: () => {},
      });
      router.push("/contacts");
    } catch (error) {
      console.error("Error deleting contact:", error);
      showToast("Failed to delete contact. Please try again.", {
        label: "Dismiss",
        onClick: () => {},
      });
    }
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
        <p className="text-[#706e6b]">Loading contact...</p>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="h-full flex items-center justify-center bg-[#f3f2f2]">
        <p className="text-[#706e6b]">Contact not found.</p>
      </div>
    );
  }

  const fullName =
    [contact.first_name, contact.last_name].filter(Boolean).join(" ") ||
    "Unnamed Contact";
  const fullAddress = [
    contact.mailing_street,
    contact.mailing_city,
    contact.mailing_state_province,
    contact.mailing_zip_postal_code,
    contact.mailing_country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="overflow-y-auto h-full flex flex-col bg-[#f3f2f2]">
      {/* Fixed Header with Tabs */}
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

      {/* Contact Header */}
      <div className="bg-transparent px-6 py-4 mt-20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#9b59b6] flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-[#706e6b]">Contact</p>
              <h1 className="text-2xl font-normal text-[#181818]">
                {fullName}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ButtonGroup
              buttons={[
                {
                  label: "Follow",
                  onClick: () =>
                    showToast("Follow - Coming soon", {
                      label: "Dismiss",
                      onClick: () => {},
                    }),
                },
                {
                  label: "New Opportunity",
                  onClick: handleNewOpportunityClick,
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
              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsDropdownOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-[#dddbda] z-20">
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-[#181818] hover:bg-gray-100"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        showToast("New Event - Coming soon", {
                          label: "Dismiss",
                          onClick: () => {},
                        });
                      }}
                    >
                      New Event
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-[#181818] hover:bg-gray-100"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        showToast("Log a Call - Coming soon", {
                          label: "Dismiss",
                          onClick: () => {},
                        });
                      }}
                    >
                      Log a Call
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-[#181818] hover:bg-gray-100"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        showToast("New Task - Coming soon", {
                          label: "Dismiss",
                          onClick: () => {},
                        });
                      }}
                    >
                      New Task
                    </button>
                    <hr className="border-[#dddbda]" />
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        handleDelete();
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="grid grid-cols-[380px_1fr_380px] gap-4 p-3">
          {/* Left Column */}
          <div className="bg-white border-r border-[#dddbda] p-2 space-y-6 rounded-2xl">
            {isInlineEditing ? (
              <div className="flex-1 bg-white py-2 px-4">
                <h2 className="text-xl font-normal text-[#181818] mb-2">
                  Edit Contact Information
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
                          Mailing Street
                        </label>
                        <textarea
                          value={editFormData.mailing_street}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              mailing_street: e.target.value,
                            })
                          }
                          className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm min-h-20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#181818] mb-1">
                          Mailing City
                        </label>
                        <input
                          type="text"
                          value={editFormData.mailing_city}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              mailing_city: e.target.value,
                            })
                          }
                          className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#181818] mb-1">
                          Mailing State/Province
                        </label>
                        <input
                          type="text"
                          value={editFormData.mailing_state_province}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              mailing_state_province: e.target.value,
                            })
                          }
                          className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#181818] mb-1">
                          Mailing Zip/Postal Code
                        </label>
                        <input
                          type="text"
                          value={editFormData.mailing_zip_postal_code}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              mailing_zip_postal_code: e.target.value,
                            })
                          }
                          className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#181818] mb-1">
                          Mailing Country
                        </label>
                        <input
                          type="text"
                          value={editFormData.mailing_country}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              mailing_country: e.target.value,
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
                      className="bg-white text-[#066afe] hover:bg-gray-50 border border-black h-9 px-4 text-sm rounded-4xl"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleInlineSave}
                      className="bg-[#066afe] text-white hover:bg-[#0159a8] h-9 px-4 text-sm rounded-4xl"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* About Section */}
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
                      {contact.accounts && (
                        <>
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-xs text-[#706e6b] mb-1">
                                Account Name
                              </p>
                              <p className="text-sm text-[#0176d3]">
                                {contact.accounts.name}
                              </p>
                            </div>
                          </div>
                          <hr className="w-full h-px -mt-2 border-black" />
                        </>
                      )}
                      {contact.title && (
                        <>
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-xs text-[#706e6b] mb-1">
                                Title
                              </p>
                              <p className="text-sm text-[#181818]">
                                {contact.title}
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
                      {contact.description && (
                        <>
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-xs text-[#706e6b] mb-1">
                                Description
                              </p>
                              <p className="text-sm text-[#181818]">
                                {contact.description}
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
                            Contact Owner
                          </p>
                          <div className="flex items-center gap-2">
                            <Image
                              src="/owner-icon.png"
                              alt=""
                              width={20}
                              height={20}
                            />
                            <span className="text-sm text-[#0176d3]">
                              {contact.contact_owner}
                            </span>
                          </div>
                        </div>
                        <User className="w-4 h-4 text-[#0176d3] cursor-pointer" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Get in Touch Section */}
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
                      {contact.phone && (
                        <>
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-xs text-[#706e6b] mb-1">
                                Phone
                              </p>
                              <a
                                href={`tel:${contact.phone}`}
                                className="text-sm text-[#0176d3] hover:underline"
                              >
                                {contact.phone}
                              </a>
                            </div>
                            <Pencil
                              className="w-4 h-4 text-[#706e6b] cursor-pointer"
                              onClick={() => setIsInlineEditing(true)}
                            />
                          </div>
                          <hr className="w-full h-px -mt-2 border-black" />
                        </>
                      )}
                      {contact.email && (
                        <>
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-xs text-[#706e6b] mb-1">
                                Email
                              </p>
                              <a
                                href={`mailto:${contact.email}`}
                                className="text-sm text-[#0176d3] hover:underline"
                              >
                                {contact.email}
                              </a>
                            </div>
                            <Pencil
                              className="w-4 h-4 text-[#706e6b] cursor-pointer"
                              onClick={() => setIsInlineEditing(true)}
                            />
                          </div>
                          <hr className="w-full h-px -mt-2 border-black" />
                        </>
                      )}
                      {fullAddress && (
                        <>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-xs text-[#706e6b] mb-1">
                                Mailing Address
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
                            {contact.contact_owner}
                          </span>
                          <span className="text-sm text-[#706e6b]">
                            , {formatDate(contact.created_at)}
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
                            {contact.contact_owner}
                          </span>
                          <span className="text-sm text-[#706e6b]">
                            , {formatDate(contact.updated_at)}
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

            {/* Warning Banner */}
            <div className="bg-[#fef3cd] border border-[#f0ad4e] rounded p-4 mb-6 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#8a6d3b] shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-[#8a6d3b]">
                  Emails with this contact aren't automatically captured. Their
                  domain is on the Excluded Addresses list.{" "}
                  <a href="#" className="underline">
                    Learn More in Help
                  </a>
                </p>
              </div>
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
              <Button className="bg-[#066afe] rounded-4xl text-white hover:bg-[#0159a8] h-9 px-6 text-sm">
                Show All Activities
              </Button>
            </div>
          </div>

          {/* Right Column - Related Lists */}
          <div className="bg-white rounded-2xl border-l border-[#dddbda] p-6">
            <h2 className="text-lg font-normal text-[#181818] mb-6">
              Related Lists
            </h2>

            {/* Opportunities */}
            <div className="mb-6">
              <div className="bg-gray-100 flex items-center gap-2 w-full text-left mb-4 px-2 py-1 rounded-2xl">
                <Building2 className="w-4 h-4 text-[#f97316]" />
                <h3 className="text-base font-normal text-[#181818]">
                  Opportunities (0)
                </h3>
              </div>
              <div className="bg-[#f3f2f2] rounded p-6 text-center">
                <p className="text-sm text-[#706e6b] mb-2">
                  No opportunities to show.
                </p>
              </div>
            </div>

            {/* Cases */}
            <div className="mb-6">
              <div className="bg-gray-100 flex items-center gap-2 w-full text-left mb-4 px-2 py-1 rounded-2xl">
                <AlertTriangle className="w-4 h-4 text-[#ec4899]" />
                <h3 className="text-base font-normal text-[#181818]">
                  Cases (0)
                </h3>
              </div>
              <div className="bg-[#f3f2f2] rounded p-6 text-center">
                <p className="text-sm text-[#706e6b] mb-2">No cases to show.</p>
              </div>
            </div>

            {/* Files */}
            <div>
              <div className="bg-gray-100 flex items-center gap-2 w-full text-left mb-4 px-2 py-1 rounded-2xl">
                <Upload className="w-4 h-4 text-[#706e6b]" />
                <h3 className="text-base font-normal text-[#181818]">
                  Files (0)
                </h3>
              </div>
              <div className="border-2 border-dashed border-[#dddbda] rounded-lg p-8 text-center">
                <Button className="bg-white text-[#0176d3] hover:bg-gray-50 border border-[#0176d3] h-9 px-4 text-sm rounded mb-2">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Files
                </Button>
                <p className="text-xs text-[#706e6b]">Or drop files</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <OpportunityFormModal
        isOpen={isOpportunityModalOpen}
        isEditMode={false}
        onClose={handleOpportunityModalClose}
        onSave={() => handleOpportunitySave(false)}
        onSaveAndNew={() => handleOpportunitySave(true)}
        opportunityFormData={opportunityFormData}
        setOpportunityFormData={setOpportunityFormData}
        opportunityErrors={opportunityErrors}
        setOpportunityErrors={setOpportunityErrors}
        isSaving={isSavingOpportunity}
      />
    </div>
  );
}
