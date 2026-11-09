/**
 * Loi luan chi tay (`chiTayLuan.ts`), Claude soan moi (luat 6), khong chep sach. Ke hoach 09/11 `2026-11-09-loi-giai-chi-tay-nguon.md`:
 * moi y mot cau, ghi sach cuoi cau; cau ghep nhieu o (sach ban dung cap → "theo"; sach ban rieng tung phan, app ghep theo cach Benham
 * day "nghĩ ra các tổ hợp" va Cheiro "dấu lặp ở đường khác thì chắc hơn" → "ghép ý"). Nguyen van, trang tung y: `docs/LUAN_CHI_TAY.md`.
 */

/** Ten ngan ghi cuoi cau → sach (ban, trang: `docs/LUAN_CHI_TAY.md` muc 1). */
export const SACH = {
  Cheiro: "Cheiro, Cheiro's Language of the Hand (bản in 1898); Palmistry for All",
  Benham: 'W. G. Benham, The Laws of Scientific Hand Reading (1900)',
  'Saint-Germain': 'C. de Saint-Germain, Practical Palmistry (1897)',
  'Toàn Biên': 'Thần Tướng Toàn Biên (Minh; Cổ Kim Đồ Thư Tập Thành q.640)',
} as const;
export type TenSach = keyof typeof SACH;

/** Mot y: loi (chua cham cuoi), sach do; `ghep`: sach ban rieng tung phan, app ghep lai. */
export interface Y { readonly loi: string; readonly sach: readonly TenSach[]; readonly ghep?: true }

const y = (loi: string, ...sach: TenSach[]): Y => ({ loi, sach });
const g = (loi: string, ...sach: TenSach[]): Y => ({ loi, sach, ghep: true });

/** Cau hien ra: loi + nguon trong ngoac. */
export const cau = (x: Y): string => `${x.loi} (${x.ghep === true ? 'ghép ý' : 'theo'} ${x.sach.join(', ')}).`;

type Dai = 'long' | 'medium' | 'short';
type Bang<A extends string, B extends string> = Readonly<Record<A, Readonly<Record<B, Y>>>>;

// ---- Tinh cach, tri tue ----

/** Duong tri: dang × do dai. */
export const TRI_DANG: Bang<'straight' | 'curved', Dai> = {
  straight: {
    long: y('Đường trí thẳng và dài: óc thực tế, sức nghĩ hơn người, chuộng việc ra kết quả rõ; Cheiro dặn người có đường này dễ chỉ '
      + 'dùng tài cho riêng mình', 'Cheiro', 'Benham'),
    medium: y('Đường trí thẳng, dài vừa: thực tế, cân bằng, ý đã định thì khó lay; Benham dặn dáng này dễ cứng nhắc, muốn người khác '
      + 'nghĩ như mình', 'Benham', 'Cheiro'),
    short: y('Đường trí thẳng mà ngắn: nghĩ thực, làm gọn, giỏi việc trước mắt hơn việc bàn xa', 'Cheiro', 'Benham'),
  },
  curved: {
    long: y('Đường trí dài, cong xuống: óc tưởng tượng mạnh mà vẫn đủ sức nghĩ — Benham gặp dáng này ở người viết truyện, làm thơ',
      'Benham', 'Cheiro'),
    medium: y('Đường trí cong xuống vừa phải: thiên về việc cần óc tưởng tượng — âm nhạc, hội họa, viết lách, sáng chế; Benham: dáng này '
      + 'gặp ở rất nhiều người tỉnh táo, thực tế — giàu tưởng tượng không có nghĩa là viển vông', 'Cheiro', 'Benham'),
    short: y('Đường trí cong xuống mà ngắn: dáng cong nghiêng về tưởng tượng, độ ngắn nghiêng về việc trước mắt — hai dấu kéo hai ngả, '
      + 'Cheiro dặn không lấy một dấu mà kết luận', 'Cheiro'),
  },
};

