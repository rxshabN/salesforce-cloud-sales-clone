"use client";

import { useState } from "react";
import { ChevronDown, Edit } from "lucide-react";
import LeadsContent from "@/components/sales/leads-content";
import ContactsContent from "@/components/sales/contacts-content";
import AccountsContent from "@/components/sales/accounts-content";
import OpportunitiesContent from "@/components/sales/opportunities-content";

export type SalesTab =
  | "leads"
  | "contacts"
  | "accounts"
  | "opportunities"
  | "products"
  | "price-books"
  | "calendar"
  | "analytics";

export default function SalesPage() {
  const [activeTab, setActiveTab] = useState<SalesTab>("leads");

  const tabs = [
    { id: "leads" as SalesTab, label: "Leads" },
    { id: "contacts" as SalesTab, label: "Contacts" },
    { id: "accounts" as SalesTab, label: "Accounts" },
    { id: "opportunities" as SalesTab, label: "Opportunities" },
    { id: "products" as SalesTab, label: "Products" },
    { id: "price-books" as SalesTab, label: "Price Books" },
    { id: "calendar" as SalesTab, label: "Calendar" },
    { id: "analytics" as SalesTab, label: "Analytics" },
  ];

  return (
    <div className="h-full flex flex-col bg-[#f3f2f2]">
      
      <div className="bg-white border-b border-gray-200 px-8 py-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-normal text-[#080707]">Sales</h1>

            <div className="flex items-center gap-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 pb-3 font-normal transition-colors relative ${
                    activeTab === tab.id
                      ? "text-[#0176d3]"
                      : "text-gray-700 hover:text-[#0176d3]"
                  }`}
                >
                  {tab.label}
                  <ChevronDown className="w-4 h-4" />
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0176d3]" />
                  )}
                </button>
              ))}
            </div>
          </div>
          <button className="text-gray-600 hover:text-[#0176d3] transition-colors">
            <Edit className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === "leads" && <LeadsContent />}
        {activeTab === "contacts" && <ContactsContent />}
        {activeTab === "accounts" && <AccountsContent />}
        {activeTab === "opportunities" && <OpportunitiesContent />}
        {activeTab === "products" && (
          <div className="p-8 text-center text-gray-600">
            Products content coming soon...
          </div>
        )}
        {activeTab === "price-books" && (
          <div className="p-8 text-center text-gray-600">
            Price Books content coming soon...
          </div>
        )}
        {activeTab === "calendar" && (
          <div className="p-8 text-center text-gray-600">
            Calendar content coming soon...
          </div>
        )}
        {activeTab === "analytics" && (
          <div className="p-8 text-center text-gray-600">
            Analytics content coming soon...
          </div>
        )}
      </div>
    </div>
  );
}
