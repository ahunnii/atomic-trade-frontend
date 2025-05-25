"use client";

import { Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useDefaultMutationActions } from "~/hooks/use-default-mutation-actions";
import { api } from "~/trpc/react";
import { LoadButton } from "../common/load-button";
import { Input } from "../ui/input";

export const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const apiUtils = api.useUtils();

  const { defaultActions } = useDefaultMutationActions({
    invalidateEntities: ["store"],
  });
  const subscribeToNewsletterMutation =
    api.store.subscribeToNewsletter.useMutation({
      ...defaultActions,
      onSettled: () => {
        void apiUtils.store.invalidate();
      },
    });

  const handleSubmit = (e: FormEvent) => {
    subscribeToNewsletterMutation.mutate({ email });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex items-center">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="bg-accent text-primary rounded-r-none"
          required
          disabled={subscribeToNewsletterMutation.isPending}
        />
        <LoadButton
          isLoading={subscribeToNewsletterMutation.isPending}
          type="submit"
          title="Subscribe to our newsletter"
          variant="outline"
          className="rounded-l-none"
        >
          <Mail size={24} />
        </LoadButton>
      </div>
    </form>
  );
};
