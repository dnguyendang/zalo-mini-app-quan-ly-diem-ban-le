import { ComplaintDetailResponse, ComplaintFormData, ComplaintListResponse, CreateComplaintResponse } from '@/types/complaint';
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

export const getComplaints = async (params?: {
    search?: string;
    state_filter?: string;
    category_filter?: string;
    page?: number;
    page_size?: number;
}): Promise<ComplaintListResponse> => {
    try {
        const zaloId = await getUserZaloId();
        const queryParams = new URLSearchParams();
        queryParams.append('zalo_user_id', zaloId);
        
        // Thêm các params vào query string
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
        if (params?.state_filter) queryParams.append('state_filter', params.state_filter);
        if (params?.category_filter) queryParams.append('category_filter', params.category_filter);
        if (params?.search) queryParams.append('search', params.search);

        const response = await fetch(`${API_BASE_URL}/complaints/api?${queryParams.toString()}`, {
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

export const getComplaintDetail = async (complaintId: number): Promise<ComplaintDetailResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/complaints/api/${complaintId}`, { 
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

export const createComplaint = async (complaintData: ComplaintFormData): Promise<CreateComplaintResponse> => {
    try {
        const zaloId = await getUserZaloId();
        const formData = {
            zalo_user_id: zaloId,
            category: complaintData.category,
            content: complaintData.content,
            priority: complaintData.priority    
        };

        const response = await fetch(`${API_BASE_URL}/complaints/api/create`, {
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
        console.error('Error creating complaint:', error);
        throw error;
    }
};

export const ratingComplaint = async (complaintId: number, rating: string, feedback: string): Promise<void> => {
    try {
        const zaloId = await getUserZaloId();
        const requestData = {
            zalo_user_id: zaloId,
            rating: rating,
            feedback: feedback
        };
        
        console.log('Rating complaint with data:', {
            complaintId,
            ...requestData
        });

        const response = await fetch(`${API_BASE_URL}/complaints/api/${complaintId}/rating`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: JSON.stringify(requestData)
        });

        const responseText = await response.text();
        console.log('Rating response:', {
            status: response.status,
            statusText: response.statusText,
            body: responseText
        });

        if (!response.ok) {
            console.error('API Error:', response.status, response.statusText);
            const errorText = await response.text();
            console.error('Error details:', errorText);
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('Error rating complaint:', error);
        throw error;
    }
};