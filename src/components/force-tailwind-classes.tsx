/**
 * TEMPORARY WORKAROUND: This component forces Tailwind to include classes used by external packages.
 *
 * BETTER SOLUTIONS:
 * 1. The @atomic-trade/payments package should ship with source files or a CSS file
 * 2. Use a proper safelist in tailwind.config.ts (when supported in v4)
 * 3. The package should document required classes for consumers
 *
 * This component is hidden and ensures classes are in the CSS bundle.
 */
export function ForceTailwindClasses() {
  return (
    <div style={{ display: "none" }}>
      {/* All classes used by @atomic-trade/payments */}
      <div className="text-green-500 text-green-700 text-red-500" />
      <div className="text-gray-400 text-gray-500 text-gray-700 text-gray-800 text-gray-900" />
      <div className="bg-gray-50 bg-gray-100 bg-gray-200 bg-white" />
      <div className="h-5 h-12 h-16 w-5 w-12 w-16" />
      <div className="rounded-full rounded-lg rounded-md" />
      <div className="border p-3 p-5 px-2 px-3 py-0.5 py-2" />
      <div className="flex flex-1 flex-col items-center justify-center gap-2 gap-3 gap-4" />
      <div className="space-y-2 space-y-4 divide-y divide-gray-200" />
      <div className="text-2xl text-4xl text-base text-lg text-sm text-xs" />
      <div className="font-bold font-medium font-semibold" />
      <div className="mt-1 mb-3 ml-2 pt-4" />
      <div className="hover:bg-gray-200 hover:text-gray-700" />
      <div className="focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:outline-none" />
      <div className="transition transition-colors" />
      <div className="inline-flex overflow-x-auto border-t" />
      <div className="md:col-span-2 md:flex-row md:items-center md:justify-between" />
    </div>
  );
}
