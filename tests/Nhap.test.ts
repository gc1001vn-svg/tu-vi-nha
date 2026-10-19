/**
 * Doc chu go vao form (`src/loi/nhap.ts`): ngay, gio, noi sinh. Ngay trong file nay deu la ngay GIA (luat 1 CLAUDE.md).
 */
import { docGioGo, docNgayGo, khungGio, noiSinhChac, timNoiSinh } from '../src/loi/nhap.ts';
import { NUOC_NGOAI, TINH } from '../src/loi/tinh.ts';

const NAM_NAY = 2026;
const HCM = 'TP. Hồ Chí Minh';
const QT = ['Quảng Trị (bắc sông Bến Hải)', 'Quảng Trị (nam sông Bến Hải)'];

describe('docNgayGo: cac kieu go ngay', () => {
  test.each([
    ['15031985', 1985, 3, 15],
    ['150385', 1985, 3, 15],
    ['15/03/1985', 1985, 3, 15],
    ['15-3-85', 1985, 3, 15],
    ['15.03.1985', 1985, 3, 15],
    ['15 03 1985', 1985, 3, 15],
    ['  5/3/1985 ', 1985, 3, 5],
    ['08011997', 1997, 1, 8],
    ['29022000', 2000, 2, 29],
    ['1/1/2100', 2100, 1, 1],
    // 7 chu so chi mot cach ra ngay co that: 1/51 sai nen la 15/1; 2/42 sai nen la 24/2.
    ['1511985', 1985, 1, 15],
    ['2421985', 1985, 2, 24],
  ])('"%s" → %i-%i-%i', (s, nam, thang, ngay) => {
    expect(docNgayGo(s, NAM_NAY)).toEqual({ nam, thang, ngay });
  });

  test.each([
    ['150326', 2026],
    ['150327', 1927],
    ['15/3/00', 2000],
    ['15/3/99', 1999],
  ])('nam 2 chu so "%s" → %i (≤ nam nay thi 20xx)', (s, nam) => {
    expect(docNgayGo(s, NAM_NAY)).toMatchObject({ nam });
  });

  test.each([
    ['31021985', 'Không có ngày 31/02/1985'],
    ['29021900', 'Không có ngày 29/02/1900'],
    ['31/4/2001', 'Không có ngày 31/04/2001'],
    ['15/13/1985', 'Không có ngày 15/13/1985'],
    ['00/03/1985', 'Không có ngày 00/03/1985'],
  ])('ngay khong co that "%s"', (s, loi) => {
    expect(docNgayGo(s, NAM_NAY)).toEqual({ loi });
  });

  test.each(['1121985', '3531985'])('7 chu so mo ho hay khong ra ngay nao "%s" → bao go them dau /', (s) => {
    expect(docNgayGo(s, NAM_NAY)).toEqual({ loi: 'Gõ thêm dấu / cho rõ ngày và tháng, hoặc gõ đủ 8 số như 15031985' });
  });

  test.each(['1503', '15/03/', '15/3/198', '15031985x', 'ngày 15', '15/03/19855', '123456789'])('chua du hay sai dang "%s"', (s) => {
    expect(docNgayGo(s, NAM_NAY)).toEqual({ loi: 'Gõ đủ ngày, tháng, năm: vd 15031985 hoặc 15/03/1985' });
  });

  test('trong thi bao chua nhap', () => {
    expect(docNgayGo('  ', NAM_NAY)).toEqual({ loi: 'Chưa nhập ngày sinh' });
  });
});

describe('docGioGo: cac kieu go gio', () => {
  test.each([
    ['1430', 14, 30], ['0730', 7, 30], ['730', 7, 30], ['7', 7, 0], ['07', 7, 0], ['14:30', 14, 30], ['14h30', 14, 30],
    ['14H30', 14, 30], ['14h', 14, 0], ['14g30', 14, 30], ['7.30', 7, 30], ['7 30', 7, 30], ['7h5', 7, 5], ['0', 0, 0],
    ['23:59', 23, 59],
  ])('"%s" → %i:%i', (s, gio, phut) => {
    expect(docGioGo(s)).toEqual({ gio, phut });
  });

  test.each(['', '   '])('trong "%s" → khong ro gio (null)', (s) => {
    expect(docGioGo(s)).toBeNull();
  });

  test.each([
    ['25h', 'Không có 25 giờ: giờ từ 0 tới 23'],
    ['2400', 'Không có 24 giờ: giờ từ 0 tới 23'],
    ['14:75', 'Không có 75 phút: phút từ 0 tới 59'],
    ['12345', 'Chưa đọc được giờ: gõ vd 1430 hoặc 7h30, không rõ giờ thì để trống'],
    ['2 giờ chiều', 'Chưa đọc được giờ: gõ vd 1430 hoặc 7h30, không rõ giờ thì để trống'],
  ])('sai "%s"', (s, loi) => {
    expect(docGioGo(s)).toEqual({ loi });
  });

  test.each([
    [14, 30, 'Mùi (13–15)'], [23, 0, 'Tý (23–01)'], [0, 59, 'Tý (23–01)'], [1, 0, 'Sửu (01–03)'], [22, 59, 'Hợi (21–23)'],
  ])('khung gio %i:%i → %s', (gio, phut, ten) => {
    expect(khungGio(gio, phut)).toBe(ten);
  });
});

