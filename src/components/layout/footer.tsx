import { Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";
import React from "react";
import { api } from "~/trpc/server";
import { NewsletterForm } from "./newsletter-form";
const Footer: React.FC = async () => {
  const storeBrand = await api.store.getBrand();
  const reservedPages = await api.reservedPage.getAll();
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-gray-400/25 px-4 py-12">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-6">
        {/* Get Help Section */}
        <div className="col-span-1">
          <h3 className="mb-4 text-lg font-bold">SUPPORT</h3>
          <ul className="space-y-2">
            {reservedPages?.enableContactPage && (
              <li>
                <Link
                  href="/store/contact-us"
                  className="after:bg-primary relative font-light after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:transition-all after:duration-300 hover:after:w-full"
                >
                  Contact Us
                </Link>
              </li>
            )}

            {reservedPages?.enableSpecialOrderPage && (
              <li>
                <Link
                  href="/store/special-requests"
                  className="after:bg-primary relative font-light after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:transition-all after:duration-300 hover:after:w-full"
                >
                  Special Order
                </Link>
              </li>
            )}

            {reservedPages?.enableFaqPage && (
              <li>
                <Link
                  href="/store/frequently-asked-questions"
                  className="after:bg-primary relative font-light after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:transition-all after:duration-300 hover:after:w-full"
                >
                  FAQ
                </Link>
              </li>
            )}

            <li>
              <Link
                href="/policies/refund-policy"
                className="after:bg-primary relative font-light after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:transition-all after:duration-300 hover:after:w-full"
              >
                Refund Policy
              </Link>
            </li>
            <li>
              <Link
                href="/policies/shipping-policy"
                className="after:bg-primary relative font-light after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:transition-all after:duration-300 hover:after:w-full"
              >
                Shipping Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Engage With Us Section */}
        <div className="col-span-1">
          <h3 className="mb-4 text-lg font-bold">INFORMATION</h3>
          <ul className="space-y-2">
            {reservedPages?.enableAboutPage && (
              <li>
                <Link
                  href="/store/about"
                  className="after:bg-primary relative font-light after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:transition-all after:duration-300 hover:after:w-full"
                >
                  About Us
                </Link>
              </li>
            )}

            <li>
              <Link
                href="/policies/terms-of-service"
                className="after:bg-primary relative font-light after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:transition-all after:duration-300 hover:after:w-full"
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <Link
                href="/policies/privacy-policy"
                className="after:bg-primary relative font-light after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:transition-all after:duration-300 hover:after:w-full"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                className="after:bg-primary relative font-light after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:transition-all after:duration-300 hover:after:w-full"
              >
                Our Blog
              </Link>
            </li>
          </ul>
        </div>

        {/* Company Info Section */}
        <div className="col-span-2">
          <h3 className="mb-4 text-lg font-bold">ABOUT US</h3>
          <p className="mb-4">
            <strong>Atomic Trade</strong> is about breaking commerce down to its
            smallest, most just components — so that every creator, every
            ecosystem, and every community retains control over the value they
            generate.
          </p>
          <strong className="mb-4">Detroit, MI</strong>
        </div>

        {/* Newsletter Section */}
        <div className="col-span-2">
          <h3 className="mb-4 text-lg font-bold">NEVER MISS A SALE AGAIN</h3>
          <p className="mb-4">
            Get exclusive promotions, product updates, and more by signing up
            for our newsletter
          </p>
          <NewsletterForm />
          {/* Social Media Icons */}
          <div className="flex space-x-4">
            <Link href="/instagram" className="hover:text-gray-300">
              <Instagram size={24} />
            </Link>
            <Link href="/facebook" className="hover:text-gray-300">
              <Facebook size={24} />
            </Link>
            <Link href="/twitter" className="hover:text-gray-300">
              <Twitter size={24} />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mx-auto mt-8 max-w-7xl border-gray-400 pt-8">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <p className="text-sm text-gray-400">
            © {year} {storeBrand?.name ?? "Atomic Trade"}. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <button className="text-sm text-gray-400 hover:text-white">
              USD $ ▼
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
