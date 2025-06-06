import { BlogPost } from '@/types/blog';

export const mockBlogPosts: BlogPost[] = [
  {
    id: 1,
    name: "Giới thiệu dịch vụ MobiFone 1POS",
    subtitle: "Giải pháp quản lý bán hàng toàn diện",
    content: `<p>MobiFone 1POS là giải pháp quản lý bán hàng toàn diện, giúp các doanh nghiệp vừa và nhỏ dễ dàng quản lý hoạt động kinh doanh.</p>
    <p>Với MobiFone 1POS, bạn có thể:</p>
    <ul>
      <li>Quản lý kho hàng</li>
      <li>Quản lý đơn hàng</li>
      <li>Quản lý khách hàng</li>
      <li>Báo cáo doanh thu</li>
    </ul>`,
    website_published: true,
    post_date: "2024-03-15 09:00",
    create_date: "2024-03-14 15:30",
    blog_id: 1,
    visits: 156,
    cover_properties: '{"background-image": "none", "resize_class": "cover"}',
    website_meta_title: "MobiFone 1POS - Giải pháp quản lý bán hàng",
    website_meta_description: "Khám phá giải pháp quản lý bán hàng toàn diện MobiFone 1POS",
    website_meta_keywords: "mobifone, pos, quản lý bán hàng",
    website_meta_og_img: "/images/blog/1pos-banner.jpg",
    cover_image_url: "/images/blog/1pos-cover.jpg"
  },
  {
    id: 2,
    name: "Hướng dẫn sử dụng MobiFone 1POS",
    subtitle: "Thao tác đơn giản, dễ dàng sử dụng",
    content: `<p>Hướng dẫn chi tiết cách sử dụng các tính năng của MobiFone 1POS để quản lý hiệu quả hoạt động kinh doanh của bạn.</p>
    <h3>Các bước cơ bản</h3>
    <ol>
      <li>Đăng nhập hệ thống</li>
      <li>Thiết lập cửa hàng</li>
      <li>Nhập kho hàng</li>
      <li>Bắt đầu bán hàng</li>
    </ol>`,
    website_published: true,
    post_date: "2024-03-16 10:00",
    create_date: "2024-03-15 16:45",
    blog_id: 1,
    visits: 89,
    cover_properties: '{"background-image": "none", "resize_class": "cover"}',
    website_meta_title: "Hướng dẫn sử dụng MobiFone 1POS",
    website_meta_description: "Hướng dẫn chi tiết cách sử dụng MobiFone 1POS",
    website_meta_keywords: "hướng dẫn, mobifone, pos",
    website_meta_og_img: "/images/blog/guide-banner.jpg",
    cover_image_url: "/images/blog/guide-cover.jpg"
  }
]; 