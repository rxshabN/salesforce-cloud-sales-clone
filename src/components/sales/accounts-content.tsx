"use client";

import { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Settings,
  Grid3x3,
  RefreshCw,
  Pin,
  Edit,
  PieChart,
  Filter,
} from "lucide-react";
import Image from "next/image";
import ResizableTable from "@/components/resizable-table";
import {
  ButtonGroup,
  IconButtonGroup,
  IconButton,
  GroupedIconButtons,
} from "@/components/ui/button-group";
import RowActionsDropdown from "@/components/ui/row-actions-dropdown";
import AccountFormModal, {
  AccountFormData,
} from "@/components/modals/account-form-modal";
import DeleteAccountModal from "@/components/modals/delete-account-modal";
import Link from "next/link";
import axios from "axios";
import { useToast } from "@/components/toast-provider";

interface Account {
  id: number;
  accountName: string;
  phone: string;
  accountOwnerAlias: string;
  website?: string;
  type?: string;
  description?: string;
  billingCountry?: string;
  billingStreet?: string;
  billingCity?: string;
  billingZipPostalCode?: string;
  billingStateProvince?: string;
  shippingCountry?: string;
  shippingStreet?: string;
  shippingCity?: string;
  shippingZipPostalCode?: string;
  shippingStateProvince?: string;
}

const initialAccountFormData: AccountFormData = {
  name: "",
  website: "",
  type: "",
  description: "",
  parentAccount: "",
  parentAccountId: null,
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
};

