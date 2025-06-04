import React, { useState } from 'react';
import { Box, Button, Input, Page, Select, Text } from 'zmp-ui';
import styled from 'styled-components';
import tw from 'twin.macro';
import { useNavigate } from 'react-router-dom';
import { ComplaintFormData } from '@/types/complaint';
import { createComplaint } from '@/service/complaint.servive';
import PageLayout from '@/components/layout/PageLayout';

const Container = styled(Box)`
    ${tw`p-4 max-w-4xl mx-auto`}
`;

const Card = styled(Box)`
    ${tw`bg-white rounded-lg shadow-sm p-4 mb-4`}
`;

const CardTitle = styled(Text.Title)`
    ${tw`text-lg mb-4`}
`;

const FormGroup = styled(Box)`
    ${tw`mb-4`}
`;

const Label = styled(Text)`
    ${tw`block mb-2 text-gray-700`}
`;

const ErrorText = styled(Text)`
    ${tw`text-red-500 text-sm mt-1`}
`;

const ButtonGroup = styled(Box)`
    ${tw`flex gap-3 mt-6`}
`;

interface FormErrors {
    category?: string;
    content?: string;
}

const CATERGORY_OPTIONS = [
    { value: 'product', label: 'Sản phẩm' },
    { value: 'service', label: 'Dịch vụ' },
    { value: 'policy', label: 'Chính sách' },
    { value: 'other', label: 'Khác' },
];

const PRIORITY_OPTIONS = [
    { value: 'medium', label: 'Trung bình' },
    { value: 'high', label: 'Cao' },
];

const ComplaintCreatePage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<ComplaintFormData>({
        category: '',
        content: '',
        priority: 'medium',
    });
    const [errors, setErrors] = useState<FormErrors>({});

    const validateForm = () => {
        const newErrors: FormErrors = {};

        if (!formData.category) {
            newErrors.category = 'Vui lòng chọn loại khiếu nại';
        }

        if (!formData.content) {
            newErrors.content = 'Vui lòng nhập nội dung khiếu nại';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            const response = await createComplaint(formData);
            navigate(`/complaints/${response.complaint_id}`);
        } catch (error) {
            console.error('Error creating complaint:', error);
        }
    };

    const handleCancel = () => {
        navigate('/complaints');
    };

    return (
        <PageLayout title="Tạo khiếu nại mới" id="complaint-create">
            <Container>
                <Card>
                    <CardTitle>Thông tin khiếu nại</CardTitle>

                    <FormGroup>
                        <Label>Loại khiếu nại</Label>
                        <select
                            className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            value={formData.category}
                            onChange={(e) =>
                                setFormData({ ...formData, category: e.target.value })
                            }
                        >
                            <option value="">Chọn loại khiếu nại</option>
                            {CATERGORY_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {errors.category && <ErrorText>{errors.category}</ErrorText>}
                    </FormGroup>

                    <FormGroup>
                        <Label>Độ ưu tiên</Label>
                        <select
                            className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            value={formData.priority}
                            onChange={(e) =>
                                setFormData({ ...formData, priority: e.target.value })
                            }
                        >
                            <option value="">Chọn độ ưu tiên</option>
                            {PRIORITY_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </FormGroup>

                    <FormGroup>
                        <Label>Nội dung khiếu nại</Label>
                        <Input
                            type="text"
                            placeholder="Nhập nội dung khiếu nại"
                            value={formData.content}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    content: e.target.value,
                                })
                            }
                        />
                        {errors.content && <ErrorText>{errors.content}</ErrorText>}
                    </FormGroup>
                </Card>

                <ButtonGroup>
                    <Button variant="secondary" onClick={handleCancel}>
                        Huỷ
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Tạo khiếu nại
                    </Button>
                </ButtonGroup>
            </Container>
        </PageLayout>
    );
};

export default ComplaintCreatePage;
