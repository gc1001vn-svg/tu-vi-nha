/**
 * Chi tay (dot 7 phan 3): nguoi xem tu chon tung o cua `KHUNG` (4 duong chinh + chi tay ngang) theo hinh mau — AI doc anh cua Groq
 * do 28/10 khong dinh vi duoc duong (`QUY_UOC` muc 27) nen bo. App tra quy luat Claude soan lai (luat 6 `CLAUDE.md`), moi gia tri
 * ghi nen nao cung noi (`nen`), nen nao noi nguoc (`venh`) de AI dien giai, du doan theo luat dong thuan truoc (`duLieuChiTay`).
 * Dem theo NEN, khong theo so sach: Toan Bien chep lai Thai Thanh Than Giam.
 */

const RO = ['clear', 'faint', 'none'] as const;
const DAI = ['short', 'medium', 'long'] as const;
const CO = [true, false] as const;

/** O nguoi xem chon (ma tieng Anh giu tu ban dau, de doc lai so do 28/10). */
export const KHUNG = {
  life: { seen: RO, length: DAI, arc: ['wide', 'narrow'], broken: CO },
  head: { seen: RO, length: DAI, shape: ['straight', 'curved'], joined: CO, broken: CO },
  heart: { seen: RO, length: DAI, broken: CO },
  fate: { seen: RO, start: ['wrist', 'life', 'middle'], broken: CO },
} as const;

export type Duong = keyof typeof KHUNG;
type O<D extends Duong> = keyof (typeof KHUNG)[D];
type Gia<D extends Duong, K extends O<D>> = (typeof KHUNG)[D][K] extends readonly (infer G)[] ? G : never;

/** null = chua chon. */
export type DocDuong<D extends Duong> = { readonly [K in O<D>]: Gia<D, K> | null };

export interface KhungChiTay {
  /** Duong tri va duong tinh nhap mot (chi tay ngang). */
  readonly simian: boolean | null;
  readonly duong: { readonly [D in Duong]: DocDuong<D> };
}

export const CAC_DUONG = Object.keys(KHUNG) as Duong[];

export const NEN = { tq: 'Trung Hoa', ad: 'Ấn Độ', hl: 'Hy Lạp', tay: 'Tây' } as const;
export type Nen = keyof typeof NEN;

export interface Luat {
  /** Ten gia tri: hien o bang chon va dau dong loi giai. */
  readonly nhan: string;
  /** Quy luat chot: y cac nen trong `nen` cung noi. */
  readonly chot: string;
  /** Nen noi dung y `chot`; rong = khong nen nao doc rieng. */
  readonly nen: readonly Nen[];
  /** Nen KHAC noi nguoc, hay cung noi mot chuyen nhung trai chieu (vênh trong cung mot nen thi ghi o `loi`). */
  readonly venh?: string;
  /** Tung sach noi gi, kem nguon. */
  readonly loi: string;
}

/** Muc tin hien canh luat va gui AI. */
export function mucTin(l: Pick<Luat, 'nen' | 'venh'>): string {
  const ten = l.nen.map((n) => NEN[n]).join(', ');
  if (l.venh !== undefined) return l.nen.length > 0 ? `các nền vênh (${ten} nói như trên)` : 'các nền vênh';
  if (l.nen.length >= 2) return `đồng thuận ${String(l.nen.length)} nền: ${ten}`;
  return l.nen.length === 1 ? `một nền: ${ten}` : 'sách không đọc riêng';
}

const LIEN = 'Thái Thanh, Toàn Biên: "ba đường trong sáng, không bị nét khác cắt là tướng phúc lộc"';
const NHIN_KY = 'Gập nhẹ bàn tay, nhìn dưới đèn sáng cho nét hiện rõ rồi hãy chọn.';
const THUONG: Luat = { nhan: 'Vừa', chot: 'Mức thường gặp.', nen: [], loi: 'Không sách nào đã đọc bàn riêng mức vừa.' };

