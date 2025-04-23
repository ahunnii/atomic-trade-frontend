import Footer from "~/components/layout/footer";
import { NavBar } from "~/components/layout/navbar";
import { HydrateClient } from "~/trpc/server";

export default async function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col">
        <NavBar />
        {children}
        <Footer />
      </main>
    </HydrateClient>
  );
}
