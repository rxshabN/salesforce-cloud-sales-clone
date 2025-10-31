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
  Upload,
  Building2,
  X,
  Check,
} from "lucide-react";
import { useToast } from "@/components/toast-provider";
import axios from "axios";
import { useRouter } from "next/navigation";

interface ContactDetailProps {
  contactId: number;
}

export default function ContactDetail({ contactId }: ContactDetailProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [contact, setContact] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAboutExpanded, setIsAboutExpanded] = useState(true);
  const [isGetInTouchExpanded, setIsGetInTouchExpanded] = useState(true);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(true);
  const [isUpcomingExpanded, setIsUpcomingExpanded] = useState(true);
  const [isInlineEditing, setIsInlineEditing] = useState(false);

  // Form state for inline editing
  const [editFormData, setEditFormData] = useState<any>({});

  // Fetch contact data
  const fetchContact = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/sobjects/contacts/${contactId}`);
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

  const fullName = [contact.first_name, contact.last_name].filter(Boolean).join(" ") || "Unnamed Contact";

  return (
    <div className="h-full flex flex-col bg-[#f3f2f2]">
      {/* Contact Header */}
      <div className="bg-white border-b border-[#dddbda] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#9b59b6] flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-[#706e6b]">Contact</p>
              {isInlineEditing ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editFormData.first_name}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, first_name: e.target.value })
                    }
                    placeholder="First Name"
                    className="text-2xl font-normal text-[#181818] border border-[#0176d3] rounded px-2 focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                  />
                  <input
                    type="text"
                    value={editFormData.last_name}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, last_name: e.target.value })
                    }
                    placeholder="Last Name"
                    className="text-2xl font-normal text-[#181818] border border-[#0176d3] rounded px-2 focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                  />
                </div>
              ) : (
                <h1 className="text-2xl font-normal text-[#181818]">
                  {fullName}
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
                      <p className="text-xs text-[#706e6b] mb-1">First Name</p>
                      {isInlineEditing ? (
                        <input
                          type="text"
                          value={editFormData.first_name}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              first_name: e.target.value,
                            })
                          }
                          className="text-sm text-[#181818] w-full border border-[#0176d3] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                        />
                      ) : (
                        <p className="text-sm text-[#181818]">
                          {contact.first_name || "-"}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-[#706e6b] mb-1">Last Name</p>
                      {isInlineEditing ? (
                        <input
                          type="text"
                          value={editFormData.last_name}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              last_name: e.target.value,
                            })
                          }
                          className="text-sm text-[#181818] w-full border border-[#0176d3] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                        />
                      ) : (
                        <p className="text-sm text-[#181818]">
                          {contact.last_name || "-"}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-[#706e6b] mb-1">
                        Account Name
                      </p>
                      <p className="text-sm text-[#181818]">
                        {contact.account_name || "-"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-[#706e6b] mb-1">Title</p>
                      {isInlineEditing ? (
                        <input
                          type="text"
                          value={editFormData.title}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              title: e.target.value,
                            })
                          }
                          className="text-sm text-[#181818] w-full border border-[#0176d3] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                        />
                      ) : (
                        <p className="text-sm text-[#181818]">
                          {contact.title || "-"}
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
                          {contact.description || "-"}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-[#706e6b] mb-1">
                        Contact Owner
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs">
                          {contact.contact_owner
                            ?.split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </div>
                        <p className="text-sm text-[#0176d3]">
                          {contact.contact_owner || "-"}
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
                      ) : contact.phone ? (
                        <a
                          href={`tel:${contact.phone}`}
                          className="text-sm text-[#0176d3] hover:underline"
                        >
                          {contact.phone}
                        </a>
                      ) : (
                        <p className="text-sm text-[#181818]">-</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-[#706e6b] mb-1">Email</p>
                      {isInlineEditing ? (
                        <input
                          type="email"
                          value={editFormData.email}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              email: e.target.value,
                            })
                          }
                          className="text-sm text-[#181818] w-full border border-[#0176d3] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                        />
                      ) : contact.email ? (
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-sm text-[#0176d3] hover:underline"
                        >
                          {contact.email}
                        </a>
                      ) : (
                        <p className="text-sm text-[#181818]">-</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-[#706e6b] mb-1">
                        Mailing Address
                      </p>
                      {isInlineEditing ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Street"
                            value={editFormData.mailing_street}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                mailing_street: e.target.value,
                              })
                            }
                            className="text-sm text-[#181818] w-full border border-[#0176d3] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                          />
                          <input
                            type="text"
                            placeholder="City"
                            value={editFormData.mailing_city}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                mailing_city: e.target.value,
                              })
                            }
                            className="text-sm text-[#181818] w-full border border-[#0176d3] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                          />
                          <input
                            type="text"
                            placeholder="State/Province"
                            value={editFormData.mailing_state_province}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                mailing_state_province: e.target.value,
                              })
                            }
                            className="text-sm text-[#181818] w-full border border-[#0176d3] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                          />
                          <input
                            type="text"
                            placeholder="Zip/Postal Code"
                            value={editFormData.mailing_zip_postal_code}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                mailing_zip_postal_code: e.target.value,
                              })
                            }
                            className="text-sm text-[#181818] w-full border border-[#0176d3] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                          />
                          <input
                            type="text"
                            placeholder="Country"
                            value={editFormData.mailing_country}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                mailing_country: e.target.value,
                              })
                            }
                            className="text-sm text-[#181818] w-full border border-[#0176d3] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0176d3]"
                          />
                        </div>
                      ) : (
                        <p className="text-sm text-[#181818]">
                          {[
                            contact.mailing_street,
                            contact.mailing_city,
                            contact.mailing_state_province,
                            contact.mailing_zip_postal_code,
                            contact.mailing_country,
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
                        {contact.contact_owner || "-"}
                      </p>
                      <p className="text-xs text-[#706e6b]">
                        {formatDate(contact.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-[#706e6b] mb-1">
                        Last Modified By
                      </p>
                      <p className="text-sm text-[#0176d3]">
                        {contact.contact_owner || "-"}
                      </p>
                      <p className="text-xs text-[#706e6b]">
                        {formatDate(contact.updated_at)}
                      </p>
                    </div>
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

          {/* Right Column - Related Lists */}
          <div className="bg-white border-l border-[#dddbda] p-6 space-y-6">
            {/* Opportunities */}
            <div className="border border-[#dddbda] rounded">
              <div className="flex items-center justify-between p-4 border-b border-[#dddbda]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#f97316] flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-sm font-medium text-[#181818]">
                    Opportunities (0)
                  </h3>
                </div>
                <ChevronDown className="w-4 h-4 text-[#706e6b]" />
              </div>
            </div>

            {/* Cases */}
            <div className="border border-[#dddbda] rounded">
              <div className="flex items-center justify-between p-4 border-b border-[#dddbda]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#ec4899] flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-sm font-medium text-[#181818]">
                    Cases (0)
                  </h3>
                </div>
                <ChevronDown className="w-4 h-4 text-[#706e6b]" />
              </div>
            </div>

            {/* Files */}
            <div className="border border-[#dddbda] rounded">
              <div className="flex items-center justify-between p-4 border-b border-[#dddbda]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#706e6b] flex items-center justify-center">
                    <Upload className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-sm font-medium text-[#181818]">
                    Files (0)
                  </h3>
                </div>
                <ChevronDown className="w-4 h-4 text-[#706e6b]" />
              </div>
              <div className="p-6">
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
    </div>
  );
}
