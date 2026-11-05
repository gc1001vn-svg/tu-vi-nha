/**
 * Giai nghia thuat ngu lan dau gap trong mot khoi (ke hoach `docs/ke-hoach/2026-11-05-loi-giai-de-hieu.md`, QUY_UOC muc 43).
 * Giao dien di qua chu hien ra theo thu tu doc, goi `chenNghia` cho tung doan chu voi cung mot `daGap`: lan dau gap thuat ngu thi
 * chen nghia ngay sau (trong ngoac; dang o trong ngoac roi thi ", tuc …"), da co ngoac giai nghia ngay sau thi de nguyen.
 * Nghia: Claude soan lai bang loi thuong. Moi mon mot bang vi cung chu ma khac nghia (vd "tam hợp" tu vi va chiem tinh).
 */

export interface ThuatNgu {
  /** Khoa (cung khoa = cung mot thuat ngu, chi giai nghia mot lan). */
  readonly khoa: string;
  /** Mau regex (co `u`), khong co ranh gioi chu — ham tu them. Chu cai dau tu khop hoa / thuong tru khi `hoa`. */
  readonly mau: string;
  readonly nghia: string;
  /** Chi khop dung chu hoa / thuong nhu `mau` (vd "Tuần" khong phai "tuần"). */
  readonly hoa?: boolean;
  /** Mau thay rieng (`$&`, `$1`… nhu `String.replace`) khi chen nghia vao giua; khong co thi chen sau. */
  readonly thay?: string;
}

const t = (khoa: string, nghia: string, mau = khoa, them: Partial<ThuatNgu> = {}): ThuatNgu => ({ khoa, mau, nghia, ...them });

export const THUAT_NGU_TU_VI: readonly ThuatNgu[] = [
  t('đại vận', 'chặng 10 năm của đời'),
  t('tiểu hạn', 'cung ứng với từng năm'),
  t('Mệnh', 'cung gốc, nói về chính mình', 'Mệnh', { hoa: true }),
  // Do sang chi khi dung sau ten sao: "Thiên Cơ (vượng)", "Thái Dương miếu:" — khong bat "thịnh vượng".
  t('miếu', 'sao rất sáng, mạnh nhất', '(?:(?<=\\()miếu(?: địa)?|miếu(?=:))', { hoa: true }),
  t('vượng', 'sao sáng, mạnh', '(?:(?<=\\()vượng(?: địa)?|vượng(?=:))', { hoa: true }),
  t('đắc địa', 'sao khá sáng, đứng chỗ hợp'),
  t('bình hòa', 'sao ở mức vừa'),
  t('hãm địa', 'sao đứng chỗ không hợp nên yếu, dễ ra mặt xấu'),
  t('tam hợp Thái Tuế', 'nhóm ba cung hợp với tuổi năm sinh'),
  t('tam hợp', 'ba cung cách đều nhau, chiếu sang nhau'),
  t('cung chiếu', 'cung nhìn sang, ảnh hưởng tới cung đang xét', 'cung chiếu(?: về)?'),
  t('Hóa Lộc', 'sao biến hóa theo năm: thêm lộc, tiền'),
  t('Hóa Quyền', 'sao biến hóa theo năm: thêm quyền, thế chủ động'),
  t('Hóa Khoa', 'sao biến hóa theo năm: thêm tiếng tốt, người giúp'),
  t('Hóa Kỵ', 'sao biến hóa theo năm: vướng mắc, trục trặc'),
  t('tứ hóa', 'bốn sao biến hóa theo can năm: Lộc, Quyền, Khoa, Kỵ'),
  t('cát tinh', 'sao tốt'),
  t('sát tinh', 'sao xấu, gây trắc trở'),
  t('sao lưu', 'sao đổi chỗ theo từng năm'),
  t('sao lưu', 'sao đổi chỗ theo từng năm', 'Lưu(?= \\p{Lu})', { hoa: true }),
  t('chính tinh', 'sao chính'),
  t('Thái Tuế', 'sao chủ của năm'),
  t('Thiên Mã', 'sao của đi lại, di chuyển'),
  t('Lộc Tồn', 'sao giữ của, lộc bền'),
  t('Địa Không', 'sao hao tán, bất ngờ', 'Địa Không(?: / Địa Kiếp)?'),
  t('Địa Kiếp', 'sao hao tán, bất ngờ'),
  t('Tuần', 'như tấm màn che: việc chậm, bị cản, sao xấu bớt xấu', 'Tuần', { hoa: true }),
  t('Triệt', 'như nhát cắt: việc bị chặn giữa chừng, sao xấu bớt xấu', 'Triệt', { hoa: true }),
  t('Cục', 'nhóm ngũ hành của lá số, định tuổi bắt đầu các chặng', 'Cục', { hoa: true }),
  t('khác bộ', 'khác nhóm sao'),
  t('cùng bộ', 'cùng nhóm sao'),
];

