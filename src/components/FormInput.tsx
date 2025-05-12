import { ChangeEvent, FC } from 'react';

interface FormInputProps {
    id: string;
    label: string;
    type: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
}

export const FormInput: FC<FormInputProps> = ({
                                                  id,
                                                  label,
                                                  type,
                                                  value,
                                                  onChange,
                                                  placeholder,
                                                  disabled = false,
                                                  required = false
                                              }) => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                id={id}
                name={id}  // Important! This must match the property name in formData
                type={type}
                value={value}
                onChange={onChange}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder={placeholder}
                disabled={disabled}
                autoComplete="off"
                required={required}
            />
        </div>
    );
};

