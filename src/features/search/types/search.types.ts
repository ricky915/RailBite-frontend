import type { Train } from '@/types/domain.types';

export interface PnrSearchResult {
  train: Train;
  boardingStation: string;
  passengerName: string;
  bookingStatus: 'CONFIRMED' | 'RAC' | 'WAITLISTED';
}

export interface TrainSearchQuery {
  trainNumber?: string;
  pnr?: string;
  journeyDate?: string;
}
