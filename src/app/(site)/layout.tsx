import Footer from "~/components/layout/footer";
import { NavBar } from "~/components/layout/navbar";
import { HydrateClient } from "~/trpc/server";

type Props = {
  children: React.ReactNode;
};
export default async function SiteLayout({ children }: Props) {
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
