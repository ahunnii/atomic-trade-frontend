"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { LoadButton } from "~/components/common/load-button";

import { Form } from "~/components/ui/form";
import { useDefaultMutationActions } from "~/hooks/use-default-mutation-actions";
import { api } from "~/trpc/react";
import type { SpecialRequestFormSchema } from "../_validators/schema";

import { useRef } from "react";
import { InputFormField, TextareaFormField } from "~/components/inputs";
import {
  MultiImageFormField,
  type MultiImageFormFieldRef,
} from "~/components/inputs/multi-image-form-field";
import { env } from "~/env";
import { specialRequestSchema } from "../_validators/schema";

export const SpecialRequestForm = () => {
  const mediaRef = useRef<MultiImageFormFieldRef>(null);
  const { defaultSuccess, defaultError } = useDefaultMutationActions({
    invalidateEntities: ["store"],
  });
  const form = useForm<SpecialRequestFormSchema>({
    resolver: zodResolver(specialRequestSchema),
    defaultValues: {
      email: "",
      message: "",
      name: "",
      images: [],
      tempImages: [],
    },
  });

  const sendRequest = api.store.submitRequest.useMutation({
    onSuccess: ({ message }) => {
      defaultSuccess({ message });
      form.reset();
    },
    onError: defaultError,
  });

  const onSubmit = async (data: SpecialRequestFormSchema) => {
    const images = await mediaRef.current?.upload();
    sendRequest.mutate({
      email: data.email,
      name: data.name,
      message: data.message,
      images: images ?? [],
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onChange={() => {
          console.log(form.formState.errors);
        }}
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
          placeholder="Hey, I was wondering if you could make a..."
        />

        <MultiImageFormField
          form={form}
          ref={mediaRef}
          name="images"
          tempName="tempImages"
          label="Reference Images (Optional)"
          disabled={sendRequest.isPending}
          isRequired={false}
          route="images"
          apiUrl="/api/upload-special-request"
          imagePrefix={`${env.NEXT_PUBLIC_STORAGE_URL}/product-requests/`}
        />
        <LoadButton
          type="submit"
          className="w-full"
          isLoading={sendRequest.isPending}
          loadingText="Sending..."
        >
          Submit
        </LoadButton>
      </form>
    </Form>
  );
};
