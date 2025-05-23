"use client";
import { ChevronRightIcon } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import React from "react";
import { Button, buttonVariants } from "~/components/ui/button";
import { ImagesSlider } from "~/components/ui/custom/image-slider";
import { env } from "~/env";
import { cn } from "~/lib/utils";

export function ImageHero(
  props: {
    heroImages?: string[];
    heroTitle?: string | null;
    heroSubtitle?: string | null;
    heroButtonText?: string | null;
    heroButtonLink?: string | null;
  } | null,
) {
  const images = props?.heroImages?.map(
    (image) => `${env.NEXT_PUBLIC_STORAGE_URL}/misc/${image}`,
  ) ?? [
    "https://images.unsplash.com/photo-1485433592409-9018e83a1f0d?q=80&w=1814&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1483982258113-b72862e6cff6?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1482189349482-3defd547e0e9?q=80&w=2848&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];
  return (
    <ImagesSlider className="h-[40rem]" images={images} autoplay={false}>
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="z-50 flex h-full w-full items-center justify-start gap-y-4"
      >
        {/* Text Block Container */}
        <div className="ml-16 flex w-full max-w-xl flex-col items-start rounded-lg">
          {/* Announcement Banner */}
          <motion.div className="mb-4 flex w-full justify-center">
            <a
              className="inline-flex w-full items-center justify-center gap-x-2 space-x-2 rounded-full border bg-white/10 p-1 ps-3 text-center text-lg font-thin tracking-widest text-white backdrop-blur-sm transition"
              href="#"
            >
              {props?.heroSubtitle ??
                "Limited time offer - 20% off all products"}
              {/* <span className="inline-flex items-center justify-center gap-x-2 rounded-full bg-white/15 px-2.5 py-1.5 text-sm font-semibold">
                <svg
                  className="h-4 w-4 flex-shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg> */}
              {/* </span> */}
            </a>
          </motion.div>

          {/* Title */}
          <motion.h1 className="w-full scroll-m-20 text-center text-6xl font-extrabold tracking-tight text-white lg:text-5xl">
            {props?.heroTitle ?? "Shop the Latest Trends"}
          </motion.h1>

          {/* Buttons */}
          <motion.div className="mt-8 flex w-full justify-start gap-3">
            <Link
              href={props?.heroButtonLink ?? "/"}
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "w-full bg-white text-lg font-semibold tracking-wider text-black hover:bg-white/90",
              )}
            >
              {props?.heroButtonText ?? "Shop Now"}
            </Link>
            {/* <Button
              size={"lg"}
              variant={"outline"}
              className="border-white bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              View Collections
            </Button> */}
          </motion.div>

          {/* Rating
          <motion.div className="mt-5 flex w-full items-center justify-start gap-x-1 text-white sm:gap-x-3">
            <span className="text-sm">Customer Rating:</span>
            <span className="text-sm font-bold">★★★★★ (4.9/5) </span>
            <svg
              className="h-5 w-5"
              width={16}
              height={16}
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M6 13L10 3"
                stroke="currentColor"
                strokeLinecap="round"
              />
            </svg>
            <a
              className="inline-flex items-center gap-x-1 text-sm font-medium decoration-2 hover:underline"
              href="#"
            >
              Read Reviews
              <ChevronRightIcon className="h-4 w-4 flex-shrink-0" />
            </a>
          </motion.div> */}
        </div>
      </motion.div>
    </ImagesSlider>
  );
}
