import { getPhoneNumber } from 'zmp-sdk';

export const requirePermission = async () => {
  try {
    const phone = await getPhoneNumber({});
    const { token } = phone;
    console.log('Token:', token);
    
    if (!token) {
      throw new Error('Không thể lấy được token số điện thoại');
    }
    console.log('Successfully got phone token');
    return token;
  } catch (error) {
    console.error("Error getting phone token:", error);
    throw error;
  }
};