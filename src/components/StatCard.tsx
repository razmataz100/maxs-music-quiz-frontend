import { FC } from 'react';

interface StatCardProps {
    title: string;
    value: number | string;
}

export const StatCard: FC<StatCardProps> = ({ title, value }) => {
    return (
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
            <p className="text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    );
};
