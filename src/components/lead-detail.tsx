"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  ChevronDown,
  Pencil,
  Mail,
  Calendar,
  Phone,
  Plus,
  User,
  Check,
  AlertTriangle,
  Settings,
  Bold,
  Italic,
  Strikethrough,
  Link,
  List,
  ListOrdered,
  Upload,
  Smile,
  AtSign,
  ExternalLink,
} from "lucide-react"
import ConvertLeadModal from "@/components/modals/convert-lead-modal"

export default function LeadDetail() {
  const [isAboutExpanded, setIsAboutExpanded] = useState(true)
  const [isGetInTouchExpanded, setIsGetInTouchExpanded] = useState(true)
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(true)
  const [isSegmentExpanded, setIsSegmentExpanded] = useState(true)
  const [isUpcomingExpanded, setIsUpcomingExpanded] = useState(true)
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false)

  const leadData = {
    name: "Rishab Nagwani",
    firstName: "Rishab",
    lastName: "Nagwani",
    salutation: "Ms.",
    company: "Rishab Nagwani",
  }

  return (
    <div className="h-full flex flex-col bg-[#f3f2f2]">
      {/* Lead Header */}
      <div className="bg-white border-b border-[#dddbda] px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#06a59a] flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-[#706e6b]">Lead</p>
              <h1 className="text-2xl font-normal text-[#181818]">Ms. Rishab Nagwani</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsConvertModalOpen(true)}
              className="bg-white text-[#0176d3] hover:bg-gray-50 border border-[#dddbda] h-9 px-4 text-sm rounded"
            >
              Convert
            </Button>
            <Button className="bg-white text-[#0176d3] hover:bg-gray-50 border border-[#dddbda] h-9 px-4 text-sm rounded">
              Change Owner
            </Button>
            <Button className="bg-white text-[#0176d3] hover:bg-gray-50 border border-[#dddbda] h-9 px-4 text-sm rounded">
              Edit
            </Button>
            <Button variant="outline" className="h-9 w-9 p-0 border-[#dddbda] bg-white hover:bg-gray-50">
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {/* Completed Stage 1 - Rounded left, arrow right */}
            <div
              className="relative h-10 flex items-center justify-center bg-[#7dd3c0]"
              style={{
                width: "200px",
                clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%, 0 0)",
                borderTopLeftRadius: "20px",
                borderBottomLeftRadius: "20px",
              }}
            >
              <Check className="w-5 h-5 text-white" />
            </div>

            {/* Completed Stage 2 - Arrow cutout left, arrow right */}
            <div
              className="relative h-10 flex items-center justify-center bg-[#7dd3c0]"
              style={{
                width: "200px",
                clipPath: "polygon(20px 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 20px 100%, 0 50%)",
              }}
            >
              <Check className="w-5 h-5 text-white" />
            </div>

            {/* Completed Stage 3 - Arrow cutout left, arrow right */}
            <div
              className="relative h-10 flex items-center justify-center bg-[#7dd3c0]"
              style={{
                width: "200px",
                clipPath: "polygon(20px 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 20px 100%, 0 50%)",
              }}
            >
              <Check className="w-5 h-5 text-white" />
            </div>

            {/* Current Stage - Unqualified - Arrow cutout left, arrow right */}
            <div
              className="relative h-10 flex items-center justify-center bg-[#032d60]"
              style={{
                width: "240px",
                clipPath: "polygon(20px 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 20px 100%, 0 50%)",
              }}
            >
              <span className="text-white text-sm font-medium">Unqualified</span>
            </div>

            {/* Future Stage - Converted - Arrow cutout left, rounded right */}
            <div
              className="relative h-10 flex items-center justify-center bg-[#c9c9c9]"
              style={{
                width: "240px",
                clipPath: "polygon(20px 0, 100% 0, 100% 100%, 20px 100%, 0 50%)",
                borderTopRightRadius: "20px",
                borderBottomRightRadius: "20px",
              }}
            >
              <span className="text-[#706e6b] text-sm font-medium">Converted</span>
            </div>
          </div>

          {/* Mark Status as Complete Button */}
          <div className="ml-6">
            <Button className="bg-[#0176d3] text-white hover:bg-[#0159a8] h-9 px-4 text-sm rounded flex items-center gap-2">
              <Check className="w-4 h-4" />
              Mark Status as Complete
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-[380px_1fr_380px] gap-0">
          {/* Left Column - About, Get in Touch, History, Segment */}
          <div className="bg-white border-r border-[#dddbda] p-6 space-y-6">
            {/* About Section */}
            <div>
              <button
                onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                className="flex items-center gap-2 w-full text-left mb-4"
              >
                <ChevronDown
                  className={`w-5 h-5 text-[#706e6b] transition-transform ${!isAboutExpanded ? "-rotate-90" : ""}`}
                />
                <h2 className="text-base font-normal text-[#181818]">About</h2>
              </button>
              {isAboutExpanded && (
                <div className="space-y-4 pl-7">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-[#706e6b] mb-1">Name</p>
                      <p className="text-sm text-[#181818]">Ms. Rishab Nagwani</p>
                    </div>
                    <Pencil className="w-4 h-4 text-[#706e6b] cursor-pointer" />
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-[#706e6b] mb-1">Company</p>
                      <p className="text-sm text-[#181818]">Rishab Nagwani</p>
                    </div>
                    <Pencil className="w-4 h-4 text-[#706e6b] cursor-pointer" />
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-[#706e6b] mb-1">Title</p>
                      <p className="text-sm text-[#181818]">asdasd</p>
                    </div>
                    <Pencil className="w-4 h-4 text-[#706e6b] cursor-pointer" />
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-[#706e6b] mb-1">Website</p>
                      <a href="#" className="text-sm text-[#0176d3] hover:underline">
                        asdasdas
                      </a>
                    </div>
                    <Pencil className="w-4 h-4 text-[#706e6b] cursor-pointer" />
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-[#706e6b] mb-1">Description</p>
                      <p className="text-sm text-[#181818]">dasdasd</p>
                    </div>
                    <Pencil className="w-4 h-4 text-[#706e6b] cursor-pointer" />
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-[#706e6b] mb-1">Lead Status</p>
                      <p className="text-sm text-[#181818]">Nurturing</p>
                    </div>
                    <Pencil className="w-4 h-4 text-[#706e6b] cursor-pointer" />
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-[#706e6b] mb-1">Lead Owner</p>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#706e6b] flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <a href="#" className="text-sm text-[#0176d3] hover:underline">
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
                  className={`w-5 h-5 text-[#706e6b] transition-transform ${!isGetInTouchExpanded ? "-rotate-90" : ""}`}
                />
                <h2 className="text-base font-normal text-[#181818]">Get in Touch</h2>
              </button>
              {isGetInTouchExpanded && (
                <div className="space-y-4 pl-7">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-[#706e6b] mb-1">Phone</p>
                      <a href="tel:09833014890" className="text-sm text-[#0176d3] hover:underline">
                        09833014890
                      </a>
                    </div>
                    <Pencil className="w-4 h-4 text-[#706e6b] cursor-pointer" />
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-[#706e6b] mb-1">Email</p>
                      <a href="mailto:nagwanirishab@gmail.com" className="text-sm text-[#0176d3] hover:underline">
                        nagwanirishab@gmail.com
                      </a>
                    </div>
                    <Pencil className="w-4 h-4 text-[#706e6b] cursor-pointer" />
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-[#706e6b] mb-1">Address</p>
                      <a href="#" className="text-sm text-[#0176d3] hover:underline block">
                        B-302 Greenwoods CHS, Near WEH Metro Station, Andheri-Kur...
                      </a>
                      <a href="#" className="text-sm text-[#0176d3] hover:underline block">
                        Mumbai 400093
                      </a>
                      <a href="#" className="text-sm text-[#0176d3] hover:underline block">
                        Albania
                      </a>
                      {/* Map */}
                      <div className="mt-2 w-full h-32 bg-[#e5e7eb] rounded relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#a7f3d0] via-[#bfdbfe] to-[#ddd6fe]">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="w-6 h-6 bg-red-500 rounded-full relative">
                              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-red-500"></div>
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

            {/* Segment Section */}
            <div>
              <button
                onClick={() => setIsSegmentExpanded(!isSegmentExpanded)}
                className="flex items-center gap-2 w-full text-left mb-4"
              >
                <ChevronDown
                  className={`w-5 h-5 text-[#706e6b] transition-transform ${!isSegmentExpanded ? "-rotate-90" : ""}`}
                />
                <h2 className="text-base font-normal text-[#181818]">Segment</h2>
              </button>
              {isSegmentExpanded && (
                <div className="space-y-4 pl-7">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-[#706e6b] mb-1">No. of Employees</p>
                      <p className="text-sm text-[#181818]">123</p>
                    </div>
                    <Pencil className="w-4 h-4 text-[#706e6b] cursor-pointer" />
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-[#706e6b] mb-1">Annual Revenue</p>
                      <p className="text-sm text-[#181818]">₹1,23,12,312</p>
                    </div>
                    <Pencil className="w-4 h-4 text-[#706e6b] cursor-pointer" />
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-[#706e6b] mb-1">Lead Source</p>
                      <p className="text-sm text-[#181818]">Seminar - Partner</p>
                    </div>
                    <Pencil className="w-4 h-4 text-[#706e6b] cursor-pointer" />
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-[#706e6b] mb-1">Industry</p>
                      <p className="text-sm text-[#181818]">Chemicals</p>
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
                  className={`w-5 h-5 text-[#706e6b] transition-transform ${!isHistoryExpanded ? "-rotate-90" : ""}`}
                />
                <h2 className="text-base font-normal text-[#181818]">History</h2>
              </button>
              {isHistoryExpanded && (
                <div className="space-y-4 pl-7">
                  <div>
                    <p className="text-xs text-[#706e6b] mb-1">Created By</p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#706e6b] flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <a href="#" className="text-sm text-[#0176d3] hover:underline">
                        Rishab Nagwani
                      </a>
                      <span className="text-sm text-[#706e6b]">, 28/10/2025, 1:59 pm</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-[#706e6b] mb-1">Last Modified By</p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#706e6b] flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <a href="#" className="text-sm text-[#0176d3] hover:underline">
                        Rishab Nagwani
                      </a>
                      <span className="text-sm text-[#706e6b]">, 28/10/2025, 1:59 pm</span>
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
              <AlertTriangle className="w-5 h-5 text-[#8a6d3b] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-[#8a6d3b]">
                  Emails with this lead aren't automatically captured. Their domain is on the Excluded Addresses list.{" "}
                  <a href="#" className="underline">
                    Learn More in Help
                  </a>
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-[#706e6b]">Filters: Within 2 months • All activities • All types</p>
                <button className="text-[#0176d3] hover:underline">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <button className="text-[#0176d3] hover:underline">Refresh</button>
                <span className="text-[#706e6b]">•</span>
                <button className="text-[#0176d3] hover:underline">Expand All</button>
              </div>
            </div>

            {/* Upcoming & Overdue */}
            <div className="bg-white rounded mb-4">
              <button
                onClick={() => setIsUpcomingExpanded(!isUpcomingExpanded)}
                className="w-full flex items-center gap-2 p-4 text-left"
              >
                <ChevronDown
                  className={`w-5 h-5 text-[#706e6b] transition-transform ${!isUpcomingExpanded ? "-rotate-90" : ""}`}
                />
                <h3 className="text-sm font-medium text-[#181818]">Upcoming & Overdue</h3>
              </button>
              {isUpcomingExpanded && (
                <div className="px-4 pb-4">
                  <div className="bg-[#f3f2f2] rounded p-6 text-center">
                    <p className="text-sm text-[#706e6b] mb-2">No activities to show.</p>
                    <p className="text-xs text-[#706e6b]">
                      Get started by sending an email, scheduling a task, and more.
                    </p>
                  </div>
                  <div className="mt-4 bg-[#f3f2f2] rounded p-4 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#706e6b] flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-[#706e6b]">To change what's shown, try changing your filters.</p>
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

          {/* Right Column - Slack Channel */}
          <div className="bg-white border-l border-[#dddbda] p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 15a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2h2v2zm1 0a2 2 0 0 1 2-2a2 2 0 0 1-2 2H9zm0 1a2 2 0 0 1-2 2a2 2 0 0 1-2-2V4a2 2 0 0 1-2-2a2 2 0 0 1 2-2h5z"
                    fill="#E01E5A"
                  />
                  <path
                    d="M9 6a2 2 0 0 1-2-2a2 2 0 0 1 2-2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h5zm0-1a2 2 0 0 1-2 2a2 2 0 0 1-2-2V9zm0-1a2 2 0 0 1-2 2a2 2 0 0 1-2-2V4a2 2 0 0 1-2-2a2 2 0 0 1 2-2h5z"
                    fill="#36C5F0"
                  />
                  <path
                    d="M18 9a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-2V9zm-1 0a2 2 0 0 1-2 2a2 2 0 0 1-2-2V4a2 2 0 0 1-2-2a2 2 0 0 1 2-2h5z"
                    fill="#2EB67D"
                  />
                  <path
                    d="M15 18a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2v-2h2zm0-1a2 2 0 0 1-2-2a2 2 0 0 1-2 2h5a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-5z"
                    fill="#ECB22E"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-normal text-[#181818]">Slack Channel</h2>
            </div>

            {/* Slack Illustration */}
            <div className="mb-6">
              <img src="/placeholder.svg?height=200&width=300" alt="Slack collaboration" className="w-full h-auto" />
            </div>

            <h3 className="text-xl font-normal text-[#181818] mb-3">Better collaboration with Slack</h3>
            <p className="text-sm text-[#706e6b] mb-4">
              Slack Channels in Salesforce are a place to collaborate and talk about your work. Anyone can follow the
              conversation here or in the Slack app.{" "}
              <a href="#" className="text-[#0176d3] hover:underline">
                Learn more about Slack
              </a>
            </p>

            {/* Text Editor Toolbar */}
            <div className="border border-[#dddbda] rounded mb-4">
              <div className="flex items-center gap-1 p-2 border-b border-[#dddbda]">
                <button className="p-1.5 hover:bg-gray-100 rounded">
                  <Bold className="w-4 h-4 text-[#706e6b]" />
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded">
                  <Italic className="w-4 h-4 text-[#706e6b]" />
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded">
                  <Strikethrough className="w-4 h-4 text-[#706e6b]" />
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded">
                  <Link className="w-4 h-4 text-[#706e6b]" />
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded">
                  <ListOrdered className="w-4 h-4 text-[#706e6b]" />
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded">
                  <List className="w-4 h-4 text-[#706e6b]" />
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded">
                  <Upload className="w-4 h-4 text-[#706e6b]" />
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded">
                  <Smile className="w-4 h-4 text-[#706e6b]" />
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded">
                  <AtSign className="w-4 h-4 text-[#706e6b]" />
                </button>
              </div>
              <textarea
                placeholder="Post an update on this lead or @mention someone to start the conversation."
                className="w-full p-3 text-sm resize-none border-none focus:outline-none"
                rows={4}
              />
            </div>

            <p className="text-xs text-[#706e6b] mb-4">
              Already using Slack?{" "}
              <a href="#" className="text-[#0176d3] hover:underline flex items-center gap-1 inline-flex">
                Link an existing channel
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>

            {/* Duplicates Warning */}
            <div className="border border-[#dddbda] rounded p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#f97316] flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm text-[#181818]">We found no potential duplicates of this Lead.</p>
            </div>
          </div>
        </div>
      </div>
      <ConvertLeadModal open={isConvertModalOpen} onOpenChange={setIsConvertModalOpen} leadData={leadData} />
    </div>
  )
}
