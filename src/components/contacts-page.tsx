"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ChevronDown, RefreshCw, Settings, MoreVertical, Filter, Pencil, Grid3x3, Pin } from "lucide-react"
import ResizableTable from "@/components/resizable-table"

export default function ContactsPage() {
  const columns = [
    { key: "name", label: "Name", defaultWidth: 200, minWidth: 100 },
    { key: "accountName", label: "Account Name", defaultWidth: 180, minWidth: 100 },
    { key: "phone", label: "Phone", defaultWidth: 150, minWidth: 100 },
    { key: "email", label: "Email", defaultWidth: 200, minWidth: 120 },
    { key: "contactOwnerAlias", label: "Contact Owner Alias", defaultWidth: 180, minWidth: 100 },
  ]

  return (
    <div className="h-full flex flex-col bg-[#f3f2f2]">
      {/* Page Header */}
      <div className="bg-white border-b border-[#dddbda] flex-shrink-0">
        <div className="flex items-center justify-between px-6 pt-3">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-normal text-[#181818]">Contacts</h1>
            <div className="flex gap-4">
              <button className="text-[#0176d3] border-b-[3px] border-[#0176d3] pb-2 font-normal rounded-t-sm flex items-center gap-1">
                Contacts
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
          <Pencil className="w-5 h-5 text-[#0176d3] cursor-pointer hover:-translate-y-0.5 transition-all duration-150" />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="bg-white border border-[#dddbda] rounded-lg overflow-hidden">
            {/* List Header */}
            <div className="p-4 border-b border-[#dddbda]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#9333ea] rounded-full flex items-center justify-center">
                  <div className="w-5 h-5 bg-white rounded-sm"></div>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-normal text-[#181818]">Recently Viewed</h2>
                  <div className="flex items-center gap-2 text-xs text-[#706e6b]">
                    <span>Contacts</span>
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full hover:bg-[#f3f2f2] flex items-center justify-center transition-all duration-150">
                  <Pin className="w-4 h-4 text-[#706e6b]" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-[#706e6b]">0 items • Updated a few seconds ago</p>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button className="bg-white text-[#0176d3] hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 border border-[#dddbda] h-8 px-4 text-sm rounded">
                    Import
                  </Button>
                  <Button className="bg-white text-[#0176d3] hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 border border-[#dddbda] h-8 px-4 text-sm rounded">
                    New
                  </Button>
                  <Button className="bg-white text-[#0176d3] hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 border border-[#dddbda] h-8 px-4 text-sm rounded">
                    Add to Campaign
                  </Button>
                  <Button className="bg-white text-[#0176d3] hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 border border-[#dddbda] h-8 px-4 text-sm rounded">
                    Send Email
                  </Button>
                  <Button className="bg-white text-[#0176d3] hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 border border-[#dddbda] h-8 px-4 text-sm rounded">
                    Assign Label
                  </Button>
                </div>
              </div>
            </div>

            {/* Search and View Controls */}
            <div className="p-4 border-b border-[#dddbda] flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#706e6b]" />
                <Input
                  placeholder="Search this list..."
                  className="w-full pl-10 border border-[#dddbda] hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 h-9 text-sm rounded"
                />
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <button className="w-8 h-8 rounded hover:bg-[#f3f2f2] flex items-center justify-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 border border-[#dddbda]">
                  <Settings className="w-4 h-4 text-[#706e6b]" />
                  <span className="text-xs text-[#0176d3] ml-1">+</span>
                </button>
                <button className="w-8 h-8 rounded hover:bg-[#f3f2f2] flex items-center justify-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 border border-[#dddbda]">
                  <Grid3x3 className="w-4 h-4 text-[#706e6b]" />
                </button>
                <button className="w-8 h-8 rounded hover:bg-[#f3f2f2] flex items-center justify-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 border border-[#dddbda]">
                  <RefreshCw className="w-4 h-4 text-[#706e6b]" />
                </button>
                <button className="w-8 h-8 rounded hover:bg-[#f3f2f2] flex items-center justify-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 border border-[#dddbda]">
                  <Pin className="w-4 h-4 text-[#706e6b]" />
                </button>
                <button className="w-8 h-8 rounded hover:bg-[#f3f2f2] flex items-center justify-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 border border-[#dddbda]">
                  <Pencil className="w-4 h-4 text-[#706e6b]" />
                </button>
                <button className="w-8 h-8 rounded hover:bg-[#f3f2f2] flex items-center justify-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 border border-[#dddbda]">
                  <MoreVertical className="w-4 h-4 text-[#706e6b]" />
                </button>
                <button className="w-8 h-8 rounded hover:bg-[#f3f2f2] flex items-center justify-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 border border-[#dddbda]">
                  <Filter className="w-4 h-4 text-[#706e6b]" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <ResizableTable columns={columns}>
                {/* Empty State */}
                <tr>
                  <td colSpan={columns.length + 1}>
                    <div className="p-16 flex flex-col items-center justify-center">
                      <div className="relative w-56 h-56 mb-6">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#c084fc] to-[#9333ea] rounded-full opacity-80"></div>
                        <div className="absolute inset-12 bg-white rounded-lg flex items-center justify-center shadow-lg">
                          <div className="space-y-3 w-32">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                              <div className="flex-1 space-y-1">
                                <div className="h-2 bg-gray-200 rounded"></div>
                                <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                              <div className="flex-1 space-y-1">
                                <div className="h-2 bg-gray-200 rounded"></div>
                                <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="absolute -top-2 right-12 text-3xl">🦅</div>
                      </div>
                      <h3 className="text-xl font-normal text-[#181818] mb-2">Top sellers add their contacts first</h3>
                      <p className="text-sm text-[#706e6b] mb-6">It's the fastest way to win more deals.</p>
                      <Button className="bg-[#0176d3] text-white hover:bg-[#0159a8] hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 h-9 px-6 text-sm rounded">
                        Add a Contact
                      </Button>
                    </div>
                  </td>
                </tr>
              </ResizableTable>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
