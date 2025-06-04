import React from 'react';
import { Box, Icon, Text } from 'zmp-ui';
import { Link, useLocation } from 'react-router-dom';
import { openChat } from 'zmp-sdk';
import styles from './BottomNavigation.module.css';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  const handleContactClick = async () => {
    try {
      await openChat({
        type: 'oa',
        id: 'mobifone5cds', // Thay thế bằng ID OA thực tế
      });
    } catch (error) {
      console.error('Error opening chat:', error);
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

      <Box 
        className={styles.navItem} 
        onClick={handleContactClick}
      >
        <Icon icon="zi-chat" />
        <Text size="xSmall" className={styles.navText}>
          Liên hệ
        </Text>
      </Box>
    </Box>
  );
};

export default BottomNavigation; 