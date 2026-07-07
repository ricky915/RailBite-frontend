import { z } from 'zod';

import { pnrSchema, trainNumberSchema } from '@/utils/validation';

/** PNR search schema (Section 11.3 — 10-digit PNR). */
export const pnrSearchSchema = z.object({
  pnr: pnrSchema,
});
export type PnrSearchFormValues = z.infer<typeof pnrSearchSchema>;

/** Train number + date search schema (Section 11.3). */
export const trainSearchSchema = z.object({
  trainNumber: trainNumberSchema,
  journeyDate: z
    .string()
    .refine((value) => !Number.isNaN(Date.parse(value)), 'Enter a valid date.'),
});
export type TrainSearchFormValues = z.infer<typeof trainSearchSchema>;
