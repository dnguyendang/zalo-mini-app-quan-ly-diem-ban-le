import React, { useEffect, useState } from 'react';
import { Box, Text, Spinner } from 'zmp-ui';
import { Link } from 'react-router-dom';
import styles from './BlogHighlights.module.css';
import { BlogPost } from '@/types/blog';
import { getBlogList } from '@/service/blog.service';
import { API_BASE_URL } from '@/constants/config';

const BlogHighlights: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await getBlogList(1, 6); // Lấy 4 bài viết mới nhất
        setPosts(response.items);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Không thể tải bài viết. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <Box className={styles.blogSection}>
        <Box className={styles.loadingContainer}>
          <Spinner />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className={styles.blogSection}>
        <Text className={styles.errorText}>{error}</Text>
      </Box>
    );
  }

  return (
    <Box className={styles.blogSection}>
      <Box className={styles.blogHeader}>
        <Text.Title className={styles.blogTitle}>
          Tin tức nổi bật
        </Text.Title>
        <Link to="/blog" className={styles.viewMore}>
          Xem thêm
        </Link>
      </Box>
      
      <Box className={styles.blogList}>
        {posts.map((post) => (
          <Link to={`/blog/${post.id}`} key={post.id} className={styles.blogItem}>
            <img src={`${API_BASE_URL}${post.cover_image_url}`} alt={post.name} className={styles.blogImage} />
            <Box className={styles.blogContent}>
              <Text.Title className={styles.blogItemTitle}>
                {post.name}
              </Text.Title>
              <Box className={styles.blogItemMeta}>
                <Box className={styles.date}>
                  <svg className={styles.timeIcon} viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12.5,7H11V13L16.2,16.2L17,14.9L12.5,12.2V7Z"/>
                  </svg>
                  <Text>{post.post_date}</Text>
                </Box>
                <Box className={styles.viewCount}>
                  <svg className={styles.eyeIcon} viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                  <Text>{post.visits}</Text>
                </Box>
              </Box>
            </Box>
          </Link>
        ))}
      </Box>
    </Box>
  );
};

export default BlogHighlights; 