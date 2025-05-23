"use client";

import type { BlogPost } from "@prisma/client";
import React from "react";

type Props = {
  blogPreviews: (BlogPost & { content: string })[];
};

export default function BlogPreviewSection({ blogPreviews }: Props) {
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
}
