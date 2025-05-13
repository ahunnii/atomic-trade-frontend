import { z } from "zod";

export const specialRequestSchema = z.object({
  name: z.string({ required_error: "Name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  message: z.string().min(1, { message: "Message is required." }),
  tempImages: z.array(z.any().optional().nullable()),
  images: z.array(z.string()),
});

export type SpecialRequestFormSchema = z.infer<typeof specialRequestSchema>;
