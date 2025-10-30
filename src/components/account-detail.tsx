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
  Building2,
} from "lucide-react";

export default function AccountDetail() {
  const [isAboutExpanded, setIsAboutExpanded] = useState(true);
  const [isGetInTouchExpanded, setIsGetInTouchExpanded] = useState(true);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(true);
  const [isUpcomingExpanded, setIsUpcomingExpanded] = useState(true);
  const [isContactsExpanded, setIsContactsExpanded] = useState(true);
  const [isOpportunitiesExpanded, setIsOpportunitiesExpanded] = useState(true);

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
              <h1 className="text-2xl font-normal text-[#181818]">asdasd</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
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
                    <div>
                      <p className="text-xs text-[#706e6b] mb-1">
                        Account Name
                      </p>
                      <p className="text-sm text-[#181818]">asdasd</p>
                    </div>
                    <Pencil className="w-4 h-4 text-[#706e6b] cursor-pointer" />
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-[#706e6b] mb-1">Website</p>
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
                      <p className="text-xs text-[#706e6b] mb-1">Type</p>
                      <p className="text-sm text-[#181818]">Analyst</p>
                    </div>
                    <Pencil className="w-4 h-4 text-[#706e6b] cursor-pointer" />
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-[#706e6b] mb-1">Description</p>
                      <p className="text-sm text-[#181818]">123123</p>
                    </div>
                    <Pencil className="w-4 h-4 text-[#706e6b] cursor-pointer" />
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-[#706e6b] mb-1">
                        Parent Account
                      </p>
                      <p className="text-sm text-[#706e6b]">--</p>
                    </div>
                    <Pencil className="w-4 h-4 text-[#706e6b] cursor-pointer" />
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-[#706e6b] mb-1">
                        Account Owner
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
                    <div>
                      <p className="text-xs text-[#706e6b] mb-1">Phone</p>
                      <a
                        href="tel:456456456"
                        className="text-sm text-[#0176d3] hover:underline"
                      >
                        456456456
                      </a>
                    </div>
                    <Pencil className="w-4 h-4 text-[#706e6b] cursor-pointer" />
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-[#706e6b] mb-1">
                        Billing Address
                      </p>
                      <a
                        href="#"
                        className="text-sm text-[#0176d3] hover:underline block"
                      >
                        B-302 Greenwoods CHS, Near WEH Metro Station,
                        Andheri-Kur...
                      </a>
                      <a
                        href="#"
                        className="text-sm text-[#0176d3] hover:underline block"
                      >
                        Mumbai 400093
                      </a>
                      <a
                        href="#"
                        className="text-sm text-[#0176d3] hover:underline block"
                      >
                        Afghanistan
                      </a>
                      {/* Map */}
                      <div className="mt-2 w-full h-32 bg-[#e5e7eb] rounded relative overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-br from-[#a7f3d0] via-[#bfdbfe] to-[#ddd6fe]">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="w-6 h-6 bg-red-500 rounded-full relative">
                              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-8 border-t-red-500"></div>
                            </div>
                          </div>
                          <div className="absolute top-4 left-4 bg-white px-2 py-1 rounded text-xs font-medium">
                            E952
                          </div>
                        </div>
                      </div>
                    </div>
                    <Pencil className="w-4 h-4 text-[#706e6b] cursor-pointer" />
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-[#706e6b] mb-1">
                        Shipping Address
                      </p>
                      <a
                        href="#"
                        className="text-sm text-[#0176d3] hover:underline block"
                      >
                        B-302 Greenwoods CHS, Near WEH Metro Station,
                        Andheri-Kur...
                      </a>
                      <a
                        href="#"
                        className="text-sm text-[#0176d3] hover:underline block"
                      >
                        Mumbai 400093
                      </a>
                      <a
                        href="#"
                        className="text-sm text-[#0176d3] hover:underline block"
                      >
                        Aland Islands
                      </a>
                      {/* Map */}
                      <div className="mt-2 w-full h-32 bg-[#e5e7eb] rounded relative overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-br from-[#a7f3d0] via-[#bfdbfe] to-[#ddd6fe]">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="w-6 h-6 bg-red-500 rounded-full relative">
                              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-8 border-t-red-500"></div>
                            </div>
                          </div>
                          <div className="absolute top-4 left-4 bg-white px-2 py-1 rounded text-xs font-medium">
                            E952
                          </div>
                        </div>
                      </div>
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
                        , 28/10/2025, 2:01 pm
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
                        , 28/10/2025, 2:01 pm
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
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M6 12h12M12 6v12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
                <button className="text-[#706e6b] hover:text-[#181818]">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M7 10l5 5 5-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-[#706e6b] mt-2">
                Post an update on this account or @mention someone to start the
                conversation.
              </p>
            </div>

            {/* Contacts */}
            <div className="border border-[#dddbda] rounded">
              <button
                onClick={() => setIsContactsExpanded(!isContactsExpanded)}
                className="w-full flex items-center justify-between p-4 border-b border-[#dddbda]"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#9b59b6] flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-sm font-medium text-[#181818]">
                    Contacts (1)
                  </h3>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#706e6b] transition-transform ${
                    !isContactsExpanded ? "-rotate-90" : ""
                  }`}
                />
              </button>
              {isContactsExpanded && (
                <div className="p-4">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-[#9b59b6] flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <a
                        href="#"
                        className="text-sm text-[#0176d3] hover:underline font-medium block"
                      >
                        meow Nagwani
                      </a>
                      <div className="text-xs text-[#706e6b] space-y-1 mt-1">
                        <div className="flex items-start">
                          <span className="w-12 shrink-0">Title:</span>
                          <span className="flex-1">dgfdgdfg</span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-12 shrink-0">Email:</span>
                          <a
                            href="mailto:nagwanirishab@gmail.com"
                            className="text-[#0176d3] hover:underline flex-1"
                          >
                            nagwanirishab@gmail.com
                          </a>
                        </div>
                        <div className="flex items-start">
                          <span className="w-12 shrink-0">Phone:</span>
                          <a
                            href="tel:09833014890"
                            className="text-[#0176d3] hover:underline flex-1"
                          >
                            09833014890
                          </a>
                        </div>
                      </div>
                    </div>
                    <button className="text-[#706e6b] hover:text-[#181818]">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-right">
                    <a
                      href="#"
                      className="text-sm text-[#0176d3] hover:underline"
                    >
                      View All
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Opportunities */}
            <div className="border border-[#dddbda] rounded">
              <button
                onClick={() =>
                  setIsOpportunitiesExpanded(!isOpportunitiesExpanded)
                }
                className="w-full flex items-center justify-between p-4 border-b border-[#dddbda]"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#f97316] flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-sm font-medium text-[#181818]">
                    Opportunities (2)
                  </h3>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#706e6b] transition-transform ${
                    !isOpportunitiesExpanded ? "-rotate-90" : ""
                  }`}
                />
              </button>
              {isOpportunitiesExpanded && (
                <div className="p-4 space-y-4">
                  <div>
                    <a
                      href="#"
                      className="text-sm text-[#0176d3] hover:underline font-medium block mb-2"
                    >
                      Rishab Nagwani erew
                    </a>
                    <div className="text-xs text-[#706e6b] space-y-1">
                      <div className="flex items-start">
                        <span className="w-24 shrink-0">Stage:</span>
                        <span className="flex-1">Propose</span>
                      </div>
                      <div className="flex items-start">
                        <span className="w-24 shrink-0">Amount:</span>
                        <span className="flex-1">₹56,000.00</span>
                      </div>
                      <div className="flex items-start">
                        <span className="w-24 shrink-0">Close Date:</span>
                        <span className="flex-1">30/10/2025</span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-[#dddbda] pt-4">
                    <a
                      href="#"
                      className="text-sm text-[#0176d3] hover:underline font-medium block mb-2"
                    >
                      Rishab Nagwani
                    </a>
                    <div className="text-xs text-[#706e6b] space-y-1">
                      <div className="flex items-start">
                        <span className="w-24 shrink-0">Stage:</span>
                        <span className="flex-1">Closed Lost</span>
                      </div>
                      <div className="flex items-start">
                        <span className="w-24 shrink-0">Amount:</span>
                        <span className="flex-1">₹56,000.00</span>
                      </div>
                      <div className="flex items-start">
                        <span className="w-24 shrink-0">Close Date:</span>
                        <span className="flex-1">23/10/2025</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right pt-2">
                    <a
                      href="#"
                      className="text-sm text-[#0176d3] hover:underline"
                    >
                      View All
                    </a>
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
