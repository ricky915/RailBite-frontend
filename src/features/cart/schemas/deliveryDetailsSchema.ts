import { z } from 'zod';

import { coachNumberSchema, seatNumberSchema } from '@/utils/validation';

/**
 * Coach/seat entry schema (Section 11.6 / 17.4). Required before checkout —
 * "Enter seat/coach" step of the Ordering Food Journey (Section 10.5 step 5).
 */
export const deliveryDetailsSchema = z.object({
  coach: coachNumberSchema,
  seat: seatNumberSchema,
});

export type DeliveryDetailsFormValues = z.infer<typeof deliveryDetailsSchema>;
