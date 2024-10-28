import DashboardPosts from "@/ui/components/dashboard-posts";
import { Input } from "@/ui/components/input";
import { Label } from "@/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/components/select";

export default function Explore() {
  return (
    <>
      <section>
        <div className="light:bg-zinc-50 min-h-screen">
          {/* Title Section */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-2">
              Explore
            </h2>
            <div className="h-1 w-1/4 bg-rose-500 mx-auto mb-6"></div>
            <p className="text-center light:text-gray-600 text-lg mb-6">
              Discover Content Tailored to Your Interests and Passions.
            </p>
          </div>

          {/* Form Section */}
          <div className="mb-6 flex justify-center items-center gap-2">
            <Label htmlFor="search" className="sr-only">
              Search posts
            </Label>
            <Input
              id="search"
              type="text"
              placeholder="Search posts..."
              className="md:w-1/3 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Label htmlFor="filter" className="sr-only">
              Filter posts
            </Label>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest"></SelectItem>
                <SelectItem value="collecting">Collecting</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="games+puzzles">Games+Puzzles</SelectItem>
                <SelectItem value="mental">Mental</SelectItem>
                <SelectItem value="musical">Musical</SelectItem>
                <SelectItem value="physical">Physical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Posts Section */}
          <DashboardPosts />
        </div>
      </section>
    </>
  );
}
