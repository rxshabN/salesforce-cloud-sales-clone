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
import { X, Ban, Search, Calendar } from "lucide-react";
import Image from "next/image";

export interface OpportunityFormData {
  opportunityName: string;
  accountName: string;
  closeDate: string;
  amount: string;
  description: string;
  stage: string;
  probability: string;
  forecastCategory: string;
  nextStep: string;
}

interface OpportunityFormModalProps {
  isOpen: boolean;
  isEditMode: boolean;
  onClose: () => void;
  onSave: () => Promise<void>;
  onSaveAndNew: () => Promise<void>;
  opportunityFormData: OpportunityFormData;
  setOpportunityFormData: (data: OpportunityFormData) => void;
  opportunityErrors: Record<string, boolean>;
  setOpportunityErrors: (errors: Record<string, boolean>) => void;
  isSaving?: boolean;
}

export default function OpportunityFormModal({
  isOpen,
  isEditMode,
  onClose,
  onSave,
  onSaveAndNew,
  opportunityFormData,
  setOpportunityFormData,
  opportunityErrors,
  setOpportunityErrors,
  isSaving,
}: OpportunityFormModalProps) {
  const stageOptions = [
    "--None--",
    "Qualify",
    "Meet & Present",
    "Propose",
    "Negotiate",
    "Closed Won",
    "Closed Lost",
  ];

  const forecastCategoryOptions = [
    "--None--",
    "Omitted",
    "Pipeline",
    "Best Case",
    "Commit",
    "Closed",
  ];

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="overflow-y-auto min-w-4xl max-h-[90vh] flex flex-col p-0 rounded-t-3xl rounded-b-none"
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
              {isEditMode ? "Edit Opportunity" : "New Opportunity"}
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 text-right">
            <p className="text-xs text-[#000000]">
              <span className="text-red-500">*</span> = Required Information
            </p>
          </div>
          <div className="px-10 py-4 space-y-6">
            {/* About Section */}
            <div>
              <h3 className="text-xl font-normal text-gray-800 bg-[#f3f2f2] px-4 py-1 -mx-7 mb-4 rounded-lg">
                About
              </h3>
              <div className="space-y-4">
                <div>
                  <Label className="block text-sm text-[#181818] mb-1">
                    <span className="text-red-600">*</span> Opportunity Name
                  </Label>
                  <div className="relative">
                    {opportunityErrors.opportunityName && (
                      <Ban className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600 z-10" />
                    )}
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
                      className={`w-full text-sm ${
                        opportunityErrors.opportunityName
                          ? "border-red-500 bg-[#fddde3] pl-10"
                          : "border-[#000000] pl-3"
                      }`}
                    />
                  </div>
                  {opportunityErrors.opportunityName && (
                    <p className="text-red-600 text-xs mt-1">
                      Complete this field.
                    </p>
                  )}
                </div>
                <div>
                  {/* todo: implement account search with account selection functionality as option within the dropdown itself */}
                  <Label className="block text-sm text-[#181818] mb-1">
                    <span className="text-red-600">*</span> Account Name
                  </Label>
                  <div className="relative">
                    {opportunityErrors.accountName && (
                      <Ban className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600 z-10" />
                    )}
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
                      className={`w-full text-sm pr-10 ${
                        opportunityErrors.accountName
                          ? "border-red-500 bg-[#fddde3] pl-10"
                          : "border-[#000000] pl-3"
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
                  <Label className="block text-sm text-[#181818] mb-1">
                    <span className="text-red-600">*</span> Close Date
                  </Label>
                  <div className="relative">
                    {opportunityErrors.closeDate && (
                      <Ban className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600 z-10" />
                    )}
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
                      className={`hide-calendar-icon w-full text-sm pr-10 ${
                        opportunityErrors.closeDate
                          ? "border-red-500 bg-[#fddde3] pl-10"
                          : "border-[#000000] pl-3"
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
                  <Label className="block text-sm text-[#181818] mb-1">
                    Amount
                  </Label>
                  <Input
                    type="number"
                    value={opportunityFormData.amount}
                    onChange={(e) =>
                      setOpportunityFormData({
                        ...opportunityFormData,
                        amount: e.target.value,
                      })
                    }
                    className="w-full border border-[#000000] rounded px-3 py-2 text-sm"
                  />
                </div>
                {/* Description */}
                <div>
                  <Label className="block text-sm text-[#181818] mb-1">
                    Description
                  </Label>
                  <Textarea
                    value={opportunityFormData.description}
                    onChange={(e) =>
                      setOpportunityFormData({
                        ...opportunityFormData,
                        description: e.target.value,
                      })
                    }
                    className="w-full border border-[#000000] rounded px-3 py-2 text-sm min-h-20"
                  />
                </div>
                <div className="pt-2">
                  <Label className="block text-sm text-[#181818] mb-1">
                    Opportunity Owner
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
            {/* Status Section */}
            <div>
              <h3 className="text-xl font-normal text-gray-800 bg-[#f3f2f2] px-4 py-1 -mx-7 mb-4 rounded-lg">
                Status
              </h3>
              <div className="space-y-4">
                <div>
                  <Label className="block text-sm text-[#181818] mb-1">
                    <span className="text-red-600">*</span> Stage
                  </Label>
                  <Select
                    value={opportunityFormData.stage}
                    onValueChange={(value) => {
                      setOpportunityFormData({
                        ...opportunityFormData,
                        stage: value,
                      });
                      if (opportunityErrors.stage) {
                        setOpportunityErrors({
                          ...opportunityErrors,
                          stage: false,
                        });
                      }
                    }}
                  >
                    <SelectTrigger
                      className={`w-full border text-sm ${
                        opportunityErrors.stage
                          ? "border-red-500 bg-[#fddde3]"
                          : "border-[#000000]"
                      }`}
                    >
                      <SelectValue placeholder="--None--" />
                    </SelectTrigger>
                    <SelectContent>
                      {stageOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {opportunityErrors.stage && (
                    <p className="text-red-600 text-xs mt-1">
                      Complete this field.
                    </p>
                  )}
                </div>
                {/* Probability (%) */}
                <div>
                  <Label className="block text-sm text-[#181818] mb-1">
                    Probability (%)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={opportunityFormData.probability}
                    onChange={(e) =>
                      setOpportunityFormData({
                        ...opportunityFormData,
                        probability: e.target.value,
                      })
                    }
                    className="w-full border border-[#000000] rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <Label className="block text-sm text-[#181818] mb-1">
                    <span className="text-red-600">*</span> Forecast Category
                  </Label>
                  <Select
                    value={opportunityFormData.forecastCategory}
                    onValueChange={(value) => {
                      setOpportunityFormData({
                        ...opportunityFormData,
                        forecastCategory: value,
                      });
                      if (opportunityErrors.forecastCategory) {
                        setOpportunityErrors({
                          ...opportunityErrors,
                          forecastCategory: false,
                        });
                      }
                    }}
                  >
                    <SelectTrigger
                      className={`w-full border text-sm ${
                        opportunityErrors.forecastCategory
                          ? "border-red-500 bg-[#fddde3]"
                          : "border-[#000000]"
                      }`}
                    >
                      <SelectValue placeholder="--None--" />
                    </SelectTrigger>
                    <SelectContent>
                      {forecastCategoryOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {opportunityErrors.forecastCategory && (
                    <p className="text-red-600 text-xs mt-1">
                      Complete this field.
                    </p>
                  )}
                </div>
                {/* Next Step */}
                <div>
                  <Label className="block text-sm text-[#181818] mb-1">
                    Next Step
                  </Label>
                  <Input
                    value={opportunityFormData.nextStep}
                    onChange={(e) =>
                      setOpportunityFormData({
                        ...opportunityFormData,
                        nextStep: e.target.value,
                      })
                    }
                    className="w-full border border-[#000000] rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="px-6 py-4 border-t border-gray-400 flex-row justify-end gap-3">
          <Button
            onClick={onClose}
            className="bg-white text-[#066afe] hover:bg-gray-50 border border-black h-9 px-4 text-sm rounded-4xl"
            disabled={isSaving}
          >
            Cancel
          </Button>
          {!isEditMode && (
            <Button
              onClick={onSaveAndNew}
              className="bg-white text-[#066afe] hover:bg-gray-50 border border-black h-9 px-4 text-sm rounded-4xl"
              disabled={isSaving}
            >
              Save & New
            </Button>
          )}
          <Button
            onClick={onSave}
            className="bg-[#066afe] text-white hover:bg-[#066afe] h-9 px-4 text-sm rounded-4xl"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
