import ContactsContent from "@/components/sales/contacts-content";
import { ChevronDown, Pencil } from "lucide-react";

export default function ContactsRoute() {
  return (
    <div className="h-full flex flex-col bg-[#f3f2f2]">
      <div className="bg-white border-b border-[#dddbda] shrink-0">
        <div className="flex items-center justify-between px-6 pt-3">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-normal text-[#181818]">Contacts</h1>
            <div className="flex gap-4">
              <button className="text-[#0176d3] border-b-[3px] border-[#0176d3] pb-2 font-normal rounded-t-sm flex items-center gap-1">
                Contacts
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
          <Pencil className="w-5 h-5 text-[#0176d3] cursor-pointer hover:-translate-y-0.5 transition-all duration-150" />
        </div>
      </div>
      <ContactsContent />
    </div>
  );
}
