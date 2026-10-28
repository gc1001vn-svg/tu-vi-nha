/**
 * Chi tay (dot 7 phan 3): AI doc anh (Groq) chi ta 4 duong chinh vao `KHUNG` dung san (`LOI_DAN_CHI_TAY`), app kiem tung o
 * (`docKhung`) roi ghep loi Claude soan lai (luat 6 `CLAUDE.md`: soan moi, khong chep) theo sach tuong tay pham vi cong cong:
 * Trung Hoa (Than Tuong Toan Bien, Lieu Trang tuong phap), An Do (Brhat Samhita), phuong Tay (Cheiro 1916, Benham 1900). Nguon,
 * cho venh, so do: `docs/QUY_UOC.md` muc 27.
 */

const RO = ['clear', 'faint', 'none'] as const;
const DAI = ['short', 'medium', 'long'] as const;
const CO = [true, false] as const;

/** O AI dien. Ma tieng Anh: loi dan tieng Anh cho mo hinh doc anh hieu dung tung o; app doi ra loi tieng Viet. */
export const KHUNG = {
  life: { seen: RO, length: DAI, arc: ['wide', 'narrow'], broken: CO },
  head: { seen: RO, length: DAI, shape: ['straight', 'curved'], joined: CO, broken: CO },
  heart: { seen: RO, length: DAI, broken: CO },
  fate: { seen: RO, start: ['wrist', 'life', 'middle'], broken: CO },
} as const;

export type Duong = keyof typeof KHUNG;
type O<D extends Duong> = keyof (typeof KHUNG)[D];
type Gia<D extends Duong, K extends O<D>> = (typeof KHUNG)[D][K] extends readonly (infer G)[] ? G : never;

/** O nao AI tra sai (thieu, la gia tri ngoai khung) thi null. */
export type DocDuong<D extends Duong> = { readonly [K in O<D>]: Gia<D, K> | null };

export interface KhungChiTay {
  /** AI thay ro dung mot long ban tay; false thi cac o con lai bo. */
  readonly palm: boolean;
  /** Duong tri va duong tinh nhap mot (chi tay ngang). */
  readonly simian: boolean | null;
  readonly duong: { readonly [D in Duong]: DocDuong<D> };
}

const CAC_DUONG = Object.keys(KHUNG) as Duong[];

const khuon = CAC_DUONG.map((d) => `"${d}": {${Object.entries(KHUNG[d]).map(([k, v]: [string, readonly unknown[]]) =>
  `"${k}": ${typeof v[0] === 'boolean' ? 'true|false' : `"${v.join('|')}"`}`).join(', ')}}`).join(',\n ');

/** Loi dan gui kem anh (Claude soan, tieng Anh) — khuon JSON sinh tu `KHUNG` nen khong lech nhau. */
export const LOI_DAN_CHI_TAY = `You read palm photos for a palmistry app. Fill this JSON frame from the photo. Answer with JSON only.
{"palm": true|false, "simian": true|false,
 ${khuon}}
Definitions:
- palm: true only if the photo clearly shows exactly one open palm (inside of the hand) with the bases of all fingers and of the thumb.
- simian: true if the head line and heart line are merged into one single crease running across the whole palm.
- life line: curves around the base of the thumb. length: long = reaches near the wrist; short = ends before halfway down the palm. arc: wide = swings out into the centre of the palm; narrow = hugs the thumb.
- head line: runs across the middle of the palm, starting on the thumb side. length: long = reaches near the little-finger edge; medium = ends under the ring finger; short = ends under the middle finger or earlier. shape: straight = runs level across; curved = slopes down toward the wrist. joined = its start touches the life line.
- heart line: the highest crease across the palm, just under the fingers, starting at the little-finger edge. length: long = reaches under the index finger; medium = ends between the index and middle fingers; short = ends under the middle finger or earlier.
- fate line: a vertical line up the centre of the palm toward the middle finger; many people have none. start: wrist = from just above the wrist; life = branches off the life line; middle = only from the middle of the palm or higher.
- seen: clear = sharp and deep; faint = shallow or hard to see; none = not visible. broken = has a visible gap.
If simian is true, describe the merged crease as both the head and the heart line.`;

