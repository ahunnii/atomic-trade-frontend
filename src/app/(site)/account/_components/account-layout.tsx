"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";

export function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const isOrderActive = () => {
    return pathname.startsWith("/account/orders");
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-10 text-center text-4xl font-bold tracking-wider uppercase">
        Account
      </h1>

      <div className="mx-auto max-w-7xl rounded-lg border border-gray-100 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between pb-8">
          <div className="flex gap-8">
            <Link
              href="/account/info"
              className={cn(
                "after:bg-primary relative text-xl font-semibold after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:transition-all after:duration-300",
                isActive("/account/info") && "after:w-full",
                !isActive("/account/info") && "hover:after:w-full",
              )}
            >
              Account Information
            </Link>
            <Link
              href="/account/orders"
              className={cn(
                "after:bg-primary relative text-xl font-semibold after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:transition-all after:duration-300",
                isActive("/account/orders") && "after:w-full",
                isOrderActive() && "after:w-full",
                !isActive("/account/orders") && "hover:after:w-full",
              )}
            >
              Orders
            </Link>
          </div>
          <div className="flex gap-4">
            <form action="/api/auth/signout" method="post">
              <Button
                type="submit"
                variant="outline"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign Out
              </Button>
            </form>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
