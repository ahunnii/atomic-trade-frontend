import { SlidersHorizontal } from "lucide-react";

export function FilterButton() {
  return (
    <button className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50">
      <SlidersHorizontal className="h-5 w-5" />
      <span>Filter</span>
    </button>
  );
}