interface DongGiai<D extends Duong> {
  readonly ten: string;
  /** Duong nam o dau, cac nen doc duong nay la gi. */
  readonly y: string;
  readonly nguon: string;
  readonly o: { readonly [K in O<D>]: { readonly nhan: string; readonly gia: Readonly<Record<`${Gia<D, K> & (string | boolean)}`, Luat>> } };
}

const S = {
  thaiThanh: 'Thái Thanh Thần Giám q.5 (Tống)',
  toanBien: 'Thần Tướng Toàn Biên (Minh, trong Cổ Kim Đồ Thư Tập Thành q.640)',
  lieuTrang: 'Liễu Trang tướng pháp (Minh)',
  brhat: 'Bṛhat Saṃhitā (Ấn Độ, thế kỷ 6)',
  aristotle: 'Aristotle, Historia Animalium I.15 (Hy Lạp)',
  cheiro: 'Cheiro, Palmistry for All (Anh, 1916)',
  benham: 'Benham, The Laws of Scientific Hand Reading (Mỹ, 1900)',
} as const;

/** Quy luat moi gia tri moi o (kieu bat du: thieu mot gia tri la loi bien dich). */
export const GIAI: { readonly [D in Duong]: DongGiai<D> } = {
  life: {
    ten: 'Đường đời (sinh đạo)',
    y: 'Vòng quanh gốc ngón cái. Trung Hoa gọi Địa văn — nét dưới "ứng Đất, tượng bề tôi, tượng mẹ, chủ thọ yểu"; Tây đọc sức '
      + 'sống, thể lực. Ấn Độ đặt tuổi thọ ở đường khác (đường tình). Đường ngắn không phải điềm đoản thọ: không có cơ sở khoa học.',
    nguon: `${S.thaiThanh}; ${S.toanBien}; ${S.lieuTrang}; ${S.brhat}; ${S.cheiro}; ${S.benham}`,
    o: {
      seen: { nhan: 'Độ rõ', gia: {
        clear: { nhan: 'Rõ, sâu', chot: 'Tốt: sức bền, phúc lộc.', nen: ['tq', 'ad', 'tay'],
          loi: 'Thái Thanh, Toàn Biên: "nét nhỏ mà sâu là tốt"; Bṛhat Saṃhitā 67.43: đường bóng, sâu là tướng người giàu; Cheiro: '
            + 'đường mảnh, rõ, sâu bền sức hơn đường to mà nông.' },
        faint: { nhan: 'Mờ, nông', chot: 'Kém tốt.', nen: ['tq', 'ad', 'tay'],
          loi: 'Thái Thanh, Toàn Biên: "nét thô mà nông là hèn"; Liễu Trang: "nét nông thì chí cũng nông"; Bṛhat Saṃhitā 67.43: trái '
            + `với đường bóng, sâu là tướng nghèo; Cheiro: đường to bè mà nông không bền bằng đường mảnh, sâu. ${NHIN_KY}` },
        none: { nhan: 'Không thấy', chot: 'Ai cũng có đường này — không thấy là chưa nhìn kỹ.', nen: ['tq'],
          loi: `Toàn Biên (Tướng tam tài): ba đường lớn "người người đều có". ${NHIN_KY}` },
      } },
      length: { nhan: 'Độ dài', gia: {
        long: { nhan: 'Dài, vòng xuống gần cổ tay', chot: 'Sức bền, sống lâu.', nen: ['tq', 'tay'],
          venh: 'Ấn Độ đặt tuổi thọ ở đường tình, không ở đường này.',
          loi: 'Thái Thanh, Toàn Biên: nét dưới "chủ thọ yểu"; Cheiro: đường đời chuẩn là dài, rõ, không đứt — sống lâu, thể chất vững; '
            + 'Benham: đường dài thì sức bền lâu.' },
        medium: THUONG,
        short: { nhan: 'Ngắn, dừng trên nửa lòng bàn tay', chot: 'Sách cổ đọc là sức bền kém hơn — không phải điềm đoản thọ.',
          nen: ['tq', 'tay'],
          loi: 'Benham coi chỗ đường dừng là quãng nên giữ sức khoẻ và dặn xem cả hai tay — tay phải dài hơn thì đọc theo tay phải; '
            + 'chỉ tay còn đổi theo năm tháng (Benham kể một bàn tay mọc thêm đường trí sau chừng một năm). Thái Thanh, Toàn Biên xếp '
            + 'đường này vào việc thọ yểu.' },
      } },
      arc: { nhan: 'Độ vòng', gia: {
        wide: { nhan: 'Vòng rộng ra giữa lòng bàn tay', chot: 'Ấm áp, nhiều sinh lực.', nen: ['tay'],
          loi: 'Benham: gò ngón cái (gò Kim Tinh) rộng — ấm áp, nhiều sinh lực; Cheiro: gò này càng rộng càng nồng nhiệt.' },
        narrow: { nhan: 'Ôm sát gốc ngón cái', chot: 'Kín đáo, bớt nồng nhiệt, sinh lực kém hơn.', nen: ['tay'],
          loi: 'Benham: gò ngón cái hẹp lại — lạnh, ít ham muốn, sức sống kém hơn; Cheiro: gò hẹp, mỏng thì bớt nồng nhiệt.' },
      } },
      broken: { nhan: 'Đứt quãng', gia: {
        true: { nhan: 'Có chỗ đứt', chot: 'Có quãng trắc trở, đứt đoạn.', nen: ['tq', 'ad', 'tay'],
          loi: 'Thái Thanh, Toàn Biên: "nét dù tốt mà đứt lâu là tướng dở dang"; Bṛhat Saṃhitā 67.50: đường đứt là điềm rủi; Cheiro: '
            + 'đứt khúc, nối như mắt xích là lúc sức khoẻ yếu — lời sách cổ, không phải chẩn đoán.' },
        false: { nhan: 'Liền', chot: 'Tốt: tướng phúc lộc.', nen: ['tq', 'tay'],
          loi: `${LIEN}; Cheiro: đường đời chuẩn là dài, rõ, không đứt.` },
      } },
    },
  },
  head: {
    ten: 'Đường trí (trí đạo)',
    y: 'Đường ngang giữa lòng bàn tay, đầu phía ngón cái. Hai nền cùng gắn đường này với trí khôn: Trung Hoa gọi Nhân văn — nét '
      + 'giữa "ứng Người, tượng hiền ngu, phân giàu nghèo"; Tây: trí óc, cách nghĩ — Cheiro coi là đường quan trọng nhất.',
    nguon: `${S.thaiThanh}; ${S.toanBien}; ${S.lieuTrang}; ${S.brhat}; ${S.cheiro}; ${S.benham}`,
    o: {
      seen: { nhan: 'Độ rõ', gia: {
        clear: { nhan: 'Rõ, sâu', chot: 'Trí lực mạnh, chí sâu.', nen: ['tq', 'tay'],
          loi: 'Cheiro: đường trí sắc gọn, sâu là trí lực mạnh hơn đường to bè chỉ nằm trên mặt da; Liễu Trang: "nét sâu thì chí cũng '
            + 'sâu"; Thái Thanh, Toàn Biên: "nét nhỏ mà sâu là tốt".' },
        faint: { nhan: 'Mờ, nông', chot: 'Trí lực, chí hướng kém hơn.', nen: ['tq', 'tay'],
          loi: `Liễu Trang: "nét nông thì chí cũng nông"; Cheiro: tay trái mờ mà tay phải rõ là người tự rèn trí óc, không nhờ cha mẹ truyền. ${NHIN_KY}` },
        none: { nhan: 'Không thấy', chot: 'Rất hiếm — xem lại, hoặc đường trí đã nhập với đường tình.', nen: ['tay'],
          loi: 'Benham chỉ một lần gặp bàn tay không có đường trí, và chừng một năm sau đường ấy đã mọc.' },
      } },
      length: { nhan: 'Độ dài', gia: {
        long: { nhan: 'Dài, tới gần mép bàn tay phía ngón út', chot: 'Trí lực dồi dào, ý chí mạnh.', nen: ['tay'],
          loi: 'Benham: trí lực dồi dào; Cheiro: đường trí chạy thẳng thật xa là người ý chí rất mạnh, dám dốc hết cho điều mình cho '
            + 'là phải. Gần ý: Toàn Biên "nét lớn thấy lớn".' },
        medium: { ...THUONG, nhan: 'Vừa, dừng dưới ngón áp út' },
        short: { nhan: 'Ngắn, dừng dưới ngón giữa', chot: 'Trí lực không mạnh bằng — phải xem các đường khác mới kết luận.',
          nen: ['tay'], loi: 'Benham: trí lực không mạnh bằng đường dài, và dặn phải xem thêm các đường khác; gần ý: Toàn Biên "nét nhỏ thấy nhỏ".' },
      } },
      shape: { nhan: 'Dáng', gia: {
        straight: { nhan: 'Ngang thẳng', chot: 'Thực tế, ngay thẳng.', nen: ['tq', 'tay'],
          loi: 'Cheiro: thực tế, "đầu óc cân bằng", hợp kinh doanh, khoa học; Toàn Biên: "nét ngay thì lòng cũng ngay".' },
        curved: { nhan: 'Cong, dốc xuống phía cổ tay', chot: 'Giàu tưởng tượng, dễ theo cảm hứng.', nen: ['tay'],
          venh: 'Trung Hoa chê nét cong queo: "hay ngờ, hay lo" (Toàn Biên) — nói nét cong queo nói chung, không riêng đường trí dốc.',
          loi: 'Cheiro: giàu tưởng tượng, hợp nghệ thuật, dốc quá thì dễ làm theo cảm hứng.' },
      } },
      joined: { nhan: 'Điểm đầu', gia: {
        true: { nhan: 'Dính đường đời', chot: 'Thận trọng, nhạy cảm, kém tự tin.', nen: ['tay'],
          loi: 'Cheiro, Benham: nhạy cảm, thận trọng, kém tự tin, hay hỏi ý người khác; Cheiro: kiểu này gặp nhiều hơn kiểu tách rời.' },
        false: { nhan: 'Tách khỏi đường đời', chot: 'Tự tin, tự lập, nghĩ nhanh — dễ hấp tấp.', nen: ['tay'],
          loi: 'Cheiro, Benham: tự tin, nghĩ nhanh, tự lo liệu; Benham dặn dễ hấp tấp vì ít hỏi ý ai.' },
      } },
      broken: { nhan: 'Đứt quãng', gia: {
        true: { nhan: 'Có chỗ đứt', chot: 'Lúc siêng lúc lười, việc dở dang.', nen: ['tq', 'ad'],
          loi: 'Toàn Biên: "nét đứt nối thì dễ siêng dễ lười", "nét dù tốt mà đứt lâu là tướng dở dang"; Bṛhat Saṃhitā 67.50: đường đứt là điềm rủi.' },
        false: { nhan: 'Liền', chot: 'Tốt: tướng phúc lộc.', nen: ['tq'],
          loi: `${LIEN}; Liễu Trang: nét nên nhỏ, sâu, thành hình, kỵ nông, rối, đứt, cong vẹo.` },
      } },
    },
  },
  heart: {
    ten: 'Đường tình (tâm đạo)',
    y: 'Đường ngang trên cùng, ngay dưới gốc các ngón, đầu phía ngón út. Các nền đọc khác hẳn nhau: Tây — tình cảm; Trung Hoa — '
      + 'Thiên văn "ứng Trời, tượng vua, tượng cha, định sang hèn"; Ấn Độ (Bṛhat Saṃhitā 69.13), Hy Lạp (Aristotle) — tuổi thọ.',
    nguon: `${S.thaiThanh}; ${S.toanBien}; ${S.lieuTrang}; ${S.brhat}; ${S.aristotle}; ${S.cheiro}; ${S.benham}`,
    o: {
      seen: { nhan: 'Độ rõ', gia: {
        clear: { nhan: 'Rõ, sâu', chot: 'Tốt.', nen: ['tq', 'ad', 'tay'],
          loi: 'Cheiro: đường tình nên "sâu, rõ, hồng hào"; Bṛhat Saṃhitā 67.43: đường bóng, sâu là tướng người giàu; Thái Thanh, Toàn '
            + 'Biên: "nét nhỏ mà sâu là tốt".' },
        faint: { nhan: 'Mờ, nhạt', chot: 'Kém tốt; Tây: tình cảm hờ hững.', nen: ['tq', 'ad', 'tay'],
          loi: 'Cheiro: đường nhạt, bè, không sâu là người hờ hững, tình không sâu; Toàn Biên: "nét thô mà nông là hèn"; Bṛhat Saṃhitā '
            + `67.43: đường không bóng, không sâu là tướng nghèo. ${NHIN_KY}` },
        none: { nhan: 'Không thấy', chot: 'Hiếm — thường là đường tình đã nhập với đường trí (xem dòng chỉ tay ngang).', nen: ['tay'],
          loi: 'Benham: một đường ngang duy nhất nằm ở chỗ đường trí thì coi là đường trí, đường tình như vắng; ông đọc thiếu đường tình '
            + 'là người lạnh lùng — nhìn kỹ lại trước khi chọn.' },
      } },
      length: { nhan: 'Độ dài', gia: {
        long: { nhan: 'Dài tới dưới ngón trỏ', chot: 'Tốt: Tây — giàu lý tưởng trong tình cảm; Hy Lạp — sống lâu.',
          nen: ['tay', 'hl'], venh: 'Ấn Độ lấy khe ngón trỏ – ngón giữa làm mức thọ nhất, không phải dưới ngón trỏ.',
          loi: 'Benham: đường tình chuẩn khởi từ dưới ngón trỏ; Cheiro: giàu lý tưởng, một trong những dạng tốt nhất — dài quá, lệch ra tận '
            + 'mép bàn tay thì yêu mù quáng, dễ ghen; Aristotle: người thọ có một hai đường chạy suốt lòng bàn tay.' },
        medium: { nhan: 'Tới khe ngón trỏ – ngón giữa', chot: 'Cân bằng: Tây — điềm tĩnh mà sâu sắc; Ấn Độ — đường thọ dài nhất.',
          nen: ['tay', 'ad'],
          loi: 'Cheiro: điềm tĩnh mà sâu sắc, dung hoà giữa lý tưởng và cái tôi; Bṛhat Saṃhitā 69.13: đường từ gốc ngón út tới đúng '
            + 'khe này là đường thọ dài nhất.' },
        short: { nhan: 'Ngắn, dừng dưới ngón giữa',
          chot: 'Kém hơn: Tây — tình cảm ít lộ, hay nghĩ cho mình; Ấn Độ, Hy Lạp — thọ kém (lời cổ, không có cơ sở).',
          nen: ['tay', 'ad', 'hl'],
          loi: 'Cheiro: đường tình càng ngắn, tình cảm cao thượng càng ít lộ ra; khởi từ dưới ngón giữa thì hay nghĩ cho mình; Bṛhat '
            + 'Saṃhitā 69.13: ngắn hơn chuẩn thì thọ giảm theo; Aristotle: người yểu có hai đường không chạy suốt lòng bàn tay.' },
      } },
      broken: { nhan: 'Đứt quãng', gia: {
        true: { nhan: 'Có chỗ đứt', chot: 'Trắc trở trong tình cảm, vợ chồng.', nen: ['tay', 'tq'],
          loi: 'Cheiro: có lúc sóng gió lớn trong tình cảm; Toàn Biên: nét vụn trên Thiên văn là điềm xấu cho đường vợ chồng.' },
        false: { nhan: 'Liền', chot: 'Tốt: tướng phúc lộc.', nen: ['tq'], loi: `${LIEN}; Liễu Trang: nét nên thành hình, kỵ đứt.` },
      } },
    },
  },
  fate: {
    ten: 'Đường sự nghiệp (định mệnh)',
    y: 'Đường dọc giữa lòng bàn tay, chạy lên phía ngón giữa; nhiều người không có. Ba nền cùng coi đường dọc thẳng lên là thành '
      + 'đạt: Trung Hoa — "nét dọc thẳng lên tới ngón thì trăm mưu đều thành" (Ngọc trụ văn, Xung thiên văn); Ấn Độ (Bṛhat Saṃhitā '
      + '69.12) — từ cổ tay lên ngón giữa là tướng phú quý; Tây — đường số phận, công danh.',
    nguon: `${S.thaiThanh}; ${S.toanBien}; ${S.lieuTrang}; ${S.brhat}; ${S.cheiro}; ${S.benham}`,
    o: {
      seen: { nhan: 'Độ rõ', gia: {
        clear: { nhan: 'Rõ', chot: 'Công danh thuận, mưu việc dễ thành.', nen: ['tq', 'ad', 'tay'],
          loi: 'Thái Thanh, Toàn Biên: "nét dọc thẳng lên tới ngón thì trăm mưu đều thành"; Bṛhat Saṃhitā 69.12: từ cổ tay lên ngón '
            + 'giữa là tướng phú quý; Cheiro: đường tốt nên rõ ràng mà không quá đậm.' },
        faint: { nhan: 'Mờ', chot: 'Ít nhờ vận, thành công nhờ sức mình, trí óc.', nen: ['tay'],
          venh: 'Trung Hoa chê nét nông: "nét nông thì mưu tính cũng nông" (Toàn Biên).',
          loi: 'Cheiro: người không tin vào số phận, đường trí rõ thì thành công nhờ trí óc chứ không nhờ vận.' },
        none: { nhan: 'Không có', chot: 'Rất thường gặp: tự lập, phải gắng sức liên tục.', nen: ['tay'],
          loi: 'Benham: nhiều người thành đạt không có đường này, phần đông là người tự lập từ hai bàn tay trắng, chỉ là phải gắng sức liên '
            + 'tục; ông bác lối đọc Tây cũ hơn cho là đời "nhạt".' },
      } },
      start: { nhan: 'Điểm đầu', gia: {
        wrist: { nhan: 'Từ sát cổ tay', chot: 'Thành đạt, tay trắng dựng nghiệp.', nen: ['tq', 'ad', 'tay'],
          loi: 'Toàn Biên: nét từ cung Khảm (sát cổ tay) đi thẳng lên không đứt là "từ đất bằng phát phúc, tay trắng dựng nghiệp"; '
            + 'Liễu Trang: nét từ cung Càn lên cung Ly là Xung thiên văn, "tay trắng làm nên"; Bṛhat Saṃhitā 69.12: từ cổ tay tới ngón '
            + 'giữa là tướng phú quý; Cheiro: kèm đường thành công rõ thì gặp may, thành đạt lớn.' },
        life: { nhan: 'Tách ra từ đường đời', chot: 'Gắn với gia đình, ông cha.', nen: [],
          venh: 'Cùng nói chuyện gia đình nhưng ngược chiều: Tây — tuổi trẻ bị cha mẹ, họ hàng ràng buộc rồi tự thành; Trung Hoa — được '
            + 'phúc ấm ông cha.',
          loi: 'Cheiro: tuổi trẻ chật vật, bị cha mẹ, họ hàng ràng buộc; từ chỗ tách mà đi rõ, mạnh thì thành công nhờ sức mình, không '
            + 'nhờ may. Toàn Biên: nét từ cung Cấn (gò ngón cái) thẳng lên là được phúc ấm ông cha.' },
        middle: { nhan: 'Từ giữa lòng bàn tay', chot: 'Phát muộn: thuở nhỏ vất vả, thành đạt từ quãng giữa đời.', nen: ['tay', 'tq'],
          loi: 'Cheiro: thuở nhỏ vất vả, phải tự gắng nhiều; đi lên rõ, mạnh thì tự tay dựng nghiệp. Toàn Biên: đường hiện ở quãng nào '
            + 'của bàn tay thì quãng đời ấy phát phúc.' },
      } },
      broken: { nhan: 'Đứt quãng', gia: {
        true: { nhan: 'Có chỗ đứt', chot: 'Thăng trầm, đổi hướng: một thành một bại.', nen: ['tq', 'tay'],
          loi: 'Toàn Biên: "một đứt một nối, một thành một bại"; Cheiro: đổi việc, đổi cảnh — đoạn sau mọc trước khi đoạn trước dứt thì '
            + 'là đổi để tiến lên; Benham: đứt nhiều mà được nối lại thì sau nhiều lần thất vọng vẫn tới thành công.' },
        false: { nhan: 'Liền', chot: 'Đi một con đường bền.', nen: ['tq', 'tay'],
          loi: 'Toàn Biên: nét từ cung Khảm thẳng lên không đứt là tay trắng dựng nghiệp; Cheiro: một đường liền, không nhánh là người đi '
            + 'theo một con đường định sẵn.' },
      } },
    },
  },
};

