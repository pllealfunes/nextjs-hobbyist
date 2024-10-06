import Footer from "@/ui/components/footer";
import Image from "next/image";
import Link from "next/link";

export default function Dashboard() {
  const navigation = [
    { name: "Dashboard", href: "#", current: true },
    { name: "Team", href: "#", current: false },
    { name: "Projects", href: "#", current: false },
    { name: "Calendar", href: "#", current: false },
  ];

  function classNames(
    ...classes: (string | undefined | null | boolean)[]
  ): string {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <>
      <section className="bg-zinc-50 w-full">
        <h1>Hello</h1>
      </section>
      <Footer />
    </>
  );
}
