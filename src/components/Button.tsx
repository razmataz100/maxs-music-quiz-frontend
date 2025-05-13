import { FC, ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'green';
    isLoading?: boolean;
    loadingText?: string;
    children: ReactNode;
}

export const Button: FC<ButtonProps> = ({
                                            variant = 'primary',
                                            isLoading = false,
                                            loadingText,
                                            children,
                                            className = '',
                                            ...props
                                        }) => {
    const variants = {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-400 cursor-pointer",
        secondary: "border border-gray-300 hover:bg-gray-100 cursor-pointer",
        green: "bg-emerald-500 text-white hover:bg-emerald-600 disabled:bg-gray-400 cursor-pointer"
    };

    return (
        <button
            className={`px-4 py-2 rounded-md transition-colors ${variants[variant]} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && loadingText ? loadingText : children}
        </button>
    );
};
