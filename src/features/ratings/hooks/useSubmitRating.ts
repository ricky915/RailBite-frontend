import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { queryKeys } from '@/lib/queryClient';
import { useToast } from '@/providers/ToastProvider';
import { buildPath, ROUTES } from '@/routes/routePaths';
import { parseApiError } from '@/utils/apiErrors';

import { ratingApi } from '@/features/ratings/services/ratingApi';
import type { SubmitRatingFormValues } from '@/features/ratings/schemas/ratingSchema';

/**
 * Container hook for submitting a rating (Section 6.2 / Section 11.12).
 * Invalidates the ratings + restaurant detail caches so the restaurant's
 * average rating refreshes (Section 15.2 cache invalidation strategy).
 */
export function useSubmitRating(orderId: string, restaurantId: string) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const mutation = useMutation({
    mutationFn: (values: SubmitRatingFormValues) =>
      ratingApi.submit({ orderId, stars: values.stars, reviewText: values.reviewText }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ratings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.restaurants.detail(restaurantId) });
      showToast('Thanks for your feedback!', 'success');
      navigate(buildPath(ROUTES.ORDER_DETAIL, { orderId }));
    },
    onError: (error) => {
      showToast(parseApiError(error), 'error');
    },
  });

  return {
    submitRating: mutation.mutate,
    isSubmitting: mutation.isPending,
    error: mutation.error ? parseApiError(mutation.error) : null,
  };
}
