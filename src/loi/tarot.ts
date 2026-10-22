/**
 * Tarot bo 1909 (tranh Pamela Colman Smith, A. E. Waite soan; het ban quyen) — dot 6 phan 3. 78 la: 0..21 an chinh theo thu
 * tu 1909 (Suc Manh VIII, Cong Ly XI), 22..77 an phu theo bo Gay, Coc, Kiem, Tien (moi bo At..10, Tieu Dong, Hiep Si, Hoang Hau,
 * Vua). Anh `public/tarot/<so>.webp` (`scripts/tai_tarot.py`). Ten Viet vênh giua cac trang nen ten Anh la ten chinh, ten Viet
 * pho bien kem ten khac (`docs/QUY_UOC.md` muc 24). Nghia xuoi/nguoc: Claude soan lai theo Waite (1911) va cach doc pho bien.
 * So ngau nhien lay o vo ngoai (`crypto`) — loi cam ngau nhien.
 */
export interface La {
  readonly ten: string;
  /** Ten Viet khac hay gap (vd The Magician: "Pháp Sư"). */
  readonly khac: string | null;
  readonly anh: string;
  readonly xuoi: string;
  readonly nguoc: string;
}

const AN_CHINH: readonly (readonly [anh: string, ten: string, khac: string | null, xuoi: string, nguoc: string])[] = [
  ['The Fool', 'Chàng Khờ', 'Kẻ Ngốc', 'Khởi đầu mới, tự do, dám bước vào điều chưa biết với lòng tin trong sáng.', 'Liều lĩnh, thiếu suy tính; hoặc ngập ngừng không dám bắt đầu.'],
  ['The Magician', 'Nhà Ảo Thuật', 'Pháp Sư', 'Có đủ khả năng và công cụ; ý chí, khéo léo, biến ý tưởng thành việc làm.', 'Tài năng bị bỏ phí, mưu mẹo, lời nói không đi đôi với việc làm.'],
  ['The High Priestess', 'Nữ Tư Tế', null, 'Trực giác, điều thầm kín, hiểu biết bên trong; lúc nên lắng nghe hơn là hành động.', 'Bỏ qua trực giác, bí mật lộ ra, sống hời hợt bề ngoài.'],
  ['The Empress', 'Hoàng Hậu', null, 'Sung túc, sinh sôi, chăm sóc; tình cảm ấm áp, đời sống đầy đủ.', 'Phụ thuộc, chăm lo quá mức hoặc bỏ bê bản thân; sáng tạo bị tắc.'],
  ['The Emperor', 'Hoàng Đế', null, 'Trật tự, quyền hành, kỷ luật; người cha, người lãnh đạo vững vàng.', 'Độc đoán, cứng nhắc; hoặc thiếu chủ kiến, mất kiểm soát.'],
  ['The Hierophant', 'Giáo Hoàng', 'Thượng Giáo', 'Truyền thống, lễ nghi, người thầy; theo khuôn phép đã được thừa nhận.', 'Phá lệ, nghi ngờ khuôn phép cũ; lời khuyên không hợp với mình.'],
  ['The Lovers', 'Tình Nhân', 'Những Người Yêu Nhau', 'Tình yêu, sự hòa hợp và một lựa chọn quan trọng theo giá trị của mình.', 'Bất hòa, chọn sai, giằng co giữa hai đường.'],
  ['The Chariot', 'Cỗ Xe', 'Chiến Xa', 'Chiến thắng nhờ ý chí và tự chủ; tiến lên, đi xa.', 'Mất phương hướng, nóng vội, sức lực phân tán.'],
  ['Strength', 'Sức Mạnh', null, 'Sức mạnh mềm mỏng: kiên nhẫn, can đảm, chế ngự được bản năng.', 'Tự ti, mất bình tĩnh, để cảm xúc lấn át.'],
  ['The Hermit', 'Ẩn Sĩ', null, 'Lui về suy ngẫm, tìm câu trả lời bên trong; người dẫn đường hiểu biết.', 'Cô lập quá mức, khép mình; hoặc trốn tránh việc nhìn lại.'],
  ['Wheel of Fortune', 'Vòng Quay May Mắn', 'Bánh Xe Số Phận', 'Vận đổi chiều, cơ hội bất ngờ; vòng đời lên xuống tự nhiên.', 'Vận chưa thuận, trì hoãn; chống lại thay đổi không thể tránh.'],
  ['Justice', 'Công Lý', null, 'Công bằng, sự thật, nhân quả; quyết định rõ ràng, giấy tờ, luật lệ.', 'Bất công, thiên vị, trốn tránh trách nhiệm.'],
  ['The Hanged Man', 'Người Treo Ngược', null, 'Tạm dừng, buông bỏ, nhìn sự việc từ góc khác; chịu thiệt nhỏ để được điều lớn hơn.', 'Trì trệ vô ích, hy sinh không đáng, cố chấp không chịu đổi.'],
  ['Death', 'Cái Chết', 'Thần Chết', 'Một giai đoạn kết thúc để sang giai đoạn mới; thay đổi sâu, không phải cái chết thật.', 'Sợ thay đổi, níu kéo điều đã hết, chuyển biến chậm.'],
  ['Temperance', 'Tiết Chế', 'Tiết Độ', 'Điều độ, dung hòa, kiên nhẫn; chữa lành và cân bằng.', 'Thái quá, mất cân bằng, nóng vội.'],
  ['The Devil', 'Ác Quỷ', null, 'Ràng buộc, cám dỗ, lệ thuộc vật chất hay thói quen xấu.', 'Thoát khỏi ràng buộc, nhận ra điều đang trói buộc mình.'],
  ['The Tower', 'Tòa Tháp', null, 'Biến cố bất ngờ làm sụp đổ điều không vững; sự thật phơi bày.', 'Tránh được tai họa lớn; hoặc kéo dài nỗi sợ thay đổi.'],
  ['The Star', 'Ngôi Sao', null, 'Hy vọng, chữa lành, cảm hứng; niềm tin trở lại sau khó khăn.', 'Mất niềm tin, chán nản, kỳ vọng không thực.'],
  ['The Moon', 'Mặt Trăng', null, 'Mơ hồ, lo âu, trực giác và giấc mơ; mọi thứ chưa rõ ràng.', 'Sương mù tan dần, sự thật lộ ra, bớt sợ hãi.'],
  ['The Sun', 'Mặt Trời', null, 'Niềm vui, thành công, sức sống; mọi việc sáng sủa.', 'Niềm vui bị che bớt, thành công chậm, lạc quan quá mức.'],
  ['Judgement', 'Phán Xét', null, 'Thức tỉnh, nhìn lại để làm lại; tiếng gọi thay đổi.', 'Tự trách, chần chừ, không nghe tiếng gọi của mình.'],
  ['The World', 'Thế Giới', null, 'Hoàn thành, trọn vẹn, đạt đích; một chu kỳ khép lại tốt đẹp.', 'Chưa trọn, thiếu bước cuối, trì hoãn kết thúc.'],
];

