import { z } from 'zod';

/**
 * Checkout form schema (Section 11.7 Checkout Module). The terms
 * acknowledgment checkbox must be checked before an order can be placed.
 */
export const checkoutSchema = z.object({
  acceptedTerms: z
    .boolean()
    .refine((value) => value === true, { message: 'You must accept the terms to place your order.' }),
  paymentMode: z.enum(['online', 'cod']),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
