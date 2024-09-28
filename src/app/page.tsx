"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

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
      <header className="absolute inset-x-0 top-0 z-50 bg-zinc-50">
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-6 lg:px-8"
        >
          <div className="flex lg:flex-1">
            <div className="flex justify-center items-center">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Hobbyist</span>
                <Image
                  alt="Logo"
                  src="/images/feather.svg"
                  height={36}
                  width={36}
                  className="h-9 w-auto"
                />
              </Link>
              <p className="text-rose-300 m-2 text-2xl font-semibold">
                Hobbyist
              </p>
            </div>
          </div>
          <div className="flex gap-x-6 items-center">
            <Link href="#" className="font-semibold leading-6 text-gray-900">
              Explore
            </Link>
            <Link
              href="#"
              className="font-semibold leading-6 text-white bg-rose-300 px-4 py-2 rounded-md shadow-xl"
            >
              Login
            </Link>
            <Link href="#" className="font-semibold leading-6 text-gray-900">
              Signup
            </Link>
          </div>
        </nav>
      </header>

      <section className="relative isolate px-6 lg:px-8 bg-zinc-50">
        <div className="mx-auto py-32 sm:py-48 lg:py-48 flex flex-col justify-evenly items-center">
          <p className="text-6xl font-semibold text-gray-600">
            Blog. Explore. Discover.
          </p>
          <div className="mt-28">
            <div className="flex flex-row flex-wrap justify-center items-center">
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
                >
                  <div className="absolute inset-0 bg-black opacity-30 z-10" />
                  <div
                    className="bg-cover bg-center h-full w-full flex flex-col justify-end p-4"
                    style={{ backgroundImage: `url(${card.backgroundImage})` }}
                  >
                    <div className="relative z-20 flex flex-col">
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-white font-semibold mr-2">
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
                      <h2 className="mt-2 text-lg font-bold text-white text-left">
                        {card.title}
                      </h2>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Everything You Need to Bring Your Hobbies and Passions to the
                World.
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Whether you're sharing your expertise or exploring new ideas,
                our platform empowers you to blog effortlessly. Discover new
                hobbies, connect with like-minded individuals, and ignite your
                passions—all in one place.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative flex items-start">
                    <div className="text-rose-300 flex-shrink-0 h-10 w-10 flex items-center justify-center">
                      <div>{feature.icon}</div>
                    </div>
                    <div className="ml-1">
                      {" "}
                      {/* Adjusted margin for spacing */}
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
            <Image
              src="https://tailwindui.com/img/component-images/dark-project-app-screenshot.png"
              alt="Product screenshot"
              layout="responsive"
              width={1200}
              height={900}
              className="w-full h-auto rounded-xl shadow-xl shadow-rose-300 ring-1 ring-rose-400/10"
            />
          </div>
        </div>
      </section>

      <footer className="bg-zinc-50">
        <div className="w-full mx-auto p-4 md:py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="flex justify-center items-center">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Hobbyist</span>
                <Image
                  alt="Logo"
                  src="/images/feather.svg"
                  width={24}
                  height={24}
                  className="h-6 w-auto"
                />
              </Link>
              <span className="self-center text-2xl font-semibold whitespace-nowrap text-rose-300 m-2">
                Hobbyist
              </span>
            </div>
            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium sm:mb-0 text-gray-900">
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">
                  GitHub Repo
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">
                  Login
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Logout
                </a>
              </li>
            </ul>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <span className="block text-sm text-gray-900 sm:text-center text-gray-900">
            © {new Date().getFullYear()}{" "}
            <a href="https://flowbite.com/" className="hover:underline">
              Hobbyist™
            </a>
            . All Rights Reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}
