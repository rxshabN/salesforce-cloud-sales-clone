"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ChevronDown, RefreshCw, Settings, MoreVertical, Filter, Pencil, Grid3x3, Pin, X, AlertCircle, Trash2, Edit } from "lucide-react"
import { useState, useEffect } from "react"
import axios from "axios"
import ResizableTable from "@/components/resizable-table"
import { useToast } from "@/components/toast-provider"

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
        account_id: 1, // TODO: Implement account lookup
        salutation: contactFormData.salutation || null,
        first_name: contactFormData.firstName,
        last_name: contactFormData.lastName,
        title: contactFormData.title || null,
        description: contactFormData.description || null,
        contact_owner: "Rishab Nagwani",
        email: contactFormData.email,
        phone: contactFormData.phone || null,
        reports_to_contact_id: null, // TODO: Implement contact lookup
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
        accountName: "", // TODO: Load account name
        title: contact.title || "",
        reportsTo: "", // TODO: Load reports to contact name
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
                  contacts.map((contact) => (
                    <tr key={contact.id} className="border-b border-[#dddbda] hover:bg-[#f3f2f2]">
                      <td className="w-12 px-4 py-3">
                        <input type="checkbox" className="rounded border-[#dddbda]" />
                      </td>
                      <td className="px-4 py-3">
                        <a href="#" className="text-[#0176d3] hover:underline">
                          {contact.first_name} {contact.last_name}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#181818]">
                        {contact.accounts?.name || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#181818]">
                        {contact.phone || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#181818]">
                        {contact.email || "-"}
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
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={handleContactClose}
          ></div>

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-2xl mx-4">
            {/* Close Button - Outside modal, top right */}
            <button
              onClick={handleContactClose}
              className="absolute -top-10 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-150 shadow-lg"
            >
              <X className="w-5 h-5 text-[#706e6b]" />
            </button>

            {/* Modal Content */}
            <div className="bg-white rounded-lg shadow-2xl max-h-[80vh] flex flex-col">
              <div className="px-6 py-4 border-b border-[#dddbda] flex items-center justify-between">
                <h2 className="text-xl font-normal text-[#181818]">
                  {isEditMode ? "Edit Contact" : "New Contact"}
                </h2>
                <p className="text-xs text-[#706e6b]">
                  <span className="text-red-600">*</span> = Required Information
                </p>
              </div>

              {/* Scrollable form content */}
              <div className="overflow-y-auto px-6 py-4 flex-1">
                <div className="space-y-6">
                  {/* Tell Us About This Contact Section */}
                  <div>
                    <h3 className="text-base font-normal text-[#181818] bg-[#f3f2f2] px-4 py-2 -mx-6 mb-4">
                      Tell Us About This Contact
                    </h3>
                    <div className="space-y-4">
                      <label className="block text-sm text-[#181818] mb-1">
                        <span className="text-red-600">*</span> Name
                      </label>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-[#706e6b] mb-1">
                            Salutation
                          </label>
                          <select
                            value={contactFormData.salutation}
                            onChange={(e) =>
                              setContactFormData({
                                ...contactFormData,
                                salutation: e.target.value,
                              })
                            }
                            className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm text-[#181818] hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                          >
                            <option value="">--None--</option>
                            <option value="Mr.">Mr.</option>
                            <option value="Ms.">Ms.</option>
                            <option value="Mrs.">Mrs.</option>
                            <option value="Dr.">Dr.</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-[#706e6b] mb-1">
                            <span className="text-red-600">*</span> First Name
                          </label>
                          <div className="relative">
                            <Input
                              placeholder="First Name"
                              value={contactFormData.firstName}
                              onChange={(e) => {
                                setContactFormData({
                                  ...contactFormData,
                                  firstName: e.target.value,
                                });
                                if (contactErrors.firstName) {
                                  setContactErrors({
                                    ...contactErrors,
                                    firstName: false,
                                  });
                                }
                              }}
                              className={`w-full rounded px-3 py-2 text-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 ${
                                contactErrors.firstName
                                  ? "border-2 border-red-600 pr-10"
                                  : "border border-[#dddbda]"
                              }`}
                            />
                            {contactErrors.firstName && (
                              <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                            )}
                          </div>
                          {contactErrors.firstName && (
                            <p className="text-red-600 text-xs mt-1">
                              Complete this field.
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs text-[#706e6b] mb-1">
                            <span className="text-red-600">*</span> Last Name
                          </label>
                          <div className="relative">
                            <Input
                              placeholder="Last Name"
                              value={contactFormData.lastName}
                              onChange={(e) => {
                                setContactFormData({
                                  ...contactFormData,
                                  lastName: e.target.value,
                                });
                                if (contactErrors.lastName) {
                                  setContactErrors({
                                    ...contactErrors,
                                    lastName: false,
                                  });
                                }
                              }}
                              className={`w-full rounded px-3 py-2 text-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 ${
                                contactErrors.lastName
                                  ? "border-2 border-red-600 pr-10"
                                  : "border border-[#dddbda]"
                              }`}
                            />
                            {contactErrors.lastName && (
                              <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                            )}
                          </div>
                          {contactErrors.lastName && (
                            <p className="text-red-600 text-xs mt-1">
                              Complete this field.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Account Name */}
                      <div>
                        <label className="block text-sm text-[#181818] mb-1">
                          <span className="text-red-600">*</span> Account Name
                        </label>
                        <div className="relative">
                          <Input
                            placeholder="Search Accounts..."
                            value={contactFormData.accountName}
                            onChange={(e) => {
                              setContactFormData({
                                ...contactFormData,
                                accountName: e.target.value,
                              });
                              if (contactErrors.accountName) {
                                setContactErrors({
                                  ...contactErrors,
                                  accountName: false,
                                });
                              }
                            }}
                            className={`w-full rounded px-3 py-2 pr-10 text-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 ${
                              contactErrors.accountName
                                ? "border-2 border-red-600"
                                : "border border-[#dddbda]"
                            }`}
                          />
                          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#706e6b]" />
                        </div>
                        {contactErrors.accountName && (
                          <p className="text-red-600 text-xs mt-1">
                            Complete this field.
                          </p>
                        )}
                      </div>

                      {/* Title */}
                      <div>
                        <label className="block text-sm text-[#181818] mb-1">
                          Title
                        </label>
                        <Input
                          value={contactFormData.title}
                          onChange={(e) =>
                            setContactFormData({
                              ...contactFormData,
                              title: e.target.value,
                            })
                          }
                          className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                        />
                      </div>

                      {/* Reports To */}
                      <div>
                        <label className="block text-sm text-[#181818] mb-1">
                          Reports To
                        </label>
                        <div className="relative">
                          <Input
                            placeholder="Search Contacts..."
                            value={contactFormData.reportsTo}
                            onChange={(e) =>
                              setContactFormData({
                                ...contactFormData,
                                reportsTo: e.target.value,
                              })
                            }
                            className="w-full border border-[#dddbda] rounded px-3 py-2 pr-10 text-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                          />
                          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#706e6b]" />
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm text-[#181818] mb-1">
                          Description
                        </label>
                        <textarea
                          value={contactFormData.description}
                          onChange={(e) =>
                            setContactFormData({
                              ...contactFormData,
                              description: e.target.value,
                            })
                          }
                          className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 min-h-20"
                          style={{
                            fontFamily:
                              'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Get in Touch Section */}
                  <div>
                    <h3 className="text-base font-normal text-[#181818] bg-[#f3f2f2] px-4 py-2 -mx-6 mb-4">
                      Get in Touch
                    </h3>
                    <div className="space-y-4">
                      {/* Phone */}
                      <div>
                        <label className="block text-sm text-[#181818] mb-1">
                          Phone
                        </label>
                        <Input
                          value={contactFormData.phone}
                          onChange={(e) =>
                            setContactFormData({
                              ...contactFormData,
                              phone: e.target.value,
                            })
                          }
                          className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm text-[#181818] mb-1">
                          <span className="text-red-600">*</span> Email
                        </label>
                        <div className="relative">
                          <Input
                            type="email"
                            value={contactFormData.email}
                            onChange={(e) => {
                              setContactFormData({
                                ...contactFormData,
                                email: e.target.value,
                              });
                              if (contactErrors.email) {
                                setContactErrors({
                                  ...contactErrors,
                                  email: false,
                                });
                              }
                            }}
                            className={`w-full rounded px-3 py-2 text-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 ${
                              contactErrors.email
                                ? "border-2 border-red-600 pr-10"
                                : "border border-[#dddbda]"
                            }`}
                          />
                          {contactErrors.email && (
                            <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                          )}
                        </div>
                        {contactErrors.email && (
                          <p className="text-red-600 text-xs mt-1">
                            Complete this field.
                          </p>
                        )}
                      </div>

                      {/* Mailing Address */}
                      <div>
                        <label className="block text-sm text-[#181818] mb-2">
                          Mailing Address
                        </label>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs text-[#706e6b] mb-1">
                              Mailing Country
                            </label>
                            <select
                              value={contactFormData.mailingCountry}
                              onChange={(e) =>
                                setContactFormData({
                                  ...contactFormData,
                                  mailingCountry: e.target.value,
                                })
                              }
                              className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm text-[#181818] hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                            >
                              <option value="">--None--</option>
                              <option value="United States">United States</option>
                              <option value="Canada">Canada</option>
                              <option value="United Kingdom">United Kingdom</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-[#706e6b] mb-1">
                              Mailing Street
                            </label>
                            <textarea
                              value={contactFormData.mailingStreet}
                              onChange={(e) =>
                                setContactFormData({
                                  ...contactFormData,
                                  mailingStreet: e.target.value,
                                })
                              }
                              className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 min-h-[60px]"
                              style={{
                                fontFamily:
                                  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-[#706e6b] mb-1">
                              Mailing City
                            </label>
                            <Input
                              value={contactFormData.mailingCity}
                              onChange={(e) =>
                                setContactFormData({
                                  ...contactFormData,
                                  mailingCity: e.target.value,
                                })
                              }
                              className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs text-[#706e6b] mb-1">
                                Mailing Zip/Postal Code
                              </label>
                              <Input
                                value={contactFormData.mailingZipPostalCode}
                                onChange={(e) =>
                                  setContactFormData({
                                    ...contactFormData,
                                    mailingZipPostalCode: e.target.value,
                                  })
                                }
                                className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-[#706e6b] mb-1">
                                Mailing State/Province
                              </label>
                              <select
                                value={contactFormData.mailingStateProvince}
                                onChange={(e) =>
                                  setContactFormData({
                                    ...contactFormData,
                                    mailingStateProvince: e.target.value,
                                  })
                                }
                                className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm text-[#181818] hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
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
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-[#dddbda] flex items-center justify-end gap-3">
                <Button
                  onClick={handleContactClose}
                  className="bg-white text-[#0176d3] hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 border border-[#dddbda] h-9 px-4 text-sm rounded"
                >
                  Cancel
                </Button>
                {!isEditMode && (
                  <Button
                    onClick={handleContactSaveAndNew}
                    className="bg-white text-[#0176d3] hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 border border-[#dddbda] h-9 px-4 text-sm rounded"
                  >
                    Save & New
                  </Button>
                )}
                <Button
                  onClick={handleContactSave}
                  className="bg-[#0176d3] text-white hover:bg-[#0159a8] hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 h-9 px-4 text-sm rounded"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

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