export const THUAT_NGU_BAT_TU: readonly ThuatNgu[] = [
  t('Nhật chủ', 'can của ngày sinh, tượng trưng cho chính mình'),
  t('thất lệnh', '', 'thất lệnh \\((hưu|tù|tử)\\)', { thay: 'thất lệnh ($1 — sinh không đúng mùa của hành mình nên yếu đi)' }),
  t('thất lệnh', 'sinh không đúng mùa của hành mình nên yếu đi'),
  t('được lệnh', '', 'được lệnh \\(vượng\\)', { thay: 'được lệnh (vượng — sinh đúng mùa của hành mình nên mạnh)' }),
  t('được lệnh', 'sinh đúng mùa của hành mình nên mạnh'),
  t('lệnh tháng', 'tháng sinh — quyết định hành nào mạnh nhất'),
  t('Thân nhược', 'sức tự thân yếu hơn sức ép quanh mình', 'Thân (?:rất |hơi )?nhược', { hoa: true }),
  t('Thân vượng', 'sức tự thân mạnh', 'Thân (?:rất |hơi )?vượng', { hoa: true }),
  t('trụ', 'cột: năm, tháng, ngày, giờ sinh, mỗi cột một cặp can chi', 'trụ(?= (?:năm|tháng|ngày|giờ))'),
  t('khí chính', 'can chính ẩn trong chi', '\\(khí chính ([^)]+)\\)', { thay: '(khí chính $1 — can chính ẩn trong chi)' }),
  t('đại vận', 'chặng 10 năm của đời'),
  t('Lập Xuân', 'tiết đầu xuân, khoảng 4/2 dương lịch — năm bát tự đổi từ đây'),
  t('Tỷ Kiếp', 'người ngang vai: anh em, bạn bè, người tranh phần'),
  t('Thực Thương', 'tài năng, cách thể hiện mình'),
  t('Quan Sát', 'công việc, cấp trên, áp lực'),
  t('Ấn', 'hành sinh ra mình: mẹ, thầy, học hành, giấy tờ', 'Ấn', { hoa: true }),
  t('Tài', 'của cải, tiền bạc', 'Tài', { hoa: true }),
  t('Tỷ Kiên', 'người ngang vai, tính tự lập'),
  t('Kiếp Tài', 'bạn mà cũng là người tranh phần'),
  t('Thực Thần', 'tài khéo, sự thong thả, lộc ăn'),
  t('Thương Quan', 'sáng tạo, giỏi nói, không chịu gò bó'),
  t('Thiên Tài', 'tiền bất ngờ, buôn bán'),
  t('Chính Tài', 'tiền làm ra đều đặn'),
  t('Thất Sát', 'áp lực, uy quyền'),
  t('Chính Quan', 'kỷ luật, danh dự, chức phận'),
  t('Thiên Ấn', 'học lối riêng, nghề lạ, trực giác'),
  t('Chính Ấn', 'học hành, người đỡ đầu, giấy tờ'),
];

