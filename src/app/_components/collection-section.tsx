import type { Collection } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { env } from "~/env";

type Props = {
  items: Collection[];
};

export default function CollectionSection({ items }: Props) {
  if (!items.length || items.length > 5) {
    return null;
  }

  // Determine grid columns based on number of items
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-5",
  }[items.length];

  return (
    <section className="mx-auto w-full max-w-7xl bg-white px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className={`grid ${gridCols} gap-4 md:gap-6 lg:gap-8`}>
          {items.map((item) => (
            <Link
              href={`/collections/${item.slug}`}
              key={item.id}
              className="group relative max-h-96 overflow-hidden rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl"
            >
              <div className="relative aspect-[3/4] h-full w-full">
                <Image
                  src={
                    item.imageUrl.startsWith("https://")
                      ? item.imageUrl
                      : `${env.NEXT_PUBLIC_STORAGE_URL}/misc/${item.imageUrl}`
                  }
                  alt={item.name}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black opacity-10 transition-all duration-300 group-hover:opacity-20" />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <span className="rounded-md bg-white px-6 py-2 text-sm font-medium text-gray-900 shadow-sm transition-colors duration-200 hover:bg-gray-100">
                  {item.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
