import React from 'react';
import { Box, Icon, Text } from 'zmp-ui';
import { Link, useLocation } from 'react-router-dom';
import { openChat } from 'zmp-sdk';
import styles from './BottomNavigation.module.css';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  const handleContactClick = async () => {
    console.log('Contact button clicked');
    try {
      console.log('Attempting to open chat...');
      await openChat({
        type: 'oa',
        id: '184122995578292634',
      });
      console.log('Chat opened successfully');
    } catch (error) {
      console.error('Error opening chat:', error);
      alert('Không thể mở chat. Vui lòng thử lại sau.');
    }
  };

  return (
    <Box className={styles.bottomNav}>
      <Link to="/" className={`${styles.navItem} ${isHome ? styles.active : ''}`}>
        <Icon icon="zi-home" />
        <Text size="xSmall" className={styles.navText}>
          Trang chủ
        </Text>
      </Link>

      <button 
        className={styles.navItem}
        onClick={handleContactClick}
        style={{ 
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          width: '100%'
        }}
      >
        <Icon icon="zi-chat" />
        <Text size="xSmall" className={styles.navText}>
          Liên hệ
        </Text>
      </button>
    </Box>
  );
};

export default BottomNavigation; 