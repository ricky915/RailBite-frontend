import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router-dom';

import { Alert } from '@/components/feedback/Alert';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
import { RATING_MAX_REVIEW_LENGTH } from '@/config/constants';

import { useSubmitRating } from '@/features/ratings/hooks/useSubmitRating';
import { submitRatingSchema, type SubmitRatingFormValues } from '@/features/ratings/schemas/ratingSchema';

/**
 * Page component: submit a rating for a delivered order (Section 11.12
 * Ratings and Reviews Module / Section 10.9 Rating Journey).
 */
export default function RateOrderPage(): JSX.Element {
  const { orderId = '' } = useParams<{ orderId: string }>();
  const location = useLocation();
  const state = location.state as { restaurantId?: string } | null;

  const { submitRating, isSubmitting, error } = useSubmitRating(orderId, state?.restaurantId ?? '');

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<SubmitRatingFormValues>({
    resolver: zodResolver(submitRatingSchema),
    defaultValues: { stars: 0 },
    mode: 'onChange',
  });

  const reviewText = watch('reviewText') ?? '';

  return (
    <>
      <Helmet>
        <title>Rate your order — RailBite</title>
      </Helmet>

      <div className="mx-auto flex max-w-sm flex-col gap-6 py-10">
        <h1 className="text-2xl font-bold text-neutral-900">How was your meal?</h1>

        {error && <Alert variant="error">{error}</Alert>}

        <form onSubmit={handleSubmit((values) => submitRating(values))} className="flex flex-col gap-4" noValidate>
          <Controller
            control={control}
            name="stars"
            render={({ field }) => (
              <div className="flex flex-col items-center gap-2">
                <StarRating value={field.value} onChange={field.onChange} size="lg" />
                {errors.stars && <p className="text-sm text-danger-700">{errors.stars.message}</p>}
              </div>
            )}
          />

          <div>
            <label htmlFor="reviewText" className="text-sm font-medium text-neutral-700">
              Review (optional)
            </label>
            <textarea
              id="reviewText"
              rows={4}
              maxLength={RATING_MAX_REVIEW_LENGTH}
              className="mt-1 w-full rounded-lg border border-neutral-300 p-3 text-sm"
              {...register('reviewText')}
            />
            <p className="mt-1 text-right text-xs text-neutral-400">
              {reviewText.length}/{RATING_MAX_REVIEW_LENGTH}
            </p>
          </div>

          <Button type="submit" isLoading={isSubmitting} disabled={!isValid || isSubmitting}>
            Submit rating
          </Button>
        </form>
      </div>
    </>
  );
}
