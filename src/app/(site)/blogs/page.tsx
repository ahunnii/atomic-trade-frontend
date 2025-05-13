import Link from "next/link";
import { api } from "~/trpc/server";

export default async function BlogsPage() {
  const blogs = await api.blog.getPreviews();

  return (
    <div className="container mx-auto min-h-[80svh] px-4 py-8">
      <h1 className="mx-auto text-center text-4xl font-bold">Blogs</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <Link
            key={blog.id}
            href={`/blogs/${blog.slug}`}
            className="rounded-lg border p-4"
          >
            <h2 className="text-lg font-bold">{blog.title}</h2>
            <p className="mb-4 line-clamp-3 text-gray-600">{blog.content}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
