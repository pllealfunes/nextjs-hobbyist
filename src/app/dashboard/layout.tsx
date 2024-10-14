import Nav from "@/ui/components/login-nav";
import Footer from "@/ui/components/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="bg-zinc-50 w-full">
      <Nav />
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
      <Footer />
    </section>
  );
}
