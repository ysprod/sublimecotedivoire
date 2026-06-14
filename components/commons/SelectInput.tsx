'use client';
import { FaChevronDown } from "react-icons/fa";
import React, { memo } from "react";

interface SelectInputProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    disabled?: boolean;
    options: { value: string; label: string }[];
    placeholder: string;
}

const SelectInput: React.FC<SelectInputProps> = memo((
    { label, value, onChange, disabled = false, options, placeholder }) => (
    <div className="mb-6">
        <label className="block text-sm font-medium text-gray-800 mb-2">{label}</label>

        <div className="relative">
            <select
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
            >
                <option value="">{placeholder}</option>

                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            <FaChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
        </div>

    </div>
));

SelectInput.displayName = "SelectInput";

export default SelectInput;