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
];

export default function Home() {
  return (
    <div className="bg-zinc-50">
      <header className="absolute inset-x-0 top-0 z-50">
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
            </div>
          </div>
          <div className="flex gap-x-6 items-center">
            <Link href="#" className="font-semibold leading-6 text-gray-900">
              Explore
            </Link>
            <Link
              href="#"
              className="font-semibold leading-6 text-white bg-rose-300 px-4 py-2 rounded-md shadow-xl shadow-inner"
            >
              Login
            </Link>
            <Link href="#" className="font-semibold leading-6 text-gray-900">
              Signup
            </Link>
          </div>
        </nav>
      </header>

      <section className="relative isolate px-6 lg:px-8">
        <div className="mx-auto py-32 sm:py-48 lg:py-56 text-center">
          <h1 className="text-6xl font-bold tracking-tight text-rose-300 sm:text-7xl">
            Hobbyist
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Blog, Explore, and Discover New Passions
          </p>

          <div className="mt-12">
            <div className="flex flex-row flex-wrap justify-center items-center">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="relative h-96 w-80 m-4 overflow-hidden flex-shrink-0 rounded-lg shadow-2xl"
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

      <section></section>
    </div>
  );
}
