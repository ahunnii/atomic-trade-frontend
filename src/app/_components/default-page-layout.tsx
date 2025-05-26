export default function DefaultPageLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="container mx-auto min-h-[80svh] max-w-7xl px-4 py-8">
      <h1 className="mb-10 text-center text-4xl font-bold tracking-wider uppercase">
        {title}
      </h1>
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </div>
  );
}
