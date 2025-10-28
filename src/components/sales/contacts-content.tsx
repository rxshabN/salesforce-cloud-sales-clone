"use client"

import { useState } from "react"
import { Search, ChevronDown, Settings, Grid3x3, RefreshCw, Pin, Edit, PieChart, Filter } from "lucide-react"
import ResizableTable from "@/components/resizable-table"
import { ButtonGroup, IconButtonGroup, IconButton, GroupedIconButtons } from "@/components/ui/button-group"
import RowActionsDropdown from "@/components/ui/row-actions-dropdown"
import EditContactModal from "@/components/modals/edit-contact-modal"
import DeleteContactModal from "@/components/modals/delete-contact-modal"
import Link from "next/link"

interface Contact {
  id: number
  name: string
  accountName: string
  phone: string
  email: string
  contactOwnerAlias: string
}

export default function ContactsContent() {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 1,
      name: "meow Nagwani",
      accountName: "asdasd",
      phone: "09833014890",
      email: "nagwanirishab@gmail.com",
      contactOwnerAlias: "RNagw",
    },
  ])

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

  const handleEdit = (contact: Contact) => {
    setSelectedContact(contact)
    setEditModalOpen(true)
  }

  const handleDelete = (contact: Contact) => {
    setSelectedContact(contact)
    setDeleteModalOpen(true)
  }

  const handleSaveContact = (updatedContact: Contact) => {
    setContacts(contacts.map((c) => (c.id === updatedContact.id ? updatedContact : c)))
  }

  const handleConfirmDelete = () => {
    if (selectedContact) {
      setContacts(contacts.filter((c) => c.id !== selectedContact.id))
    }
  }

  const columns = [
    { key: "name", label: "Name", defaultWidth: 200, minWidth: 100 },
    { key: "accountName", label: "Account Name", defaultWidth: 180, minWidth: 100 },
    { key: "phone", label: "Phone", defaultWidth: 150, minWidth: 100 },
    { key: "email", label: "Email", defaultWidth: 200, minWidth: 120 },
    { key: "contactOwnerAlias", label: "Contact Owner Alias", defaultWidth: 180, minWidth: 100 },
  ]

  const actionButtons = [
    { label: "Import" },
    { label: "New" },
    { label: "Add to Campaign" },
    { label: "Send Email" },
    { label: "Assign Label", hasDropdown: true },
  ]

  const hasRecords = contacts.length > 0

  return (
    <div className="bg-[#f3f2f2]">
      {/* List View Header */}
      <div className="bg-white px-8 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#9333ea] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Contacts</span>
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
            {contacts.length} item{contacts.length !== 1 ? "s" : ""} • Updated a few seconds ago
          </p>
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

      {/* Table */}
      <ResizableTable columns={columns}>
        {contacts.map((contact, index) => (
          <tr key={contact.id} className="border-b border-gray-200 hover:bg-gray-50">
            <td className="py-3 px-4">
              <input type="checkbox" className="rounded border-gray-300" />
            </td>
            <td className="py-3 px-4">
              <Link href={`/contact/${contact.id}`} className="text-[#0176d3] hover:underline">
                {contact.name}
              </Link>
            </td>
            <td className="py-3 px-4">
              <Link href="#" className="text-[#0176d3] hover:underline">
                {contact.accountName}
              </Link>
            </td>
            <td className="py-3 px-4 text-gray-700">{contact.phone}</td>
            <td className="py-3 px-4">
              <Link href={`mailto:${contact.email}`} className="text-[#0176d3] hover:underline">
                {contact.email}
              </Link>
            </td>
            <td className="py-3 px-4 text-gray-700">{contact.contactOwnerAlias}</td>
            <td className="py-3 px-4">
              <RowActionsDropdown
                onEdit={() => handleEdit(contact)}
                onDelete={() => handleDelete(contact)}
                onChangeOwner={() => console.log("[v0] Change owner:", contact.id)}
                onEditLabels={() => console.log("[v0] Edit labels:", contact.id)}
              />
            </td>
          </tr>
        ))}
      </ResizableTable>

      <EditContactModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        contact={selectedContact}
        onSave={handleSaveContact}
      />

      <DeleteContactModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        contactName={selectedContact?.name || ""}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
