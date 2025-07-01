import { CreateRetailerResponse, Retailer } from '@/types/retailer';
import { API_BASE_URL } from '@/constants/config';
import { getUserInfo } from 'zmp-sdk';
import { CreateRetailerPayload } from '@/types/retailer';


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

export const checkRetailerExist = async (): Promise<boolean> => {
    try {   
        const zaloId = await getUserZaloId();
        const response = await fetch(`${API_BASE_URL}/retailers/api?zalo_user_id=${zaloId}`, {
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
        return data.status === '1';

    } catch (error) {
        console.error('Error checking retailer existence:', error); 
        throw error;
    }
};

export const getRetailerDetail = async (): Promise<Retailer> => {
    try {
        const zaloId = await getUserZaloId();
        const response = await fetch(`${API_BASE_URL}/retailers/api/detail?zalo_user_id=${zaloId}`, {
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
        console.log('API getRetailerDetail Response:', data);
        return data;
        
    } catch (error) {
        console.error('Error fetching retailer detail:', error);
        throw error;
    }
};

export const getRetailerFormOptions = async (): Promise<any> => {
    try {
        const response = await fetch(`${API_BASE_URL}/retailers/api/create`, {
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
        console.log('API getRetailerFormOptions Response:', data);
        return data;
    }
    catch (error) {
        console.error('Error fetching retailer form options:', error);
        throw error;
    }
};

export const createRetailer = async (payload: CreateRetailerPayload): Promise<CreateRetailerResponse> => {
    try {
        const zalo_user_id = await getUserZaloId();
        const body = JSON.stringify({...payload, zalo_user_id });

        console.log("Payload gửi lên Odoo:", JSON.stringify({...payload, zalo_user_id }));

        const response = await fetch(`${API_BASE_URL}/retailers/api/create`, {
            method:'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body,
        });

        if (!response.ok) {
            console.error('API Error:', response.status, response.statusText);
            const errorText = await response.text();
            console.error('Error details:', errorText);
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        console.log('API createRetailer Response:', data);
        return data;
    } catch (error) {
        console.error('Error creating retailer:', error);
        throw error;
    }
};
