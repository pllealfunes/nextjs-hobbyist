import DashboardPosts from "@/ui/components/dashboard-posts";
import UserProfile from "@/ui/components/userprofile";

export default async function Profile() {
  return (
    <div>
      <UserProfile />
      {/* Posts Section */}
      <section className="mt-14">
        <DashboardPosts />
      </section>
    </div>
  );
}
