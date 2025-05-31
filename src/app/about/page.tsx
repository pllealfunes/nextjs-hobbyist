import Nav from "@/ui/components/nav";
import Footer from "@/ui/components/footer";
import Link from "next/link";
import Image from "next/image";
import {
  Dumbbell,
  Palette,
  Brain,
  Utensils,
  Music,
  Box,
  Puzzle,
  Heart,
  Leaf,
  GraduationCap,
  Code2,
  ListChecks,
  Sparkles,
  Compass,
  Hand,
} from "lucide-react";

const categories = [
  { name: "Physical", icon: <Dumbbell className="w-5 h-5" /> },
  { name: "Creative", icon: <Palette className="w-5 h-5" /> },
  { name: "Nature", icon: <Leaf className="w-5 h-5" /> },
  { name: "Mental", icon: <Brain className="w-5 h-5" /> },
  { name: "Musical", icon: <Music className="w-5 h-5" /> },
  { name: "Collecting", icon: <Box className="w-5 h-5" /> },
  { name: "Games + Puzzles", icon: <Puzzle className="w-5 h-5" /> },
  { name: "Food", icon: <Utensils className="w-5 h-5" /> },
  { name: "Lifestyle", icon: <Heart className="w-5 h-5" /> },
  { name: "Education", icon: <GraduationCap className="w-5 h-5" /> },
];

export default function About() {
  return (
    <div>
      <Nav />
      {/* Banner photo section */}
      <div className="relative w-full h-64 bg-gray-200 bg-black opacity-50">
        <Image
          src="/images/hobbyist_mern.jpg"
          alt="Banner"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>
      <div className="max-w-4xl mx-auto p-4 py-24">
        <section className="mb-6">
          <h1 className="text-3xl text-rose-300 font-semibold flex items-center gap-2">
            <Hand className="w-7 h-7" />
            Welcome to Hobbyist!
          </h1>
          <p>
            Weclome to the latest version of Hobbyist! While the previous
            version was built using the MERN stack this version uses new
            technologies and includes more fetaures for users to enjoy.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl text-rose-300 font-semibold flex items-center gap-2">
            <Code2 className="w-5 h-5" /> Technologies Used:
          </h2>
          <ul className="list-disc ml-5">
            <li>Next.js</li>
            <li>TypeScript</li>
            <li>Shadcn</li>
            <li>Zod</li>
            <li>TipTap Text Editor</li>
            <li>Supabase</li>
            <li>Vercel</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl text-rose-300 font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Features Preview:
          </h2>

          <ul className="list-disc ml-5">
            <li>More categories to choose from!</li>
            <li>User profiles</li>
            <li>Ability to follow users and categories</li>
            <li>Personalized feeds</li>
            <li>Improved search</li>
            <li>User to User chat</li>
            <li>Improved UI/UX</li>
            <li>Responsive layout for all devices</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl text-rose-300 font-semibold flex items-center gap-2">
            <ListChecks className="w-5 h-5" />
            Categories:
          </h2>
          <p>
            The list of categories has been expanded in this project and
            includes the following for users to choose from.
          </p>
          <ul className="list-disc ml-5 py-2 px-4">
            {categories.map((category) => (
              <li key={category.name} className="flex items-center gap-2 py-1">
                <Link
                  href={`/category/${category.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  <div className="flex items-center gap-2">
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl text-rose-300 font-semibold flex items-center gap-2">
            <Compass className="w-5 h-5" />
            Direction
          </h2>
          <p>
            As I continue to develop this project the list of features and/or
            technologies will increase. I aim to expand its capabilities,
            ensuring a seamless and engaging experience for users. Follow the
            project by visiting the GitHub repo!
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
}