export const THUAT_NGU_CHIEM_TINH: readonly ThuatNgu[] = [
  t('cung Mọc', 'cung đang mọc ở chân trời phía đông lúc sinh: ấn tượng ban đầu, dáng vẻ'),
  t('nhà', 'lá số chia 12 "nhà", mỗi nhà một mảng đời', 'nhà \\d+', { hoa: true }),
  t('nguyên tố', 'bốn nhóm cung: Lửa, Đất, Khí, Nước'),
  t('thể', 'cách hành động của cung: Tiên phong, Kiên định hay Biến đổi', 'thể (?:Tiên phong|Kiên định|Biến đổi)'),
  t('sao chủ', 'hành tinh cai quản cung Mọc'),
  t('cung nhà của mình', 'cung do chính sao này cai quản'),
  t('cung vượng', 'cung sao được tôn lên'),
  t('cung suy', 'cung đối diện cung vượng, sao ở đó yếu'),
  t('cung hãm', 'cung đối diện cung nhà của sao, sao ở đó lạc chỗ'),
  t('nghịch hành', 'nhìn từ Trái Đất, hành tinh như đang đi lùi'),
  t('Thiên Đỉnh', 'điểm cao nhất bầu trời lúc sinh, ứng với sự nghiệp'),
  t('nhà khuất', 'nhà 6, 8, 12: mảng đời kín, nhiều trở ngại'),
  t('lệch', 'số độ càng nhỏ, ảnh hưởng càng rõ', '\\(lệch ([\\d,]+°)\\)', { thay: '(lệch $1 — số độ càng nhỏ, ảnh hưởng càng rõ)' }),
  t('Thế chữ T', 'ba hành tinh thành hình chữ T: hai cái đối nhau, cùng vuông góc với cái thứ ba'),
  t('Tam hợp lớn', 'ba hành tinh cách đều nhau 120°, thành tam giác'),
  t('lục hợp', 'cách nhau 60°: góc thuận nhẹ'),
  t('tam hợp', 'cách nhau 120°: góc thuận'),
  t('vuông', 'cách nhau 90°: góc căng, thúc phải sửa', 'vuông(?= (?:Sao|Mặt|Thiên|cung Mọc|chính nó))'),
  t('đối', 'cách nhau 180°: hai bên giằng co', 'đối(?= (?:Sao|Mặt|Thiên|cung Mọc|chính nó))'),
  t('hợp', 'đứng sát nhau: hai sức nhập làm một', 'hợp(?= (?:Sao|Mặt|Thiên|cung Mọc|chính nó))'),
  t('cát tinh', 'hành tinh mang may'),
];

const daDich = new WeakMap<readonly ThuatNgu[], RegExp>();

/** Mot regex cho ca bang: thuat ngu dai truoc (khop dai nhat tai vi tri som nhat), co ranh gioi chu Unicode. */
function regexBang(bang: readonly ThuatNgu[]): RegExp {
  const co = daDich.get(bang);
  if (co !== undefined) return co;
  const dau = (m: string, hoa: boolean | undefined): string => {
    const c = m.charAt(0);
    if (hoa === true || !/\p{L}/u.test(c) || c.toUpperCase() === c.toLowerCase()) return m;
    return `[${c.toLowerCase()}${c.toUpperCase()}]${m.slice(1)}`;
  };
  const thuTu = bang.map((x, i) => ({ x, i })).sort((a, b) => b.x.mau.length - a.x.mau.length || a.i - b.i);
  const re = new RegExp(thuTu.map(({ x, i }) => `(?<t${String(i)}>${dau(x.mau, x.hoa)})`).map((g) => `(?<![\\p{L}\\p{N}])${g}(?![\\p{L}\\p{N}])`)
    .join('|'), 'gu');
  daDich.set(bang, re);
  return re;
}

/** Chen nghia cho thuat ngu lan dau gap trong `chu`; `daGap` ghi khoa da gap (dung chung ca khoi). */
export function chenNghia(chu: string, bang: readonly ThuatNgu[], daGap: Set<string>): string {
  const re = regexBang(bang);
  re.lastIndex = 0;
  let ra = '', cuoi = 0;
  for (const m of chu.matchAll(re)) {
    const ten = Object.entries(m.groups ?? {}).find(([, v]) => v !== undefined)?.[0];
    const tn = ten === undefined ? undefined : bang[Number(ten.slice(1))];
    if (tn === undefined || daGap.has(tn.khoa)) continue;
    const sau = chu.slice(m.index + m[0].length);
    // Dang o trong ngoac: cuoi ngoac thi noi ", tức …"; giua ngoac thi de lan gap sau (ngoac long ngoac kho doc).
    const trongNgoac = tn.thay === undefined && /^[^()]*\)/u.test(sau) && /\([^()]*$/u.test(chu.slice(0, m.index));
    if (trongNgoac && !/^\)/u.test(sau)) continue;
    daGap.add(tn.khoa);
    if (tn.thay === undefined && /^\s?\(/u.test(sau)) continue; // da co ngoac giai nghia ngay sau
    const moi = tn.thay !== undefined ? m[0].replace(new RegExp(tn.mau, 'u'), tn.thay)
      : trongNgoac ? `${m[0]}, tức ${tn.nghia}` : `${m[0]} (${tn.nghia})`;
    ra += chu.slice(cuoi, m.index) + moi;
    cuoi = m.index + m[0].length;
  }
  return ra + chu.slice(cuoi);
}

