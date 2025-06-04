import React from "react";
import { Box, Input, Icon, Text, Spinner } from "zmp-ui";
import { Link } from "react-router-dom";
import styles from "./HomePage.module.css";
import BlogHighlights from "@/components/BlogHighlights/BlogHighlights";
import PageLayout from "@/components/layout/PageLayout";
import HomeHeader from "@/components/layout/HomeHeader";
import { useAccountLinking } from "@/hooks/useAccountLinking";
import AccountLinkingModal from "@/components/AccountLinking/AccountLinkingModal";

const MENU_ITEMS = [
  {
    id: 'retails',
    title: 'Điểm bán lẻ',
    icon: '/icons/retail.png',
    path: '/retails',
    requiresAuth: true
  },
  {
    id: 'orders',
    title: 'Đơn hàng',
    icon: '/icons/order.png',
    path: '/orders',
    requiresAuth: true
  },
  {
    id: 'complaints',
    title: 'Khiếu nại',
    icon: '/icons/complaint.png',
    path: '/complaints',
    requiresAuth: true
  },
  {
    id: 'blog',
    title: 'Tin tức',
    icon: '/icons/blog.png',
    path: '/blog',
    requiresAuth: false
  },
];

const HomePage: React.FC = () => {
  const {
    isLinked,
    isChecking,
    showLinkingModal,
    setShowLinkingModal,
    checkAccountLinking,
  } = useAccountLinking();

  if (isChecking) {
    return (
      <Box className={styles.loadingContainer}>
        <Spinner />
        <Text className={styles.loadingText}>
          Đang kiểm tra trạng thái tài khoản...
        </Text>
      </Box>
    );
  }

  return (
    <PageLayout
      id="home-page"
      customHeader={
        <HomeHeader
          title="MobiFone 5 Chuyển đổi số"
          name={isLinked ? "Welcome!" : "Chưa liên kết tài khoản"}
        />
      }
    >
      <Box className={styles.container}>
        {/* Search Bar */}
        <Box className={styles.searchBar}>
          <Icon icon="zi-search" size={26} />
          <Input 
            className={styles.searchInput}
            placeholder="Tìm nhanh sản phẩm, dịch vụ ..."
            clearable
          />
        </Box>

        {/* Banner */}
        <Box className={styles.banner}>
          <img 
            src="/images/banner/mobifone-banner.jpg" 
            alt="MobiFone 1POS"
          />
        </Box>

        {/* Menu Header */}
        <Box className={styles.menuHeader}>
          <Text.Title className={styles.menuHeaderTitle}>
            Danh mục
          </Text.Title>
        </Box>
        
        {/* Menu Grid */}
        <Box className={styles.menuGrid}>
          {MENU_ITEMS.map((item) => (
              <Link 
                to={(!item.requiresAuth || isLinked) ? item.path : "#"} 
                key={item.id} 
                className={`${styles.menuItem} ${(item.requiresAuth && !isLinked) ? styles.menuItemDisabled : ''}`}
                onClick={(e) => {
                  if (item.requiresAuth && !isLinked) {
                    e.preventDefault();
                    setShowLinkingModal(true);
                  }
                }}
              >
              <img 
                src={item.icon} 
                alt={item.title} 
                className={styles.menuIcon}
              />
              <span className={styles.menuTitle}>{item.title}</span>
            </Link>
          ))}
        </Box>

        {/* Promotion Section */}
        <Box className={styles.promotionSection}>
          <h3 className={styles.promotionTitle}>
            Nhận thông báo khuyến mãi mới nhất từ cửa hàng
          </h3>
          <Box className={styles.promotionContent}>
            <Box className={styles.promotionLogo}>
              <img 
                src="/icons/mobifone-logo.png" 
                alt="MobiFone" 
              />
            </Box>
            <Box className={styles.promotionInfo}>
              <h4 className={styles.promotionName}>
                Chuyển đổi số MobiFone KV5
              </h4>
              <p className={styles.promotionSubtitle}>
                Official Account
              </p>
            </Box>
            <button className={styles.promotionButton}>
              Quan tâm
            </button>
          </Box>
        </Box>

        {/* Blog Highlights */}
        <BlogHighlights />

        {/* Account Linking Modal */}
        <AccountLinkingModal
          visible={showLinkingModal}
          onClose={() => setShowLinkingModal(false)}
          onSuccess={checkAccountLinking}
        />
      </Box>
    </PageLayout>
  );
};

export default HomePage;
