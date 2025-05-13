import { ShoppingBagIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Footer from "~/components/layout/footer";
import { NavBar } from "~/components/layout/navbar";
import { buttonVariants } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import { HydrateClient } from "~/trpc/server";

type Props = {
  children: React.ReactNode;
};
export default async function SiteLayout({ children }: Props) {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col">
        <div className="mx-auto my-4 flex w-full max-w-7xl items-center justify-between px-4">
          <Image src="/logo-at.png" alt="logo" width={100} height={100} />
          <Link
            href="/cart"
            className={cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "border-primary/20 hover:bg-primary/10 relative rounded-full border-2 p-4 transition-all hover:shadow-md",
            )}
            aria-label="View cart"
          >
            <ShoppingBagIcon className="text-primary h-16 w-16" />
          </Link>
        </div>
        <Separator />
        {children}
        <footer className="border-t border-gray-400/25 px-4 py-12">
          {/* Bottom Section */}
          <div className="mx-auto max-w-7xl border-gray-400">
            <div className="flex flex-col items-center justify-between md:flex-row">
              <p className="text-sm text-gray-400">
                © 2024 Atomic Trade. All rights reserved.
              </p>
              <div className="mt-4 md:mt-0">
                <button className="text-sm text-gray-400 hover:text-white">
                  USD $ ▼
                </button>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </HydrateClient>
  );
}
