import React, { useState } from 'react';
import { Modal, Box, Button, Text } from 'zmp-ui';
import { userService } from '@/service/user';
import { requirePermission } from '@/utils/phone';

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

  const handleLinkAccount = async () => {
    setLoading(true);
    setError('');

    try {
      const phoneToken = await requirePermission();
      
      if (!phoneToken) {
        setError('Không thể lấy được token số điện thoại. Vui lòng thử lại.');
        return;
      }

      console.log('Attempting to link account with phone token');

      const response = await userService.linkAccount(phoneToken);
      console.log('Link account response:', response);

      if (response.status === 'success') {
        onSuccess();
        onClose();
      } else {
        setError('Liên kết tài khoản thất bại: ' + (response.message || 'Lỗi không xác định'));
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
      title="Liên kết tài khoản"
      modalClassName="account-linking-modal"
    >
      <Box p={4}>
        <Text.Title size="small" className="mb-4">
          Chào mừng bạn đến với MobiFone 5 Chuyển đổi số!
        </Text.Title>
        
        <Box className="mb-4">
          
          <Text>Vui lòng đồng ý chia sẻ số điện thoại để liên kết với tài khoản của bạn trên hệ thống MobiFone 5 Chuyển đổi số</Text>
          <Text>Liên kết tài khoản để trải nghiệm tốt hơn</Text>
          <Text>- Quản lý thông tin điểm bán lẻ</Text>
          <Text>- Tra cứu trạng đơn hàng</Text>
          <Text>- Tra cứu tình trạng khiếu nại</Text>
        </Box>

        {error && (
          <Text color="danger" className="mb-4">
            {error}
          </Text>
        )}

        <Button
          fullWidth
          loading={loading}
          disabled={loading}
          onClick={handleLinkAccount}
        >
          Liên kết số điện thoại
        </Button>
      </Box>
    </Modal>
  );
};

export default AccountLinkingModal; 