/** Thuat ngu trong bang co mat trong `chu` (de thuoc kiem "Nói gọn" khong chua chu mon). */
export function coThuatNgu(chu: string, bang: readonly ThuatNgu[]): string[] {
  const re = regexBang(bang);
  return [...chu.matchAll(re)].map((m) => m[0]);
}

// ---- Dot 2 (QUY_UOC muc 44): 11 mon con lai ----

export const THUAT_NGU_NAM_NAY: readonly ThuatNgu[] = [
  t('Thái Tuế', 'sao chủ của năm; năm trùng, xung, hình… với tuổi gọi là phạm'),
  t('Tam Tai', 'ba năm liền theo tuổi bị coi là xấu'),
  t('Kim Lâu', 'tục kiêng làm nhà, cưới hỏi vào một số tuổi'),
  t('Hoang Ốc', 'tục xem tuổi có hợp làm nhà không'),
  t('Mật tông', 'một dòng Phật giáo'),
];

export const THUAT_NGU_HUONG: readonly ThuatNgu[] = [
  t('Bát trạch', 'cách xem hướng nhà theo tám hướng và năm sinh'),
  t('tứ trạch', 'nhóm nhà: nhà Đông tứ trạch hợp người Đông tứ mệnh, Tây hợp Tây', '(?:Đông|Tây) tứ trạch', { hoa: true }),
  t('phương', 'khu vực trong nhà, nhìn từ giữa nhà ra', 'phương(?= (?:tốt|xấu))'),
  t('tọa', 'phía sau lưng nhà', 'tọa(?= nhà)'),
  t('mệnh quái', 'quẻ theo năm sinh, định hướng hợp mình'),
];

export const THUAT_NGU_TUOI: readonly ThuatNgu[] = [
  t('tam hợp', 'ba tuổi cách nhau 4 năm, hợp nhau'),
  t('lục hợp', 'từng cặp tuổi hợp đôi'),
  t('tương hình', 'hai tuổi hay làm khó nhau'),
  t('lục hại', 'cặp tuổi ngấm ngầm hại nhau'),
  t('lục xung', 'hai tuổi cách nhau 6 năm, đối nhau'),
  t('tự hình', 'cùng tuổi mà dễ khắc nhau'),
  t('Địa chi', '12 con giáp'),
  t('cung phi', 'quẻ theo năm sinh, dùng xem hướng nhà'),
];

export const THUAT_NGU_THAN_SO: readonly ThuatNgu[] = [
  t('Mũi tên', 'ba ô thẳng hàng trên biểu đồ cùng có số, hoặc cùng trống', 'Mũi tên', { hoa: true }),
  t('Đỉnh cao', 'một chặng lớn của đời'),
  t('Thử thách', 'bài học phải vượt trong chặng đó', 'Thử thách', { hoa: true }),
  t('Năm cá nhân', 'con số riêng của năm với mình, đổi ngày 1/1'),
  t('Tháng cá nhân', 'con số riêng của tháng với mình'),
  t('Mặt phẳng', 'một hàng của biểu đồ: trí óc, tình cảm hay thể chất', 'Mặt phẳng', { hoa: true }),
];

