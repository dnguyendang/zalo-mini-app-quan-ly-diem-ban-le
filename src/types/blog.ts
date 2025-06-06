export interface BlogPost {
    id: number;
    name: string;
    subtitle: string;
    content: string;
    website_published: boolean;
    post_date: string;
    create_date: string;
    blog_id: number;
    visits: number;
    cover_properties: string;
    website_meta_title: string;
    website_meta_description: string;
    website_meta_keywords: string;
    website_meta_og_img: string;
    cover_image_url: string;
}

export interface BlogListResponse {
    total: number;
    page: number;
    page_size: number;
    items: BlogPost[];
}

export interface BlogDetailResponse {
    post: BlogPost;
} 