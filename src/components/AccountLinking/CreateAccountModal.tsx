import React, { useState } from "react";
import { Modal, Box, Button, Input, Text } from "zmp-ui";

interface CreateAccountModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
    userService: {
        createAccount: (name: string, email: string, password: string) => Promise<{ status: string; message: string; error?: string }>;
    };
}

const CreateAccountModal: React.FC<CreateAccountModalProps> = ({
    visible,
    onClose,
    onSuccess,
    userService,
}) => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!form.name || !form.email || !form.password || !form.confirmPassword) {
            setError("Vui lòng nhập đầy đủ thông tin.");
            return;
        }
        if (form.password !== form.confirmPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            return;
        }
        setLoading(true);
        try {
            const data = await userService.createAccount(
                form.name,
                form.email,
                form.password
            );
            if (data.status === "success") {
                onSuccess();
                onClose();
            } else {
                setError(data.error || data.message || "Đăng ký thất bại");
            }
        } catch (err: any) {
            setError(err.message || "Đăng ký thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} onClose={onClose} title="Đăng ký tài khoản hệ thống">
            <Text className="text-center mb-4">
                Bạn chưa có tài khoản hệ thống?
                Vui lòng điền thông tin để tạo tài khoản mới.
            </Text>
            <form onSubmit={handleSubmit}>
                <Box p={4} className="space-y-4">
                    <Input
                        name="name"
                        label="Họ và tên"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        name="email"
                        label="Email"
                        type="text"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        name="password"
                        label="Mật khẩu"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        name="confirmPassword"
                        label="Xác nhận mật khẩu"
                        type="password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    {error && <Text className="text-danger">{error}</Text>}
                    <Button
                        htmlType="submit"
                        fullWidth
                        loading={loading}
                        variant="primary"
                        size="large"
                    >
                        Đăng ký
                    </Button>
                    <Button fullWidth variant="secondary" onClick={onClose}>
                        Hủy
                    </Button>
                </Box>
            </form>
        </Modal>
    );
};

export default CreateAccountModal;