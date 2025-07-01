import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreateRetailerPayload } from "@/types/retailer";
import { createRetailer, getRetailerFormOptions } from "@/service/retailer.service";
import { Input, DatePicker, Select, Picker, Checkbox, Box, Text, Button  } from "zmp-ui";
import PageLayout from "@/components/layout/PageLayout";
import tw from "twin.macro";
import styled from "styled-components";
import SelectWithArrow from "@/components/select-with-arrow/SelectWithArrow";

const Container = styled.div`
  ${tw`p-0 max-w-4xl mx-auto`}
`;

const ContentWrapper = styled.div`
  ${tw`bg-white rounded shadow-sm p-3 mb-8`}
`;

const Title = styled.h2`
  ${tw`mb-4 text-2xl font-bold text-center`}
`;

const Subtitle = styled.p`
  ${tw`text-gray-800 mb-6 text-center`}
`;

const SectionTitle = styled.h4`
  ${tw`font-semibold text-lg mb-2 mt-4`}
`;

const MetaInfo = styled.div`
  ${tw`flex flex-col gap-2 text-gray-500 text-sm mb-6`}
`;

const Footer = styled.div`
  ${tw`flex flex-col items-center justify-center py-8 mt-8 border-t border-gray-200`}
`;

const Logo = styled.img`
  ${tw`h-12 mb-4`}
`;

const FooterText = styled.p`
  ${tw`text-gray-500 text-sm text-center`}
`;

const initialForm: CreateRetailerPayload = {
    cccd: "",
    ho_ten: "",
    ma_so_thue: "",
    ngay_sinh: "",
    gioi_tinh: "",
    email: "",
    so_dien_thoai: "",
    so_zalo: "",
    facebook: "",
    dia_chi: "",
    phuong_xa: "",
    tinh_thanh: "",
    ngan_hang: "",
    so_tai_khoan: "",
    ten_thu_huong: "",
    anh_chan_dung: "",
    anh_cccd_mat_truoc: "",
    anh_cccd_mat_sau: "",
    he_thong_ids: [],
};

const HE_THONG_LIST = [
    { value: "QLKH", label: "TC&QLKH" },
    { value: "bhtt", label: "Bán hàng tập trung" },
    { value: "msale_pro", label: "MSALEPRO" },
    { value: "my_mobifone_c2c", label: "MY MOBIFONE C2C" },
    { value: "mplus", label: "MPLUS+" },
    { value: "giai_phap_cntt", label: "GIẢI PHÁP CNTT" },
    { value: "m5_c2c", label: "M5_C2C" },
];

