import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

import { AddressForm } from "~/app/(site)/account/info/_components/address-form";

import { Button } from "~/components/ui/button";

import type { Address } from "~/lib/validators/geocoding";

import { api } from "~/trpc/server";

export const metadata = {
  title: "Edit Address",
};

type Props = {
  params: Promise<{ addressId: string }>;
};

export default async function AccountInfoPage({ params }: Props) {
  const { addressId } = await params;
  const address = await api.address.get(addressId);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-10 text-center text-4xl font-bold tracking-wider uppercase">
        Edit Address
      </h1>

      <div className="mx-auto max-w-7xl rounded-lg border border-gray-100 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between pb-8">
          <div className="flex gap-8">
            <Link
              href="/account/info"
              className="after:bg-primary relative flex items-center gap-2 text-xl font-semibold after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:transition-all after:duration-300 hover:after:w-full"
            >
              <ArrowLeftIcon className="h-6 w-6" />
              Back to Account Information
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

        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-8">
          <AddressForm address={address as Address} />
        </div>
      </div>
    </div>
  );
}