/** Chi tay ngang (doan chuong): o rieng ngoai bon duong. */
export const DOAN_CHUONG: Readonly<Record<'true' | 'false', Luat>> = {
  true: { nhan: 'Có — trí và tình nhập một đường', chot: 'Hiếm; tính dồn một hướng rất mạnh.', nen: ['tay'],
    venh: 'Trung Hoa đọc rất xấu: Toàn Biên chép "đoạn văn" (bản Wikisource mất hình, nhiều phần là đường này) hại cha mẹ, ruột thịt — '
      + '"trái đứt phải không, ruột thịt hao một nửa"; lời đoán dân gian, không có cơ sở.',
    loi: 'Cheiro: ý chí dồn một hướng mạnh hơn mọi kiểu tay khác, nhưng hay thấy cô đơn, hợp làm một mình; đường nằm thấp (chỗ đường '
      + 'trí) thì lý trí lấn tình cảm, nằm cao (chỗ đường tình) thì tình cảm mãnh liệt; Benham coi như thiếu đường tình. Gặp ở khoảng '
      + '1,5–3 % người, nhiều hơn ở người Đông Á, và hay gặp trong vài hội chứng di truyền — không dùng để chẩn đoán bệnh.' },
  false: { nhan: 'Không — hai đường tách riêng', chot: 'Như phần đông mọi người.', nen: [], loi: 'Đường trí và đường tình tách riêng.' },
};

