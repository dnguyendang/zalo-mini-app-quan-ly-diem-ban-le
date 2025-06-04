import React, { useEffect, useState } from 'react';
import { Box, Button, Input, Page, Select, Spinner, Text } from 'zmp-ui';
import styled from 'styled-components';
import tw from 'twin.macro';
import { useNavigate } from 'react-router-dom';
import { Complaint, COMPLAINT_STATES } from '@/types/complaint';
import { getComplaints } from '@/service/complaint.servive';
import PageLayout from '@/components/layout/PageLayout';
import { useStore } from "@/store";

const Container = styled(Box)`
    ${tw`p-4 max-w-4xl mx-auto`}
`;

const SearchBar = styled(Box)`
    ${tw`flex flex-col gap-3 mb-4`}
`;

const FilterRow = styled(Box)`
    ${tw`flex gap-3`}
`;

const OrderList = styled(Box)`
    ${tw`space-y-4`}
`;

const ComplaintCard = styled(Box)`
    ${tw`bg-white rounded-lg shadow-sm p-4`}
`;

const ComplaintHeader = styled(Box)`
    ${tw`flex justify-between items-center mb-3`}
`;

const ComplaintInfo = styled(Box)`
    ${tw`grid grid-cols-2 gap-2`}
`;

const InfoItem = styled(Box)`
    ${tw`flex flex-col`}
`;

const InfoLabel = styled(Text)`
    ${tw`text-sm text-gray-600`}
`;

const InfoValue = styled(Text)`
    ${tw`font-medium`}
`;

const LoadingWrapper = styled(Box)`
    ${tw`flex justify-center items-center h-48`}
`;

const ErrorMessage = styled(Box)`
    ${tw`bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4`}
`;

const UserInfo = styled.div`
    ${tw`text-wth_a70 text-xs ml-auto`}
`;

const getStateColor = (state: string) => {
    switch (state) {
        case 'draft':
            return 'text-red-500';
        case 'confirmed':
            return 'text-yellow-600';
        case 'processed':
            return 'text-blue-600';
        case 'done':
            return 'text-green-600';
        default:
            return 'text-gray-600';
    }
};

const getStateLabel = (state: string) => {
    return COMPLAINT_STATES.find(s => s.value === state)?.label || state;
};

const ComplaintListPage: React.FC = () => {
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [stateFilter, setStateFilter] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const user = useStore(state => state.user);

    useEffect(() => {
        fetchComplaints();
    }, [search, stateFilter]);

    const fetchComplaints = async (isLoadMore = false) => {
        try {
            setLoading(true);
            setError(null);
            const currentPage = isLoadMore ? page + 1 : 1;

            const response = await getComplaints({
                search,
                state_filter: stateFilter,
                page: currentPage,
                page_size: 10
            });

            const items = response?.items || [];

            if (isLoadMore) {
                setComplaints(prev => [...prev, ...items]);
                setPage(currentPage);
            } else {
                setComplaints(items);
                setPage(1);
            }

            setHasMore(items.length === 10);
        } catch (error) {
            console.error('Error fetching orders:', error);
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.');
            }
            setComplaints([]);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = (complaintId: number) => {
        navigate(`/complaints/${complaintId}`);
    };

    const handleCreateComplaint = () => {
        navigate('/complaints/create');
    };

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            fetchComplaints(true);
        }
    };

    return (
        <PageLayout title="Danh sách khiếu nại" id="complaint-list">
            <Container>
                <UserInfo>{user?.id}</UserInfo>
                <SearchBar>
                    <Input
                        placeholder="Tìm kiếm theo mã khiếu nại hoặc thể loại..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        clearable
                    />
                    <FilterRow>
                        <Box className="flex-1">
                            <select
                                className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                value={stateFilter}
                                onChange={(e) => setStateFilter(e.target.value)}
                            >
                                {COMPLAINT_STATES.map((state) => (
                                    <option key={state.value} value={state.value}>
                                        {state.label}
                                    </option>
                                ))}
                            </select>
                        </Box>
                        <Button variant="primary" onClick={handleCreateComplaint}>
                            Tạo khiếu nại mới
                        </Button>
                    </FilterRow>
                </SearchBar>

                <OrderList>
                    {complaints.map((complaint) => (
                        <ComplaintCard key={complaint.id} onClick={() => handleViewDetail(complaint.id)}>
                            <ComplaintHeader>
                                <Text.Title size="small">{complaint.name}</Text.Title>
                                <Text className={getStateColor(complaint.state)}>
                                    {getStateLabel(complaint.state)}
                                </Text>
                            </ComplaintHeader>
                            <ComplaintInfo>
                                <InfoItem>
                                    <InfoLabel>Thể loại</InfoLabel>
                                    <InfoValue>{complaint.category}</InfoValue>
                                </InfoItem>
                                <InfoItem>
                                    <InfoLabel>Mức độ</InfoLabel>
                                    <InfoValue>{complaint.priority}</InfoValue>
                                </InfoItem>

                                <InfoItem>
                                    <InfoLabel>Ngày tạo</InfoLabel>
                                    <InfoValue>{complaint.create_date}</InfoValue>
                                </InfoItem>
                            </ComplaintInfo>
                        </ComplaintCard>
                    ))}

                    {loading && (
                        <LoadingWrapper>
                            <Spinner />
                        </LoadingWrapper>
                    )}

                    {!loading && complaints.length === 0 && (
                        <Box className="text-center py-8">
                            <Text className="text-gray-500">
                                {error ? 'Vui lòng thử lại sau' : 'Không có khiếu nại nào'}
                            </Text>
                        </Box>
                    )}

                    {!loading && hasMore && complaints.length > 0 && (
                        <Box className="text-center mt-4">
                            <Button variant="secondary" onClick={handleLoadMore}>
                                Tải thêm
                            </Button>
                        </Box>
                    )}
                </OrderList>
            </Container>
        </PageLayout>
    );
};

export default ComplaintListPage; 