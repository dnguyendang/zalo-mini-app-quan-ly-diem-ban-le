import React, { useEffect, useState, useRef } from 'react';
import { Box, Page, Text, Spinner, useNavigate } from 'zmp-ui';
import styled from 'styled-components';
import tw from 'twin.macro';
import { BlogPost, BlogListResponse } from '@/types/blog';
import { getBlogList } from '@/service/blog.service';
import BlogCard from '@/components/blog/BlogCard';
// import ApiDebug from '@/components/debug/ApiDebug';
// import BlogHeader from '@/components/layout/BlogHeader';
import PageLayout from '@/components/layout/PageLayout';
import BlogHighlights from '@/components/BlogHighlights/BlogHighlights';

const Container = styled(Box)`
    ${tw`p-4`}
`;

const LoadingWrapper = styled(Box)`
    ${tw`flex justify-center items-center py-4`}
`;

const ErrorMessage = styled(Text)`
    ${tw`text-red-500 text-center my-4`}
`;

const EmptyMessage = styled(Text)`
    ${tw`text-gray-500 text-center my-4`}
`;

const PaginationContainer = styled(Box)`
    ${tw`flex justify-center items-center gap-2 mt-4`}
`;

const PageButton = styled.button<{ active?: boolean }>`
    ${tw`px-3 py-1 rounded`}
    ${props => props.active 
        ? tw`bg-[#046DD6] text-white` 
        : tw`bg-gray-100 text-gray-600 hover:bg-gray-200`}
`;

const PageDots = styled(Text)`
    ${tw`text-gray-600`}
`;

// interface DebugInfo {
//     lastApiCall: string;
//     lastResponse: BlogListResponse | null;
//     error: unknown | null;
// }

const ITEMS_PER_PAGE = 10;

const BlogListPage: React.FC = () => {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    //     lastApiCall: '',
    //     lastResponse: null,
    //     error: null
    // });

    const fetchBlogs = async (pageNumber: number) => {
        // const apiUrl = `/blog/api/posts?page=${pageNumber}&page_size=${ITEMS_PER_PAGE}`;
        // setDebugInfo(prev => ({ ...prev, lastApiCall: apiUrl }));
        
        try {
            setLoading(true);
            setError(null);
            const response = await getBlogList(pageNumber);
            
            // setDebugInfo(prev => ({ ...prev, lastResponse: response, error: null }));
            
            setBlogs(response.items);
            setTotalPages(Math.ceil(response.total / ITEMS_PER_PAGE));
        } catch (error) {
            console.error('Error in component:', error);
            setError('Không thể tải danh sách bài viết. Vui lòng thử lại sau.');
            // setDebugInfo(prev => ({ ...prev, error }));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs(page);
    }, [page]);

    const handlePageClick = (pageNumber: number) => {
        setPage(pageNumber);
        window.scrollTo(0, 0);
    };

    const renderPagination = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        // Always show first page
        pages.push(
            <PageButton 
                key={1} 
                active={page === 1}
                onClick={() => handlePageClick(1)}
            >
                1
            </PageButton>
        );

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total pages is less than max visible pages
            for (let i = 2; i <= totalPages; i++) {
                pages.push(
                    <PageButton 
                        key={i} 
                        active={page === i}
                        onClick={() => handlePageClick(i)}
                    >
                        {i}
                    </PageButton>
                );
            }
        } else {
            // Show dots and selected range if total pages is more than max visible pages
            if (page > 3) {
                pages.push(<PageDots key="dots1">...</PageDots>);
            }

            // Show current page and surrounding pages
            for (let i = Math.max(2, page - 1); i <= Math.min(page + 1, totalPages - 1); i++) {
                pages.push(
                    <PageButton 
                        key={i} 
                        active={page === i}
                        onClick={() => handlePageClick(i)}
                    >
                        {i}
                    </PageButton>
                );
            }

            if (page < totalPages - 2) {
                pages.push(<PageDots key="dots2">...</PageDots>);
            }

            // Always show last page
            if (totalPages > 1) {
                pages.push(
                    <PageButton 
                        key={totalPages} 
                        active={page === totalPages}
                        onClick={() => handlePageClick(totalPages)}
                    >
                        {totalPages}
                    </PageButton>
                );
            }
        }

        return pages;
    };

    if (error) {
        return (
            <Page>
                {/* <BlogHeader /> */}
                <Container>
                    <ErrorMessage>{error}</ErrorMessage>
                    <Box flex justifyContent="center" mt={4}>
                        <button 
                            onClick={() => fetchBlogs(1)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Thử lại
                        </button>
                    </Box>
                </Container>
                {/* <ApiDebug {...debugInfo} /> */}
            </Page>
        );
    }

    return (
        <PageLayout title="Tin tức - Sự kiện" id="blog-list">
            {/* <BlogHeader /> */}
            <Container>
                {loading ? (
                    <LoadingWrapper>
                        <Spinner />
                    </LoadingWrapper>
                ) : blogs.length === 0 ? (
                    <EmptyMessage>Chưa có bài viết nào</EmptyMessage>
                ) : (
                    <>
                        {/* {blogs.map(blog => (
                            <BlogCard key={blog.id} blog={blog} /> 
                        ))} */}
                        <BlogHighlights />   
                        <PaginationContainer>
                            {renderPagination()}
                        </PaginationContainer>
                    </>
                )}
            </Container>
            {/* <ApiDebug {...debugInfo} /> */}
        </PageLayout>
    );
};

export default BlogListPage; 