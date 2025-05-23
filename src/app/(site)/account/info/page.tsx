import Link from "next/link";

import { Button, buttonVariants } from "~/components/ui/button";

import { cn } from "~/lib/utils";
import { api } from "~/trpc/server";
import { BasicInfoForm } from "./_components/basic-info-form";
import { DeleteAddressButton } from "./_components/delete-address-button";
import { NotificationsForm } from "./_components/notifications-form";
import { ProfileForm } from "./_components/profile-form";

export const metadata = {
  title: "Account Information",
};

export default async function AccountInfoPage() {
  const customerProfile = await api.account.get();

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
              className="after:bg-primary relative text-xl font-semibold after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-full after:transition-all after:duration-300"
            >
              Account Information
            </Link>
            <Link
              href="/account/orders"
              className="after:bg-primary relative text-xl font-semibold after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:transition-all after:duration-300 hover:after:w-full"
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

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <ProfileForm
              initialValues={{
                firstName: customerProfile?.firstName ?? "",
                lastName: customerProfile?.lastName ?? "",
                phone: customerProfile?.phone ?? "",
              }}
              email={customerProfile?.email ?? ""}
            />

            <NotificationsForm
              initialValues={{
                subscribedToEmailPromos:
                  customerProfile?.subscribedToEmailPromos ?? false,
                subscribedToSmsPromos:
                  customerProfile?.subscribedToSmsPromos ?? false,
              }}
            />

            <BasicInfoForm
              initialValues={{
                birthday: customerProfile?.birthday ?? undefined,
                gender: customerProfile?.gender ?? undefined,
              }}
            />
          </div>

          <div className="rounded-lg border border-gray-100 bg-white p-8 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Addresses</h2>
              <Link
                href="/account/info/address/new"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "text-sm",
                )}
              >
                Add New Address
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              {customerProfile?.addresses?.map((address) => (
                <div
                  key={address.id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-4"
                >
                  <div>
                    <p className="font-medium">
                      {address.firstName} {address.lastName}
                      {address.isDefault && (
                        <span
                          className={cn(
                            "bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs",
                            address?.firstName && "ml-2",
                          )}
                        >
                          Default
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">
                      {address.street}, {address.city}, {address.state}{" "}
                      {address.postalCode}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/account/info/address/${address.id}`}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "text-sm",
                      )}
                    >
                      Edit
                    </Link>

                    <DeleteAddressButton addressId={address.id} />
                  </div>
                </div>
              ))}
              {(!customerProfile?.addresses ||
                customerProfile.addresses.length === 0) && (
                <p className="text-center text-gray-500">
                  No addresses saved yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
