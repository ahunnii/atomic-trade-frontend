"use client";
import { toastService } from "@dreamwalker-studios/toasts";
import { Mail } from "lucide-react";
import { useState, type FormEvent } from "react";

export const NewsletterForm = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription logic
    setEmail("");
    toastService.inform("Functionality not implemented yet");
  };

  return (
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
  );
};
