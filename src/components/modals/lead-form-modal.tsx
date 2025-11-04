"use client";

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
import { X, Ban } from "lucide-react"; 
import Image from "next/image";

export interface LeadFormData {
  salutation: string;
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  website: string;
  description: string;
  email: string;
  phone: string;
  country: string;
  street: string;
  city: string;
  zipPostalCode: string;
  stateProvince: string;
  numberOfEmployees: string;
  annualRevenue: string;
  leadSource: string;
  industry: string;
  status: string; 
}

interface LeadFormModalProps {
  isOpen: boolean;
  isEditMode: boolean;
  onClose: () => void;
  onSave: () => Promise<void>;
  onSaveAndNew: () => Promise<void>;
  leadFormData: LeadFormData;
  setLeadFormData: (data: LeadFormData) => void;
  leadErrors: Record<string, boolean>;
  setLeadErrors: (errors: Record<string, boolean>) => void;
  isSaving?: boolean; 
}

export default function LeadFormModal({
  isOpen,
  isEditMode,
  onClose,
  onSave,
  onSaveAndNew,
  leadFormData,
  setLeadFormData,
  leadErrors,
  setLeadErrors,
  isSaving, 
}: LeadFormModalProps) {
  
  const salutationOptions = [
    "--None--",
    "Mr.",
    "Ms.",
    "Mrs.",
    "Dr.",
    "Prof.",
    "Mx.",
  ];

  const leadStatusOptions = [
    "--None--",
    "New",
    "Contacted",
    "Nurturing",
    "Qualified",
    "Unqualified",
  ];

  const leadSourceOptions = [
    "--None--",
    "Advertisement",
    "Employee Referral",
    "External Referral",
    "Partner",
    "Public Relations",
    "Seminar - Internal",
    "Seminar - Partner",
    "Trade Show",
    "Web",
    "Word of mouth",
    "Other",
  ];

  const industryOptions = [
    "--None--",
    "Agriculture",
    "Apparel",
    "Banking",
    "Biotechnology",
    "Chemicals",
    "Communication",
    "Construction",
    "Consulting",
    "Education",
    "Electronics",
    "Energy",
    "Engineering",
    "Entertainment",
    "Environmental",
    "Finance",
    "Food & Beverage",
    "Government",
    "Healthcare",
    "Hospitality",
    "Insurance",
    "Machinery",
    "Manufacturing",
    "Media",
    "Not For Profit",
    "Other",
    "Recreation",
    "Retail",
    "Shipping",
    "Technology",
    "Telecommunications",
    "Transportation",
    "Utilities",
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
        <div className="overflow-y-auto">
          <DialogHeader className="px-6 py-4 border-b-2 border-gray-300">
            <DialogTitle className="text-xl font-normal text-[#181818] flex-1 text-center">
              {isEditMode ? "Edit Lead" : "New Lead"}
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 text-right">
            <p className="text-xs text-[#000000]">
              <span className="text-red-500">*</span> = Required Information
            </p>
          </div>

          <div className="px-10 py-4 space-y-6">
            
            <div>
              <h3 className="text-xl font-normal text-gray-800 bg-[#f3f2f2] px-4 py-1 -mx-7 mb-4 rounded-lg">
                About
              </h3>

              <div className="space-y-4">
                
                <div>
                  <Label className="block text-sm text-[#181818] mb-1">
                    <span className="text-red-600">*</span> Name
                  </Label>
                  <div className="space-y-3">
                    
                    <div>
                      <Label className="block text-xs text-[#000000] mb-1">
                        Salutation
                      </Label>
                      <Select
                        value={leadFormData.salutation}
                        onValueChange={(value) =>
                          setLeadFormData({
                            ...leadFormData,
                            salutation: value,
                          })
                        }
                      >
                        <SelectTrigger className="w-full border-[#000000] text-sm">
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
                        <span className="text-red-600">*</span> First Name
                      </Label>
                      <div className="relative">
                        {leadErrors.firstName && (
                          <Ban className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600 z-10" />
                        )}
                        <Input
                          placeholder="First Name"
                          value={leadFormData.firstName}
                          onChange={(e) => {
                            setLeadFormData({
                              ...leadFormData,
                              firstName: e.target.value,
                            });
                            if (leadErrors.firstName)
                              setLeadErrors({
                                ...leadErrors,
                                firstName: false,
                              });
                          }}
                          className={`w-full text-sm ${
                            leadErrors.firstName
                              ? "border-red-500 bg-[#fddde3] pl-10" // Red style
                              : "border-[#000000] pl-3"
                          }`}
                        />
                      </div>
                      {leadErrors.firstName && (
                        <p className="text-red-600 text-xs mt-1">
                          Complete this field.
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="block text-xs text-[#000000] mb-1">
                        <span className="text-red-600">*</span> Last Name
                      </Label>
                      <div className="relative">
                        {leadErrors.lastName && (
                          <Ban className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600 z-10" />
                        )}
                        <Input
                          placeholder="Last Name"
                          value={leadFormData.lastName}
                          onChange={(e) => {
                            setLeadFormData({
                              ...leadFormData,
                              lastName: e.target.value,
                            });
                            if (leadErrors.lastName)
                              setLeadErrors({ ...leadErrors, lastName: false });
                          }}
                          className={`w-full text-sm ${
                            leadErrors.lastName
                              ? "border-red-500 bg-[#fddde3] pl-10" // Red style
                              : "border-[#000000] pl-3"
                          }`}
                        />
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
                  <Label className="block text-sm text-[#181818] mb-1">
                    <span className="text-red-600">*</span> Company
                  </Label>
                  <div className="relative">
                    {leadErrors.company && (
                      <Ban className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600 z-10" />
                    )}
                    <Input
                      value={leadFormData.company}
                      onChange={(e) => {
                        setLeadFormData({
                          ...leadFormData,
                          company: e.target.value,
                        });
                        if (leadErrors.company)
                          setLeadErrors({ ...leadErrors, company: false });
                      }}
                      className={`w-full text-sm ${
                        leadErrors.company
                          ? "border-red-500 bg-[#fddde3] pl-10" // Red style
                          : "border-[#000000] pl-3"
                      }`}
                    />
                  </div>
                  {leadErrors.company && (
                    <p className="text-red-600 text-xs mt-1">
                      Complete this field.
                    </p>
                  )}
                </div>

                <div>
                  <Label className="block text-sm text-[#181818] mb-1">
                    Title
                  </Label>
                  <Input
                    value={leadFormData.title}
                    onChange={(e) =>
                      setLeadFormData({
                        ...leadFormData,
                        title: e.target.value,
                      })
                    }
                    className="w-full border border-[#000000] rounded px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <Label className="block text-sm text-[#181818] mb-1">
                    Website
                  </Label>
                  <Input
                    value={leadFormData.website}
                    onChange={(e) =>
                      setLeadFormData({
                        ...leadFormData,
                        website: e.target.value,
                      })
                    }
                    className="w-full border border-[#000000] rounded px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <Label className="block text-sm text-[#181818] mb-1">
                    Description
                  </Label>
                  <Textarea
                    value={leadFormData.description}
                    onChange={(e) =>
                      setLeadFormData({
                        ...leadFormData,
                        description: e.target.value,
                      })
                    }
                    className="w-full border border-[#000000] rounded px-3 py-2 text-sm min-h-20"
                  />
                </div>

                <div>
                  <Label className="block text-sm text-[#181818] mb-1">
                    <span className="text-red-600">*</span> Lead Status
                  </Label>
                  <Select
                    value={leadFormData.status || "New"}
                    onValueChange={(value) => {
                      setLeadFormData({ ...leadFormData, status: value });
                      if (leadErrors.status)
                        setLeadErrors({ ...leadErrors, status: false });
                    }}
                  >
                    <SelectTrigger
                      className={`w-full border text-sm ${
                        leadErrors.status
                          ? "border-red-500 bg-[#fddde3]"
                          : "border-[#000000]"
                      }`}
                    >
                      <SelectValue placeholder="--None--" />
                    </SelectTrigger>
                    <SelectContent>
                      {leadStatusOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {leadErrors.status && (
                    <p className="text-red-600 text-xs mt-1">
                      Complete this field.
                    </p>
                  )}
                </div>

                <div>
                  <Label className="block text-sm text-[#181818]">
                    Lead Owner
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

            <div>
              <h3 className="text-xl font-normal text-gray-800 bg-[#f3f2f2] px-4 py-1 -mx-7 mb-4 rounded-lg">
                Get in Touch
              </h3>
              <div className="space-y-4">
                
                <div>
                  <Label className="block text-sm text-[#181818] mb-1">
                    Phone
                  </Label>
                  <Input
                    value={leadFormData.phone}
                    onChange={(e) =>
                      setLeadFormData({
                        ...leadFormData,
                        phone: e.target.value,
                      })
                    }
                    className="w-full border border-[#000000] rounded px-3 py-2 text-sm"
                  />
                </div>
                
                <div>
                  <Label className="block text-sm text-[#181818] mb-1">
                    <span className="text-red-600">*</span> Email
                  </Label>
                  <div className="relative">
                    {leadErrors.email && (
                      <Ban className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600 z-10" />
                    )}
                    <Input
                      type="email"
                      value={leadFormData.email}
                      onChange={(e) => {
                        setLeadFormData({
                          ...leadFormData,
                          email: e.target.value,
                        });
                        if (leadErrors.email)
                          setLeadErrors({ ...leadErrors, email: false });
                      }}
                      className={`w-full text-sm ${
                        leadErrors.email
                          ? "border-red-500 bg-[#fddde3] pl-10"
                          : "border-[#000000] pl-3"
                      }`}
                    />
                  </div>
                  {leadErrors.email && (
                    <p className="text-red-600 text-xs mt-1">
                      Complete this field.
                    </p>
                  )}
                </div>
                
                <div>
                  <Label className="block text-xs text-[#000000] mb-1">
                    Country
                  </Label>
                  <Select
                    value={leadFormData.country}
                    onValueChange={(value) =>
                      setLeadFormData({ ...leadFormData, country: value })
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
                    Street
                  </Label>
                  <Textarea
                    value={leadFormData.street}
                    onChange={(e) =>
                      setLeadFormData({
                        ...leadFormData,
                        street: e.target.value,
                      })
                    }
                    className="w-full border border-[#000000] rounded px-3 py-2 text-sm min-h-[60px]"
                  />
                </div>
                
                <div>
                  <Label className="block text-xs text-[#000000] mb-1">
                    City
                  </Label>
                  <Input
                    value={leadFormData.city}
                    onChange={(e) =>
                      setLeadFormData({ ...leadFormData, city: e.target.value })
                    }
                    className="w-full border border-[#000000] rounded px-3 py-2 text-sm"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                  
                  <div className="col-span-2">
                    <Label className="block text-xs text-[#000000] mb-1">
                      Zip/Postal Code
                    </Label>
                    <Input
                      value={leadFormData.zipPostalCode}
                      onChange={(e) =>
                        setLeadFormData({
                          ...leadFormData,
                          zipPostalCode: e.target.value,
                        })
                      }
                      className="w-full border border-[#000000] rounded px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <Label className="block text-xs text-[#000000] mb-1">
                      State/Province
                    </Label>
                    <Select
                      value={leadFormData.stateProvince}
                      onValueChange={(value) =>
                        setLeadFormData({
                          ...leadFormData,
                          stateProvince: value,
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
                </div>{" "}
                
              </div>
            </div>

            <div>
              <h3 className="text-xl font-normal text-gray-800 bg-[#f3f2f2] px-4 py-1 -mx-7 mb-4 rounded-lg">
                Segment
              </h3>
              
              <div className="space-y-4">
                
                <div>
                  <Label className="block text-sm text-[#181818] mb-1">
                    No. of Employees
                  </Label>
                  <Input
                    type="number"
                    value={leadFormData.numberOfEmployees}
                    onChange={(e) =>
                      setLeadFormData({
                        ...leadFormData,
                        numberOfEmployees: e.target.value,
                      })
                    }
                    className="w-full border border-[#000000] rounded px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <Label className="block text-sm text-[#181818] mb-1">
                    Annual Revenue
                  </Label>
                  <Input
                    type="number"
                    value={leadFormData.annualRevenue}
                    onChange={(e) =>
                      setLeadFormData({
                        ...leadFormData,
                        annualRevenue: e.target.value,
                      })
                    }
                    className="w-full border border-[#000000] rounded px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <Label className="block text-sm text-[#181818] mb-1">
                    Lead Source
                  </Label>
                  <Select
                    value={leadFormData.leadSource}
                    onValueChange={(value) =>
                      setLeadFormData({ ...leadFormData, leadSource: value })
                    }
                  >
                    <SelectTrigger className="w-full border-[#000000] text-sm">
                      <SelectValue placeholder="--None--" />
                    </SelectTrigger>
                    <SelectContent>
                      {leadSourceOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="block text-sm text-[#181818] mb-1">
                    Industry
                  </Label>
                  <Select
                    value={leadFormData.industry}
                    onValueChange={(value) =>
                      setLeadFormData({ ...leadFormData, industry: value })
                    }
                  >
                    <SelectTrigger className="w-full border-[#000000] text-sm">
                      <SelectValue placeholder="--None--" />
                    </SelectTrigger>
                    <SelectContent>
                      {industryOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-gray-400 flex-row justify-end gap-3">
          <Button
            onClick={onClose}
            className="bg-white text-[#066afe] hover:bg-gray-50 border border-black h-9 px-4 text-sm rounded-3xl"
            disabled={isSaving}
          >
            Cancel
          </Button>
          {!isEditMode && (
            <Button
              onClick={onSaveAndNew}
              className="bg-white text-[#066afe] hover:bg-gray-50 border border-black h-9 px-4 text-sm rounded-3xl"
              disabled={isSaving}
            >
              Save & New
            </Button>
          )}
          <Button
            onClick={onSave}
            className="bg-[#066afe] text-white hover:bg-[#066afe] h-9 px-4 text-sm rounded-3xl"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