/** Dau duong tri dinh / tach duong doi × diem dau duong su nghiep (hoac khong co). */
export const TRI_DAU: Bang<'true' | 'false', 'wrist' | 'life' | 'middle' | 'none'> = {
  true: {
    wrist: g('Đầu đường trí dính đường đời mà đường sự nghiệp mọc từ cổ tay: tính thận trọng, hay lo xa, nhưng đường làm ăn tự gây '
      + 'dựng — cẩn thận là vốn, chỉ cần bớt tự kìm mình', 'Cheiro', 'Benham'),
    life: g('Đầu đường trí dính đường đời, đường sự nghiệp cũng tách từ đường đời: hai dấu cùng một hướng — quen dựa vào ý gia đình, '
      + 'người thân; tự quyết sớm hơn thì việc mới mở', 'Benham', 'Cheiro'),
    middle: g('Đầu đường trí dính đường đời, đường sự nghiệp mọc giữa lòng tay: lúc trẻ dè dặt, chưa dám tự quyết, việc thành muộn — '
      + 'tự tin dần lên thì thời tốt mới tới', 'Benham', 'Cheiro'),
    none: g('Đầu đường trí dính đường đời, không có đường sự nghiệp: thận trọng, quen hỏi ý người khác mà lại không có lối đi định sẵn '
      + '— tự đặt cho mình một hướng thì bớt chần chừ', 'Benham', 'Cheiro'),
  },
  false: {
    wrist: g('Đầu đường trí tách đường đời, đường sự nghiệp mọc từ cổ tay: hai dấu cùng chỉ sự tự lập — tự quyết từ sớm, tự dựng '
      + 'nghiệp; Cheiro dặn người tách đường nên ngủ một đêm trước việc lớn', 'Cheiro', 'Benham'),
    life: g('Đầu đường trí tách đường đời, đường sự nghiệp tách từ đường đời: có gia đình đỡ lúc đầu nhưng sớm biết tự nghĩ, tự quyết '
      + '— đường trí tách càng sớm thì càng sớm tự lập', 'Benham', 'Cheiro'),
    middle: g('Đầu đường trí tách đường đời, đường sự nghiệp mọc giữa lòng tay: dám nghĩ dám làm, tự lo lấy, nhưng nửa đầu đời chật '
      + 'vật; ít hỏi ý ai nên dễ lầm — bền chí thì qua', 'Cheiro', 'Benham'),
    none: g('Đầu đường trí tách đường đời, không có đường sự nghiệp: tự tin, tự lo, không theo lối định sẵn — hợp tự chọn việc, tự '
      + 'làm chủ', 'Benham', 'Cheiro'),
  },
};

/** Duong tri dut × net tren anh. */
export const TRI_DUT: Readonly<Record<'clear' | 'faint', Y>> = {
  clear: y('Đường trí có chỗ đứt mà nét đậm: có lúc hăng lúc nản, việc dễ dở dang, nhưng nét đậm thì nối lại được', 'Toàn Biên', 'Benham'),
  faint: y('Đường trí đứt, nét lại mờ: dễ đổi ý, việc hay bỏ dở — chia việc nhỏ, làm xong từng phần', 'Toàn Biên', 'Cheiro'),
};

export const TRI_KHONG = y('Chưa thấy đường trí trên ảnh — Benham chỉ một lần gặp bàn tay không có đường trí, và chừng một năm sau '
  + 'đường ấy đã mọc; nên chụp lại cho rõ', 'Benham');

// ---- Cong viec, tien bac ----

