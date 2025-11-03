import React from "react";
import { RefreshCw } from "lucide-react";

interface SearchResultItem {
  id: number;
  name: string;
}

interface SearchResultListProps {
  isLoading: boolean;
  results: SearchResultItem[];
  onSelect: (item: SearchResultItem) => void;
  noResultsMessage?: string;
}

export const SearchResultList: React.FC<SearchResultListProps> = ({
  isLoading,
  results,
  onSelect,
  noResultsMessage = "No results found.",
}) => {
  if (isLoading) {
    return (
      <div className="border border-[#000000] rounded p-4 min-h-[120px] bg-[#f3f2f2] flex items-center justify-center">
        <RefreshCw className="w-5 h-5 animate-spin text-gray-500" />
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="border border-[#000000] rounded p-4 min-h-[120px] bg-[#f3f2f2]">
        <p className="text-sm text-[#706e6b]">{noResultsMessage}</p>
      </div>
    );
  }

  return (
    <div className="border border-[#000000] rounded min-h-[120px] bg-white max-h-48 overflow-y-auto">
      <ul className="divide-y divide-gray-200">
        {results.map((item) => (
          <li
            key={item.id}
            onClick={() => onSelect(item)}
            className="p-3 hover:bg-gray-100 cursor-pointer text-sm"
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
