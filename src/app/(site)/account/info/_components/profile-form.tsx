"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import type { ProfileFormSchema } from "../_validators/schema";
import { api } from "~/trpc/react";
import { useDefaultMutationActions } from "~/hooks/use-default-mutation-actions";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { LoadButton } from "~/components/common/load-button";
import { InputFormField } from "~/components/inputs";
import { PhoneFormField } from "~/components/inputs/phone-form-field";

import { profileSchema } from "../_validators/schema";

type Props = {
  initialValues?: ProfileFormSchema;
  email: string;
};

export const ProfileForm = ({ initialValues, email }: Props) => {
  const { defaultActions } = useDefaultMutationActions({
    invalidateEntities: ["account"],
  });
  const form = useForm<ProfileFormSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: initialValues?.firstName ?? "",
      lastName: initialValues?.lastName ?? "",
      phone: initialValues?.phone ?? "",
    },
  });

  const updateProfile = api.account.updateProfile.useMutation({
    ...defaultActions,
    onSuccess: (data) => {
      defaultActions.onSuccess?.({ message: data.message });
      setEdit(false);
    },
  });

  const onSubmit = (data: ProfileFormSchema) => updateProfile.mutate(data);

  const [edit, setEdit] = useState(false);

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-8 shadow-sm">
      {edit ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 w-full space-y-6"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
          >
            <InputFormField form={form} name="firstName" label="First Name" />
            <InputFormField form={form} name="lastName" label="Last Name" />
            <PhoneFormField
              form={form}
              name="phone"
              label="Phone (optional)"
              placeholder="Enter your phone number, e.g (123) 456-7890"
            />
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setEdit(false)}
                type="button"
              >
                Cancel
              </Button>

              <LoadButton
                type="submit"
                isLoading={updateProfile.isPending}
                loadingText="Updating..."
              >
                Save
              </LoadButton>
            </div>
          </form>
        </Form>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Profile</h2>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setEdit(true)}
            >
              Edit
            </Button>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-500">Name:</span>
              <span className="text-gray-900">
                {initialValues?.firstName ?? "Guest"} {initialValues?.lastName}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-500">Email:</span>
              <span className="text-gray-900">{email}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-500">Phone:</span>
              <span className="text-gray-900">
                {initialValues?.phone ?? "Not set"}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