/** Duong su nghiep: diem dau × net tren anh. */
export const NGHIEP: Bang<'wrist' | 'life' | 'middle', 'clear' | 'faint'> = {
  wrist: {
    clear: y('Đường sự nghiệp rõ, mọc từ cổ tay thẳng lên: tướng tự tay dựng nghiệp — Toàn Biên gọi là "tay trắng làm nên", Cheiro '
      + 'coi là dấu thành đạt lớn', 'Toàn Biên', 'Cheiro', 'Benham'),
    faint: y('Đường sự nghiệp mọc từ cổ tay mà nét mảnh: hướng đi có từ sớm, tự sức mình mà nên, nhưng phải gắng nhiều hơn người nét '
      + 'đậm mới ra kết quả lớn', 'Benham'),
  },
  life: {
    clear: y('Đường sự nghiệp tách từ đường đời, đi lên rõ: lúc đầu có người thân đỡ, rồi thành nhờ chính tài sức mình', 'Cheiro',
      'Benham', 'Toàn Biên'),
    faint: g('Đường sự nghiệp tách từ đường đời, nét mờ: tuổi trẻ gắn chặt với gia đình, có khi phải theo ý cha mẹ, họ hàng hơn ý mình; '
      + 'nét mảnh thì phải tự gắng nhiều hơn', 'Cheiro', 'Benham'),
  },
  middle: {
    clear: y('Đường sự nghiệp mọc giữa lòng tay, đi lên rõ: nửa đầu đời vất vả, qua rồi thì phần sau êm — thành nhờ bền chí', 'Cheiro',
      'Benham'),
    faint: y('Đường sự nghiệp mọc giữa lòng tay, nét mảnh: thời tốt đến muộn, bắt đầu từ chỗ đường mọc, và phải tự gắng nhiều', 'Benham'),
  },
};

/** Khong co duong su nghiep × do dai duong tri. */
export const NGHIEP_KHONG: Readonly<Record<Dai, Y>> = {
  long: g('Không có đường sự nghiệp, đường trí dài: Benham gặp nhiều người thành đạt không có đường này, tự lập từ tay trắng — ở bàn '
    + 'tay này cái vốn để tự lập là đầu óc', 'Benham'),
  medium: y('Không có đường sự nghiệp: Benham gặp ở nhiều người tự lập từ tay trắng — không có lối đi định sẵn, phải gắng đều tay; '
    + 'sách cũ cho là đời nhạt, Benham bác ý đó', 'Benham'),
  short: g('Không có đường sự nghiệp, đường trí ngắn: thành nhờ chăm chỉ, làm gọn việc trước mắt, không trông vào thời vận', 'Benham',
    'Cheiro'),
};

/** Duong su nghiep dut × net tren anh. */
export const NGHIEP_DUT: Readonly<Record<'clear' | 'faint', Y>> = {
  clear: y('Đường sự nghiệp đậm mà có chỗ đứt: có lần đổi hẳn hướng làm ăn; đoạn sau mọc trước khi đoạn trước dứt thì Cheiro đọc là '
    + 'đổi theo ý mình, để tiến lên', 'Benham', 'Cheiro'),
  faint: y('Đường sự nghiệp mảnh lại đứt: làm ăn lên xuống nhiều lần — "một đứt một nối, một thành một bại"; lúc thuận nên giữ lại '
    + 'phần đã được', 'Toàn Biên', 'Benham'),
};

// ---- Tinh cam, gia dinh ----

