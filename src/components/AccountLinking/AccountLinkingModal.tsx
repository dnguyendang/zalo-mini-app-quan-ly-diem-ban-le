import React, { useState } from 'react';
import { Modal, Box, Button, Text, Icon, Input } from 'zmp-ui';
import { userService } from '@/service/user';
import { requirePermission } from '@/utils/phone';
import CreateAccountModal from './CreateAccountModal';

interface AccountLinkingModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AccountLinkingModal: React.FC<AccountLinkingModalProps> = ({
  visible,
  onClose,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  
  const handleLinkAccount = async () => {
    setLoading(true);
    setError('');
    try {
      const phoneToken = await requirePermission();
      if (!phoneToken) {
        setError('Không thể lấy được token số điện thoại. Vui lòng thử lại.');
        return;
      }
      const response = await userService.linkAccount(phoneToken);

      if (response.status === 'success') {
        onSuccess();
        onClose();
      } else {
        // Nếu lỗi là chưa đăng ký tài khoản thì mở modal đăng ký
        if (
          response.message &&
          response.message.toLowerCase().includes("chưa đăng ký")
        ) {
          setShowRegisterModal(true);
        } else {
          setError(response.message || "Không thể liên kết tài khoản.");
        }
      }
    } catch (err) {
      console.error('Error linking account:', err);
      setError(err instanceof Error ? err.message : 'Không thể liên kết tài khoản. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title=""
      modalClassName="account-linking-modal"
    >
      <Box p={4} className="text-center">
        <img 
          src="/images/banner/mobifone-logo-oa.png" 
          alt="Account Linking" 
          className="w-full h-auto mb-6 rounded" // full chiều rộng và khoảng cách dưới
        />

        <Text.Title size="small" className="mb-5 font-semibold text-center">
          Chào mừng bạn đến với Kênh phân phối Mobifone KV5!
        </Text.Title>

        <Box className="mb-8 text-left space-y-4 text-sm">
          <Box className="flex items-center">
            <Icon icon="zi-location-solid" className="mr-3 text-primary" size={20} />
            <span>Quản lý thông tin điểm bán lẻ</span>
          </Box>

          <Box className="flex items-center">
            <Icon icon="zi-search" className="mr-3 text-primary" size={20} />
            <span>Tra cứu tình trạng đơn hàng</span>
          </Box>

          <Box className="flex items-center">
            <Icon icon="zi-search" className="mr-3 text-primary" size={20} />
            <span>Tra cứu tình trạng khiếu nại</span>
          </Box>

          <Box className="flex items-center">
            <Icon icon="zi-post" className="mr-3 text-primary" size={20} />
            <span>Xem thông tin chính sách</span>
          </Box>
        </Box>
        <Text className="mb-6 text-sm text-center">   
          *** Vui lòng đồng ý chia sẻ số điện thoại để liên kết với tài khoản của bạn trên hệ thống Kênh phân phối Mobifone KV5 ***
        </Text>

        {error && <Text className="text-danger">{error}</Text>}
        <Button
          fullWidth
          loading={loading}
          disabled={loading}
          onClick={() => handleLinkAccount()}
          className="mb-3"
        >
          Liên kết số điện thoại
        </Button>
        <Button
          fullWidth
          variant="secondary"
          onClick={onClose}
        >
          Từ chối và Thoát
        </Button>

        {/* Modal đăng ký tài khoản */}
        <CreateAccountModal
          visible={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          onSuccess={() => {
            setShowRegisterModal(false);
            onSuccess();
            onClose();
          }}
          userService={userService}
        />
      </Box>
    </Modal>
  );
};

export default AccountLinkingModal; 