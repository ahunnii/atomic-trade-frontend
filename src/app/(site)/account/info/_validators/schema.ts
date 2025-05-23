import { isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string({ required_error: "First name is required." }),
  lastName: z.string({ required_error: "Last name is required." }),
  phone: z
    .string()
    .refine(isValidPhoneNumber, { message: "Invalid phone number" })
    .or(z.literal("")),
});

export const basicInfoSchema = z.object({
  birthday: z.date().optional(),
  gender: z.string().optional(),
});

export type ProfileFormSchema = z.infer<typeof profileSchema>;
export type BasicInfoFormSchema = z.infer<typeof basicInfoSchema>;
