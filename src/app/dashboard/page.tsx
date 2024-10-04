import Nav from "@/ui/components/nav";
import Footer from "@/ui/components/footer";

export default function Dashboard() {
  return (
    <>
      <Nav />
      <section className="bg-zinc-50 py-24 sm:py-32 flex justify-center">
        <h1>Dashboard Page</h1>
      </section>
      <Footer />
    </>
  );
}
