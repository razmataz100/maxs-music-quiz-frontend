import { FC } from 'react';

interface StatusMessageProps {
    type: 'error' | 'success';
    message: string | null;
}

export const StatusMessage: FC<StatusMessageProps> = ({ type, message }) => {
    if (!message) return null;

    const styles = {
        error: "text-red-500 p-3 bg-red-50 rounded-md mb-4",
        success: "text-green-600 p-3 bg-green-50 rounded-md mb-4"
    };

    return <div className={styles[type]}>{message}</div>;
};
