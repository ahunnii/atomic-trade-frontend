"use client";

import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  slug: string;
};

export function SortSelect({ slug }: Props) {
  const router = useRouter();
  return (
    <div className="relative">
      <label htmlFor="sort-select" className="sr-only">
        Sort by
      </label>
      <select
        id="sort-select"
        onChange={(e) => {
          const val = e.target.value;

          if (val === "featured") {
            void router.push(`/collections/${slug}`);
          } else {
            void router.push(`/collections/${slug}?sort=${e.target.value}`);
          }
        }}
        className="appearance-none rounded-md border border-gray-300 bg-white py-2 pr-10 pl-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <option value="featured">Featured</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="newest">Newest</option>
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
    </div>
  );
}