/** Doc tra loi AI (bien tin cay: AI co the tra chu thua, o thieu, gia tri ngoai khung). Khong ra JSON thi null. */
export function docKhung(chu: string): KhungChiTay | null {
  let o: unknown;
  try {
    o = JSON.parse(chu.slice(chu.indexOf('{'), chu.lastIndexOf('}') + 1));
  } catch {
    return null;
  }
  if (typeof o !== 'object' || o === null) return null;
  const goc = o as Record<string, unknown>;
  const lay = (gia: unknown, cho: readonly unknown[]): unknown => (cho.includes(gia) ? gia : null);
  const duong = Object.fromEntries(CAC_DUONG.map((d) => {
    const x = goc[d], v = typeof x === 'object' && x !== null ? x as Record<string, unknown> : {};
    return [d, Object.fromEntries(Object.entries(KHUNG[d]).map(([k, cho]: [string, readonly unknown[]]) => [k, lay(v[k], cho)]))];
  })) as unknown as KhungChiTay['duong'];
  return { palm: goc['palm'] === true, simian: lay(goc['simian'], CO) as boolean | null, duong };
}

/** Moi o thanh cap [ten o, gia tri] de so hai lan doc; duong khong thay (`none`) thi cac o kia khong tinh (null). */
export function cacO(k: KhungChiTay): [string, unknown][] {
  return [['simian', k.simian], ...CAC_DUONG.flatMap((d) => Object.entries(k.duong[d]).map(([o, g]): [string, unknown] =>
    [`${d}.${o}`, o !== 'seen' && k.duong[d].seen === 'none' ? null : g]))];
}

const S = {
  toanBien: 'Thần Tướng Toàn Biên (Minh, trong Cổ Kim Đồ Thư Tập Thành q.640)',
  lieuTrang: 'Liễu Trang tướng pháp (Minh)',
  brhat: 'Bṛhat Saṃhitā (Ấn Độ, thế kỷ 6)',
  aristotle: 'Aristotle, Historia Animalium I.15 (Hy Lạp)',
  cheiro: 'Cheiro, Palmistry for All (Anh, 1916)',
  benham: 'Benham, The Laws of Scientific Hand Reading (Mỹ, 1900)',
} as const;

interface DongGiai<D extends Duong> {
  readonly ten: string;
  /** Duong nam o dau, cac nen doc la gi. */
  readonly y: string;
  readonly nguon: string;
  readonly o: { readonly [K in O<D>]: { readonly nhan: string; readonly loi: Readonly<Record<`${Gia<D, K> & (string | boolean)}`, string>> } };
}

const LIEN = 'Toàn Biên: "ba đường trong sáng, không bị nét khác cắt là tướng phúc lộc"';
const ANH_MO = 'Ảnh tối, chói hay mờ cũng làm nét trông nhạt — chụp lại đủ sáng trước khi tin.';

