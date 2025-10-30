"use client";

import { useState } from "react";
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
  Check,
} from "lucide-react";

export default function OpportunityDetail() {
  const [isAboutExpanded, setIsAboutExpanded] = useState(true);
  const [isStatusExpanded, setIsStatusExpanded] = useState(true);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(true);
  const [isUpcomingExpanded, setIsUpcomingExpanded] = useState(true);
  const [isGuidanceExpanded, setIsGuidanceExpanded] = useState(true);
  const [isContactRolesExpanded, setIsContactRolesExpanded] = useState(true);
  const [isFilesExpanded, setIsFilesExpanded] = useState(true);

  const stages = [
    { name: "Qualification", completed: true },
    { name: "Needs Analysis", completed: true },
    { name: "Propose", completed: false, current: true },
    { name: "Negotiate", completed: false },
    { name: "Closed", completed: false },
  ];

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
              <h1 className="text-2xl font-normal text-[#181818]">
                Rishab Nagwani erew
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button className="bg-white text-[#0176d3] hover:bg-gray-50 border border-[#dddbda] h-9 px-4 text-sm rounded">
              New Event
            </Button>
            <Button className="bg-white text-[#0176d3] hover:bg-gray-50 border border-[#dddbda] h-9 px-4 text-sm rounded">
              New Task
            </Button>
            <Button className="bg-white text-[#0176d3] hover:bg-gray-50 border border-[#dddbda] h-9 px-4 text-sm rounded">
              Edit
            </Button>
            <Button
              variant="outline"
              className="h-9 w-9 p-0 border-[#dddbda] bg-white hover:bg-gray-50"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
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
                <div>
                  <p className="text-xs text-[#706e6b] mb-1">Amount</p>
                  <p className="text-sm text-[#181818]">₹56,000.00</p>
                </div>
                <Pencil className="w-4 h-4 text-[#706e6b] cursor-pointer" />
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-[#706e6b] mb-1">Description</p>
                  <p className="text-sm text-[#181818]">sdfdsfdsfdsf</p>
                </div>
                <Pencil className="w-4 h-4 text-[#706e6b] cursor-pointer" />
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
                      Rishab Nagwani
                    </a>
                  </div>
                </div>
                <User className="w-4 h-4 text-[#0176d3] cursor-pointer" />
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
                    <div>
                      <p className="text-xs text-[#706e6b] mb-1">Stage</p>
                      <p className="text-sm text-[#181818]">Propose</p>
                    </div>
                    <Pencil className="w-4 h-4 text-[#706e6b] cursor-pointer" />
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-[#706e6b] mb-1">
                        Probability (%)
                      </p>
                      <p className="text-sm text-[#181818]">50%</p>
                    </div>
                    <Pencil className="w-4 h-4 text-[#706e6b] cursor-pointer" />
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-[#706e6b] mb-1">
                        Forecast Category
                      </p>
                      <p className="text-sm text-[#181818]">Best Case</p>
                    </div>
                    <Pencil className="w-4 h-4 text-[#706e6b] cursor-pointer" />
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-[#706e6b] mb-1">Next Step</p>
                      <p className="text-sm text-[#181818]">asdasdasdasd</p>
                    </div>
                    <Pencil className="w-4 h-4 text-[#706e6b] cursor-pointer" />
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
                    <div>
                      <p className="text-xs text-[#706e6b] mb-1">
                        Opportunity Name
                      </p>
                      <p className="text-sm text-[#181818]">
                        Rishab Nagwani erew
                      </p>
                    </div>
                    <Pencil className="w-4 h-4 text-[#706e6b] cursor-pointer" />
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-[#706e6b] mb-1">
                        Account Name
                      </p>
                      <a
                        href="#"
                        className="text-sm text-[#0176d3] hover:underline"
                      >
                        asdasd
                      </a>
                    </div>
                    <Pencil className="w-4 h-4 text-[#706e6b] cursor-pointer" />
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-[#706e6b] mb-1">Close Date</p>
                      <p className="text-sm text-[#181818]">30/10/2025</p>
                    </div>
                    <Pencil className="w-4 h-4 text-[#706e6b] cursor-pointer" />
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-[#706e6b] mb-1">Amount</p>
                      <p className="text-sm text-[#181818]">₹56,000.00</p>
                    </div>
                    <Pencil className="w-4 h-4 text-[#706e6b] cursor-pointer" />
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-[#706e6b] mb-1">Description</p>
                      <p className="text-sm text-[#181818]">sdfdsfdsfdsf</p>
                    </div>
                    <Pencil className="w-4 h-4 text-[#706e6b] cursor-pointer" />
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
                        Rishab Nagwani
                      </a>
                      <span className="text-sm text-[#706e6b]">
                        , 28/10/2025, 2:02 pm
                      </span>
                    </div>
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
                        Rishab Nagwani
                      </a>
                      <span className="text-sm text-[#706e6b]">
                        , 28/10/2025, 2:02 pm
                      </span>
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
