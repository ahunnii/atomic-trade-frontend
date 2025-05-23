import { ProductGrid } from "~/app/_components/product-grid";

import { api } from "~/trpc/server";
// import { FilterButton } from "../_components/filter-button";
import { SortSelect } from "../_components/sort-select";

type Props = {
  params: Promise<{ collectionSlug: string }>;
  searchParams: Promise<{ sort?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const slug = (await params).collectionSlug;
  const collections = await api.collection.getBySlug({
    slug: slug,
  });
  return { title: collections?.name };
}
export default async function CollectionPage({ params, searchParams }: Props) {
  const slug = (await params).collectionSlug;
  const sort = (await searchParams)?.sort ?? "featured";

  const collections = await api.collection.getBySlug({
    slug: slug,
    sortBy: sort,
  });

  return (
    <div className="mx-auto mb-8 w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-center text-4xl font-bold tracking-wider uppercase">
        {collections?.name}
      </h1>

      <div className="mb-8 flex items-center justify-end">
        {/* <FilterButton /> */}
        <SortSelect slug={collections?.slug ?? ""} />
      </div>

      <ProductGrid products={collections?.products ?? []} />
    </div>
  );
}
