export interface Complaint {
    id: number;
    name: string;
    category: string;
    content: string;
    priority?: string;
    state: 'draft' | 'confirmed' | 'proccessed' | 'done';
    create_date: string;
    user_id: number;
    rating?: string; 
    feedback?: string;
}

export interface ComplaintListResponse {
    total: number;
    page: number;
    page_size: number;
    items: Complaint[];
}

export interface ComplaintDetailResponse {
    id: number;
    name: string;
    category: string;
    content: string;
    priority: string;
    state: string;
    create_date: string;
    handler?: string;
    confirmed_date?: string;
    response?: string; 
    processed_date?: string;
    done_date?: string;
    feedback?: string;
    rating?: string;
}

export interface ComplaintFormData {
    category: string;
    content: string;
    priority?: string;
}

export interface ComplaintState {
    value: string;
    label: string;
}

export const COMPLAINT_STATES: ComplaintState[] = [
    { value: '', label: '-- Trạng thái --' },
    { value: 'draft', label: 'Chờ tiếp nhận' },
    { value: 'confirmed', label: 'Đang xử lý' },
    { value: 'processed', label: 'Đã xử lý' },
    { value: 'done', label: 'Hoàn thành' },
];

export interface CreateComplaintResponse {
    status: string;
    complaint_id: number;
    message: string;
} 