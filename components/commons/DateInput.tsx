'use client';
import { memo } from "react";

interface DateInputProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DateInput: React.FC<DateInputProps> = memo(({ label, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium mb-2">
            {label}
        </label>
        <input
            type="date" value={value} onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
    </div>
));

DateInput.displayName = "DateInput";

export default DateInput;