/** Duong tinh: do dai × dut. */
export const TINH: Bang<Dai, 'true' | 'false'> = {
  long: {
    false: y('Đường tình dài tới dưới ngón trỏ, liền: tình cảm lý tưởng, chung thủy, chọn người rất kỹ và đặt người mình thương lên cao',
      'Cheiro', 'Benham'),
    true: g('Đường tình dài tới dưới ngón trỏ mà có chỗ đứt: yêu lý tưởng nên khi người thương không như mình nghĩ thì hụt hẫng lâu — '
      + 'Cheiro gọi chỗ đứt là lần thất vọng trong tình cảm', 'Cheiro'),
  },
  medium: {
    false: y('Đường tình dừng ở khe ngón trỏ – ngón giữa, liền: tình cảm điềm tĩnh mà sâu, thực tế, không để lời ngọt cuốn đi', 'Cheiro',
      'Benham'),
    true: g('Đường tình dừng ở khe ngón trỏ – ngón giữa mà có chỗ đứt: có lần thất vọng trong tình cảm, tính điềm tĩnh giúp qua được',
      'Cheiro'),
  },
  short: {
    false: y('Đường tình ngắn, dừng dưới ngón giữa: nặng tình nhưng ít bày tỏ, trong nhà ít nói lời thương, dễ nghĩ cho mình trước',
      'Cheiro'),
    true: g('Đường tình ngắn lại có chỗ đứt: ít bày tỏ nên dễ bị hiểu lầm, có lần thất vọng trong tình cảm — nói ra điều mình nghĩ thì '
      + 'đỡ', 'Cheiro'),
  },
};

/** Vong duong doi × do dai duong tinh (Benham: vong rong la nong nhiet, rong rai; om sat la lanh, it ham muon). */
export const TINH_VONG: Bang<'wide' | 'narrow', Dai> = {
  wide: {
    long: g('Đường đời vòng rộng, đường tình dài: hai dấu cùng chỉ người ấm áp, rộng lòng, yêu hết mình', 'Benham', 'Cheiro'),
    medium: g('Đường đời vòng rộng: nồng nhiệt, rộng rãi, dễ được người quý — đường tình điềm tĩnh giữ cho tình cảm khỏi bốc đồng',
      'Benham', 'Cheiro'),
    short: g('Đường đời vòng rộng mà đường tình ngắn: ấm áp, rộng rãi với mọi người nhưng ít nói lời thương — người gần cần hiểu điều đó',
      'Benham', 'Cheiro'),
  },
  narrow: {
    long: g('Đường đời ôm sát ngón cái mà đường tình dài: bề ngoài kín, ít hăng hái, người ngoài dễ tưởng lạnh, nhưng bên trong nhiều '
      + 'tình', 'Benham', 'Cheiro'),
    medium: g('Đường đời ôm sát ngón cái: kín đáo, giữ mình, ít ham vui; tình cảm điềm tĩnh, chậm mà chắc', 'Benham', 'Cheiro'),
    short: g('Đường đời ôm sát ngón cái, đường tình ngắn: hai dấu cùng chỉ người kín, ít bày tỏ tình cảm — chủ động quan tâm thì giữ '
      + 'được người', 'Benham', 'Cheiro'),
  },
};

/** Duong tinh va duong tri dam nhat khac nhau tren anh (Benham so dam nhat, Cheiro "duong nao manh hon thi tri"). */
export const TINH_TRI: Readonly<Record<'tinh' | 'tri', Y>> = {
  tinh: g('Giữa hai đường, đường tình đậm hơn đường trí: khi lý và tình giằng co thì tình thường thắng', 'Benham', 'Cheiro'),
  tri: g('Giữa hai đường, đường trí đậm hơn đường tình: khi lý và tình giằng co thì lý trí thường thắng', 'Benham', 'Cheiro'),
};

export const TINH_KHONG = y('Chưa thấy đường tình riêng — Benham: một đường ngang duy nhất thì coi là đường trí, đường tình như vắng; '
  + 'nếu đường trên cùng chạy suốt bàn tay thì đó là chỉ tay ngang', 'Benham');

// ---- Suc ben ----

