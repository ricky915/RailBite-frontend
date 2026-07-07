/**
 * Shared domain interfaces (Section 3.4 / 12.2). These mirror the backend's
 * Mongoose document shapes but expose `id` (never raw `_id`) and use
 * camelCase throughout, per the API response contract (Section 26).
 */

export type UserRole =
  | 'passenger'
  | 'restaurant_manager'
  | 'restaurant_staff'
  | 'support_exec'
  | 'admin'
  | 'super_admin';

export interface User {
  id: string;
  name: string;
  mobile: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  profilePhotoUrl: string | null;
  preferences: {
    dietaryTags: string[];
    cuisinePrefs: string[];
  };
  notificationSettings: {
    emailMarketing: boolean;
    smsMarketing: boolean;
    inApp: boolean;
  };
  createdAt: string;
}

export type RestaurantStatus = 'open' | 'busy' | 'closed';

export interface Restaurant {
  id: string;
  name: string;
  cuisineTypes: string[];
  isPureVeg: boolean;
  rating: number;
  ratingCount: number;
  minOrderValueInPaise: number;
  estimatedDeliveryMinutes: number;
  status: RestaurantStatus;
  acceptingOrdersUntil: string | null;
  isFeatured: boolean;
  bannerImageUrl: string | null;
  logoImageUrl: string | null;
  stationCodes: string[];
}

export interface MenuItemCustomizationOption {
  label: string;
  additionalChargeInPaise: number;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  priceInPaise: number;
  isVeg: boolean;
  imageUrl: string | null;
  isAvailable: boolean;
  preparationMinutes: number;
  customizationOptions: MenuItemCustomizationOption[];
}

export interface MenuCategory {
  id: string;
  restaurantId: string;
  name: string;
  isAvailable: boolean;
  items: MenuItem[];
}

export interface CartItemCustomization {
  label: string;
  value: string;
  additionalChargeInPaise: number;
}

export interface CartItem {
  menuItemId: string;
  name: string;
  priceInPaise: number;
  quantity: number;
  customizations: CartItemCustomization[];
  specialNote: string | null;
}

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'ORDER_PLACED'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'COMPLETED';

export type PaymentMode = 'online' | 'cod';
export type PaymentStatus = 'pending' | 'captured' | 'failed' | 'refunded' | 'partial_refund';

export interface OrderStatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;
  note: string | null;
}

export interface Order {
  id: string;
  orderId: string;
  restaurantId: string;
  restaurantName: string;
  trainNumber: string;
  pnr: string | null;
  boardingStation: string;
  deliveryStation: string;
  deliveryStationEta: string;
  coach: string;
  seat: string;
  items: CartItem[];
  subtotalInPaise: number;
  deliveryFeeInPaise: number;
  platformFeeInPaise: number;
  gstAmountInPaise: number;
  couponDiscountInPaise: number;
  grandTotalInPaise: number;
  couponCode: string | null;
  paymentMode: PaymentMode;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  statusHistory: OrderStatusHistoryEntry[];
  createdAt: string;
}

export type CouponDiscountType = 'percentage' | 'flat' | 'free_delivery';

export interface Coupon {
  code: string;
  discountType: CouponDiscountType;
  discountValue: number;
  maxDiscountInPaise: number | null;
  minOrderValueInPaise: number;
}

export interface Rating {
  id: string;
  orderId: string;
  restaurantId: string;
  userId: string;
  stars: number;
  reviewText: string | null;
  photoUrls: string[];
  restaurantResponse: string | null;
  createdAt: string;
}

export type SupportTicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  category: string;
  description: string;
  orderId: string | null;
  status: SupportTicketStatus;
  createdAt: string;
}

export interface Invoice {
  orderId: string;
  invoiceNumber: string;
  pdfUrl: string;
  issuedAt: string;
}

export interface TrainStop {
  stationCode: string;
  stationName: string;
  scheduledArrival: string | null;
  scheduledDeparture: string | null;
  distanceKm: number;
}

export interface Train {
  trainNumber: string;
  trainName: string;
  stops: TrainStop[];
}
