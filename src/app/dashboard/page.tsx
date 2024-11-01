import { LikesCommentsChart } from "@/ui/components/likescomments-chart";
import RecentStats from "@/ui/components/recent-stats";
import StatCard from "@/ui/components/stat-card";
import { FileText, ThumbsUp, MessageCircle } from "lucide-react";

export default function Feed() {
  return (
    <section className="p-8 min-h-screen">
      <div className="flex items-center justify-between p-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      <div className="grid grid-cols-3 gap-3 my-3">
        <StatCard
          title="Total Posts This Month"
          value="150"
          description="+10% from last month"
          icon={<FileText size={24} />}
        />
        <StatCard
          title="Total Likes This Month"
          value="4,500"
          description="+25% from last month"
          icon={<ThumbsUp size={24} />}
        />
        <StatCard
          title="Total Comments Received This Month"
          value="1,200"
          description="+30% from last month"
          icon={<MessageCircle size={24} />}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2">
        <LikesCommentsChart />
        <RecentStats />
      </div>
    </section>
  );
}
