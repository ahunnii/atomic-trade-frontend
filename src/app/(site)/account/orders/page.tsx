import Link from "next/link";

import { cn } from "~/lib/utils";
import { api } from "~/trpc/server";
import { Button, buttonVariants } from "~/components/ui/button";

import { AccountLayout } from "../_components/account-layout";

export const metadata = {
  title: "My Orders",
};

export default async function AccountOrdersPage() {
  const orders = await api.order.getAll();
  return (
    <AccountLayout>
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
    </AccountLayout>
  );
}
