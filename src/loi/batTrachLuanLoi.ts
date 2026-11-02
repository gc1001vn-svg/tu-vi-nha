/**
 * Loi luan Bat trach (`batTrachLuan.ts`), Claude soan moi (luat 6) sau khi doc *Hoang De Trach Kinh*, *Duong Trach Xien Yeu*, *Duong
 * Trach Chi Nam* (nguyen van zh.wikisource) va trich doan *Bat Trach Minh Kinh*, *Duong Trach Tam Yeu*, cach dung hien nay (Dai, Hong,
 * Malaysia, Viet): nguon, ly do chot o `docs/LUAN_BAT_TRACH.md`. App chi hien loi chot, khong ke ten sach.
 */

export const HANH: Readonly<Record<string, string>> = {
  Khảm: 'Thủy', Ly: 'Hỏa', Chấn: 'Mộc', Tốn: 'Mộc', Càn: 'Kim', Đoài: 'Kim', Khôn: 'Thổ', Cấn: 'Thổ',
};

export const MENH = (nhom: string, sinhKhi: string, tuyetMenh: string): string => `${nhom}: bốn hướng tốt đều thuộc nhóm `
  + `${nhom === 'Đông tứ mệnh' ? 'Bắc, Nam, Đông, Đông Nam' : 'Tây, Tây Bắc, Tây Nam, Đông Bắc'}, bốn hướng nhóm kia là xấu. Tốt nhất `
  + `${sinhKhi} (Sinh Khí), cần tránh nhất ${tuyetMenh} (Tuyệt Mệnh). Bát trạch chỉ xét hướng theo người và theo nhà, không xét năm `
  + 'tháng — năm nào phía nào kỵ động thổ xem ở phần phi tinh (thẻ Phong thủy).';

export const NHA = {
  chuaDo: 'Chưa đo hướng nhà: vào thẻ "Phong thủy", đứng trong nhà quay mặt ra cửa chính, đo rồi bấm lưu để có phần luận nhà.',
  hop: (nhom: string): string => `Mệnh và nhà cùng nhóm ${nhom.replace(' mệnh', '')}: nhà hợp người — chỉ cần đặt cửa, giường, bếp `
    + 'đúng chỗ là đủ.',
  khongHop: 'Mệnh và nhà khác nhóm: không cần bỏ nhà; gỡ theo thứ tự — chọn lối ra vào chính ở hướng tốt của mình, chọn phòng ngủ ở '
    + 'phương tốt của mình, không đổi được phòng thì xoay giường cho đầu giường về hướng tốt.',
  cua: (huong: string, sao: string, tot: boolean): string => `Mặt nhà (thường là cửa chính) quay về ${huong}: là hướng ${sao} của mình`
    + (tot ? ' — thuận.' : ' — nên dùng một lối ra vào khác ở hướng tốt làm lối chính, hoặc đặt bàn ngồi, giường bù lại theo hướng tốt.'),
  phuongTot: (ds: string): string => `Phương tốt trong nhà (tính theo tọa nhà): ${ds} — hợp phòng ngủ chủ, phòng khách, bàn thờ.`,
  phuongXau: (ds: string): string => `Phương xấu trong nhà: ${ds} — hợp nhà vệ sinh, kho, bếp (miệng bếp quay về hướng tốt).`,
  theoHuong: (nhom: string): string => `Nhiều trang Việt tính nhóm nhà theo hướng mặt nhà, khi đó nhà này thuộc ${nhom}; app tính theo tọa `
    + '(sau lưng nhà) như sách Bát trạch.',
} as const;

export const BO_TRI = {
  cua: (sk: string, ty: string, dn: string): string => `Cửa chính, cửa phòng: mở về ${sk} (Sinh Khí) là tốt nhất; không được thì ${ty} `
    + `(Thiên Y) hoặc ${dn} (Diên Niên).`,
  giuong: (ty: string, dn: string, sk: string): string => `Giường: đầu giường quay về ${ty} (Thiên Y) để giữ sức khỏe; vợ chồng muốn hòa `
    + `thuận thì ${dn} (Diên Niên); cần sức bật cho công việc thì ${sk} (Sinh Khí).`,
  ban: (sk: string, pv: string): string => `Bàn làm việc: ngồi quay mặt về ${sk} (Sinh Khí); bàn học, việc cần tĩnh tâm thì ${pv} (Phục Vị).`,
  bep: (tm: string, nq: string, ty: string, sk: string): string => `Bếp: đặt ở phương xấu (${tm}, ${nq}) để "đè" cái xấu, hướng đun `
    + `(miệng bếp, nút vặn) quay về ${ty} hoặc ${sk} — cách "tọa hung hướng cát"; với bếp điện, bếp từ ngày nay có thầy cho là không `
    + 'còn quan trọng như bếp củi xưa.',
  tho: (pv: string, dn: string): string => `Bàn thờ: tựa vào tường vững, quay mặt về ${pv} (Phục Vị) hoặc ${dn} (Diên Niên).`,
  wc: (tm: string, nq: string): string => `Nhà vệ sinh, kho, chỗ để rác: đặt ở ${tm} (Tuyệt Mệnh) hoặc ${nq} (Ngũ Quỷ) — dùng chỗ xấu cho `
    + 'việc không ngồi lâu.',
  nhieuNguoi: 'Nhà nhiều người: hướng nhà, cửa chính xét theo người trụ cột; giường, bàn làm việc mỗi người theo hướng tốt của mình.',
} as const;
