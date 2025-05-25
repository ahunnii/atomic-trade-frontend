"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { LoadButton } from "~/components/common/load-button";

import { Form } from "~/components/ui/form";
import { useDefaultMutationActions } from "~/hooks/use-default-mutation-actions";
import { api } from "~/trpc/react";
import type { BasicInfoFormSchema } from "../_validators/schema";

import { InputFormField } from "~/components/inputs";
import { DateFormField } from "~/components/inputs/date-form-field";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { basicInfoSchema } from "../_validators/schema";

type Props = {
  initialValues?: BasicInfoFormSchema;
};
export const BasicInfoForm = ({ initialValues }: Props) => {
  const { defaultActions } = useDefaultMutationActions({
    invalidateEntities: ["account"],
  });
  const form = useForm<BasicInfoFormSchema>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      birthday: initialValues?.birthday ?? undefined,
      gender: initialValues?.gender ?? undefined,
    },
  });

  const updateProfile = api.account.updateBasicInfo.useMutation({
    ...defaultActions,
    onSuccess: (data) => {
      defaultActions.onSuccess?.({ message: data.message });
      setEdit(false);
    },
  });

  const onSubmit = (data: BasicInfoFormSchema) => updateProfile.mutate(data);

  const [edit, setEdit] = useState(false);

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-8 shadow-sm">
      {edit ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 w-full space-y-6"
          >
            <DateFormField
              form={form}
              name="birthday"
              label="Birthday (optional)"
            />
            <InputFormField
              form={form}
              name="gender"
              label="Gender (optional)"
            />

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setEdit(false)}>
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
            <h2 className="text-2xl font-bold">Basic Information</h2>
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
              <span className="font-medium text-gray-500">Birthday:</span>
              <span className="text-gray-900">
                {initialValues?.birthday
                  ? new Date(initialValues.birthday).toLocaleDateString()
                  : "Not set"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-500">Gender:</span>
              <span className="text-gray-900">
                {initialValues?.gender ?? "Not set"}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
