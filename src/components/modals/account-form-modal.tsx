"use client";

import { useState, useEffect } from "react"; // [ADDED]
import axios from "axios"; // [ADDED]
import useDebounce from "@/hooks/use-debounce"; // [ADDED]
import { SearchResultList } from "../search-result-list"; // [ADDED]
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Ban, Search } from "lucide-react";
import Image from "next/image";

// [MODIFIED] Interface
export interface AccountFormData {
  name: string;
  website: string;
  type: string;
  description: string;
  parentAccount: string;
  parentAccountId: number | null; // [ADDED]
  phone: string;
  billingCountry: string;
  billingStreet: string;
  billingCity: string;
  billingZipPostalCode: string;
  billingStateProvince: string;
  shippingCountry: string;
  shippingStreet: string;
  shippingCity: string;
  shippingZipPostalCode: string;
  shippingStateProvince: string;
}

interface AccountFormModalProps {
  isOpen: boolean;
  isEditMode: boolean;
  accountFormData: AccountFormData;
  accountErrors: Record<string, boolean>;
  onClose: () => void;
  onSave: () => Promise<void>;
  onSaveAndNew: () => Promise<void>;
  setAccountFormData: (data: AccountFormData) => void;
  setAccountErrors: (errors: Record<string, boolean>) => void;
  isSaving?: boolean;
}

