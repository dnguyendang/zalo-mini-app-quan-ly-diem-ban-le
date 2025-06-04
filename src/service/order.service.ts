import { OrderDetailResponse, OrderFormData, OrderListResponse, CreateOrderResponse } from '@/types/order';
import { API_BASE_URL } from '@/constants/config';
import { getUserInfo } from 'zmp-sdk';

// Hàm helper để lấy Zalo ID của người dùng
const getUserZaloId = async () => {
    try {
        const result = await getUserInfo();
        if (result && result.userInfo && result.userInfo.id) {
            return result.userInfo.id;
        }
        throw new Error('Không thể lấy Zalo ID');
    } catch (error) {
        console.error('Error getting Zalo ID:', error);
        throw new Error('Không thể lấy Zalo ID. Vui lòng thử lại.');
    }
};

export const getOrders = async (params?: {
    search?: string;
    state_filter?: string;
    product_filter?: string;
    page?: number;
    page_size?: number;
}): Promise<OrderListResponse> => {
    try {
        const zaloId = await getUserZaloId();
        const queryParams = new URLSearchParams();
        queryParams.append('zalo_user_id', zaloId);
        
        // Thêm các params vào query string
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
        if (params?.state_filter) queryParams.append('state_filter', params.state_filter);
        if (params?.product_filter) queryParams.append('product_filter', params.product_filter);
        if (params?.search) queryParams.append('search', params.search);

        const response = await fetch(`${API_BASE_URL}/orders/api?${queryParams.toString()}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            console.error('API Error:', response.status, response.statusText);
            const errorText = await response.text();
            console.error('Error details:', errorText);
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('API Response:', data);
        return data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};

export const getOrderDetail = async (orderId: number): Promise<OrderDetailResponse> => {
    // console.log('=== getOrderDetail called ===');
    // console.log('orderId:', orderId);
    // console.log('API_BASE_URL:', API_BASE_URL);
    // console.log('Fetching order detail...');
    try {
        const response = await fetch(`${API_BASE_URL}/orders/api/${orderId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            console.error('API Error:', response.status, response.statusText);
            const errorText = await response.text();
            console.error('Error details:', errorText);
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('API Response:', data);
        return data;
    } catch (error) {
        console.error('Error fetching order detail:', error);
        throw error;
    }
};

export const createOrder = async (orderData: OrderFormData): Promise<CreateOrderResponse> => {
    try {
        const zaloId = await getUserZaloId();
        const formData = {
            zalo_user_id: zaloId,
            product: orderData.product,
            quantity: orderData.quantity,
            details: orderData.details || ''
        };

        const response = await fetch(`${API_BASE_URL}/orders/api/create`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            console.error('API Error:', response.status, response.statusText);
            const errorText = await response.text();
            console.error('Error details:', errorText);
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        return data;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

export const receiveOrder = async (orderId: number): Promise<void> => {
    try {
        const zaloId = await getUserZaloId();
        const response = await fetch(`${API_BASE_URL}/orders/api/${orderId}/receive`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                zalo_user_id: zaloId
            })
        });

        if (!response.ok) {
            console.error('API Error:', response.status, response.statusText);
            const errorText = await response.text();
            console.error('Error details:', errorText);
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('Error receiving order:', error);
        throw error;
    }
};

export const cancelOrder = async (orderId: number, cancelledReason: string): Promise<void> => {
    // console.log('=== cancelOrder called ===');
    // console.log('orderId:', orderId);
    // console.log('cancelledReason:', cancelledReason);
    try {
        const zaloId = await getUserZaloId();
        const response = await fetch(`${API_BASE_URL}/orders/api/${orderId}/cancel`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                zalo_user_id: zaloId,
                cancelled_reason: cancelledReason
            })
        });

        if (!response.ok) {
            console.error('API Error:', response.status, response.statusText);
            const errorText = await response.text();
            console.error('Error details:', errorText);
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('Error cancelling order:', error);
        throw error;
    }
};