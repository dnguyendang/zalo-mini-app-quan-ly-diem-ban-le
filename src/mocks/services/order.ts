import { mockOrders } from '../data/orders';
import { Order, OrderDetailResponse, CreateOrderResponse } from '@/types/order';

export const OrderService = {
  getOrders: async (page: number = 1, pageSize: number = 10): Promise<{
    total: number;
    page: number;
    page_size: number;
    items: Order[];
  }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const items = mockOrders.slice(start, end);

    return {
      total: mockOrders.length,
      page,
      page_size: pageSize,
      items
    };
  },

  getOrderById: async (id: number): Promise<OrderDetailResponse | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const order = mockOrders.find(order => order.id === id);
    if (!order) return null;

    // Simulate additional order details
    return {
      ...order,
      confirmer: order.state === 'confirmed' ? 'Nguyễn Văn X' : undefined,
      confirmed_date: order.state === 'confirmed' ? '2024-03-15 11:00' : undefined,
      shipper: order.state === 'shipping' ? 'Trần Văn Y' : undefined,
      shipping_date: order.state === 'shipping' ? '2024-03-15 15:00' : undefined,
      receiver: order.state === 'received' ? 'Lê Thị Z' : undefined,
      received_date: order.state === 'received' ? '2024-03-15 16:30' : undefined,
      canceller: order.state === 'cancelled' ? 'Phạm Văn W' : undefined,
      cancelled_date: order.state === 'cancelled' ? '2024-03-15 17:00' : undefined,
      diem_ban_le_name: 'MobiFone Cửa hàng Quận 1'
    };
  },

  createOrder: async (data: { product: string; quantity: number; details?: string }): Promise<CreateOrderResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const newOrder: Order = {
      id: mockOrders.length + 1,
      name: `ĐH-${String(mockOrders.length + 1).padStart(3, '0')}`,
      product: data.product,
      quantity: data.quantity,
      state: 'draft',
      create_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
      user_id: 1,
      details: data.details
    };

    mockOrders.push(newOrder);

    return {
      status: 'success',
      order_id: newOrder.id,
      message: 'Đơn hàng đã được tạo thành công'
    };
  },

  searchOrders: async (query: string): Promise<Order[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));

    const searchTerm = query.toLowerCase();
    return mockOrders.filter(order => 
      order.name.toLowerCase().includes(searchTerm) ||
      order.product.toLowerCase().includes(searchTerm) ||
      order.details?.toLowerCase().includes(searchTerm)
    );
  }
}; 