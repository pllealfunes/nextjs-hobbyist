import Link from "next/link";
import { PencilLine } from "lucide-react";

export default function Footer() {
  return (
    <footer className="light:bg-zinc-50">
      <div className="w-full mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex justify-center items-center">
            <Link
              href="/"
              className="-m-1.5 p-1.5 flex justify-center items-center"
              aria-label="Go to homepage"
            >
              <span className="sr-only">Hobbyist</span>
              <PencilLine className="light:text-gray-900" />
              <span className="ml-2 text-xl font-bold text-rose-300">
                Hobbyist
              </span>
            </Link>
          </div>
          <ul className="mt-3 flex flex-wrap justify-center text-sm font-medium light:text-gray-900 sm:mt-0">
            <li className="mx-2 hover:underline">
              <Link href="/about" aria-label="About">
                About
              </Link>
            </li>
            <li className="mx-2 hover:underline">
              <Link
                href="https://github.com/pllealfunes/nextjs-hobbyist"
                aria-label="GitHub"
              >
                GitHub
              </Link>
            </li>
          </ul>
        </div>
        <div className="mt-4 text-center text-sm light:text-gray-600">
          © {new Date().getFullYear()} Hobbyist. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
