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
  Upload,
  Building2,
} from "lucide-react";

export default function ContactDetail() {
  const [isAboutExpanded, setIsAboutExpanded] = useState(true);
  const [isGetInTouchExpanded, setIsGetInTouchExpanded] = useState(true);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(true);
  const [isUpcomingExpanded, setIsUpcomingExpanded] = useState(true);

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
              <h1 className="text-2xl font-normal text-[#181818]">
                Ms. meow Nagwani
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button className="bg-white text-[#0176d3] hover:bg-gray-50 border border-[#dddbda] h-9 px-4 text-sm rounded">
              <User className="w-4 h-4 mr-2" />
              Follow
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
                      <p className="text-xs text-[#706e6b] mb-1">Name</p>
                      <p className="text-sm text-[#181818]">Ms. meow Nagwani</p>
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
                      <p className="text-xs text-[#706e6b] mb-1">Title</p>
                      <p className="text-sm text-[#181818]">dqfdqdfq</p>
                    </div>
                    <Pencil className="w-4 h-4 text-[#706e6b] cursor-pointer" />
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-[#706e6b] mb-1">Reports To</p>
                      <p className="text-sm text-[#706e6b]">--</p>
                    </div>
                    <Pencil className="w-4 h-4 text-[#706e6b] cursor-pointer" />
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-[#706e6b] mb-1">Description</p>
                      <p className="text-sm text-[#181818]">dfqfdqdfqfq</p>
                    </div>
                    <Pencil className="w-4 h-4 text-[#706e6b] cursor-pointer" />
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-[#706e6b] mb-1">
                        Contact Owner
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
                        href="tel:09833014890"
                        className="text-sm text-[#0176d3] hover:underline"
                      >
                        09833014890
                      </a>
                    </div>
                    <Pencil className="w-4 h-4 text-[#706e6b] cursor-pointer" />
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-[#706e6b] mb-1">Email</p>
                      <a
                        href="mailto:nagwanirishab@gmail.com"
                        className="text-sm text-[#0176d3] hover:underline"
                      >
                        nagwanirishab@gmail.com
                      </a>
                    </div>
                    <Pencil className="w-4 h-4 text-[#706e6b] cursor-pointer" />
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-[#706e6b] mb-1">
                        Mailing Address
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
                        Albania
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
