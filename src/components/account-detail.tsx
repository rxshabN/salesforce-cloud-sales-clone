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
  Building2,
  X,
  Check,
} from "lucide-react";
import { useToast } from "@/components/toast-provider";
import axios from "axios";
import { useRouter } from "next/navigation";

interface AccountDetailProps {
  accountId: number;
}

export default function AccountDetail({ accountId }: AccountDetailProps) {
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

  // Form state for inline editing
  const [editFormData, setEditFormData] = useState<any>({});

  // Fetch account data
  const fetchAccount = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/sobjects/accounts/${accountId}`);
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

  // Handle inline edit save
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

  // Handle delete
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
    <div className="h-full flex flex-col bg-[#f3f2f2]">
      {/* Account Header */}
      <div className="bg-white border-b border-[#dddbda] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#6b5eae] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-[#706e6b]">Account</p>
              {isInlineEditing ? (
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, name: e.target.value })
                  }
                  className="text-2xl font-normal text-[#181818] border border-[#0176d3] rounded px-2 focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                />
              ) : (
                <h1 className="text-2xl font-normal text-[#181818]">
                  {account.name}
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
                  <User className="w-4 h-4 mr-2" />
                  Follow
                </Button>
                <Button className="bg-white text-[#0176d3] hover:bg-gray-50 border border-[#dddbda] h-9 px-4 text-sm rounded">
                  New Contact
                </Button>
                <Button className="bg-white text-[#0176d3] hover:bg-gray-50 border border-[#dddbda] h-9 px-4 text-sm rounded">
                  New Opportunity
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

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-[380px_1fr_380px] gap-0">
          {/* Left Column - About, Get in Touch, History */}
          <div className="bg-white border-r border-[#dddbda] p-6 space-y-6">
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
                        Account Name
                      </p>
                      {isInlineEditing ? (
                        <input
                          type="text"
                          value={editFormData.name}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              name: e.target.value,
                            })
                          }
                          className="text-sm text-[#181818] w-full border border-[#0176d3] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                        />
                      ) : (
                        <p className="text-sm text-[#181818]">
                          {account.name || "-"}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-[#706e6b] mb-1">Website</p>
                      {isInlineEditing ? (
                        <input
                          type="text"
                          value={editFormData.website}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              website: e.target.value,
                            })
                          }
                          className="text-sm text-[#181818] w-full border border-[#0176d3] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                        />
                      ) : account.website ? (
                        <a
                          href={account.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#0176d3] hover:underline"
                        >
                          {account.website}
                        </a>
                      ) : (
                        <p className="text-sm text-[#181818]">-</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-[#706e6b] mb-1">Type</p>
                      {isInlineEditing ? (
                        <select
                          value={editFormData.type}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              type: e.target.value,
                            })
                          }
                          className="text-sm text-[#181818] w-full border border-[#0176d3] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                        >
                          <option value="">--None--</option>
                          <option value="Customer">Customer</option>
                          <option value="Partner">Partner</option>
                          <option value="Prospect">Prospect</option>
                        </select>
                      ) : (
                        <p className="text-sm text-[#181818]">
                          {account.type || "-"}
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
                          {account.description || "-"}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-[#706e6b] mb-1">
                        Account Owner
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs">
                          {account.account_owner
                            ?.split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </div>
                        <p className="text-sm text-[#0176d3]">
                          {account.account_owner || "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Get in Touch Section */}
            <div>
              <button
                onClick={() => setIsGetInTouchExpanded(!isGetInTouchExpanded)}
                className="flex items-center gap-2 w-full text-left mb-4"
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
                <div className="space-y-4 pl-7">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-[#706e6b] mb-1">Phone</p>
                      {isInlineEditing ? (
                        <input
                          type="text"
                          value={editFormData.phone}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              phone: e.target.value,
                            })
                          }
                          className="text-sm text-[#181818] w-full border border-[#0176d3] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                        />
                      ) : (
                        <p className="text-sm text-[#0176d3]">
                          {account.phone || "-"}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-[#706e6b] mb-1">
                        Billing Address
                      </p>
                      {isInlineEditing ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Street"
                            value={editFormData.billing_street}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                billing_street: e.target.value,
                              })
                            }
                            className="text-sm text-[#181818] w-full border border-[#0176d3] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                          />
                          <input
                            type="text"
                            placeholder="City"
                            value={editFormData.billing_city}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                billing_city: e.target.value,
                              })
                            }
                            className="text-sm text-[#181818] w-full border border-[#0176d3] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                          />
                          <input
                            type="text"
                            placeholder="State/Province"
                            value={editFormData.billing_state_province}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                billing_state_province: e.target.value,
                              })
                            }
                            className="text-sm text-[#181818] w-full border border-[#0176d3] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                          />
                          <input
                            type="text"
                            placeholder="Zip/Postal Code"
                            value={editFormData.billing_zip_postal_code}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                billing_zip_postal_code: e.target.value,
                              })
                            }
                            className="text-sm text-[#181818] w-full border border-[#0176d3] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                          />
                          <input
                            type="text"
                            placeholder="Country"
                            value={editFormData.billing_country}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                billing_country: e.target.value,
                              })
                            }
                            className="text-sm text-[#181818] w-full border border-[#0176d3] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                          />
                        </div>
                      ) : (
                        <p className="text-sm text-[#181818]">
                          {[
                            account.billing_street,
                            account.billing_city,
                            account.billing_state_province,
                            account.billing_zip_postal_code,
                            account.billing_country,
                          ]
                            .filter(Boolean)
                            .join(", ") || "-"}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-[#706e6b] mb-1">
                        Shipping Address
                      </p>
                      {isInlineEditing ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Street"
                            value={editFormData.shipping_street}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                shipping_street: e.target.value,
                              })
                            }
                            className="text-sm text-[#181818] w-full border border-[#0176d3] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                          />
                          <input
                            type="text"
                            placeholder="City"
                            value={editFormData.shipping_city}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                shipping_city: e.target.value,
                              })
                            }
                            className="text-sm text-[#181818] w-full border border-[#0176d3] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                          />
                          <input
                            type="text"
                            placeholder="State/Province"
                            value={editFormData.shipping_state_province}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                shipping_state_province: e.target.value,
                              })
                            }
                            className="text-sm text-[#181818] w-full border border-[#0176d3] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                          />
                          <input
                            type="text"
                            placeholder="Zip/Postal Code"
                            value={editFormData.shipping_zip_postal_code}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                shipping_zip_postal_code: e.target.value,
                              })
                            }
                            className="text-sm text-[#181818] w-full border border-[#0176d3] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                          />
                          <input
                            type="text"
                            placeholder="Country"
                            value={editFormData.shipping_country}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                shipping_country: e.target.value,
                              })
                            }
                            className="text-sm text-[#181818] w-full border border-[#0176d3] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                          />
                        </div>
                      ) : (
                        <p className="text-sm text-[#181818]">
                          {[
                            account.shipping_street,
                            account.shipping_city,
                            account.shipping_state_province,
                            account.shipping_zip_postal_code,
                            account.shipping_country,
                          ]
                            .filter(Boolean)
                            .join(", ") || "-"}
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
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-[#706e6b] mb-1">Created By</p>
                      <p className="text-sm text-[#0176d3]">
                        {account.account_owner || "-"}
                      </p>
                      <p className="text-xs text-[#706e6b]">
                        {formatDate(account.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-[#706e6b] mb-1">
                        Last Modified By
                      </p>
                      <p className="text-sm text-[#0176d3]">
                        {account.account_owner || "-"}
                      </p>
                      <p className="text-xs text-[#706e6b]">
                        {formatDate(account.updated_at)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center Column - Activity Timeline */}
          <div className="bg-white p-6">
            <div className="mb-6">
              <h2 className="text-lg font-normal text-[#181818] mb-4">
                Activity
              </h2>
              <div className="flex gap-2 mb-4">
                <Button className="bg-white text-[#0176d3] hover:bg-gray-50 border border-[#dddbda] h-9 px-4 text-sm rounded">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
                <Button className="bg-white text-[#0176d3] hover:bg-gray-50 border border-[#dddbda] h-9 px-4 text-sm rounded">
                  <Phone className="w-4 h-4 mr-2" />
                  Log a Call
                </Button>
                <Button className="bg-white text-[#0176d3] hover:bg-gray-50 border border-[#dddbda] h-9 px-4 text-sm rounded">
                  <Calendar className="w-4 h-4 mr-2" />
                  New Event
                </Button>
              </div>
              <div className="text-center py-8 text-[#706e6b]">
                No activities yet
              </div>
            </div>
          </div>

          {/* Right Column - Related Lists */}
          <div className="bg-white border-l border-[#dddbda] p-6 space-y-6">
            {/* Upcoming & Overdue */}
            <div>
              <button
                onClick={() => setIsUpcomingExpanded(!isUpcomingExpanded)}
                className="flex items-center gap-2 w-full text-left mb-4"
              >
                <ChevronDown
                  className={`w-5 h-5 text-[#706e6b] transition-transform ${
                    !isUpcomingExpanded ? "-rotate-90" : ""
                  }`}
                />
                <h2 className="text-base font-normal text-[#181818]">
                  Upcoming & Overdue
                </h2>
              </button>
              {isUpcomingExpanded && (
                <div className="pl-7 text-sm text-[#706e6b]">
                  No upcoming tasks
                </div>
              )}
            </div>

            {/* Contacts */}
            <div>
              <button
                onClick={() => setIsContactsExpanded(!isContactsExpanded)}
                className="flex items-center gap-2 w-full text-left mb-4"
              >
                <ChevronDown
                  className={`w-5 h-5 text-[#706e6b] transition-transform ${
                    !isContactsExpanded ? "-rotate-90" : ""
                  }`}
                />
                <h2 className="text-base font-normal text-[#181818]">
                  Contacts
                </h2>
              </button>
              {isContactsExpanded && (
                <div className="pl-7 text-sm text-[#706e6b]">
                  No contacts yet
                </div>
              )}
            </div>

            {/* Opportunities */}
            <div>
              <button
                onClick={() =>
                  setIsOpportunitiesExpanded(!isOpportunitiesExpanded)
                }
                className="flex items-center gap-2 w-full text-left mb-4"
              >
                <ChevronDown
                  className={`w-5 h-5 text-[#706e6b] transition-transform ${
                    !isOpportunitiesExpanded ? "-rotate-90" : ""
                  }`}
                />
                <h2 className="text-base font-normal text-[#181818]">
                  Opportunities
                </h2>
              </button>
              {isOpportunitiesExpanded && (
                <div className="pl-7 text-sm text-[#706e6b]">
                  No opportunities yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
