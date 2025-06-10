import React, { useEffect, useState } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import PageLayout from "../../components/layout/PageLayout";
import { Retailer } from "@/types/retailer";
import { getRetailerDetail } from "@/service/retailer.service";
import { useNavigate } from "react-router-dom";
import { Box, Button, Input, Page, Select, Spinner, Text } from 'zmp-ui';
import { useStore } from "@/store";


const Container = styled.div`
  ${tw`p-3 max-w-4xl mx-auto`}
`;

const ContentWrapper = styled.div`
  ${tw`bg-white rounded shadow-sm p-3 mb-8`}
`;

const Title = styled.h2`
  ${tw`mb-4 text-2xl font-bold text-green-600 text-center`}
`;

const Subtitle = styled.p`
  ${tw`text-gray-600 mb-6 text-center`}
`;

const SectionTitle = styled.h4`
  ${tw`font-semibold text-lg mb-2`}
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

const RetailerDetailPage: React.FC = () => {
  const [retailer, setRetailer] = useState<Retailer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useStore(state => state.user);

  useEffect(() => {
    console.log('RetailerDetailPage useEffect triggered')
    fetchRetailerDetail();
  }, []);

  const fetchRetailerDetail = async () => {
    console.log('fetchRetailerDetail started');
    try {
      setLoading(true);
      setError(null);
      console.log('Before API call');
      const retailer = await getRetailerDetail();
      console.log('After API call, retailer:', retailer);

      if (retailer.error) {
        // Nếu API trả về error
        setError(retailer.error);
        setRetailer(null);
      }else{
        setRetailer(retailer);
      }       

    } catch (error) {
      console.error('Error fetching retailer detail:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Không thể tải thông tin điểm bán lẻ. Vui lòng thử lại sau.');
      }
      setRetailer(null);
    } finally {
      console.log('fetchRetailerDetail completed')
      setLoading(false);
    }
  };

  return (
    <PageLayout title="Thông tin điểm bán lẻ" id="retailer-detail">
      <Container>
        {error ? (
          // Nếu có lỗi → chỉ hiển thị Title
          <ContentWrapper>
            <Title>
              Bạn chưa đăng ký!
            </Title>
            <Subtitle>
              Bạn chưa đăng ký làm điểm bản lẻ của Mobifone 5, vui lòng liên hệ để được hướng dẫn đăng ký.
            </Subtitle>
          </ContentWrapper>
        ) : loading ? (
          // Nếu đang loading → có thể hiển thị spinner hoặc text
          <ContentWrapper>
            <Title>Đang tải thông tin...</Title>
          </ContentWrapper>
        ) : (
          // Nếu không có lỗi và không loading → hiển thị nội dung chi tiết như cũ
          <>
          <ContentWrapper>
            <Title>
              {retailer?.state === "da_phe_duyet" && "Đăng ký thành công!"}
              {retailer?.state === "dang_ky_moi" && "Đang chờ xét duyệt"}
              {retailer?.state === "huy_bo" && "Đã hủy hợp đồng"}
            </Title>
            <Subtitle>
              {retailer?.state === "da_phe_duyet" && "Cảm ơn bạn đã đăng ký làm điểm bán lẻ. Dưới đây là thông tin đăng ký của bạn:"}
              {retailer?.state === "dang_ky_moi" && "Cảm ơn bạn đã đăng ký làm điểm bán lẻ. Đơn đăng ký của bạn đang được xem xét"}
              {retailer?.state === "huy_bo" && "Cảm ơn bạn đã đăng ký làm điểm bán lẻ. Đơn đăng ký của bạn đang bị từ chối"}
            </Subtitle>

            <SectionTitle>Thông tin cá nhân</SectionTitle>
            <MetaInfo>
              <div tw="flex flex-wrap items-start">
                {/* <div tw="w-full md:w-1/4 flex flex-col items-center mb-4 md:mb-0">
                  <img src={retailer?.anh_chan_dung || ''} alt="Ảnh chân dung" tw="rounded mb-2" style={{ maxWidth: 200 }} />
                  <span tw="font-semibold">Ảnh chân dung</span>
                </div> */}
                <div tw="w-full md:w-3/4">
                  <div tw="flex flex-col md:flex-row md:space-x-8">
                    <div>
                      <div><b>Số CCCD:</b> {retailer?.cccd}</div>
                      <div><b>Họ và tên:</b> {retailer?.ho_ten}</div>
                      <div><b>Ngày sinh:</b> {retailer?.ngay_sinh}</div>
                      <div><b>Giới tính:</b> {retailer?.gioi_tinh}</div>
                      <div><b>Mã số thuế:</b> {retailer?.ma_so_thue}</div>
                    </div>
                  </div>
                </div>
              </div>
            </MetaInfo>
            {/* <SectionTitle>Giấy tờ tùy thân</SectionTitle>
            <MetaInfo>
              <div tw="flex flex-wrap gap-4">
                <div tw="flex-1 flex flex-col items-center">
                  <div tw="border p-2 flex items-center justify-center w-full" style={{ minHeight: 250 }}>
                    <img src={retailer?.anh_cccd_mat_truoc || ''} alt="CCCD mặt trước" tw="max-h-48 object-contain" />
                  </div>
                  <span tw="font-semibold mt-2">Ảnh CCCD mặt trước</span>
                </div>
                <div tw="flex-1 flex flex-col items-center">
                  <div tw="border p-2 flex items-center justify-center w-full" style={{ minHeight: 250 }}>
                    <img src={retailer?.anh_cccd_mat_sau || ''} alt="CCCD mặt sau" tw="max-h-48 object-contain" />
                  </div>
                  <span tw="font-semibold mt-2">Ảnh CCCD mặt sau</span>
                </div>
              </div>
            </MetaInfo> */}

            <SectionTitle>Thông tin liên hệ</SectionTitle>
            <MetaInfo>
              <div tw="flex flex-wrap">
                <div tw="w-full md:w-1/2 mb-2">
                  <div><b>Email:</b> {retailer?.email}</div>
                  <div><b>Số điện thoại:</b> {retailer?.so_dien_thoai}</div>
                </div>
                <div tw="w-full md:w-1/2 mb-2">
                  <div><b>Số Zalo:</b> {retailer?.so_zalo}</div>
                  <div><b>Facebook:</b> {retailer?.facebook}</div>
                </div>
              </div>
            </MetaInfo>

            <SectionTitle>Địa bàn</SectionTitle>
            <MetaInfo>
              <div tw="flex flex-wrap">
                <div tw="w-full md:w-1/2 mb-2">
                  <div><b>Địa chỉ:</b> {retailer?.dia_chi}</div>
                  <div><b>Phường/Xã:</b> {retailer?.phuong_xa}</div>
                </div>
                <div tw="w-full md:w-1/2 mb-2">
                  <div><b>Tỉnh/Thành phố:</b> {retailer?.tinh_thanh}</div>
                </div>
              </div>
            </MetaInfo>

            <SectionTitle>Tài khoản ngân hàng</SectionTitle>
            <MetaInfo>
              <div tw="flex flex-wrap">
                <div tw="w-full md:w-1/3 mb-2">
                  <div><b>Ngân hàng:</b> {retailer?.ngan_hang}</div>
                </div>
                <div tw="w-full md:w-1/3 mb-2">
                  <div><b>Số tài khoản:</b> {retailer?.so_tai_khoan}</div>
                </div>
                <div tw="w-full md:w-1/3 mb-2">
                  <div><b>Tên người thụ hưởng:</b> {retailer?.ten_thu_huong}</div>
                </div>
              </div>
            </MetaInfo>

            <SectionTitle>Tài khoản hệ thống</SectionTitle>
            <MetaInfo>
              <div tw="overflow-x-auto">
                <table tw="min-w-[800px] min-w-full border">
                  <thead>
                    <tr>
                      <th tw="border px-4 py-1 w-20">STT</th>
                      <th tw="border px-4 py-1">Tên hệ thống</th>
                      <th tw="border px-4 py-1">Tên tài khoản</th>
                    </tr>
                  </thead>
                  <tbody>
                    {retailer?.tai_khoan_ids?.length === 0 && (
                      <tr>
                        <td tw="border px-4 py-1 text-center" colSpan={3}></td>
                      </tr>
                    )}
                    {retailer?.tai_khoan_ids?.map((tk, idx) => (
                      <tr key={tk.name}>
                        <td tw="border px-4 py-1 text-center">{idx + 1}</td>
                        <td tw="border px-4 py-1">{tk.name}</td>
                        <td tw="border px-4 py-1 w-64">{tk.ten_tai_khoan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>s
              </div>
            </MetaInfo>
          </ContentWrapper>
          </>
        )}

        <Footer>
          <Logo src="/icons/logo.png" alt="MobiFone Logo" />
          <FooterText>© 2025 MobiFone. Tất cả quyền được bảo lưu.</FooterText>
          <FooterText>Cổng thông tin chính thức của MobiFone</FooterText>
        </Footer>
      </Container>
    </PageLayout>
  );
};

export default RetailerDetailPage;