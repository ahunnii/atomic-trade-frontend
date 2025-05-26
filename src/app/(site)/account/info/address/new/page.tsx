import { AddressForm } from "~/app/(site)/account/info/_components/address-form";

import AddressLayout from "../../../_components/address-layout";

export const metadata = {
  title: "New Address",
};

export default async function NewAddressPage() {
  return (
    <AddressLayout isCreate={true}>
      <AddressForm address={null} />
    </AddressLayout>
  );
}
