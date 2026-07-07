export interface SubmitRatingPayload {
  orderId: string;
  stars: number;
  reviewText?: string;
}
