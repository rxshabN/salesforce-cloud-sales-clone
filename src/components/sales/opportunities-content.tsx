"use client"

import { useState } from "react"
import { Search, ChevronDown, Settings, Grid3x3, RefreshCw, Pin, Edit, PieChart, Filter } from "lucide-react"
import ResizableTable from "@/components/resizable-table"
import { ButtonGroup, IconButtonGroup, IconButton, GroupedIconButtons } from "@/components/ui/button-group"
import RowActionsDropdown from "@/components/ui/row-actions-dropdown"
import EditOpportunityModal from "@/components/modals/edit-opportunity-modal"
import DeleteOpportunityModal from "@/components/modals/delete-opportunity-modal"
import Link from "next/link"

interface Opportunity {
  id: number
  opportunityName: string
  accountName: string
  stage: string
  closeDate: string
  opportunityOwnerAlias: string
  amount?: string
  description?: string
  probability?: string
  forecastCategory?: string
  nextStep?: string
}

export default function OpportunitiesContent() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([
    {
      id: 1,
      opportunityName: "Rishab Nagwani",
      accountName: "asdasd",
      stage: "Closed Lost",
      closeDate: "23/10/2025",
      opportunityOwnerAlias: "RNagw",
      amount: "$56,000.00",
      description: "asdasdasdasd",
      probability: "0%",
      forecastCategory: "Omitted",
      nextStep: "asdasdasdasd",
    },
    {
      id: 2,
      opportunityName: "Rishab Nagwani erew",
      accountName: "asdasd",
      stage: "Propose",
      closeDate: "30/10/2025",
      opportunityOwnerAlias: "RNagw",
      amount: "$75,000.00",
      description: "Follow up opportunity",
      probability: "60%",
      forecastCategory: "Best Case",
      nextStep: "Schedule demo",
    },
  ])

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null)

  const handleEdit = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity)
    setEditModalOpen(true)
  }

  const handleDelete = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity)
    setDeleteModalOpen(true)
  }

  const handleSaveOpportunity = (updatedOpportunity: Opportunity) => {
    setOpportunities(opportunities.map((opp) => (opp.id === updatedOpportunity.id ? updatedOpportunity : opp)))
  }

  const handleConfirmDelete = () => {
    if (selectedOpportunity) {
      setOpportunities(opportunities.filter((opp) => opp.id !== selectedOpportunity.id))
    }
  }

  const columns = [
    { key: "opportunityName", label: "Opportunity Name", defaultWidth: 220, minWidth: 120 },
    { key: "accountName", label: "Account Name", defaultWidth: 180, minWidth: 100 },
    { key: "stage", label: "Stage", defaultWidth: 150, minWidth: 100 },
    { key: "closeDate", label: "Close Date", defaultWidth: 140, minWidth: 100 },
    { key: "opportunityOwnerAlias", label: "Opportunity Owner Alias", defaultWidth: 200, minWidth: 120 },
  ]

  const actionButtons = [{ label: "New" }, { label: "Import" }, { label: "Assign Label", hasDropdown: true }]

  const hasRecords = opportunities.length > 0

  return (
    <>
      <div className="bg-[#f3f2f2]">
        {/* List View Header */}
        <div className="bg-white px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#f59e0b] flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Opportunities</span>
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
              {opportunities.length} item{opportunities.length !== 1 ? "s" : ""} • Updated a few seconds ago
            </p>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search this list..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-[#0176d3]"
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
          {opportunities.map((opportunity) => (
            <tr key={opportunity.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="py-3 px-4">
                <input type="checkbox" className="rounded border-gray-300" />
              </td>
              <td className="py-3 px-4">
                <Link href={`/opportunity/${opportunity.id}`} className="text-[#0176d3] hover:underline">
                  {opportunity.opportunityName}
                </Link>
              </td>
              <td className="py-3 px-4">
                <Link href="#" className="text-[#0176d3] hover:underline">
                  {opportunity.accountName}
                </Link>
              </td>
              <td className="py-3 px-4 text-gray-700">{opportunity.stage}</td>
              <td className="py-3 px-4 text-gray-700">{opportunity.closeDate}</td>
              <td className="py-3 px-4 text-gray-700">{opportunity.opportunityOwnerAlias}</td>
              <td className="py-3 px-4">
                <RowActionsDropdown
                  onEdit={() => handleEdit(opportunity)}
                  onDelete={() => handleDelete(opportunity)}
                  onChangeOwner={() => console.log("[v0] Change owner:", opportunity.id)}
                  onEditLabels={() => console.log("[v0] Edit labels:", opportunity.id)}
                />
              </td>
            </tr>
          ))}
        </ResizableTable>
      </div>

      <EditOpportunityModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        opportunity={selectedOpportunity}
        onSave={handleSaveOpportunity}
      />

      <DeleteOpportunityModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}
