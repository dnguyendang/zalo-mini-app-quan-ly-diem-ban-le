export interface Order {
    id: number;
    name: string;
    product: string;
    quantity: number;
    state: 'draft' | 'confirmed' | 'shipping' | 'received' | 'cancelled';
    create_date: string;
    user_id: number;
    details?: string;
    cancelled_reason?: string;
    
}

export interface OrderListResponse {
    total: number;
    page: number;
    page_size: number;
    items: Order[];
}

export interface OrderDetailResponse {
    id: number;
    name: string;
    product: string;
    quantity: number;
    details: string;
    state: string;
    create_date: string;
    confirmer?: string;
    confirmed_date?: string;
    shipper?: string;
    shipping_date?: string;
    canceller?: string;
    cancelled_date?: string;
    cancelled_reason?: string;
    receiver?: string;
    received_date?: string;
    diem_ban_le_name?: string;
}

export interface OrderFormData {
    product: string;
    quantity: number;
    details?: string;
}

export interface OrderState {
    value: string;
    label: string;
}

export const ORDER_STATES: OrderState[] = [
    { value: '', label: '-- Trạng thái --' },
    { value: 'draft', label: 'Chờ xác nhận' },
    { value: 'confirmed', label: 'Đã xác nhận' },
    { value: 'shipping', label: 'Đang giao' },
    { value: 'received', label: 'Đã nhận' },
    { value: 'cancelled', label: 'Đã huỷ' }
]; 

export interface CreateOrderResponse {
    status: string;
    order_id: number;
    message: string;
} 