import { FC } from 'react';

interface LoadingSpinnerProps {
    fullPage?: boolean;
    size?: 'small' | 'medium' | 'large';
}

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({ fullPage = false, size = 'medium' }) => {
    const sizes = {
        small: 'w-4 h-4 border-2',
        medium: 'w-6 h-6 border-2',
        large: 'w-8 h-8 border-4'
    };

    const spinner = (
        <div className={`${sizes[size]} border-indigo-600 border-t-transparent rounded-full animate-spin`}></div>
    );

    if (fullPage) {
        return (
            <div className="flex justify-center items-center p-8">
                {spinner}
            </div>
        );
    }

    return spinner;
};