export default function AccountsContent() {
  const { showToast } = useToast();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  const [isNewAccountModalOpen, setIsNewAccountModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingAccountId, setEditingAccountId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingAccountId, setDeletingAccountId] = useState<number | null>(
    null
  );
  const [deletingAccountName, setDeletingAccountName] = useState("");

  const [accountFormData, setAccountFormData] = useState<AccountFormData>(
    initialAccountFormData
  );
  const [accountErrors, setAccountErrors] = useState<Record<string, boolean>>(
    {}
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>("accountName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const hasRecords = accounts.length > 0;

  const columns = [
    {
      key: "serialNumber",
      label: "",
      defaultWidth: 40,
      minWidth: 40,
      hasDropdown: false,
      isSortable: false,
    },
    {
      key: "checkbox",
      label: <></>,
      defaultWidth: 40,
      minWidth: 40,
      hasDropdown: false,
      isSortable: false,
    },
    {
      key: "accountName",
      label: "Account Name",
      defaultWidth: 250,
      minWidth: 120,
      hasDropdown: true,
      isSortable: true,
    },
    {
      key: "phone",
      label: "Phone",
      defaultWidth: 150,
      minWidth: 100,
      hasDropdown: true,
      isSortable: true,
    },
    {
      key: "accountOwnerAlias",
      label: "Account Owner Alias",
      defaultWidth: 180,
      minWidth: 100,
      hasDropdown: true,
      isSortable: true,
    },
    {
      key: "actions",
      label: "",
      defaultWidth: 60,
      minWidth: 60,
      hasDropdown: false,
      isSortable: false,
    },
  ];

  const fetchAccounts = async (query: string = "") => {
    try {
      setLoading(true);
      const url = query
        ? `/api/v1/sobjects/accounts?search=${encodeURIComponent(query)}`
        : "/api/v1/sobjects/accounts";
      const response = await axios.get(url);

      const mappedAccounts = response.data.map((acc: any) => ({
        id: acc.id,
        accountName: acc.name,
        phone: acc.phone || "-",
        accountOwnerAlias: acc.account_owner || "-",
        website: acc.website,
        type: acc.type,
        description: acc.description,
        billingCountry: acc.billing_country,
        billingStreet: acc.billing_street,
        billingCity: acc.billing_city,
        billingZipPostalCode: acc.billing_zip_postal_code,
        billingStateProvince: acc.billing_state_province,
        shippingCountry: acc.shipping_country,
        shippingStreet: acc.shipping_street,
        shippingCity: acc.shipping_city,
        shippingZipPostalCode: acc.shipping_zip_postal_code,
        shippingStateProvince: acc.shipping_state_province,
      }));

      setAccounts(mappedAccounts);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      showToast("Failed to fetch accounts. Please try again.", {
        label: "Dismiss",
        onClick: () => {},
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchAccounts(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const sortedAccounts = [...accounts].sort((a, b) => {
    if (!sortColumn) return 0;

    const key = sortColumn as keyof Account;
    const aVal = a[key] as string;
    const bVal = b[key] as string;

    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (columnKey: string, direction: "asc" | "desc") => {
    setSortColumn(columnKey);
    setSortDirection(direction);
  };

  const resetAccountForm = () => {
    setAccountFormData(initialAccountFormData);
    setAccountErrors({});
    setIsEditMode(false);
    setEditingAccountId(null);
  };

  const validateAccountForm = () => {
    const errors: Record<string, boolean> = {};
    if (!accountFormData.name.trim()) {
      errors.name = true;
    }
    setAccountErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAccountSave = async () => {
    if (!validateAccountForm()) return;

    try {
      const accountData = {
        name: accountFormData.name,
        website: accountFormData.website || null,
        type: accountFormData.type || null,
        description: accountFormData.description || null,
        parent_account_id: accountFormData.parentAccountId || null,
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
      };

      if (isEditMode && editingAccountId) {
        const response = await axios.patch(
          `/api/v1/sobjects/accounts/${editingAccountId}`,
          accountData
        );
        if (response.status === 200) {
          showToast(`Account "${accountFormData.name}" was updated.`, {
            label: "Undo",
            onClick: () => console.log("Undo account update"),
          });
          setIsNewAccountModalOpen(false);
          resetAccountForm();
          fetchAccounts(searchQuery);
        }
      } else {
        const response = await axios.post(
          "/api/v1/sobjects/accounts",
          accountData
        );
        if (response.status === 201) {
          showToast(`Account "${accountFormData.name}" was created.`, {
            label: "Undo",
            onClick: () => console.log("Undo account creation"),
          });
          setIsNewAccountModalOpen(false);
          resetAccountForm();
          fetchAccounts(searchQuery);
        }
      }
    } catch (error) {
      console.error("Error saving account:", error);
      showToast("Failed to save account. Please try again.", {
        label: "Dismiss",
        onClick: () => {},
      });
    }
  };

  const handleAccountSaveAndNew = async () => {
    if (!validateAccountForm()) return;

    try {
      const accountData = {
        name: accountFormData.name,
        website: accountFormData.website || null,
        type: accountFormData.type || null,
        description: accountFormData.description || null,
        parent_account_id: accountFormData.parentAccountId || null,
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
      };

      const response = await axios.post(
        "/api/v1/sobjects/accounts",
        accountData
      );
      if (response.status === 201) {
        showToast(`Account "${accountFormData.name}" was created.`, {
          label: "Undo",
          onClick: () => console.log("Undo account creation"),
        });
        resetAccountForm();
        fetchAccounts(searchQuery);
      }
    } catch (error) {
      console.error("Error saving account:", error);
      showToast("Failed to save account. Please try again.", {
        label: "Dismiss",
        onClick: () => {},
      });
    }
  };

  const handleAccountClose = () => {
    setIsNewAccountModalOpen(false);
    resetAccountForm();
  };

  const handleEditClick = async (account: Account) => {
    try {
      const response = await axios.get(
        `/api/v1/sobjects/accounts/${account.id}`
      );
      const accountData = response.data;
      let parentAccountName = "";
      if (accountData.parent_account_id) {
        try {
          const parentAcc = await axios.get(
            `/api/v1/sobjects/accounts/${accountData.parent_account_id}`
          );
          parentAccountName = parentAcc.data.name;
        } catch (e) {
          console.error("Could not fetch parent account name", e);
        }
      }
      setAccountFormData({
        name: accountData.name || "",
        website: accountData.website || "",
        type: accountData.type || "",
        description: accountData.description || "",
        parentAccount: parentAccountName, // [MODIFIED]
        parentAccountId: accountData.parent_account_id || null, // [MODIFIED]
        phone: accountData.phone || "",
        billingCountry: accountData.billing_country || "",
        billingStreet: accountData.billing_street || "",
        billingCity: accountData.billing_city || "",
        billingZipPostalCode: accountData.billing_zip_postal_code || "",
        billingStateProvince: accountData.billing_state_province || "",
        shippingCountry: accountData.shipping_country || "",
        shippingStreet: accountData.shipping_street || "",
        shippingCity: accountData.shipping_city || "",
        shippingZipPostalCode: accountData.shipping_zip_postal_code || "",
        shippingStateProvince: accountData.shipping_state_province || "",
      });

      setIsEditMode(true);
      setEditingAccountId(account.id);
      setIsNewAccountModalOpen(true);
    } catch (error) {
      console.error("Error fetching account:", error);
      showToast("Failed to load account. Please try again.", {
        label: "Dismiss",
        onClick: () => {},
      });
    }
  };

  const handleDeleteClick = (account: Account) => {
    setDeletingAccountId(account.id);
    setDeletingAccountName(account.accountName);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingAccountId) return;

    try {
      await axios.delete(`/api/v1/sobjects/accounts/${deletingAccountId}`);
      showToast(`Account "${deletingAccountName}" was deleted.`, {
        label: "Undo",
        onClick: () => console.log("Undo account deletion"),
      });
      setIsDeleteModalOpen(false);
      setDeletingAccountId(null);
      setDeletingAccountName("");
      fetchAccounts(searchQuery);
    } catch (error) {
      console.error("Error deleting account:", error);
      showToast("Failed to delete account. Please try again.", {
        label: "Dismiss",
        onClick: () => {},
      });
    }
  };

  const actionButtons = [
    {
      label: "New",
      onClick: () => {
        resetAccountForm();
        setIsNewAccountModalOpen(true);
      },
    },
    { label: "Import" },
    { label: "Assign Label" },
  ];

  return (
    <div className="bg-[#f3f2f2]">
      <div className="bg-transparent px-8 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Image
              src="/accounts-logo.png"
              alt="Accounts Logo"
              width={40}
              height={40}
            />
            <div className="flex flex-col items-start gap-2">
              <span className="text-sm text-gray-600">Accounts</span>
              <button className="flex items-center gap-1 text-3xl font-normal text-[#080707]">
                Recently Viewed
                <ChevronDown className="w-5 h-5" />
                <div className="bg-white rounded-full p-2 hover:-translate-y-0.5 hover:shadow-sm hover:shadown-black duration-300">
                  <Pin className="w-4 h-4 rotate-45 text-blue-500 " />
                </div>
              </button>
            </div>
          </div>
          <ButtonGroup buttons={actionButtons} />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {loading
              ? "Loading..."
              : `${accounts.length} item${
                  accounts.length !== 1 ? "s" : ""
                } • Updated a few seconds ago`}
          </p>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search this list..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border bg-white border-gray-700 rounded-md w-64 focus:outline-none focus:ring-1 focus:ring-[#0176d3]"
              />
            </div>
            <IconButtonGroup>
              <IconButton
                icon={<Settings className="w-4 h-4 text-[#2b50d8]" />}
                hasDropdown
              />
              <IconButton
                icon={<Grid3x3 className="w-4 h-4 text-[#2b50d8]" />}
                hasDropdown
              />
              <IconButton
                icon={<RefreshCw className="w-4 h-4 text-[#2b50d8]" />}
                onClick={() => fetchAccounts(searchQuery)}
              />
              <IconButton icon={<Pin className="w-4 h-4 text-[#2b50d8]" />} />
              <IconButton icon={<Edit className="w-4 h-4 text-[#2b50d8]" />} />
              <GroupedIconButtons
                buttons={[
                  { icon: <PieChart className="w-4 h-4 text-[#2b50d8]" /> },
                  { icon: <Filter className="w-4 h-4 text-[#2b50d8]" /> },
                ]}
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
            <td colSpan={columns.length} className="text-center py-8">
              <div className="flex justify-center items-center">
                <RefreshCw className="w-6 h-6 animate-spin text-[#0176d3]" />
                <span className="ml-2 text-gray-600">Loading accounts...</span>
              </div>
            </td>
          </tr>
        ) : accounts.length === 0 ? (
          <tr>
            <td
              colSpan={columns.length}
              className="text-center p-8 text-gray-500"
            >
              No accounts found.
            </td>
          </tr>
        ) : (
          sortedAccounts.map((account, index) => (
            <tr
              key={account.id}
              className="border-b border-gray-200 hover:bg-gray-50"
            >
              <td className="py-2 px-3 text-gray-700 w-10 text-right text-sm">
                {index + 1}
              </td>
              <td className="py-2 px-2 text-right">
                <input type="checkbox" className="rounded border-gray-300" />
              </td>
              <td className="py-2 px-3 text-sm">
                <Link
                  href={`/accounts/${account.id}`}
                  className="text-[#0176d3] hover:underline"
                >
                  {account.accountName}
                </Link>
              </td>
              <td className="py-2 px-3 text-sm text-gray-700">
                {account.phone}
              </td>
              <td className="py-2 px-3 text-sm text-gray-700">
                {account.accountOwnerAlias}
              </td>
              <td className="py-2 px-3 text-sm">
                <RowActionsDropdown
                  onEdit={() => handleEditClick(account)}
                  onDelete={() => handleDeleteClick(account)}
                  onChangeOwner={() => console.log("Change owner:", account.id)}
                  onEditLabels={() => console.log("Edit labels:", account.id)}
                />
              </td>
            </tr>
          ))
        )}
      </ResizableTable>

      <AccountFormModal
        isOpen={isNewAccountModalOpen}
        isEditMode={isEditMode}
        accountFormData={accountFormData}
        accountErrors={accountErrors}
        onClose={handleAccountClose}
        onSave={handleAccountSave}
        onSaveAndNew={handleAccountSaveAndNew}
        setAccountFormData={setAccountFormData}
        setAccountErrors={setAccountErrors}
      />

      <DeleteAccountModal
        open={isDeleteModalOpen}
        onOpenChange={(open) => {
          setIsDeleteModalOpen(open);
          if (!open) {
            setDeletingAccountId(null);
            setDeletingAccountName("");
          }
        }}
        accountName={deletingAccountName}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
