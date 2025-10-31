"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ChevronDown, RefreshCw, Settings, MoreVertical, Filter, Pencil, Grid3x3, Pin, AlertCircle, Trash2, Edit } from "lucide-react"
import { useState, useEffect } from "react"
import axios from "axios"
import Link from "next/link"
import ResizableTable from "@/components/resizable-table"
import { useToast } from "@/components/toast-provider"
import ContactFormModal from "@/components/modals/contact-form-modal"

// Initial state for contact form
const initialContactFormData = {
  salutation: "",
  firstName: "",
  lastName: "",
  accountName: "",
  title: "",
  reportsTo: "",
  description: "",
  email: "",
  phone: "",
  mailingCountry: "",
  mailingStreet: "",
  mailingCity: "",
  mailingZipPostalCode: "",
  mailingStateProvince: "",
}

export default function ContactsPage() {
  const { showToast } = useToast()

  // Contact list state
  const [contacts, setContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Modal states
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingContactId, setEditingContactId] = useState<number | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingContactId, setDeletingContactId] = useState<number | null>(null)
  const [deletingContactName, setDeletingContactName] = useState("")

  // Form state
  const [contactFormData, setContactFormData] = useState(initialContactFormData)
  const [contactErrors, setContactErrors] = useState<Record<string, boolean>>({})

  // Dropdown menu state
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null)

  // Search and sort state
  const [searchQuery, setSearchQuery] = useState("")
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Inline editing state
  const [editingCell, setEditingCell] = useState<{ contactId: number; field: string } | null>(null)
  const [editingValue, setEditingValue] = useState("")

  const columns = [
    { key: "name", label: "Name", defaultWidth: 200, minWidth: 100 },
    { key: "accountName", label: "Account Name", defaultWidth: 180, minWidth: 100 },
    { key: "phone", label: "Phone", defaultWidth: 150, minWidth: 100 },
    { key: "email", label: "Email", defaultWidth: 200, minWidth: 120 },
    { key: "contactOwnerAlias", label: "Contact Owner Alias", defaultWidth: 180, minWidth: 100 },
  ]

  // Fetch all contacts
  const fetchContacts = async () => {
    try {
      setLoading(true)
      const response = await axios.get("/api/v1/sobjects/contacts")
      setContacts(response.data)
    } catch (error) {
      console.error("Error fetching contacts:", error)
      showToast("Failed to fetch contacts. Please try again.", {
        label: "Dismiss",
        onClick: () => {},
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch contacts on mount
  useEffect(() => {
    fetchContacts()
  }, [])

  // Filter and sort contacts
  const filteredAndSortedContacts = () => {
    let filtered = [...contacts]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((contact) =>
        `${contact.first_name} ${contact.last_name}`.toLowerCase().includes(query) ||
        contact.accounts?.name?.toLowerCase().includes(query) ||
        contact.phone?.toLowerCase().includes(query) ||
        contact.email?.toLowerCase().includes(query) ||
        contact.contact_owner?.toLowerCase().includes(query)
      )
    }

    // Apply sorting
    if (sortColumn) {
      filtered.sort((a, b) => {
        let aVal, bVal

        switch (sortColumn) {
          case "name":
            aVal = `${a.first_name} ${a.last_name}` || ""
            bVal = `${b.first_name} ${b.last_name}` || ""
            break
          case "accountName":
            aVal = a.accounts?.name || ""
            bVal = b.accounts?.name || ""
            break
          case "phone":
            aVal = a.phone || ""
            bVal = b.phone || ""
            break
          case "email":
            aVal = a.email || ""
            bVal = b.email || ""
            break
          case "contactOwnerAlias":
            aVal = a.contact_owner || ""
            bVal = b.contact_owner || ""
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

  const displayedContacts = filteredAndSortedContacts()

  // Handle sort
  const handleSort = (columnKey: string, direction: "asc" | "desc") => {
    setSortColumn(columnKey)
    setSortDirection(direction)
  }

  const resetContactForm = () => {
    setContactFormData(initialContactFormData)
    setContactErrors({})
    setIsEditMode(false)
    setEditingContactId(null)
  }

  const validateContactForm = () => {
    const errors: Record<string, boolean> = {}
    if (!contactFormData.firstName.trim()) errors.firstName = true
    if (!contactFormData.lastName.trim()) errors.lastName = true
    if (!contactFormData.email.trim()) errors.email = true
    if (!contactFormData.accountName.trim()) errors.accountName = true
    setContactErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleContactSave = async () => {
    if (!validateContactForm()) return

    try {
      const contactData = {
        account_id: 1,
        salutation: contactFormData.salutation || null,
        first_name: contactFormData.firstName,
        last_name: contactFormData.lastName,
        title: contactFormData.title || null,
        description: contactFormData.description || null,
        contact_owner: "Rishab Nagwani",
        email: contactFormData.email,
        phone: contactFormData.phone || null,
        reports_to_contact_id: null,
        mailing_country: contactFormData.mailingCountry || null,
        mailing_street: contactFormData.mailingStreet || null,
        mailing_city: contactFormData.mailingCity || null,
        mailing_zip_postal_code: contactFormData.mailingZipPostalCode || null,
        mailing_state_province: contactFormData.mailingStateProvince || null,
      }

      if (isEditMode && editingContactId) {
        // Update existing contact
        const response = await axios.patch(
          `/api/v1/sobjects/contacts/${editingContactId}`,
          contactData
        )
        if (response.status === 200) {
          showToast(
            `Contact "${contactFormData.firstName} ${contactFormData.lastName}" was updated.`,
            {
              label: "Undo",
              onClick: () => console.log("Undo contact update"),
            }
          )
          setIsContactModalOpen(false)
          resetContactForm()
          fetchContacts()
        }
      } else {
        // Create new contact
        const response = await axios.post("/api/v1/sobjects/contacts", contactData)
        if (response.status === 201) {
          showToast(
            `Contact "${contactFormData.firstName} ${contactFormData.lastName}" was created.`,
            {
              label: "Undo",
              onClick: () => console.log("Undo contact creation"),
            }
          )
          setIsContactModalOpen(false)
          resetContactForm()
          fetchContacts()
        }
      }
    } catch (error) {
      console.error("Error saving contact:", error)
      showToast("Failed to save contact. Please try again.", {
        label: "Dismiss",
        onClick: () => {},
      })
    }
  }

  const handleContactSaveAndNew = async () => {
    if (!validateContactForm()) return

    try {
      const contactData = {
        account_id: 1,
        salutation: contactFormData.salutation || null,
        first_name: contactFormData.firstName,
        last_name: contactFormData.lastName,
        title: contactFormData.title || null,
        description: contactFormData.description || null,
        contact_owner: "Rishab Nagwani",
        email: contactFormData.email,
        phone: contactFormData.phone || null,
        reports_to_contact_id: null,
        mailing_country: contactFormData.mailingCountry || null,
        mailing_street: contactFormData.mailingStreet || null,
        mailing_city: contactFormData.mailingCity || null,
        mailing_zip_postal_code: contactFormData.mailingZipPostalCode || null,
        mailing_state_province: contactFormData.mailingStateProvince || null,
      }

      const response = await axios.post("/api/v1/sobjects/contacts", contactData)
      if (response.status === 201) {
        showToast(
          `Contact "${contactFormData.firstName} ${contactFormData.lastName}" was created.`,
          {
            label: "Undo",
            onClick: () => console.log("Undo contact creation"),
          }
        )
        resetContactForm() // Reset form but keep modal open
        fetchContacts()
      }
    } catch (error) {
      console.error("Error saving contact:", error)
      showToast("Failed to save contact. Please try again.", {
        label: "Dismiss",
        onClick: () => {},
      })
    }
  }

  const handleContactClose = () => {
    setIsContactModalOpen(false)
    resetContactForm()
  }

  const handleEditClick = async (contactId: number) => {
    try {
      const response = await axios.get(`/api/v1/sobjects/contacts/${contactId}`)
      const contact = response.data

      setContactFormData({
        salutation: contact.salutation || "",
        firstName: contact.first_name || "",
        lastName: contact.last_name || "",
        accountName: "",
        title: contact.title || "",
        reportsTo: "",
        description: contact.description || "",
        email: contact.email || "",
        phone: contact.phone || "",
        mailingCountry: contact.mailing_country || "",
        mailingStreet: contact.mailing_street || "",
        mailingCity: contact.mailing_city || "",
        mailingZipPostalCode: contact.mailing_zip_postal_code || "",
        mailingStateProvince: contact.mailing_state_province || "",
      })

      setIsEditMode(true)
      setEditingContactId(contactId)
      setIsContactModalOpen(true)
      setOpenDropdownId(null)
    } catch (error) {
      console.error("Error fetching contact:", error)
      showToast("Failed to load contact. Please try again.", {
        label: "Dismiss",
        onClick: () => {},
      })
    }
  }

  const handleDeleteClick = (contactId: number, contactName: string) => {
    setDeletingContactId(contactId)
    setDeletingContactName(contactName)
    setIsDeleteModalOpen(true)
    setOpenDropdownId(null)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingContactId) return

    try {
      await axios.delete(`/api/v1/sobjects/contacts/${deletingContactId}`)
      showToast(`Contact "${deletingContactName}" was deleted.`, {
        label: "Undo",
        onClick: () => console.log("Undo contact deletion"),
      })
      setIsDeleteModalOpen(false)
      setDeletingContactId(null)
      setDeletingContactName("")
      fetchContacts()
    } catch (error) {
      console.error("Error deleting contact:", error)
      showToast("Failed to delete contact. Please try again.", {
        label: "Dismiss",
        onClick: () => {},
      })
    }
  }

  // Inline editing handlers
  const handleCellDoubleClick = (contactId: number, field: string, currentValue: string) => {
    setEditingCell({ contactId, field })
    setEditingValue(currentValue || "")
  }

  const handleCellSave = async (contactId: number, field: string) => {
    if (!editingCell) return

    try {
      const updateData: any = {}
      if (field === "phone") {
        updateData.phone = editingValue
      } else if (field === "email") {
        updateData.email = editingValue
      } else if (field === "firstName") {
        updateData.first_name = editingValue
      } else if (field === "lastName") {
        updateData.last_name = editingValue
      }

      await axios.patch(`/api/v1/sobjects/contacts/${contactId}`, updateData)
      showToast(`Contact ${field} updated successfully.`, {
        label: "Undo",
        onClick: () => console.log("Undo inline edit"),
      })
      setEditingCell(null)
      setEditingValue("")
      fetchContacts()
    } catch (error) {
      console.error("Error updating contact:", error)
      showToast("Failed to update contact. Please try again.", {
        label: "Dismiss",
        onClick: () => {},
      })
      setEditingCell(null)
      setEditingValue("")
    }
  }

  const handleCellKeyDown = (e: React.KeyboardEvent, contactId: number, field: string) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleCellSave(contactId, field)
    } else if (e.key === "Escape") {
      setEditingCell(null)
      setEditingValue("")
    }
  }

  const handleCellBlur = (contactId: number, field: string) => {
    // Save on blur
    handleCellSave(contactId, field)
  }

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
                <p className="text-xs text-[#706e6b]">
                  {loading ? "Loading..." : `${contacts.length} item${contacts.length !== 1 ? 's' : ''} • Updated a few seconds ago`}
                </p>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button className="bg-white text-[#0176d3] hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 border border-[#dddbda] h-8 px-4 text-sm rounded">
                    Import
                  </Button>
                  <Button
                    onClick={() => {
                      resetContactForm()
                      setIsContactModalOpen(true)
                    }}
                    className="bg-white text-[#0176d3] hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 border border-[#dddbda] h-8 px-4 text-sm rounded">
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                        <span className="ml-2 text-[#706e6b]">Loading contacts...</span>
                      </div>
                    </td>
                  </tr>
                ) : contacts.length === 0 ? (
                  /* Empty State */
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
                        <Button
                          onClick={() => {
                            resetContactForm()
                            setIsContactModalOpen(true)
                          }}
                          className="bg-[#0176d3] text-white hover:bg-[#0159a8] hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 h-9 px-6 text-sm rounded">
                          Add a Contact
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  /* Contact Rows */
                  displayedContacts.map((contact) => (
                    <tr key={contact.id} className="border-b border-[#dddbda] hover:bg-[#f3f2f2]">
                      <td className="w-12 px-4 py-3">
                        <input type="checkbox" className="rounded border-[#dddbda]" />
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/contacts/${contact.id}`} className="text-[#0176d3] hover:underline">
                          {contact.first_name} {contact.last_name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#181818]">
                        {contact.accounts?.name || "-"}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm text-[#181818] cursor-pointer ${editingCell?.contactId === contact.id && editingCell?.field === "phone" ? "bg-blue-50" : ""}`}
                        onDoubleClick={() => handleCellDoubleClick(contact.id, "phone", contact.phone)}
                      >
                        {editingCell?.contactId === contact.id && editingCell?.field === "phone" ? (
                          <input
                            type="text"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            onBlur={() => handleCellBlur(contact.id, "phone")}
                            onKeyDown={(e) => handleCellKeyDown(e, contact.id, "phone")}
                            className="w-full px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                        ) : (
                          contact.phone || "-"
                        )}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm text-[#181818] cursor-pointer ${editingCell?.contactId === contact.id && editingCell?.field === "email" ? "bg-blue-50" : ""}`}
                        onDoubleClick={() => handleCellDoubleClick(contact.id, "email", contact.email)}
                      >
                        {editingCell?.contactId === contact.id && editingCell?.field === "email" ? (
                          <input
                            type="text"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            onBlur={() => handleCellBlur(contact.id, "email")}
                            onKeyDown={(e) => handleCellKeyDown(e, contact.id, "email")}
                            className="w-full px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                        ) : (
                          contact.email || "-"
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#181818]">
                        {contact.contact_owner || "-"}
                      </td>
                      <td className="px-4 py-3 relative">
                        <button
                          onClick={() => setOpenDropdownId(openDropdownId === contact.id ? null : contact.id)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <MoreVertical className="w-4 h-4 text-[#706e6b]" />
                        </button>

                        {/* Dropdown Menu */}
                        {openDropdownId === contact.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenDropdownId(null)}
                            />
                            <div className="absolute right-0 mt-1 w-48 bg-white border border-[#dddbda] rounded-md shadow-lg z-20">
                              <button
                                onClick={() => handleEditClick(contact.id)}
                                className="w-full text-left px-4 py-2 text-sm text-[#181818] hover:bg-[#f3f2f2] flex items-center gap-2"
                              >
                                <Edit className="w-4 h-4" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteClick(contact.id, `${contact.first_name} ${contact.last_name}`)}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-[#f3f2f2] flex items-center gap-2"
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
        </div>
      </div>

      {/* New/Edit Contact Modal */}
      <ContactFormModal
        isOpen={isContactModalOpen}
        onClose={handleContactClose}
        onSave={handleContactSave}
        onSaveAndNew={handleContactSaveAndNew}
        contactFormData={contactFormData}
        setContactFormData={setContactFormData}
        contactErrors={contactErrors}
        setContactErrors={setContactErrors}
        modalTitle={isEditMode ? "Edit Contact" : "New Contact"}
        showSaveAndNew={!isEditMode}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-md mx-4">
            {/* Modal Header */}
            <div className="border-b border-[#dddbda] px-6 py-4">
              <h2 className="text-xl font-normal text-[#181818]">Delete Contact</h2>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-[#181818]">
                    Are you sure you want to delete <strong>{deletingContactName}</strong>?
                  </p>
                  <p className="text-sm text-[#706e6b] mt-2">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-[#dddbda] px-6 py-4 flex justify-end gap-3">
              <Button
                onClick={() => {
                  setIsDeleteModalOpen(false)
                  setDeletingContactId(null)
                  setDeletingContactName("")
                }}
                className="bg-white text-[#181818] border border-[#dddbda] rounded hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 h-9 px-4 text-sm"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                className="bg-red-600 text-white rounded hover:bg-red-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150 h-9 px-4 text-sm"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
