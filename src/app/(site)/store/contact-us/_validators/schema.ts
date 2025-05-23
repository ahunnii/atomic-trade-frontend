import { z } from "zod";

export const contactUsSchema = z.object({
  name: z.string({ required_error: "Name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  message: z.string().min(1, { message: "Message is required." }),
});

export type ContactUsFormSchema = z.infer<typeof contactUsSchema>;
