import React from 'react';
import { Controller } from 'react-hook-form';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import CountrySelector from './CountrySelector';
import flags from 'react-phone-number-input/flags';

const PhoneInputField = ({ name, control, errors, label = "Phone Number " }) => {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
       <span className="text-red-500">*</span>

      </label>
    
  
<Controller
  name={name}
  control={control}
  render={({ field: { onChange, value } }) => (
    <div className={`flex items-center border rounded-lg bg-white transition-all ${
      errors[name] ? 'border-red-500 ring-2 ring-red-50' : 'border-slate-200 focus-within:border-sky-400'
    }`}>
      <PhoneInput
        value={value || ""} 
        onChange={(val) => onChange(val || "")} 
        defaultCountry="AE"
        international={false} 
        // flags={flags}
        displayInitialValueAsLocalNumber 
        countrySelectComponent={CountrySelector}
        inputComponent={CustomInput}
        placeholder="e.g., 1234567890"
        className="flex-1 "
      />
    </div>
  )}
/>

      {errors[name] && (
        <p className="text-[10px] text-red-500 font-medium pl-1 italic">
          {errors[name].message}
        </p>
      )}
    </div>
  );
};

// Internal sub-component to style the actual number input field
const CustomInput = React.forwardRef((props, ref) => (
  <input
    {...props}
    ref={ref}
    className="w-full px-3 py-2.5 text-sm text-gray-900 bg-transparent border-none outline-none placeholder:text-gray-400 font-medium"
  />
));

export default PhoneInputField;