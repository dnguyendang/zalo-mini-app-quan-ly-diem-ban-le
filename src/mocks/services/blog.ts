import { mockBlogPosts } from '../data/blog';
import { BlogPost } from '@/types/blog';

export const BlogService = {
  getPosts: async (page: number = 1, pageSize: number = 10): Promise<{
    total: number;
    page: number;
    page_size: number;
    items: BlogPost[];
  }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const items = mockBlogPosts.slice(start, end);

    return {
      total: mockBlogPosts.length,
      page,
      page_size: pageSize,
      items
    };
  },

  getPostById: async (id: number): Promise<BlogPost | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const post = mockBlogPosts.find(post => post.id === id);
    return post || null;
  }
}; 