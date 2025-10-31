"use client"

import { Search, ChevronDown, Settings, Grid3x3, RefreshCw, Pin, Edit, PieChart, Filter, X, MoreVertical, AlertCircle, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import axios from "axios"
import Link from "next/link"
import ResizableTable from "@/components/resizable-table"
import { ButtonGroup, IconButtonGroup, IconButton, GroupedIconButtons } from "@/components/ui/button-group"
import { useToast } from "@/components/toast-provider"

// Initial state for account form
const initialAccountFormData = {
  name: "",
  website: "",
  type: "",
  description: "",
  parentAccount: "",
  phone: "",
  billingCountry: "",
  billingStreet: "",
  billingCity: "",
  billingZipPostalCode: "",
  billingStateProvince: "",
  shippingCountry: "",
  shippingStreet: "",
  shippingCity: "",
  shippingZipPostalCode: "",
  shippingStateProvince: "",
}

export default function AccountsPage() {
  const { showToast } = useToast()

  // Account list state
  const [accounts, setAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Modal states
  const [isNewAccountModalOpen, setIsNewAccountModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingAccountId, setEditingAccountId] = useState<number | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingAccountId, setDeletingAccountId] = useState<number | null>(null)
  const [deletingAccountName, setDeletingAccountName] = useState("")

  // Form state
  const [accountFormData, setAccountFormData] = useState(initialAccountFormData)
  const [accountErrors, setAccountErrors] = useState<Record<string, boolean>>({})

  // Dropdown menu state
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null)

  // Search and sort state
  const [searchQuery, setSearchQuery] = useState("")
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Inline editing state
  const [editingCell, setEditingCell] = useState<{ accountId: number; field: string } | null>(null)
  const [editingValue, setEditingValue] = useState("")

  const hasRecords = accounts.length > 0

  const columns = [
    { key: "accountName", label: "Account Name", defaultWidth: 250, minWidth: 120 },
    { key: "phone", label: "Phone", defaultWidth: 150, minWidth: 100 },
    { key: "accountOwnerAlias", label: "Account Owner Alias", defaultWidth: 180, minWidth: 100 },
  ]

  // Fetch all accounts
  const fetchAccounts = async () => {
    try {
      setLoading(true)
      const response = await axios.get("/api/v1/sobjects/accounts")
      setAccounts(response.data)
    } catch (error) {
      console.error("Error fetching accounts:", error)
      showToast("Failed to fetch accounts. Please try again.", {
        label: "Dismiss",
        onClick: () => {},
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch accounts on mount
  useEffect(() => {
    fetchAccounts()
  }, [])

  // Filter and sort accounts
  const filteredAndSortedAccounts = () => {
    let filtered = [...accounts]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((account) =>
        account.name?.toLowerCase().includes(query) ||
        account.phone?.toLowerCase().includes(query) ||
        account.account_owner?.toLowerCase().includes(query)
      )
    }

    // Apply sorting
    if (sortColumn) {
      filtered.sort((a, b) => {
        let aVal, bVal

        switch (sortColumn) {
          case "accountName":
            aVal = a.name || ""
            bVal = b.name || ""
            break
          case "phone":
            aVal = a.phone || ""
            bVal = b.phone || ""
            break
          case "accountOwnerAlias":
            aVal = a.account_owner || ""
            bVal = b.account_owner || ""
            break
          default:
            return 0
        }

        if (typeof aVal === "string" && typeof bVal === "string") {
          return sortDirection === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal)
        }

        return 0
      })
    }

    return filtered
  }

  const displayedAccounts = filteredAndSortedAccounts()

  // Handle sort
  const handleSort = (columnKey: string, direction: "asc" | "desc") => {
    setSortColumn(columnKey)
    setSortDirection(direction)
  }

  const resetAccountForm = () => {
    setAccountFormData(initialAccountFormData)
    setAccountErrors({})
    setIsEditMode(false)
    setEditingAccountId(null)
  }

  const validateAccountForm = () => {
    const errors: Record<string, boolean> = {}
    if (!accountFormData.name.trim()) {
      errors.name = true
    }
    setAccountErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAccountSave = async () => {
    if (!validateAccountForm()) return

    try {
      const accountData = {
        name: accountFormData.name,
        website: accountFormData.website || null,
        type: accountFormData.type || null,
        description: accountFormData.description || null,
        parent_account_id: null,
        account_owner: "Rishab Nagwani",
        phone: accountFormData.phone || null,
        billing_street: accountFormData.billingStreet || null,
        billing_city: accountFormData.billingCity || null,
        billing_state_province: accountFormData.billingStateProvince || null,
        billing_zip_postal_code: accountFormData.billingZipPostalCode || null,
        billing_country: accountFormData.billingCountry || null,
        shipping_street: accountFormData.shippingStreet || null,
        shipping_city: accountFormData.shippingCity || null,
        shipping_state_province: accountFormData.shippingStateProvince || null,
        shipping_zip_postal_code: accountFormData.shippingZipPostalCode || null,
        shipping_country: accountFormData.shippingCountry || null,
      }

      if (isEditMode && editingAccountId) {
        // Update existing account
        const response = await axios.patch(
          `/api/v1/sobjects/accounts/${editingAccountId}`,
          accountData
        )
        if (response.status === 200) {
          showToast(`Account "${accountFormData.name}" was updated.`, {
            label: "Undo",
            onClick: () => console.log("Undo account update"),
          })
          setIsNewAccountModalOpen(false)
          resetAccountForm()
          fetchAccounts()
        }
      } else {
        // Create new account
        const response = await axios.post("/api/v1/sobjects/accounts", accountData)
        if (response.status === 201) {
          showToast(`Account "${accountFormData.name}" was created.`, {
            label: "Undo",
            onClick: () => console.log("Undo account creation"),
          })
          setIsNewAccountModalOpen(false)
          resetAccountForm()
          fetchAccounts()
        }
      }
    } catch (error) {
      console.error("Error saving account:", error)
      showToast("Failed to save account. Please try again.", {
        label: "Dismiss",
        onClick: () => {},
      })
    }
  }

  const handleAccountSaveAndNew = async () => {
    if (!validateAccountForm()) return

    try {
      const accountData = {
        name: accountFormData.name,
        website: accountFormData.website || null,
        type: accountFormData.type || null,
        description: accountFormData.description || null,
        parent_account_id: null,
        account_owner: "Rishab Nagwani",
        phone: accountFormData.phone || null,
        billing_street: accountFormData.billingStreet || null,
        billing_city: accountFormData.billingCity || null,
        billing_state_province: accountFormData.billingStateProvince || null,
        billing_zip_postal_code: accountFormData.billingZipPostalCode || null,
        billing_country: accountFormData.billingCountry || null,
        shipping_street: accountFormData.shippingStreet || null,
        shipping_city: accountFormData.shippingCity || null,
        shipping_state_province: accountFormData.shippingStateProvince || null,
        shipping_zip_postal_code: accountFormData.shippingZipPostalCode || null,
        shipping_country: accountFormData.shippingCountry || null,
      }

      const response = await axios.post("/api/v1/sobjects/accounts", accountData)
      if (response.status === 201) {
        showToast(`Account "${accountFormData.name}" was created.`, {
          label: "Undo",
          onClick: () => console.log("Undo account creation"),
        })
        resetAccountForm() // Reset form but keep modal open
        fetchAccounts()
      }
    } catch (error) {
      console.error("Error saving account:", error)
      showToast("Failed to save account. Please try again.", {
        label: "Dismiss",
        onClick: () => {},
      })
    }
  }

  const handleAccountClose = () => {
    setIsNewAccountModalOpen(false)
    resetAccountForm()
  }

  const handleEditClick = async (accountId: number) => {
    try {
      const response = await axios.get(`/api/v1/sobjects/accounts/${accountId}`)
      const account = response.data

      setAccountFormData({
        name: account.name || "",
        website: account.website || "",
        type: account.type || "",
        description: account.description || "",
        parentAccount: "",
        phone: account.phone || "",
        billingCountry: account.billing_country || "",
        billingStreet: account.billing_street || "",
        billingCity: account.billing_city || "",
        billingZipPostalCode: account.billing_zip_postal_code || "",
        billingStateProvince: account.billing_state_province || "",
        shippingCountry: account.shipping_country || "",
        shippingStreet: account.shipping_street || "",
        shippingCity: account.shipping_city || "",
        shippingZipPostalCode: account.shipping_zip_postal_code || "",
        shippingStateProvince: account.shipping_state_province || "",
      })

      setIsEditMode(true)
      setEditingAccountId(accountId)
      setIsNewAccountModalOpen(true)
      setOpenDropdownId(null)
    } catch (error) {
      console.error("Error fetching account:", error)
      showToast("Failed to load account. Please try again.", {
        label: "Dismiss",
        onClick: () => {},
      })
    }
  }

  const handleDeleteClick = (accountId: number, accountName: string) => {
    setDeletingAccountId(accountId)
    setDeletingAccountName(accountName)
    setIsDeleteModalOpen(true)
    setOpenDropdownId(null)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingAccountId) return

    try {
      await axios.delete(`/api/v1/sobjects/accounts/${deletingAccountId}`)
      showToast(`Account "${deletingAccountName}" was deleted.`, {
        label: "Undo",
        onClick: () => console.log("Undo account deletion"),
      })
      setIsDeleteModalOpen(false)
      setDeletingAccountId(null)
      setDeletingAccountName("")
      fetchAccounts()
    } catch (error) {
      console.error("Error deleting account:", error)
      showToast("Failed to delete account. Please try again.", {
        label: "Dismiss",
        onClick: () => {},
      })
    }
  }

  // Inline editing handlers
  const handleCellDoubleClick = (accountId: number, field: string, currentValue: string) => {
    setEditingCell({ accountId, field })
    setEditingValue(currentValue || "")
  }

  const handleCellSave = async (accountId: number, field: string) => {
    if (!editingCell) return

    try {
      const updateData: any = {}
      if (field === "phone") {
        updateData.phone = editingValue
      } else if (field === "name") {
        updateData.name = editingValue
      }

      await axios.patch(`/api/v1/sobjects/accounts/${accountId}`, updateData)
      showToast(`Account ${field} updated successfully.`, {
        label: "Undo",
        onClick: () => console.log("Undo inline edit"),
      })
      setEditingCell(null)
      setEditingValue("")
      fetchAccounts()
    } catch (error) {
      console.error("Error updating account:", error)
      showToast("Failed to update account. Please try again.", {
        label: "Dismiss",
        onClick: () => {},
      })
      setEditingCell(null)
      setEditingValue("")
    }
  }

  const handleCellKeyDown = (e: React.KeyboardEvent, accountId: number, field: string) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleCellSave(accountId, field)
    } else if (e.key === "Escape") {
      setEditingCell(null)
      setEditingValue("")
    }
  }

  const handleCellBlur = (accountId: number, field: string) => {
    // Save on blur
    handleCellSave(accountId, field)
  }

  const actionButtons = [
    {
      label: "New",
      onClick: () => {
        resetAccountForm()
        setIsNewAccountModalOpen(true)
      }
    },
    { label: "Import" },
    { label: "Assign Label", hasDropdown: true }
  ]

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
              <p className="text-sm text-gray-600">
                {loading ? "Loading..." : `${displayedAccounts.length} item${displayedAccounts.length !== 1 ? 's' : ''} • Updated a few seconds ago`}
              </p>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search this list..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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

          <ResizableTable
            columns={columns}
            onSort={handleSort}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
          >
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-8">
                  <div className="flex justify-center items-center">
                    <RefreshCw className="w-6 h-6 animate-spin text-[#0176d3]" />
                    <span className="ml-2 text-gray-600">Loading accounts...</span>
                  </div>
                </td>
              </tr>
            ) : displayedAccounts.length === 0 ? (
              /* Empty State */
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
                      onClick={() => {
                        resetAccountForm()
                        setIsNewAccountModalOpen(true)
                      }}
                      className="px-6 py-2 bg-[#0176d3] text-white rounded-md font-normal hover:bg-[#014486] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150"
                    >
                      Add an Account
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              /* Account Rows */
              displayedAccounts.map((account) => (
                <tr key={account.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="w-12 px-4 py-3">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td
                    className={`px-4 py-3 cursor-pointer ${editingCell?.accountId === account.id && editingCell?.field === "name" ? "bg-blue-50" : ""}`}
                    onDoubleClick={() => handleCellDoubleClick(account.id, "name", account.name)}
                  >
                    {editingCell?.accountId === account.id && editingCell?.field === "name" ? (
                      <input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onBlur={() => handleCellBlur(account.id, "name")}
                        onKeyDown={(e) => handleCellKeyDown(e, account.id, "name")}
                        className="w-full px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                    ) : (
                      <Link href={`/accounts/${account.id}`} className="text-[#0176d3] hover:underline">
                        {account.name}
                      </Link>
                    )}
                  </td>
                  <td
                    className={`px-4 py-3 text-sm text-gray-700 cursor-pointer ${editingCell?.accountId === account.id && editingCell?.field === "phone" ? "bg-blue-50" : ""}`}
                    onDoubleClick={() => handleCellDoubleClick(account.id, "phone", account.phone)}
                  >
                    {editingCell?.accountId === account.id && editingCell?.field === "phone" ? (
                      <input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onBlur={() => handleCellBlur(account.id, "phone")}
                        onKeyDown={(e) => handleCellKeyDown(e, account.id, "phone")}
                        className="w-full px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                    ) : (
                      account.phone || "-"
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {account.account_owner || "-"}
                  </td>
                  <td className="px-4 py-3 relative">
                    <button
                      onClick={() => setOpenDropdownId(openDropdownId === account.id ? null : account.id)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-600" />
                    </button>

                    {/* Dropdown Menu */}
                    {openDropdownId === account.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setOpenDropdownId(null)}
                        />
                        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                          <button
                            onClick={() => handleEditClick(account.id)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(account.id, account.name)}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </ResizableTable>
        </div>
      </div>

      {/* New/Edit Account Modal */}
      {isNewAccountModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden">
            {/* Close Button */}
            <button
              onClick={handleAccountClose}
              className="absolute -top-3 -right-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-[#0176d3] hover:bg-gray-50 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <div className="border-b border-gray-200 px-8 py-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-normal text-gray-800">
                  {isEditMode ? "Edit Account" : "New Account"}
                </h2>
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
                    <div className="relative">
                      <input
                        type="text"
                        value={accountFormData.name}
                        onChange={(e) => {
                          setAccountFormData({
                            ...accountFormData,
                            name: e.target.value,
                          })
                          if (accountErrors.name) {
                            setAccountErrors({
                              ...accountErrors,
                              name: false,
                            })
                          }
                        }}
                        className={`w-full px-4 py-2 border ${
                          accountErrors.name ? "border-red-500 pr-10" : "border-gray-300"
                        } rounded-md hover:shadow-md hover:-translate-y-0.5 transition-all duration-150`}
                      />
                      {accountErrors.name && (
                        <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                      )}
                    </div>
                    {accountErrors.name && (
                      <p className="text-sm text-red-600 mt-1">
                        Complete this field.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-normal text-gray-700 mb-1">Website</label>
                    <input
                      type="text"
                      value={accountFormData.website}
                      onChange={(e) =>
                        setAccountFormData({
                          ...accountFormData,
                          website: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-normal text-gray-700 mb-1">Type</label>
                    <select
                      value={accountFormData.type}
                      onChange={(e) =>
                        setAccountFormData({
                          ...accountFormData,
                          type: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                    >
                      <option value="">--None--</option>
                      <option value="Customer">Customer</option>
                      <option value="Partner">Partner</option>
                      <option value="Prospect">Prospect</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-normal text-gray-700 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={accountFormData.description}
                      onChange={(e) =>
                        setAccountFormData({
                          ...accountFormData,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-normal text-gray-700 mb-1">Parent Account</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search Accounts..."
                        value={accountFormData.parentAccount}
                        onChange={(e) =>
                          setAccountFormData({
                            ...accountFormData,
                            parentAccount: e.target.value,
                          })
                        }
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
                      value={accountFormData.phone}
                      onChange={(e) =>
                        setAccountFormData({
                          ...accountFormData,
                          phone: e.target.value,
                        })
                      }
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
                    <select
                      value={accountFormData.billingCountry}
                      onChange={(e) =>
                        setAccountFormData({
                          ...accountFormData,
                          billingCountry: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                    >
                      <option value="">--None--</option>
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-normal text-gray-700 mb-1">Billing Street</label>
                    <textarea
                      rows={3}
                      value={accountFormData.billingStreet}
                      onChange={(e) =>
                        setAccountFormData({
                          ...accountFormData,
                          billingStreet: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-normal text-gray-700 mb-1">Billing City</label>
                    <input
                      type="text"
                      value={accountFormData.billingCity}
                      onChange={(e) =>
                        setAccountFormData({
                          ...accountFormData,
                          billingCity: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-normal text-gray-700 mb-1">Billing Zip/Postal Code</label>
                      <input
                        type="text"
                        value={accountFormData.billingZipPostalCode}
                        onChange={(e) =>
                          setAccountFormData({
                            ...accountFormData,
                            billingZipPostalCode: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-normal text-gray-700 mb-1">Billing State/Province</label>
                      <select
                        value={accountFormData.billingStateProvince}
                        onChange={(e) =>
                          setAccountFormData({
                            ...accountFormData,
                            billingStateProvince: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                      >
                        <option value="">--None--</option>
                        <option value="California">California</option>
                        <option value="New York">New York</option>
                        <option value="Texas">Texas</option>
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
                    <select
                      value={accountFormData.shippingCountry}
                      onChange={(e) =>
                        setAccountFormData({
                          ...accountFormData,
                          shippingCountry: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                    >
                      <option value="">--None--</option>
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-normal text-gray-700 mb-1">Shipping Street</label>
                    <textarea
                      rows={3}
                      value={accountFormData.shippingStreet}
                      onChange={(e) =>
                        setAccountFormData({
                          ...accountFormData,
                          shippingStreet: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-normal text-gray-700 mb-1">Shipping City</label>
                    <input
                      type="text"
                      value={accountFormData.shippingCity}
                      onChange={(e) =>
                        setAccountFormData({
                          ...accountFormData,
                          shippingCity: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-normal text-gray-700 mb-1">Shipping Zip/Postal Code</label>
                      <input
                        type="text"
                        value={accountFormData.shippingZipPostalCode}
                        onChange={(e) =>
                          setAccountFormData({
                            ...accountFormData,
                            shippingZipPostalCode: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-normal text-gray-700 mb-1">Shipping State/Province</label>
                      <select
                        value={accountFormData.shippingStateProvince}
                        onChange={(e) =>
                          setAccountFormData({
                            ...accountFormData,
                            shippingStateProvince: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                      >
                        <option value="">--None--</option>
                        <option value="California">California</option>
                        <option value="New York">New York</option>
                        <option value="Texas">Texas</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-8 py-4 flex justify-end gap-3">
              <button
                onClick={handleAccountClose}
                className="px-6 py-2 text-[#0176d3] border border-[#0176d3] rounded-md font-normal hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
              >
                Cancel
              </button>
              {!isEditMode && (
                <button
                  onClick={handleAccountSaveAndNew}
                  className="px-6 py-2 text-[#0176d3] border border-[#0176d3] rounded-md font-normal hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                >
                  Save & New
                </button>
              )}
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

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-md mx-4">
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-normal text-gray-800">Delete Account</h2>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-700">
                    Are you sure you want to delete <strong>{deletingAccountName}</strong>?
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false)
                  setDeletingAccountId(null)
                  setDeletingAccountName("")
                }}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-md font-normal hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-6 py-2 bg-red-600 text-white rounded-md font-normal hover:bg-red-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
