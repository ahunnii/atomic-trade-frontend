"use client";

import { Tag } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { env } from "~/env";

type CartItem = {
  id: string;
  variantId: string;
  variant: {
    id: string;
    name: string;
    product: {
      id: string;
      name: string;
      featuredImage: string;
    };
    priceInCents: number;
    compareAtPriceInCents?: number | null;
  };
  quantity: number;
  priceInCents?: number | null;
  compareAtPriceInCents?: number | null;
  appliedDiscounts?:
    | {
        id: string;
        code: string;
        type: "PRODUCT" | "ORDER" | "SHIPPING";
      }[]
    | null;
};

export type DiscountedCartData = {
  originalSubtotal: number;
  originalCartItems: CartItem[];
  updatedCartItems: CartItem[];
  discountedShipping: number;
  orderDiscountInCents: number;
  productDiscountInCents: number;
  totalAfterDiscounts: number;
  appliedDiscounts: {
    id: string;
    code: string;
    type: string;
  }[];
  itemDiscountMap: Record<string, { id: string; code: string; type: string }[]>;
  updatedCartItemsWithDiscounts: (CartItem & {
    appliedDiscounts: {
      id: string;
      code: string;
      type: string;
    }[];
  })[];
  productDiscountsMap: Record<
    string,
    {
      variantId: string;
      name: string;
      variantName: string;
    }[]
  >;
  orderDiscounts: {
    id: string;
    code: string;
    type: string;
    amountInCents: number;
  }[];
  shippingDiscount: {
    id: string;
    code: string;
    type: string;
    amountInCents: number;
  } | null;
  totalDiscountInCents: number;
  bestAutomaticDiscount: {
    id: string;
    code: string;
    type: string;
    amountInCents: number;
  } | null;
  couponDiscount: {
    id: string;
    code: string;
    type: string;
    amountInCents: number;
  } | null;
};

type Props = {
  discountedCartData: DiscountedCartData;
};

export function CheckoutSummary({ discountedCartData }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [showBottomShadow, setShowBottomShadow] = useState(false);

  // Check if content is scrollable
  useEffect(() => {
    const checkScroll = () => {
      if (contentRef.current) {
        const { scrollHeight, clientHeight, scrollTop } = contentRef.current;
        setShowBottomShadow(
          scrollHeight > clientHeight &&
            scrollTop < scrollHeight - clientHeight,
        );
      }
    };

    const content = contentRef.current;
    if (content) {
      content.addEventListener("scroll", checkScroll);
      // Initial check
      checkScroll();
    }

    return () => {
      if (content) {
        content.removeEventListener("scroll", checkScroll);
      }
    };
  }, [discountedCartData.updatedCartItems]);

  console.log(discountedCartData);

  return (
    <div className="relative">
      <div
        ref={contentRef}
        className="flex max-h-[80vh] w-full flex-col gap-4 overflow-y-auto p-4"
      >
        {discountedCartData.updatedCartItems.length === 0 ? (
          <div className="text-muted-foreground text-center">
            Your cart is empty
          </div>
        ) : (
          <>
            <section className="space-y-4 divide-y">
              {discountedCartData.updatedCartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex w-full items-center justify-between py-4"
                >
                  <div className="flex items-center gap-2">
                    <div className="relative aspect-square w-16">
                      <div className="bg-primary/80 absolute -top-2 -left-2 z-10 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white">
                        {item.quantity}
                      </div>
                      <Image
                        src={`${env.NEXT_PUBLIC_STORAGE_URL}/products/${item.variant.product?.featuredImage ?? ""}`}
                        alt={item.variant.product?.name ?? ""}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="font-medium">
                        {item?.variant?.product?.name}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {item?.variant?.name}
                      </div>
                      {/* <div className="text-sm">
                      {item?.variant?.priceInCents && (
                        <div className="flex items-center">
                          ${(item.variant.priceInCents / 100).toFixed(2)}
                          {item?.variant?.compareAtPriceInCents && (
                            <>
                              <span className="ml-2 line-through">
                                $
                                {(
                                  item.variant.compareAtPriceInCents / 100
                                ).toFixed(2)}
                              </span>
                              <span className="ml-2 rounded bg-red-500 px-1.5 py-0.5 text-xs font-semibold text-white">
                                SALE
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </div> */}

                      {item.appliedDiscounts?.map((discount) => (
                        <Badge key={discount.id} variant="outline">
                          <Tag className="mr-2 h-4 w-4" />
                          {discount.code}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="mb-2 text-sm">
                    {item?.priceInCents && (
                      <div className="flex items-center">
                        ${(item.priceInCents / 100).toFixed(2)}
                        {item?.compareAtPriceInCents && (
                          <>
                            <span className="ml-2 line-through">
                              ${(item.compareAtPriceInCents / 100).toFixed(2)}
                            </span>
                            <span className="ml-2 rounded bg-red-500 px-1.5 py-0.5 text-xs font-semibold text-white">
                              SALE
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </section>

            <div className="flex items-center gap-2">
              <Input placeholder="Enter coupon code" />
              <Button>Apply</Button>
            </div>
            <div className="mt-4 space-y-4">
              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>
                    ${(discountedCartData?.originalSubtotal / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Discounted Subtotal:</span>
                  <span>
                    $
                    {(
                      (discountedCartData.totalAfterDiscounts -
                        discountedCartData.discountedShipping) /
                      100
                    ).toFixed(2)}
                  </span>
                </div>
                {discountedCartData.orderDiscountInCents > 0 && (
                  <div className="text-muted-foreground flex justify-between pl-5 text-xs">
                    <span>Order Discount:</span>
                    <span>
                      -$
                      {(discountedCartData.orderDiscountInCents / 100).toFixed(
                        2,
                      )}
                    </span>
                  </div>
                )}

                {discountedCartData.orderDiscountInCents > 0 && (
                  <div className="text-muted-foreground flex justify-between pl-5 text-xs">
                    <span>Product Discount:</span>
                    <span>
                      -$
                      {(
                        discountedCartData.productDiscountInCents / 100
                      ).toFixed(2)}
                    </span>
                  </div>
                )}
                {discountedCartData.discountedShipping === 0 && (
                  <div className="flex justify-between">
                    <span>Shipping Discount:</span>
                    <span>Free Shipping</span>
                  </div>
                )}

                {discountedCartData.discountedShipping > 0 && (
                  <div className="flex justify-between">
                    <span>Shipping Discount:</span>
                    <span>
                      $
                      {(discountedCartData.discountedShipping / 100).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>
                    ${(discountedCartData.totalAfterDiscounts / 100).toFixed(2)}{" "}
                    USD
                  </span>
                </div>
                {discountedCartData.appliedDiscounts.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium">Order Discounts:</h4>
                    <ul className="mt-2 space-y-1">
                      {discountedCartData.appliedDiscounts
                        .filter((discount) => discount.type !== "PRODUCT")
                        .map((discount) => (
                          <li key={discount.id} className="text-sm">
                            {discount.code} ({discount.type})
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      {showBottomShadow && (
        <div className="from-background pointer-events-none absolute right-0 bottom-0 left-0 h-6 bg-gradient-to-t to-transparent transition-opacity duration-300"></div>
      )}
    </div>
  );
}
