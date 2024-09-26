"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

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
    title: "Brd Watching for Beginners",
    date: "Sept 25, 2024",
    user: {
      name: "Tina Fey",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    backgroundImage: "https://picsum.photos/200/300", // Use a valid image URL
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
                <img
                  alt="Logo"
                  src="/images/feather.svg"
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
                          <img
                            src={card.user.image}
                            alt={card.user.name}
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

      <section className="relative isolate px-6 lg:px-8 bg-rose-300">
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
                          <img
                            src={card.user.image}
                            alt={card.user.name}
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

      <footer className="bg-zinc-50">
        <div className="w-full mx-auto p-4 md:py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="flex justify-center items-center">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Hobbyist</span>
                <img
                  alt="Logo"
                  src="/images/feather.svg"
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