const BO = [['Wands', 'Gậy'], ['Cups', 'Cốc'], ['Swords', 'Kiếm'], ['Pentacles', 'Tiền']] as const;
const HANG = [
  ['Ace', 'Át'], ['Two', '2'], ['Three', '3'], ['Four', '4'], ['Five', '5'], ['Six', '6'], ['Seven', '7'], ['Eight', '8'],
  ['Nine', '9'], ['Ten', '10'], ['Page', 'Tiểu Đồng'], ['Knight', 'Hiệp Sĩ'], ['Queen', 'Hoàng Hậu'], ['King', 'Vua'],
] as const;

/** Nghia xuoi, nguoc cua an phu: moi bo 14 la theo thu tu `HANG`. */
const AN_PHU: readonly (readonly (readonly [xuoi: string, nguoc: string])[])[] = [
  [ // Gay — lua: hanh dong, nhiet huyet, su nghiep
    ['Khởi đầu đầy nhiệt huyết, cảm hứng, cơ hội hành động.', 'Chậm khởi động, thiếu hứng thú, kế hoạch bị hoãn.'],
    ['Lên kế hoạch, nhìn xa, chuẩn bị mở rộng.', 'Do dự, sợ điều chưa biết, kế hoạch lỏng lẻo.'],
    ['Việc đã khởi, đang chờ kết quả; mở rộng ra xa, buôn bán.', 'Chậm trễ, kết quả chưa như mong.'],
    ['Ăn mừng, ổn định, mái nhà vui vẻ; đạt được một cột mốc.', 'Niềm vui chưa trọn, trong nhà chưa yên (vẫn ít nhiều tốt).'],
    ['Cạnh tranh, va chạm, tranh luận nhỏ.', 'Tránh được xung đột; hoặc mâu thuẫn ngầm.'],
    ['Thắng lợi, được ghi nhận, tin vui.', 'Thành công chậm, kiêu ngạo, thiếu người công nhận.'],
    ['Giữ vững lập trường trước sức ép; đang có lợi thế.', 'Mệt mỏi, buông xuôi, bị lấn át.'],
    ['Tiến triển nhanh, tin tức, đi lại.', 'Trì hoãn, vội vàng hỏng việc, lỡ tin.'],
    ['Kiên trì, phòng bị, gắng thêm chút nữa.', 'Kiệt sức, đa nghi, bỏ cuộc gần đích.'],
    ['Gánh nặng, ôm quá nhiều trách nhiệm.', 'Trút bớt gánh, ủy thác; hoặc gục vì quá tải.'],
    ['Tin tức hào hứng, ý tưởng mới, tinh thần khám phá.', 'Thiếu định hướng, nhiệt tình chóng tắt.'],
    ['Hăng hái, phiêu lưu, hành động nhanh.', 'Hấp tấp, bốc đồng, dễ bỏ dở.'],
    ['Tự tin, ấm áp, quyết đoán, có sức thu hút.', 'Đố kỵ, nóng tính, thiếu tự tin.'],
    ['Lãnh đạo có tầm nhìn, dám làm, truyền cảm hứng.', 'Độc đoán, nóng nảy, đòi hỏi quá cao.'],
  ],
  [ // Coc — nuoc: tinh cam, quan he
    ['Tình cảm mới, lòng tràn đầy, niềm vui chân thành.', 'Cảm xúc bị dồn nén, tình cảm cạn dần.'],
    ['Gắn kết đôi lứa, đồng lòng, hợp tác.', 'Bất hòa, mất cân bằng trong quan hệ.'],
    ['Vui vầy bạn bè, ăn mừng, đoàn tụ.', 'Vui quá đà, chuyện người thứ ba, xa cách bạn bè.'],
    ['Chán chường, thờ ơ, bỏ qua cơ hội trước mặt.', 'Thức tỉnh, đón nhận cơ hội mới.'],
    ['Mất mát, tiếc nuối; vẫn còn điều quý chưa mất.', 'Chấp nhận, vượt qua nỗi buồn.'],
    ['Kỷ niệm, tuổi thơ, người cũ, lòng tốt giản dị.', 'Sống mãi trong quá khứ, cần bước tiếp.'],
    ['Nhiều lựa chọn, mơ mộng, ảo tưởng.', 'Tỉnh táo lại, chọn được hướng rõ ràng.'],
    ['Rời bỏ điều không còn ý nghĩa để tìm điều sâu hơn.', 'Sợ ra đi, níu kéo, lưỡng lự.'],
    ['Toại nguyện, hài lòng, điều ước thành.', 'Tự mãn, hưởng thụ quá mức; ước chưa thành.'],
    ['Hạnh phúc gia đình, hòa thuận, viên mãn.', 'Bất hòa trong nhà, kỳ vọng chưa thành.'],
    ['Tin vui về tình cảm, sáng tạo, nhạy cảm.', 'Cảm xúc non nớt, mộng mơ không thực.'],
    ['Lời mời, lãng mạn, theo đuổi lý tưởng.', 'Hứa suông, cảm xúc thất thường.'],
    ['Dịu dàng, thấu cảm, trực giác tốt.', 'Nhạy cảm quá mức, sống lệ thuộc cảm xúc.'],
    ['Điềm tĩnh, bao dung, làm chủ cảm xúc.', 'Che giấu cảm xúc, thao túng người khác.'],
  ],
  [ // Kiem — khi: ly tri, loi noi, xung dot
    ['Suy nghĩ sáng suốt, sự thật, quyết định dứt khoát.', 'Rối trí, hiểu lầm, lời sắc gây tổn thương.'],
    ['Bế tắc, khó chọn, né tránh sự thật.', 'Gỡ được thế kẹt; hoặc rối hơn vì quá nhiều thông tin.'],
    ['Đau lòng, chia ly, lời nói làm tổn thương.', 'Hồi phục, nguôi ngoai, tha thứ.'],
    ['Nghỉ ngơi, hồi sức, tạm lánh để suy ngẫm.', 'Bồn chồn, nghỉ chưa đủ, quay lại quá sớm.'],
    ['Thắng mà mất lòng, tranh cãi, ích kỷ.', 'Hòa giải, chấp nhận buông phần thua thiệt.'],
    ['Chuyển đi, qua giai đoạn khó, sang chỗ yên hơn.', 'Chưa dứt được chuyện cũ, chuyến đi trắc trở.'],
    ['Mưu mẹo, lén lút, đi đường tắt.', 'Sự thật lộ ra, tự thú, đổi cách làm.'],
    ['Tự trói buộc mình, thấy bế tắc vì nỗi sợ.', 'Thoát khỏi suy nghĩ giam hãm, tự giải phóng.'],
    ['Lo âu, mất ngủ, ám ảnh.', 'Nỗi lo vơi dần; hoặc nặng thêm nếu không giải tỏa.'],
    ['Kết thúc đau đớn, chạm đáy; từ đây chỉ có đi lên.', 'Hồi phục chậm, né tránh việc khép lại.'],
    ['Tò mò, sắc sảo, cảnh giác, tin tức mới.', 'Nói nhiều làm ít, soi mói.'],
    ['Quyết liệt, lao thẳng tới mục tiêu.', 'Hấp tấp, lời nói gây hại.'],
    ['Sáng suốt, độc lập, thẳng thắn.', 'Lạnh lùng, cay nghiệt.'],
    ['Phán đoán công tâm, uy quyền nhờ trí tuệ.', 'Lạm quyền, cứng nhắc, tàn nhẫn.'],
  ],
  [ // Tien — dat: tien bac, cong viec, suc khoe
    ['Cơ hội tài chính mới, khởi đầu vững chắc.', 'Lỡ cơ hội, chi tiêu không tính toán.'],
    ['Cân đối nhiều việc, xoay xở linh hoạt.', 'Quá tải, tiền bạc mất cân đối.'],
    ['Làm việc nhóm, tay nghề được ghi nhận.', 'Thiếu phối hợp, làm qua loa.'],
    ['Giữ của, an toàn, tiết kiệm.', 'Keo kiệt, sợ mất, bám chặt vật chất.'],
    ['Khó khăn vật chất, cảm giác bị bỏ rơi.', 'Khó khăn qua dần, được người giúp đỡ.'],
    ['Cho và nhận, giúp đỡ, chia sẻ công bằng.', 'Cho nhận lệch nhau, nợ nần, ơn nghĩa ràng buộc.'],
    ['Chờ thành quả, đánh giá lại công sức đã bỏ ra.', 'Thiếu kiên nhẫn, đầu tư chưa đáng.'],
    ['Chăm chỉ học nghề, tỉ mỉ, tiến bộ.', 'Làm cho xong chuyện, thiếu tâm huyết.'],
    ['Tự chủ tài chính, sung túc nhờ công sức mình.', 'Sống dựa dẫm, tiêu xài phô trương.'],
    ['Gia sản, nền nếp gia đình, sung túc lâu dài.', 'Tranh chấp tài sản, gia đình bất ổn.'],
    ['Ham học, kế hoạch thực tế, tin về tiền bạc.', 'Lười biếng, thiếu thực tế.'],
    ['Bền bỉ, đáng tin, làm chậm mà chắc.', 'Trì trệ, cứng nhắc, nhàm chán.'],
    ['Tháo vát, chu đáo, vun vén gia đình.', 'Lo lắng tiền bạc, bỏ bê bản thân.'],
    ['Giàu có, vững vàng, làm ăn giỏi.', 'Hám lợi, bảo thủ, coi trọng của cải quá mức.'],
  ],
];

