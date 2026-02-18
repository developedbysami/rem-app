"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import {
  getCountries,
  getCountryCallingCode,
} from "react-phone-number-input/input";

const countryNames = new Intl.DisplayNames(["en"], { type: "region" });

export const countries = getCountries()
  .map((country) => ({
    code: `+${getCountryCallingCode(country)}`,
    iso: country,
    name: countryNames.of(country) || country,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

interface CountrySelectorProps {
  selectedCountry: typeof countries[0];
  onSelect: (country: typeof countries[0]) => void;
}

export default function CountrySelector({
  selectedCountry,
  onSelect,
}: CountrySelectorProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.includes(searchQuery) ||
      c.iso.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center justify-between gap-2 px-4 py-3 border-r border-slate-200 bg-white min-w-[120px]"
      >
        <span className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">{selectedCountry.iso}</span>
          <span>{selectedCountry.code}</span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isDropdownOpen && (
        <div className="absolute left-0 w-[300px] mt-2 bg-white rounded-xl shadow-2xl border z-50 overflow-hidden">
          <div className="p-3 border-b">
            <div className="relative">
              <input
                autoFocus
                type="text"
                placeholder="Search countries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-8 py-2 border rounded-md text-sm"
              />
              <Search className="absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="max-h-[200px] overflow-y-auto">
            {filteredCountries.map((c, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onSelect(c);
                  setIsDropdownOpen(false);
                  setSearchQuery("");
                }}
                className="w-full text-left px-4 py-3 hover:bg-sky-50 text-sm flex justify-between"
              >
                <span>
                  {c.iso} {c.code}
                </span>
                <span className="text-gray-500 truncate ml-2">
                  {c.name}
                </span>
              </button>
            ))}

            {filteredCountries.length === 0 && (
              <div className="px-4 py-6 text-sm text-gray-500 text-center">
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
