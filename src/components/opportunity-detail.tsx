"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
  Crown,
  Upload,
  X,
  Check,
} from "lucide-react";
import { useToast } from "@/components/toast-provider";
import axios from "axios";
import { useRouter } from "next/navigation";

interface OpportunityDetailProps {
  opportunityId: number;
}

export default function OpportunityDetail({
  opportunityId,
}: OpportunityDetailProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [opportunity, setOpportunity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAboutExpanded, setIsAboutExpanded] = useState(true);
  const [isStatusExpanded, setIsStatusExpanded] = useState(true);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(true);
  const [isUpcomingExpanded, setIsUpcomingExpanded] = useState(true);
  const [isGuidanceExpanded, setIsGuidanceExpanded] = useState(true);
  const [isContactRolesExpanded, setIsContactRolesExpanded] = useState(true);
  const [isFilesExpanded, setIsFilesExpanded] = useState(true);
  const [isInlineEditing, setIsInlineEditing] = useState(false);

  // Form state for inline editing
  const [editFormData, setEditFormData] = useState<any>({});

  // Fetch opportunity data
  const fetchOpportunity = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/v1/sobjects/opportunities/${opportunityId}`
      );
      setOpportunity(response.data);
      setEditFormData({
        opportunity_name: response.data.opportunity_name || "",
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

  // Handle inline edit save
  const handleInlineSave = async () => {
    try {
      await axios.patch(
        `/api/v1/sobjects/opportunities/${opportunityId}`,
        editFormData
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

  // Handle delete
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this opportunity?")) return;

    try {
      await axios.delete(`/api/v1/sobjects/opportunities/${opportunityId}`);
      showToast("Opportunity deleted successfully.", {
        label: "Dismiss",
        onClick: () => {},
      });
      router.push("/sales");
    } catch (error) {
      console.error("Error deleting opportunity:", error);
      showToast("Failed to delete opportunity. Please try again.", {
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

  // Format close date (just date, no time)
  const formatCloseDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  // Format amount
  const formatAmount = (amount: number | string) => {
    if (!amount) return "-";
    return `₹${Number(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const stages = [
    { name: "Qualification", completed: true },
    { name: "Needs Analysis", completed: true },
    { name: "Propose", completed: false, current: true },
    { name: "Negotiate", completed: false },
    { name: "Closed", completed: false },
  ];

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
    <div className="h-full flex flex-col bg-[#f3f2f2]">
      {/* Opportunity Header */}
      <div className="bg-white border-b border-[#dddbda] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#f97316] flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-[#706e6b]">Opportunity</p>
              {isInlineEditing ? (
                <input
                  type="text"
                  value={editFormData.opportunity_name}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      opportunity_name: e.target.value,
                    })
                  }
                  className="text-2xl font-normal text-[#181818] border border-[#0176d3] rounded px-2 focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                />
              ) : (
                <h1 className="text-2xl font-normal text-[#181818]">
                  {opportunity.opportunity_name}
                </h1>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isInlineEditing ? (
              <>
                <Button
                  onClick={() => setIsInlineEditing(false)}
                  className="bg-white text-[#706e6b] hover:bg-gray-50 border border-[#dddbda] h-9 px-4 text-sm rounded"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleInlineSave}
                  className="bg-[#0176d3] text-white hover:bg-[#014486] h-9 px-4 text-sm rounded"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button className="bg-white text-[#0176d3] hover:bg-gray-50 border border-[#dddbda] h-9 px-4 text-sm rounded">
                  New Event
                </Button>
                <Button className="bg-white text-[#0176d3] hover:bg-gray-50 border border-[#dddbda] h-9 px-4 text-sm rounded">
                  New Task
                </Button>
                <Button
                  onClick={() => setIsInlineEditing(true)}
                  className="bg-white text-[#0176d3] hover:bg-gray-50 border border-[#dddbda] h-9 px-4 text-sm rounded"
                >
                  Edit
                </Button>
                <Button
                  onClick={handleDelete}
                  className="bg-white text-red-600 hover:bg-red-50 border border-[#dddbda] h-9 px-4 text-sm rounded"
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Sales Stage Path */}
      <div className="bg-white border-b border-[#dddbda] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1">
            <button className="mr-4">
              <ChevronDown className="w-5 h-5 text-[#706e6b]" />
            </button>
            <div className="flex items-center flex-1 max-w-4xl">
              {stages.map((stage, index) => (
                <div key={stage.name} className="flex items-center flex-1">
                  <div
                    className={`flex-1 h-2 ${
                      stage.completed
                        ? "bg-[#4ade80]"
                        : stage.current
                        ? "bg-[#0f4c81]"
                        : "bg-[#e5e7eb]"
                    } ${index === 0 ? "rounded-l" : ""} ${
                      index === stages.length - 1 ? "rounded-r" : ""
                    }`}
                  />
                  {index < stages.length - 1 && (
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center -mx-4 z-10 ${
                        stage.completed
                          ? "bg-[#4ade80]"
                          : stages[index + 1].current
                          ? "bg-[#0f4c81]"
                          : "bg-[#e5e7eb]"
                      }`}
                    >
                      {stage.completed && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <Button className="bg-[#0176d3] text-white hover:bg-[#0159a8] h-9 px-4 text-sm rounded ml-6">
            <Check className="w-4 h-4 mr-2" />
            Mark Stage as Complete
          </Button>
        </div>
        <div className="flex items-center mt-2 ml-12">
          {stages.map((stage, index) => (
            <div key={stage.name} className="flex-1 text-center">
              <p
                className={`text-xs ${
                  stage.current
                    ? "font-medium text-[#181818]"
                    : "text-[#706e6b]"
                }`}
              >
                {stage.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Guidance for Success */}
      <div className="bg-white border-b border-[#dddbda] px-6 py-4">
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
                  Does the quote cover the complete solution discussed with the
                  customer?
                </li>
                <li>
                  Have you presented how our solution meets the customer's
                  needs?
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

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-[380px_1fr_380px] gap-0">
          {/* Left Column - About, Status, History */}
          <div className="bg-white border-r border-[#dddbda] p-6 space-y-6">
            {/* Top Summary */}
            <div className="space-y-3 pb-6 border-b border-[#dddbda]">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs text-[#706e6b] mb-1">Amount</p>
                  {isInlineEditing ? (
                    <input
                      type="number"
                      value={editFormData.amount}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          amount: e.target.value,
                        })
                      }
                      className="text-sm text-[#181818] w-full border border-[#0176d3] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                    />
                  ) : (
                    <p className="text-sm text-[#181818]">
                      {formatAmount(opportunity.amount)}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs text-[#706e6b] mb-1">Description</p>
                  {isInlineEditing ? (
                    <textarea
                      value={editFormData.description}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          description: e.target.value,
                        })
                      }
                      rows={2}
                      className="text-sm text-[#181818] w-full border border-[#0176d3] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                    />
                  ) : (
                    <p className="text-sm text-[#181818]">
                      {opportunity.description || "-"}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-[#706e6b] mb-1">
                    Opportunity Owner
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#706e6b] flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <a
                      href="#"
                      className="text-sm text-[#0176d3] hover:underline"
                    >
                      {opportunity.opportunity_owner || "-"}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Section */}
            <div>
              <button
                onClick={() => setIsStatusExpanded(!isStatusExpanded)}
                className="flex items-center gap-2 w-full text-left mb-4"
              >
                <ChevronDown
                  className={`w-5 h-5 text-[#706e6b] transition-transform ${
                    !isStatusExpanded ? "-rotate-90" : ""
                  }`}
                />
                <h2 className="text-base font-normal text-[#181818]">Status</h2>
              </button>
              {isStatusExpanded && (
                <div className="space-y-4 pl-7">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-[#706e6b] mb-1">Stage</p>
                      {isInlineEditing ? (
                        <select
                          value={editFormData.stage}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              stage: e.target.value,
                            })
                          }
                          className="text-sm text-[#181818] w-full border border-[#0176d3] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                        >
                          <option value="">--None--</option>
                          <option value="Qualification">Qualification</option>
                          <option value="Needs Analysis">Needs Analysis</option>
                          <option value="Propose">Propose</option>
                          <option value="Negotiate">Negotiate</option>
                          <option value="Closed Won">Closed Won</option>
                          <option value="Closed Lost">Closed Lost</option>
                        </select>
                      ) : (
                        <p className="text-sm text-[#181818]">
                          {opportunity.stage || "-"}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-[#706e6b] mb-1">
                        Probability (%)
                      </p>
                      {isInlineEditing ? (
                        <input
                          type="number"
                          value={editFormData.probability}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              probability: e.target.value,
                            })
                          }
                          className="text-sm text-[#181818] w-full border border-[#0176d3] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                        />
                      ) : (
                        <p className="text-sm text-[#181818]">
                          {opportunity.probability
                            ? `${opportunity.probability}%`
                            : "-"}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-[#706e6b] mb-1">
                        Forecast Category
                      </p>
                      {isInlineEditing ? (
                        <select
                          value={editFormData.forecast_category}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              forecast_category: e.target.value,
                            })
                          }
                          className="text-sm text-[#181818] w-full border border-[#0176d3] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                        >
                          <option value="">--None--</option>
                          <option value="Pipeline">Pipeline</option>
                          <option value="Best Case">Best Case</option>
                          <option value="Commit">Commit</option>
                          <option value="Omitted">Omitted</option>
                          <option value="Closed">Closed</option>
                        </select>
                      ) : (
                        <p className="text-sm text-[#181818]">
                          {opportunity.forecast_category || "-"}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-[#706e6b] mb-1">Next Step</p>
                      {isInlineEditing ? (
                        <input
                          type="text"
                          value={editFormData.next_step}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              next_step: e.target.value,
                            })
                          }
                          className="text-sm text-[#181818] w-full border border-[#0176d3] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                        />
                      ) : (
                        <p className="text-sm text-[#181818]">
                          {opportunity.next_step || "-"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* About Section */}
            <div>
              <button
                onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                className="flex items-center gap-2 w-full text-left mb-4"
              >
                <ChevronDown
                  className={`w-5 h-5 text-[#706e6b] transition-transform ${
                    !isAboutExpanded ? "-rotate-90" : ""
                  }`}
                />
                <h2 className="text-base font-normal text-[#181818]">About</h2>
              </button>
              {isAboutExpanded && (
                <div className="space-y-4 pl-7">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-[#706e6b] mb-1">
                        Opportunity Name
                      </p>
                      {isInlineEditing ? (
                        <input
                          type="text"
                          value={editFormData.opportunity_name}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              opportunity_name: e.target.value,
                            })
                          }
                          className="text-sm text-[#181818] w-full border border-[#0176d3] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                        />
                      ) : (
                        <p className="text-sm text-[#181818]">
                          {opportunity.opportunity_name || "-"}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-[#706e6b] mb-1">
                        Account Name
                      </p>
                      <a
                        href="#"
                        className="text-sm text-[#0176d3] hover:underline"
                      >
                        {opportunity.account_name || "-"}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-[#706e6b] mb-1">Close Date</p>
                      {isInlineEditing ? (
                        <input
                          type="date"
                          value={editFormData.close_date}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              close_date: e.target.value,
                            })
                          }
                          className="text-sm text-[#181818] w-full border border-[#0176d3] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                        />
                      ) : (
                        <p className="text-sm text-[#181818]">
                          {formatCloseDate(opportunity.close_date)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-[#706e6b] mb-1">Amount</p>
                      {isInlineEditing ? (
                        <input
                          type="number"
                          value={editFormData.amount}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              amount: e.target.value,
                            })
                          }
                          className="text-sm text-[#181818] w-full border border-[#0176d3] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                        />
                      ) : (
                        <p className="text-sm text-[#181818]">
                          {formatAmount(opportunity.amount)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-[#706e6b] mb-1">Description</p>
                      {isInlineEditing ? (
                        <textarea
                          value={editFormData.description}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              description: e.target.value,
                            })
                          }
                          rows={3}
                          className="text-sm text-[#181818] w-full border border-[#0176d3] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                        />
                      ) : (
                        <p className="text-sm text-[#181818]">
                          {opportunity.description || "-"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* History Section */}
            <div>
              <button
                onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                className="flex items-center gap-2 w-full text-left mb-4"
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
                <div className="space-y-4 pl-7">
                  <div>
                    <p className="text-xs text-[#706e6b] mb-1">Created By</p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#706e6b] flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <a
                        href="#"
                        className="text-sm text-[#0176d3] hover:underline"
                      >
                        {opportunity.opportunity_owner || "-"}
                      </a>
                    </div>
                    <p className="text-xs text-[#706e6b] mt-1">
                      {formatDate(opportunity.created_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#706e6b] mb-1">
                      Last Modified By
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#706e6b] flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <a
                        href="#"
                        className="text-sm text-[#0176d3] hover:underline"
                      >
                        {opportunity.opportunity_owner || "-"}
                      </a>
                    </div>
                    <p className="text-xs text-[#706e6b] mt-1">
                      {formatDate(opportunity.updated_at)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Middle Column - Activity Timeline */}
          <div className="bg-[#f3f2f2] p-6">
            {/* Action Buttons */}
            <div className="flex items-center gap-2 mb-6">
              <button className="w-10 h-10 rounded-full border-2 border-[#dddbda] bg-white flex items-center justify-center hover:shadow-md transition-all">
                <Mail className="w-5 h-5 text-[#706e6b]" />
              </button>
              <button className="w-10 h-10 rounded-full border-2 border-[#dddbda] bg-white flex items-center justify-center hover:shadow-md transition-all">
                <ChevronDown className="w-3 h-3 text-[#706e6b]" />
              </button>
              <button className="w-10 h-10 rounded-full border-2 border-[#dddbda] bg-white flex items-center justify-center hover:shadow-md transition-all">
                <Calendar className="w-5 h-5 text-[#706e6b]" />
              </button>
              <button className="w-10 h-10 rounded-full border-2 border-[#dddbda] bg-white flex items-center justify-center hover:shadow-md transition-all">
                <ChevronDown className="w-3 h-3 text-[#706e6b]" />
              </button>
              <button className="w-10 h-10 rounded-full border-2 border-[#dddbda] bg-white flex items-center justify-center hover:shadow-md transition-all">
                <Phone className="w-5 h-5 text-[#706e6b]" />
              </button>
              <button className="w-10 h-10 rounded-full border-2 border-[#dddbda] bg-white flex items-center justify-center hover:shadow-md transition-all">
                <ChevronDown className="w-3 h-3 text-[#706e6b]" />
              </button>
              <button className="w-10 h-10 rounded-full border-2 border-[#dddbda] bg-white flex items-center justify-center hover:shadow-md transition-all">
                <Plus className="w-5 h-5 text-[#706e6b]" />
              </button>
              <button className="w-10 h-10 rounded-full border-2 border-[#dddbda] bg-white flex items-center justify-center hover:shadow-md transition-all">
                <ChevronDown className="w-3 h-3 text-[#706e6b]" />
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
                  <div className="mt-4 bg-[#f3f2f2] rounded p-4 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#706e6b] shrink-0 mt-0.5" />
                    <p className="text-xs text-[#706e6b]">
                      To change what's shown, try changing your filters.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Show All Activities Button */}
            <div className="text-center">
              <Button className="bg-[#0176d3] text-white hover:bg-[#0159a8] h-9 px-6 text-sm rounded">
                Show All Activities
              </Button>
            </div>
          </div>

          {/* Right Column - Slack Channel & Related Lists */}
          <div className="bg-white border-l border-[#dddbda] p-6 space-y-6">
            {/* Slack Channel */}
            <div className="border border-[#dddbda] rounded p-6">
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
              <div className="mb-4">
                <img
                  src="/placeholder.svg?height=120&width=300"
                  alt="Slack collaboration"
                  className="w-full h-auto"
                />
              </div>
              <h4 className="text-lg font-medium text-[#181818] mb-2">
                Better collaboration with Slack
              </h4>
              <p className="text-sm text-[#706e6b] mb-2">
                Slack Channels in Salesforce are a place to collaborate and talk
                about your work. Anyone can follow the conversation here or in
                the Slack app.{" "}
                <a href="#" className="text-[#0176d3] hover:underline">
                  Learn more about Slack
                </a>
              </p>
              <div className="flex items-center gap-2 py-3 border-t border-[#dddbda] mt-4">
                <button className="text-[#706e6b] hover:text-[#181818]">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
                <button className="text-[#706e6b] hover:text-[#181818]">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-[#706e6b] mt-2">
                Post an update on this opportunity or @mention someone to start
                the conversation.
              </p>
              <p className="text-xs text-[#0176d3] mt-2">
                Already using Slack?{" "}
                <a href="#" className="hover:underline">
                  Link an existing channel
                </a>
              </p>
            </div>

            {/* Contact Roles */}
            <div className="border border-[#dddbda] rounded">
              <button
                onClick={() =>
                  setIsContactRolesExpanded(!isContactRolesExpanded)
                }
                className="w-full flex items-center justify-between p-4 border-b border-[#dddbda]"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#9b59b6] flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-sm font-medium text-[#181818]">
                    Contact Roles (0)
                  </h3>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#706e6b] transition-transform ${
                    !isContactRolesExpanded ? "-rotate-90" : ""
                  }`}
                />
              </button>
              {isContactRolesExpanded && (
                <div className="p-4">
                  <p className="text-sm text-[#706e6b] text-center py-4">
                    No contact roles to display
                  </p>
                </div>
              )}
            </div>

            {/* Files */}
            <div className="border border-[#dddbda] rounded">
              <button
                onClick={() => setIsFilesExpanded(!isFilesExpanded)}
                className="w-full flex items-center justify-between p-4 border-b border-[#dddbda]"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#706e6b] flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-7-7z" />
                      <path d="M13 2v7h7" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-[#181818]">
                    Files (0)
                  </h3>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#706e6b] transition-transform ${
                    !isFilesExpanded ? "-rotate-90" : ""
                  }`}
                />
              </button>
              {isFilesExpanded && (
                <div className="p-4">
                  <div className="border-2 border-dashed border-[#dddbda] rounded p-8 text-center">
                    <Button className="bg-white text-[#0176d3] hover:bg-gray-50 border border-[#dddbda] h-9 px-4 text-sm rounded mb-2">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Files
                    </Button>
                    <p className="text-xs text-[#706e6b]">Or drop files</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
