import { mockRetailPoints } from '../data/retails';
import { RetailPoint } from '@/types/retail';

export const RetailService = {
  getRetailPoints: async (page: number = 1, pageSize: number = 10): Promise<{
    total: number;
    page: number;
    page_size: number;
    items: RetailPoint[];
  }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const items = mockRetailPoints.slice(start, end);

    return {
      total: mockRetailPoints.length,
      page,
      page_size: pageSize,
      items
    };
  },

  getRetailPointById: async (id: number): Promise<RetailPoint | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const point = mockRetailPoints.find(point => point.id === id);
    return point || null;
  },

  searchRetailPoints: async (query: string): Promise<RetailPoint[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));

    const searchTerm = query.toLowerCase();
    return mockRetailPoints.filter(point => 
      point.name.toLowerCase().includes(searchTerm) ||
      point.address.toLowerCase().includes(searchTerm)
    );
  }
}; 