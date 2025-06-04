import * as Icon from "@components/icons";
import { Utinity } from "@dts";

export const APP_UTINITIES: Array<Utinity> = [
    {
        key: "file-search",
        label: "Tra cứu hồ sơ",
        icon: Icon.SearchIcon,
        path: "/search",
    },

    {
        key: "blog",
        label: "Tin tức - sự kiện",
        icon: Icon.BookIcon,
        path: "/blog",
    },
    {
        key: "order",
        label: "Đặt hàng",
        icon: Icon.BookIcon,
        path: "/orders",
    },
    {
        key: "complaint",
        label: "Khiếu nại",
        icon: Icon.BookIcon,
        path: "/complaints",
    },
];
