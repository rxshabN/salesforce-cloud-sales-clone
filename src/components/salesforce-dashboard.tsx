"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import axios from "axios";
// Import only necessary icons from lucide-react
import {
  Search,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Pencil,
  X,
  Calendar,
  AlertCircle,
  Sparkles,
  BarChart3,
  ExternalLink,
  Users,
  User,
  SettingsIcon,
  Building2,
  Briefcase,
} from "lucide-react";
import { useToast } from "@/components/toast-provider";

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
};

export default function SalesforceDashboard() {
  const { showToast } = useToast();

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
  const [contactFormData, setContactFormData] = useState({
    lastName: "",
    accountName: "",
  });
  const [opportunityFormData, setOpportunityFormData] = useState({
    opportunityName: "",
    accountName: "",
    closeDate: "",
    stage: "",
    forecastCategory: "",
  });

  // const [currentPage, setCurrentPage] = useState<"home" | "contacts">("home")

  const resetLeadForm = () => {
    setLeadFormData(initialLeadFormData);
    setLeadErrors({});
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
    if (!contactFormData.lastName.trim()) errors.lastName = true;
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
        annual_revenue: leadFormData.annualRevenue || null,
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
        annual_revenue: leadFormData.annualRevenue || null,
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

  const handleContactSave = () => {
    if (validateContactForm()) {
      // Form is valid, proceed with save
      console.log("Contact form saved");
      setIsNewContactModalOpen(false);
      showToast(`Contact "${contactFormData.lastName}" was created.`, {
        label: "Undo",
        onClick: () => console.log("Undo contact creation"),
      });
    }
  };

  const handleOpportunitySave = () => {
    if (validateOpportunityForm()) {
      // Form is valid, proceed with save
      console.log("Opportunity form saved");
      setIsNewOpportunityModalOpen(false);
      showToast(
        `Opportunity "${opportunityFormData.opportunityName}" was created.`,
        {
          label: "Undo",
          onClick: () => console.log("Undo opportunity creation"),
        }
      );
    }
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
          <Pencil className="w-5 h-5 text-[#0176d3] cursor-pointer hover:-translate-y-0.5 transition-all duration-150" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Discovery Banner */}
          <div className="bg-[#edf4ff] border border-[#c9e0ff] rounded-lg mb-6 overflow-hidden">
            {!isDiscoveryExpanded ? (
              <div
                className="p-4 flex items-center gap-2 cursor-pointer hover:bg-[#e3f0ff] transition-all duration-150"
                onClick={() => setIsDiscoveryExpanded(true)}
              >
                <ChevronRight className="w-5 h-5 text-[#706e6b]" />
                <span className="text-[#181818] text-sm">
                  Psst! You have more to discover here. 👋
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
                      together the information you're looking for.
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
            {/* Left Column - 50% width */}
            <div className="space-y-6">
              <div className="bg-white border border-[#dddbda] rounded-lg overflow-hidden">
                <div className="p-4 border-b border-[#dddbda] flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#0176d3] rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-sm"></div>
                  </div>
                  <Input
                    value="All Open Leads"
                    className="flex-1 border border-[#dddbda] shadow-none hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 text-sm font-normal h-8 px-2 rounded"
                    readOnly
                  />
                  <Search className="w-5 h-5 text-[#706e6b] cursor-pointer hover:text-[#0176d3] hover:-translate-y-0.5 transition-all duration-150" />
                  <Button
                    onClick={() => setIsNewLeadModalOpen(true)}
                    className="bg-white text-[#0176d3] hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 border border-[#dddbda] h-8 px-4 text-sm rounded-full"
                  >
                    New
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0 border-[#dddbda] bg-transparent hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#fafaf9] border-b border-[#dddbda]">
                        <th className="text-left px-4 py-3 text-xs font-normal text-[#706e6b]">
                          Lead Status
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-normal text-[#706e6b]">
                          First Name
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-normal text-[#706e6b]">
                          Last Name
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[#dddbda] hover:bg-[#f3f2f2]">
                        <td className="px-4 py-3 text-sm text-[#181818]">
                          Nurturing
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Link
                            href="/lead/1"
                            className="text-[#0176d3] hover:underline"
                          >
                            Rishab
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Link
                            href="/lead/1"
                            className="text-[#0176d3] hover:underline"
                          >
                            Nagwani
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="p-4 border-t border-[#dddbda] flex items-center justify-between">
                  <a
                    href="#"
                    className="text-[#0176d3] text-sm hover:underline"
                  >
                    View Report
                  </a>
                  <div className="flex items-center gap-2 text-[#706e6b] text-xs">
                    <span>As of today at 2:00 pm</span>
                    <RefreshCw className="w-4 h-4 cursor-pointer hover:text-[#0176d3] hover:-translate-y-0.5 transition-all duration-150" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#dddbda] rounded-lg overflow-hidden">
                <div className="p-4 border-b border-[#dddbda] flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#9333ea] rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <Input
                    value="My Contacts"
                    className="flex-1 border border-[#dddbda] shadow-none hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 text-sm font-normal h-8 px-2 rounded"
                    readOnly
                  />
                  <Search className="w-5 h-5 text-[#706e6b] cursor-pointer hover:text-[#0176d3] hover:-translate-y-0.5 transition-all duration-150" />
                  <Button
                    onClick={() => setIsNewContactModalOpen(true)}
                    className="bg-white text-[#0176d3] hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 border border-[#dddbda] h-8 px-4 text-sm rounded-full"
                  >
                    New
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0 border-[#dddbda] bg-transparent hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#fafaf9] border-b border-[#dddbda]">
                        <th className="text-left px-4 py-3 text-xs font-normal text-[#706e6b]">
                          First Name
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-normal text-[#706e6b]">
                          Last Name
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-normal text-[#706e6b]">
                          Email
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[#dddbda] hover:bg-[#f3f2f2]">
                        <td className="px-4 py-3 text-sm">
                          <a
                            href="#"
                            className="text-[#0176d3] hover:underline"
                          >
                            meow
                          </a>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <a
                            href="#"
                            className="text-[#0176d3] hover:underline"
                          >
                            Nagwani
                          </a>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#181818]">
                          nagwanirishab@gmail.com
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="p-4 border-t border-[#dddbda] flex items-center justify-between">
                  <a
                    href="#"
                    className="text-[#0176d3] text-sm hover:underline"
                  >
                    View Report
                  </a>
                  <div className="flex items-center gap-2 text-[#706e6b] text-xs">
                    <span>As of today at 2:01 pm</span>
                    <RefreshCw className="w-4 h-4 cursor-pointer hover:text-[#0176d3] hover:-translate-y-0.5 transition-all duration-150" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - 50% width */}
            <div className="space-y-6">
              <div className="bg-white border border-[#dddbda] rounded-lg overflow-hidden">
                <div className="p-4 border-b border-[#dddbda] flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#f97316] rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-sm"></div>
                  </div>
                  <Input
                    value="My Opportunities"
                    className="flex-1 border border-[#dddbda] shadow-none hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 text-sm font-normal h-8 px-2 rounded"
                    readOnly
                  />
                  <Search className="w-5 h-5 text-[#706e6b] cursor-pointer hover:text-[#0176d3] hover:-translate-y-0.5 transition-all duration-150" />
                  <Button
                    onClick={() => setIsNewOpportunityModalOpen(true)}
                    className="bg-white text-[#0176d3] hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 border border-[#dddbda] h-8 px-4 text-sm rounded-full"
                  >
                    New
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0 border-[#dddbda] bg-transparent hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-6">
                  <div className="relative">
                    {/* Axis labels on top */}
                    <div className="flex justify-between text-xs text-[#706e6b] mb-2 pl-24">
                      <span>0</span>
                      <span>0.1</span>
                      <span>0.2</span>
                      <span>0.3</span>
                      <span>0.4</span>
                      <span>0.5</span>
                      <span>0.6</span>
                      <span>0.7</span>
                      <span>0.8</span>
                      <span>0.9</span>
                      <span>1</span>
                    </div>
                    <div className="text-center text-xs text-[#706e6b] mb-4">
                      Record Count
                    </div>

                    {/* Chart with grid lines */}
                    <div className="relative">
                      {/* Y-axis label */}
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-[#706e6b] whitespace-nowrap">
                        Stage
                      </div>

                      {/* Grid lines */}
                      <div className="absolute left-24 right-0 top-0 bottom-0 flex justify-between pointer-events-none">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                          <div
                            key={i}
                            className="w-px bg-[#e5e7eb] h-full"
                          ></div>
                        ))}
                      </div>

                      <div className="space-y-4 relative">
                        {/* Propose Stage */}
                        <div className="flex items-center gap-4">
                          <div className="w-20 text-sm text-[#181818] text-right">
                            Propose
                          </div>
                          <div className="flex-1 bg-[#e5e7eb] h-12 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[#0176d3]"></div>
                          </div>
                        </div>
                        {/* Closed Lost Stage */}
                        <div className="flex items-center gap-4">
                          <div className="w-20 text-sm text-[#181818] text-right">
                            Closed Lost
                          </div>
                          <div className="flex-1 bg-[#e5e7eb] h-12 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[#0176d3]"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-[#dddbda] flex items-center justify-between">
                  <a
                    href="#"
                    className="text-[#0176d3] text-sm hover:underline"
                  >
                    View Report
                  </a>
                  <div className="flex items-center gap-2 text-[#706e6b] text-xs">
                    <span>As of Today at 2:03 pm</span>
                    <RefreshCw className="w-4 h-4 cursor-pointer hover:text-[#0176d3] hover:-translate-y-0.5 transition-all duration-150" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#dddbda] rounded-lg overflow-hidden">
                <div className="p-4 border-b border-[#dddbda] flex items-center justify-between">
                  <h2 className="text-sm font-normal text-[#181818]">
                    Recent Records
                  </h2>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-4 space-y-3">
                  {/* Lead - Rishab Nagwani erew */}
                  <a
                    href="#"
                    className="flex items-center gap-3 hover:bg-[#f3f2f2] p-2 rounded transition-all duration-150"
                  >
                    <div className="w-8 h-8 bg-[#f97316] rounded-full flex items-center justify-center shrink-0">
                      <div className="w-4 h-4 bg-white rounded-sm"></div>
                    </div>
                    <span className="text-[#0176d3] text-sm hover:underline">
                      Rishab Nagwani erew
                    </span>
                  </a>
                  {/* Contact - meow Nagwani */}
                  <a
                    href="#"
                    className="flex items-center gap-3 hover:bg-[#f3f2f2] p-2 rounded transition-all duration-150"
                  >
                    <div className="w-8 h-8 bg-[#9333ea] rounded-full flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[#0176d3] text-sm hover:underline">
                      meow Nagwani
                    </span>
                  </a>
                  {/* Account - Rishab Nagwani */}
                  <a
                    href="#"
                    className="flex items-center gap-3 hover:bg-[#f3f2f2] p-2 rounded transition-all duration-150"
                  >
                    <div className="w-8 h-8 bg-[#06a59a] rounded-full flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[#0176d3] text-sm hover:underline">
                      Rishab Nagwani
                    </span>
                  </a>
                  {/* Opportunity - asdasd */}
                  <a
                    href="#"
                    className="flex items-center gap-3 hover:bg-[#f3f2f2] p-2 rounded transition-all duration-150"
                  >
                    <div className="w-8 h-8 bg-[#3b82f6] rounded-full flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[#0176d3] text-sm hover:underline">
                      asdasd
                    </span>
                  </a>
                  {/* Case - Open Cases for Accounts I Own */}
                  <a
                    href="#"
                    className="flex items-center gap-3 hover:bg-[#f3f2f2] p-2 rounded transition-all duration-150"
                  >
                    <div className="w-8 h-8 bg-[#06a59a] rounded-full flex items-center justify-center shrink-0">
                      <Briefcase className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[#0176d3] text-sm hover:underline">
                      Open Cases for Accounts I Own
                    </span>
                  </a>
                </div>
              </div>

              {/* Make It Your Home Card */}
              <div className="bg-white border border-[#dddbda] rounded-lg overflow-hidden">
                <div className="p-4 border-b border-[#dddbda] flex items-center justify-between">
                  <h2 className="text-sm font-normal text-[#181818]">
                    Make It Your Home
                  </h2>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-4">
                  <p className="text-[#706e6b] text-sm mb-4">
                    To replace a card, click its action menu and select{" "}
                    <span className="font-semibold">Change Home Card.</span> Use
                    the filters on cards to personalize your view even more.
                  </p>
                  <div className="bg-linear-to-br from-[#7dd3fc] to-[#3b82f6] rounded-lg p-6 relative overflow-hidden">
                    <div className="absolute top-4 left-4 w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 bg-[#0176d3] rounded-full"></div>
                    </div>
                    <div className="absolute top-8 right-8 flex gap-2">
                      <div className="w-16 h-12 bg-white/30 rounded backdrop-blur-sm flex items-center justify-center">
                        <Search className="w-5 h-5 text-white" />
                      </div>
                      <div className="w-12 h-12 bg-[#0176d3] rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 bg-white rounded"></div>
                      </div>
                      <div className="w-12 h-12 bg-[#f97316] rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-8 bg-white rounded-lg p-3 shadow-lg">
                      <div className="space-y-1">
                        <div className="w-32 h-2 bg-gray-200 rounded"></div>
                        <div className="w-24 h-2 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                      <div className="w-8 h-8 bg-[#f59e0b] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Lead Modal */}
      {isNewLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={handleLeadClose}
          ></div>

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-2xl mx-4">
            {/* Close Button - Outside modal, top right */}
            <button
              onClick={handleLeadClose}
              className="absolute -top-10 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-150 shadow-lg"
            >
              <X className="w-5 h-5 text-[#706e6b]" />
            </button>

            {/* Modal Content */}
            <div className="bg-white rounded-lg shadow-2xl max-h-[80vh] flex flex-col">
              <div className="px-6 py-4 border-b border-[#dddbda] flex items-center justify-between">
                <h2 className="text-xl font-normal text-[#181818] flex-1 text-center">
                  New Lead
                </h2>
                <p className="text-xs text-[#706e6b]">
                  * = Required Information
                </p>
              </div>

              {/* Modal Body - Scrollable */}
              <div className="overflow-y-auto px-6 py-4 space-y-6">
                {/* About Section */}
                <div>
                  <h3 className="text-base font-normal text-[#181818] bg-[#f3f2f2] px-4 py-2 -mx-6 mb-4">
                    About
                  </h3>

                  {/* Name */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-[#181818] mb-1">
                        <span className="text-red-600">*</span> Name
                      </label>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-[#706e6b] mb-1">
                            Salutation
                          </label>
                          <select
                            value={leadFormData.salutation}
                            onChange={(e) =>
                              setLeadFormData({
                                ...leadFormData,
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
                              value={leadFormData.firstName}
                              onChange={(e) => {
                                setLeadFormData({
                                  ...leadFormData,
                                  firstName: e.target.value,
                                });
                                if (leadErrors.firstName) {
                                  setLeadErrors({
                                    ...leadErrors,
                                    firstName: false,
                                  });
                                }
                              }}
                              className={`w-full rounded px-3 py-2 text-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 ${
                                leadErrors.firstName
                                  ? "border-2 border-red-600 pr-10"
                                  : "border border-[#dddbda]"
                              }`}
                            />
                            {leadErrors.firstName && (
                              <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                            )}
                          </div>
                          {leadErrors.firstName && (
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
                              value={leadFormData.lastName}
                              onChange={(e) => {
                                setLeadFormData({
                                  ...leadFormData,
                                  lastName: e.target.value,
                                });
                                if (leadErrors.lastName) {
                                  setLeadErrors({
                                    ...leadErrors,
                                    lastName: false,
                                  });
                                }
                              }}
                              className={`w-full rounded px-3 py-2 text-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 ${
                                leadErrors.lastName
                                  ? "border-2 border-red-600 pr-10"
                                  : "border border-[#dddbda]"
                              }`}
                            />
                            {leadErrors.lastName && (
                              <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                            )}
                          </div>
                          {leadErrors.lastName && (
                            <p className="text-red-600 text-xs mt-1">
                              Complete this field.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-[#181818] mb-1">
                        Company
                      </label>
                      <Input
                        value={leadFormData.company}
                        onChange={(e) =>
                          setLeadFormData({
                            ...leadFormData,
                            company: e.target.value,
                          })
                        }
                        className="w-full rounded px-3 py-2 text-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 border border-[#dddbda]"
                      />
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-sm text-[#181818] mb-1">
                        Title
                      </label>
                      <Input
                        value={leadFormData.title}
                        onChange={(e) =>
                          setLeadFormData({
                            ...leadFormData,
                            title: e.target.value,
                          })
                        }
                        className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                      />
                    </div>

                    {/* Website */}
                    <div>
                      <label className="block text-sm text-[#181818] mb-1">
                        Website
                      </label>
                      <Input
                        value={leadFormData.website}
                        onChange={(e) =>
                          setLeadFormData({
                            ...leadFormData,
                            website: e.target.value,
                          })
                        }
                        className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm text-[#181818] mb-1">
                        Description
                      </label>
                      <textarea
                        value={leadFormData.description}
                        onChange={(e) =>
                          setLeadFormData({
                            ...leadFormData,
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

                    <div className="pt-2">
                      <label className="block text-sm text-[#181818] mb-2">
                        Lead Owner
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#706e6b] rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm text-[#181818]">
                          Rishab Nagwani
                        </span>
                      </div>
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
                        value={leadFormData.phone}
                        onChange={(e) =>
                          setLeadFormData({
                            ...leadFormData,
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
                          value={leadFormData.email}
                          onChange={(e) => {
                            setLeadFormData({
                              ...leadFormData,
                              email: e.target.value,
                            });
                            if (leadErrors.email) {
                              setLeadErrors({ ...leadErrors, email: false });
                            }
                          }}
                          className={`w-full rounded px-3 py-2 text-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 ${
                            leadErrors.email
                              ? "border-2 border-red-600 pr-10"
                              : "border border-[#dddbda]"
                          }`}
                        />
                        {leadErrors.email && (
                          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                        )}
                      </div>
                      {leadErrors.email && (
                        <p className="text-red-600 text-xs mt-1">
                          Complete this field.
                        </p>
                      )}
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm text-[#181818] mb-2">
                        Address
                      </label>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-[#706e6b] mb-1">
                            Country
                          </label>
                          <select
                            value={leadFormData.country}
                            onChange={(e) =>
                              setLeadFormData({
                                ...leadFormData,
                                country: e.target.value,
                              })
                            }
                            className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm text-[#181818] hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                          >
                            <option value="">--None--</option>
                            <option value="United States">United States</option>
                            <option value="Canada">Canada</option>
                            <option value="United Kingdom">
                              United Kingdom
                            </option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-[#706e6b] mb-1">
                            Street
                          </label>
                          <textarea
                            value={leadFormData.street}
                            onChange={(e) =>
                              setLeadFormData({
                                ...leadFormData,
                                street: e.target.value,
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
                            City
                          </label>
                          <Input
                            value={leadFormData.city}
                            onChange={(e) =>
                              setLeadFormData({
                                ...leadFormData,
                                city: e.target.value,
                              })
                            }
                            className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-[#706e6b] mb-1">
                              Zip/Postal Code
                            </label>
                            <Input
                              value={leadFormData.zipPostalCode}
                              onChange={(e) =>
                                setLeadFormData({
                                  ...leadFormData,
                                  zipPostalCode: e.target.value,
                                })
                              }
                              className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-[#706e6b] mb-1">
                              State/Province
                            </label>
                            <select
                              value={leadFormData.stateProvince}
                              onChange={(e) =>
                                setLeadFormData({
                                  ...leadFormData,
                                  stateProvince: e.target.value,
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

                {/* Segment Section */}
                <div>
                  <h3 className="text-base font-normal text-[#181818] bg-[#f3f2f2] px-4 py-2 -mx-6 mb-4">
                    Segment
                  </h3>
                  <div className="space-y-4">
                    {/* No. of Employees */}
                    <div>
                      <label className="block text-sm text-[#181818] mb-1">
                        No. of Employees
                      </label>
                      <Input
                        type="number"
                        value={leadFormData.numberOfEmployees}
                        onChange={(e) =>
                          setLeadFormData({
                            ...leadFormData,
                            numberOfEmployees: e.target.value,
                          })
                        }
                        className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                      />
                    </div>

                    {/* Annual Revenue */}
                    <div>
                      <label className="block text-sm text-[#181818] mb-1">
                        Annual Revenue
                      </label>
                      <Input
                        type="number"
                        value={leadFormData.annualRevenue}
                        onChange={(e) =>
                          setLeadFormData({
                            ...leadFormData,
                            annualRevenue: e.target.value,
                          })
                        }
                        className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                      />
                    </div>

                    {/* Lead Source */}
                    <div>
                      <label className="block text-sm text-[#181818] mb-1">
                        Lead Source
                      </label>
                      <select
                        value={leadFormData.leadSource}
                        onChange={(e) =>
                          setLeadFormData({
                            ...leadFormData,
                            leadSource: e.target.value,
                          })
                        }
                        className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm text-[#181818] hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                      >
                        <option value="">--None--</option>
                        <option value="Web">Web</option>
                        <option value="Phone Inquiry">Phone Inquiry</option>
                        <option value="Partner Referral">
                          Partner Referral
                        </option>
                      </select>
                    </div>

                    {/* Industry */}
                    <div>
                      <label className="block text-sm text-[#181818] mb-1">
                        Industry
                      </label>
                      <select
                        value={leadFormData.industry}
                        onChange={(e) =>
                          setLeadFormData({
                            ...leadFormData,
                            industry: e.target.value,
                          })
                        }
                        className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm text-[#181818] hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                      >
                        <option value="">--None--</option>
                        <option value="Technology">Technology</option>
                        <option value="Finance">Finance</option>
                        <option value="Healthcare">Healthcare</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[#dddbda] flex items-center justify-end gap-3">
              <Button
                onClick={handleLeadClose}
                className="bg-white text-[#0176d3] hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 border border-[#dddbda] h-9 px-4 text-sm rounded"
              >
                Cancel
              </Button>
              <Button
                onClick={handleLeadSaveAndNew}
                className="bg-white text-[#0176d3] hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 border border-[#dddbda] h-9 px-4 text-sm rounded"
              >
                Save & New
              </Button>
              <Button
                onClick={handleLeadSave}
                className="bg-[#0176d3] text-white hover:bg-[#0159a8] hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 h-9 px-4 text-sm rounded"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* New Contact Modal */}
      {isNewContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setIsNewContactModalOpen(false)}
          ></div>

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-2xl mx-4">
            {/* Close Button - Outside modal, top right */}
            <button
              onClick={() => setIsNewContactModalOpen(false)}
              className="absolute -top-10 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-150 shadow-lg"
            >
              <X className="w-5 h-5 text-[#706e6b]" />
            </button>

            {/* Modal Content */}
            <div className="bg-white rounded-lg shadow-2xl max-h-[80vh] flex flex-col">
              <div className="px-6 py-4 border-b border-[#dddbda] flex items-center justify-between">
                <h2 className="text-xl font-normal text-[#181818] flex-1 text-center">
                  New Contact
                </h2>
                <p className="text-xs text-[#706e6b]">
                  * = Required Information
                </p>
              </div>

              {/* Modal Body - Scrollable */}
              <div className="overflow-y-auto px-6 py-4 space-y-6">
                {/* About Section */}
                <div>
                  <h3 className="text-base font-normal text-[#181818] bg-[#f3f2f2] px-4 py-2 -mx-6 mb-4">
                    About
                  </h3>

                  {/* Name */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-[#181818] mb-1">
                        <span className="text-red-600">*</span> Name
                      </label>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-[#706e6b] mb-1">
                            Salutation
                          </label>
                          <select className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm text-[#181818] hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
                            <option>--None--</option>
                            <option>Mr.</option>
                            <option>Ms.</option>
                            <option>Mrs.</option>
                            <option>Dr.</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-[#706e6b] mb-1">
                            First Name
                          </label>
                          <Input
                            placeholder="First Name"
                            className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                          />
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
                    </div>

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
                      <Input className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150" />
                    </div>

                    {/* Reports To with Search */}
                    <div>
                      <label className="block text-sm text-[#181818] mb-1">
                        Reports To
                      </label>
                      <div className="relative">
                        <Input
                          placeholder="Search Contacts..."
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
                      <Input className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150" />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm text-[#181818] mb-1">
                        Email
                      </label>
                      <Input
                        type="email"
                        className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                      />
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
                          <select className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm text-[#181818] hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
                            <option>--None--</option>
                            <option>United States</option>
                            <option>Canada</option>
                            <option>United Kingdom</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-[#706e6b] mb-1">
                            Mailing Street
                          </label>
                          <textarea
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
                          <Input className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-[#706e6b] mb-1">
                              Mailing Zip/Postal Code
                            </label>
                            <Input className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150" />
                          </div>
                          <div>
                            <label className="block text-xs text-[#706e6b] mb-1">
                              Mailing State/Province
                            </label>
                            <select className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm text-[#181818] hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
                              <option>--None--</option>
                              <option>California</option>
                              <option>New York</option>
                              <option>Texas</option>
                            </select>
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
                  onClick={() => setIsNewContactModalOpen(false)}
                  className="bg-white text-[#0176d3] hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 border border-[#dddbda] h-9 px-4 text-sm rounded"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleContactSave}
                  className="bg-white text-[#0176d3] hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 border border-[#dddbda] h-9 px-4 text-sm rounded"
                >
                  Save & New
                </Button>
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

      {/* New Opportunity Modal */}
      {isNewOpportunityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setIsNewOpportunityModalOpen(false)}
          ></div>

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-2xl mx-4">
            {/* Close Button - Outside modal, top right */}
            <button
              onClick={() => setIsNewOpportunityModalOpen(false)}
              className="absolute -top-10 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-150 shadow-lg"
            >
              <X className="w-5 h-5 text-[#706e6b]" />
            </button>

            {/* Modal Content */}
            <div className="bg-white rounded-lg shadow-2xl max-h-[80vh] flex flex-col">
              <div className="px-6 py-4 border-b border-[#dddbda] flex items-center justify-between">
                <h2 className="text-xl font-normal text-[#181818] flex-1 text-center">
                  New Opportunity
                </h2>
                <p className="text-xs text-[#706e6b]">
                  * = Required Information
                </p>
              </div>

              {/* Modal Body - Scrollable */}
              <div className="overflow-y-auto px-6 py-4 space-y-6">
                {/* About Section */}
                <div>
                  <h3 className="text-base font-normal text-[#181818] bg-[#f3f2f2] px-4 py-2 -mx-6 mb-4">
                    About
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-[#181818] mb-1">
                        <span className="text-red-600">*</span> Opportunity Name
                      </label>
                      <div className="relative">
                        <Input
                          value={opportunityFormData.opportunityName}
                          onChange={(e) => {
                            setOpportunityFormData({
                              ...opportunityFormData,
                              opportunityName: e.target.value,
                            });
                            if (opportunityErrors.opportunityName) {
                              setOpportunityErrors({
                                ...opportunityErrors,
                                opportunityName: false,
                              });
                            }
                          }}
                          className={`w-full rounded px-3 py-2 text-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 ${
                            opportunityErrors.opportunityName
                              ? "border-2 border-red-600 pr-10"
                              : "border border-[#dddbda]"
                          }`}
                        />
                        {opportunityErrors.opportunityName && (
                          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                        )}
                      </div>
                      {opportunityErrors.opportunityName && (
                        <p className="text-red-600 text-xs mt-1">
                          Complete this field.
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm text-[#181818] mb-1">
                        <span className="text-red-600">*</span> Account Name
                      </label>
                      <div className="relative">
                        <Input
                          placeholder="Search Accounts..."
                          value={opportunityFormData.accountName}
                          onChange={(e) => {
                            setOpportunityFormData({
                              ...opportunityFormData,
                              accountName: e.target.value,
                            });
                            if (opportunityErrors.accountName) {
                              setOpportunityErrors({
                                ...opportunityErrors,
                                accountName: false,
                              });
                            }
                          }}
                          className={`w-full rounded px-3 py-2 pr-10 text-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 ${
                            opportunityErrors.accountName
                              ? "border-2 border-red-600"
                              : "border border-[#dddbda]"
                          }`}
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#706e6b]" />
                      </div>
                      {opportunityErrors.accountName && (
                        <p className="text-red-600 text-xs mt-1">
                          Complete this field.
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm text-[#181818] mb-1">
                        <span className="text-red-600">*</span> Close Date
                      </label>
                      <div className="relative">
                        <Input
                          type="date"
                          value={opportunityFormData.closeDate}
                          onChange={(e) => {
                            setOpportunityFormData({
                              ...opportunityFormData,
                              closeDate: e.target.value,
                            });
                            if (opportunityErrors.closeDate) {
                              setOpportunityErrors({
                                ...opportunityErrors,
                                closeDate: false,
                              });
                            }
                          }}
                          className={`w-full rounded px-3 py-2 pr-10 text-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 ${
                            opportunityErrors.closeDate
                              ? "border-2 border-red-600"
                              : "border border-[#dddbda]"
                          }`}
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0176d3] pointer-events-none" />
                      </div>
                      {opportunityErrors.closeDate && (
                        <p className="text-red-600 text-xs mt-1">
                          Complete this field.
                        </p>
                      )}
                    </div>

                    {/* Amount */}
                    <div>
                      <label className="block text-sm text-[#181818] mb-1">
                        Amount
                      </label>
                      <Input
                        type="number"
                        className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm text-[#181818] mb-1">
                        Description
                      </label>
                      <textarea
                        className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 min-h-20"
                        style={{
                          fontFamily:
                            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                        }}
                      />
                    </div>

                    <div className="pt-2">
                      <label className="block text-sm text-[#181818] mb-2">
                        Opportunity Owner
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#706e6b] rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm text-[#181818]">
                          Rishab Nagwani
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Section */}
                <div>
                  <h3 className="text-base font-normal text-[#181818] bg-[#f3f2f2] px-4 py-2 -mx-6 mb-4">
                    Status
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-[#181818] mb-1">
                        <span className="text-red-600">*</span> Stage
                      </label>
                      <div className="relative">
                        <select
                          value={opportunityFormData.stage}
                          onChange={(e) => {
                            setOpportunityFormData({
                              ...opportunityFormData,
                              stage: e.target.value,
                            });
                            if (opportunityErrors.stage) {
                              setOpportunityErrors({
                                ...opportunityErrors,
                                stage: false,
                              });
                            }
                          }}
                          className={`w-full rounded px-3 py-2 text-sm text-[#181818] hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 ${
                            opportunityErrors.stage
                              ? "border-2 border-red-600 pr-10"
                              : "border border-[#dddbda]"
                          }`}
                        >
                          <option>--None--</option>
                          <option>Prospecting</option>
                          <option>Qualification</option>
                          <option>Needs Analysis</option>
                          <option>Value Proposition</option>
                          <option>Proposal/Price Quote</option>
                          <option>Negotiation/Review</option>
                          <option>Closed Won</option>
                          <option>Closed Lost</option>
                        </select>
                        {opportunityErrors.stage && (
                          <AlertCircle className="absolute right-10 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                        )}
                      </div>
                      {opportunityErrors.stage && (
                        <p className="text-red-600 text-xs mt-1">
                          Complete this field.
                        </p>
                      )}
                    </div>

                    {/* Probability (%) */}
                    <div>
                      <label className="block text-sm text-[#181818] mb-1">
                        Probability (%)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-[#181818] mb-1">
                        <span className="text-red-600">*</span> Forecast
                        Category
                      </label>
                      <div className="relative">
                        <select
                          value={opportunityFormData.forecastCategory}
                          onChange={(e) => {
                            setOpportunityFormData({
                              ...opportunityFormData,
                              forecastCategory: e.target.value,
                            });
                            if (opportunityErrors.forecastCategory) {
                              setOpportunityErrors({
                                ...opportunityErrors,
                                forecastCategory: false,
                              });
                            }
                          }}
                          className={`w-full rounded px-3 py-2 text-sm text-[#181818] hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 ${
                            opportunityErrors.forecastCategory
                              ? "border-2 border-red-600 pr-10"
                              : "border border-[#dddbda]"
                          }`}
                        >
                          <option>--None--</option>
                          <option>Pipeline</option>
                          <option>Best Case</option>
                          <option>Commit</option>
                          <option>Omitted</option>
                          <option>Closed</option>
                        </select>
                        {opportunityErrors.forecastCategory && (
                          <AlertCircle className="absolute right-10 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                        )}
                      </div>
                      {opportunityErrors.forecastCategory && (
                        <p className="text-red-600 text-xs mt-1">
                          Complete this field.
                        </p>
                      )}
                    </div>

                    {/* Next Step */}
                    <div>
                      <label className="block text-sm text-[#181818] mb-1">
                        Next Step
                      </label>
                      <Input className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-[#dddbda] flex items-center justify-end gap-3">
                <Button
                  onClick={() => setIsNewOpportunityModalOpen(false)}
                  className="bg-white text-[#0176d3] hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 border border-[#dddbda] h-9 px-4 text-sm rounded"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleOpportunitySave}
                  className="bg-white text-[#0176d3] hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 border border-[#dddbda] h-9 px-4 text-sm rounded"
                >
                  Save & New
                </Button>
                <Button
                  onClick={handleOpportunitySave}
                  className="bg-[#0176d3] text-white hover:bg-[#0159a8] hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 h-9 px-4 text-sm rounded"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
