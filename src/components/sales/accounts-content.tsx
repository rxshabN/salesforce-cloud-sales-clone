"use client"

import { useState } from "react"
import { Search, ChevronDown, Settings, Grid3x3, RefreshCw, Pin, Edit, PieChart, Filter } from "lucide-react"
import ResizableTable from "@/components/resizable-table"
import { ButtonGroup, IconButtonGroup, IconButton, GroupedIconButtons } from "@/components/ui/button-group"
import RowActionsDropdown from "@/components/ui/row-actions-dropdown"
import EditAccountModal from "@/components/modals/edit-account-modal"
import DeleteAccountModal from "@/components/modals/delete-account-modal"
import Link from "next/link"

interface Account {
  id: number
  accountName: string
  phone: string
  accountOwnerAlias: string
  website?: string
  type?: string
  description?: string
  parentAccount?: string
  billingCountry?: string
  billingStreet?: string
  billingCity?: string
  billingZip?: string
  billingState?: string
  shippingCountry?: string
  shippingStreet?: string
  shippingCity?: string
  shippingZip?: string
  shippingState?: string
}

export default function AccountsContent() {
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: 1,
      accountName: "asdasd",
      phone: "456456456",
      accountOwnerAlias: "RNagw",
      website: "asdasd",
      type: "Analyst",
      description: "123123",
      billingCountry: "Afghanistan",
      billingStreet: "B-302 Greenwoods CHS, Near WEH Metro Station, Andheri-Kurla Road, Andheri East,",
      billingCity: "Mumbai",
      billingZip: "400093",
      billingState: "--None--",
      shippingCountry: "Aland Islands",
      shippingStreet: "B-302 Greenwoods CHS, Near WEH Metro Station, Andheri-Kurla Road, Andheri East,",
      shippingCity: "Mumbai",
      shippingZip: "400093",
      shippingState: "--None--",
    },
  ])

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)

  const columns = [
    { key: "accountName", label: "Account Name", defaultWidth: 250, minWidth: 120 },
    { key: "phone", label: "Phone", defaultWidth: 150, minWidth: 100 },
    { key: "accountOwnerAlias", label: "Account Owner Alias", defaultWidth: 180, minWidth: 100 },
  ]

  const actionButtons = [{ label: "New" }, { label: "Import" }, { label: "Assign Label", hasDropdown: true }]

  const hasRecords = accounts.length > 0

  const handleEdit = (account: Account) => {
    console.log("[v0] handleEdit called for account:", account.id)
    setSelectedAccount(account)
    setEditModalOpen(true)
  }

  const handleDelete = (account: Account) => {
    console.log("[v0] handleDelete called for account:", account.id)
    setSelectedAccount(account)
    setDeleteModalOpen(true)
  }

  const handleSaveAccount = (updatedAccount: Account) => {
    setAccounts(accounts.map((acc) => (acc.id === updatedAccount.id ? updatedAccount : acc)))
  }

  const handleConfirmDelete = () => {
    if (selectedAccount) {
      setAccounts(accounts.filter((acc) => acc.id !== selectedAccount.id))
    }
  }

  return (
    <div className="bg-[#f3f2f2]">
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
            {accounts.length} item{accounts.length !== 1 ? "s" : ""} • Updated a few seconds ago
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
        {accounts.map((account) => (
          <tr key={account.id} className="border-b border-gray-200 hover:bg-gray-50">
            <td className="py-3 px-4">
              <input type="checkbox" className="rounded border-gray-300" />
            </td>
            <td className="py-3 px-4">
              <Link href={`/account/${account.id}`} className="text-[#0176d3] hover:underline">
                {account.accountName}
              </Link>
            </td>
            <td className="py-3 px-4 text-gray-700">{account.phone}</td>
            <td className="py-3 px-4 text-gray-700">{account.accountOwnerAlias}</td>
            <td className="py-3 px-4">
              <RowActionsDropdown
                onEdit={() => handleEdit(account)}
                onDelete={() => handleDelete(account)}
                onChangeOwner={() => console.log("[v0] Change owner:", account.id)}
                onEditLabels={() => console.log("[v0] Edit labels:", account.id)}
              />
            </td>
          </tr>
        ))}
      </ResizableTable>

      {/* Modals */}
      <EditAccountModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        account={selectedAccount}
        onSave={handleSaveAccount}
      />
      <DeleteAccountModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        accountName={selectedAccount?.accountName || ""}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
