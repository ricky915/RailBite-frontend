import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/routes/routePaths';
import { useCartStore } from '@/store/cartStore';
import { parseApiError } from '@/utils/apiErrors';

import { searchApi } from '@/features/search/services/searchApi';
import type { TrainSearchFormValues } from '@/features/search/schemas/trainSearchSchema';

/**
 * Container hook for the train search flow (Section 11.3 Search Module /
 * Section 10.3 Searching Train Journey). On selecting a delivery station,
 * seeds the cart store's delivery fields (coach/seat are collected later on
 * the cart page, per Section 10.5 step 5) and routes to the restaurant
 * listing filtered by that station.
 */
export function useTrainSearch() {
  const navigate = useNavigate();
  const setDeliveryDetails = useCartStore((state) => state.setDeliveryDetails);

  const searchMutation = useMutation({
    mutationFn: (values: TrainSearchFormValues) =>
      searchApi.searchByTrainNumber(values.trainNumber, values.journeyDate),
  });

  const pnrMutation = useMutation({
    mutationFn: (pnr: string) => searchApi.searchByPnr(pnr),
  });

  const selectDeliveryStation = (trainNumber: string, deliveryStation: string): void => {
    setDeliveryDetails({ trainNumber, deliveryStation, coach: '', seat: '' });
    navigate(`${ROUTES.RESTAURANTS}?station=${encodeURIComponent(deliveryStation)}`);
  };

  return {
    searchByTrainNumber: searchMutation.mutate,
    trainResult: searchMutation.data,
    isSearchingTrain: searchMutation.isPending,
    trainSearchError: searchMutation.error ? parseApiError(searchMutation.error) : null,

    searchByPnr: pnrMutation.mutate,
    pnrResult: pnrMutation.data,
    isSearchingPnr: pnrMutation.isPending,
    pnrSearchError: pnrMutation.error ? parseApiError(pnrMutation.error) : null,

    selectDeliveryStation,
  };
}
