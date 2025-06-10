import { Retailer } from '@/types/retailer';
import { API_BASE_URL } from '@/constants/config';
import { getUserInfo } from 'zmp-sdk';

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
        console.log('API Response:', data);
        return data;
        
    } catch (error) {
        console.error('Error fetching retailer detail:', error);
        throw error;
    }
};