const RetailerCreatePage: React.FC = () => {
    const [form, setForm] = useState<CreateRetailerPayload>(initialForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [xacNhan, setXacNhan] = useState(false);
    const [preview, setPreview] = useState({
        anh_chan_dung: "",
        anh_cccd_mat_truoc: "",
        anh_cccd_mat_sau: "",
    });

    const [options, setOptions] = useState<{
        gioi_tinh?: [string, string][];
        phuong_xa?: [string, string][];
        tinh_thanh?: [string, string][];
        ngan_hang?: [string, string][];
    }>({});

    const navigate = useNavigate();

    useEffect(() => {
        getRetailerFormOptions()
            .then((data) => setOptions(data))
            .catch(() => setError("Không lấy được dữ liệu lựa chọn cho form"));
    }, []);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setForm((prev) => {
            const he_thong_ids = prev.he_thong_ids || [];
            return {
                ...prev,
                he_thong_ids: checked
                    ? [...he_thong_ids, value]
                    : he_thong_ids.filter((v) => v !== value),
            };
        });
    };

    // function fileToBase64(file: File): Promise<string> {
    //     return new Promise((resolve, reject) => {
    //         const reader = new FileReader();
    //         reader.onload = () => resolve((reader.result as string).split(",")[1]);
    //         reader.onerror = reject;
    //         reader.readAsDataURL(file);
    //     });
    // }

    // const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const { name, files } = e.target;
    //     if (files && files[0]) {
    //         const base64 = await fileToBase64(files[0]);
    //         setForm((prev) => ({ ...prev, [name]: base64 }));
    //         setPreview((prev) => ({
    //             ...prev,
    //             [name]: URL.createObjectURL(files[0]),
    //         }));
    //     }
    // };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = () => {
                // reader.result là dạng data:image/png;base64,...
                setForm((prev) => ({
                    ...prev,
                    [name]: (reader.result as string).split(",")[1], // chỉ lấy phần base64 để gửi về Odoo
                }));
                setPreview((prev) => ({
                    ...prev,
                    [name]: reader.result as string, // dùng nguyên chuỗi data:image/... để preview
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!xacNhan) {
            setError("Bạn cần xác nhận thông tin chính xác.");
            return;
        }
        if (!form.ngay_sinh) {
            setError("Vui lòng chọn ngày sinh.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await createRetailer(form);
            navigate("/retailer/detail");
        } catch (err: any) {
            setError(err.message || "Đăng ký thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageLayout title="Đăng ký điểm bán lẻ" id="retailer-create">
            <Container>
                <ContentWrapper>
                    {/* <Title>Form đăng ký</Title> */}
                    <form onSubmit={handleSubmit}>
                        <SectionTitle>Thông tin cá nhân</SectionTitle>
                        <Input
                            name="cccd"
                            required
                            value={form.cccd}
                            onChange={handleInputChange}
                            clearable
                            label="Số CCCD *"
                            errorText="Số CCCD không hợp lệ."
                        />
                        <Input
                            name="ho_ten"
                            required
                            value={form.ho_ten} 
                            onChange={handleInputChange}
                            clearable   
                            label="Họ và tên *"
                            errorText="Họ và tên không hợp lệ."
                        />
                        <Input
                            name="ma_so_thue"
                            required
                            value={form.ma_so_thue}
                            onChange={handleInputChange}
                            clearable
                            label="Mã số thuế *"
                            errorText="Mã số thuế không hợp lệ."
                        />
                        <DatePicker
                            value={form.ngay_sinh ? new Date(form.ngay_sinh) : undefined}
                            onChange={date => setForm(prev => ({ ...prev, ngay_sinh: date ? date.toISOString().slice(0, 10) : "" }))}
                            label="Ngày sinh *"
                            placeholder="Chọn ngày sinh"
                        />
                        <SelectWithArrow
                            label="Giới tính *"
                            name="gioi_tinh"
                            value={form.gioi_tinh || ""}
                            required
                            options={options.gioi_tinh || []}
                            onChange={handleInputChange}
                            // placeholder="Chọn giới tính"
                        />
                        
                        <label>Ảnh chân dung *     </label>
                        <input type="file" name="anh_chan_dung" accept="image/*" className="form-control-file" required onChange={handleFileChange} />
                        <div className="mt-2 text-center border p-2" style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgb(181,188,201)", margin: "10px 0 20px 0"}}>
                            {preview.anh_chan_dung ? (
                                <img src={preview.anh_chan_dung} alt="Preview" style={{ maxWidth: "100%", maxHeight: 180 }} />
                            ) : <span className="text-muted">Chưa có ảnh</span>}
                        </div>

                        <label>Ảnh CCCD mặt trước *</label>
                        <input type="file" name="anh_cccd_mat_truoc" accept="image/*" className="form-control-file" required onChange={handleFileChange} />
                        <div className="mt-2 text-center border p-2" style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" , border: "1px solid rgb(181,188,201)", margin:"10px 0 20px 0"}}>
                            {preview.anh_cccd_mat_truoc ? (
                                <img src={preview.anh_cccd_mat_truoc} alt="Preview" style={{ maxWidth: "100%", maxHeight: 180 }} />
                            ) : <span className="text-muted">Chưa có ảnh</span>}
                        </div>

                        <label>Ảnh CCCD mặt sau *</label>
                        <input type="file" name="anh_cccd_mat_sau" accept="image/*" className="form-control-file" required onChange={handleFileChange} />
                        <div className="mt-2 text-center border p-2" style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgb(181,188,201)", margin: "10px 0 20px 0" }}>
                            {preview.anh_cccd_mat_sau ? (
                                <img src={preview.anh_cccd_mat_sau} alt="Preview" style={{ maxWidth: "100%", maxHeight: 180 }} />
                            ) : <span className="text-muted">Chưa có ảnh</span>}
                        </div>

                        <SectionTitle>Thông tin liên hệ</SectionTitle>
                        <Input 
                            name="email"
                            required
                            value={form.email}
                            onChange={handleInputChange}
                            clearable
                            label="Email *"
                            errorText="Email không hợp lệ."
                        />
                        <Input
                            name="so_dien_thoai"
                            required
                            value={form.so_dien_thoai}
                            onChange={handleInputChange}
                            clearable
                            label="Số điện thoại *"
                            errorText="Số điện thoại không hợp lệ."
                        />
                        <Input
                            name="so_zalo"
                            required
                            value={form.so_zalo}
                            onChange={handleInputChange}
                            clearable
                            label="Số Zalo *"
                            errorText="Số Zalo không hợp lệ."
                        />
                        <Input
                            name="facebook"
                            required
                            value={form.facebook}
                            onChange={handleInputChange}
                            clearable
                            label="Tài khoản Facebook *"
                            errorText="Tài khoản Facebook không hợp lệ."
                        />
                        <Input
                            name="dia_chi"
                            value={form.dia_chi}
                            onChange={handleInputChange}
                            clearable
                            label="Địa chỉ *"
                        />
                        <SelectWithArrow
                            label="Phường/Xã"
                            name="phuong_xa"
                            value={form.phuong_xa || ""}
                            required
                            options={options.phuong_xa || []}
                            onChange={handleInputChange}
                            placeholder="Chọn phường/xã"
                        />
                        <SelectWithArrow
                            label="Tỉnh/Thành phố"
                            name="tinh_thanh"
                            value={form.tinh_thanh || ""}
                            required
                            options={options.tinh_thanh || []}
                            onChange={handleInputChange}
                            placeholder="Chọn tỉnh/thành phố"
                        />

                        <SectionTitle>Thông tin bổ sung</SectionTitle>
                        <SelectWithArrow
                            label="Tài khoản ngân hàng"
                            name="ngan_hang"
                            value={form.ngan_hang || ""}
                            required
                            options={options.ngan_hang || []}
                            onChange={handleInputChange}
                            placeholder="Chọn ngân hàng"
                        />
                        <Input
                            name="so_tai_khoan"
                            required
                            value={form.so_tai_khoan}
                            onChange={handleInputChange}
                            clearable
                            label="Số tài khoản *"
                            errorText="Số tài khoản không hợp lệ."
                        />
                        <Input
                            name="ten_thu_huong"
                            required
                            value={form.ten_thu_huong}
                            onChange={handleInputChange}
                            clearable
                            label="Tên người thụ hưởng *"
                            errorText="Tên người thụ hưởng không hợp lệ."   
                        />

                        <SectionTitle>Hệ thống đăng ký</SectionTitle>
                        <Box>
                            {HE_THONG_LIST.map((ht) => (
                                <Checkbox
                                    key={ht.value}
                                    value={ht.value}
                                    checked={form.he_thong_ids?.includes(ht.value)}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        const value = ht.value;
                                        setForm((prev) => ({
                                            ...prev,
                                            he_thong_ids: checked
                                                ? [...(prev.he_thong_ids || []), value]
                                                : (prev.he_thong_ids || []).filter((v) => v !== value),
                                        }));
                                    }}
                                >
                                    {ht.label}
                                </Checkbox>
                            ))}
                        </Box>
                        <MetaInfo>
                            <Text className="text-gray-500">
                                Vui lòng chọn hệ thống mà bạn muốn đăng ký.
                            </Text>
                        </MetaInfo>

                        <SectionTitle>Xác nhận đăng ký</SectionTitle>
                        <Checkbox   
                            value={"xac_nhan"}
                            checked={xacNhan}
                            onChange={() => setXacNhan((v) => !v)}
                            label="Tôi cam đoan những thông tin trên hoàn toàn chính xác."
                            size="medium"
                            defaultChecked
                        />  
                        {error && <div className="text-danger mt-2">{error}</div>}
                        <Button
                            htmlType="submit"
                            variant="primary"
                            loading={loading}
                            fullWidth
                            size="large"
                        >
                            Đăng ký
                        </Button>
                    </form>
                </ContentWrapper>
                <Footer>
                <Logo src="/icons/logo.png" alt="MobiFone Logo" />
                <FooterText>© 2025 MobiFone. Tất cả quyền được bảo lưu.</FooterText>
                <FooterText>Cổng thông tin chính thức của MobiFone</FooterText>
                </Footer>
            </Container>
            </PageLayout>        
    );
};

export default RetailerCreatePage;