/** Loi Claude soan lai cho moi gia tri moi o (kieu bat du: thieu mot gia tri la loi bien dich). */
export const GIAI: { readonly [D in Duong]: DongGiai<D> } = {
  life: {
    ten: 'Đường đời (sinh đạo)',
    y: 'Vòng quanh gốc ngón cái. Sách Trung Hoa gọi Địa văn — nét dưới "ứng Đất, tượng bề tôi, tượng mẹ, chủ thọ yểu" (Toàn Biên); '
      + 'sách Tây (Cheiro, Benham) đọc sức sống, thể lực. Đường ngắn không phải điềm đoản thọ: không có cơ sở khoa học.',
    nguon: `${S.toanBien}; ${S.lieuTrang}; ${S.cheiro}; ${S.benham}`,
    o: {
      seen: { nhan: 'Độ rõ', loi: {
        clear: 'Rõ, sâu. Cheiro: đường mảnh, rõ, sâu bền sức hơn đường to mà nông; Toàn Biên: "nét nhỏ mà sâu là tốt".',
        faint: `Mờ, nông. Cheiro: đường to bè mà nông không bền bằng đường mảnh, sâu; Liễu Trang: "nét nông thì chí cũng nông". ${ANH_MO}`,
        none: 'AI không thấy đường này — thường do ảnh (tối, nghiêng, ngón cái che). Toàn Biên: ba đường lớn "người người đều có".',
      } },
      length: { nhan: 'Độ dài', loi: {
        long: 'Dài, vòng xuống gần cổ tay. Cheiro, Benham: sức bền, sống lâu.',
        medium: 'Dài vừa: mức thường gặp, sách không đọc gì riêng.',
        short: 'Ngắn, dừng trên nửa lòng bàn tay. Benham coi chỗ đường dừng là quãng nên giữ sức khoẻ và dặn xem cả hai tay — tay '
          + 'phải dài hơn thì đọc theo tay phải. Chỉ tay còn đổi theo năm tháng: Benham kể một bàn tay mọc thêm đường trí sau chừng một năm.',
      } },
      arc: { nhan: 'Độ vòng', loi: {
        wide: 'Vòng rộng ra giữa lòng bàn tay. Benham: gò ngón cái (gò Kim Tinh) rộng — ấm áp, nhiều sinh lực; Cheiro: gò này càng '
          + 'rộng càng nồng nhiệt.',
        narrow: 'Ôm sát gốc ngón cái. Benham: gò ngón cái hẹp lại — lạnh, ít ham muốn, sức sống kém hơn; Cheiro: gò hẹp, mỏng thì bớt nồng nhiệt.',
      } },
      broken: { nhan: 'Đứt quãng', loi: {
        true: 'Có chỗ đứt. Toàn Biên: "nét dù tốt mà đứt lâu là tướng dở dang"; Cheiro: đứt khúc, nối như mắt xích là lúc sức khoẻ yếu '
          + '— lời sách cổ, không phải chẩn đoán.',
        false: `Liền một mạch. ${LIEN}; Cheiro: đường đời chuẩn là dài, rõ, không đứt.`,
      } },
    },
  },
  head: {
    ten: 'Đường trí (trí đạo)',
    y: 'Đường ngang giữa lòng bàn tay, đầu phía ngón cái. Sách Trung Hoa gọi Nhân văn — nét giữa "ứng Người, tượng hiền ngu, phân '
      + 'giàu nghèo" (Toàn Biên); sách Tây: trí óc, cách nghĩ — Cheiro coi là đường quan trọng nhất.',
    nguon: `${S.toanBien}; ${S.lieuTrang}; ${S.cheiro}; ${S.benham}`,
    o: {
      seen: { nhan: 'Độ rõ', loi: {
        clear: 'Rõ, sâu. Cheiro: đường trí sắc gọn, sâu là trí lực mạnh hơn đường to bè chỉ nằm trên mặt da; Toàn Biên: "nét nhỏ mà sâu là tốt".',
        faint: `Mờ. Cheiro: tay trái mờ mà tay phải rõ là người tự rèn trí óc, không nhờ cha mẹ truyền; Liễu Trang: "nét nông thì chí cũng nông". ${ANH_MO}`,
        none: 'AI không thấy đường này — thường do ảnh. Benham chỉ một lần gặp bàn tay không có đường trí, và chừng một năm sau đường ấy đã mọc.',
      } },
      length: { nhan: 'Độ dài', loi: {
        long: 'Dài, chạy tới gần mép bàn tay phía ngón út. Benham: trí lực dồi dào; Cheiro: đường trí chạy thẳng thật xa là người ý chí '
          + 'rất mạnh, dám dốc hết cho điều mình cho là phải.',
        medium: 'Dài vừa, dừng dưới ngón áp út: mức thường gặp.',
        short: 'Ngắn, dừng dưới ngón giữa. Benham: trí lực không mạnh bằng đường dài, và dặn phải xem thêm các đường khác mới kết luận; '
          + 'Toàn Biên: "nét nhỏ thấy nhỏ, nét lớn thấy lớn".',
      } },
      shape: { nhan: 'Dáng', loi: {
        straight: 'Ngang thẳng. Cheiro: thực tế, "đầu óc cân bằng", hợp kinh doanh, khoa học; Toàn Biên: "nét ngay thì lòng cũng ngay".',
        curved: 'Cong, dốc xuống phía cổ tay. Cheiro: giàu tưởng tượng, hợp nghệ thuật, dốc quá thì dễ làm theo cảm hứng; Toàn Biên: '
          + '"nét cong queo thì hay ngờ, hay lo".',
      } },
      joined: { nhan: 'Điểm đầu', loi: {
        true: 'Dính đường đời. Cheiro, Benham: nhạy cảm, thận trọng, kém tự tin, hay hỏi ý người khác; Cheiro: kiểu này gặp nhiều hơn kiểu tách rời.',
        false: 'Tách khỏi đường đời. Cheiro, Benham: tự tin, nghĩ nhanh, tự lo liệu; Benham dặn dễ hấp tấp vì ít hỏi ý ai.',
      } },
      broken: { nhan: 'Đứt quãng', loi: {
        true: 'Có chỗ đứt. Toàn Biên: "nét đứt nối thì dễ siêng dễ lười", "nét dù tốt mà đứt lâu là tướng dở dang".',
        false: `Liền một mạch. ${LIEN}; Liễu Trang: nét nên nhỏ, sâu, thành hình, kỵ nông, rối, đứt, cong vẹo.`,
      } },
    },
  },
  heart: {
    ten: 'Đường tình (tâm đạo)',
    y: 'Đường ngang trên cùng, ngay dưới gốc các ngón, đầu phía ngón út. Sách Tây (Cheiro, Benham): tình cảm. Sách Trung Hoa gọi '
      + 'Thiên văn — nét trên "ứng Trời, tượng vua, tượng cha, định sang hèn" (Toàn Biên), không bàn chuyện tình. Ấn Độ (Bṛhat '
      + 'Saṃhitā 69.13) coi đây là đường thọ; Aristotle cũng nói người thọ có một hai đường chạy suốt lòng bàn tay. Các nền đọc '
      + 'khác hẳn nhau.',
    nguon: `${S.toanBien}; ${S.lieuTrang}; ${S.brhat}; ${S.aristotle}; ${S.cheiro}; ${S.benham}`,
    o: {
      seen: { nhan: 'Độ rõ', loi: {
        clear: 'Rõ, sâu. Cheiro: đường tình nên "sâu, rõ, hồng hào"; Bṛhat Saṃhitā 67.43: đường bóng, sâu là tướng người giàu.',
        faint: `Mờ, nhạt. Cheiro: đường nhạt, bè, không sâu là người hờ hững, tình không sâu; Toàn Biên: "nét thô mà nông là hèn". ${ANH_MO}`,
        none: 'AI không thấy đường này — thường do ảnh (gốc ngón che, tối) hoặc đường tình đã nhập với đường trí (xem dòng chỉ tay ngang).',
      } },
      length: { nhan: 'Độ dài', loi: {
        long: 'Dài tới dưới ngón trỏ. Benham: đường tình chuẩn khởi từ dưới ngón trỏ; Cheiro: giàu lý tưởng trong tình yêu, một trong '
          + 'những dạng tốt nhất — chạy lệch hẳn ra mép bàn tay thì yêu mù quáng, dài quá mức thì dễ ghen.',
        medium: 'Tới khe ngón trỏ – ngón giữa. Cheiro: điềm tĩnh mà sâu sắc, dung hoà giữa lý tưởng và cái tôi; Bṛhat Saṃhitā 69.13: '
          + 'đường từ gốc ngón út tới đúng khe này là đường thọ dài nhất.',
        short: 'Ngắn, dừng dưới ngón giữa. Cheiro: đường tình càng ngắn, tình cảm cao thượng càng ít lộ ra; khởi từ dưới ngón giữa thì '
          + 'hay nghĩ cho mình trong chuyện tình; Bṛhat Saṃhitā 69.13: ngắn hơn chuẩn thì thọ giảm theo — lời cổ, không có cơ sở.',
      } },
      broken: { nhan: 'Đứt quãng', loi: {
        true: 'Có chỗ đứt. Cheiro: có lúc sóng gió lớn trong tình cảm; Toàn Biên: nét vụn trên Thiên văn là điềm xấu cho đường vợ chồng.',
        false: `Liền một mạch. ${LIEN}; Liễu Trang: nét nên thành hình, kỵ đứt.`,
      } },
    },
  },
  fate: {
    ten: 'Đường sự nghiệp (định mệnh)',
    y: 'Đường dọc giữa lòng bàn tay, chạy lên phía ngón giữa; nhiều người không có. Toàn Biên: "nét dọc thẳng lên tới ngón thì trăm '
      + 'mưu đều thành" (Ngọc trụ văn, Xung thiên văn); Bṛhat Saṃhitā 69.12: đường từ cổ tay lên ngón giữa là tướng hưởng phú quý; '
      + 'sách Tây (Cheiro, Benham): đường số phận, công danh.',
    nguon: `${S.toanBien}; ${S.brhat}; ${S.cheiro}; ${S.benham}`,
    o: {
      seen: { nhan: 'Độ rõ', loi: {
        clear: 'Rõ. Cheiro: đường tốt nên rõ ràng mà không quá đậm; Toàn Biên, Bṛhat Saṃhitā đều khen đường dọc thẳng lên.',
        faint: 'Mờ, chỉ thấy lờ mờ. Cheiro: người không tin vào số phận, đường trí rõ thì thành công nhờ trí óc chứ không nhờ vận; '
          + 'Toàn Biên: "nét nông thì mưu tính cũng nông".',
        none: 'Không có — rất thường gặp. Benham: nhiều người thành đạt không có đường này, phần đông là người tự lập từ hai bàn tay '
          + 'trắng, chỉ là phải gắng sức liên tục; ông bác lối đọc cũ cho rằng thiếu đường này là đời "nhạt".',
      } },
      start: { nhan: 'Điểm đầu', loi: {
        wrist: 'Mọc từ sát cổ tay đi thẳng lên. Toàn Biên: nét từ cung Khảm đi thẳng lên không đứt là "từ đất bằng phát phúc, tay '
          + 'trắng dựng nghiệp"; Bṛhat Saṃhitā 69.12: từ cổ tay tới ngón giữa là tướng phú quý; Cheiro: kèm đường thành công rõ thì gặp may, thành đạt lớn.',
        life: 'Tách ra từ đường đời. Cheiro: tuổi trẻ bị gia đình, hoàn cảnh ràng buộc; từ chỗ tách mà đi rõ, mạnh thì thành công nhờ '
          + 'sức mình, không nhờ may. Toàn Biên đọc khác: nét từ cung Cấn (gò ngón cái) thẳng lên là được phúc ấm ông cha.',
        middle: 'Chỉ mọc từ giữa lòng bàn tay trở lên. Cheiro: thuở nhỏ vất vả, phải tự gắng nhiều; đi lên rõ, mạnh thì tự tay dựng '
          + 'nghiệp. Toàn Biên: đường hiện ở quãng nào của bàn tay thì quãng đời ấy phát phúc.',
      } },
      broken: { nhan: 'Đứt quãng', loi: {
        true: 'Có chỗ đứt. Toàn Biên: "một đứt một nối, một thành một bại"; Cheiro: đổi việc, đổi cảnh — đoạn sau mọc trước khi đoạn '
          + 'trước dứt thì là đổi để tiến lên; Benham: đứt nhiều mà được nối lại thì sau nhiều lần thất vọng vẫn tới thành công.',
        false: 'Liền một mạch. Toàn Biên: nét từ cung Khảm thẳng lên không đứt là tay trắng dựng nghiệp; Cheiro: một đường liền, không '
          + 'nhánh là người đi theo một con đường định sẵn.',
      } },
    },
  },
};

