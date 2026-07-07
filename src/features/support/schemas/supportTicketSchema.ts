import { z } from 'zod';

import {
  SUPPORT_TICKET_MAX_DESCRIPTION_LENGTH,
  SUPPORT_TICKET_MIN_DESCRIPTION_LENGTH,
} from '@/config/constants';

/** Support ticket categories (Section 11.14 Support Module). */
export const SUPPORT_TICKET_CATEGORIES = [
  'wrong_order',
  'order_not_delivered',
  'food_quality',
  'refund_inquiry',
  'account_issue',
  'other',
] as const;

export const createSupportTicketSchema = z.object({
  category: z.enum(SUPPORT_TICKET_CATEGORIES),
  orderId: z.string().optional(),
  description: z
    .string()
    .min(
      SUPPORT_TICKET_MIN_DESCRIPTION_LENGTH,
      `Please describe your issue in at least ${SUPPORT_TICKET_MIN_DESCRIPTION_LENGTH} characters.`,
    )
    .max(
      SUPPORT_TICKET_MAX_DESCRIPTION_LENGTH,
      `Description must be at most ${SUPPORT_TICKET_MAX_DESCRIPTION_LENGTH} characters.`,
    ),
});

export type CreateSupportTicketFormValues = z.infer<typeof createSupportTicketSchema>;
