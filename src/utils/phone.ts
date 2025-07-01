import { getPhoneNumber } from 'zmp-sdk';

export const requirePermission = async () => {
  try {
    const phone = await getPhoneNumber({});
    const { token } = phone;
    if (!token) {
      throw new Error('Failed to get phone token');
    }
    console.log('Successfully got phone token');
    return token;
  } catch (error) {
    console.error("Error getting phone token:", error);
    throw error;
  }
};