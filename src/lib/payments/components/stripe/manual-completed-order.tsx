import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import type Stripe from "stripe";
import { formatCurrency } from "~/lib/utils";
import { db } from "~/server/db";
import { api } from "~/trpc/server";
import { stripeClient } from "../../clients/stripe";

export const ManualCompletedOrder = async ({
  orderId,
  backToAccount = false,
}: {
  orderId: string;
  backToAccount?: boolean;
}) => {
  let errorMessage = "";

  let order = null;

  try {
    order = await db.order.findFirst({
      where: { id: orderId },
      include: {
        fulfillment: true,
        payments: true,
        orderItems: true,
        customer: true,
        shippingAddress: true,
        billingAddress: true,
      },
    });
  } catch (error) {
    errorMessage =
      "There was an error processing your payment. Please try again.";
  }

  if (!order) {
    return (
      <div className="mx-auto mt-10 max-w-2xl rounded-xl border bg-red-50 p-8 shadow-lg">
        <h2 className="mb-4 text-2xl font-semibold text-red-700">
          Order Not Found
        </h2>
        <p className="text-red-600">
          The order you are looking for does not exist.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-10 max-w-5xl px-2 md:px-0">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          {backToAccount && (
            <Link
              href="/account/orders"
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
            </Link>
          )}
          <div>
            <h1 className="text-2xl font-bold">Order {order?.orderNumber}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Confirmed {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <Link
            href="/"
            className="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Back to home
          </Link>
        </div>
      </div>

      {/* Info Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Order Status Card */}
        <div className="flex flex-col gap-2 rounded-lg border bg-white p-5">
          <span className="text-xs font-semibold text-gray-500">
            Order Status
          </span>
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
            <span className="font-medium text-green-700">Confirmed</span>
          </div>
          <span className="text-xs text-gray-400">
            Your order was placed successfully.
          </span>
        </div>
        {/* Shipment Status Card */}
        <div className="flex flex-col gap-2 rounded-lg border bg-white p-5">
          <span className="text-xs font-semibold text-gray-500">Shipment</span>
          <div className="flex items-center gap-2">
            {/* <span className="material-icons text-base text-gray-500">
              local_shipping
            </span> */}
            <span className="font-medium text-gray-700">
              {order?.fulfillment?.status === "PENDING"
                ? "Preparing for shipment"
                : order?.fulfillment?.status === "FULFILLED"
                  ? "Shipped"
                  : order?.fulfillment?.status === "RESTOCKED"
                    ? "Restocked"
                    : order?.fulfillment?.status === "CANCELLED"
                      ? "Cancelled"
                      : "Unfulfilled"}
            </span>
          </div>
          <span className="text-xs text-gray-400">
            We will notify you when your order ships.
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left: Info Cards */}
        <div className="space-y-4 md:col-span-2">
          {/* Contact & Shipping/Billing Info */}
          <div className="grid grid-cols-1 gap-6 rounded-lg border bg-white p-5 md:grid-cols-2">
            {/* Contact Info & Shipping Address */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">
                Contact information
              </h3>
              <div className="mb-4 text-sm text-gray-700">
                {order?.customer?.email}
              </div>
              <h3 className="mb-2 text-sm font-semibold">Shipping address</h3>
              {order?.shippingAddress && (
                <div className="space-y-1 text-sm text-gray-700">
                  <div>
                    {order?.shippingAddress.firstName}{" "}
                    {order?.shippingAddress.lastName}
                  </div>
                  <div>{order?.shippingAddress.street}</div>
                  {order?.shippingAddress.additional && (
                    <div>{order?.shippingAddress.additional}</div>
                  )}
                  <div>
                    {order?.shippingAddress.city},{" "}
                    {order?.shippingAddress.state}
                    {order?.shippingAddress.postalCode}
                  </div>
                  <div>{order?.shippingAddress.country}</div>
                </div>
              )}
              <h3 className="mt-4 mb-2 text-sm font-semibold">
                Shipping method
              </h3>
              <div className="text-sm text-gray-700">Standard Shipping</div>
            </div>
            {/* Billing Address */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">Billing address</h3>
              {order?.billingAddress && (
                <div className="space-y-1 text-sm text-gray-700">
                  <div>
                    {order?.billingAddress.firstName}{" "}
                    {order?.billingAddress.lastName}
                  </div>
                  <div>{order?.billingAddress.street}</div>
                  {order?.billingAddress.additional && (
                    <div>{order?.billingAddress.additional}</div>
                  )}
                  <div>
                    {order?.billingAddress.city}, {order?.billingAddress.state}{" "}
                    {order?.billingAddress.postalCode}
                  </div>
                  <div>{order?.billingAddress.country}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Order Summary Card */}
        <div className="h-fit space-y-4 rounded-lg border bg-white p-5">
          <h3 className="mb-3 text-lg font-semibold">Order Summary</h3>
          <div className="divide-y divide-gray-200">
            {order?.orderItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-4">
                {/* Placeholder for product image */}
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-200 text-xs font-bold text-gray-400">
                  {item.description?.charAt(0) ?? "?"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-medium text-gray-900">
                    {item.description}
                    <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                      x{item.quantity}
                    </span>
                  </div>
                </div>
                <div className="text-base font-semibold text-gray-800">
                  {formatCurrency(item.totalPriceInCents * item.quantity)}
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(order?.totalInCents ?? 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>{formatCurrency(order?.shippingInCents ?? 0)}</span>
            </div>
            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span>{formatCurrency(order?.totalInCents ?? 0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
