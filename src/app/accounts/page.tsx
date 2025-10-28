"use client"

import { Search, ChevronDown, Settings, Grid3x3, RefreshCw, Pin, Edit, PieChart, Filter, X } from "lucide-react"
import { useState } from "react"
import ResizableTable from "@/components/resizable-table"
import { ButtonGroup, IconButtonGroup, IconButton, GroupedIconButtons } from "@/components/ui/button-group"

export default function AccountsPage() {
  const [isNewAccountModalOpen, setIsNewAccountModalOpen] = useState(false)
  const [accountErrors, setAccountErrors] = useState<Record<string, boolean>>({})
  const hasRecords = false // Currently no records in the list

  const columns = [
    { key: "accountName", label: "Account Name", defaultWidth: 250, minWidth: 120 },
    { key: "phone", label: "Phone", defaultWidth: 150, minWidth: 100 },
    { key: "accountOwnerAlias", label: "Account Owner Alias", defaultWidth: 180, minWidth: 100 },
  ]

  const validateAccountForm = () => {
    const errors: Record<string, boolean> = {}
    const accountNameInput = document.querySelector<HTMLInputElement>('input[name="accountName"]')

    if (!accountNameInput?.value.trim()) {
      errors.accountName = true
    }

    setAccountErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAccountSave = () => {
    if (validateAccountForm()) {
      setIsNewAccountModalOpen(false)
      setAccountErrors({})
    }
  }

  const actionButtons = [{ label: "New" }, { label: "Import" }, { label: "Assign Label", hasDropdown: true }]

  return (
    <>
      <div className="h-full flex flex-col bg-[#f3f2f2]">
        {/* Page Header - Fixed */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-normal text-[#080707]">Accounts</h1>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1 text-[#0176d3] font-normal hover:text-[#014486] transition-colors">
                  Accounts
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="h-6 w-px bg-[#0176d3]" />
              </div>
            </div>
            <button className="text-gray-600 hover:text-[#0176d3] transition-colors">
              <Edit className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* List View Header */}
          <div className="bg-white px-8 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#6b5eae] flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
                  </svg>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Accounts</span>
                  <button className="flex items-center gap-1 text-lg font-normal text-[#080707]">
                    Recently Viewed
                    <ChevronDown className="w-5 h-5" />
                  </button>
                  <button className="text-gray-600 hover:text-[#0176d3] transition-colors">
                    <Pin className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <ButtonGroup buttons={actionButtons} />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">0 items • Updated a few seconds ago</p>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search this list..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-1 focus:ring-[#0176d3]"
                  />
                </div>
                <IconButtonGroup>
                  <IconButton icon={<Settings className="w-4 h-4" />} hasDropdown />
                  <IconButton icon={<Grid3x3 className="w-4 h-4" />} hasDropdown />
                  <IconButton icon={<RefreshCw className="w-4 h-4" />} />
                  <IconButton icon={<Pin className="w-4 h-4" />} />
                  <IconButton icon={<Edit className="w-4 h-4" />} />
                  <GroupedIconButtons
                    buttons={[{ icon: <PieChart className="w-4 h-4" /> }, { icon: <Filter className="w-4 h-4" /> }]}
                    disabled={!hasRecords}
                  />
                </IconButtonGroup>
              </div>
            </div>
          </div>

          <ResizableTable columns={columns}>
            {/* Empty State */}
            <tr>
              <td colSpan={columns.length + 1}>
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="relative w-48 h-48 mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-300 to-purple-400 rounded-full opacity-80" />
                    <div className="absolute inset-8 bg-white rounded-lg shadow-lg flex items-center justify-center">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-200" />
                          <div className="h-3 w-20 bg-gray-200 rounded" />
                        </div>
                        <div className="h-2 w-24 bg-gray-200 rounded" />
                        <div className="h-2 w-28 bg-gray-200 rounded" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <svg className="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-normal text-gray-700 mb-2">Accounts show where your contacts work</h3>
                  <p className="text-sm text-gray-600 mb-6">Improve your reporting and deal tracking with accounts.</p>
                  <button
                    onClick={() => setIsNewAccountModalOpen(true)}
                    className="px-6 py-2 bg-[#0176d3] text-white rounded-md font-normal hover:bg-[#014486] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150"
                  >
                    Add an Account
                  </button>
                </div>
              </td>
            </tr>
          </ResizableTable>
        </div>
      </div>

      {/* New Account Modal */}
      {isNewAccountModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsNewAccountModalOpen(false)
                setAccountErrors({})
              }}
              className="absolute -top-3 -right-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-[#0176d3] hover:bg-gray-50 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <div className="border-b border-gray-200 px-8 py-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-normal text-gray-800">New Account</h2>
                <p className="text-sm text-gray-600">
                  <span className="text-red-600">*</span> = Required Information
                </p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(85vh-180px)] px-8 py-6">
              {/* About Section */}
              <div className="mb-6">
                <h3 className="text-lg font-normal text-gray-700 bg-gray-100 px-4 py-2 mb-4">About</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-normal text-gray-700 mb-1">
                      <span className="text-red-600">*</span> Account Name
                    </label>
                    <input
                      type="text"
                      name="accountName"
                      className={`w-full px-4 py-2 border ${accountErrors.accountName ? "border-red-500" : "border-gray-300"} rounded-md hover:shadow-md hover:-translate-y-0.5 transition-all duration-150`}
                    />
                    {accountErrors.accountName && (
                      <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                        <span className="inline-block w-4 h-4 border-2 border-red-600 rounded-full relative">
                          <span className="absolute inset-0 flex items-center justify-center text-red-600 text-xs font-bold">
                            /
                          </span>
                        </span>
                        Complete this field.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-normal text-gray-700 mb-1">Website</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-normal text-gray-700 mb-1">Type</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-md hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
                      <option>--None--</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-normal text-gray-700 mb-1">Description</label>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-normal text-gray-700 mb-1">Parent Account</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search Accounts..."
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                      />
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-sm font-normal text-gray-700 mb-2">Account Owner</p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-sm">
                        RN
                      </div>
                      <span className="text-sm text-gray-700">Rishab Nagwani</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Get in Touch Section */}
              <div className="mb-6">
                <h3 className="text-lg font-normal text-gray-700 bg-gray-100 px-4 py-2 mb-4">Get in Touch</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-normal text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                    />
                  </div>
                </div>
              </div>

              {/* Billing Address Section */}
              <div className="mb-6">
                <h3 className="text-lg font-normal text-gray-700 bg-gray-100 px-4 py-2 mb-4">Billing Address</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-normal text-gray-700 mb-1">Billing Country</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-md hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
                      <option>--None--</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-normal text-gray-700 mb-1">Billing Street</label>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-normal text-gray-700 mb-1">Billing City</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-normal text-gray-700 mb-1">Billing Zip/Postal Code</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-normal text-gray-700 mb-1">Billing State/Province</label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-md hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
                        <option>--None--</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address Section */}
              <div className="mb-6">
                <h3 className="text-lg font-normal text-gray-700 bg-gray-100 px-4 py-2 mb-4">Shipping Address</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-normal text-gray-700 mb-1">Shipping Country</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-md hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
                      <option>--None--</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-normal text-gray-700 mb-1">Shipping Street</label>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-normal text-gray-700 mb-1">Shipping City</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-normal text-gray-700 mb-1">Shipping Zip/Postal Code</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-normal text-gray-700 mb-1">Shipping State/Province</label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-md hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
                        <option>--None--</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-8 py-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsNewAccountModalOpen(false)
                  setAccountErrors({})
                }}
                className="px-6 py-2 text-[#0176d3] border border-[#0176d3] rounded-md font-normal hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
              >
                Cancel
              </button>
              <button
                onClick={handleAccountSave}
                className="px-6 py-2 text-[#0176d3] border border-[#0176d3] rounded-md font-normal hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
              >
                Save & New
              </button>
              <button
                onClick={handleAccountSave}
                className="px-6 py-2 bg-[#0176d3] text-white rounded-md font-normal hover:bg-[#014486] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
