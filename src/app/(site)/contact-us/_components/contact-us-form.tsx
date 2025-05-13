"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { LoadButton } from "~/components/common/load-button";

import { Form } from "~/components/ui/form";
import { useDefaultMutationActions } from "~/hooks/use-default-mutation-actions";
import { api } from "~/trpc/react";
import type { ContactUsFormSchema } from "../_validators/schema";

import { InputFormField, TextareaFormField } from "~/components/inputs";
import { contactUsSchema } from "../_validators/schema";

export const ContactUsForm = () => {
  const { defaultSuccess, defaultError } = useDefaultMutationActions({
    invalidateEntities: ["store"],
  });
  const form = useForm<ContactUsFormSchema>({
    resolver: zodResolver(contactUsSchema),
    defaultValues: {
      email: "",
      message: "",
      name: "",
    },
  });

  const sendEmail = api.store.contactUs.useMutation({
    onSuccess: ({ message }) => {
      defaultSuccess({ message });
      form.reset();
    },
    onError: defaultError,
  });

  const onSubmit = (data: ContactUsFormSchema) => sendEmail.mutate(data);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-8 w-full space-y-6"
      >
        <InputFormField form={form} name="email" label="Email" />
        <InputFormField
          form={form}
          name="name"
          label="Name"
          placeholder="Enter your full name"
        />

        <TextareaFormField
          form={form}
          label="Message"
          name="message"
          placeholder="Hey, my name is ..."
        />
        <LoadButton
          type="submit"
          className="w-full"
          isLoading={sendEmail.isPending}
          loadingText="Sending..."
        >
          Submit
        </LoadButton>
      </form>
    </Form>
  );
};
