import React from "react";
import { Route } from "react-router-dom";
import { AnimationRoutes, ZMPRouter } from "zmp-ui";

import { HomePage } from "./Home";
import { SearchPage } from "./Search";
import { ProfilePage } from "./Profile";
import BlogListPage from "./Blog/BlogListPage";
import BlogDetailPage from "./Blog/BlogDetailPage";
import OrderListPage from "./Order/OrderListPage";
import OrderDetailPage from "./Order/OrderDetailPage";
import OrderCreatePage from "./Order/OrderCreatePage";
import ComplaintListPage from "./Complaint/ComplaintListPage";
import ComplaintDetailPage from "./Complaint/ComplaintDetailPage";
import ComplaintCreatePage from "./Complaint/ComplaintCreatePage";
import RetailerDetailPage from "./Retailer/RetailerDetailPage";

const Routes: React.FC = () => (
    <ZMPRouter>
        <AnimationRoutes>
            <Route path="/" element={<HomePage />} />
            
            <Route path="/search" element={<SearchPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            <Route path="/blog" element={<BlogListPage />} />
            <Route path="/blog/:id" element={<BlogDetailPage />} />

            <Route path="/orders" element={<OrderListPage />} />
            <Route path="/orders/:orderId" element={<OrderDetailPage />} />
            <Route path="/orders/create" element={<OrderCreatePage />} />

            <Route path="/complaints" element={<ComplaintListPage />} />
            <Route path="/complaints/:complaintId" element={<ComplaintDetailPage />} />
            <Route path="/complaints/create" element={<ComplaintCreatePage />} />

            <Route path="/retailer" element={<RetailerDetailPage />} />
        </AnimationRoutes>
    </ZMPRouter>
);

export default Routes;
