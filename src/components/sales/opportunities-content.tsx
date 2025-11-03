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
import DeleteOpportunityModal from "@/components/modals/delete-opportunity-modal";
import Link from "next/link";
import axios from "axios";
import { useToast } from "@/components/toast-provider";
import OpportunityFormModal, {
  OpportunityFormData,
} from "@/components/modals/opportunity-form-modal";

interface Opportunity {
  id: number;
  opportunityName: string;
  accountName: string;
  stage: string;
  closeDate: string;
  opportunityOwnerAlias: string;
  amount?: string;
  description?: string;
  probability?: string;
  forecastCategory?: string;
  nextStep?: string;
  account_id?: number;
}

const initialOpportunityFormData: OpportunityFormData = {
  opportunityName: "",
  accountName: "",
  closeDate: "",
  amount: "",
  description: "",
  stage: "",
  probability: "",
  forecastCategory: "",
  nextStep: "",
};

export default function OpportunitiesContent() {
  const { showToast } = useToast();

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(
    "opportunityName"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingOpportunityId, setEditingOpportunityId] = useState<
    number | null
  >(null);
  const [opportunityFormData, setOpportunityFormData] = useState(
    initialOpportunityFormData
  );
  const [opportunityErrors, setOpportunityErrors] = useState<
    Record<string, boolean>
  >({});
  const [isSaving, setIsSaving] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingOpportunity, setDeletingOpportunity] =
    useState<Opportunity | null>(null);

  const fetchOpportunities = async (query: string = "") => {
    setLoading(true);
    try {
      const url = query
        ? `/api/v1/sobjects/opportunities?search=${encodeURIComponent(query)}`
        : "/api/v1/sobjects/opportunities";

      const response = await axios.get(url);

      const mappedOpportunities = response.data.map((opp: any) => ({
        id: opp.id,
        opportunityName: opp.name,
        accountName: opp.accounts?.name || "N/A",
        stage: opp.stage,
        closeDate: new Date(opp.close_date).toLocaleDateString("en-GB"), // dd/mm/yyyy
        opportunityOwnerAlias: opp.opportunity_owner,
        amount: opp.amount ? `$${Number(opp.amount).toLocaleString()}` : "",
        description: opp.description,
        probability: opp.probability ? `${opp.probability}%` : "",
        forecastCategory: opp.forecast_category,
        nextStep: opp.next_step,
        account_id: opp.account_id,
      }));
      setOpportunities(mappedOpportunities);
    } catch (error) {
      console.error("Error fetching opportunities:", error);
      showToast("Failed to fetch opportunities.", {
        label: "Dismiss",
        onClick: () => {},
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchOpportunities(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const getOrCreateAccountId = async (
    accountName: string
  ): Promise<number | null> => {
    if (!accountName.trim()) {
      showToast("Account Name is required.", {
        label: "Dismiss",
        onClick: () => {},
      });
      return null;
    }
    try {
      const searchResponse = await axios.get(
        `/api/v1/sobjects/accounts?name=${encodeURIComponent(accountName)}`
      );
      const accounts = searchResponse.data || [];
      const exactMatch = accounts.find(
        (acc: any) => acc.name.toLowerCase() === accountName.toLowerCase()
      );
      if (exactMatch) return exactMatch.id;

      const createResponse = await axios.post("/api/v1/sobjects/accounts", {
        name: accountName,
        account_owner: "Rishab Nagwani",
      });
      if (createResponse.status === 201) {
        showToast(`New account "${accountName}" created.`, {
          label: "Dismiss",
          onClick: () => {},
        });
        return createResponse.data.id;
      }
      throw new Error("Failed to create account");
    } catch (error) {
      console.error("Error in getOrCreateAccountId:", error);
      showToast("Error finding or creating account.", {
        label: "Dismiss",
        onClick: () => {},
      });
      return null;
    }
  };

  const resetOpportunityForm = () => {
    setOpportunityFormData(initialOpportunityFormData);
    setOpportunityErrors({});
    setIsEditMode(false);
    setEditingOpportunityId(null);
  };

  const validateOpportunityForm = () => {
    const errors: Record<string, boolean> = {};
    if (!opportunityFormData.opportunityName.trim())
      errors.opportunityName = true;
    if (!opportunityFormData.accountName.trim()) errors.accountName = true;
    if (!opportunityFormData.closeDate.trim()) errors.closeDate = true;
    if (!opportunityFormData.stage || opportunityFormData.stage === "--None--")
      errors.stage = true;
    if (
      !opportunityFormData.forecastCategory ||
      opportunityFormData.forecastCategory === "--None--"
    )
      errors.forecastCategory = true;
    setOpportunityErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormModalClose = () => {
    setIsFormModalOpen(false);
    resetOpportunityForm();
  };

  const handleSave = async () => {
    if (!validateOpportunityForm()) return;
    setIsSaving(true);

    try {
      const accountId = await getOrCreateAccountId(
        opportunityFormData.accountName
      );
      if (!accountId) {
        setIsSaving(false);
        return;
      }

      const opportunityData = {
        account_id: accountId,
        name: opportunityFormData.opportunityName,
        amount: opportunityFormData.amount
          ? parseFloat(opportunityFormData.amount)
          : null,
        close_date: opportunityFormData.closeDate,
        description: opportunityFormData.description || null,
        opportunity_owner: "Rishab Nagwani",
        stage: opportunityFormData.stage,
        probability: opportunityFormData.probability
          ? parseFloat(opportunityFormData.probability)
          : null,
        forecast_category: opportunityFormData.forecastCategory,
        next_step: opportunityFormData.nextStep || null,
      };

      if (isEditMode && editingOpportunityId) {
        const response = await axios.patch(
          `/api/v1/sobjects/opportunities/${editingOpportunityId}`,
          opportunityData
        );
        if (response.status === 200) {
          showToast(
            `Opportunity "${opportunityFormData.opportunityName}" was updated.`,
            {
              label: "Dismiss",
              onClick: () => {},
            }
          );
          handleFormModalClose();
          fetchOpportunities(searchQuery);
        }
      } else {
        const response = await axios.post(
          "/api/v1/sobjects/opportunities",
          opportunityData
        );

        if (response.status === 201) {
          showToast(
            `Opportunity "${opportunityFormData.opportunityName}" was created.`,
            {
              label: "Undo",
              onClick: () => {},
            }
          );
          handleFormModalClose();
          fetchOpportunities(searchQuery);
        }
      }
    } catch (error) {
      console.error("Error saving opportunity:", error);
      showToast("Failed to save opportunity. Please try again.", {
        label: "Dismiss",
        onClick: () => {},
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleNewOpportunitySaveAndNew = async () => {
    if (!validateOpportunityForm()) return;
    setIsSaving(true);

    try {
      const accountId = await getOrCreateAccountId(
        opportunityFormData.accountName
      );
      if (!accountId) {
        setIsSaving(false);
        return;
      }

      const opportunityData = {
        account_id: accountId,
        name: opportunityFormData.opportunityName,
        amount: opportunityFormData.amount
          ? parseFloat(opportunityFormData.amount)
          : null,
        close_date: opportunityFormData.closeDate,
        description: opportunityFormData.description || null,
        opportunity_owner: "Rishab Nagwani",
        stage: opportunityFormData.stage,
        probability: opportunityFormData.probability
          ? parseFloat(opportunityFormData.probability)
          : null,
        forecast_category: opportunityFormData.forecastCategory,
        next_step: opportunityFormData.nextStep || null,
      };

      const response = await axios.post(
        "/api/v1/sobjects/opportunities",
        opportunityData
      );

      if (response.status === 201) {
        showToast(
          `Opportunity "${opportunityFormData.opportunityName}" was created.`,
          {
            label: "Undo",
            onClick: () => {},
          }
        );
        resetOpportunityForm();
        fetchOpportunities(searchQuery);
      }
    } catch (error) {
      console.error("Error creating opportunity:", error);
      showToast("Failed to create opportunity. Please try again.", {
        label: "Dismiss",
        onClick: () => {},
      });
    } finally {
      setIsSaving(false);
    }
  };
  const handleEdit = async (opportunity: Opportunity) => {
    try {
      const response = await axios.get(
        `/api/v1/sobjects/opportunities/${opportunity.id}`
      );
      const oppData = response.data;
      const closeDate = oppData.close_date
        ? oppData.close_date.split("T")[0]
        : "";

      setOpportunityFormData({
        opportunityName: oppData.name || "",
        accountName: oppData.accounts?.name || "",
        closeDate: closeDate,
        amount: oppData.amount ? oppData.amount.toString() : "",
        description: oppData.description || "",
        stage: oppData.stage || "",
        probability: oppData.probability ? oppData.probability.toString() : "",
        forecastCategory: oppData.forecast_category || "",
        nextStep: oppData.next_step || "",
      });

      setIsEditMode(true);
      setEditingOpportunityId(opportunity.id);

      setIsFormModalOpen(true);
    } catch (error) {
      console.error("Error fetching opportunity:", error);
      showToast("Failed to load opportunity. Please try again.", {
        label: "Dismiss",
        onClick: () => {},
      });
    }
  };

  const handleDelete = (opportunity: Opportunity) => {
    setDeletingOpportunity(opportunity);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingOpportunity) return;

    try {
      const response = await axios.delete(
        `/api/v1/sobjects/opportunities/${deletingOpportunity.id}`
      );
      if (response.status === 204 || response.status === 200) {
        showToast(
          `Opportunity "${deletingOpportunity.opportunityName}" was deleted.`,
          {
            label: "Dismiss",
            onClick: () => {},
          }
        );
        setDeleteModalOpen(false);
        setDeletingOpportunity(null);
        fetchOpportunities(searchQuery);
      }
    } catch (error) {
      console.error("Error deleting opportunity:", error);
      showToast("Failed to delete opportunity.", {
        label: "Dismiss",
        onClick: () => {},
      });
    }
  };

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
      key: "opportunityName",
      label: "Opportunity Name",
      defaultWidth: 220,
      minWidth: 120,
      hasDropdown: true,
      isSortable: true,
    },
    {
      key: "accountName",
      label: "Account Name",
      defaultWidth: 180,
      minWidth: 100,
      hasDropdown: true,
      isSortable: true,
    },
    {
      key: "stage",
      label: "Stage",
      defaultWidth: 150,
      minWidth: 100,
      hasDropdown: true,
      isSortable: true,
    },
    {
      key: "closeDate",
      label: "Close Date",
      defaultWidth: 140,
      minWidth: 100,
      hasDropdown: true,
      isSortable: true,
    },
    {
      key: "opportunityOwnerAlias",
      label: "Opportunity Owner Alias",
      defaultWidth: 200,
      minWidth: 120,
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

  const actionButtons = [
    {
      label: "New",
      onClick: () => {
        resetOpportunityForm();
        setIsFormModalOpen(true);
      },
    },
    { label: "Import" },
    { label: "Assign Label" },
  ];

  const hasRecords = opportunities.length > 0;

  const sortedOpportunities = [...opportunities].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = a[sortColumn as keyof Opportunity] as string;
    const bVal = b[sortColumn as keyof Opportunity] as string;

    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    if (sortColumn === "closeDate") {
      const [dayA, monthA, yearA] = aVal.split("/").map(Number);
      const [dayB, monthB, yearB] = bVal.split("/").map(Number);
      const dateA = new Date(yearA, monthA - 1, dayA).getTime();
      const dateB = new Date(yearB, monthB - 1, dayB).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (columnKey: string, direction: "asc" | "desc") => {
    setSortColumn(columnKey);
    setSortDirection(direction);
  };

  return (
    <>
      <div className="bg-[#f3f2f2]">
        <div className="bg-transparent px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Image
                src="/opportunities-logo.png"
                alt="Opportunities Logo"
                width={40}
                height={40}
              />
              <div className="flex flex-col items-start gap-2">
                <span className="text-sm text-gray-600">Opportunities</span>
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
                : `${sortedOpportunities.length} item${
                    sortedOpportunities.length !== 1 ? "s" : ""
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
                  onClick={() => fetchOpportunities(searchQuery)}
                />
                <IconButton icon={<Pin className="w-4 h-4 text-[#2b50d8]" />} />
                <IconButton
                  icon={<Edit className="w-4 h-4 text-[#2b50d8]" />}
                />
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
                  <span className="ml-2 text-gray-600">
                    Loading opportunities...
                  </span>
                </div>
              </td>
            </tr>
          ) : opportunities.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center p-8 text-gray-500"
              >
                No opportunities found.
              </td>
            </tr>
          ) : (
            sortedOpportunities.map((opportunity, index) => (
              <tr
                key={opportunity.id}
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
                    href={`/opportunities/${opportunity.id}`}
                    className="text-[#0176d3] hover:underline"
                  >
                    {opportunity.opportunityName}
                  </Link>
                </td>
                <td className="py-2 px-3 text-sm">
                  <Link
                    href={`/accounts/${opportunity.account_id || 1}`}
                    className="text-[#0176d3] hover:underline"
                  >
                    {opportunity.accountName}
                  </Link>
                </td>
                <td className="py-2 px-3 text-sm text-gray-700">
                  {opportunity.stage}
                </td>
                <td className="py-2 px-3 text-sm text-gray-700">
                  {opportunity.closeDate}
                </td>
                <td className="py-2 px-3 text-sm text-gray-700">
                  {opportunity.opportunityOwnerAlias}
                </td>
                <td className="py-2 px-3 text-sm">
                  <RowActionsDropdown
                    onEdit={() => handleEdit(opportunity)}
                    onDelete={() => handleDelete(opportunity)}
                    onChangeOwner={() =>
                      console.log("[v0] Change owner:", opportunity.id)
                    }
                    onEditLabels={() =>
                      console.log("[v0] Edit labels:", opportunity.id)
                    }
                  />
                </td>
              </tr>
            ))
          )}
        </ResizableTable>
      </div>
      <OpportunityFormModal
        isOpen={isFormModalOpen}
        isEditMode={isEditMode}
        onClose={handleFormModalClose}
        onSave={handleSave}
        onSaveAndNew={handleNewOpportunitySaveAndNew}
        opportunityFormData={opportunityFormData}
        setOpportunityFormData={setOpportunityFormData}
        opportunityErrors={opportunityErrors}
        setOpportunityErrors={setOpportunityErrors}
        isSaving={isSaving}
      />
      <DeleteOpportunityModal
        open={deleteModalOpen}
        onOpenChange={(open) => {
          setDeleteModalOpen(open);
          if (!open) {
            setDeletingOpportunity(null);
          }
        }}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
