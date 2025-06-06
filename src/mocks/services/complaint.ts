import { mockComplaints } from '../data/complaints';
import { Complaint, ComplaintDetailResponse, CreateComplaintResponse } from '@/types/complaint';

export const ComplaintService = {
  getComplaints: async (page: number = 1, pageSize: number = 10): Promise<{
    total: number;
    page: number;
    page_size: number;
    items: Complaint[];
  }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const items = mockComplaints.slice(start, end);

    return {
      total: mockComplaints.length,
      page,
      page_size: pageSize,
      items
    };
  },

  getComplaintById: async (id: number): Promise<ComplaintDetailResponse | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const complaint = mockComplaints.find(complaint => complaint.id === id);
    if (!complaint) return null;

    // Simulate additional complaint details
    return {
      ...complaint,
      handler: complaint.state !== 'draft' ? 'Nguyễn Văn X' : undefined,
      confirmed_date: complaint.state === 'confirmed' ? '2024-03-15 10:30' : undefined,
      response: complaint.state === 'proccessed' ? 'Đã kiểm tra và xử lý sự cố' : undefined,
      processed_date: complaint.state === 'proccessed' ? '2024-03-15 14:30' : undefined,
      done_date: complaint.state === 'done' ? '2024-03-15 16:00' : undefined
    };
  },

  createComplaint: async (data: { category: string; content: string; priority?: string }): Promise<CreateComplaintResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const newComplaint: Complaint = {
      id: mockComplaints.length + 1,
      name: `KN-${String(mockComplaints.length + 1).padStart(3, '0')}`,
      category: data.category,
      content: data.content,
      priority: data.priority,
      state: 'draft',
      create_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
      user_id: 1
    };

    mockComplaints.push(newComplaint);

    return {
      status: 'success',
      complaint_id: newComplaint.id,
      message: 'Khiếu nại đã được ghi nhận'
    };
  },

  searchComplaints: async (query: string): Promise<Complaint[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));

    const searchTerm = query.toLowerCase();
    return mockComplaints.filter(complaint => 
      complaint.name.toLowerCase().includes(searchTerm) ||
      complaint.category.toLowerCase().includes(searchTerm) ||
      complaint.content.toLowerCase().includes(searchTerm)
    );
  }
}; 