export default function AccountFormModal({
  isOpen,
  isEditMode,
  accountFormData,
  accountErrors,
  onClose,
  onSave,
  onSaveAndNew,
  setAccountFormData,
  setAccountErrors,
  isSaving,
}: AccountFormModalProps) {
  // [NEW] State for Parent Account Search
  const [parentAccountSearchQuery, setParentAccountSearchQuery] = useState("");
  const [parentAccountSearchResults, setParentAccountSearchResults] = useState<
    any[]
  >([]);
  const [isParentAccountLoading, setIsParentAccountLoading] = useState(false);
  const debouncedParentAccountSearch = useDebounce(
    parentAccountSearchQuery,
    300
  );

  const accountTypeOptions = [
    "--None--",
    "Analyst",
    "Competitor",
    "Customer",
    "Integrator",
    "Investor",
    "Partner",
    "Press",
    "Prospect",
    "Reseller",
    "Other",
  ];
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

  // [NEW] Effect for Parent Account Search
  useEffect(() => {
    if (
      debouncedParentAccountSearch &&
      debouncedParentAccountSearch !== accountFormData.parentAccount
    ) {
      setIsParentAccountLoading(true);
      axios
        .get(
          `/api/v1/sobjects/accounts?name=${encodeURIComponent(
            debouncedParentAccountSearch
          )}`
        )
        .then((res) => {
          // Exclude self from parent account search results
          const results = res.data.filter(
            (acc: any) =>
              acc.name.toLowerCase() !== accountFormData.name.toLowerCase()
          );
          setParentAccountSearchResults(
            results.map((acc: any) => ({ id: acc.id, name: acc.name }))
          );
        })
        .catch((err) => console.error("Error searching accounts:", err))
        .finally(() => setIsParentAccountLoading(false));
    } else {
      setParentAccountSearchResults([]);
    }
  }, [
    debouncedParentAccountSearch,
    accountFormData.parentAccount,
    accountFormData.name,
  ]);

  // [NEW] Set search query when modal opens in edit mode
  useEffect(() => {
    if (isOpen) {
      setParentAccountSearchQuery(accountFormData.parentAccount);
    }
  }, [isOpen, accountFormData.parentAccount]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="min-w-4xl max-h-[90vh] flex flex-col p-0 rounded-t-3xl rounded-b-none"
        showCloseButton={false}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white border-2 border-[#0176d3] flex items-center justify-center hover:bg-gray-50 transition-colors z-20"
        >
          <X className="w-5 h-5 text-[#0176d3]" />
        </button>
        <DialogHeader className="px-6 py-4 border-b-2 border-gray-300">
          <DialogTitle className="text-xl font-normal text-[#181818] flex-1 text-center">
            {isEditMode ? "Edit Account" : "New Account"}
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto">
          <div className="px-6 text-right">
            <p className="text-xs text-[#000000]">
              <span className="text-red-500">*</span> = Required Information
            </p>
          </div>
          <div className="px-10 py-4 space-y-6">
            {" "}
            <div>
              <h3 className="text-xl font-normal text-gray-800 bg-[#f3f2f2] px-4 py-1 -mx-7 mb-4 rounded-lg">
                About
              </h3>
              <div className="space-y-4">
                {/* Account Name */}
                <div>
                  <Label className="block text-sm text-[#181818] mb-1">
                    <span className="text-red-600">*</span> Account Name
                  </Label>
                  <div className="relative">
                    {accountErrors.name && (
                      <Ban className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600 z-10" />
                    )}
                    <Input
                      type="text"
                      value={accountFormData.name}
                      onChange={(e) => {
                        setAccountFormData({
                          ...accountFormData,
                          name: e.target.value,
                        });
                        if (accountErrors.name) {
                          setAccountErrors({
                            ...accountErrors,
                            name: false,
                          });
                        }
                      }}
                      className={`w-full text-sm ${
                        accountErrors.name
                          ? "border-red-500 bg-[#fddde3] pl-10"
                          : "border border-[#000000] rounded px-3 py-2"
                      }`}
                    />
                  </div>
                  {accountErrors.name && (
                    <p className="text-red-600 text-xs mt-1">
                      Complete this field.
                    </p>
                  )}
                </div>
                {/* Website */}
                <div>
                  <Label className="block text-sm text-[#181818] mb-1">
                    Website
                  </Label>
                  <Input
                    type="text"
                    value={accountFormData.website}
                    onChange={(e) =>
                      setAccountFormData({
                        ...accountFormData,
                        website: e.target.value,
                      })
                    }
                    className="w-full border border-[#000000] rounded px-3 py-2 text-sm"
                  />
                </div>
                {/* Type */}
                <div>
                  <Label className="block text-sm text-[#181818] mb-1">
                    Type
                  </Label>
                  <Select
                    value={accountFormData.type}
                    onValueChange={(value) =>
                      setAccountFormData({
                        ...accountFormData,
                        type: value,
                      })
                    }
                  >
                    <SelectTrigger className="w-full border-[#000000] text-sm">
                      <SelectValue placeholder="--None--" />
                    </SelectTrigger>
                    <SelectContent>
                      {accountTypeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Description */}
                <div>
                  <Label className="block text-sm text-[#181818] mb-1">
                    Description
                  </Label>
                  <Textarea
                    rows={3}
                    value={accountFormData.description}
                    onChange={(e) =>
                      setAccountFormData({
                        ...accountFormData,
                        description: e.target.value,
                      })
                    }
                    className="w-full border border-[#000000] rounded px-3 py-2 text-sm min-h-20"
                  />
                </div>
                {/* Parent Account */}
                <div>
                  {/* [REMOVED] todo comment */}
                  <Label className="block text-sm text-[#181818] mb-1">
                    Parent Account
                  </Label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search Accounts..."
                      value={accountFormData.parentAccount}
                      onChange={(e) => {
                        // [MODIFIED]
                        setAccountFormData({
                          ...accountFormData,
                          parentAccount: e.target.value,
                          parentAccountId: null, // Clear ID on manual change
                        });
                        setParentAccountSearchQuery(e.target.value); // Trigger search
                      }}
                      className="w-full border border-[#000000] rounded px-3 py-2 text-sm pr-10"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                  {/* [NEW] Parent Account Search Results */}
                  {parentAccountSearchQuery &&
                    parentAccountSearchQuery !==
                      accountFormData.parentAccount && (
                      <div className="mt-2">
                        <SearchResultList
                          isLoading={isParentAccountLoading}
                          results={parentAccountSearchResults}
                          onSelect={(item) => {
                            setAccountFormData({
                              ...accountFormData,
                              parentAccount: item.name,
                              parentAccountId: item.id, // Set the ID
                            });
                            setParentAccountSearchQuery("");
                            setParentAccountSearchResults([]);
                          }}
                          noResultsMessage="No accounts found."
                        />
                      </div>
                    )}
                </div>
                {/* Account Owner */}
                <div className="pt-2">
                  <Label className="block text-sm text-[#181818] mb-1">
                    Account Owner
                  </Label>
                  <div className="flex items-center gap-1 mt-2">
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
                Get in Touch
              </h3>
              <div className="space-y-4">
                {/* Phone */}
                <div>
                  <Label className="block text-sm text-[#181818] mb-1">
                    Phone
                  </Label>
                  <Input
                    type="tel"
                    value={accountFormData.phone}
                    onChange={(e) =>
                      setAccountFormData({
                        ...accountFormData,
                        phone: e.target.value,
                      })
                    }
                    className="w-full border border-[#000000] rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
            {/* Billing Address Section */}
            <div>
              <h3 className="text-base font-normal text-black">
                Billing Address
              </h3>
              <div className="space-y-4">
                <div>
                  <Label className="block text-xs text-[#000000] mb-1">
                    Billing Country
                  </Label>
                  <Select
                    value={accountFormData.billingCountry}
                    onValueChange={(value) =>
                      setAccountFormData({
                        ...accountFormData,
                        billingCountry: value,
                      })
                    }
                  >
                    <SelectTrigger className="w-full border-[#000000] text-sm">
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
                    Billing Street
                  </Label>
                  <Textarea
                    rows={3}
                    value={accountFormData.billingStreet}
                    onChange={(e) =>
                      setAccountFormData({
                        ...accountFormData,
                        billingStreet: e.target.value,
                      })
                    }
                    className="w-full border border-[#000000] rounded px-3 py-2 text-sm min-h-[60px]"
                  />
                </div>
                <div>
                  <Label className="block text-xs text-[#000000] mb-1">
                    Billing City
                  </Label>
                  <Input
                    type="text"
                    value={accountFormData.billingCity}
                    onChange={(e) =>
                      setAccountFormData({
                        ...accountFormData,
                        billingCity: e.target.value,
                      })
                    }
                    className="w-full border border-[#000000] rounded px-3 py-2 text-sm"
                  />
                </div>
                <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                  <div className="col-span-2">
                    <Label className="block text-xs text-[#000000] mb-1">
                      Billing Zip/Postal Code
                    </Label>
                    <Input
                      type="text"
                      value={accountFormData.billingZipPostalCode}
                      onChange={(e) =>
                        setAccountFormData({
                          ...accountFormData,
                          billingZipPostalCode: e.target.value,
                        })
                      }
                      className="w-full border border-[#000000] rounded px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="block text-xs text-[#000000] mb-1">
                      Billing State/Province
                    </Label>
                    <Select
                      value={accountFormData.billingStateProvince}
                      onValueChange={(value) =>
                        setAccountFormData({
                          ...accountFormData,
                          billingStateProvince: value,
                        })
                      }
                    >
                      <SelectTrigger className="w-full border-[#000000] text-sm">
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
            {/* Shipping Address Section */}
            <div>
              <h3 className="text-base font-normal text-black">
                Shipping Address
              </h3>
              <div className="space-y-4">
                <div>
                  <Label className="block text-xs text-[#000000] mb-1">
                    Shipping Country
                  </Label>
                  <Select
                    value={accountFormData.shippingCountry}
                    onValueChange={(value) =>
                      setAccountFormData({
                        ...accountFormData,
                        shippingCountry: value,
                      })
                    }
                  >
                    <SelectTrigger className="w-full border-[#000000] text-sm">
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
                    Shipping Street
                  </Label>
                  <Textarea
                    rows={3}
                    value={accountFormData.shippingStreet}
                    onChange={(e) =>
                      setAccountFormData({
                        ...accountFormData,
                        shippingStreet: e.target.value,
                      })
                    }
                    className="w-full border border-[#000000] rounded px-3 py-2 text-sm min-h-[60px]"
                  />
                </div>
                <div>
                  <Label className="block text-xs text-[#000000] mb-1">
                    Shipping City
                  </Label>
                  <Input
                    type="text"
                    value={accountFormData.shippingCity}
                    onChange={(e) =>
                      setAccountFormData({
                        ...accountFormData,
                        shippingCity: e.target.value,
                      })
                    }
                    className="w-full border border-[#000000] rounded px-3 py-2 text-sm"
                  />
                </div>
                <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                  <div className="col-span-2">
                    <Label className="block text-xs text-[#000000] mb-1">
                      Shipping Zip/Postal Code
                    </Label>
                    <Input
                      type="text"
                      value={accountFormData.shippingZipPostalCode}
                      onChange={(e) =>
                        setAccountFormData({
                          ...accountFormData,
                          shippingZipPostalCode: e.target.value,
                        })
                      }
                      className="w-full border border-[#000000] rounded px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="block text-xs text-[#000000] mb-1">
                      Shipping State/Province
                    </Label>
                    <Select
                      value={accountFormData.shippingStateProvince}
                      onValueChange={(value) =>
                        setAccountFormData({
                          ...accountFormData,
                          shippingStateProvince: value,
                        })
                      }
                    >
                      <SelectTrigger className="w-full border-[#000000] text-sm">
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
        <DialogFooter className="px-6 py-4 border-t border-gray-400 flex-row justify-end gap-3">
          <Button
            onClick={onClose}
            className="bg-white text-[#066afe] hover:bg-gray-50 border border-black h-9 px-4 text-sm rounded-full"
            disabled={isSaving}
          >
            Cancel
          </Button>
          {!isEditMode && (
            <Button
              onClick={onSaveAndNew}
              className="bg-white text-[#066afe] hover:bg-gray-50 border border-black h-9 px-4 text-sm rounded-full"
              disabled={isSaving}
            >
              Save & New
            </Button>
          )}
          <Button
            onClick={onSave}
            className="bg-[#066afe] text-white hover:bg-[#066afe] h-9 px-4 text-sm rounded-full"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
