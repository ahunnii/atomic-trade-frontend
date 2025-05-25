"use client";

import { useRouter } from "next/navigation";
import type React from "react";

import { useEffect, useState } from "react";
import type { ZodError } from "zod";
import { z } from "zod";
import { LoadButton } from "~/components/common/load-button";

import { FormMessages } from "~/components/shared/form-messages";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useDefaultMutationActions } from "~/hooks/use-default-mutation-actions";
import { api } from "~/trpc/react";
import type { Address } from "~/types/store";

interface AddressDialogProps {
  address: Address | null;
}

interface AddressFields {
  firstName?: string;
  lastName?: string;
  phone?: string;
  street?: string;
  additional?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  isDefault?: boolean;
}

/**
 * Create a Zod schema for validating address fields.
 * Note that, different address vary from place to place.
 * This Schema makes sure that the required fields are filled.
 */
export function createAddressSchema(address: AddressFields) {
  let schema = {};

  if (address.firstName !== "") {
    schema = {
      ...schema,
      firstName: z.string().min(1, {
        message: "First name is required",
      }),
    };
  }

  if (address.lastName !== "") {
    schema = {
      ...schema,
      lastName: z.string().min(1, {
        message: "Last name is required",
      }),
    };
  }

  if (address.phone !== "") {
    schema = {
      ...schema,
      phone: z.string().min(1, {
        message: "Phone number is required",
      }),
    };
  }

  if (address.street !== "") {
    schema = {
      ...schema,
      street: z.string().min(1, {
        message: "Street is required",
      }),
    };
  }

  schema = {
    ...schema,
    additional: z.string().optional(),
  };

  if (address.city !== "") {
    schema = {
      ...schema,
      city: z.string().min(1, {
        message: "City is required",
      }),
    };
  }

  if (address.state !== "") {
    schema = {
      ...schema,
      state: z.string().min(1, {
        message: "State is required",
      }),
    };
  }

  if (address.postalCode !== "") {
    schema = {
      ...schema,
      postalCode: z.string().min(1, {
        message: "Postal code is required",
      }),
    };
  }

  schema = {
    ...schema,
    isDefault: z.boolean().optional(),
  };

  return z.object(schema);
}

