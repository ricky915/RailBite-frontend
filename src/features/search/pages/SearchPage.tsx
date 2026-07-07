import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';

import { Alert } from '@/components/feedback/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DELIVERY_WINDOW_MINUTES } from '@/config/constants';

import { useTrainSearch } from '@/features/search/hooks/useTrainSearch';
import {
  trainSearchSchema,
  type TrainSearchFormValues,
} from '@/features/search/schemas/trainSearchSchema';

/**
 * Page component: train search (Section 11.3 Search Module / Section 10.3
 * Searching Train Journey). Simplified to train-number + date search for
 * this scaffold's reference flow; PNR search follows the same pattern via
 * `useTrainSearch().searchByPnr`.
 */
export default function SearchPage(): JSX.Element {
  const [selectedTrainNumber, setSelectedTrainNumber] = useState<string | null>(null);
  const { searchByTrainNumber, trainResult, isSearchingTrain, trainSearchError, selectDeliveryStation } =
    useTrainSearch();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<TrainSearchFormValues>({
    resolver: zodResolver(trainSearchSchema),
    mode: 'onBlur',
  });

  const onSubmit = (values: TrainSearchFormValues): void => {
    setSelectedTrainNumber(values.trainNumber);
    searchByTrainNumber(values);
  };

  return (
    <>
      <Helmet>
        <title>Search your train — RailBite</title>
      </Helmet>

      <div className="mx-auto flex max-w-lg flex-col gap-6 py-10">
        <h1 className="text-2xl font-bold text-neutral-900">Find your train</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          {trainSearchError && <Alert variant="error">{trainSearchError}</Alert>}

          <Input
            label="Train number"
            inputMode="numeric"
            placeholder="e.g. 12345"
            error={errors.trainNumber?.message}
            {...register('trainNumber')}
          />
          <Input
            label="Journey date"
            type="date"
            error={errors.journeyDate?.message}
            {...register('journeyDate')}
          />

          <Button type="submit" isLoading={isSearchingTrain} disabled={!isValid || isSearchingTrain}>
            Search
          </Button>
        </form>

        {trainResult && (
          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <h2 className="mb-2 font-semibold text-neutral-900">
              {trainResult.trainName} ({trainResult.trainNumber})
            </h2>
            <p className="mb-3 text-sm text-neutral-500">
              Select a delivery station at least {DELIVERY_WINDOW_MINUTES} minutes before arrival.
            </p>
            <ul className="flex flex-col divide-y divide-neutral-100">
              {trainResult.stops.map((stop) => (
                <li key={stop.stationCode} className="flex items-center justify-between py-2 text-sm">
                  <span>
                    {stop.stationName} ({stop.stationCode})
                  </span>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      selectedTrainNumber && selectDeliveryStation(selectedTrainNumber, stop.stationCode)
                    }
                  >
                    Deliver here
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
