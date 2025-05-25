import type { OutputData } from "@editorjs/editorjs";
import Link from "next/link";

import { NotFound } from "~/app/_components/not-found";
import { MarkdownView } from "~/components/shared/markdown-view";
import { Button, buttonVariants } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { cn } from "~/lib/utils";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";

export const metadata = {
  title: "Account Information",
};

export default async function AccountInfoPage() {
  const orders = await api.order.getAll();
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
              className="after:bg-primary relative text-xl font-semibold after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:transition-all after:duration-300 hover:after:w-full"
            >
              Account Information
            </Link>
            <Link
              href="/account/orders"
              className="after:bg-primary relative text-xl font-semibold after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-full after:transition-all after:duration-300"
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
        {orders.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order #{order.orderNumber}
                    </p>
                    <p className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                    {order.status}
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <p className="font-medium">${order.totalInCents / 100}</p>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                    )}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <p className="text-2xl font-bold">No orders yet, shop now!</p>
            <Button>Shop Now</Button>
          </div>
        )}
      </div>
    </div>
  );
}