export function AddressForm(
  props: React.PropsWithChildren<AddressDialogProps>,
) {
  const { address } = props;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [additional, setAdditional] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [errorMap, setErrorMap] = useState<Record<string, string>>({});

  const { defaultActions } = useDefaultMutationActions({
    invalidateEntities: ["address"],
    redirectPath: "/account/info",
  });

  const updateAddress = api.address.update.useMutation(defaultActions);
  const createAddress = api.address.create.useMutation(defaultActions);

  const addressSchema = createAddressSchema({
    firstName: address?.firstName ?? "",
    lastName: address?.lastName ?? "",
    phone: address?.phone ?? "",
    street: address?.street ?? "",
    additional: address?.additional ?? "",
    city: address?.city,
    state: address?.state,
    postalCode: address?.postalCode,
    isDefault: address?.isDefault ?? false,
  });

  /**
   * Handle form submission and save the address
   */
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      addressSchema.parse({
        firstName,
        lastName,
        phone,
        street,
        additional,
        city,
        state,
        postalCode,
        isDefault,
      });
    } catch (error) {
      const zodError = error as ZodError;
      const errorMap = zodError.flatten().fieldErrors;

      setErrorMap({
        firstName: errorMap.firstName?.[0] ?? "",
        lastName: errorMap.lastName?.[0] ?? "",
        phone: errorMap.phone?.[0] ?? "",
        street: errorMap.street?.[0] ?? "",
        additional: errorMap.additional?.[0] ?? "",
        city: errorMap.city?.[0] ?? "",
        state: errorMap.state?.[0] ?? "",
        postalCode: errorMap.postalCode?.[0] ?? "",
      });

      return;
    }

    // Create a new formatted address from the current components
    const newFormattedAddress = [
      street,
      additional,
      `${city}, ${state} ${postalCode}`,
      address?.country ?? "USA",
    ]
      .filter(Boolean)
      .join(", ")
      .replace(/,\s*$/, ""); // Remove any trailing commas

    if (address?.id) {
      updateAddress.mutate({
        id: address.id,
        firstName,
        lastName,
        phone,
        street,
        additional,
        city,
        state,
        postalCode,
        formatted: newFormattedAddress,
        country: address?.country ?? "USA",
        isDefault,
      });
    } else {
      createAddress.mutate({
        firstName,
        lastName,
        phone,
        street,
        additional,
        city,
        state,
        postalCode,
        formatted: newFormattedAddress,
        country: address?.country ?? "USA",
        isDefault,
      });
    }
  };

  useEffect(() => {
    setFirstName(address?.firstName ?? "");
    setLastName(address?.lastName ?? "");
    setPhone(address?.phone ?? "");
    setStreet(address?.street ?? "");
    setAdditional(address?.additional ?? "");
    setPostalCode(address?.postalCode ?? "");
    setCity(address?.city ?? "");
    setState(address?.state ?? "");
    setIsDefault(address?.isDefault ?? false);
  }, [address]);

  useEffect(() => {
    setErrorMap({});
  }, []);

  const router = useRouter();
  return (
    <>
      <form onSubmit={handleSave} onClick={(e) => e.stopPropagation()}>
        <div className="space-y-4 py-7">
          <div className="flex gap-4">
            <div className="flex-1 space-y-0.5">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.currentTarget.value)}
                id="firstName"
                name="firstName"
                placeholder="First Name"
                disabled={updateAddress.isPending}
              />
              {errorMap.firstName && (
                <FormMessages
                  type="error"
                  className="pt-1 text-sm"
                  messages={[errorMap.firstName]}
                />
              )}
            </div>
            <div className="flex-1 space-y-0.5">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.currentTarget.value)}
                id="lastName"
                name="lastName"
                placeholder="Last Name"
                disabled={updateAddress.isPending}
              />
              {errorMap.lastName && (
                <FormMessages
                  type="error"
                  className="pt-1 text-sm"
                  messages={[errorMap.lastName]}
                />
              )}
            </div>
          </div>

          <div className="space-y-0.5">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.currentTarget.value)}
              id="phone"
              name="phone"
              placeholder="Phone Number"
              disabled={updateAddress.isPending}
            />
            {errorMap.phone && (
              <FormMessages
                type="error"
                className="pt-1 text-sm"
                messages={[errorMap.phone]}
              />
            )}
          </div>

          <div className="space-y-0.5">
            <Label htmlFor="street">Address line 1</Label>
            <Input
              value={street}
              onChange={(e) => setStreet(e.currentTarget.value)}
              id="street"
              name="street"
              placeholder="Address line 1"
              disabled={updateAddress.isPending}
            />
            {errorMap.street && (
              <FormMessages
                type="error"
                className="pt-1 text-sm"
                messages={[errorMap.street]}
              />
            )}
          </div>

          <div className="space-y-0.5">
            <Label htmlFor="address2">
              Address line 2{" "}
              <span className="text-secondary-foreground text-xs">
                (Optional)
              </span>
            </Label>
            <Input
              value={additional}
              onChange={(e) => setAdditional(e.currentTarget.value)}
              id="additional"
              name="additional"
              placeholder="Address line 2"
              disabled={updateAddress.isPending}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1 space-y-0.5">
              <Label htmlFor="city">City</Label>
              <Input
                value={city}
                onChange={(e) => setCity(e.currentTarget.value)}
                id="city"
                name="city"
                placeholder="City"
                disabled={updateAddress.isPending}
              />
              {errorMap.city && (
                <FormMessages
                  type="error"
                  className="pt-1 text-sm"
                  messages={[errorMap.city]}
                />
              )}
            </div>
            <div className="flex-1 space-y-0.5">
              <Label htmlFor="region">State / Province / Region</Label>
              <Input
                value={state}
                onChange={(e) => setState(e.currentTarget.value)}
                id="state"
                name="state"
                placeholder="Region"
                disabled={updateAddress.isPending}
              />
              {errorMap.state && (
                <FormMessages
                  type="error"
                  className="pt-1 text-sm"
                  messages={[errorMap.state]}
                />
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 space-y-0.5">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                value={postalCode}
                onChange={(e) => setPostalCode(e.currentTarget.value)}
                id="postalCode"
                name="postalCode"
                placeholder="Postal Code"
                disabled={updateAddress.isPending}
              />
              {errorMap.postalCode && (
                <FormMessages
                  type="error"
                  className="pt-1 text-sm"
                  messages={[errorMap.postalCode]}
                />
              )}
            </div>
            <div className="flex-1 space-y-0.5">
              <Label htmlFor="country">Country</Label>
              <Input
                value={address?.country ?? "USA"}
                id="country"
                disabled
                name="country"
                placeholder="Country"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pb-8">
          <Label htmlFor="isDefault">Set as the default address</Label>
          <Checkbox
            checked={isDefault}
            onCheckedChange={(checked) =>
              setIsDefault(checked === "indeterminate" ? false : checked)
            }
            id="isDefault"
            name="isDefault"
            disabled={updateAddress.isPending}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            onClick={() => void router.back()}
            variant={"outline"}
          >
            Cancel
          </Button>
          <LoadButton type="submit" isLoading={updateAddress.isPending}>
            Save
          </LoadButton>
        </div>
      </form>
    </>
  );
}
