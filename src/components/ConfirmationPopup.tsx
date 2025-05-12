// src/components/ConfirmationPopup.tsx
import React from 'react';

interface ConfirmationPopupProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmButtonColor?: string;
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({
    isOpen,
    title,
    message,
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
    confirmButtonColor = "bg-red-500 hover:bg-red-600"
    }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-4">
                <h3 className="text-xl font-bold mb-4 text-gray-800">{title}</h3>
                <p className="mb-6 text-gray-600">{message}</p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-white rounded-md transition-colors cursor-pointer ${confirmButtonColor}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationPopup;
