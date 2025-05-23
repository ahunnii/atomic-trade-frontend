import Image from "next/image";
import React from "react";
import { env } from "~/env";

const CallToActionSection: React.FC<{
  callToActionTitle?: string | null;
  callToActionSubtitle?: string | null;
  callToActionButtonText?: string | null;
  callToActionButtonLink?: string | null;
  callToActionImage?: string | null;
}> = (props) => {
  return (
    <section className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-4 py-16 md:flex-row">
      {/* Left: Image */}
      <div className="flex flex-1 justify-center">
        <div className="relative h-[450px] w-[350px] md:h-[500px] md:w-[400px]">
          <Image
            src={
              props?.callToActionImage
                ? `${env.NEXT_PUBLIC_STORAGE_URL}/misc/${props.callToActionImage}`
                : "https://images.unsplash.com/photo-1483982258113-b72862e6cff6?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            } // Replace with your actual image path
            alt="Atomic Trade"
            fill
            className="rounded-lg object-cover shadow-md"
            priority
          />
        </div>
      </div>
      {/* Right: Info */}
      <div className="flex max-w-xl flex-1 flex-col items-center">
        <h2 className="mb-6 text-center text-4xl font-extrabold text-black">
          {props?.callToActionTitle ?? "THE ATOMIC TRADE DIFFERENCE"}
        </h2>
        <p className="mb-4 text-center text-lg text-gray-700">
          {props?.callToActionSubtitle ??
            "Every exchange empowers creators, regenerates communities, and builds a future beyond extraction."}
        </p>
        <a
          href={props?.callToActionButtonLink ?? "/collections"}
          className="mb-6 inline-block rounded bg-black px-8 py-3 text-base font-semibold tracking-wider text-white shadow transition-colors hover:bg-gray-900"
        >
          {props?.callToActionButtonText ?? "SHOP OUR COLLECTIONS"}
        </a>
        <div className="flex gap-8 text-center text-base text-black">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-black"></span>
            Free US Shipping
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-black"></span>
            Free Returns
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
