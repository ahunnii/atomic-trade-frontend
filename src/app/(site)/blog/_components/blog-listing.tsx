import Link from "next/link";

type Props = {
  blog: {
    slug: string;
    title: string;
    content: string;
    cover?: string;
  };
};
export function BlogListing({ blog }: Props) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="group flex flex-col rounded-lg border p-6 shadow-sm transition-all hover:border-gray-400 hover:shadow-md"
    >
      <h2 className="mb-2 text-xl font-bold transition-colors group-hover:text-blue-600">
        {blog.title}
      </h2>
      <p className="mb-4 line-clamp-3 text-gray-600">{blog.content}</p>
      <div className="mt-auto flex justify-end">
        <span className="text-sm font-medium text-blue-600 group-hover:underline">
          Read more →
        </span>
      </div>
    </Link>
  );
}
