"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CarouselPlugin } from "@/app/carousel";
import Nav from "@/components/ui/nav";
import Footer from "@/components/ui/footer";

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
      image: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    backgroundImage: "https://picsum.photos/200/300", // Use a valid image URL
  },
];

const categories = [
  "Physical",
  "Creative",
  "Mental",
  "Food",
  "Musical",
  "Collecting",
  "Games + Puzzles",
];

// Sample cards with data from JSONPlaceholder API
const features = [
  {
    id: 1,
    name: "Blog About Your Passions",
    description:
      "Share your Tips, Tricks, To Dos, How-To&apos;s, How Do I&apos;s? and I think I Got It&apos;s.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-6"
      >
        <path d="M14.12 2.882a2 2 0 0 1 2.829 0l4.243 4.243a2 2 0 0 1 0 2.829l-1.586 1.586-6.072-6.072 1.586-1.586zM2.793 20.293a1 1 0 0 1 0-1.414l13.586-13.586 1.414 1.414-13.586 13.586a1 1 0 0 1-1.414 0zM16.243 8.05l1.414-1.414 2.828 2.828-1.414 1.414-2.828-2.828z" />
      </svg>
    ),
  },
  {
    id: 2,
    name: "Discover New Hobbies",
    description:
      "Explore more about what you love. In the process, you might just find a new love or even an old one.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-6"
      >
        <path
          fillRule="evenodd"
          d="M10.5 3a7.5 7.5 0 1 0 5.37 12.85l4.4 4.4a1 1 0 0 0 1.42-1.42l-4.4-4.4A7.5 7.5 0 0 0 10.5 3zM10.5 5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    id: 3,
    name: "Connect with Communities",
    description:
      "Discover categroies and users that fuel your passions, and follow each others journey for inspiration.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-6"
      >
        <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z" />
        <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z" />
      </svg>
    ),
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
                key={category}
                className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300"
                aria-label={`Explore ${category} category`}
              >
                {category}
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
                    <div className="text-rose-300 flex-shrink-0 h-10 w-10 flex items-center justify-center">
                      <div>{feature.icon}</div>
                    </div>
                    <div className="ml-1">
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
              className="font-bold leading-6 text-gray-900"
              aria-label="Learn more about Hobbyist"
            >
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