/** Duong doi: do dai × vong. */
export const SUC: Bang<Dai, 'wide' | 'narrow'> = {
  long: {
    wide: y('Đường đời dài, vòng rộng ra giữa lòng tay: sức vóc dồi dào, dẻo dai, giữ được lâu', 'Cheiro', 'Benham'),
    narrow: g('Đường đời dài mà ôm sát ngón cái: sức bền giữ được lâu nhưng không dồi dào — hợp làm đều tay hơn là gắng quá sức',
      'Benham', 'Cheiro'),
  },
  medium: {
    wide: y('Đường đời dài vừa, vòng rộng: nhiều sinh lực, sức vóc tốt', 'Benham', 'Cheiro'),
    narrow: y('Đường đời dài vừa, ôm sát ngón cái: sức vóc vừa phải, không thật khỏe — đừng làm quá sức lâu', 'Cheiro', 'Benham'),
  },
  short: {
    wide: g('Đường đời ngắn mà vòng rộng: sinh lực mạnh nhưng không bền — dồn sức từng đợt thì phải biết nghỉ, đừng vắt kiệt', 'Benham'),
    narrow: y('Đường đời ngắn, ôm sát ngón cái: sức có hạn, phải biết chia sức, giữ nếp sống đều', 'Benham', 'Cheiro'),
  },
};

export const SUC_BU = y('Đường đời ngắn nhưng đường trí rõ, dài: Saint-Germain cho là đường trí tốt đỡ được cho đường đời ngắn — biết '
  + 'tính toán, dùng sức khéo', 'Saint-Germain', 'Benham');
export const SUC_DUT: Readonly<Record<'clear' | 'faint', Y>> = {
  clear: y('Đường đời có chỗ đứt mà nét đậm: có một quãng phải chậm lại, lấy sức; Benham: đứt trên nét đậm nhẹ hơn trên nét mờ, dễ nối '
    + 'lại', 'Benham'),
  faint: y('Đường đời đứt, nét lại mờ: quãng phải chậm lại có thể dài hơn — giữ ăn ngủ đều từ sớm', 'Benham'),
};
export const SUC_DAM = y('Trên ảnh đường đời đậm hơn hai đường kia: Benham đọc là người ít lo nghĩ, bình tĩnh lúc gấp', 'Benham');
export const SUC_KHONG = y('Chưa thấy đường đời trên ảnh — Benham: hiếm ai không có đường này, nhìn kỹ hầu như luôn thấy dấu vết; nên '
  + 'chụp lại cho rõ', 'Benham');
export const SUC_NHAC = 'Đường đời không báo tuổi thọ, không báo bệnh: muốn biết sức khỏe thì đi khám.';

// ---- Cac quang doi ----

/** Diem dau duong su nghiep × co dut: moc thoi gian. */
export const QUANG: Bang<'wrist' | 'life' | 'middle', 'true' | 'false'> = {
  wrist: {
    false: y('Tuổi trẻ đã tự lo, đường làm ăn đi một mạch từ sớm, bền một hướng', 'Toàn Biên', 'Benham'),
    true: y('Tuổi trẻ đã tự lo; giữa chừng có lần đổi hẳn hướng làm ăn', 'Benham', 'Cheiro'),
  },
  life: {
    false: y('Tuổi trẻ sống trong vòng gia đình; tự đứng ra từ chỗ đường sự nghiệp tách khỏi đường đời, rồi đi bền một hướng', 'Cheiro',
      'Benham'),
    true: y('Tuổi trẻ trong vòng gia đình; sau khi tự đứng ra còn một lần đổi hướng lớn', 'Cheiro', 'Benham'),
  },
  middle: {
    false: y('Nửa đầu đời chật vật, thử nhiều việc; thời tốt bắt đầu từ chỗ đường sự nghiệp mọc, giữa lòng tay', 'Benham', 'Cheiro'),
    true: y('Nửa đầu đời chật vật; việc thành từ giữa đời, sau còn một lần đổi hướng', 'Benham', 'Cheiro'),
  },
};

