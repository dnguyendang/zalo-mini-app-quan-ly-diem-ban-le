export interface Retailer {
  id: number,
  cccd: string,
  ho_ten: string,
  ngay_sinh: string | null,
  gioi_tinh: string,
  ma_so_thue: string,
  email: string,
  so_dien_thoai: string,
  so_zalo: string,
  facebook: boolean,
  dia_chi: string,
  phuong_xa: string,
  tinh_thanh: string,
  ngan_hang: string,
  so_tai_khoan: string,
  ten_thu_huong: string,
  anh_chan_dung: string | null; // base64 string
  anh_cccd_mat_truoc: string | null; // base64 string
  anh_cccd_mat_sau: string | null; // base64 string
  state: string, // 'da_phe_duyet', 'dang_ky_moi', 'huy_bo'
  loai_hop_dong: string,
  ngay_bat_dau: string,
  hop_dong_filename: string,
  tai_khoan_ids: {
    id: number,
    name: string,
    ten_tai_khoan: string,
    emp_code: string,
    shop_code: string,
    active: boolean,
    note: string
  }[] | null
} 