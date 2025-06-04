import React, { useEffect, useState } from 'react';
import { Box, Button, Input, Modal, Page, Spinner, Text } from 'zmp-ui';
import styled from 'styled-components';
import tw from 'twin.macro';
import { useNavigate, useParams } from 'react-router-dom';
import { ComplaintDetailResponse, COMPLAINT_STATES } from '@/types/complaint';
import { getComplaintDetail, ratingComplaint } from '@/service/complaint.servive';
import PageLayout from '@/components/layout/PageLayout';

const Container = styled(Box)`
    ${tw`p-4 max-w-4xl mx-auto`}
`;

const ComplaintCard = styled(Box)`
    ${tw`bg-white rounded-lg shadow-sm p-4`}
`;

const ComplaintHeader = styled(Box)`
    ${tw`flex justify-between items-center mb-4`}
`;

const ComplaintInfo = styled(Box)`
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

const FormGroup = styled(Box)`
    ${tw`mb-4`}
`;

const Label = styled(Text)`
    ${tw`block mb-2 text-gray-700`}
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

const ComplaintDetailPage: React.FC = () => {
    const { complaintId } = useParams<{ complaintId: string }>();
    const navigate = useNavigate();
    const [complaint, setComplaint] = useState<ComplaintDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [rating, setRating] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState('');

    console.log('ComplaintDetailPage rendered with complaintId:', complaintId);

    useEffect(() => {
        console.log('ComplaintDetailPage useEffect triggered');
        if (complaintId) {
            console.log('Calling fetchComplaintDetail with complaintId:', complaintId);
            fetchComplaintDetail();
        } else {
            console.log('No complaintId provided');
            setError('Mã khiếu nại không hợp lệ');
            setLoading(false);
        }
    }, [complaintId]);

    const fetchComplaintDetail = async () => {
        console.log('fetchComplaintDetail started');
        try {
            setLoading(true);
            setError(null);
            console.log('Before API call');
            const data = await getComplaintDetail(Number(complaintId));
            console.log('After API call, data:', data);
            setComplaint(data);
        } catch (error) {
            console.error('Error in fetchComplaintDetail:', error);
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Không thể tải thông tin khiếu nại. Vui lòng thử lại sau.'); 
            }
            setComplaint(null);
        } finally {
            console.log('fetchComplaintDetail completed');
            setLoading(false);
        }
    };


    const handleRatingComplaint = async () => {
        if (!rating.trim()) {
            setError('Vui lòng chọn đánh giá');
            return;
        }

        try {
            setSubmitting(true);
            setError(null);
            console.log('Rating complaint:', complaintId);
            await ratingComplaint(Number(complaintId), rating, feedback);
            console.log('Complaint rated successfully');
            setShowRatingModal(false);
            setRating('');
            setFeedback('');
            await fetchComplaintDetail(); // Refresh order data
        } catch (error) {
            console.error('Error rating complaint:', error);
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Không thể đánh giá khiếu nại. Vui lòng thử lại sau.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const canRating = complaint?.state == 'processed';

    if (loading) {
        return (
            <PageLayout title="Chi tiết khiếu nại" id="complaint-detail">
                <LoadingWrapper>
                    <Spinner />
                </LoadingWrapper>
            </PageLayout>
        );
    }

    if (!complaint) {
        return (
            <PageLayout title="Chi tiết khiếu nại" id="complaint-detail">
                <Container>
                    <ErrorMessage>
                        <Text>Không tìm thấy khiếu nại</Text>
                    </ErrorMessage>
                    <Box flex justifyContent="center" mt={4}>
                        <Button variant="secondary" onClick={() => navigate('/complaints')}>
                            Quay lại danh sách
                        </Button>
                    </Box>
                </Container>
            </PageLayout>
        );
    }

    return (
        <PageLayout title="Chi tiết khiếu nại" id="complaint-detail">
            <Container>
                {error && (
                    <ErrorMessage>
                        <Text>{error}</Text>
                    </ErrorMessage>
                )}

                <ComplaintCard>
                    <ComplaintHeader>
                        <Text.Title>{complaint.name}</Text.Title>
                        <Text className={getStateColor(complaint.state)}>
                            {getStateLabel(complaint.state)}
                        </Text>
                    </ComplaintHeader>

                    <ComplaintInfo>
                        <InfoGroup>
                            <InfoRow>
                                <InfoLabel>Thể loại</InfoLabel>
                                <InfoValue>{complaint.category}</InfoValue>
                            </InfoRow>
                            <InfoRow>
                                <InfoLabel>Nội dung</InfoLabel>
                                <InfoValue>{complaint.content}</InfoValue>
                            </InfoRow>
                            {complaint.priority && (
                                <InfoRow>
                                    <InfoLabel>Mức độ</InfoLabel>
                                    <InfoValue>{complaint.priority}</InfoValue>
                                </InfoRow>
                            )}
                        </InfoGroup>

                        <InfoGroup>
                            <InfoRow>
                                <InfoLabel>Ngày tạo</InfoLabel>
                                <InfoValue>{complaint.create_date}</InfoValue>
                            </InfoRow>
                        </InfoGroup>
                        
                        
                        {complaint.handler && (
                            <InfoGroup>
                                <InfoRow>
                                    <InfoLabel>Người xử lý</InfoLabel>
                                    <InfoValue>{complaint.handler}</InfoValue>
                                </InfoRow>
                                {complaint.confirmed_date && (
                                    <InfoRow>
                                        <InfoLabel>Ngày tiếp nhận</InfoLabel>
                                        <InfoValue>{complaint.confirmed_date}</InfoValue>
                                    </InfoRow>
                                )}
                            </InfoGroup>
                        )}
                       

                        {complaint.processed_date && (
                            <InfoGroup>
                                <InfoRow>
                                    <InfoLabel>Ngày kết thúc xử lý</InfoLabel>
                                    <InfoValue>{complaint.processed_date}</InfoValue>
                                </InfoRow>
                                {complaint.response && (
                                    <InfoRow>
                                        <InfoLabel>Nội dung xử lý</InfoLabel>
                                        <InfoValue>{complaint.response}</InfoValue>
                                    </InfoRow>
                                )}
                            </InfoGroup>
                        )}

                        {complaint.done_date && (
                            <InfoGroup>
                                <InfoRow>
                                    <InfoLabel>Ngày đóng phiếu</InfoLabel>
                                    <InfoValue>{complaint.done_date}</InfoValue>
                                </InfoRow>
                            </InfoGroup>
                        )}

                        {complaint.rating && (
                            <InfoGroup>
                                <InfoRow>
                                    <InfoLabel>Đánh giá</InfoLabel>
                                    <InfoValue>{complaint.rating}</InfoValue>
                                </InfoRow>
                                {complaint.feedback && (
                                    <InfoRow>
                                        <InfoLabel>Phản hồi của khách hàng</InfoLabel>
                                        <InfoValue>{complaint.feedback}</InfoValue>
                                    </InfoRow>
                                )}
                            </InfoGroup>
                        )}
                    </ComplaintInfo>

                    <ActionButtons>
                        <Button 
                            variant="secondary" 
                            onClick={() => navigate('/complaints')} 
                        >
                            Quay lại
                        </Button>
                        {canRating && (
                            <Button
                                variant="primary"
                                onClick={() => setShowRatingModal(true)}
                                disabled={submitting}
                            >
                                Đánh giá
                            </Button>
                        )}
                    </ActionButtons>
                </ComplaintCard>

                <Modal
                    visible={showRatingModal}
                    title="Đánh giá"
                    onClose={() => {
                        setShowRatingModal(false);
                        setRating('');
                        setFeedback('');
                        setError(null);
                    }}
                    actions={[
                        {
                            text: 'Huỷ',
                            onClick: () => {
                                setShowRatingModal(false);
                                setRating('');
                                setFeedback('');
                                setError(null);
                            }
                        },
                        {
                            text: 'Gửi đánh giá',
                            onClick: handleRatingComplaint,
                            disabled: submitting || !rating.trim()
                        }
                    ]}
                >
                    <Box p={4}>
                        <Text.Title size="small" className="mb-4">
                            Vui lòng đánh giá khiếu nại
                        </Text.Title>
                        <FormGroup>
                            <Label>Mức độ hài lòng</Label>
                            <select
                                className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                                disabled={submitting}
                            >
                                <option value="">-- Chọn mức độ hài lòng --</option>
                                <option value="1">Rất không hài lòng</option>
                                <option value="2">Không hài lòng</option>
                                <option value="3">Bình thường</option>
                                <option value="4">Hài lòng</option>
                                <option value="5">Rất hài lòng</option>
                            </select>
                        </FormGroup>

                        <FormGroup>
                            <Label>Góp ý phản hồi</Label>
                            <Input
                                type="text"
                                placeholder="Nhập góp ý của bạn về cách xử lý..."
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                disabled={submitting}
                            />
                        </FormGroup>
                    </Box>
                </Modal>
            </Container>
        </PageLayout>
    );
};

export default ComplaintDetailPage; 