import Link from "next/link";

import { cn } from "~/lib/utils";
import { api } from "~/trpc/server";
import { buttonVariants } from "~/components/ui/button";

import { AccountLayout } from "../_components/account-layout";
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
    <AccountLayout>
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
    </AccountLayout>
  );
}
