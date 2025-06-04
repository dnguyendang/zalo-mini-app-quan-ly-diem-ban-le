import { BlogDetailResponse, BlogListResponse } from '@/types/blog';
import { API_BASE_URL } from '@/constants/config';

export const getBlogList = async (page: number = 1, pageSize: number = 10): Promise<BlogListResponse> => {
    try {
        console.log('Calling API:', `${API_BASE_URL}/blog/api/posts?page=${page}&page_size=${pageSize}`);
        
        const response = await fetch(`${API_BASE_URL}/blog/api/posts?page=${page}&page_size=${pageSize}`, {
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
        console.error('Error fetching blog list:', error);
        throw error;
    }
};

export const getBlogDetail = async (id: number): Promise<BlogDetailResponse> => {
    try {
        console.log('Calling API:', `${API_BASE_URL}/blog/api/posts/${id}`);
        
        const response = await fetch(`${API_BASE_URL}/blog/api/posts/${id}`, {
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
        console.error('Error fetching blog detail:', error);
        throw error;
    }
}; 