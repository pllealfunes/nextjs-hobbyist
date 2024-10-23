"use client";

import LoginForm from "@/ui/forms/loginForm";
import Nav from "@/ui/components/nav";
import { CarouselPlugin } from "@/ui/components/carousel-plugin";
import Footer from "@/ui/components/footer";

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

export default function LoginPage() {
  return (
    <>
      <Nav />
      <section className="light:bg-zinc-50 py-24 sm:py-32 flex justify-center">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 items-center">
            {/* Image Section */}
            <div className="hidden xl:block">
              <CarouselPlugin cards={cards} />
            </div>

            {/* Form Section */}
            <div className="flex flex-col justify-center">
              <div className="max-w-md mx-auto">
                <h1
                  className="text-3xl font-bold light:text-gray-900 sm:text-4xl mb-4"
                  role="heading"
                  aria-level={2}
                >
                  Login to Start Exploring
                </h1>
                <h2 className="text-base font-semibold leading-7 text-rose-500 mb-6">
                  Share and Discover with Ease
                </h2>
                <LoginForm />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
