import { AddressElement } from "@stripe/react-stripe-js";
import React from "react";

export const ShippingAddress = () => {
  return (
    <>
      <h3 className="text-lg font-bold">Shipping</h3>
      <AddressElement options={{ mode: "shipping" }} />
    </>
  );
};
