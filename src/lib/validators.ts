import { z } from "zod";

export const invoiceStatusSchema = z.enum([
  "processing",
  "needs_review",
  "approved",
  "rejected",
]);

export const listInvoicesQuerySchema = z.object({
  status: invoiceStatusSchema.optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(["approved", "rejected"]),
});

export const createNoteSchema = z.object({
  body: z.string().trim().min(1, "Note cannot be empty").max(2000),
});

export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
export type CreateNoteInput = z.infer<typeof createNoteSchema>;
