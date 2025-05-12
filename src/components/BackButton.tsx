import { FC, MouseEvent } from 'react';

interface BackButtonProps {
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

const BackButton: FC<BackButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="absolute right-0 px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center cursor-pointer"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
            <span className="ml-1 hidden sm:inline">Back</span>
        </button>
    );
};

export default BackButton;