export const LA: readonly La[] = [
  ...AN_CHINH.map(([anh, ten, khac, xuoi, nguoc]) => ({ anh, ten, khac, xuoi, nguoc })),
  ...BO.flatMap(([boAnh, boViet], b) => HANG.map(([hAnh, hViet], h) => ({
    anh: `${hAnh} of ${boAnh}`, ten: `${hViet} ${boViet}`, khac: null, xuoi: AN_PHU[b]?.[h]?.[0] ?? '', nguoc: AN_PHU[b]?.[h]?.[1] ?? '',
  }))),
];

/** Ba kieu trai: ten nut va cac vi tri [ten, y nghia]. Thap tu Celtic theo Waite (1911), Claude soan lai. */
export const TRAI = {
  motLa: { ten: 'Rút 1 lá', viTri: [['Lá cho câu hỏi', 'Điều cần chú ý nhất lúc này.']] },
  baLa: {
    ten: 'Rút 3 lá',
    viTri: [['Quá khứ', 'Điều đã qua còn ảnh hưởng tới việc hỏi.'], ['Hiện tại', 'Tình hình lúc này.'],
      ['Tương lai', 'Hướng sắp tới nếu cứ đi như hiện tại.']],
  },
  thapTu: {
    ten: 'Thập tự Celtic (10 lá)',
    viTri: [['1. Hiện trạng', 'Điều đang bao trùm việc hỏi.'], ['2. Trở ngại', 'Điều chắn ngang, thuận hay nghịch.'],
      ['3. Mục tiêu', 'Điều tốt nhất có thể đạt, điều đang hướng tới.'], ['4. Nền tảng', 'Gốc rễ của việc, điều đã thành của mình.'],
      ['5. Vừa qua', 'Ảnh hưởng đang qua dần.'], ['6. Sắp tới', 'Ảnh hưởng sắp đến gần.'],
      ['7. Bản thân', 'Thái độ, vị thế của người hỏi.'], ['8. Xung quanh', 'Người và hoàn cảnh quanh mình.'],
      ['9. Hy vọng và lo sợ', 'Điều đang mong hay đang sợ.'], ['10. Kết quả', 'Điều sẽ đến, gom ý các lá trước.']],
  },
} as const satisfies Record<string, { readonly ten: string; readonly viTri: readonly (readonly [string, string])[] }>;

export interface LaRut { readonly so: number; readonly nguoc: boolean }

/**
 * Rut `soLa` la khong trung: Fisher–Yates mot phan, moi buoc dung mot so ngau nhien 32 bit (lech do lay du toi da
 * 78/2^32, bo qua duoc); `soLa` so tiep theo quyet dinh la nguoc khi `dungNguoc`.
 */
export function rutBai(ngauNhien: readonly number[], soLa: number, dungNguoc: boolean): LaRut[] {
  if (soLa < 1 || soLa > LA.length || ngauNhien.length < 2 * soLa) throw new Error('Số lá hoặc số ngẫu nhiên không hợp lệ');
  const bo = LA.map((_, i) => i);
  return Array.from({ length: soLa }, (_, i) => {
    const j = i + ((ngauNhien[i] ?? 0) % (LA.length - i));
    const x = bo[j] ?? 0;
    bo[j] = bo[i] ?? 0;
    bo[i] = x;
    return { so: x, nguoc: dungNguoc && ((ngauNhien[soLa + i] ?? 0) & 1) === 1 };
  });
}
