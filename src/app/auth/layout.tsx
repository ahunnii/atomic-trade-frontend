/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

import { env } from "~/env";
import { api, HydrateClient } from "~/trpc/server";
import DynamicImage from "./_components/dynamic-image";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const year = new Date().getFullYear();
  const storeBranding = await api.store.getBrand();

  return (
    <>
      <main className="flex min-h-screen flex-col">
        <div className="mx-auto h-full w-full max-w-7xl">
          <div className="relative flex h-16 items-center px-4 pt-4 sm:px-6 lg:px-8">
            <Link href="/" className="ml-4 flex gap-x-2 lg:ml-0">
              <img
                className="block h-16 w-auto lg:hidden"
                src={
                  storeBranding?.logo
                    ? `${env.NEXT_PUBLIC_STORAGE_URL}/misc/${storeBranding.logo}`
                    : "/logo-at.png"
                }
                alt="Logo"
              />
              <img
                className="hidden h-16 w-auto lg:block"
                src={
                  storeBranding?.logo
                    ? `${env.NEXT_PUBLIC_STORAGE_URL}/misc/${storeBranding.logo}`
                    : "/logo-at.png"
                }
                alt="Logo"
              />
            </Link>
          </div>
        </div>
        <div className="mx-auto flex h-full w-full max-w-7xl flex-grow flex-col items-stretch p-8">
          <div className="my-auto flex h-full w-full items-center gap-5 max-md:flex-col-reverse">
            <div className="justify-left flex lg:w-7/12">
              <div className="bg-background w-full max-w-lg rounded p-4">
                {children}
              </div>
            </div>
            <div className="flex justify-end px-4 lg:w-5/12">
              <DynamicImage />
            </div>
          </div>
        </div>
        <div className="mx-auto w-full max-w-7xl">
          <footer className="mt-16">
            <div className="mx-auto py-10">
              <p className="text-sm text-black">
                &copy; {year} {storeBranding?.name ?? "Atomic Trade"}. All
                rights reserved.
              </p>
            </div>
          </footer>{" "}
        </div>
      </main>
    </>
  );
}