/** Quy luat chung, xep tu dong thuan nhieu nen nhat; dong cuoi la phan khoa hoc. */
export const QUY_LUAT_CHUNG: readonly Omit<Luat, 'nhan'>[] = [
  { chot: 'Nét nhỏ, sâu, rõ, liền là tốt; nét nông, thô, rối, đứt là kém.', nen: ['tq', 'ad', 'tay'],
    loi: 'Thái Thanh, Toàn Biên: "nét nhỏ mà sâu là tốt, nét thô mà nông là hèn", "ba đường trong sáng, không bị cắt là phúc lộc"; '
      + 'Liễu Trang: "nét nên nhỏ, sâu, thành hình"; Bṛhat Saṃhitā 67.43, 67.50; Cheiro.' },
  { chot: 'Đường dọc thẳng lên ngón giữa là tướng thành đạt.', nen: ['tq', 'ad', 'tay'],
    loi: 'Thái Thanh, Toàn Biên: "nét dọc thẳng lên tới ngón thì trăm mưu đều thành"; Bṛhat Saṃhitā 69.12; Cheiro.' },
  { chot: 'Quá nhiều đường rối, hay gần như không có đường, đều kém.', nen: ['tq', 'ad'],
    loi: 'Toàn Biên: "không có đường là tướng thấp"; Liễu Trang: "nét rối thì lòng rối"; Bṛhat Saṃhitā 67.50: nhiều đường quá hay '
      + 'không có đường là tướng nghèo.' },
  { chot: 'Đường trên cùng (đường tình) mỗi nền một nghĩa.', nen: [], venh: 'Tây: tình cảm; Trung Hoa: sang hèn, cha; Ấn Độ, Hy Lạp: tuổi thọ.',
    loi: 'Thái Thanh, Toàn Biên; Bṛhat Saṃhitā 69.13; Aristotle; Cheiro, Benham.' },
  { chot: 'Xem tay nào: Việt Nam, Trung Hoa dân gian "nam tả nữ hữu"; Tây xem cả hai — tay trái bẩm sinh, tay phải phần tự rèn. Chỉ '
      + 'tay đổi theo năm tháng.', nen: [], loi: 'Bài Việt Nam (tóm tắt tìm kiếm); Cheiro; Benham.' },
  { chot: 'Khoa học: chỉ tay hình thành trong bào thai, khoảng tuần 10–13; chưa có nghiên cứu nào cho thấy đường chỉ tay báo trước '
      + 'tính cách hay vận mệnh; chỉ tay ngang hay gặp trong vài hội chứng di truyền.', nen: [], loi: 'Nghiên cứu phôi học 1986 '
      + '(160 thai 6–20 tuần) và bài tổng quan về phát triển bàn tay — đọc qua tóm tắt tìm kiếm; mốc tuần các nghiên cứu còn vênh.' },
];

