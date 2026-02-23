import React, { useState, useRef, useEffect } from 'react';
import { getCountries, getCountryCallingCode } from 'react-phone-number-input';
import en from 'react-phone-number-input/locale/en';
// 1. Import the flags object
import flags from 'react-phone-number-input/flags';

const COUNTRY_LIST = getCountries().map((country) => ({
  code: country,
  name: en[country],
  callingCode: `+${getCountryCallingCode(country)}`,
}));

const CountrySelector = ({ value, onChange }) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = COUNTRY_LIST.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.callingCode.includes(search)
  );

  const selectedCountry = COUNTRY_LIST.find((c) => c.code === value);
  
  // 2. Helper to render the flag component
  const FlagIcon = ({ countryCode }) => {
    const Flag = flags[countryCode];
    return Flag ? <Flag title={countryCode} /> : <span className="w-5 h-3 bg-gray-200" />;
  };

  return (
    <div className="relative h-full" ref={dropdownRef}>
      {/* The Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-l-lg flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 h-full border-r border-slate-200 min-w-[100px]"
      >
        {/* 3. Render Flag in Trigger */}
        <div className="w-5 flex-shrink-0 shadow-sm border border-gray-100 overflow-hidden rounded-sm">
           <FlagIcon countryCode={value || 'AE'} />
        </div>
        <span className="text-gray-900 font-semibold">{selectedCountry?.callingCode || "+971"}</span>
        <svg className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* The Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-[100] mt-2 left-0 w-72 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
          <div className="p-3 bg-white sticky top-0 border-b border-slate-100">
            <input
              type="text"
              placeholder="Search countries..."
              className="w-full px-3 py-2 text-sm border border-sky-400 rounded-lg outline-none ring-4 ring-sky-50 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>

          <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-sky-50/50 transition-colors border-b border-slate-50 last:border-0"
                  onClick={() => {
                    onChange(country.code);
                    setIsOpen(false);
                    setSearch("");
                  }}
                >
                  {/* 4. Render Flag in List */}
                  <div className="w-6 flex-shrink-0 shadow-sm border border-gray-50 overflow-hidden rounded-sm">
                    <FlagIcon countryCode={country.code} />
                  </div>
                  
                  <span className="font-bold text-gray-800 w-12 text-left">{country.callingCode}</span>
                  <span className="text-gray-600 truncate">{country.name}</span>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-gray-400 text-xs">No countries found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelector;