import { Heart, AtSign, MessageSquare, UserPlus } from "lucide-react";

const recentInteractions = [
  {
    name: "TechGuru23",
    action: "Liked",
    detail: "Your post 'Mastering Next.js'",
    icon: <Heart size={24} />,
    timestamp: "2 hours ago",
  },
  {
    name: "PixelPioneer",
    action: "Commented",
    detail: "Great insights on your article!",
    icon: <MessageSquare size={24} />,
    timestamp: "3 hours ago",
  },
  {
    name: "CodeCraftsman",
    action: "Followed",
    detail: "started following you",
    icon: <UserPlus size={24} />,
    timestamp: "5 hours ago",
  },
  {
    name: "TypeScriptQueen",
    action: "Mentioned",
    detail: "tagged you in a post about TypeScript tips",
    icon: <AtSign size={24} />,
    timestamp: "8 hours ago",
  },
  {
    name: "UIWizard",
    action: "Liked",
    detail: "Your tutorial on 'Building UI with Shadcn'",
    icon: <Heart size={24} />,
    timestamp: "1 day ago",
  },
  {
    name: "LifeisCode",
    action: "Liked",
    detail: "How ChatGpt Can Help You Be a Better Programmer'",
    icon: <Heart size={24} />,
    timestamp: "1 day ago",
  },
];
const RecentStats = () => {
  return (
    <div className="p-6 bg-white dark:bg-transparent rounded-lg shadow dark:border dark:border-gray-600">
      <h2 className="text-lg font-semibold">Recent Stats</h2>
      <p className="text-sm light:text-gray-500 mb-4">
        Recent interactions on your posts.
      </p>
      <ul>
        {recentInteractions.map((interaction, index) => (
          <li key={index} className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 light:bg-gray-100 rounded-full">
                {interaction.icon}
              </div>
              <div>
                <p className="font-medium">{interaction.name}</p>
                <p className="text-sm light:text-gray-500">
                  {interaction.action} - {interaction.detail}
                </p>
              </div>
            </div>
            <p className="text-xs light:text-gray-400 whitespace-nowrap">
              {interaction.timestamp}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentStats;
