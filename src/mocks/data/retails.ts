import { RetailPoint } from '@/types/retail';

export const mockRetailPoints: RetailPoint[] = [
  {
    id: 1,
    name: "MobiFone Cửa hàng Quận 1",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    phone: "028.1234.5678",
    email: "ch.quan1@mobifone.vn",
    working_hours: "8:00 - 17:30",
    status: "active",
    location: {
      latitude: 10.7731,
      longitude: 106.7039
    },
    manager: "Nguyễn Văn A",
    services: ["Đăng ký thuê bao", "Thanh toán cước", "Bán thiết bị"],
    rating: 4.5,
    total_reviews: 128
  },
  {
    id: 2,
    name: "MobiFone Cửa hàng Quận 3",
    address: "456 Võ Văn Tần, Quận 3, TP.HCM",
    phone: "028.1234.5679",
    email: "ch.quan3@mobifone.vn",
    working_hours: "8:00 - 17:30",
    status: "active",
    location: {
      latitude: 10.7785,
      longitude: 106.6891
    },
    manager: "Trần Thị B",
    services: ["Đăng ký thuê bao", "Thanh toán cước", "Bán thiết bị", "Hỗ trợ kỹ thuật"],
    rating: 4.3,
    total_reviews: 95
  }
]; 