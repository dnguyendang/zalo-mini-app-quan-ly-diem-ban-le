import React, { useEffect, useState } from 'react';
import { Box, Button, Input, Modal, Page, Spinner, Text } from 'zmp-ui';
import styled from 'styled-components';
import tw from 'twin.macro';
import { useNavigate, useParams } from 'react-router-dom';
import { OrderDetailResponse, ORDER_STATES } from '@/types/order';
import { cancelOrder, getOrderDetail, receiveOrder } from '@/service/order.service';
import PageLayout from '@/components/layout/PageLayout';

const Container = styled(Box)`
    ${tw`p-4 max-w-4xl mx-auto`}
`;

const OrderCard = styled(Box)`
    ${tw`bg-white rounded-lg shadow-sm p-4`}
`;

const OrderHeader = styled(Box)`
    ${tw`flex justify-between items-center mb-4`}
`;

const OrderInfo = styled(Box)`
    ${tw`space-y-4`}
`;

const InfoGroup = styled(Box)`
    ${tw`border-t pt-4`}
`;

const InfoRow = styled(Box)`
    ${tw`flex justify-between items-center`}
`;

const InfoLabel = styled(Text)`
    ${tw`text-gray-600`}
`;

const InfoValue = styled(Text)`
    ${tw`font-medium`}
`;

const ActionButtons = styled(Box)`
    ${tw`flex gap-3 mt-6`}
`;

const LoadingWrapper = styled(Box)`
    ${tw`flex justify-center items-center h-48`}
`;

