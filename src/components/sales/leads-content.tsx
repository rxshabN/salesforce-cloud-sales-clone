"use client"

import { useState } from "react"
import { Search, ChevronDown, Settings, Grid3x3, RefreshCw, Pin, Edit, PieChart, Filter } from "lucide-react"
import Link from "next/link"
import ResizableTable from "@/components/resizable-table"
import { ButtonGroup, IconButtonGroup, IconButton, GroupedIconButtons } from "@/components/ui/button-group"
import RowActionsDropdown from "@/components/ui/row-actions-dropdown"
import EditLeadModal from "@/components/modals/edit-lead-modal"
import DeleteLeadModal from "@/components/modals/delete-lead-modal"

interface Lead {
  id: number
  name: string
  title: string
  company: string
  phone: string
  email: string
  leadStatus: string
  ownerAlias: string
}

export default function LeadsContent() {
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: 1,
      name: "Rishab Nagwani",
      title: "asdasd",
      company: "Rishab Nagwani",
      phone: "09833014890",
      email: "nagwanirishab@gmail.com",
      leadStatus: "Nurturing",
      ownerAlias: "RNagw",
    },
  ])

  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  // Search and sort state
  const [searchQuery, setSearchQuery] = useState("")
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const columns = [
    { key: "name", label: "Name", defaultWidth: 200, minWidth: 100 },
    { key: "title", label: "Title", defaultWidth: 150, minWidth: 100 },
    { key: "company", label: "Company", defaultWidth: 180, minWidth: 100 },
    { key: "phone", label: "Phone", defaultWidth: 150, minWidth: 100 },
    { key: "email", label: "Email", defaultWidth: 200, minWidth: 120 },
    { key: "leadStatus", label: "Lead Status", defaultWidth: 150, minWidth: 100 },
    { key: "ownerAlias", label: "Owner Alias", defaultWidth: 150, minWidth: 100 },
  ]

  const actionButtons = [
    { label: "New" },
    { label: "Import" },
    { label: "Add to Campaign" },
    { label: "Send Email" },
    { label: "Change Owner", hasDropdown: true },
  ]

  const hasRecords = true

  // Filter and sort leads
  const filteredAndSortedLeads = () => {
    let filtered = [...leads]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((lead) =>
        lead.name?.toLowerCase().includes(query) ||
        lead.title?.toLowerCase().includes(query) ||
        lead.company?.toLowerCase().includes(query) ||
        lead.phone?.toLowerCase().includes(query) ||
        lead.email?.toLowerCase().includes(query) ||
        lead.leadStatus?.toLowerCase().includes(query) ||
        lead.ownerAlias?.toLowerCase().includes(query)
      )
    }

    // Apply sorting
    if (sortColumn) {
      filtered.sort((a, b) => {
        let aVal = a[sortColumn as keyof Lead] || ""
        let bVal = b[sortColumn as keyof Lead] || ""

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

  const displayedLeads = filteredAndSortedLeads()

  // Handle sort
  const handleSort = (columnKey: string, direction: "asc" | "desc") => {
    setSortColumn(columnKey)
    setSortDirection(direction)
  }

  const handleEdit = (lead: Lead) => {
    setSelectedLead(lead)
    setShowEditModal(true)
  }

  const handleDelete = (lead: Lead) => {
    setSelectedLead(lead)
    setShowDeleteModal(true)
  }

  const handleSaveLead = (updatedLead: Lead) => {
    setLeads(leads.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead)))
  }

  const handleConfirmDelete = () => {
    if (selectedLead) {
      setLeads(leads.filter((lead) => lead.id !== selectedLead.id))
    }
  }

  return (
    <div className="bg-[#f3f2f2]">
      {/* List View Header */}
      <div className="bg-white px-8 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#06a59a] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Leads</span>
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
          <p className="text-sm text-gray-600">1 item • Updated a few seconds ago</p>
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
        {displayedLeads.map((lead) => (
          <tr key={lead.id} className="hover:bg-[#f3f2f2] border-b border-gray-200">
            <td className="px-4 py-3">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
            </td>
            <td className="px-4 py-3 text-sm">
              <Link href={`/lead/${lead.id}`} className="text-[#0176d3] hover:underline">
                {lead.name}
              </Link>
            </td>
            <td className="px-4 py-3 text-sm text-gray-700">{lead.title}</td>
            <td className="px-4 py-3 text-sm text-gray-700">{lead.company}</td>
            <td className="px-4 py-3 text-sm text-gray-700">{lead.phone}</td>
            <td className="px-4 py-3 text-sm">
              <a href={`mailto:${lead.email}`} className="text-[#0176d3] hover:underline">
                {lead.email}
              </a>
            </td>
            <td className="px-4 py-3 text-sm text-gray-700">{lead.leadStatus}</td>
            <td className="px-4 py-3 text-sm text-gray-700">{lead.ownerAlias}</td>
            <td className="px-4 py-3">
              <RowActionsDropdown onEdit={() => handleEdit(lead)} onDelete={() => handleDelete(lead)} />
            </td>
          </tr>
        ))}
      </ResizableTable>

      {/* Modal components */}
      <EditLeadModal open={showEditModal} onOpenChange={setShowEditModal} lead={selectedLead} onSave={handleSaveLead} />

      <DeleteLeadModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        leadName={selectedLead?.name || ""}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
