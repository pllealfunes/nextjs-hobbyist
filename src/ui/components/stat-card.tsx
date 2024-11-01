import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
}

const StatCard = ({ title, value, description, icon }: StatCardProps) => {
  return (
    <div className="bg-white dark:bg-transparent p-4 rounded-lg shadow dark:border dark:border-gray-600">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium light:text-gray-900">{title}</h2>
          <p className="text-2xl font-semibold light:text-gray-900">{value}</p>
          <p className="text-xs light:text-gray-500">{description}</p>
        </div>
        <div className="light:text-gray-500">{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;
