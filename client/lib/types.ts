export interface Facilities {
  pool: boolean;
  parking: boolean;
  ac: boolean;
  wifi: boolean;
  breakfast: boolean;
  gym: boolean;
  petFriendly: boolean;
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  address: string;
  price: number | null;
  currency: string;
  rating: number | null;
  reviewCount: number;
  image: string | null;
  images: string[];
  description: string;
  facilities: Facilities;
}

export interface HotelSearchResponse {
  results: Hotel[];
  page: number;
  pages: number;
  total: number;
}

export interface FeaturedResponse {
  results: Hotel[];
}

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface AuthResponse extends User {
  token: string;
}

export interface Booking {
  _id: string;
  user: string;
  hotelId: string;
  hotelName: string;
  hotelAddress: string;
  hotelImage: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  pricePerNight: number;
  totalPrice: number;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface SearchFilters {
  pool: boolean;
  parking: boolean;
  ac: boolean;
  wifi: boolean;
  breakfast: boolean;
}
