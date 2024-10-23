import Nav from "@/ui/components/nav";
import Footer from "@/ui/components/footer";

export default function About() {
  return (
    <div className="light:bg-zinc-50">
      <Nav />
      <div className="max-w-4xl mx-auto p-4 py-24 sm:py-32">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">About This Project</h1>
        </header>

        <section className="mb-6">
          <h2 className="text-rose-300 text-xl font-semibold">
            Welcome to the Latest Version of Hobbyist!
          </h2>
          <p>
            While the previous version was built using the MERN stack this
            version uses modern technologies and includes more fetaures for
            users to enjoy.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold">Technologies Used:</h2>
          <ul className="list-disc ml-5">
            <li>Next.js</li>
            <li>TypeScript</li>
            <li>Shadcn</li>
            <li>Prisma</li>
            <li>Zod</li>
            <li>Postgres</li>
            <li>Vercel</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold">Features Preview:</h2>
          <ul className="list-disc ml-5">
            <li>User profiles</li>
            <li>Ability to follow users and categories</li>
            <li>Personalized feeds</li>
            <li>Enhanced search functionality</li>
            <li>User to User chat</li>
            <li>Improved UI/UX design</li>
            <li>Responsive layout for all devices</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold">What’s Next?</h2>
          <p>
            As I continue to develop this project the list of features and/or
            technologies will increase. I aim to expand its capabilities,
            ensuring a seamless and engaging experience for users. Follow the
            project by visiting the GitHub repo!
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
}
