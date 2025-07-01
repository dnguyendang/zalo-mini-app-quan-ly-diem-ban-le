import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkRetailerExist } from "@/service/retailer.service";

const RetailerRouterPage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const check = async () => {
            try {
                const exists = await checkRetailerExist();
                if (exists) {
                    navigate("/retailer/detail", { replace: true });
                } else {
                    navigate("/retailer/create", { replace: true });
                }
            } catch {
                // Nếu lỗi, có thể điều hướng về trang tạo mới hoặc trang lỗi
                navigate("/", { replace: true });
            }
        };
        check();
    }, [navigate]);

    return <div>Đang kiểm tra trạng thái đăng ký...</div>;
};

export default RetailerRouterPage;