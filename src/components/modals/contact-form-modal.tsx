"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Search, AlertCircle } from "lucide-react";

export interface ContactFormData {
  salutation: string;
  firstName: string;
  lastName: string;
  accountName: string;
  title: string;
  reportsTo: string;
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
  onClose: () => void;
  onSave: () => Promise<void>;
  onSaveAndNew: () => Promise<void>;
  contactFormData: ContactFormData;
  setContactFormData: (data: ContactFormData) => void;
  contactErrors: Record<string, boolean>;
  setContactErrors: (errors: Record<string, boolean>) => void;
  modalTitle?: string;
  showSaveAndNew?: boolean;
}

export default function ContactFormModal({
  isOpen,
  onClose,
  onSave,
  onSaveAndNew,
  contactFormData,
  setContactFormData,
  contactErrors,
  setContactErrors,
  modalTitle = "New Contact",
  showSaveAndNew = true,
}: ContactFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-2xl mx-4">
        {/* Close Button - Outside modal, top right */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-150 shadow-lg"
        >
          <X className="w-5 h-5 text-[#706e6b]" />
        </button>

        {/* Modal Content */}
        <div className="bg-white rounded-lg shadow-2xl max-h-[80vh] flex flex-col">
          <div className="px-6 py-4 border-b border-[#dddbda] flex items-center justify-between">
            <h2 className="text-xl font-normal text-[#181818] flex-1 text-center">
              {modalTitle}
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
                        value={contactFormData.salutation}
                        onChange={(e) =>
                          setContactFormData({
                            ...contactFormData,
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
                          className={`w-full rounded px-3 py-2 text-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 ${
                            contactErrors.firstName
                              ? "border-2 border-red-600 pr-10"
                              : "border border-[#dddbda]"
                          }`}
                        />
                        {contactErrors.firstName && (
                          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                        )}
                      </div>
                      {contactErrors.firstName && (
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
                  <Input
                    value={contactFormData.title}
                    onChange={(e) =>
                      setContactFormData({
                        ...contactFormData,
                        title: e.target.value,
                      })
                    }
                    className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                  />
                </div>

                {/* Reports To with Search */}
                <div>
                  <label className="block text-sm text-[#181818] mb-1">
                    Reports To
                  </label>
                  <div className="relative">
                    <Input
                      placeholder="Search Contacts..."
                      value={contactFormData.reportsTo}
                      onChange={(e) =>
                        setContactFormData({
                          ...contactFormData,
                          reportsTo: e.target.value,
                        })
                      }
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
                    value={contactFormData.description}
                    onChange={(e) =>
                      setContactFormData({
                        ...contactFormData,
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
                    value={contactFormData.phone}
                    onChange={(e) =>
                      setContactFormData({
                        ...contactFormData,
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
                      className={`w-full rounded px-3 py-2 text-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 ${
                        contactErrors.email
                          ? "border-2 border-red-600 pr-10"
                          : "border border-[#dddbda]"
                      }`}
                    />
                    {contactErrors.email && (
                      <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                    )}
                  </div>
                  {contactErrors.email && (
                    <p className="text-red-600 text-xs mt-1">
                      Complete this field.
                    </p>
                  )}
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
                      <select
                        value={contactFormData.mailingCountry}
                        onChange={(e) =>
                          setContactFormData({
                            ...contactFormData,
                            mailingCountry: e.target.value,
                          })
                        }
                        className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm text-[#181818] hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                      >
                        <option value="">--None--</option>
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-[#706e6b] mb-1">
                        Mailing Street
                      </label>
                      <textarea
                        value={contactFormData.mailingStreet}
                        onChange={(e) =>
                          setContactFormData({
                            ...contactFormData,
                            mailingStreet: e.target.value,
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
                        Mailing City
                      </label>
                      <Input
                        value={contactFormData.mailingCity}
                        onChange={(e) =>
                          setContactFormData({
                            ...contactFormData,
                            mailingCity: e.target.value,
                          })
                        }
                        className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-[#706e6b] mb-1">
                          Mailing Zip/Postal Code
                        </label>
                        <Input
                          value={contactFormData.mailingZipPostalCode}
                          onChange={(e) =>
                            setContactFormData({
                              ...contactFormData,
                              mailingZipPostalCode: e.target.value,
                            })
                          }
                          className="w-full border border-[#dddbda] rounded px-3 py-2 text-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#706e6b] mb-1">
                          Mailing State/Province
                        </label>
                        <select
                          value={contactFormData.mailingStateProvince}
                          onChange={(e) =>
                            setContactFormData({
                              ...contactFormData,
                              mailingStateProvince: e.target.value,
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
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-[#dddbda] flex items-center justify-end gap-3">
            <Button
              onClick={onClose}
              className="bg-white text-[#0176d3] hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 border border-[#dddbda] h-9 px-4 text-sm rounded"
            >
              Cancel
            </Button>
            {showSaveAndNew && (
              <Button
                onClick={onSaveAndNew}
                className="bg-white text-[#0176d3] hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 border border-[#dddbda] h-9 px-4 text-sm rounded"
              >
                Save & New
              </Button>
            )}
            <Button
              onClick={onSave}
              className="bg-[#0176d3] text-white hover:bg-[#0159a8] hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 h-9 px-4 text-sm rounded"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