/** Chi tay ngang (doan chuong): o rieng ngoai bon duong. */
export const DOAN_CHUONG: Readonly<Record<'true' | 'false', string>> = {
  true: 'Đường trí và đường tình nhập làm một đường ngang suốt bàn tay. Cheiro: ý chí dồn một hướng mạnh hơn mọi kiểu tay khác, '
    + 'nhưng hay thấy cô đơn, hợp làm một mình; đường nằm thấp (chỗ đường trí) thì lý trí lấn tình cảm, nằm cao (chỗ đường tình) '
    + 'thì tình cảm mãnh liệt; Benham coi như thiếu đường tình. Toàn Biên chép "đoạn văn" (bản Wikisource mất hình, nhiều phần là '
    + 'đường này) là điềm xấu cho cha mẹ, ruột thịt: "trái đứt phải không, ruột thịt hao một nửa" — lời đoán dân gian, không có cơ '
    + 'sở. Gặp ở khoảng 1,5–3 % người, nhiều hơn ở người Đông Á, và hay gặp trong vài hội chứng di truyền — không dùng để chẩn đoán bệnh.',
  false: 'Không có: đường trí và đường tình tách riêng như phần đông mọi người.',
};

export interface MucGiai {
  readonly ten: string;
  readonly y: string;
  readonly nguon: string;
  readonly dong: readonly { readonly nhan: string; readonly loi: string }[];
}

