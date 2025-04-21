import Image from "next/image";
import { formatCurrency } from "~/utils/format-currency";

interface ProductCardProps {
  title: string;
  price: number;
  imageUrl: string;
  sizes?: string[];
  selectedSize?: string;
  onSizeSelect?: (size: string) => void;
}

export function ProductCard({
  title,
  price,
  imageUrl,
  sizes,
  selectedSize,
  onSizeSelect,
}: ProductCardProps) {
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="relative aspect-square w-full">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="p-4">
        <h3 className="mb-2 text-lg font-medium text-gray-900">{title}</h3>
        <p className="mb-4 text-xl font-semibold text-gray-900">
          {formatCurrency(price)}
        </p>

        {sizes && (
          <div className="mb-4">
            <label htmlFor="size-select" className="sr-only">
              Select size
            </label>
            <select
              id="size-select"
              value={selectedSize}
              onChange={(e) => onSizeSelect?.(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:ring-2 focus:ring-black focus:outline-none"
              aria-label="Select size"
            >
              <option value="">Select Size</option>
              {sizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        <button className="w-full rounded-md bg-black px-4 py-3 font-medium text-white transition-colors duration-200 hover:bg-gray-800">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
