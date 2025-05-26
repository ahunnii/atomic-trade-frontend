import type { Address } from "~/lib/validators/geocoding";
import { api } from "~/trpc/server";
import { AddressForm } from "~/app/(site)/account/info/_components/address-form";

import AddressLayout from "../../../_components/address-layout";

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
    <AddressLayout isCreate={false}>
      <AddressForm address={address as Address} />
    </AddressLayout>
  );
}
