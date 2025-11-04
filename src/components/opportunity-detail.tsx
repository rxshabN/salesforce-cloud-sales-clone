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
  Crown,
  Upload,
  Edit,
  Check,
} from "lucide-react";
import { useToast } from "@/components/toast-provider";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ButtonGroup } from "./ui/button-group";

interface OpportunityDetailProps {
  opportunityId: number;
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

export default function OpportunityDetail({
  opportunityId,
}: OpportunityDetailProps) {
  const [activeTab, setActiveTab] = useState<SalesTab>("opportunities");
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
  const [opportunity, setOpportunity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAboutExpanded, setIsAboutExpanded] = useState(true);
  const [isStatusExpanded, setIsStatusExpanded] = useState(true);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(true);
  const [isUpcomingExpanded, setIsUpcomingExpanded] = useState(true);
  const [isGuidanceExpanded, setIsGuidanceExpanded] = useState(true);
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const stages = [
    "Qualification",
    "Needs Analysis",
    "Propose",
    "Negotiate",
    "Closed Won",
  ];

  const getCurrentStageIndex = () => {
    if (!opportunity) return -1;
    return stages.indexOf(opportunity.stage);
  };

  const handleMarkStageComplete = async () => {
    if (!opportunity) return;

    const currentStageIndex = stages.indexOf(opportunity.stage);
    if (currentStageIndex === -1 || currentStageIndex === stages.length - 1) {
      showToast("Cannot progress opportunity stage further.", {
        label: "Dismiss",
        onClick: () => {},
      });
      return;
    }

    const nextStage = stages[currentStageIndex + 1];

    try {
      await axios.patch(`/api/v1/sobjects/opportunities/${opportunityId}`, {
        stage: nextStage,
      });
      showToast(`Opportunity stage updated to "${nextStage}".`, {
        label: "Undo",
        onClick: () => console.log("Undo stage change"),
      });
      fetchOpportunity();
    } catch (error) {
      console.error("Error updating opportunity stage:", error);
      showToast("Failed to update opportunity stage. Please try again.", {
        label: "Dismiss",
        onClick: () => {},
      });
    }
  };

  const [editFormData, setEditFormData] = useState<any>({});

  const fetchOpportunity = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/v1/sobjects/opportunities/${opportunityId}`
      );
      setOpportunity(response.data);
      setEditFormData({
        name: response.data.name || "",
        amount: response.data.amount || "",
        close_date: response.data.close_date || "",
        stage: response.data.stage || "",
        description: response.data.description || "",
        probability: response.data.probability || "",
        forecast_category: response.data.forecast_category || "",
        next_step: response.data.next_step || "",
      });
    } catch (error) {
      console.error("Error fetching opportunity:", error);
      showToast("Failed to load opportunity. Please try again.", {
        label: "Dismiss",
        onClick: () => {},
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunity();
  }, [opportunityId]);

  const handleInlineSave = async () => {
    try {
      const dataToSave = {
        ...editFormData,
        amount: editFormData.amount ? parseFloat(editFormData.amount) : null,
        probability: editFormData.probability
          ? parseFloat(editFormData.probability)
          : null,
      };

      await axios.patch(
        `/api/v1/sobjects/opportunities/${opportunityId}`,
        dataToSave
      );
      showToast("Opportunity updated successfully.", {
        label: "Undo",
        onClick: () => console.log("Undo opportunity update"),
      });
      setIsInlineEditing(false);
      fetchOpportunity();
    } catch (error) {
      console.error("Error updating opportunity:", error);
      showToast("Failed to update opportunity. Please try again.", {
        label: "Dismiss",
        onClick: () => {},
      });
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this opportunity?")) return;

    try {
      await axios.delete(`/api/v1/sobjects/opportunities/${opportunityId}`);
      showToast("Opportunity deleted successfully.", {
        label: "Dismiss",
        onClick: () => {},
      });
      router.push("/opportunities");
    } catch (error) {
      console.error("Error deleting opportunity:", error);
      showToast("Failed to delete opportunity. Please try again.", {
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

  const formatCloseDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const formatAmount = (amount: number | string) => {
    if (!amount) return "-";
    return `₹${Number(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#f3f2f2]">
        <p className="text-[#706e6b]">Loading opportunity...</p>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="h-full flex items-center justify-center bg-[#f3f2f2]">
        <p className="text-[#706e6b]">Opportunity not found.</p>
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
            <div className="w-10 h-10 rounded-full bg-[#f97316] flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-[#706e6b]">Opportunity</p>
              <h1 className="text-2xl font-normal text-[#181818]">
                {opportunity.name}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ButtonGroup
              buttons={[
                {
                  label: "New Event",
                  onClick: () =>
                    showToast("New Event - Coming soon", {
                      label: "Dismiss",
                      onClick: () => {},
                    }),
                },
                {
                  label: "New Task",
                  onClick: () =>
                    showToast("New Task - Coming soon", {
                      label: "Dismiss",
                      onClick: () => {},
                    }),
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
                        showToast("Submit for Approval - Coming soon", {
                          label: "Dismiss",
                          onClick: () => {},
                        });
                      }}
                    >
                      Submit for Approval
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-[#181818] hover:bg-gray-100"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        showToast("Share - Coming soon", {
                          label: "Dismiss",
                          onClick: () => {},
                        });
                      }}
                    >
                      Share
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

        <div className="bg-white rounded-2xl p-2 mb-4 flex items-center justify-between">
          <div className="flex items-center">
            {stages.map((stage, index) => {
              const currentStageIndex = getCurrentStageIndex();
              const isCompleted = index < currentStageIndex;
              const isCurrent = index === currentStageIndex;
              const isFirst = index === 0;
              const isLast = index === stages.length - 1;

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
                    width: "200px",
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

          {getCurrentStageIndex() < stages.length - 1 && (
            <div className="ml-6">
              <Button
                onClick={handleMarkStageComplete}
                className="bg-[#066afe] text-white hover:bg-[#0159a8] h-9 px-4 text-sm rounded-3xl flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Mark Stage as Complete
              </Button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-4">
          <button
            onClick={() => setIsGuidanceExpanded(!isGuidanceExpanded)}
            className="flex items-center gap-2 w-full text-left"
          >
            <ChevronDown
              className={`w-5 h-5 text-[#706e6b] transition-transform ${
                !isGuidanceExpanded ? "-rotate-90" : ""
              }`}
            />
            <h2 className="text-base font-normal text-[#181818]">
              Guidance for Success
            </h2>
          </button>
          {isGuidanceExpanded && (
            <div className="mt-4 ml-7 space-y-3">
              <div>
                <h3 className="text-sm font-medium text-[#181818] mb-2">
                  Make the offer.
                </h3>
                <ul className="text-sm text-[#706e6b] space-y-1 list-disc list-inside">
                  <li>
                    Does the quote cover the complete solution discussed with
                    the customer?
                  </li>
                  <li>
                    Have you presented how our solution meets the
                    customer&apos;s needs?
                  </li>
                </ul>
              </div>
              <p className="text-sm text-[#706e6b]">
                Send detailed price information and prepare updated quotes if
                changes are needed.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1">
        <div className="grid grid-cols-[380px_1fr_380px] gap-4 p-3">
          
          <div className="bg-white border-r border-[#dddbda] p-2 space-y-6 rounded-2xl">
            {isInlineEditing ? (
              <div className="flex-1 bg-white py-2 px-4">
                <h2 className="text-xl font-normal text-[#181818] mb-2">
                  Edit Opportunity Information
                </h2>
                <div className="max-w-4xl space-y-6 px-3">
                  
                  <div>
                    <h3 className="text-base font-normal text-[#181818] bg-[#f3f2f2] px-4 py-2 -mx-6 mb-4 rounded-2xl">
                      About
                    </h3>
                    <div className="grid grid-cols-2 gap-2 -mx-4">
                      <div className="col-span-2">
                        <label className="block text-sm text-[#181818] mb-1">
                          Opportunity Name
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
                          Amount
                        </label>
                        <input
                          type="number"
                          value={editFormData.amount}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              amount: e.target.value,
                            })
                          }
                          className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#181818] mb-1">
                          Close Date
                        </label>
                        <input
                          type="date"
                          value={editFormData.close_date}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              close_date: e.target.value,
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

                  <div>
                    <h3 className="text-base font-normal text-[#181818] bg-[#f3f2f2] px-4 py-2 -mx-6 mb-4 rounded-2xl">
                      Status
                    </h3>
                    <div className="grid grid-cols-2 gap-4 -mx-4">
                      <div>
                        <label className="block text-sm text-[#181818] mb-1">
                          Stage
                        </label>
                        <select
                          value={editFormData.stage}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              stage: e.target.value,
                            })
                          }
                          className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm"
                        >
                          <option value="">--None--</option>
                          <option value="Qualification">Qualification</option>
                          <option value="Needs Analysis">Needs Analysis</option>
                          <option value="Propose">Propose</option>
                          <option value="Negotiate">Negotiate</option>
                          <option value="Closed Won">Closed Won</option>
                          <option value="Closed Lost">Closed Lost</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-[#181818] mb-1">
                          Probability (%)
                        </label>
                        <input
                          type="number"
                          value={editFormData.probability}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              probability: e.target.value,
                            })
                          }
                          className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#181818] mb-1">
                          Forecast Category
                        </label>
                        <select
                          value={editFormData.forecast_category}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              forecast_category: e.target.value,
                            })
                          }
                          className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm"
                        >
                          <option value="">--None--</option>
                          <option value="Pipeline">Pipeline</option>
                          <option value="Best Case">Best Case</option>
                          <option value="Commit">Commit</option>
                          <option value="Omitted">Omitted</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-[#181818] mb-1">
                          Next Step
                        </label>
                        <input
                          type="text"
                          value={editFormData.next_step}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              next_step: e.target.value,
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
                
                <div className="space-y-3 pb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-[#706e6b] mb-1">Amount</p>
                      <p className="text-sm text-[#181818]">
                        {formatAmount(opportunity.amount)}
                      </p>
                    </div>
                    <Pencil
                      className="w-4 h-4 text-[#706e6b] cursor-pointer"
                      onClick={() => setIsInlineEditing(true)}
                    />
                  </div>
                  <hr className="w-full h-px -mt-2 border-black" />
                  {opportunity.description && (
                    <>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-[#706e6b] mb-1">
                            Description
                          </p>
                          <p className="text-sm text-[#181818]">
                            {opportunity.description}
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
                        Opportunity Owner
                      </p>
                      <div className="flex items-center gap-2">
                        <Image
                          src="/owner-icon.png"
                          alt=""
                          width={20}
                          height={20}
                        />
                        <span className="text-sm text-[#0176d3]">
                          {opportunity.opportunity_owner}
                        </span>
                      </div>
                    </div>
                    <User className="w-4 h-4 text-[#0176d3] cursor-pointer" />
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => setIsStatusExpanded(!isStatusExpanded)}
                    className="bg-gray-100 flex items-center gap-2 w-full text-left mb-4 px-2 py-1 rounded-2xl"
                  >
                    <ChevronDown
                      className={`w-5 h-5 text-[#706e6b] transition-transform ${
                        !isStatusExpanded ? "-rotate-90" : ""
                      }`}
                    />
                    <h2 className="text-base font-normal text-[#181818]">
                      Status
                    </h2>
                  </button>
                  {isStatusExpanded && (
                    <div className="space-y-4 pl-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-[#706e6b] mb-1">Stage</p>
                          <p className="text-sm text-[#181818]">
                            {opportunity.stage || "—"}
                          </p>
                        </div>
                        <Pencil
                          className="w-4 h-4 text-[#706e6b] cursor-pointer"
                          onClick={() => setIsInlineEditing(true)}
                        />
                      </div>
                      <hr className="w-full h-px -mt-2 border-black" />
                      {opportunity.probability && (
                        <>
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-xs text-[#706e6b] mb-1">
                                Probability (%)
                              </p>
                              <p className="text-sm text-[#181818]">
                                {opportunity.probability}%
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
                      {opportunity.forecast_category && (
                        <>
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-xs text-[#706e6b] mb-1">
                                Forecast Category
                              </p>
                              <p className="text-sm text-[#181818]">
                                {opportunity.forecast_category}
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
                      {opportunity.next_step && (
                        <>
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-xs text-[#706e6b] mb-1">
                                Next Step
                              </p>
                              <p className="text-sm text-[#181818]">
                                {opportunity.next_step}
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
                            Opportunity Name
                          </p>
                          <p className="text-sm text-[#181818]">
                            {opportunity.name}
                          </p>
                        </div>
                        <Pencil
                          className="w-4 h-4 text-[#706e6b] cursor-pointer"
                          onClick={() => setIsInlineEditing(true)}
                        />
                      </div>
                      <hr className="w-full h-px -mt-2 border-black" />
                      {opportunity.accounts && (
                        <>
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-xs text-[#706e6b] mb-1">
                                Account Name
                              </p>
                              <p className="text-sm text-[#0176d3]">
                                {opportunity.accounts.name}
                              </p>
                            </div>
                          </div>
                          <hr className="w-full h-px -mt-2 border-black" />
                        </>
                      )}
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-[#706e6b] mb-1">
                            Close Date
                          </p>
                          <p className="text-sm text-[#181818]">
                            {formatCloseDate(opportunity.close_date)}
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
                          <p className="text-xs text-[#706e6b] mb-1">Amount</p>
                          <p className="text-sm text-[#181818]">
                            {formatAmount(opportunity.amount)}
                          </p>
                        </div>
                        <Pencil
                          className="w-4 h-4 text-[#706e6b] cursor-pointer"
                          onClick={() => setIsInlineEditing(true)}
                        />
                      </div>
                      <hr className="w-full h-px -mt-2 border-black" />
                      {opportunity.description && (
                        <>
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-xs text-[#706e6b] mb-1">
                                Description
                              </p>
                              <p className="text-sm text-[#181818]">
                                {opportunity.description}
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
                            {opportunity.opportunity_owner}
                          </span>
                          <span className="text-sm text-[#706e6b]">
                            , {formatDate(opportunity.created_at)}
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
                            {opportunity.opportunity_owner}
                          </span>
                          <span className="text-sm text-[#706e6b]">
                            , {formatDate(opportunity.updated_at)}
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
              <Button className="bg-[#066afe] rounded-3xl text-white hover:bg-[#0159a8] h-9 px-6 text-sm">
                Show All Activities
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border-l border-[#dddbda] p-6">
            <h2 className="text-lg font-normal text-[#181818] mb-6">
              Collaboration & Files
            </h2>

            <div className="mb-6 border border-[#dddbda] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"
                      fill="#E01E5A"
                    />
                  </svg>
                </div>
                <h3 className="text-base font-medium text-[#181818]">
                  Slack Channel
                </h3>
              </div>
              <p className="text-sm text-[#706e6b] mb-4">
                Collaborate with your team in Slack. Link or create a channel
                for this opportunity.
              </p>
              <Button className="bg-white text-[#0176d3] hover:bg-gray-50 border border-[#0176d3] h-9 px-4 text-sm rounded w-full">
                Link Channel
              </Button>
            </div>

            <div className="mb-6">
              <div className="bg-gray-100 flex items-center gap-2 w-full text-left mb-4 px-2 py-1 rounded-2xl">
                <User className="w-4 h-4 text-[#9b59b6]" />
                <h3 className="text-base font-normal text-[#181818]">
                  Contact Roles (0)
                </h3>
              </div>
              <div className="bg-[#f3f2f2] rounded p-6 text-center">
                <p className="text-sm text-[#706e6b] mb-2">
                  No contact roles to display.
                </p>
              </div>
            </div>

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
    </div>
  );
}
