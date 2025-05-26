import { api } from "~/trpc/server";

import { BlogListing } from "./_components/blog-listing";

export const metadata = {
  title: "Blog",
};

export default async function BlogsPage() {
  const blogs = await api.blog.getAllPreviews();

  return (
    <div className="page-container">
      <h1 className="page-title">Blog</h1>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <BlogListing
            key={blog.id}
            blog={{
              slug: blog.slug,
              title: blog.title,
              content: blog.content ?? "",
              cover: blog.cover ?? "",
            }}
          />
        ))}
      </div>
    </div>
  );
}
