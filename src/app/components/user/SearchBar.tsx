import React, { useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
  large?: boolean;
}

export function SearchBar({ placeholder = "Search doctors, tests, medicines...", onSearch, className = "", large = false }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleClear = () => {
    setQuery("");
    onSearch?.("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <div className={`relative ${className}`}>
      <Search className={`absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7C7B] ${large ? "w-5 h-5" : "w-4 h-4"}`} />
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full bg-white border border-[#E6F0EE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FAF9A] focus:border-transparent transition-all text-[#1C2B2A] placeholder:text-[#6B7C7B]/60 ${
          large ? "pl-12 pr-10 py-4 text-base" : "pl-10 pr-8 py-3 text-sm"
        }`}
      />
      {query && (
        <button onClick={handleClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7C7B] hover:text-[#1FAF9A] transition-colors">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
