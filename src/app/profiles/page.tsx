import { Avatar, AvatarFallback, AvatarImage } from "@/ui/components/avatar";
import DashboardPosts from "@/ui/components/dashboard-posts";
import { Button } from "@/ui/components/button";

export default async function Profile() {
  return (
    <div>
      <section>
        <div className="bg-gradient-to-br from-rose-100 to-rose-500 py-12 sm:py-20 rounded-3xl flex flex-col justify-center items-center gap-8 px-4 sm:px-10">
          {/* Avatar and Name */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-36 h-36 shadow-md">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h2 className="text-4xl font-extrabold tracking-tight text-gray-900">
              Luigi
            </h2>
          </div>

          {/* Bio */}
          <div className="text-center text-lg text-gray-800 max-w-lg">
            Brother. Plumber. Hero. Fear of Ghosts. Loves Green.
          </div>

          {/* Followers, Following, Posts Count */}
          <div className="flex justify-around w-full max-w-md text-center text-sm text-gray-900 font-medium">
            <div className="flex flex-col">
              <span className="font-extrabold text-xl">10</span>
              Posts
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl">120</span>
              Following
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl">300</span>
              Followers
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl">7</span>
              Categories
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-6 mt-6">
            <Button className="bg-rose-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg transition duration-300 ease-in-out shadow-lg transform hover:scale-105">
              Follow
            </Button>
            <Button className="bg-rose-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg transition duration-300 ease-in-out shadow-lg transform hover:scale-105">
              Message
            </Button>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section className="mt-14">
        <DashboardPosts />
      </section>
    </div>
  );
}
