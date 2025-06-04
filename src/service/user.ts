import { API_BASE_URL } from '@/constants/config';
import { getUserInfo, getAccessToken } from 'zmp-sdk';

interface CheckZaloIdResponse {
  status: string;
  message: string;
  is_linked: boolean;
  user_id: number | null;
}

interface LinkAccountResponse {
  status: string;
  message: string;
  user_id: number;
}

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

const getZaloAccessToken = async () => {
    try {
        const result = await getAccessToken();
        console.log('Zalo Access Token:', result);
        return result;
    } catch (error) {
        console.error('Error getting Zalo Access Token:', error);
        throw new Error('Không thể lấy Zalo Access Token. Vui lòng thử lại.');
    }
};

export const userService = {

    checkZaloId: async (): Promise<CheckZaloIdResponse> => {
        try {
            const zaloId = await getUserZaloId();   
            const response = await fetch(`${API_BASE_URL}/users/api/check-id?zalo_user_id=${zaloId}`, {
                method: 'GET',
                headers: {
                'Accept': 'application/json',
                },
            });
        
            if (!response.ok) {
                console.error('API Error:', response.status, response.statusText);
                const errorText = await response.text();
                console.error('Error details:', errorText);
                throw new Error('Failed to check Zalo ID');
            }
            const data = await response.json();
            console.log('API Response:', data);
            return data;
        } catch (error) {
            console.error('Error checking Zalo ID:', error);
            throw error;
        }
    },
  
    linkAccount: async (phoneToken: string): Promise<LinkAccountResponse> => {
        try {
            const zaloId = await getUserZaloId();
            const accessToken = await getZaloAccessToken();
            const response = await fetch(`${API_BASE_URL}/users/api/link-account`, {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                },
                body: JSON.stringify({
                    zalo_user_id: zaloId,
                    zalo_phone_token: phoneToken,
                    access_token: accessToken,
                }),
            });
        
            if (!response.ok) {
                console.error('API Error:', response.status, response.statusText);
                const errorText = await response.text();
                console.error('Error details:', errorText);
                throw new Error('Không thể liên kết tài khoản');
            }
            const data = await response.json();
            console.log('API Response:', data);
            return data;
        } catch (error) {
            console.error('Error linking account:', error);
            throw error;
        }
    },
  }; 