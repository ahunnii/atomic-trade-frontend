"use client";
import { Facebook, Instagram, Mail, Twitter } from "lucide-react";
import Link from "next/link";
import React from "react";
// import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer: React.FC = () => {
  const [email, setEmail] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription logic
    setEmail("");
  };

  return (
    <footer className="bg-gray-900 px-4 py-12 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-4">
        {/* Get Help Section */}
        <div>
          <h3 className="mb-4 text-lg font-bold">GET HELP</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/our-fit" className="hover:text-gray-300">
                Our Fit
              </Link>
            </li>
            <li>
              <Link href="/returns" className="hover:text-gray-300">
                Exchanges & Returns
              </Link>
            </li>
            <li>
              <Link href="/account" className="hover:text-gray-300">
                My Account
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-gray-300">
                Ask Us
              </Link>
            </li>
            <li>
              <Link href="/return-policy" className="hover:text-gray-300">
                Return Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-gray-300">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-gray-300">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Engage With Us Section */}
        <div>
          <h3 className="mb-4 text-lg font-bold">ENGAGE WITH US</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/gift-cards" className="hover:text-gray-300">
                Gift Cards
              </Link>
            </li>
            <li>
              <Link href="/balance" className="hover:text-gray-300">
                Gift Card Balance
              </Link>
            </li>
            <li>
              <Link href="/instagram" className="hover:text-gray-300">
                Instagram
              </Link>
            </li>
            <li>
              <Link href="/facebook" className="hover:text-gray-300">
                Facebook
              </Link>
            </li>
            <li>
              <Link href="/twitter" className="hover:text-gray-300">
                Twitter
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-gray-300">
                Our Blog
              </Link>
            </li>
          </ul>
        </div>

        {/* Company Info Section */}
        <div>
          <h3 className="mb-4 text-lg font-bold">COMPANY INFO</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/about" className="hover:text-gray-300">
                Our Story
              </Link>
            </li>
            <li>
              <Link href="/shipping" className="hover:text-gray-300">
                Shipping Policy
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-gray-300">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/reviews" className="hover:text-gray-300">
                Reviews
              </Link>
            </li>
            <li>
              <Link href="/careers" className="hover:text-gray-300">
                We&apos;re Hiring
              </Link>
            </li>
            <li>
              <Link href="/press" className="hover:text-gray-300">
                Press Kit
              </Link>
            </li>
            <li>
              <Link href="/collections" className="hover:text-gray-300">
                Shop All Collections
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter Section */}
        <div>
          <h3 className="mb-4 text-lg font-bold">NEVER MISS A SALE AGAIN</h3>
          <p className="mb-4">
            Get exclusive promotions, product updates, and more by signing up
            for our newsletter
          </p>
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-grow rounded-l bg-gray-800 px-4 py-2 text-white focus:outline-none"
                required
              />
              <button
                type="submit"
                className="rounded-r bg-white px-4 py-2 text-gray-900 transition-colors hover:bg-gray-200"
                title="Subscribe to our newsletter"
              >
                <Mail size={24} />
              </button>
            </div>
          </form>

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
      <div className="mx-auto mt-8 max-w-7xl border-t border-gray-800 pt-8">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <p className="text-sm text-gray-400">
            © 2024 Atomic Trade. All rights reserved.
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
