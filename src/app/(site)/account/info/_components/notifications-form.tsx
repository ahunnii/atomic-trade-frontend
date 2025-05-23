"use client";

import { Switch } from "~/components/ui/switch";
import { useDefaultMutationActions } from "~/hooks/use-default-mutation-actions";
import { api } from "~/trpc/react";

type Props = {
  initialValues?: {
    subscribedToEmailPromos: boolean;
    subscribedToSmsPromos: boolean;
  };
};
export const NotificationsForm = ({ initialValues }: Props) => {
  const { defaultActions } = useDefaultMutationActions({
    invalidateEntities: ["account"],
  });

  const updateEmailNotifications =
    api.account.updateEmailNotifications.useMutation(defaultActions);
  const updateSmsNotifications =
    api.account.updateSmsNotifications.useMutation(defaultActions);

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-8 shadow-sm">
      <h2 className="mb-4 text-2xl font-bold">Subscriptions</h2>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Email Promotions</p>
            <p className="text-sm text-gray-500">
              Receive updates about new products and special offers
            </p>
          </div>
          <Switch
            defaultChecked={initialValues?.subscribedToEmailPromos}
            onCheckedChange={(checked) => {
              updateEmailNotifications.mutate(checked);
            }}
            disabled={
              updateEmailNotifications.isPending ||
              updateSmsNotifications.isPending
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">SMS Promotions</p>
            <p className="text-sm text-gray-500">
              Get text messages about exclusive deals and promotions
            </p>
          </div>
          <Switch
            defaultChecked={initialValues?.subscribedToSmsPromos}
            onCheckedChange={(checked) => {
              updateSmsNotifications.mutate(checked);
            }}
            disabled={
              updateEmailNotifications.isPending ||
              updateSmsNotifications.isPending
            }
            //   defaultChecked={session?.user?.smsNotifications}
            //   onCheckedChange={(checked) => {
            //     // TODO: Add mutation to update SMS notifications preference
            //   }}
          />
        </div>
      </div>
    </div>
  );
};
