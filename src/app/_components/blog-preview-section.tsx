"use client";

import type { BlogPost } from "@prisma/client";
import React from "react";
import { api } from "~/trpc/react";

// interface BlogPost {
//   title: string;
//   description: string;
//   link: string;
// }

// const blogPosts: BlogPost[] = [
//   {
//     title: "JEANS FOR SHORT MEN",
//     description:
//       "For us shorter men, buying a new pair of jeans is always a challenge. Let's face it — modern-day jeans weren't made with our stature in mind. For that reason, we decided to completely redesign the jean from scratch.",
//     link: "/guide-to-jeans-for-short-men",
//   },
//   {
//     title: "CHINOS FOR SHORT MEN",
//     description:
//       "Chinos are one of the most important pieces in a man's wardrobe. They're a great choice for an elevated casual look, and they're incredibly versatile. Dressed up or down, chinos are a staple piece in a sharply dressed man's wardrobe.",
//     link: "/guide-to-chinos-for-short-men",
//   },
//   {
//     title: "SHIRTS FOR SHORT MEN",
//     description:
//       "This is Ash & Erie's official guide to how a casual, untucked shirt should fit. We'll be specifically talking about the fit of collared button-downs. The right casual button-down makes the perfect choice for many of the social and professional functions in our lives.",
//     link: "/guide-to-shirts-for-short-men",
//   },
//   {
//     title: "SWEATERS FOR SHORT MEN",
//     description:
//       "Sweaters are key items to have in your wardrobe. They are versatile and elevate any look. However, there are some common mistakes that can make or break an outfit, which we'll cover below.",
//     link: "/guide-to-sweaters-for-short-men",
//   },
// ];

const BlogPreviewSection: React.FC<{
  blogPreviews: (BlogPost & { content: string })[];
}> = ({ blogPreviews }) => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <h2 className="mb-12 text-center text-3xl font-bold">
        HIGHLIGHTS FROM OUR BLOG
      </h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {blogPreviews?.map((post, index) => (
          <div
            key={index}
            className="rounded-lg bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md"
          >
            <h3 className="mb-4 text-xl font-semibold">{post.title}</h3>
            <p className="mb-4 line-clamp-3 text-gray-600">{post.content}</p>
            <a
              href={`/blog/${post.slug}`}
              className="inline-block border border-black px-6 py-2 text-sm tracking-wider uppercase transition-colors duration-300 hover:bg-black hover:text-white"
            >
              Read more about {post.title}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlogPreviewSection;
