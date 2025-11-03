"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import axios from "axios";
import {
  Search,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  X,
  Sparkles,
  BarChart3,
  ExternalLink,
  SettingsIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";
import { useToast } from "@/components/toast-provider";
import ContactFormModal from "@/components/modals/contact-form-modal";
import Image from "next/image";
import LeadFormModal from "./modals/lead-form-modal";
import OpportunityFormModal from "./modals/opportunity-form-modal";
import { getOrCreateAccountId } from "@/lib/account-utils";

// Initial state for lead form
const initialLeadFormData = {
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
  status: "",
};

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
};

// Initial state for opportunity form
const initialOpportunityFormData = {
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

interface OpportunityStageData {
  name: string;
  count: number;
}

export default function SalesforceDashboard() {
  const { showToast } = useToast();
  const [leads, setLeads] = useState<any[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [lastFetchedLeads, setLastFetchedLeads] = useState<Date | null>(null);
  const [contacts, setContacts] = useState<any[]>([]);
  const [contactsLoading, setContactsLoading] = useState(true);
  const [lastFetchedContacts, setLastFetchedContacts] = useState<Date | null>(
    null
  );
  const [opportunityStageData, setOpportunityStageData] = useState<
    OpportunityStageData[]
  >([]);
  const [opportunitiesLoading, setOpportunitiesLoading] = useState(true);
  const [lastFetchedOpportunities, setLastFetchedOpportunities] =
    useState<Date | null>(null);
  const [leadSearch, setLeadSearch] = useState("");
  const [contactSearch, setContactSearch] = useState("");
  const [opportunitySearch, setOpportunitySearch] = useState("");

  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [isNewContactModalOpen, setIsNewContactModalOpen] = useState(false);
  const [isNewOpportunityModalOpen, setIsNewOpportunityModalOpen] =
    useState(false);
  const [isDiscoveryExpanded, setIsDiscoveryExpanded] = useState(false);

  const [leadErrors, setLeadErrors] = useState<Record<string, boolean>>({});
  const [contactErrors, setContactErrors] = useState<Record<string, boolean>>(
    {}
  );
  const [opportunityErrors, setOpportunityErrors] = useState<
    Record<string, boolean>
  >({});

  const [leadFormData, setLeadFormData] = useState(initialLeadFormData);
  const [contactFormData, setContactFormData] = useState(
    initialContactFormData
  );
  const [opportunityFormData, setOpportunityFormData] = useState(
    initialOpportunityFormData
  );

  const resetLeadForm = () => {
    setLeadFormData(initialLeadFormData);
    setLeadErrors({});
  };

  const resetContactForm = () => {
    setContactFormData(initialContactFormData);
    setContactErrors({});
  };

  const resetOpportunityForm = () => {
    setOpportunityFormData(initialOpportunityFormData);
    setOpportunityErrors({});
  };

  const validateLeadForm = () => {
    const errors: Record<string, boolean> = {};
    if (!leadFormData.firstName.trim()) errors.firstName = true;
    if (!leadFormData.lastName.trim()) errors.lastName = true;
    if (!leadFormData.email.trim()) errors.email = true;
    setLeadErrors(errors);
    return Object.keys(errors).length === 0;
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

  const fetchLeads = async (query: string = "") => {
    setLeadsLoading(true);
    try {
      const url = query
        ? `/api/v1/sobjects/leads?search=${encodeURIComponent(query)}`
        : "/api/v1/sobjects/leads";
      const response = await axios.get(url);
      setLeads(response.data.slice(0, 3));
      setLastFetchedLeads(new Date());
    } catch (error) {
      console.error("Error fetching leads:", error);
      showToast("Failed to fetch leads.", {
        label: "Dismiss",
        onClick: () => {},
      });
    } finally {
      setLeadsLoading(false);
    }
  };

  const fetchContacts = async (query: string = "") => {
    setContactsLoading(true);
    try {
      const url = query
        ? `/api/v1/sobjects/contacts?search=${encodeURIComponent(query)}`
        : "/api/v1/sobjects/contacts";
      const response = await axios.get(url);
      setContacts(response.data.slice(0, 3));
      setLastFetchedContacts(new Date());
    } catch (error) {
      console.error("Error fetching contacts:", error);
      showToast("Failed to fetch contacts.", {
        label: "Dismiss",
        onClick: () => {},
      });
    } finally {
      setContactsLoading(false);
    }
  };

  const fetchOpportunities = async (query: string = "") => {
    setOpportunitiesLoading(true);
    try {
      const url = query
        ? `/api/v1/sobjects/opportunities?search=${encodeURIComponent(query)}`
        : "/api/v1/sobjects/opportunities";
      const response = await axios.get(url);
      const allOpportunities = response.data;
      const stageCounts = allOpportunities.reduce(
        (acc: { [key: string]: number }, opp: any) => {
          const stage = opp.stage || "Unknown";
          acc[stage] = (acc[stage] || 0) + 1;
          return acc;
        },
        {}
      );
      const chartData: OpportunityStageData[] = Object.keys(stageCounts).map(
        (stage) => ({
          name: stage,
          count: stageCounts[stage],
        })
      );
      setOpportunityStageData(chartData);
      setLastFetchedOpportunities(new Date());
    } catch (error) {
      console.error("Error fetching opportunities:", error);
      setOpportunityStageData([
        { name: "Propose", count: 1 },
        { name: "Closed Lost", count: 1 },
      ]);
    } finally {
      setOpportunitiesLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchContacts();
    fetchOpportunities();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => fetchLeads(leadSearch), 300);
    return () => clearTimeout(handler);
  }, [leadSearch]);

  useEffect(() => {
    const handler = setTimeout(() => fetchContacts(contactSearch), 300);
    return () => clearTimeout(handler);
  }, [contactSearch]);

  useEffect(() => {
    const handler = setTimeout(
      () => fetchOpportunities(opportunitySearch),
      300
    );
    return () => clearTimeout(handler);
  }, [opportunitySearch]);

  const handleLeadSave = async () => {
    if (!validateLeadForm()) return;

    try {
      // Map form data to match the database schema
      const leadData = {
        salutation: leadFormData.salutation || null,
        first_name: leadFormData.firstName,
        last_name: leadFormData.lastName,
        title: leadFormData.title || null,
        company: leadFormData.company || null,
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
        annual_revenue: leadFormData.annualRevenue
          ? parseFloat(leadFormData.annualRevenue)
          : null,
        lead_source: leadFormData.leadSource || null,
        industry: leadFormData.industry || null,
        lead_owner: "Rishab Nagwani", // Default owner
        status: "New", // Default status
      };

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
      }
    } catch (error) {
      console.error("Error creating lead:", error);
      showToast("Failed to create lead. Please try again.", {
        label: "Dismiss",
        onClick: () => {},
      });
    }
  };

  const handleLeadSaveAndNew = async () => {
    if (!validateLeadForm()) return;

    try {
      // Map form data to match the database schema
      const leadData = {
        salutation: leadFormData.salutation || null,
        first_name: leadFormData.firstName,
        last_name: leadFormData.lastName,
        title: leadFormData.title || null,
        company: leadFormData.company || null,
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
        annual_revenue: leadFormData.annualRevenue
          ? parseFloat(leadFormData.annualRevenue)
          : null,
        lead_source: leadFormData.leadSource || null,
        industry: leadFormData.industry || null,
        lead_owner: "Rishab Nagwani", // Default owner
        status: "New", // Default status
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
        resetLeadForm(); // Reset form but keep modal open
      }
    } catch (error) {
      console.error("Error creating lead:", error);
      showToast("Failed to create lead. Please try again.", {
        label: "Dismiss",
        onClick: () => {},
      });
    }
  };

  const handleLeadClose = () => {
    setIsNewLeadModalOpen(false);
    resetLeadForm();
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
      const response = await axios.post(
        "/api/v1/sobjects/contacts",
        contactData
      );
      if (response.status === 201) {
        setIsNewContactModalOpen(false);
        resetContactForm();
        showToast(
          `Contact "${contactFormData.firstName} ${contactFormData.lastName}" was created.`,
          {
            label: "Undo",
            onClick: () => console.log("Undo contact creation"),
          }
        );
        fetchContacts();
      }
    } catch (error) {
      console.error("Error creating contact:", error);
      if (
        error instanceof Error &&
        error.message === "Account Name is required."
      ) {
        showToast("Account Name is required.", {
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

  const handleContactSaveAndNew = async () => {
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
        contact_owner: "Rishab Nagwani", // Default owner
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
            onClick: () => console.log("Undo contact creation"),
          }
        );
        resetContactForm();
        fetchContacts();
      }
    } catch (error) {
      console.error("Error creating contact:", error);
      if (
        error instanceof Error &&
        error.message === "Account Name is required."
      ) {
        showToast("Account Name is required.", {
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

  const handleContactClose = () => {
    setIsNewContactModalOpen(false);
    resetContactForm();
  };

  const handleOpportunitySave = async () => {
    if (!validateOpportunityForm()) return;
    try {
      const accountId = await getOrCreateAccountId(
        opportunityFormData.accountName
      );
      if (!accountId) {
        showToast("Error finding or creating account.", {
          label: "Dismiss",
          onClick: () => {},
        });
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
        opportunity_owner: "Rishab Nagwani", // Default owner
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
        setIsNewOpportunityModalOpen(false);
        resetOpportunityForm();
        showToast(
          `Opportunity "${opportunityFormData.opportunityName}" was created.`,
          {
            label: "Undo",
            onClick: () => console.log("Undo opportunity creation"),
          }
        );
        fetchOpportunities();
      }
    } catch (error) {
      console.error("Error creating opportunity:", error);
      if (
        error instanceof Error &&
        error.message === "Account Name is required."
      ) {
        showToast("Account Name is required.", {
          label: "Dismiss",
          onClick: () => {},
        });
      } else {
        showToast("Failed to create opportunity. Please try again.", {
          label: "Dismiss",
          onClick: () => {},
        });
      }
    }
  };

  const handleOpportunitySaveAndNew = async () => {
    if (!validateOpportunityForm()) return;
    try {
      const accountId = await getOrCreateAccountId(
        opportunityFormData.accountName
      );
      if (!accountId) {
        showToast("Error finding or creating account.", {
          label: "Dismiss",
          onClick: () => {},
        });
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
            onClick: () => console.log("Undo opportunity creation"),
          }
        );
        resetOpportunityForm();
        fetchOpportunities();
      }
    } catch (error) {
      console.error("Error creating opportunity:", error);
      if (
        error instanceof Error &&
        error.message === "Account Name is required."
      ) {
        showToast("Account Name is required.", {
          label: "Dismiss",
          onClick: () => {},
        });
      } else {
        showToast("Failed to create opportunity. Please try again.", {
          label: "Dismiss",
          onClick: () => {},
        });
      }
    }
  };

  const handleOpportunityClose = () => {
    setIsNewOpportunityModalOpen(false);
    resetOpportunityForm();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white border-b border-[#dddbda] shrink-0">
        <div className="flex items-center justify-between px-6 pt-3">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-normal text-[#181818]">Home</h1>
            <div className="flex gap-4">
              <button className="text-[#0176d3] border-b-[3px] border-[#0176d3] pb-2 font-normal rounded-t-sm">
                Home
              </button>
            </div>
          </div>
          <Image
            src="/pencil-icon.png"
            alt="Edit"
            width={25}
            height={25}
            className="-mr-2"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Discovery Banner */}
          <div className="bg-[#edf4ff] border border-gray-200 rounded-2xl mb-6 overflow-hidden shadow-sm shadow-gray-500">
            {!isDiscoveryExpanded ? (
              <div
                className="p-7 flex items-center gap-2 cursor-pointer hover:bg-[#e3f0ff] transition-all duration-150"
                onClick={() => setIsDiscoveryExpanded(true)}
              >
                <ChevronRight className="w-5 h-5 text-blue-700" />
                <span className="text-black text-base">
                  Psst! You have more to discover here. 🌟
                </span>
              </div>
            ) : (
              <div className="p-6">
                <div
                  className="flex items-center gap-2 cursor-pointer mb-6 w-fit"
                  onClick={() => setIsDiscoveryExpanded(false)}
                >
                  <ChevronDown className="w-5 h-5 text-[#706e6b]" />
                </div>

                <div className="mb-6">
                  <h2 className="text-2xl font-normal text-[#181818] mb-2">
                    Welcome, Rishab
                  </h2>
                  <p className="text-[#706e6b] text-sm mb-4">
                    Check out these suggestions to kick off your day.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Card 1 - Turn on marketing features */}
                  <div className="bg-white rounded-lg p-6 shadow-sm relative">
                    <button className="absolute top-4 right-4 text-[#706e6b] hover:text-[#181818]">
                      <X className="w-5 h-5" />
                    </button>
                    <div className="w-12 h-12 bg-[#0176d3] rounded-full flex items-center justify-center mb-4">
                      <SettingsIcon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-[#0176d3] text-base font-normal mb-2 flex items-center gap-1">
                      Turn on marketing features
                      <ExternalLink className="w-4 h-4" />
                    </h3>
                    <p className="text-[#706e6b] text-sm">
                      Access powerful tools to reach new audiences and engage
                      customers.
                    </p>
                  </div>

                  {/* Card 2 - Visualize your data with AI */}
                  <div className="bg-white rounded-lg p-6 shadow-sm relative">
                    <button className="absolute top-4 right-4 text-[#706e6b] hover:text-[#181818]">
                      <X className="w-5 h-5" />
                    </button>
                    <div className="w-12 h-12 bg-[#0176d3] rounded-full flex items-center justify-center mb-4">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-[#0176d3] text-base font-normal mb-2 flex items-center gap-1">
                      Visualize your data with AI
                      <ExternalLink className="w-4 h-4" />
                    </h3>
                    <p className="text-[#706e6b] text-sm">
                      Enable a preview of Generative Canvas and ask AI to pull
                      together the information you&apos;re looking for.
                    </p>
                  </div>

                  {/* Card 3 - Import your contacts */}
                  <div className="bg-white rounded-lg p-6 shadow-sm relative">
                    <button className="absolute top-4 right-4 text-[#706e6b] hover:text-[#181818]">
                      <X className="w-5 h-5" />
                    </button>
                    <div className="w-12 h-12 bg-[#0176d3] rounded-full flex items-center justify-center mb-4">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-[#0176d3] text-base font-normal mb-2">
                      Import your contacts
                    </h3>
                    <p className="text-[#706e6b] text-sm">
                      Start managing relationships and deals in Salesforce by
                      syncing or uploading contacts.
                    </p>
                  </div>
                </div>

                <a href="#" className="text-[#0176d3] text-sm hover:underline">
                  View All Cards
                </a>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-white border border-[#dddbda] rounded-lg overflow-hidden">
                <div className="p-4 flex items-center gap-3">
                  <Image
                    src="/leads-logo.png"
                    alt="Leads Logo"
                    width={44}
                    height={44}
                  />
                  <div className="relative flex-1">
                    <Input
                      placeholder="Search Leads..." // Changed
                      value={leadSearch} // Changed
                      onChange={(e) => setLeadSearch(e.target.value)} // Added
                      className="flex-1 border border-black shadow-none hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 text-sm font-normal h-8 px-2 rounded-lg" // Added pl-8
                    />
                    <Search className="w-4 h-4 text-black absolute right-2 top-1/2 -translate-y-1/2" />{" "}
                  </div>
                  <Button
                    onClick={() => setIsNewLeadModalOpen(true)}
                    className="bg-white text-[#0176d3] hover:bg-gray-50 hover:shadow-sm hover:shadow-black hover:-translate-y-0.5 transition-all duration-150 border border-black h-8 px-4 text-sm rounded-full"
                  >
                    New
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0 border-black rounded-3xl bg-transparent hover:shadow-sm hover:-translate-y-0.5 transition-all duration-150 hover:shadow-black"
                  >
                    <ChevronDown className="w-4 h-4 text-blue-500" />
                  </Button>
                </div>
                <div className="px-4 pb-2">
                  {" "}
                  <div className="overflow-x-auto border border-[#dddbda] rounded-lg min-h-[250px]">
                    {" "}
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#dddbda]">
                          <th className="text-left px-3 py-2 text-xs font-semibold text-[#706e6b]">
                            Lead Status
                          </th>
                          <th className="text-left px-3 py-2 text-xs font-semibold text-[#706e6b]">
                            First Name
                          </th>
                          <th className="text-left px-3 py-2 text-xs font-semibold text-[#706e6b]">
                            Last Name
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {leadsLoading ? (
                          <tr>
                            <td
                              colSpan={3}
                              className="text-center p-4 text-sm text-[#706e6b]"
                            >
                              Loading...
                            </td>
                          </tr>
                        ) : leads.length > 0 ? (
                          leads.map((lead) => (
                            <tr
                              key={lead.id}
                              className="border-b border-[#dddbda] hover:bg-[#f3f2f2]"
                            >
                              <td className="px-4 py-2 text-sm text-[#181818]">
                                {lead.status || "-"}
                              </td>
                              <td className="px-4 py-2 text-sm">
                                <Link
                                  href={`/lead/${lead.id}`}
                                  className="text-[#0176d3] hover:underline"
                                >
                                  {lead.first_name}
                                </Link>
                              </td>
                              <td className="px-4 py-2 text-sm">
                                <Link
                                  href={`/lead/${lead.id}`}
                                  className="text-[#0176d3] hover:underline"
                                >
                                  {lead.last_name}
                                </Link>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={3}
                              className="text-center p-4 text-sm text-[#706e6b]"
                            >
                              No leads found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="p-4 border-t border-[#dddbda] flex items-center justify-between">
                  <Link
                    href="/sales"
                    className="text-[#0176d3] text-sm hover:underline"
                  >
                    View Report
                  </Link>
                  <div className="flex items-center gap-2 text-[#706e6b] text-xs">
                    <span>
                      {lastFetchedLeads
                        ? `As of today at ${lastFetchedLeads.toLocaleTimeString(
                            [],
                            { hour: "numeric", minute: "2-digit", hour12: true }
                          )}`
                        : "..."}
                    </span>

                    <button
                      onClick={() => fetchLeads()}
                      className="cursor-pointer text-[#0176d3] hover:text-[#0176d3] transition-all duration-150"
                    >
                      <RefreshCw
                        className={`w-4 h-4 ${
                          leadsLoading ? "animate-spin" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#dddbda] rounded-lg overflow-hidden">
                <div className="p-4 flex items-center gap-3">
                  <Image
                    src="/contacts-logo.png"
                    alt="Contacts Logo"
                    width={40}
                    height={40}
                  />
                  <div className="relative flex-1">
                    <Input
                      placeholder="Search Contacts..." // Changed
                      value={contactSearch} // Changed
                      onChange={(e) => setContactSearch(e.target.value)} // Added
                      className="flex-1 border border-black shadow-none hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 text-sm font-normal h-8 px-2 rounded-lg" // Added pl-8
                    />
                    <Search className="w-4 h-4 text-black absolute right-2 top-1/2 -translate-y-1/2" />{" "}
                  </div>
                  <Button
                    onClick={() => setIsNewContactModalOpen(true)}
                    className="bg-white text-[#0176d3] hover:bg-gray-50 hover:shadow-sm hover:shadow-black hover:-translate-y-0.5 transition-all duration-150 border border-black h-8 px-4 text-sm rounded-full"
                  >
                    New
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0 border-black rounded-3xl bg-transparent hover:shadow-sm hover:-translate-y-0.5 transition-all duration-150 hover:shadow-black"
                  >
                    <ChevronDown className="w-4 h-4 text-blue-500" />
                  </Button>
                </div>
                <div className="px-4 pb-2">
                  <div className="overflow-x-auto border border-[#dddbda] rounded-lg min-h-[250px]">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#fafaf9] border-b border-[#dddbda]">
                          <th className="text-left px-3 py-2 text-xs font-semibold text-[#706e6b]">
                            First Name
                          </th>
                          <th className="text-left px-3 py-2 text-xs font-semibold text-[#706e6b]">
                            Last Name
                          </th>
                          <th className="text-left px-3 py-2 text-xs font-semibold text-[#706e6b]">
                            Email
                          </th>
                        </tr>
                      </thead>

                      {/* 3. Dynamic Table Body */}
                      <tbody>
                        {contactsLoading ? (
                          <tr>
                            <td
                              colSpan={3}
                              className="text-center p-4 text-sm text-[#706e6b]"
                            >
                              Loading...
                            </td>
                          </tr>
                        ) : contacts.length > 0 ? (
                          contacts.map((contact) => (
                            <tr
                              key={contact.id}
                              className="border-b border-[#dddbda] hover:bg-[#f3f2f2]"
                            >
                              <td className="px-4 py-2 text-sm">
                                <Link
                                  href={`/contacts/${contact.id}`}
                                  className="text-[#0176d3] hover:underline"
                                >
                                  {contact.first_name}
                                </Link>
                              </td>
                              <td className="px-4 py-2 text-sm">
                                <Link
                                  href={`/contacts/${contact.id}`}
                                  className="text-[#0176d3] hover:underline"
                                >
                                  {contact.last_name}
                                </Link>
                              </td>
                              <td className="px-4 py-2 text-sm text-[#181818]">
                                {contact.email}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={3}
                              className="text-center p-4 text-sm text-[#706e6b]"
                            >
                              No contacts found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="p-4 border-t border-[#dddbda] flex items-center justify-between">
                  {/* 4. Functional "View Report" Link */}
                  <Link
                    href="/contacts"
                    className="text-[#0176d3] text-sm hover:underline"
                  >
                    View Report
                  </Link>
                  <div className="flex items-center gap-2 text-[#706e6b] text-xs">
                    <span>
                      {lastFetchedContacts
                        ? `As of today at ${lastFetchedContacts.toLocaleTimeString(
                            [],
                            { hour: "numeric", minute: "2-digit", hour12: true }
                          )}`
                        : "..."}
                    </span>
                    <button
                      onClick={() => fetchContacts()}
                      className="cursor-pointer text-[#0176d3] hover:text-[#0176d3] transition-all duration-150"
                    >
                      <RefreshCw
                        className={`w-4 h-4 ${
                          contactsLoading ? "animate-spin" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-[#dddbda] rounded-lg overflow-hidden">
                <div className="p-4 border-b border-[#dddbda] flex items-center gap-3">
                  <Image
                    src="/opportunities-logo.png"
                    alt="Opportunities Logo"
                    width={32}
                    height={32}
                  />
                  <div className="relative flex-1">
                    <Input
                      placeholder="Search Opportunities..." // Changed
                      value={opportunitySearch} // Changed
                      onChange={(e) => setOpportunitySearch(e.target.value)} // Added
                      className="flex-1 border border-black shadow-none hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 text-sm font-normal h-8 px-2 rounded-lg" // Added pl-8
                    />
                    <Search className="w-4 h-4 text-black absolute right-2 top-1/2 -translate-y-1/2" />{" "}
                  </div>
                  <Button
                    onClick={() => setIsNewOpportunityModalOpen(true)}
                    className="bg-white text-[#0176d3] hover:bg-gray-50 hover:shadow-sm hover:shadow-black hover:-translate-y-0.5 transition-all duration-150 border border-black h-8 px-4 text-sm rounded-full"
                  >
                    New
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0 border-black rounded-3xl bg-transparent hover:shadow-sm hover:-translate-y-0.5 transition-all duration-150 hover:shadow-black"
                  >
                    <ChevronDown className="w-4 h-4 text-blue-500" />
                  </Button>
                </div>
                {/* 2. Dynamic Bar Chart (Horizontal) */}
                <div className="p-6">
                  <div className="h-60 w-full">
                    {" "}
                    {/* Set a fixed height for the chart container */}
                    <ResponsiveContainer width="100%" height="100%">
                      {opportunitiesLoading ? (
                        <div className="flex items-center justify-center h-full text-sm text-[#706e6b]">
                          Loading Chart...
                        </div>
                      ) : (
                        <BarChart
                          data={opportunityStageData}
                          layout="vertical" // <-- This is the key prop for a horizontal chart
                          margin={{
                            top: 20, // Space for X-axis labels at the top
                            right: 10,
                            left: 30, // Space for Y-axis stage names
                            bottom: 5,
                          }}
                        >
                          {/* Grid lines are now vertical */}
                          <CartesianGrid
                            strokeDasharray="3 3"
                            horizontal={false}
                            vertical={true}
                            stroke="#e5e7eb"
                          />

                          {/* X-axis (Record Count) is now type="number" and moved to the top */}
                          <XAxis
                            type="number"
                            orientation="top" // <-- Moves axis to the top
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: "#706e6b" }}
                            allowDecimals={false} // Ensure whole numbers for "count"
                            label={{
                              value: "Record Count",
                              position: "top",
                              dy: -5,
                              fontSize: 12,
                              fill: "#706e6b",
                            }}
                          />

                          <YAxis
                            type="category"
                            dataKey="name"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: "#181818" }} // Darker text for stage names
                            width={100} // Adjust width to fit stage names
                          >
                            <Label
                              value="Stage"
                              position="left"
                              angle={-90} // Rotates the label vertically
                              offset={10} // Pushes it further left
                              style={{
                                textAnchor: "middle",
                                fill: "#706e6b",
                                fontSize: 12,
                              }}
                            />
                          </YAxis>

                          <Tooltip
                            cursor={{ fill: "rgba(243, 243, 242, 0.5)" }} // Lighter hover color
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #dddbda",
                              borderRadius: "0.5rem",
                              fontSize: "12px",
                              boxShadow:
                                "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                            }}
                          />

                          <Bar
                            dataKey="count"
                            fill="#0176d3"
                            radius={[0, 0, 0, 0]}
                            barSize={100}
                          />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="p-4 border-t border-[#dddbda] flex items-center justify-between">
                  {/* 3. Functional "View Report" Link */}
                  <Link
                    href="/sales"
                    className="text-[#0176d3] text-sm hover:underline"
                  >
                    View Report
                  </Link>
                  <div className="flex items-center gap-2 text-[#706e6b] text-xs">
                    <span>
                      {lastFetchedOpportunities
                        ? `As of today at ${lastFetchedOpportunities.toLocaleTimeString(
                            [],
                            { hour: "numeric", minute: "2-digit", hour12: true }
                          )}`
                        : "..."}
                    </span>

                    <button
                      onClick={() => fetchOpportunities()}
                      className="cursor-pointer text-[#0176d3] hover:text-[#0176d3] transition-all duration-150"
                    >
                      <RefreshCw
                        className={`w-4 h-4 ${
                          opportunitiesLoading ? "animate-spin" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Lead Modal */}
      <LeadFormModal
        isEditMode={false}
        isOpen={isNewLeadModalOpen}
        onClose={handleLeadClose}
        onSave={handleLeadSave}
        onSaveAndNew={handleLeadSaveAndNew}
        leadFormData={leadFormData}
        setLeadFormData={setLeadFormData}
        leadErrors={leadErrors}
        setLeadErrors={setLeadErrors}
      />

      {/* New Contact Modal */}
      <ContactFormModal
        isEditMode={false}
        isOpen={isNewContactModalOpen}
        onClose={handleContactClose}
        onSave={handleContactSave}
        onSaveAndNew={handleContactSaveAndNew}
        contactFormData={contactFormData}
        setContactFormData={setContactFormData}
        contactErrors={contactErrors}
        setContactErrors={setContactErrors}
      />

      {/* New Opportunity Modal */}
      <OpportunityFormModal
        isEditMode={false}
        isOpen={isNewOpportunityModalOpen}
        onClose={handleOpportunityClose}
        onSave={handleOpportunitySave}
        onSaveAndNew={handleOpportunitySaveAndNew}
        opportunityFormData={opportunityFormData}
        setOpportunityFormData={setOpportunityFormData}
        opportunityErrors={opportunityErrors}
        setOpportunityErrors={setOpportunityErrors}
      />
    </div>
  );
}
