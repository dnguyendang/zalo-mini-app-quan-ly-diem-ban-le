import { Order } from '@/types/order';

export const mockOrders: Order[] = [
  {
    id: 1,
    name: "ĐH-001",
    product: "Sim 4G MobiFone",
    quantity: 50,
    state: "confirmed",
    create_date: "2024-03-15 10:30",
    user_id: 1,
    details: "Giao trong giờ hành chính"
  },
  {
    id: 2,
    name: "ĐH-002",
    product: "Thẻ cào MobiFone 100k",
    quantity: 100,
    state: "shipping",
    create_date: "2024-03-15 14:45",
    user_id: 1,
    details: "Giao tại địa chỉ cửa hàng"
  },
  {
    id: 3,
    name: "ĐH-003",
    product: "Thiết bị phát Wifi 4G",
    quantity: 10,
    state: "draft",
    create_date: "2024-03-16 09:15",
    user_id: 2,
    details: "Cần giao gấp"
  },
  {
    id: 4,
    name: "ĐH-004",
    product: "Sim 5G MobiFone",
    quantity: 25,
    state: "cancelled",
    create_date: "2024-03-14 16:20",
    user_id: 2,
    details: "Đặt nhầm số lượng",
    cancelled_reason: "Khách hàng yêu cầu hủy"
  },
  {
    id: 5,
    name: "ĐH-005",
    product: "Thẻ cào MobiFone 50k",
    quantity: 200,
    state: "received",
    create_date: "2024-03-13 11:00",
    user_id: 1,
    details: "Đã nhận đủ hàng"
  }
]; 