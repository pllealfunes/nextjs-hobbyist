import Link from "next/link";
import Image from "next/image";

export default function Nav() {
  return (
    <div>
      <header className="bg-zinc-50">
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-6 lg:px-8"
        >
          <div className="flex lg:flex-1">
            <div className="flex justify-center items-center">
              <Link
                href="/"
                className="-m-1.5 p-1.5"
                aria-label="Go to homepage"
              >
                <span className="sr-only">Hobbyist</span>
                <Image
                  alt="Logo"
                  src="/images/feather.svg"
                  height={36}
                  width={36}
                  className="h-9 w-auto"
                />
              </Link>
              <p
                className="text-rose-300 m-2 text-2xl font-semibold"
                aria-hidden="true"
              >
                Hobbyist
              </p>
            </div>
          </div>
          <div className="flex gap-x-6 items-center">
            <Link
              href="#"
              className="font-semibold leading-6 text-gray-900"
              aria-label="Explore content"
            >
              Explore
            </Link>
            <Link
              href="#"
              className="bg-rose-500 shadow-rose-300 hover:bg-rose-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300 leading-6 shadow-rose-300 shadow-lg"
              aria-label="Login to your account"
            >
              Login
            </Link>
            <Link
              href="#"
              className="font-semibold leading-6 text-gray-900"
              aria-label="Sign up for an account"
            >
              Signup
            </Link>
          </div>
        </nav>
      </header>
    </div>
  );
}
