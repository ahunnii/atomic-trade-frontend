import Link from "next/link";
import DefaultPageLayout from "~/app/_components/default-page-layout";
import { api } from "~/trpc/server";

export const metadata = {
  title: "Blogs",
};

export default async function BlogsPage() {
  const blogs = await api.blog.getPreviews();

  return (
    <DefaultPageLayout title="Blogs">
      {blogs.map((blog) => (
        <Link
          key={blog.id}
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
      ))}
    </DefaultPageLayout>
  );
}
