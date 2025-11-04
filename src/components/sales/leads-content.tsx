"use client";

import { useEffect, useState } from "react";
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
import Link from "next/link";
import Image from "next/image"; 
import ResizableTable from "@/components/resizable-table";
import {
  ButtonGroup,
  IconButtonGroup,
  IconButton,
  GroupedIconButtons,
} from "@/components/ui/button-group";
import RowActionsDropdown from "@/components/ui/row-actions-dropdown";
import DeleteLeadModal from "@/components/modals/delete-lead-modal";
import { useToast } from "../toast-provider";
import axios from "axios";
import LeadFormModal, { LeadFormData } from "../modals/lead-form-modal";

interface Lead {
  id: number;
  name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  leadStatus: string;
  ownerAlias: string;
}

const initialLeadFormData: LeadFormData = {
  salutation: "",
  firstName: "",
  lastName: "",
  title: "",
  company: "",
  website: "",
  description: "",
  email: "",
  phone: "",
  country: "",
  street: "",
  city: "",
  zipPostalCode: "",
  stateProvince: "",
  numberOfEmployees: "",
  annualRevenue: "",
  leadSource: "",
  industry: "",
  status: "New", 
};

export default function LeadsContent() {
  const { showToast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true); 

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingLeadId, setDeletingLeadId] = useState<number | null>(null);
  const [deletingLeadName, setDeletingLeadName] = useState(""); 

  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingLeadId, setEditingLeadId] = useState<number | null>(null);
  const [leadFormData, setLeadFormData] = useState(initialLeadFormData);
  const [leadErrors, setLeadErrors] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false); 

  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>("name"); 
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc"); 

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
      key: "name",
      label: "Name",
      defaultWidth: 200,
      minWidth: 100,
      hasDropdown: true,
      isSortable: true,
    },
    {
      key: "title",
      label: "Title",
      defaultWidth: 150,
      minWidth: 100,
      hasDropdown: true,
      isSortable: true,
    },
    {
      key: "company",
      label: "Company",
      defaultWidth: 180,
      minWidth: 100,
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
      key: "email",
      label: "Email",
      defaultWidth: 200,
      minWidth: 120,
      hasDropdown: true,
      isSortable: true,
    },
    {
      key: "leadStatus",
      label: "Lead Status",
      defaultWidth: 150,
      minWidth: 100,
      hasDropdown: true,
      isSortable: true,
    },
    {
      key: "ownerAlias",
      label: "Owner Alias",
      defaultWidth: 150,
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

  const actionButtons = [
    {
      label: "New",
      onClick: () => {
        resetLeadForm();
        setIsNewLeadModalOpen(true);
      },
    },
    { label: "Import" },
    { label: "Add to Campaign" },
    { label: "Send Email" },
    { label: "Change Owner" }, 
  ];

  const hasRecords = leads.length > 0;

  const fetchLeads = async (query: string = "") => {
    setLoading(true);
    try {
      const url = query
        ? `/api/v1/sobjects/leads?search=${encodeURIComponent(query)}`
        : "/api/v1/sobjects/leads";
      const response = await axios.get(url);

      const mappedLeads = response.data.map((lead: any) => ({
        id: lead.id,
        name: `${lead.first_name || ""} ${lead.last_name || ""}`.trim(),
        title: lead.title,
        company: lead.company,
        phone: lead.phone,
        email: lead.email,
        leadStatus: lead.status,
        ownerAlias: lead.lead_owner,
      }));
      setLeads(mappedLeads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      showToast("Failed to fetch leads.", {
        label: "Dismiss",
        onClick: () => {},
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchLeads(searchQuery);
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]); 

  const sortedLeads = [...leads].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = a[sortColumn as keyof Lead] as string;
    const bVal = b[sortColumn as keyof Lead] as string;

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

  const resetLeadForm = () => {
    setLeadFormData(initialLeadFormData);
    setLeadErrors({});
    setIsEditMode(false);
    setEditingLeadId(null);
  };

  const handleLeadClose = () => {
    setIsNewLeadModalOpen(false);
    resetLeadForm();
  };

  const validateLeadForm = () => {
    const errors: Record<string, boolean> = {};
    if (!leadFormData.firstName.trim()) errors.firstName = true;
    if (!leadFormData.lastName.trim()) errors.lastName = true;
    if (!leadFormData.email.trim()) errors.email = true; 
    if (!leadFormData.company.trim()) errors.company = true;
    if (!leadFormData.status.trim() || leadFormData.status === "--None--")
      errors.status = true;
    setLeadErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEditClick = async (lead: Lead) => {
    try {
      const response = await axios.get(`/api/v1/sobjects/leads/${lead.id}`);
      const leadData = response.data;

      setLeadFormData({
        salutation: leadData.salutation || "",
        firstName: leadData.first_name || "",
        lastName: leadData.last_name || "",
        title: leadData.title || "",
        company: leadData.company || "",
        website: leadData.website || "",
        description: leadData.description || "",
        email: leadData.email || "",
        phone: leadData.phone || "",
        country: leadData.country || "",
        street: leadData.street || "",
        city: leadData.city || "",
        zipPostalCode: leadData.zip_postal_code || "",
        stateProvince: leadData.state_province || "",
        numberOfEmployees: leadData.number_of_employees
          ? leadData.number_of_employees.toString()
          : "",
        annualRevenue: leadData.annual_revenue || "",
        leadSource: leadData.lead_source || "",
        industry: leadData.industry || "",
        status: leadData.status || "New", 
      });

      setIsEditMode(true);
      setEditingLeadId(lead.id);
      setIsNewLeadModalOpen(true);
    } catch (error) {
      console.error("Error fetching lead:", error);
      showToast("Failed to load lead. Please try again.", {
        label: "Dismiss",
        onClick: () => {},
      });
    }
  };

  const handleDeleteClick = (lead: Lead) => {
    setDeletingLeadId(lead.id);
    setDeletingLeadName(lead.name);
    setShowDeleteModal(true);
  };

  const handleLeadSave = async () => {
    if (!validateLeadForm()) return;
    setIsSaving(true); 

    try {
      const leadData = {
        salutation: leadFormData.salutation || null,
        first_name: leadFormData.firstName,
        last_name: leadFormData.lastName,
        title: leadFormData.title || null,
        company: leadFormData.company, 
        website: leadFormData.website || null,
        description: leadFormData.description || null,
        email: leadFormData.email,
        phone: leadFormData.phone || null,
        country: leadFormData.country || null,
        street: leadFormData.street || null,
        city: leadFormData.city || null,
        zip_postal_code: leadFormData.zipPostalCode || null,
        state_province: leadFormData.stateProvince || null,
        number_of_employees: leadFormData.numberOfEmployees
          ? parseInt(leadFormData.numberOfEmployees)
          : null,
        annual_revenue: leadFormData.annualRevenue || null,
        lead_source: leadFormData.leadSource || null,
        industry: leadFormData.industry || null,
        lead_owner: "Rishab Nagwani",
        status: leadFormData.status, 
      };

      if (isEditMode && editingLeadId) {
        
        const response = await axios.patch(
          `/api/v1/sobjects/leads/${editingLeadId}`,
          leadData
        );
        if (response.status === 200) {
          showToast(
            `Lead "${leadFormData.firstName} ${leadFormData.lastName}" was updated.`,
            {
              label: "Dismiss",
              onClick: () => {},
            }
          );
          setIsNewLeadModalOpen(false);
          resetLeadForm();
          fetchLeads(searchQuery);
        }
      } else {
        
        const response = await axios.post("/api/v1/sobjects/leads", leadData);
        if (response.status === 201) {
          setIsNewLeadModalOpen(false);
          resetLeadForm();
          showToast(
            `Lead "${leadFormData.firstName} ${leadFormData.lastName}" was created.`,
            {
              label: "Undo",
              onClick: () => console.log("Undo lead creation"),
            }
          );
          fetchLeads(searchQuery);
        }
      }
    } catch (error: any) {
      console.error("Error saving lead:", error);
      if (error.response?.data?.code === "P2002") {
        showToast("A lead with this email already exists.", {
          label: "Dismiss",
          onClick: () => {},
        });
      } else {
        showToast("Failed to save lead. Please try again.", {
          label: "Dismiss",
          onClick: () => {},
        });
      }
    } finally {
      setIsSaving(false); 
    }
  };

  const handleLeadSaveAndNew = async () => {
    if (!validateLeadForm()) return;
    setIsSaving(true); 

    try {
      const leadData = {
        salutation: leadFormData.salutation || null,
        first_name: leadFormData.firstName,
        last_name: leadFormData.lastName,
        title: leadFormData.title || null,
        company: leadFormData.company, 
        website: leadFormData.website || null,
        description: leadFormData.description || null,
        email: leadFormData.email,
        phone: leadFormData.phone || null,
        country: leadFormData.country || null,
        street: leadFormData.street || null,
        city: leadFormData.city || null,
        zip_postal_code: leadFormData.zipPostalCode || null,
        state_province: leadFormData.stateProvince || null,
        number_of_employees: leadFormData.numberOfEmployees
          ? parseInt(leadFormData.numberOfEmployees)
          : null,
        annual_revenue: leadFormData.annualRevenue || null,
        lead_source: leadFormData.leadSource || null,
        industry: leadFormData.industry || null,
        lead_owner: "Rishab Nagwani",
        status: leadFormData.status, 
      };

      const response = await axios.post("/api/v1/sobjects/leads", leadData);

      if (response.status === 201) {
        showToast(
          `Lead "${leadFormData.firstName} ${leadFormData.lastName}" was created.`,
          {
            label: "Undo",
            onClick: () => console.log("Undo lead creation"),
          }
        );
        resetLeadForm();
        fetchLeads(searchQuery);
      }
    } catch (error: any) {
      console.error("Error creating lead:", error);
      if (error.response?.data?.code === "P2002") {
        showToast("A lead with this email already exists.", {
          label: "Dismiss",
          onClick: () => {},
        });
      } else {
        showToast("Failed to create lead. Please try again.", {
          label: "Dismiss",
          onClick: () => {},
        });
      }
    } finally {
      setIsSaving(false); 
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingLeadId) return;

    try {
      await axios.delete(`/api/v1/sobjects/leads/${deletingLeadId}`);
      showToast(`Lead "${deletingLeadName}" was deleted.`, {
        label: "Dismiss",
        onClick: () => {},
      });
      setShowDeleteModal(false);
      setDeletingLeadId(null);
      setDeletingLeadName("");
      fetchLeads(searchQuery);
    } catch (error) {
      console.error("Error deleting lead:", error);
      showToast("Failed to delete lead. Please try again.", {
        label: "Dismiss",
        onClick: () => {},
      });
    }
  };

  return (
    <div className="bg-[#f3f2f2]">
      
      <div className="bg-transparent px-8 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Image
              src="/leads-logo.png" 
              alt="Leads Logo"
              width={55}
              height={55}
            />
            <div className="flex flex-col items-start gap-2">
              <span className="text-sm text-gray-600">Leads</span>
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
              : `${sortedLeads.length} item${
                  sortedLeads.length !== 1 ? "s" : ""
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
                onClick={() => fetchLeads(searchQuery)}
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
                <span className="ml-2 text-gray-600">Loading leads...</span>
              </div>
            </td>
          </tr>
        ) : leads.length === 0 ? (
          <tr>
            <td
              colSpan={columns.length}
              className="text-center p-8 text-gray-500"
            >
              No leads found.
            </td>
          </tr>
        ) : (
          sortedLeads.map((lead, index) => (
            <tr
              key={lead.id}
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
                  href={`/lead/${lead.id}`}
                  className="text-[#0176d3] hover:underline"
                >
                  {lead.name}
                </Link>
              </td>
              <td className="py-2 px-3 text-sm text-gray-700">{lead.title}</td>
              <td className="py-2 px-3 text-sm text-gray-700">
                {lead.company}
              </td>
              <td className="py-2 px-3 text-sm text-gray-700">{lead.phone}</td>
              <td className="py-2 px-3 text-sm">
                <a
                  href={`mailto:${lead.email}`}
                  className="text-[#0176d3] hover:underline"
                >
                  {lead.email}
                </a>
              </td>
              <td className="py-2 px-3 text-sm text-gray-700">
                {lead.leadStatus}
              </td>
              <td className="py-2 px-3 text-sm text-gray-700">
                {lead.ownerAlias}
              </td>
              <td className="py-2 px-3 text-sm">
                <RowActionsDropdown
                  onEdit={() => handleEditClick(lead)}
                  onDelete={() => handleDeleteClick(lead)}
                />
              </td>
            </tr>
          ))
        )}
      </ResizableTable>
      
      <LeadFormModal
        isOpen={isNewLeadModalOpen}
        isEditMode={isEditMode}
        onClose={handleLeadClose}
        onSave={handleLeadSave}
        onSaveAndNew={handleLeadSaveAndNew}
        leadFormData={leadFormData}
        setLeadFormData={setLeadFormData}
        leadErrors={leadErrors}
        setLeadErrors={setLeadErrors}
        isSaving={isSaving} 
      />
      
      <DeleteLeadModal
        open={showDeleteModal}
        onOpenChange={(open) => {
          setShowDeleteModal(open);
          if (!open) {
            setDeletingLeadId(null);
            setDeletingLeadName("");
          }
        }}
        leadName={deletingLeadName}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
