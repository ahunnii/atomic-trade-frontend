import { LinkAuthenticationElement } from "@stripe/react-stripe-js";
import React from "react";

export const LinkAuth = ({ email }: { email?: string }) => {
  return (
    <>
      <h3 className="text-lg font-bold">Contact</h3>
      <LinkAuthenticationElement
        options={email ? { defaultValues: { email } } : {}}
      />
    </>
  );
};
