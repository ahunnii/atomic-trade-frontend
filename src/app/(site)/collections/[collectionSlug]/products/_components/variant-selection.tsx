"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { AddToCartButton } from "~/app/_components/add-to-cart-button";
import { formatCurrency } from "~/utils/format-currency";

type ProductAttribute = {
  id: string;
  name: string;
  values: string[];
};

type ProductVariant = {
  id: string;
  name: string;
  values: string[];
  priceInCents: number;
  compareAtPriceInCents?: number | null;
  stock: number;
  manageStock: boolean;
};

type Props = {
  attributes: ProductAttribute[];
  variants: ProductVariant[];
};

export function VariantSelection({ attributes, variants }: Props) {
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >({});
  const [quantity, setQuantity] = useState(1);

  console.log(variants);

  // Find the selected variant based on selected attributes
  const selectedVariant = variants.find((variant) => {
    return variant.values.every((value, index) => {
      const attribute = attributes[index];
      return attribute && selectedVariants[attribute.id] === value;
    });
  });

  // Get available variants for each attribute
  const getAvailableValues = (attributeId: string, value: string) => {
    const attributeIndex = attributes.findIndex(
      (attr) => attr.id === attributeId,
    );
    if (attributeIndex === -1) return false;

    return variants.some((variant) => {
      // Check if this variant has the selected value for this attribute
      const hasValue = variant.values[attributeIndex] === value;

      // Check if this variant is compatible with other selected values
      const isCompatible = attributes.every((attr, idx) => {
        if (idx === attributeIndex) return true; // Skip the current attribute
        const selectedValue = selectedVariants[attr.id];
        if (!selectedValue) return true; // If no value selected for this attribute, it's compatible
        return variant.values[idx] === selectedValue;
      });

      // Check stock if stock management is enabled
      const hasStock = !variant.manageStock || variant.stock > 0;

      return hasValue && isCompatible && hasStock;
    });
  };

  const handleVariantSelect = (attributeId: string, value: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [attributeId]: value,
    }));
  };

  const getMaxQuantity = () => {
    if (!selectedVariant) return 1;
    return selectedVariant.manageStock ? selectedVariant.stock : 50;
  };

  const handleQuantityChange = (newQuantity: number) => {
    const maxQuantity = getMaxQuantity();
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const isVariantSelected = attributes.every(
    (attr) => selectedVariants[attr.id],
  );

  return (
    <div>
      {/* Price */}
      <div className="mt-6">
        <h2 className="sr-only">Product information</h2>
        <div className="flex items-center gap-2">
          <p className="text-3xl tracking-tight text-gray-900">
            {selectedVariant
              ? formatCurrency(selectedVariant.priceInCents)
              : formatCurrency(variants[0]?.priceInCents ?? 0)}
          </p>
          {selectedVariant?.compareAtPriceInCents && (
            <>
              <span className="text-lg text-gray-500 line-through">
                {formatCurrency(selectedVariant.compareAtPriceInCents)}
              </span>
              <span className="rounded bg-red-500 px-2 py-1 text-sm font-semibold text-white">
                SALE
              </span>
            </>
          )}
        </div>
      </div>

      {/* Variants */}
      {attributes?.map((attribute: ProductAttribute) => (
        <div key={attribute.id} className="mt-8">
          <h3 className="text-sm font-medium text-gray-900">
            {attribute.name}
          </h3>
          <div className="mt-2">
            <div className="grid grid-cols-4 gap-2">
              {attribute.values.map((value: string) => {
                const isAvailable = getAvailableValues(attribute.id, value);
                const isSelected = selectedVariants[attribute.id] === value;
                return (
                  <button
                    key={value}
                    onClick={() => handleVariantSelect(attribute.id, value)}
                    disabled={!isAvailable}
                    className={`flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                      isSelected
                        ? "border-black bg-black text-white"
                        : "border-gray-200 hover:border-gray-300"
                    } ${
                      !isAvailable
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                    } `}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ))}

      {/* Quantity Selector */}
      <div className="mt-8">
        <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
        <div className="mt-2 flex items-center rounded-md border border-gray-200">
          <button
            className="p-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <input
            type="number"
            min="1"
            max={getMaxQuantity()}
            value={quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
            className="w-16 border-0 text-center focus:ring-0"
            aria-label="Product quantity"
            title="Product quantity"
          />
          <button
            className="p-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= getMaxQuantity()}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        {selectedVariant && selectedVariant.manageStock && (
          <p className="mt-2 text-sm text-gray-500">
            {selectedVariant.stock} items available
          </p>
        )}
      </div>

      {/* Add to Cart Button */}
      <div className="mt-8">
        {isVariantSelected &&
        selectedVariant &&
        (!selectedVariant.manageStock || selectedVariant.stock > 0) ? (
          <AddToCartButton variantId={selectedVariant.id} quantity={quantity} />
        ) : (
          <button
            disabled
            className="w-full cursor-not-allowed rounded-md bg-gray-300 px-8 py-3 text-white"
          >
            {!isVariantSelected
              ? "Select Options"
              : !selectedVariant?.manageStock || selectedVariant?.stock > 0
                ? "Add to Cart"
                : "Out of Stock"}
          </button>
        )}
      </div>
    </div>
  );
}