export const THUAT_NGU_KINH_DICH: readonly ThuatNgu[] = [
  t('quẻ chủ', 'quẻ gieo được, nói việc lúc này'),
  t('quẻ hỗ', 'quẻ ẩn bên trong, nói quá trình'),
  t('quẻ biến', 'quẻ có được khi các hào động đổi, nói chiều hướng'),
  t('hào động', 'vạch đang đổi — chỗ cần đọc'),
  t('hào', 'một trong sáu vạch của quẻ, đếm từ dưới lên', 'hào(?= (?:\\d|ứng))'),
  t('trung', 'đứng giữa quẻ trên hoặc quẻ dưới', '(?<=\\()trung(?=\\))'),
  t('sai vị', 'vạch âm dương không hợp chỗ đứng'),
  t('đắc vị', 'vạch âm dương hợp chỗ đứng'),
  t('Thể', 'phần quẻ chỉ mình', 'Thể(?= \\p{Lu})', { hoa: true }),
  t('Dụng', 'phần quẻ chỉ việc', 'Dụng(?= \\p{Lu}\\p{Ll})', { hoa: true }),
];

export const THUAT_NGU_TAROT: readonly ThuatNgu[] = [
  t('ẩn chính', '22 lá lớn, chỉ việc lớn, bước ngoặt', 'lá ẩn chính'),
  t('ẩn phụ', '56 lá nhỏ, chỉ việc hằng ngày', 'lá ẩn phụ'),
  t('lá ngược', 'lá rút ra bị lộn ngược: nghĩa yếu đi hoặc đảo lại', 'lá ngược'),
];

export const THUAT_NGU_KIEU: readonly ThuatNgu[] = [
  t('lục bát', 'cặp câu sáu chữ, tám chữ'),
];

export const THUAT_NGU_MAT: readonly ThuatNgu[] = [
  t('Ba đình', 'ba phần của mặt: trán; từ mày tới chóp mũi; từ dưới mũi tới cằm'),
  t('thượng đình', 'phần trán'),
  t('trung đình', 'từ mày tới chóp mũi'),
  t('hạ đình', 'từ dưới mũi tới cằm'),
  t('quan', 'năm bộ phận chính: mày, mắt, mũi, miệng, tai', '(?<=bốn |năm )quan'),
  t('ấn đường', 'khoảng giữa hai lông mày'),
  t('năm hình', 'năm dáng mặt xếp theo ngũ hành'),
  t('thần khí', 'vẻ sống động, ánh mắt'),
];

export const THUAT_NGU_TAY: readonly ThuatNgu[] = [
  t('đoạn chưởng', 'đường trí và đường tình nhập làm một'),
  t('gò', 'chỗ thịt nổi dưới gốc ngón', 'gò(?= \\p{L})'),
];

export const THUAT_NGU_CHON_NGAY: readonly ThuatNgu[] = [
  t('Hoàng Đạo', 'ngày có thần tốt trông, nên làm việc'),
  t('Hắc Đạo', 'ngày có thần xấu trông, nên tránh việc lớn'),
  t('sao Đức', 'sao tốt, giải được cái xấu nhẹ', '(?:Thiên Đức, Nguyệt Đức(?:,| hoặc) Thiên Xá|[Ss]ao Đức)'),
  t('xung tuổi', 'ngày có con giáp đối với tuổi mình'),
  t('Khổng Minh', 'cách xem ngày xuất hành tương truyền của Khổng Minh'),
  t('Lý Thuần Phong', 'cách xem giờ xuất hành của Lý Thuần Phong'),
];

export const THUAT_NGU_PHI_TINH: readonly ThuatNgu[] = [
  t('vào giữa', 'sao đứng ô giữa, chủ khí cả năm hoặc cả tháng'),
  t('Thái Tuế', 'phía của sao chủ năm'),
  t('Tuế Phá', 'phía đối diện Thái Tuế'),
  t('Tam Sát', 'ba phía xấu theo năm'),
  t('Vận 9', 'chặng 20 năm 2024–2043 theo cách xem này'),
  t('sao vượng', 'sao mạnh nhất của vận'),
  t('Nhất Bạch', 'sao số 1'), t('Nhị Hắc', 'sao số 2'), t('Tam Bích', 'sao số 3'), t('Tứ Lục', 'sao số 4'), t('Ngũ Hoàng', 'sao số 5'),
  t('Lục Bạch', 'sao số 6'), t('Thất Xích', 'sao số 7'), t('Bát Bạch', 'sao số 8'), t('Cửu Tử', 'sao số 9'),
];
