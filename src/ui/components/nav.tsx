import Link from "next/link";
import { Feather } from "lucide-react";

export default function Nav() {
  return (
    <header className="bg-zinc-50">
      <nav
        aria-label="Global"
        className="flex items-center justify-between p-4 sm:p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Logo and text */}
            <Link
              href="/"
              className="-m-1.5 p-1.5 hidden sm:inline-block" // Hide logo on mobile, show from small screen
              aria-label="Go to homepage"
            >
              <span className="sr-only">Hobbyist</span>
              <Feather className="w-7 h-7" />
            </Link>
            <Link
              href="/"
              className="text-rose-300 text-2xl sm:text-3xl md:text-2xl lg:text-2xl font-semibold"
              aria-hidden="true"
            >
              Hobbyist
            </Link>
          </div>
        </div>

        {/* Navigation links */}
        <div className="flex gap-x-4 sm:gap-x-6 items-center">
          <Link
            href="#"
            className="font-semibold leading-6 text-gray-900"
            aria-label="Explore content"
          >
            Explore
          </Link>

          <Link
            href="/login"
            className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 px-3 sm:px-4 rounded-full transition duration-300 leading-6 shadow-rose-300 shadow-lg"
            aria-label="Login to your account"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="hidden sm:block font-semibold leading-6 text-gray-900"
            aria-label="Sign up for an account"
          >
            Signup
          </Link>
        </div>
      </nav>
    </header>
  );
}