const CHUA_DOC = 'AI không đọc được ô này.';

/** Khung (da `palm`) → loi tung duong; duong AI khong thay chi con dong "Do ro". */
export function giaiChiTay(k: KhungChiTay): MucGiai[] {
  const ngang: MucGiai = { ten: 'Chỉ tay ngang (đoạn chưởng)', y: 'Đường trí và đường tình có nhập làm một không.',
    nguon: `${S.toanBien}; ${S.cheiro}; ${S.benham}`,
    dong: [{ nhan: 'Có không', loi: k.simian === null ? CHUA_DOC : k.simian ? DOAN_CHUONG.true : DOAN_CHUONG.false }] };
  return [ngang, ...CAC_DUONG.map((d): MucGiai => {
    const g = GIAI[d] as DongGiai<Duong>, doc = k.duong[d] as Readonly<Record<string, string | boolean | null>>;
    const o = Object.entries(g.o) as [string, { nhan: string; loi: Readonly<Record<string, string>> }][];
    return { ten: g.ten, y: g.y, nguon: g.nguon, dong: (doc['seen'] === 'none' ? o.slice(0, 1) : o)
      .map(([ten, x]) => ({ nhan: x.nhan, loi: doc[ten] === null ? CHUA_DOC : x.loi[String(doc[ten])] ?? CHUA_DOC })) };
  })];
}