/** Khong co duong su nghiep × dau duong tri dinh / tach (Benham: tach cang som thi cang som tu nghi cho minh); `chung`: may chua do dau. */
export const QUANG_KHONG: Readonly<Record<'true' | 'false' | 'chung', Y>> = {
  chung: y('Không có mốc sự nghiệp rõ: các quãng đời đều đều, mỗi quãng tự dựng', 'Benham'),
  true: g('Không có mốc sự nghiệp rõ: các quãng đời đều đều, mỗi quãng tự dựng; đầu đường trí dính đường đời nên tuổi trẻ quen nghe '
    + 'người nhà, tự quyết muộn', 'Benham'),
  false: g('Không có mốc sự nghiệp rõ: các quãng đời đều đều, mỗi quãng tự dựng; đầu đường trí tách đường đời nên biết tự nghĩ, tự '
    + 'quyết từ sớm', 'Benham'),
};

// ---- Tong luan ----

/** Ten "mang" cua tung duong cho cau ket. */
export const MANG = { life: 'sức bền', head: 'đầu óc', heart: 'tình cảm', fate: 'công việc' } as const;
export const KET_SACH: readonly TenSach[] = ['Benham', 'Cheiro'];
export const KET = {
  ca: (manh: string, yeu: string): string => `Kết: mạnh nhất là ${manh}; cần giữ nhất là ${yeu}`,
  manh: (manh: string): string => `Kết: mạnh nhất là ${manh}; không đường nào kém hẳn`,
  yeu: (yeu: string): string => `Kết: không đường nào trội hẳn; cần giữ nhất là ${yeu}`,
  deu: 'Kết: các đường ngang nhau, không đường nào trội hay kém hẳn — đọc cả bàn tay, đừng dựa vào một đường',
} as const;

export const NET = {
  sach: y('Ba đường chính rõ và liền: Toàn Biên gọi ba đường trong sáng, không bị nét khác cắt là tướng phúc lộc; Benham: nét rõ, liền '
    + 'thì gặp khó vẫn vượt qua', 'Toàn Biên', 'Benham'),
  mo: y('Trên ảnh cả ba đường chính mờ như nhau — có thể do ánh sáng: sách dặn so các đường với nhau, nét đều nhau thì không đọc riêng '
    + 'đường nào; chụp lại dưới đèn sáng cho chắc', 'Benham'),
};

export const NGANG_Y = y('Có chỉ tay ngang (đường trí và đường tình nhập một): Cheiro gặp ở người dồn hết tâm trí vào việc mình chọn, '
  + 'bền chí hơn mọi kiểu tay khác, nhưng hay cô độc, dễ tổn thương, hợp làm một mình hơn hùn hạp; đường nằm ở chỗ đường trí thì lý '
  + 'trí lấn, nằm sát gốc ngón thì tình cảm lấn. Các nước đọc đường này trái ngược nhau nên app không chấm tốt xấu', 'Cheiro');

export const CHUA_DU = 'Máy chưa dò đủ ba đường chính (đường đời, đường trí, đường tình) để luận cả bàn tay — chụp lại ảnh rõ, thẳng hơn.';
export const CHUA_NGHIEP = 'Máy chưa dò được đường sự nghiệp.';
export const CHUA_QUANG = 'Máy chưa dò đủ đường sự nghiệp để chia các quãng đời.';

export const NHAC = [
  'Chỉ tay đổi theo năm tháng: Benham kể một bàn tay mọc thêm đường trí sau chừng một năm; sách dặn xem cả hai tay (Cheiro: tay trái '
    + 'là phần bẩm sinh, tay phải là phần tự rèn) và không lấy một dấu mà kết luận. Nam xem tay trái, nữ tay phải theo tục Việt.',
  'Máy chỉ đo hình dáng bốn đường trên ảnh; gò tay, ngón tay, màu da, các nét nhỏ — phần sách tướng tay coi trọng — app không xét; nét '
    + 'rõ hay mờ trên ảnh còn tùy ánh sáng nên app chỉ so các đường với nhau.',
  'Chỉ tay là quan niệm dân gian, chưa có nghiên cứu nào cho thấy đường chỉ tay báo trước tính cách hay vận mệnh: đọc để biết mình, '
    + 'đừng dùng để quyết việc lớn, không dùng để đoán bệnh.',
] as const;
