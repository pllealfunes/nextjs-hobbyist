"use client";

import Image from "next/image";

export default function postCards() {
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

  return (
    <div>
      <div className="flex flex-wrap justify-center items-center">
        {cards.map((card) => (
          <div
            key={card.id}
            className="m-3 h-96 w-80 overflow-hidden rounded-lg"
            role="article"
          >
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
    </div>
  );
}
