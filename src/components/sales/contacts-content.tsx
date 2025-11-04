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
import DeleteContactModal from "@/components/modals/delete-contact-modal";
import Link from "next/link";
import axios from "axios";
import { useToast } from "@/components/toast-provider";
import ContactFormModal, {
  ContactFormData,
} from "@/components/modals/contact-form-modal";
import { getOrCreateAccountId } from "@/lib/account-utils";

interface Contact {
  id: number;
  name: string;
  accountName: string;
  phone: string;
  email: string;
  contactOwnerAlias: string;
  account_id?: number;
}

const initialContactFormData: ContactFormData = {
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
};

export default function ContactsContent() {
  const { showToast } = useToast();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  const [isNewContactModalOpen, setIsNewContactModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingContactId, setEditingContactId] = useState<number | null>(null);
  const [contactFormData, setContactFormData] = useState(
    initialContactFormData
  );
  const [contactErrors, setContactErrors] = useState<Record<string, boolean>>(
    {}
  );

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingContactId, setDeletingContactId] = useState<number | null>(
    null
  );

  const sortedContacts = [...contacts].sort((a, b) => {
    if (!sortColumn) return 0;

    const aVal = a[sortColumn as keyof Contact] as string;
    const bVal = b[sortColumn as keyof Contact] as string;

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
  const [deletingContactName, setDeletingContactName] = useState("");

  const fetchContacts = async (query: string = "") => {
    setLoading(true);
    try {
      const url = query
        ? `/api/v1/sobjects/contacts?search=${encodeURIComponent(query)}`
        : "/api/v1/sobjects/contacts";

      const response = await axios.get(url);

      const mappedContacts = response.data.map((c: any) => ({
        id: c.id,
        name: `${c.first_name || ""} ${c.last_name || ""}`.trim(),
        accountName: c.accounts?.name || "N/A",
        phone: c.phone || "",
        email: c.email,
        contactOwnerAlias: c.contact_owner,
        account_id: c.account_id,
      }));
      setContacts(mappedContacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      showToast("Failed to fetch contacts.", {
        label: "Dismiss",
        onClick: () => {},
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    
    fetchContacts();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchContacts(searchQuery);
    }, 300); 

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const resetContactForm = () => {
    setContactFormData(initialContactFormData);
    setContactErrors({});
    setIsEditMode(false);
    setEditingContactId(null);
  };

  const validateContactForm = () => {
    const errors: Record<string, boolean> = {};
    if (!contactFormData.firstName.trim()) errors.firstName = true;
    if (!contactFormData.lastName.trim()) errors.lastName = true;
    if (!contactFormData.email.trim()) errors.email = true;
    if (!contactFormData.accountName.trim()) errors.accountName = true;
    setContactErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContactSave = async () => {
    if (!validateContactForm()) return;

    try {
      const accountId = await getOrCreateAccountId(contactFormData.accountName);
      if (!accountId) {
        showToast("Error finding or creating account.", {
          label: "Dismiss",
          onClick: () => {},
        });
        return;
      }

      const contactData = {
        account_id: accountId,
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
      };

      if (isEditMode && editingContactId) {
        
        const response = await axios.patch(
          `/api/v1/sobjects/contacts/${editingContactId}`,
          contactData
        );
        if (response.status === 200) {
          showToast(
            `Contact "${contactFormData.firstName} ${contactFormData.lastName}" was updated.`,
            {
              label: "Dismiss",
              onClick: () => {},
            }
          );
          setIsNewContactModalOpen(false);
          resetContactForm();
          fetchContacts(searchQuery);
        }
      } else {
        
        const response = await axios.post(
          "/api/v1/sobjects/contacts",
          contactData
        );
        if (response.status === 201) {
          showToast(
            `Contact "${contactFormData.firstName} ${contactFormData.lastName}" was created.`,
            {
              label: "Undo",
              onClick: () => {},
            }
          );
          setIsNewContactModalOpen(false);
          resetContactForm();
          fetchContacts(searchQuery);
        }
      }
    } catch (error: any) {
      console.error("Error saving contact:", error);
      if (error.message === "Account Name is required.") {
        showToast("Account Name is required.", {
          label: "Dismiss",
          onClick: () => {},
        });
      } else if (error.response?.data?.code === "P2002") {
        showToast("A contact with this email already exists.", {
          label: "Dismiss",
          onClick: () => {},
        });
      } else {
        showToast("Failed to save contact. Please try again.", {
          label: "Dismiss",
          onClick: () => {},
        });
      }
    }
  };

  const handleNewContactSaveAndNew = async () => {
    if (!validateContactForm()) return;

    try {
      const accountId = await getOrCreateAccountId(contactFormData.accountName);
      if (!accountId) {
        showToast("Error finding or creating account.", {
          label: "Dismiss",
          onClick: () => {},
        });
        return;
      }

      const contactData = {
        account_id: accountId,
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
      };

      const response = await axios.post(
        "/api/v1/sobjects/contacts",
        contactData
      );

      if (response.status === 201) {
        showToast(
          `Contact "${contactFormData.firstName} ${contactFormData.lastName}" was created.`,
          {
            label: "Undo",
            onClick: () => {},
          }
        );
        resetContactForm(); 
        fetchContacts(searchQuery);
      }
    } catch (error: any) {
      console.error("Error creating contact:", error);
      if (error.message === "Account Name is required.") {
        showToast("Account Name is required.", {
          label: "Dismiss",
          onClick: () => {},
        });
      } else if (error.response?.data?.code === "P2002") {
        showToast("A contact with this email already exists.", {
          label: "Dismiss",
          onClick: () => {},
        });
      } else {
        showToast("Failed to create contact. Please try again.", {
          label: "Dismiss",
          onClick: () => {},
        });
      }
    }
  };

  const handleNewContactClose = () => {
    setIsNewContactModalOpen(false);
    resetContactForm();
  };

  const handleEditClick = async (contact: Contact) => {
    try {
      
      const response = await axios.get(
        `/api/v1/sobjects/contacts/${contact.id}`
      );
      const contactData = response.data;

      setContactFormData({
        salutation: contactData.salutation || "",
        firstName: contactData.first_name || "",
        lastName: contactData.last_name || "",
        accountName: contactData.accounts?.name || "",
        title: contactData.title || "",
        reportsTo: "", 
        description: contactData.description || "",
        email: contactData.email || "",
        phone: contactData.phone || "",
        mailingCountry: contactData.mailing_country || "",
        mailingStreet: contactData.mailing_street || "",
        mailingCity: contactData.mailing_city || "",
        mailingZipPostalCode: contactData.mailing_zip_postal_code || "",
        mailingStateProvince: contactData.mailing_state_province || "",
      });

      setIsEditMode(true);
      setEditingContactId(contact.id);

      setIsNewContactModalOpen(true);
    } catch (error) {
      console.error("Error fetching contact:", error);
      showToast("Failed to load contact. Please try again.", {
        label: "Dismiss",
        onClick: () => {},
      });
    }
  };

  const handleDeleteClick = (contact: Contact) => {
    setDeletingContactId(contact.id);
    setDeletingContactName(contact.name);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingContactId) return;

    try {
      const response = await axios.delete(
        `/api/v1/sobjects/contacts/${deletingContactId}`
      );
      if (response.status === 204 || response.status === 200) {
        showToast(`Contact "${deletingContactName}" was deleted.`, {
          label: "Dismiss",
          onClick: () => {},
        });
        setDeleteModalOpen(false);
        setDeletingContactId(null);
        setDeletingContactName("");
        fetchContacts(searchQuery);
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      showToast("Failed to delete contact.", {
        label: "Dismiss",
        onClick: () => {},
      });
    }
  };

  const columns = [
    {
      key: "serialNumber",
      label: "",
      defaultWidth: 10,
      minWidth: 10,
      hasDropdown: false,
      isSortable: false,
    },
    {
      key: "checkbox",
      label: <></>,
      defaultWidth: 10,
      minWidth: 10,
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
      key: "accountName",
      label: "Account Name",
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
      key: "contactOwnerAlias",
      label: "Contact Owner Alias",
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
      isSortable: true,
    },
  ];

  const actionButtons = [
    { label: "Import" },
    {
      label: "New",
      onClick: () => {
        resetContactForm();
        setIsNewContactModalOpen(true);
      },
    },
    { label: "Add to Campaign" },
    { label: "Send Email" },
    { label: "Assign Label" },
  ];

  return (
    <div className="bg-[#f3f2f2]">
      
      <div className="bg-transparent px-8 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Image
              src="/contacts-logo.png"
              alt="Contacts Logo"
              width={40}
              height={40}
            />
            <div className="flex flex-col items-start gap-2">
              <span className="text-sm text-gray-600">Contacts</span>
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
              : `${contacts.length} item${
                  contacts.length !== 1 ? "s" : ""
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
                onClick={() => fetchContacts(searchQuery)}
              />
              <IconButton icon={<Pin className="w-4 h-4 text-[#2b50d8]" />} />
              <IconButton icon={<Edit className="w-4 h-4 text-[#2b50d8]" />} />
              <GroupedIconButtons
                buttons={[
                  { icon: <PieChart className="w-4 h-4 text-[#2b50d8]" /> },
                  { icon: <Filter className="w-4 h-4 text-[#2b50d8]" /> },
                ]}
                disabled={true}
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
                <span className="ml-2 text-gray-600">Loading contacts...</span>
              </div>
            </td>
          </tr>
        ) : contacts.length === 0 ? (
          <tr>
            <td colSpan={6} className="text-center p-8 text-gray-500">
              No contacts found.
            </td>
          </tr>
        ) : (
          sortedContacts.map((contact, index) => (
            <tr
              key={contact.id}
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
                  href={`/contacts/${contact.id}`}
                  className="text-[#0176d3] hover:underline"
                >
                  {contact.name}
                </Link>
              </td>
              <td className="py-2 px-3 text-sm">
                <Link
                  href={`/accounts/${contact.account_id || 1}`}
                  className="text-[#0176d3] hover:underline"
                >
                  {contact.accountName}
                </Link>
              </td>
              <td className="py-2 px-3 text-sm text-gray-700">
                {contact.phone}
              </td>
              <td className="py-2 px-3 text-sm">
                <Link
                  href={`mailto:${contact.email}`}
                  className="text-[#0176d3] hover:underline"
                >
                  {contact.email}
                </Link>
              </td>
              <td className="py-2 px-3 text-sm text-gray-700">
                {contact.contactOwnerAlias}
              </td>
              <td className="py-2 px-3 text-sm">
                <RowActionsDropdown
                  onEdit={() => handleEditClick(contact)}
                  onDelete={() => handleDeleteClick(contact)}
                  onChangeOwner={() =>
                    console.log("[v0] Change owner:", contact.id)
                  }
                  onEditLabels={() =>
                    console.log("[v0] Edit labels:", contact.id)
                  }
                />
              </td>
            </tr>
          ))
        )}
      </ResizableTable>

      <ContactFormModal
        isOpen={isNewContactModalOpen}
        isEditMode={isEditMode}
        onClose={handleNewContactClose}
        onSave={handleContactSave}
        onSaveAndNew={handleNewContactSaveAndNew}
        contactFormData={contactFormData}
        setContactFormData={setContactFormData}
        contactErrors={contactErrors}
        setContactErrors={setContactErrors}
      />

      <DeleteContactModal
        open={deleteModalOpen}
        onOpenChange={(open) => {
          setDeleteModalOpen(open);
          if (!open) {
            setDeletingContactId(null);
            setDeletingContactName("");
          }
        }}
        contactName={deletingContactName}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
