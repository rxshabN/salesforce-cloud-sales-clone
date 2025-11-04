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
  Settings,
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
import ContactFormModal, { ContactFormData } from "./modals/contact-form-modal";

interface AccountDetailProps {
  accountId: number;
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

export default function AccountDetail({ accountId }: AccountDetailProps) {
  const [activeTab, setActiveTab] = useState<SalesTab>("accounts");
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
  const [account, setAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAboutExpanded, setIsAboutExpanded] = useState(true);
  const [isGetInTouchExpanded, setIsGetInTouchExpanded] = useState(true);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(true);
  const [isUpcomingExpanded, setIsUpcomingExpanded] = useState(true);
  const [isContactsExpanded, setIsContactsExpanded] = useState(true);
  const [isOpportunitiesExpanded, setIsOpportunitiesExpanded] = useState(true);
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactFormData, setContactFormData] = useState<ContactFormData>({
    salutation: "",
    firstName: "",
    lastName: "",
    accountName: "",
    title: "",
    reportsTo: "",
    reportsToId: null,
    description: "",
    email: "",
    phone: "",
    mailingCountry: "",
    mailingStreet: "",
    mailingCity: "",
    mailingZipPostalCode: "",
    mailingStateProvince: "",
  });
  const [contactErrors, setContactErrors] = useState<Record<string, boolean>>(
    {}
  );
  const [isSavingContact, setIsSavingContact] = useState(false);

  const [editFormData, setEditFormData] = useState<any>({});

