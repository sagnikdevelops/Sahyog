import { z } from "zod";

export const bookingRequestSchema = z.object({
  serviceId: z.string().min(1, "Please select a service"),
  urgency: z.enum(["NORMAL", "EMERGENCY"]),
  scheduledDate: z.string().min(1, "Please select a scheduled date"),
  scheduledTime: z.string().min(1, "Please select a scheduled time"),
  customerAddress: z.string().min(5, "Address must be at least 5 characters"),
  customerLat: z.number(),
  customerLng: z.number(),
  description: z.string().min(10, "Please describe the problem in at least 10 characters"),
  customerNotes: z.string().optional(),
});

export type BookingRequestForm = z.infer<typeof bookingRequestSchema>;

export const disputeSchema = z.object({
  reason: z.string().min(3, "Please specify a dispute reason"),
  description: z.string().min(15, "Please provide detailed description (minimum 15 characters)"),
  evidenceUrl: z.string().optional(),
});

export type DisputeForm = z.infer<typeof disputeSchema>;

export const ratingSchema = z.object({
  rating: z.number().min(1).max(5),
  skillRating: z.number().min(1).max(5),
  punctualityRating: z.number().min(1).max(5),
  politenessRating: z.number().min(1).max(5),
  feedback: z.string().min(5, "Please write at least a short review"),
});

export type RatingForm = z.infer<typeof ratingSchema>;

export const workerAvailabilitySchema = z.object({
  isAvailable: z.boolean(),
  serviceRadiusKm: z.number().min(1).max(50),
});

export const serviceCompletionSchema = z.object({
  completionNotes: z.string().min(10, "Please provide brief notes on work performed"),
  photoUrl: z.string().optional(),
});

export const demoRegistrationSchema = z
  .object({
    fullName: z.string().trim().min(1, "auth.validation.fullNameRequired"),
    email: z
      .string()
      .trim()
      .min(1, "auth.validation.emailRequired")
      .email("auth.validation.emailInvalid"),
    password: z
      .string()
      .min(1, "auth.validation.passwordRequired")
      .min(8, "auth.validation.passwordMin"),
    confirmPassword: z.string().min(1, "auth.validation.confirmRequired"),
    role: z.enum(["CUSTOMER", "WORKER"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "auth.validation.passwordMismatch",
    path: ["confirmPassword"],
  });

export type DemoRegistrationForm = z.infer<typeof demoRegistrationSchema>;