/** Ten duong, go tay ma khung khong hoi: AI neu ra thi la ngoai du lieu → gach chan (`kiemBia.ts`). */
export const TU_CHI_TAY: readonly string[] = ['đường hôn nhân', 'đường Mặt Trời', 'đường thành công', 'đường sức khoẻ', 'đường sức khỏe',
  'đường con cái', 'vòng Kim Tinh', 'gò Kim Tinh', 'gò Mộc Tinh', 'gò Thổ Tinh', 'gò Thái Dương', 'gò Thủy Tinh', 'gò Thuỷ Tinh',
  'gò Hỏa Tinh', 'gò Hoả Tinh', 'gò Thái Âm', 'gò Mặt Trăng'].flatMap((t) => [t, `${t[0]?.toUpperCase() ?? ''}${t.slice(1)}`]);

export interface DongLuat {
  /** Ten o (vd "Độ dài"). */
  readonly o: string;
  /** null = nguoi xem chua chon. */
  readonly luat: Luat | null;
}

export interface MucGiai {
  readonly ten: string;
  readonly y: string;
  readonly nguon: string;
  readonly dong: readonly DongLuat[];
}

/** Khung → luat tung o; duong chon "khong thay / khong co" chi con dong do ro. */
export function giaiChiTay(k: KhungChiTay): MucGiai[] {
  const ngang: MucGiai = { ten: 'Chỉ tay ngang (đoạn chưởng)', y: 'Đường trí và đường tình có nhập làm một đường ngang suốt bàn tay không.',
    nguon: `${S.toanBien}; ${S.cheiro}; ${S.benham}`, dong: [{ o: 'Có không', luat: k.simian === null ? null : DOAN_CHUONG[k.simian ? 'true' : 'false'] }] };
  return [ngang, ...CAC_DUONG.map((d): MucGiai => {
    const g = GIAI[d] as DongGiai<Duong>, doc = k.duong[d] as Readonly<Record<string, string | boolean | null>>;
    const o = Object.entries(g.o) as [string, { nhan: string; gia: Readonly<Record<string, Luat>> }][];
    return { ten: g.ten, y: g.y, nguon: g.nguon, dong: (doc['seen'] === 'none' ? o.slice(0, 1) : o)
      .map(([ten, x]) => { const v = doc[ten]; return { o: x.nhan, luat: v === null || v === undefined ? null : x.gia[String(v)] ?? null }; }) };
  })];
}
