import React, { useState } from 'react';
import { Box, Button, Input, Page, Select, Text } from 'zmp-ui';
import styled from 'styled-components';
import tw from 'twin.macro';
import { useNavigate } from 'react-router-dom';
import { OrderFormData } from '@/types/order';
import { createOrder } from '@/service/order.service';
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
    product?: string;
    quantity?: string;
}

const PRODUCT_OPTIONS = [
    { value: 'sim', label: 'Sim' },
    { value: 'dienthoai', label: 'Điện thoại' },
];

const OrderCreatePage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<OrderFormData>({
        product: '',
        quantity: 1,
        details: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});

    const validateForm = () => {
        const newErrors: FormErrors = {};

        if (!formData.product) {
            newErrors.product = 'Vui lòng chọn sản phẩm';
        }

        if (!formData.quantity || formData.quantity < 1) {
            newErrors.quantity = 'Số lượng phải lớn hơn 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            const response = await createOrder(formData);
            navigate(`/orders/${response.order_id}`);
        } catch (error) {
            console.error('Error creating order:', error);
        }
    };

    const handleCancel = () => {
        navigate('/orders');
    };

    return (
        <PageLayout title="Tạo đơn hàng mới" id="order-create">
            <Container>
                <Card>
                    <CardTitle>Thông tin đơn hàng</CardTitle>

                    <FormGroup>
                        <Label>Sản phẩm</Label>
                        <select
                            className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            value={formData.product}
                            onChange={(e) =>
                                setFormData({ ...formData, product: e.target.value })
                            }
                        >
                            <option value="">Chọn sản phẩm</option>
                            {PRODUCT_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {errors.product && <ErrorText>{errors.product}</ErrorText>}
                    </FormGroup>

                    <FormGroup>
                        <Label>Số lượng</Label>
                        <Input
                            type="number"
                            placeholder="Nhập số lượng"
                            value={formData.quantity}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    quantity: parseInt(e.target.value) || 0,
                                })
                            }
                        />
                        {errors.quantity && <ErrorText>{errors.quantity}</ErrorText>}
                    </FormGroup>

                    <FormGroup>
                        <Label>Ghi chú</Label>
                        <Input
                            type="text"
                            placeholder="Nhập ghi chú (nếu có)"
                            value={formData.details || ''}
                            onChange={(e) =>
                                setFormData({ ...formData, details: e.target.value })
                            }
                        />
                    </FormGroup>
                </Card>

                <ButtonGroup>
                    <Button variant="secondary" onClick={handleCancel}>
                        Huỷ
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Tạo đơn
                    </Button>
                </ButtonGroup>
            </Container>
        </PageLayout>
    );
};

export default OrderCreatePage; 