  const fetchAccount = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/v1/sobjects/accounts/${accountId}`
      );
      setAccount(response.data);
      setEditFormData({
        name: response.data.name || "",
        website: response.data.website || "",
        type: response.data.type || "",
        description: response.data.description || "",
        phone: response.data.phone || "",
        billing_street: response.data.billing_street || "",
        billing_city: response.data.billing_city || "",
        billing_state_province: response.data.billing_state_province || "",
        billing_zip_postal_code: response.data.billing_zip_postal_code || "",
        billing_country: response.data.billing_country || "",
        shipping_street: response.data.shipping_street || "",
        shipping_city: response.data.shipping_city || "",
        shipping_state_province: response.data.shipping_state_province || "",
        shipping_zip_postal_code: response.data.shipping_zip_postal_code || "",
        shipping_country: response.data.shipping_country || "",
      });
    } catch (error) {
      console.error("Error fetching account:", error);
      showToast("Failed to load account. Please try again.", {
        label: "Dismiss",
        onClick: () => {},
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, [accountId]);

  const handleNewOpportunityClick = () => {
    setOpportunityFormData({
      opportunityName: account?.name ? `${account.name}-` : "",
      accountName: account?.name || "",
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
    if (
      !opportunityFormData.forecastCategory ||
      opportunityFormData.forecastCategory === "--None--"
    )
      errors.forecastCategory = true;
    setOpportunityErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpportunitySave = async (isSaveAndNew: boolean = false) => {
    if (!validateOpportunityForm()) return;

    setIsSavingOpportunity(true);
    try {
      const opportunityData = {
        name: opportunityFormData.opportunityName,
        account_id: accountId,
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
      fetchAccount(); 

      if (isSaveAndNew) {
        handleNewOpportunityClick(); 
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

  const handleNewContactClick = () => {
    setContactFormData({
      salutation: "",
      firstName: "",
      lastName: "",
      accountName: "",
      title: "",
      reportsTo: "",
      reportsToId: null,
      description: "",
      email: "",
      phone: "",
      mailingStreet: "",
      mailingCity: "",
      mailingZipPostalCode: "",
      mailingCountry: "",
      mailingStateProvince: "",
    });
    setContactErrors({});
    setIsContactModalOpen(true);
  };

  const handleContactModalClose = () => {
    setIsContactModalOpen(false);
  };

  const validateContactForm = () => {
    const errors: Record<string, boolean> = {};
    if (!contactFormData.lastName.trim()) errors.lastName = true;
    setContactErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContactSave = async (isSaveAndNew: boolean = false) => {
    if (!validateContactForm()) return;

    setIsSavingContact(true);
    try {
      const contactData = {
        account_id: accountId,
        salutation: contactFormData.salutation || null,
        first_name: contactFormData.firstName || null,
        last_name: contactFormData.lastName,
        reportsTo: contactFormData.reportsTo || null,
        description: contactFormData.description || null,
        title: contactFormData.title || null,
        email: contactFormData.email || null,
        phone: contactFormData.phone || null,
        mailing_street: contactFormData.mailingStreet || null,
        mailing_city: contactFormData.mailingCity || null,
        mailing_state_province: contactFormData.mailingStateProvince || null,
        mailing_zip_postal_code: contactFormData.mailingZipPostalCode || null,
        mailing_country: contactFormData.mailingCountry || null,
        contact_owner: "Rishab Nagwani",
      };

      await axios.post("/api/v1/sobjects/contacts", contactData);
      showToast(
        `Contact "${contactFormData.firstName} ${contactFormData.lastName}" was created.`,
        {
          label: "Dismiss",
          onClick: () => {},
        }
      );
      fetchAccount(); 

      if (isSaveAndNew) {
        handleNewContactClick();
      } else {
        setIsContactModalOpen(false);
      }
    } catch (error) {
      console.error("Error creating contact:", error);
      showToast("Failed to create contact. Please try again.", {
        label: "Dismiss",
        onClick: () => {},
      });
    } finally {
      setIsSavingContact(false);
    }
  };

  const handleInlineSave = async () => {
    try {
      await axios.patch(`/api/v1/sobjects/accounts/${accountId}`, editFormData);
      showToast("Account updated successfully.", {
        label: "Undo",
        onClick: () => console.log("Undo account update"),
      });
      setIsInlineEditing(false);
      fetchAccount();
    } catch (error) {
      console.error("Error updating account:", error);
      showToast("Failed to update account. Please try again.", {
        label: "Dismiss",
        onClick: () => {},
      });
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this account?")) return;

    try {
      await axios.delete(`/api/v1/sobjects/accounts/${accountId}`);
      showToast("Account deleted successfully.", {
        label: "Dismiss",
        onClick: () => {},
      });
      router.push("/accounts");
    } catch (error) {
      console.error("Error deleting account:", error);
      showToast("Failed to delete account. Please try again.", {
        label: "Dismiss",
        onClick: () => {},
      });
    }
  };

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
        <p className="text-[#706e6b]">Loading account...</p>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="h-full flex items-center justify-center bg-[#f3f2f2]">
        <p className="text-[#706e6b]">Account not found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full flex flex-col bg-[#f3f2f2]">
      
      <div className="fixed bg-white border-b border-gray-200 px-8 py-4 shrink-0 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-normal text-[#080707]">Sales</h1>

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

      <div className="bg-transparent px-6 py-4 mt-20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#6b5eae] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-[#706e6b]">Account</p>
              <h1 className="text-2xl font-normal text-[#181818]">
                {account.name}
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
                  label: "New Contact",
                  onClick: handleNewContactClick,
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

      <div className="flex-1">
        <div className="grid grid-cols-[380px_1fr_380px] gap-4 p-3">
          
          <div className="bg-white border-r border-[#dddbda] p-2 space-y-6 rounded-2xl">
            {isInlineEditing ? (
              <div className="flex-1 bg-white py-2 px-4">
                <h2 className="text-xl font-normal text-[#181818] mb-2">
                  Edit Account Information
                </h2>
                <div className="max-w-4xl space-y-6 px-3">
                  
                  <div>
                    <h3 className="text-base font-normal text-[#181818] bg-[#f3f2f2] px-4 py-2 -mx-6 mb-4 rounded-2xl">
                      About
                    </h3>
                    <div className="grid grid-cols-2 gap-2 -mx-4">
                      <div className="col-span-2">
                        <label className="block text-sm text-[#181818] mb-1">
                          Account Name
                        </label>
                        <input
                          type="text"
                          value={editFormData.name}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              name: e.target.value,
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
                      <div>
                        <label className="block text-sm text-[#181818] mb-1">
                          Type
                        </label>
                        <select
                          value={editFormData.type}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              type: e.target.value,
                            })
                          }
                          className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm"
                        >
                          <option value="">--None--</option>
                          <option value="Customer">Customer</option>
                          <option value="Partner">Partner</option>
                          <option value="Prospect">Prospect</option>
                        </select>
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

                  <div>
                    <h3 className="text-base font-normal text-[#181818] bg-[#f3f2f2] px-4 py-2 -mx-6 mb-4 rounded-2xl">
                      Get in Touch
                    </h3>
                    <div className="grid grid-cols-2 gap-4 -mx-4">
                      <div className="col-span-2">
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
                      <div className="col-span-2">
                        <label className="block text-sm text-[#181818] mb-1">
                          Billing Street
                        </label>
                        <textarea
                          value={editFormData.billing_street}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              billing_street: e.target.value,
                            })
                          }
                          className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm min-h-20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#181818] mb-1">
                          Billing City
                        </label>
                        <input
                          type="text"
                          value={editFormData.billing_city}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              billing_city: e.target.value,
                            })
                          }
                          className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#181818] mb-1">
                          Billing State/Province
                        </label>
                        <input
                          type="text"
                          value={editFormData.billing_state_province}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              billing_state_province: e.target.value,
                            })
                          }
                          className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#181818] mb-1">
                          Billing Zip/Postal Code
                        </label>
                        <input
                          type="text"
                          value={editFormData.billing_zip_postal_code}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              billing_zip_postal_code: e.target.value,
                            })
                          }
                          className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#181818] mb-1">
                          Billing Country
                        </label>
                        <input
                          type="text"
                          value={editFormData.billing_country}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              billing_country: e.target.value,
                            })
                          }
                          className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm text-[#181818] mb-1">
                          Shipping Street
                        </label>
                        <textarea
                          value={editFormData.shipping_street}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              shipping_street: e.target.value,
                            })
                          }
                          className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm min-h-20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#181818] mb-1">
                          Shipping City
                        </label>
                        <input
                          type="text"
                          value={editFormData.shipping_city}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              shipping_city: e.target.value,
                            })
                          }
                          className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#181818] mb-1">
                          Shipping State/Province
                        </label>
                        <input
                          type="text"
                          value={editFormData.shipping_state_province}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              shipping_state_province: e.target.value,
                            })
                          }
                          className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#181818] mb-1">
                          Shipping Zip/Postal Code
                        </label>
                        <input
                          type="text"
                          value={editFormData.shipping_zip_postal_code}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              shipping_zip_postal_code: e.target.value,
                            })
                          }
                          className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#181818] mb-1">
                          Shipping Country
                        </label>
                        <input
                          type="text"
                          value={editFormData.shipping_country}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              shipping_country: e.target.value,
                            })
                          }
                          className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="justify-center flex items-center gap-3 pt-4 border-t border-black">
                    <Button
                      onClick={() => setIsInlineEditing(false)}
                      className="bg-white text-[#066afe] hover:bg-gray-50 border border-black h-9 px-4 text-sm rounded-3xl"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleInlineSave}
                      className="bg-[#066afe] text-white hover:bg-[#0159a8] h-9 px-4 text-sm rounded-3xl"
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
                          <p className="text-xs text-[#706e6b] mb-1">
                            Account Name
                          </p>
                          <p className="text-sm text-[#181818]">
                            {account.name}
                          </p>
                        </div>
                        <Pencil
                          className="w-4 h-4 text-[#706e6b] cursor-pointer"
                          onClick={() => setIsInlineEditing(true)}
                        />
                      </div>
                      <hr className="w-full h-px -mt-2 border-black" />
                      {account.website && (
                        <>
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-xs text-[#706e6b] mb-1">
                                Website
                              </p>
                              <a
                                href={account.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-[#0176d3] hover:underline"
                              >
                                {account.website}
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
                      {account.type && (
                        <>
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-xs text-[#706e6b] mb-1">
                                Type
                              </p>
                              <p className="text-sm text-[#181818]">
                                {account.type}
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
                      {account.description && (
                        <>
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-xs text-[#706e6b] mb-1">
                                Description
                              </p>
                              <p className="text-sm text-[#181818]">
                                {account.description}
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
                            Account Owner
                          </p>
                          <div className="flex items-center gap-2">
                            <Image
                              src="/owner-icon.png"
                              alt=""
                              width={20}
                              height={20}
                            />
                            <span className="text-sm text-[#0176d3]">
                              {account.account_owner}
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
                      {account.phone && (
                        <>
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-xs text-[#706e6b] mb-1">
                                Phone
                              </p>
                              <a
                                href={`tel:${account.phone}`}
                                className="text-sm text-[#0176d3] hover:underline"
                              >
                                {account.phone}
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
                      {[
                        account.billing_street,
                        account.billing_city,
                        account.billing_state_province,
                        account.billing_zip_postal_code,
                        account.billing_country,
                      ]
                        .filter(Boolean)
                        .join(", ") && (
                        <>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-xs text-[#706e6b] mb-1">
                                Billing Address
                              </p>
                              <p className="text-sm text-[#181818]">
                                {[
                                  account.billing_street,
                                  account.billing_city,
                                  account.billing_state_province,
                                  account.billing_zip_postal_code,
                                  account.billing_country,
                                ]
                                  .filter(Boolean)
                                  .join(", ")}
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
                      {[
                        account.shipping_street,
                        account.shipping_city,
                        account.shipping_state_province,
                        account.shipping_zip_postal_code,
                        account.shipping_country,
                      ]
                        .filter(Boolean)
                        .join(", ") && (
                        <>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-xs text-[#706e6b] mb-1">
                                Shipping Address
                              </p>
                              <p className="text-sm text-[#181818]">
                                {[
                                  account.shipping_street,
                                  account.shipping_city,
                                  account.shipping_state_province,
                                  account.shipping_zip_postal_code,
                                  account.shipping_country,
                                ]
                                  .filter(Boolean)
                                  .join(", ")}
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
                            {account.account_owner}
                          </span>
                          <span className="text-sm text-[#706e6b]">
                            , {formatDate(account.created_at)}
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
                            {account.account_owner}
                          </span>
                          <span className="text-sm text-[#706e6b]">
                            , {formatDate(account.updated_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl">
            
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

            <div className="text-center">
              <Button className="bg-[#066afe] rounded-4xl text-white hover:bg-[#0159a8] h-9 px-6 text-sm">
                Show All Activities
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border-l border-[#dddbda] p-6">
            <h2 className="text-lg font-normal text-[#181818] mb-6">
              Related Lists
            </h2>

            <div className="mb-6">
              <button
                onClick={() => setIsContactsExpanded(!isContactsExpanded)}
                className="bg-gray-100 flex items-center gap-2 w-full text-left mb-4 px-2 py-1 rounded-2xl"
              >
                <ChevronDown
                  className={`w-5 h-5 text-[#706e6b] transition-transform ${
                    !isContactsExpanded ? "-rotate-90" : ""
                  }`}
                />
                <h3 className="text-base font-normal text-[#181818]">
                  Contacts
                </h3>
              </button>
              {isContactsExpanded && (
                <div className="bg-[#f3f2f2] rounded p-6 text-center">
                  <p className="text-sm text-[#706e6b] mb-2">
                    No contacts to show.
                  </p>
                  <p className="text-xs text-[#706e6b]">
                    Add contacts to this account.
                  </p>
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() =>
                  setIsOpportunitiesExpanded(!isOpportunitiesExpanded)
                }
                className="bg-gray-100 flex items-center gap-2 w-full text-left mb-4 px-2 py-1 rounded-2xl"
              >
                <ChevronDown
                  className={`w-5 h-5 text-[#706e6b] transition-transform ${
                    !isOpportunitiesExpanded ? "-rotate-90" : ""
                  }`}
                />
                <h3 className="text-base font-normal text-[#181818]">
                  Opportunities
                </h3>
              </button>
              {isOpportunitiesExpanded && (
                <div className="bg-[#f3f2f2] rounded p-6 text-center">
                  <p className="text-sm text-[#706e6b] mb-2">
                    No opportunities to show.
                  </p>
                  <p className="text-xs text-[#706e6b]">
                    Add opportunities to this account.
                  </p>
                </div>
              )}
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
      <ContactFormModal
        isOpen={isContactModalOpen}
        isEditMode={false}
        onClose={handleContactModalClose}
        onSave={() => handleContactSave(false)}
        onSaveAndNew={() => handleContactSave(true)}
        contactFormData={contactFormData}
        setContactFormData={setContactFormData}
        contactErrors={contactErrors}
        setContactErrors={setContactErrors}
        isSaving={isSavingContact}
      />
    </div>
  );
}
