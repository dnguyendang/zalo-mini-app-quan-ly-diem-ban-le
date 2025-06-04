import React from 'react';
import { Box, Text } from 'zmp-ui';
import styled from 'styled-components';
import tw from 'twin.macro';
import { BlogPost } from '@/types/blog';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '@/constants/config';

interface BlogCardProps {
    blog: BlogPost;
}

const Card = styled.div`
    ${tw`bg-white rounded-lg shadow-md overflow-hidden mb-4`}
`;

const Image = styled.img`
    ${tw`w-full h-48 object-cover`}
`;

const Content = styled(Box)`
    ${tw`p-4`}
`;

const Title = styled(Text.Title)`
    ${tw`mb-2 line-clamp-2`}
`;

const Subtitle = styled(Text)`
    ${tw`text-gray-600 line-clamp-3`}
`;

const MetaInfo = styled(Box)`
    ${tw`flex justify-between items-center text-gray-500 text-sm mt-2`}
`;

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
    const navigate = useNavigate();
    
    const handleClick = () => {
        navigate(`/blog/${blog.id}`);
    };

    return (
        <Card onClick={handleClick}>
            <Image src={`${API_BASE_URL}${blog.cover_image_url}`} alt={blog.name} />
            <Content>
                <Title size="small">{blog.name}</Title>
                <Subtitle>{blog.subtitle}</Subtitle>
                <MetaInfo>
                    <Text size="xxSmall">
                        {blog.post_date || blog.create_date}
                    </Text>
                    <Text size="xxSmall">
                        {blog.visits} lượt xem
                    </Text>
                </MetaInfo>
            </Content>
        </Card>
    );
};

export default BlogCard; 