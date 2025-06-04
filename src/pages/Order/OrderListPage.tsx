import React, { useEffect, useState } from 'react';
import { Box, Button, Input, Page, Select, Spinner, Text } from 'zmp-ui';
import styled from 'styled-components';
import tw from 'twin.macro';
import { useNavigate } from 'react-router-dom';
import { Order, ORDER_STATES } from '@/types/order';
import { getOrders } from '@/service/order.service';
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

const OrderCard = styled(Box)`
    ${tw`bg-white rounded-lg shadow-sm p-4`}
`;

const OrderHeader = styled(Box)`
    ${tw`flex justify-between items-center mb-3`}
`;

const OrderInfo = styled(Box)`
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
            return 'text-gray-500';
        case 'confirmed':
            return 'text-blue-600';
        case 'shipping':
            return 'text-yellow-600';
        case 'received':
            return 'text-green-600';
        case 'cancelled':
            return 'text-red-600';
        default:
            return 'text-gray-600';
    }
};

const getStateLabel = (state: string) => {
    return ORDER_STATES.find(s => s.value === state)?.label || state;
};

const OrderListPage: React.FC = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [stateFilter, setStateFilter] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const user = useStore(state => state.user);

    useEffect(() => {
        fetchOrders();
    }, [search, stateFilter]);

    const fetchOrders = async (isLoadMore = false) => {
        try {
            setLoading(true);
            setError(null);
            const currentPage = isLoadMore ? page + 1 : 1;

            const response = await getOrders({
                search,
                state_filter: stateFilter,
                page: currentPage,
                page_size: 10
            });

            const items = response?.items || [];

            if (isLoadMore) {
                setOrders(prev => [...prev, ...items]);
                setPage(currentPage);
            } else {
                setOrders(items);
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
            setOrders([]);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = (orderId: number) => {
        navigate(`/orders/${orderId}`);
    };

    const handleCreateOrder = () => {
        navigate('/orders/create');
    };

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            fetchOrders(true);
        }
    };

    return (
        <PageLayout title="Danh sách đơn hàng" id="order-list">
            <Container>
                <UserInfo>{user?.id}</UserInfo>
                <SearchBar>
                    <Input
                        placeholder="Tìm kiếm theo mã đơn hoặc sản phẩm..."
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
                                {ORDER_STATES.map((state) => (
                                    <option key={state.value} value={state.value}>
                                        {state.label}
                                    </option>
                                ))}
                            </select>
                        </Box>
                        <Button variant="primary" onClick={handleCreateOrder}>
                            Tạo đơn mới
                        </Button>
                    </FilterRow>
                </SearchBar>

                <OrderList>
                    {orders.map((order) => (
                        <OrderCard key={order.id} onClick={() => handleViewDetail(order.id)}>
                            <OrderHeader>
                                <Text.Title size="small">{order.name}</Text.Title>
                                <Text className={getStateColor(order.state)}>
                                    {getStateLabel(order.state)}
                                </Text>
                            </OrderHeader>
                            <OrderInfo>
                                <InfoItem>
                                    <InfoLabel>Sản phẩm</InfoLabel>
                                    <InfoValue>{order.product}</InfoValue>
                                </InfoItem>
                                <InfoItem>
                                    <InfoLabel>Số lượng</InfoLabel>
                                    <InfoValue>{order.quantity}</InfoValue>
                                </InfoItem>
                                <InfoItem>
                                    <InfoLabel>Ngày tạo</InfoLabel>
                                    <InfoValue>{order.create_date}</InfoValue>
                                </InfoItem>
                            </OrderInfo>
                        </OrderCard>
                    ))}

                    {loading && (
                        <LoadingWrapper>
                            <Spinner />
                        </LoadingWrapper>
                    )}

                    {!loading && orders.length === 0 && (
                        <Box className="text-center py-8">
                            <Text className="text-gray-500">
                                {error ? 'Vui lòng thử lại sau' : 'Không có đơn hàng nào'}
                            </Text>
                        </Box>
                    )}

                    {!loading && hasMore && orders.length > 0 && (
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

export default OrderListPage; 