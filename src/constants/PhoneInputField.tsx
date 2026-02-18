import React from 'react';
import { Controller } from 'react-hook-form';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import CountrySelector from './CountrySelector';

const PhoneInputField = ({ name, control, errors, label = "Phone Number *" }) => {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className={`flex items-center border rounded-lg bg-white overflow-visible transition-all duration-200 ${
            errors[name] 
              ? 'border-red-500 ring-2 ring-red-50' 
              : 'focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-50 border-slate-200'
          }`}>
            <PhoneInput
              {...field}
              international
              defaultCountry="AE"
              placeholder="Enter phone number"
              countrySelectComponent={CountrySelector}
              // This removes default styles and lets our wrapper handle the design
              className="flex-1 px-1 phone-input-container"
              inputComponent={CustomInput}
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