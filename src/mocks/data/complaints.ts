import { Complaint } from '@/types/complaint';

export const mockComplaints: Complaint[] = [
  {
    id: 1,
    name: "KN-001",
    category: "Chất lượng dịch vụ",
    content: "Tốc độ mạng 4G chậm trong khu vực Quận 1",
    priority: "high",
    state: "confirmed",
    create_date: "2024-03-15 09:30",
    user_id: 1,
  },
  {
    id: 2,
    name: "KN-002",
    category: "Hóa đơn & Thanh toán",
    content: "Cước phí tháng 3 cao bất thường",
    priority: "medium",
    state: "done",
    create_date: "2024-03-14 14:20",
    user_id: 2,
    rating: "4",
    feedback: "Đã được xử lý nhanh chóng"
  },
  {
    id: 3,
    name: "KN-003",
    category: "Thái độ nhân viên",
    content: "Nhân viên cửa hàng Quận 3 thiếu nhiệt tình",
    priority: "low",
    state: "draft",
    create_date: "2024-03-16 11:15",
    user_id: 1
  },
  {
    id: 4,
    name: "KN-004",
    category: "Kỹ thuật",
    content: "Không thể kết nối mạng sau khi thay sim 5G",
    priority: "high",
    state: "done",
    create_date: "2024-03-13 16:45",
    user_id: 3,
    rating: "5",
    feedback: "Rất hài lòng với cách xử lý"
  },
  {
    id: 5,
    name: "KN-005",
    category: "Khuyến mãi",
    content: "Không nhận được ưu đãi như quảng cáo",
    priority: "medium",
    state: "confirmed",
    create_date: "2024-03-15 13:30",
    user_id: 2
  }
]; 