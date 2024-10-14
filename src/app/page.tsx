"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CarouselPlugin } from "@/ui/components/carousel-plugin";
import Nav from "@/ui/components/nav";
import Footer from "@/ui/components/footer";
import {
  MoveRight,
  Dumbbell,
  Palette,
  Brain,
  Utensils,
  Music,
  Box,
  Puzzle,
  NotebookPen,
  Search,
  MessagesSquare,
} from "lucide-react";

// Sample cards with data from JSONPlaceholder API
const cards = [
  {
    id: 1,
    title: "How to Boost Your Conversion Rate",
    date: "March 16, 2020",
    user: {
      name: "Michael Foster",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    backgroundImage: "https://picsum.photos/200/300", // Use a valid image URL
  },
  {
    id: 2,
    title: "10 Tips for Successful Blogging",
    date: "April 10, 2021",
    user: {
      name: "Sarah Johnson",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    backgroundImage: "https://picsum.photos/200/300", // Use a valid image URL
  },
  {
    id: 3,
    title: "Understanding the Basics of Marketing",
    date: "May 25, 2022",
    user: {
      name: "John Doe",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    backgroundImage: "https://picsum.photos/200/300", // Use a valid image URL
  },

  {
    id: 4,
    title: "Bird Watching for Beginners",
    date: "Sept 25, 2024",
    user: {
      name: "Tina Fey",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    backgroundImage: "https://picsum.photos/200/300", // Use a valid image URL
  },
];

const categories = [
  { name: "Physical", icon: <Dumbbell className="w-5 h-5" /> },
  { name: "Creative", icon: <Palette className="w-5 h-5" /> },
  { name: "Mental", icon: <Brain className="w-5 h-5" /> },
  { name: "Food", icon: <Utensils className="w-5 h-5" /> },
  { name: "Musical", icon: <Music className="w-5 h-5" /> },
  { name: "Collecting", icon: <Box className="w-5 h-5" /> },
  { name: "Games + Puzzles", icon: <Puzzle className="w-5 h-5" /> },
];

// Sample cards with data from JSONPlaceholder API
const features = [
  {
    id: 1,
    name: "Blog About Your Passions",
    description:
      "Share your Tips, Tricks, To Dos, How-To&apos;s, How Do I&apos;s? and I think I Got It&apos;s.",
    icon: <NotebookPen />,
  },
  {
    id: 2,
    name: "Discover New Hobbies",
    description:
      "Explore more about what you love. In the process, you might just find a new love or even an old one.",
    icon: <Search />,
  },
  {
    id: 3,
    name: "Connect with Communities",
    description:
      "Discover categroies and users that fuel your passions, and follow each others journey for inspiration.",
    icon: <MessagesSquare />,
  },
];

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger the fade-up animation after a short delay
    setTimeout(() => {
      setIsVisible(true);
    }, 500); // Delay before the animation starts (500ms)
  }, []);

  return (
    <div>
      <Nav />
      <section className="relative isolate px-6 lg:px-8 bg-zinc-50">
        <div className="mx-auto py-32 sm:py-48 lg:py-48 flex flex-col justify-evenly items-center">
          <p
            className="text-6xl font-semibold text-gray-600 text-center"
            role="heading"
            aria-level={1}
          >
            Blog. Explore. Discover.
          </p>
          <div className="mt-28 hidden xl:flex flex-wrap justify-center items-center">
            {cards.map((card, index) => (
              <div
                key={card.id}
                className={`relative h-96 w-80 overflow-hidden rounded-lg shadow-lg shadow-rose-300 transition-all duration-700 ease-in-out transform ${
                  isVisible
                    ? `opacity-100 translate-y-0 rotate-0`
                    : `opacity-0 translate-y-8 rotate-6`
                }`}
                style={{
                  transitionDelay: `${index * 300}ms`,
                  transform: `translateY(${
                    index % 2 === 0 ? "-20px" : "20px"
                  }) rotate(${index % 2 === 0 ? "-5deg" : "5deg"})`,
                }}
                role="article"
              >
                <div className="absolute inset-0 bg-black opacity-30 z-10" />
                <div
                  className="bg-cover bg-center h-full w-full flex flex-col justify-end p-4"
                  style={{ backgroundImage: `url(${card.backgroundImage})` }}
                  aria-label={`Background image for ${card.title}`}
                >
                  <div className="relative z-20 flex flex-col">
                    <div className="flex items-center justify-between mt-2">
                      <p
                        className="text-white font-semibold mr-2"
                        aria-label={`Published on ${card.date}`}
                      >
                        {card.date}
                      </p>
                      <div className="flex items-center">
                        <Image
                          src={card.user.image}
                          alt={card.user.name}
                          height={24}
                          width={24}
                          className="h-6 w-6 rounded-full mr-2"
                        />
                        <span className="text-white font-semibold">
                          {card.user.name}
                        </span>
                      </div>
                    </div>
                    <h2
                      className="mt-2 text-lg font-bold text-white text-left"
                      aria-label={card.title}
                    >
                      {card.title}
                    </h2>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Slideshow for Mobile (Visible on Mobile Only) */}
          <div className="flex justify-center mt-10 w-full sm:block xl:hidden">
            <CarouselPlugin cards={cards} />
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-rose-100 to-rose-500 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2
            className="text-center text-3xl font-bold tracking-tight text-gray-900"
            role="heading"
            aria-level={2}
          >
            Explore Categories and Discover Content Tailored to Your Interests
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.name}
                className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 px-4 rounded-full shadow-md flex items-center gap-2 transition duration-300"
                aria-label={`Explore ${category.name} category`}
              >
                {category.icon}
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-50 py-24 sm:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 xl:gap-32 items-center">
            {/* Text Section */}
            <div>
              <h2 className="text-base font-semibold leading-7 text-rose-500">
                Share and Discover with Ease
              </h2>
              <p
                className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
                role="heading"
                aria-level={2}
              >
                Everything You Need to Bring Your Hobbies and Passions to the
                World.
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Whether you&apos;re sharing your expertise or exploring new
                ideas, our platform empowers you to blog effortlessly. Discover
                new hobbies, connect with like-minded individuals, and ignite
                your passions—all in one place.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative flex items-start">
                    <div className="text-rose-300 flex-shrink-0 flex items-center justify-center mt-1">
                      {feature.icon}
                    </div>
                    <div className="ml-4">
                      <dt className="font-semibold text-rose-500">
                        {feature.name}
                      </dt>
                      <dd className="mt-2 text-gray-600">
                        {feature.description}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>

            {/* Image Section */}
            <div className="flex justify-center">
              <CarouselPlugin cards={cards} />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-rose-100 to-rose-500 p-24 sm:p-32 flex justify-center items-center">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            role="heading"
            aria-level={2}
          >
            Unlock Your Creativity.
            <br />
            Start exploring and sharing today.
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-900">
            Share your passions, discover new ideas, and connect with a
            community that inspires growth. Start creating and exploring content
            that matters to you.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
            <Link
              href="/signup"
              className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300"
              aria-label="Get started with Hobbyist"
            >
              Get started
            </Link>
            <Link
              href="/about"
              className="font-bold leading-6 text-gray-900 flex justify-center items-center"
              aria-label="Learn more about Hobbyist"
            >
              Learn more
              <span aria-hidden="true" className="m-1">
                <MoveRight className="w-5 h-5 align-middle" />
              </span>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