describe('timNoiSinh: go vai chu, khong dau, viet tat, bi danh', () => {
  test.each([
    ['ha noi', 'Hà Nội'], ['Hà Nội', 'Hà Nội'], ['hanoi', 'Hà Nội'], ['HA NOI', 'Hà Nội'], ['đà nẵng', 'Đà Nẵng'],
    ['hcm', HCM], ['sg', HCM], ['sai gon', HCM], ['Sài Gòn', HCM], ['saigon', HCM], ['tphcm', HCM], ['TP.HCM', HCM],
    ['tp hcm', HCM], ['thanh pho ho chi minh', HCM], ['Tỉnh Thanh Hóa', 'Thanh Hóa'],
    ['hue', 'Thừa Thiên Huế'], ['Huế', 'Thừa Thiên Huế'], ['vung tau', 'Bà Rịa – Vũng Tàu'],
    ['nuoc ngoai', NUOC_NGOAI], ['nn', NUOC_NGOAI],
  ])('"%s" → chi mot goi y, chon luon %s', (s, ten) => {
    expect(timNoiSinh(s)).toEqual([ten]);
    expect(noiSinhChac(s)).toBe(ten);
  });

  test.each([
    ['brvt', ['Bà Rịa – Vũng Tàu']], ['tth', ['Thừa Thiên Huế']], ['dn', ['Đà Nẵng', 'Đắk Nông', 'Đồng Nai']], ['qt', QT],
    ['hn', ['Hà Nội', 'Hà Nam']],
  ])('viet tat chu dau "%s" ra goi y nhung chua tu chon', (s, ds) => {
    expect(timNoiSinh(s)).toEqual(ds);
    expect(noiSinhChac(s)).toBeNull();
  });

  test('"quang tri" ra ca hai muc Quang Tri (bac/nam song Ben Hai), phai bam chon', () => {
    expect(timNoiSinh('quang tri')).toEqual(QT);
    expect(timNoiSinh('tinh quang tri')).toEqual(QT);
    expect(noiSinhChac('quang tri')).toBeNull();
    expect(timNoiSinh('quang tri bac')).toEqual([QT[0]]);
  });

  test('thu tu: dau ten > dau mot tu; cung bac thi theo thu tu bac → nam', () => {
    expect(timNoiSinh('ninh')).toEqual(['Ninh Bình', 'Ninh Thuận', 'Quảng Ninh', 'Bắc Ninh', 'Tây Ninh']);
    expect(timNoiSinh('binh')).toEqual(['Bình Định', 'Bình Thuận', 'Bình Phước', 'Bình Dương', 'Hòa Bình', 'Thái Bình']);
    // An Giang dau ten, Nghe An / Long An dau mot tu, roi moi toi chuoi con (h-AN-oi).
    expect(timNoiSinh('an').slice(0, 4)).toEqual(['An Giang', 'Nghệ An', 'Long An', 'Hà Nội']);
  });

  test('toi da 6 goi y; trong hay khong khop thi rong', () => {
    expect(timNoiSinh('h')).toHaveLength(6);
    expect(timNoiSinh('')).toEqual([]);
    expect(timNoiSinh('   ')).toEqual([]);
    expect(timNoiSinh('xyz')).toEqual([]);
    expect(noiSinhChac('ha')).toBeNull();
  });

  test('moi ten day du (ho so cu dien san, hay vua bam goi y) deu tu chon dung chinh no', () => {
    for (const ten of [...TINH.map(([t]) => t), NUOC_NGOAI]) expect(noiSinhChac(ten)).toBe(ten);
  });
});
