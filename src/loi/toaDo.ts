/**
 * Toa do tinh ly truoc 07/2025 (vi do Bac, kinh do Dong) cho chiem tinh: cung Moc va nha lay toa do nay thay noi sinh that.
 * So lieu GeoNames (cities1000, CC BY 4.0); 52 noi so Natural Earth lech <= 0,08° (`docs/QUY_UOC.md` muc 23).
 * File rieng (khong de o `tinh.ts`) de bang chi vao phan nap luoi cua khoi chiem tinh, khong vao goi mo app.
 */
export const TOA_DO: Readonly<Record<string, readonly [viDo: number, kinhDo: number, tinhLy: string]>> = {
  'Hà Nội': [21.02, 105.84, 'Hà Nội'], 'Hà Giang': [22.82, 104.98, 'Hà Giang'], 'Cao Bằng': [22.67, 106.26, 'Cao Bằng'],
  'Bắc Kạn': [22.15, 105.83, 'Bắc Kạn'], 'Tuyên Quang': [21.82, 105.21, 'Tuyên Quang'], 'Lào Cai': [22.49, 103.97, 'Lào Cai'],
  'Điện Biên': [21.39, 103.02, 'Điện Biên Phủ'], 'Lai Châu': [22.4, 103.46, 'Lai Châu'], 'Sơn La': [21.33, 103.92, 'Sơn La'],
  'Yên Bái': [21.72, 104.91, 'Yên Bái'], 'Hòa Bình': [20.82, 105.34, 'Hòa Bình'], 'Thái Nguyên': [21.59, 105.85, 'Thái Nguyên'],
  'Lạng Sơn': [21.85, 106.76, 'Lạng Sơn'], 'Quảng Ninh': [20.95, 107.07, 'Hạ Long'], 'Bắc Giang': [21.27, 106.19, 'Bắc Giang'],
  'Phú Thọ': [21.32, 105.4, 'Việt Trì'], 'Vĩnh Phúc': [21.31, 105.6, 'Vĩnh Yên'], 'Bắc Ninh': [21.19, 106.08, 'Bắc Ninh'],
  'Hải Dương': [20.94, 106.33, 'Hải Dương'], 'Hải Phòng': [20.86, 106.68, 'Hải Phòng'], 'Hưng Yên': [20.65, 106.05, 'Hưng Yên'],
  'Thái Bình': [20.45, 106.34, 'Thái Bình'], 'Hà Nam': [20.55, 105.91, 'Phủ Lý'], 'Nam Định': [20.43, 106.18, 'Nam Định'],
  'Ninh Bình': [20.26, 105.98, 'Ninh Bình'], 'Thanh Hóa': [19.8, 105.77, 'Thanh Hóa'], 'Nghệ An': [18.67, 105.69, 'Vinh'],
  'Hà Tĩnh': [18.34, 105.91, 'Hà Tĩnh'], 'Quảng Bình': [17.47, 106.62, 'Đồng Hới'],
  'Quảng Trị (bắc sông Bến Hải)': [17.07, 107.01, 'Hồ Xá'], 'Quảng Trị (nam sông Bến Hải)': [16.82, 107.1, 'Đông Hà'],
  'Thừa Thiên Huế': [16.46, 107.6, 'Huế'], 'Đà Nẵng': [16.07, 108.22, 'Đà Nẵng'], 'Quảng Nam': [15.57, 108.47, 'Tam Kỳ'],
  'Quảng Ngãi': [15.12, 108.79, 'Quảng Ngãi'], 'Bình Định': [13.78, 109.22, 'Quy Nhơn'], 'Phú Yên': [13.1, 109.32, 'Tuy Hòa'],
  'Khánh Hòa': [12.25, 109.19, 'Nha Trang'], 'Ninh Thuận': [11.56, 108.99, 'Phan Rang – Tháp Chàm'],
  'Bình Thuận': [10.93, 108.1, 'Phan Thiết'], 'Kon Tum': [14.35, 108.01, 'Kon Tum'], 'Gia Lai': [13.98, 108.0, 'Pleiku'],
  'Đắk Lắk': [12.67, 108.04, 'Buôn Ma Thuột'], 'Đắk Nông': [12.0, 107.69, 'Gia Nghĩa'], 'Lâm Đồng': [11.95, 108.44, 'Đà Lạt'],
  'Bình Phước': [11.53, 106.88, 'Đồng Xoài'], 'Tây Ninh': [11.31, 106.1, 'Tây Ninh'], 'Bình Dương': [10.98, 106.65, 'Thủ Dầu Một'],
  'Đồng Nai': [10.94, 106.82, 'Biên Hòa'], 'Bà Rịa – Vũng Tàu': [10.5, 107.17, 'Bà Rịa'],
  'TP. Hồ Chí Minh': [10.82, 106.63, 'TP. Hồ Chí Minh'], 'Long An': [10.54, 106.41, 'Tân An'], 'Tiền Giang': [10.36, 106.36, 'Mỹ Tho'],
  'Bến Tre': [10.24, 106.38, 'Bến Tre'], 'Trà Vinh': [9.95, 106.34, 'Trà Vinh'], 'Vĩnh Long': [10.25, 105.97, 'Vĩnh Long'],
  'Đồng Tháp': [10.46, 105.63, 'Cao Lãnh'], 'An Giang': [10.39, 105.44, 'Long Xuyên'], 'Kiên Giang': [10.01, 105.08, 'Rạch Giá'],
  'Cần Thơ': [10.04, 105.79, 'Cần Thơ'], 'Hậu Giang': [9.78, 105.47, 'Vị Thanh'], 'Sóc Trăng': [9.6, 105.97, 'Sóc Trăng'],
  'Bạc Liêu': [9.29, 105.73, 'Bạc Liêu'], 'Cà Mau': [9.18, 105.15, 'Cà Mau'],
};
