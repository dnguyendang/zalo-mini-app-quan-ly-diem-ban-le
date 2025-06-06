export interface RetailPoint {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  working_hours: string;
  status: 'active' | 'inactive';
  location: {
    latitude: number;
    longitude: number;
  };
  manager: string;
  services: string[];
  rating: number;
  total_reviews: number;
} 