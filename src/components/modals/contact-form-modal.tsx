"use client";

import { Input } from "@/components/ui/input";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Search, Ban, X } from "lucide-react"; // Added X, replaced AlertCircle
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Added
import { Label } from "@/components/ui/label"; // Added
import { Textarea } from "@/components/ui/textarea"; // Added
import Image from "next/image";
import { useEffect, useState } from "react";
import useDebounce from "@/hooks/use-debounce";
import { SearchResultList } from "../search-result-list";

export interface ContactFormData {
  salutation: string;
  firstName: string;
  lastName: string;
  accountName: string;
  title: string;
  reportsTo: string;
  reportsToId: number | null;
  description: string;
  email: string;
  phone: string;
  mailingCountry: string;
  mailingStreet: string;
  mailingCity: string;
  mailingZipPostalCode: string;
  mailingStateProvince: string;
}

interface ContactFormModalProps {
  isOpen: boolean;
  isEditMode: boolean;
  onClose: () => void;
  onSave: () => Promise<void>;
  onSaveAndNew: () => Promise<void>;
  contactFormData: ContactFormData;
  setContactFormData: (data: ContactFormData) => void;
  contactErrors: Record<string, boolean>;
  setContactErrors: (errors: Record<string, boolean>) => void;
  isSaving?: boolean;
}