const ErrorMessage = styled(Box)`
    ${tw`bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4`}
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

const OrderDetailPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<OrderDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [submitting, setSubmitting] = useState(false);

    console.log('OrderDetailPage rendered with orderId:', orderId);

    useEffect(() => {
        console.log('OrderDetailPage useEffect triggered');
        if (orderId) {
            console.log('Calling fetchOrderDetail with orderId:', orderId);
            fetchOrderDetail();
        } else {
            console.log('No orderId provided');
            setError('Mã đơn hàng không hợp lệ');
            setLoading(false);
        }
    }, [orderId]);

    const fetchOrderDetail = async () => {
        console.log('fetchOrderDetail started');
        try {
            setLoading(true);
            setError(null);
            console.log('Before API call');
            const data = await getOrderDetail(Number(orderId));
            console.log('After API call, data:', data);
            setOrder(data);
        } catch (error) {
            console.error('Error in fetchOrderDetail:', error);
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.');
            }
            setOrder(null);
        } finally {
            console.log('fetchOrderDetail completed');
            setLoading(false);
        }
    };

    const handleReceiveOrder = async () => {
        if (!window.confirm('Bạn có chắc chắn muốn xác nhận đã nhận hàng?')) {
            return;
        }

        try {
            setSubmitting(true);
            setError(null);
            await receiveOrder(Number(orderId));
            await fetchOrderDetail(); // Refresh order data
        } catch (error) {
            console.error('Error receiving order:', error);
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Không thể xác nhận nhận hàng. Vui lòng thử lại sau.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!cancelReason.trim()) {
            setError('Vui lòng nhập lý do hủy đơn');
            return;
        }

        try {
            setSubmitting(true);
            setError(null);
            console.log('Cancelling order:', orderId);
            await cancelOrder(Number(orderId), cancelReason);
            console.log('Order cancelled successfully');
            setShowCancelModal(false);
            setCancelReason('');
            await fetchOrderDetail(); // Refresh order data
        } catch (error) {
            console.error('Error cancelling order:', error);
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Không thể hủy đơn hàng. Vui lòng thử lại sau.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const canCancel = order?.state !== 'received' && order?.state !== 'cancelled';
    const canReceive = order?.state === 'shipping';

    if (loading) {
        return (
            <PageLayout title="Chi tiết đơn hàng" id="order-detail">
                <LoadingWrapper>
                    <Spinner />
                </LoadingWrapper>
            </PageLayout>
        );
    }

    if (!order) {
        return (
            <PageLayout title="Chi tiết đơn hàng" id="order-detail">
                <Container>
                    <ErrorMessage>
                        <Text>Không tìm thấy đơn hàng</Text>
                    </ErrorMessage>
                    <Box flex justifyContent="center" mt={4}>
                        <Button variant="secondary" onClick={() => navigate('/orders')}>
                            Quay lại danh sách
                        </Button>
                    </Box>
                </Container>
            </PageLayout>
        );
    }

    return (
        <PageLayout title="Chi tiết đơn hàng" id="order-detail">
            <Container>
                {error && (
                    <ErrorMessage>
                        <Text>{error}</Text>
                    </ErrorMessage>
                )}

                <OrderCard>
                    <OrderHeader>
                        <Text.Title>{order.name}</Text.Title>
                        <Text className={getStateColor(order.state)}>
                            {getStateLabel(order.state)}
                        </Text>
                    </OrderHeader>

                    <OrderInfo>
                        <InfoGroup>
                            <InfoRow>
                                <InfoLabel>Sản phẩm</InfoLabel>
                                <InfoValue>{order.product}</InfoValue>
                            </InfoRow>
                            <InfoRow>
                                <InfoLabel>Số lượng</InfoLabel>
                                <InfoValue>{order.quantity}</InfoValue>
                            </InfoRow>
                            {order.details && (
                                <InfoRow>
                                    <InfoLabel>Chi tiết</InfoLabel>
                                    <InfoValue>{order.details}</InfoValue>
                                </InfoRow>
                            )}
                        </InfoGroup>

                        <InfoGroup>
                            <InfoRow>
                                <InfoLabel>Ngày tạo</InfoLabel>
                                <InfoValue>{order.create_date}</InfoValue>
                            </InfoRow>
                        </InfoGroup>
                        
                        
                        {order.confirmer && (
                            <InfoGroup>
                                <InfoRow>
                                    <InfoLabel>Người xác nhận</InfoLabel>
                                    <InfoValue>{order.confirmer}</InfoValue>
                                </InfoRow>
                                {order.confirmed_date && (
                                    <InfoRow>
                                        <InfoLabel>Ngày xác nhận</InfoLabel>
                                        <InfoValue>{order.confirmed_date}</InfoValue>
                                    </InfoRow>
                                )}
                            </InfoGroup>
                        )}
                       

                        {order.shipper && (
                            <InfoGroup>
                                <InfoRow>
                                    <InfoLabel>Người giao hàng</InfoLabel>
                                    <InfoValue>{order.shipper}</InfoValue>
                                </InfoRow>
                                {order.shipping_date && (
                                    <InfoRow>
                                        <InfoLabel>Ngày giao hàng</InfoLabel>
                                        <InfoValue>{order.shipping_date}</InfoValue>
                                    </InfoRow>
                                )}
                            </InfoGroup>
                        )}

                        {order.receiver && (
                            <InfoGroup>
                                <InfoRow>
                                    <InfoLabel>Người nhận</InfoLabel>
                                    <InfoValue>{order.receiver}</InfoValue>
                                </InfoRow>
                                {order.received_date && (
                                    <InfoRow>
                                        <InfoLabel>Ngày nhận</InfoLabel>
                                        <InfoValue>{order.received_date}</InfoValue>
                                    </InfoRow>
                                )}
                            </InfoGroup>
                        )}

                        {order.canceller && (
                            <InfoGroup>
                                <InfoRow>
                                    <InfoLabel>Người hủy</InfoLabel>
                                    <InfoValue>{order.canceller}</InfoValue>
                                </InfoRow>
                                {order.cancelled_date && (
                                    <InfoRow>
                                        <InfoLabel>Ngày hủy</InfoLabel>
                                        <InfoValue>{order.cancelled_date}</InfoValue>
                                    </InfoRow>
                                )}
                                {order.cancelled_reason && (
                                    <InfoRow>
                                        <InfoLabel>Lý do hủy</InfoLabel>
                                        <InfoValue>{order.cancelled_reason}</InfoValue>
                                    </InfoRow>
                                )}
                            </InfoGroup>
                        )}
                    </OrderInfo>

                    <ActionButtons>
                        <Button 
                            variant="secondary" 
                            onClick={() => navigate('/orders')}
                        >
                            Quay lại
                        </Button>
                        {canReceive && (
                            <Button
                                variant="primary"
                                onClick={handleReceiveOrder}
                                disabled={submitting}
                            >
                                Đã nhận
                            </Button>
                        )}
                        {canCancel && (
                            <Button
                                variant="tertiary"
                                onClick={() => setShowCancelModal(true)}
                                disabled={submitting}
                                className="text-red-600"
                            >
                                Hủy đơn
                            </Button>
                        )}
                    </ActionButtons>
                </OrderCard>

                <Modal
                    visible={showCancelModal}
                    title="Hủy đơn hàng"
                    onClose={() => {
                        setShowCancelModal(false);
                        setCancelReason('');
                        setError(null);
                    }}
                    actions={[
                        {
                            text: 'Đóng',
                            onClick: () => {
                                setShowCancelModal(false);
                                setCancelReason('');
                                setError(null);
                            }
                        },
                        {
                            text: 'Xác nhận hủy',
                            onClick: handleCancelOrder,
                            disabled: submitting || !cancelReason.trim()
                        }
                    ]}
                >
                    <Box p={4}>
                        <Text.Title size="small" className="mb-4">
                            Vui lòng nhập lý do hủy đơn
                        </Text.Title>
                        <Input
                            type="text"
                            placeholder="Nhập lý do hủy đơn..."
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            disabled={submitting}
                        />
                    </Box>
                </Modal>
            </Container>
        </PageLayout>
    );
};

export default OrderDetailPage; 