import { z } from 'zod';

import { RATING_MAX_REVIEW_LENGTH } from '@/config/constants';

/** Rating submission schema (Section 11.12 Ratings and Reviews Module). */
export const submitRatingSchema = z.object({
  stars: z.number().int().min(1, 'Select a star rating.').max(5),
  reviewText: z
    .string()
    .max(RATING_MAX_REVIEW_LENGTH, `Review must be at most ${RATING_MAX_REVIEW_LENGTH} characters.`)
    .optional(),
});

export type SubmitRatingFormValues = z.infer<typeof submitRatingSchema>;