export default function ContactFormModal({
  isOpen,
  isEditMode,
  onClose,
  onSave,
  onSaveAndNew,
  contactFormData,
  setContactFormData,
  contactErrors,
  setContactErrors,
  isSaving,
}: ContactFormModalProps) {
  // Options for Salutation
  const salutationOptions = [
    "--None--",
    "Mr.",
    "Ms.",
    "Mrs.",
    "Dr.",
    "Prof.",
    "Mx.",
  ]; // Options for Countries (simplified, add more as needed)
  const allCountries = [
    "--None--",
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Congo (Congo-Brazzaville)",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Democratic Republic of the Congo",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar (Burma)",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "North Korea",
    "North Macedonia",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestine",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Rwanda",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Korea",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Sweden",
    "Switzerland",
    "Syria",
    "Taiwan",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Vatican City",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ];

  const [accountSearchQuery, setAccountSearchQuery] = useState("");
  const [accountSearchResults, setAccountSearchResults] = useState<any[]>([]);
  const [isAccountLoading, setIsAccountLoading] = useState(false);
  const debouncedAccountSearch = useDebounce(accountSearchQuery, 300);

  // [NEW] State for Contact Search (Reports To)
  const [reportsToSearchQuery, setReportsToSearchQuery] = useState("");
  const [reportsToSearchResults, setReportsToSearchResults] = useState<any[]>(
    []
  );
  const [isReportsToLoading, setIsReportsToLoading] = useState(false);
  const debouncedReportsToSearch = useDebounce(reportsToSearchQuery, 300);

  // [NEW] Effect for Account Search
  useEffect(() => {
    // Only search if the query doesn't match the form data (i.e., user is typing)
    if (
      debouncedAccountSearch &&
      debouncedAccountSearch !== contactFormData.accountName
    ) {
      setIsAccountLoading(true);
      axios
        .get(
          `/api/v1/sobjects/accounts?name=${encodeURIComponent(
            debouncedAccountSearch
          )}`
        )
        .then((res) => {
          setAccountSearchResults(
            res.data.map((acc: any) => ({ id: acc.id, name: acc.name }))
          );
        })
        .catch((err) => console.error("Error searching accounts:", err))
        .finally(() => setIsAccountLoading(false));
    } else {
      setAccountSearchResults([]);
    }
  }, [debouncedAccountSearch, contactFormData.accountName]);

  // [NEW] Effect for Contact Search (Reports To)
  useEffect(() => {
    // Only search if the query doesn't match the form data
    if (
      debouncedReportsToSearch &&
      debouncedReportsToSearch !== contactFormData.reportsTo
    ) {
      setIsReportsToLoading(true);
      axios
        .get(
          `/api/v1/sobjects/contacts?search=${encodeURIComponent(
            debouncedReportsToSearch
          )}`
        )
        .then((res) => {
          setReportsToSearchResults(
            res.data.map((c: any) => ({
              id: c.id,
              name: `${c.first_name || ""} ${c.last_name || ""}`.trim(),
            }))
          );
        })
        .catch((err) => console.error("Error searching contacts:", err))
        .finally(() => setIsReportsToLoading(false));
    } else {
      setReportsToSearchResults([]);
    }
  }, [debouncedReportsToSearch, contactFormData.reportsTo]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="overflow-y-auto min-w-4xl max-h-[90vh] flex flex-col p-0 rounded-t-3xl rounded-b-none" // Updated
        showCloseButton={false} // Updated
      >
        {/* Added Custom Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white border-2 border-[#0176d3] flex items-center justify-center hover:bg-gray-50 transition-colors z-20"
        >
          <X className="w-5 h-5 text-[#0176d3]" />
        </button>
        <div className="overflow-y-auto">
          <DialogHeader className="px-6 py-4 border-b-2 border-gray-300">
            {/* Updated */}
            <DialogTitle className="text-xl font-normal text-[#181818] flex-1 text-center">
              {isEditMode ? "Edit Contact" : "New Contact"}
            </DialogTitle>
          </DialogHeader>
          {/* "Required Info" text moved below header */}
          <div className="px-6 text-right">
            <p className="text-xs text-[#000000]">
              <span className="text-red-500">*</span> = Required Information
            </p>
          </div>
          {/* Scrollable Body */}
          <div className="px-10 py-4 space-y-6">
            {/* Updated Padding */}
            {/* About Section */}
            <div>
              <h3 className="text-xl font-normal text-gray-800 bg-[#f3f2f2] px-4 py-1 -mx-7 mb-4 rounded-lg">
                {/* Updated */}
                About
              </h3>
              {/* Name */}
              <div className="space-y-4">
                <div>
                  <Label className="block text-sm text-[#181818] mb-1">
                    {/* Updated */}
                    <span className="text-red-600">*</span> Name
                  </Label>
                  <div className="space-y-3">
                    <div>
                      <Label className="block text-xs text-[#000000] mb-1">
                        {/* Updated */}
                        Salutation
                      </Label>
                      <Select // Updated
                        value={contactFormData.salutation}
                        onValueChange={(value) =>
                          setContactFormData({
                            ...contactFormData,
                            salutation: value,
                          })
                        }
                      >
                        <SelectTrigger className="w-full border border-[#000000] rounded px-3 py-2 text-sm">
                          <SelectValue placeholder="--None--" />
                        </SelectTrigger>
                        <SelectContent>
                          {salutationOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="block text-xs text-[#000000] mb-1">
                        {/* Updated */}
                        <span className="text-red-600">*</span> First Name
                      </Label>
                      <div className="relative">
                        {/* Added Error Icon */}
                        {contactErrors.firstName && (
                          <Ban className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600 z-10" />
                        )}
                        <Input
                          placeholder="First Name"
                          value={contactFormData.firstName}
                          onChange={(e) => {
                            setContactFormData({
                              ...contactFormData,
                              firstName: e.target.value,
                            });
                            if (contactErrors.firstName) {
                              setContactErrors({
                                ...contactErrors,
                                firstName: false,
                              });
                            }
                          }}
                          className={`w-full text-sm ${
                            contactErrors.firstName
                              ? "border-red-500 bg-[#fddde3] pl-10" // Red style
                              : "border border-[#000000] rounded px-3 py-2" // Base style
                          }`}
                        />
                      </div>
                      {contactErrors.firstName && (
                        <p className="text-red-600 text-xs mt-1">
                          Complete this field.
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="block text-xs text-[#000000] mb-1">
                        {/* Updated */}
                        <span className="text-red-600">*</span> Last Name
                      </Label>
                      <div className="relative">
                        {/* Added Error Icon */}
                        {contactErrors.lastName && (
                          <Ban className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600 z-10" />
                        )}
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
                          className={`w-full text-sm ${
                            contactErrors.lastName
                              ? "border-red-500 bg-[#fddde3] pl-10" // Red style
                              : "border border-[#000000] rounded px-3 py-2" // Base style
                          }`}
                        />
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
                  <Label className="block text-sm text-[#181818] mb-1">
                    {/* Updated */}
                    <span className="text-red-600">*</span> Account Name
                  </Label>
                  <div className="relative">
                    {/* Added Error Icon */}
                    {contactErrors.accountName && (
                      <Ban className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600 z-10" />
                    )}
                    <Input
                      placeholder="Search Accounts..."
                      value={contactFormData.accountName}
                      onChange={(e) => {
                        setContactFormData({
                          ...contactFormData,
                          accountName: e.target.value,
                        });
                        setAccountSearchQuery(e.target.value);
                        if (contactErrors.accountName) {
                          setContactErrors({
                            ...contactErrors,
                            accountName: false,
                          });
                        }
                      }}
                      className={`w-full text-sm pr-10 ${
                        contactErrors.accountName
                          ? "border-red-500 bg-[#fddde3] pl-10" // Red style
                          : "border border-[#000000] rounded px-3 py-2 pl-3" // Base style
                      }`}
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#706e6b]" />
                  </div>
                  {contactErrors.accountName && (
                    <p className="text-red-600 text-xs mt-1">
                      Complete this field.
                    </p>
                  )}
                  {accountSearchQuery &&
                    accountSearchQuery !== contactFormData.accountName && (
                      <div className="mt-2">
                        <SearchResultList
                          isLoading={isAccountLoading}
                          results={accountSearchResults}
                          onSelect={(item) => {
                            setContactFormData({
                              ...contactFormData,
                              accountName: item.name,
                            });
                            setAccountSearchQuery("");
                            setAccountSearchResults([]);
                          }}
                          noResultsMessage="No accounts found. A new one will be created."
                        />
                      </div>
                    )}
                </div>
                {/* Title */}
                <div>
                  <Label className="block text-sm text-[#181818] mb-1">
                    {/* Updated */}
                    Title
                  </Label>
                  <Input
                    value={contactFormData.title}
                    onChange={(e) =>
                      setContactFormData({
                        ...contactFormData,
                        title: e.target.value,
                      })
                    }
                    className="w-full border border-[#000000] rounded px-3 py-2 text-sm" // Updated
                  />
                </div>

                <div>
                  <Label className="block text-sm text-[#181818] mb-1">
                    {/* Updated */}
                    Reports To
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Search Contacts..."
                      value={contactFormData.reportsTo}
                      onChange={(e) => {
                        setContactFormData({
                          ...contactFormData,
                          reportsTo: e.target.value,
                          reportsToId: null, // Clear ID on manual change
                        });
                        setReportsToSearchQuery(e.target.value); // [NEW]
                      }}
                      className="w-full border border-[#000000] rounded px-3 py-2 pr-10 text-sm" // Updated
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#706e6b]" />
                  </div>
                  {reportsToSearchQuery &&
                    reportsToSearchQuery !== contactFormData.reportsTo && (
                      <div className="mt-2">
                        <SearchResultList
                          isLoading={isReportsToLoading}
                          results={reportsToSearchResults}
                          onSelect={(item) => {
                            setContactFormData({
                              ...contactFormData,
                              reportsTo: item.name,
                              reportsToId: item.id,
                            });
                            setReportsToSearchQuery("");
                            setReportsToSearchResults([]);
                          }}
                        />
                      </div>
                    )}
                </div>
                {/* Description */}
                <div>
                  <Label className="block text-sm text-[#181818] mb-1">
                    {/* Updated */}
                    Description
                  </Label>
                  <Textarea // Updated
                    value={contactFormData.description}
                    onChange={(e) =>
                      setContactFormData({
                        ...contactFormData,
                        description: e.target.value,
                      })
                    }
                    className="w-full border border-[#000000] rounded px-3 py-2 text-sm min-h-20" // Updated
                    style={{
                      fontFamily:
                        'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    }}
                  />
                </div>
                <div>
                  <Label className="block text-sm text-[#181818]">
                    Contact Owner
                  </Label>
                  <div className="flex items-center gap-1">
                    <Image
                      src="/owner-icon.png"
                      alt=""
                      width={25}
                      height={25}
                    />
                    <span className="text-sm text-[#181818]">
                      Rishab Nagwani
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Get in Touch Section */}
            <div>
              <h3 className="text-xl font-normal text-gray-800 bg-[#f3f2f2] px-4 py-1 -mx-7 mb-4 rounded-lg">
                {/* Updated */}
                Get in Touch
              </h3>
              <div className="space-y-4">
                {/* Phone */}
                <div>
                  <Label className="block text-sm text-[#181818] mb-1">
                    {/* Updated */}
                    Phone
                  </Label>
                  <Input
                    value={contactFormData.phone}
                    onChange={(e) =>
                      setContactFormData({
                        ...contactFormData,
                        phone: e.target.value,
                      })
                    }
                    className="w-full border border-[#000000] rounded px-3 py-2 text-sm" // Updated
                  />
                </div>
                {/* Email */}
                <div>
                  <Label className="block text-sm text-[#181818] mb-1">
                    {/* Updated */}
                    <span className="text-red-600">*</span> Email
                  </Label>
                  <div className="relative">
                    {/* Added Error Icon */}
                    {contactErrors.email && (
                      <Ban className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600 z-10" />
                    )}
                    <Input
                      type="email"
                      value={contactFormData.email}
                      onChange={(e) => {
                        setContactFormData({
                          ...contactFormData,
                          email: e.target.value,
                        });
                        if (contactErrors.email) {
                          setContactErrors({
                            ...contactErrors,
                            email: false,
                          });
                        }
                      }}
                      className={`w-full text-sm ${
                        contactErrors.email
                          ? "border-red-500 bg-[#fddde3] pl-10" // Red style
                          : "border border-[#000000] rounded px-3 py-2" // Base style
                      }`}
                    />
                  </div>
                  {contactErrors.email && (
                    <p className="text-red-600 text-xs mt-1">
                      Complete this field.
                    </p>
                  )}
                </div>
                {/* Mailing Address */}
                <div>
                  <Label className="block text-sm text-[#181818] mb-2">
                    {/* Updated */}
                    Mailing Address
                  </Label>
                  <div className="space-y-3">
                    <div>
                      <Label className="block text-xs text-[#000000] mb-1">
                        {/* Updated */}
                        Mailing Country
                      </Label>
                      <Select // Updated
                        value={contactFormData.mailingCountry}
                        onValueChange={(value) =>
                          setContactFormData({
                            ...contactFormData,
                            mailingCountry: value,
                          })
                        }
                      >
                        <SelectTrigger className="w-full border border-[#000000] rounded px-3 py-2 text-sm">
                          <SelectValue placeholder="--None--" />
                        </SelectTrigger>
                        <SelectContent>
                          {allCountries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="block text-xs text-[#000000] mb-1">
                        {/* Updated */}
                        Mailing Street
                      </Label>
                      <Textarea // Updated
                        value={contactFormData.mailingStreet}
                        onChange={(e) =>
                          setContactFormData({
                            ...contactFormData,
                            mailingStreet: e.target.value,
                          })
                        }
                        className="w-full border border-[#000000] rounded px-3 py-2 text-sm min-h-[60px]" // Updated
                        style={{
                          fontFamily:
                            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                        }}
                      />
                    </div>
                    <div>
                      <Label className="block text-xs text-[#000000] mb-1">
                        {/* Updated */}
                        Mailing City
                      </Label>
                      <Input
                        value={contactFormData.mailingCity}
                        onChange={(e) =>
                          setContactFormData({
                            ...contactFormData,
                            mailingCity: e.target.value,
                          })
                        }
                        className="w-full border border-[#000000] rounded px-3 py-2 text-sm" // Updated
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                      {/* Updated Grid */}
                      <div className="col-span-2">
                        <Label className="block text-xs text-[#000000] mb-1">
                          {/* Updated */}
                          Mailing Zip/Postal Code
                        </Label>
                        <Input
                          value={contactFormData.mailingZipPostalCode}
                          onChange={(e) =>
                            setContactFormData({
                              ...contactFormData,
                              mailingZipPostalCode: e.target.value,
                            })
                          }
                          className="w-full border border-[#000000] rounded px-3 py-2 text-sm" // Updated
                        />
                      </div>
                      <div>
                        <Label className="block text-xs text-[#000000] mb-1">
                          {/* Updated */}
                          Mailing State/Province
                        </Label>
                        <Select // Updated
                          value={contactFormData.mailingStateProvince}
                          onValueChange={(value) =>
                            setContactFormData({
                              ...contactFormData,
                              mailingStateProvince: value,
                            })
                          }
                        >
                          <SelectTrigger className="w-full border border-[#000000] rounded px-3 py-2 text-sm">
                            <SelectValue placeholder="--None--" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="--None--">--None--</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Modal Footer */}
        <DialogFooter className="px-6 py-4 border-t border-gray-400 flex-row justify-end gap-3">
          {/* Updated */}
          <Button
            onClick={onClose}
            className="bg-white text-[#066afe] hover:bg-gray-50 border border-black h-9 px-4 text-sm rounded-3xl" // Updated
            disabled={isSaving} // Disable Cancel button while saving
          >
            Cancel
          </Button>
          {!isEditMode && (
            <Button
              onClick={onSaveAndNew}
              className="bg-white text-[#066afe] hover:bg-gray-50 border border-black h-9 px-4 text-sm rounded-3xl" // Updated
              disabled={isSaving} // Disable Save & New button while saving
            >
              Save & New
            </Button>
          )}
          <Button
            onClick={onSave}
            className="bg-[#066afe] text-white hover:bg-[#066afe] h-9 px-4 text-sm rounded-3xl" // Updated
            disabled={isSaving} // Disable Save button while saving
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
