"use client";

import * as React from "react";
import Image from "next/image";

export default function DashboardPosts() {
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
      title: "Understanding the Basics of Marketing",
      date: "May 25, 2022",
      user: {
        name: "John Doe",
        image: "https://randomuser.me/api/portraits/women/2.jpg",
      },
      backgroundImage: "https://picsum.photos/200/300", // Use a valid image URL
    },
    {
      id: 5,
      title: "Bird Watching for Beginners",
      date: "Sept 25, 2024",
      user: {
        name: "Tina Fey",
        image: "https://randomuser.me/api/portraits/men/3.jpg",
      },
      backgroundImage: "https://picsum.photos/200/300", // Use a valid image URL
    },
    {
      id: 6,
      title: "Bird Watching for Beginners",
      date: "Sept 25, 2024",
      user: {
        name: "Tina Fey",
        image: "https://randomuser.me/api/portraits/women/3.jpg",
      },
      backgroundImage: "https://picsum.photos/200/300", // Use a valid image URL
    },
    {
      id: 7,
      title: "Bird Watching for Beginners",
      date: "Sept 25, 2024",
      user: {
        name: "Tina Fey",
        image: "https://randomuser.me/api/portraits/men/4.jpg",
      },
      backgroundImage: "https://picsum.photos/200/300", // Use a valid image URL
    },
    {
      id: 8,
      title: "Bird Watching for Beginners",
      date: "Sept 25, 2024",
      user: {
        name: "Tina Fey",
        image: "https://randomuser.me/api/portraits/women/4.jpg",
      },
      backgroundImage: "https://picsum.photos/200/300", // Use a valid image URL
    },
    {
      id: 9,
      title: "Bird Watching for Beginners",
      date: "Sept 25, 2024",
      user: {
        name: "Tina Fey",
        image: "https://randomuser.me/api/portraits/men/5.jpg",
      },
      backgroundImage: "https://picsum.photos/200/300", // Use a valid image URL
    },
    {
      id: 10,
      title: "Bird Watching for Beginners",
      date: "Sept 25, 2024",
      user: {
        name: "Tina Fey",
        image: "https://randomuser.me/api/portraits/women/5.jpg",
      },
      backgroundImage: "https://picsum.photos/200/300", // Use a valid image URL
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 p-6">
      {cards.map((card) => (
        <div
          key={card.id}
          className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 duration-300"
        >
          {/* Card Image */}
          <div className="relative">
            <Image
              src={card.backgroundImage}
              alt={card.title}
              width={200}
              height={200}
              className="w-full h-64 object-cover rounded-t-lg"
            />
          </div>

          {/* Card Content */}
          <div className="p-5">
            {/* Date and Tag */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>{card.date}</span>
              <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-xs">
                Creative
              </span>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-xl text-gray-900 mb-3">
              {card.title}
            </h3>

            {/* Description */}
            <p className="text-gray-700 text-sm mb-6">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, non!
            </p>

            {/* User Info and Like Section */}
            <div className="flex items-center justify-between">
              {/* User Info */}
              <div className="flex items-center gap-3">
                <Image
                  src={card.user.image}
                  alt={card.user.name}
                  height={40}
                  width={40}
                  className="h-10 w-10 rounded-full"
                />
                <p className="text-gray-800 font-semibold">{card.user.name}</p>
              </div>

              {/* Like Section */}
              <div className="flex items-center gap-1 text-red-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
                <span className="text-gray-600 text-sm">50</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
