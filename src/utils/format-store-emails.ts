import { env } from "~/env";

export const formatNoRespondEmail = (storeName: string) => {
  const hostname = env.NEXT_PUBLIC_HOSTNAME.replace(/^https?:\/\//, "");

  if (!hostname) {
    throw new Error("Hostname is not set");
  }

  return `${storeName} <no-reply@${hostname}>`;
};

export const formatSupportEmail = (storeName: string) => {
  const hostname = env.NEXT_PUBLIC_HOSTNAME.replace(/^https?:\/\//, "");

  if (!hostname) {
    throw new Error("Hostname is not set");
  }

  return `${storeName} Support <support@${hostname}>`;
};
