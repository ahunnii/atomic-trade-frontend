import Link from "next/link";
import Footer from "~/components/layout/footer";

import { NavBar } from "~/components/layout/navbar";
import { Button } from "~/components/ui/button";
import { env } from "~/env";
import { HydrateClient } from "~/trpc/server";

export const metadata = {
  title: "404 Not Found",
};

export default async function NotFoundPage() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col">
        <NavBar />
        <div className="mx-auto flex h-full w-full max-w-7xl flex-grow flex-col items-stretch p-8">
          <div className="centered-page my-auto">
            <div className="text-center">
              <h1 className="mb-2 text-3xl font-bold">404 Not Found</h1>
              <h2 className="mx-auto mb-4 max-w-4xl text-xl text-gray-600">
                It appears that this page does not exist. If you believe this is
                an this is an error, please contact us.
              </h2>
              <Link href="/contact-us">
                <Button>Contact Us</Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </HydrateClient>
  );
}
