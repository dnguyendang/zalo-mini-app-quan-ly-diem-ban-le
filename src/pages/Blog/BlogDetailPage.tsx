import React, { useEffect, useState } from 'react';
import { Box, Page, Text, Spinner } from 'zmp-ui';
import styled from 'styled-components';
import tw from 'twin.macro';
import { useParams } from 'react-router-dom';
import { BlogPost } from '@/types/blog';
import { getBlogDetail } from '@/service/blog.service';
import { API_BASE_URL } from '@/constants/config';
import PageLayout from '@/components/layout/PageLayout';

const Container = styled(Box)`
    ${tw`p-3 max-w-4xl mx-auto`}
`;

const ContentWrapper = styled(Box)`
    ${tw`bg-white rounded shadow-sm p-3 mb-8`}
`;

const CoverImage = styled.img`
    ${tw`w-full h-64 object-cover rounded mb-6`}
`;

const Title = styled(Text.Title)`
    ${tw`mb-4 text-2xl font-bold text-gray-900`}
`;

const Subtitle = styled(Text)`
    ${tw`text-gray-600 mb-6 text-lg`}
`;

const Content = styled.div`
    ${tw`text-justify leading-relaxed text-gray-800`}

    h1 {
        ${tw`text-3xl font-bold mb-3 mt-3 text-gray-900`}
    }
    h2 {
        ${tw`text-2xl font-semibold mb-3 mt-3 text-gray-900`}
    }
    h3 {
        ${tw`text-xl font-semibold mb-2 mt-2 text-gray-900`}
    }
    h4 {
        ${tw`text-lg font-medium mb-2 mt-2 text-gray-900`}
    }
    h5, h6 {
        ${tw`text-base font-medium mb-2 mt-2 text-gray-900`}
    }
    p {
        ${tw`mb-2`}
    }
    img {
        ${tw`max-w-full h-auto rounded-lg my-6 mx-auto`}
    }
    ul, ol {
        ${tw`ml-6 mb-3 space-y-2`}
    }
    li {
        ${tw`text-gray-700`}
    }
    a {
        ${tw`text-blue-600 hover:text-blue-800 underline`}
    }
    blockquote {
        ${tw`border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600`}
    }
    pre {
        ${tw`bg-gray-100 rounded-lg p-4 my-4 overflow-x-auto`}
    }
    code {
        ${tw`bg-gray-100 rounded px-1 py-0.5 text-sm`}
    }
`;

const MetaInfo = styled(Box)`
    ${tw`flex flex-col gap-2 text-gray-500 text-sm mb-6`}
`;

const LoadingWrapper = styled(Box)`
    ${tw`flex justify-center items-center h-screen`}
`;

const Footer = styled(Box)`
    ${tw`flex flex-col items-center justify-center py-8 mt-8 border-t border-gray-200`}
`;

const Logo = styled.img`
    ${tw`h-12 mb-4`}
`;

const FooterText = styled(Text)`
    ${tw`text-gray-500 text-sm text-center`}
`;

const BlogDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [blog, setBlog] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogDetail = async () => {
            try {
                setLoading(true);
                const response = await getBlogDetail(Number(id));
                setBlog(response.post);
            } catch (error) {
                console.error('Error fetching blog detail:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBlogDetail();
        }
    }, [id]);

    if (loading) {
        return (
            <PageLayout title="Đang tải..." id="blog-detail">
                <LoadingWrapper>
                    <Spinner />
                </LoadingWrapper>
            </PageLayout>
        );
    }

    if (!blog) {
        return (
            <PageLayout title="Không tìm thấy" id="blog-detail">
                <Container>
                    <Text>Không tìm thấy bài viết</Text>
                </Container>
            </PageLayout>
        );
    }

    return (
        <PageLayout title={blog.name} id="blog-detail">
            <Container>
                <ContentWrapper>
                    <CoverImage src={`${API_BASE_URL}${blog.cover_image_url}`} alt={blog.name} />
                    <Title>{blog.name}</Title>
                    <MetaInfo>
                        <Text>Ngày đăng: {blog.post_date || blog.create_date}</Text>
                        <Text>Lượt xem: {blog.visits}</Text>
                        {blog.website_meta_description && (
                            <Text>{blog.website_meta_description}</Text>
                        )}
                    </MetaInfo>
                    <Subtitle>{blog.subtitle}</Subtitle>
                    <Content dangerouslySetInnerHTML={{ __html: blog.content }} />
                </ContentWrapper>
                <Footer>
                    <Logo src="/icons/logo.png" alt="MobiFone Logo" />
                    <FooterText>
                        © 2025 MobiFone. Tất cả quyền được bảo lưu.
                    </FooterText>
                    <FooterText>
                        Cổng thông tin chính thức của MobiFone
                    </FooterText>
                </Footer>
            </Container>
        </PageLayout>
    );
};

export default BlogDetailPage; 