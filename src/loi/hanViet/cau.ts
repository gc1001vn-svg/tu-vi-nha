/**
 * Bang Han-Viet — cau dai: 72 vat hau, thai than, Banh To bach ky, loc. Kieu va luat chung: `./index.ts`.
 *
 * Khoa: dung nguyen chuoi `lunar-typescript` 1.8.6 tra ra (chu gian the). Gia tri: { hv, nghia?, lyDo? }.
 * Chu: Unicode NFC; dau thanh kieu cu (Hỏa, Thủy, Hóa, Hòa); "Tỵ", "Kỷ", "Kỵ".
 * hv viet hoa chu dau; `nghia` BAT BUOC: dich nghia tieng Viet de hieu.
 * Claude soan 14/10/2026 — khong chep tu sach con ban quyen; doi chieu am bang `tests/HanVietDoiChieu.test.ts`.
 */
import type { Bang } from './index.ts';

export const CAU = {
  vatHau: {
    // Dong chi
    '蚯蚓结': { hv: 'Khưu dẫn kết', nghia: 'Giun đất co mình, cuộn tròn trong lòng đất' },
    '麋角解': { hv: 'Mi giác giải', nghia: 'Nai lớn (mi lộc) rụng sừng' },
    '水泉动': { hv: 'Thủy tuyền động', nghia: 'Mạch nước ngầm bắt đầu chuyển động, ấm dần lên' },
    // Tieu han
    '雁北乡': { hv: 'Nhạn Bắc hướng', nghia: 'Chim nhạn bắt đầu quay về hướng Bắc', lyDo: 'Hai nguồn đối chiếu chỉ ghi âm "hương" cho 乡; ở đây 乡 dùng như 向 nên âm Hán–Việt là "hướng" (Thiều Chửu: một âm là hướng, như hướng Bắc 向北).' },
    '鹊始巢': { hv: 'Thước thủy sào', nghia: 'Chim khách (hỉ thước) bắt đầu làm tổ' },
    '雉始雊': { hv: 'Trĩ thủy cấu', nghia: 'Chim trĩ bắt đầu kêu gọi bạn tình' },
    // Dai han
    '鸡始乳': { hv: 'Kê thủy nhũ', nghia: 'Gà bắt đầu đẻ trứng, ấp con' },
    '征鸟厉疾': { hv: 'Chinh điểu lệ tật', nghia: 'Chim săn mồi (ưng, cắt) bay nhanh, vồ mồi hung hăng' },
    '水泽腹坚': { hv: 'Thủy trạch phúc kiên', nghia: 'Băng trên sông hồ đóng dày, cứng tận lòng nước' },
    // Lap xuan
    '东风解冻': { hv: 'Đông phong giải đông', nghia: 'Gió xuân từ phương Đông thổi về, băng giá bắt đầu tan' },
    '蛰虫始振': { hv: 'Trập trùng thủy chấn', nghia: 'Sâu bọ ngủ đông bắt đầu cựa mình trong hang' },
    '鱼陟负冰': { hv: 'Ngư trắc phụ băng', nghia: 'Cá bơi lên gần mặt nước, lưng như đội những mảng băng chưa tan' },
    // Vu thuy
    '獭祭鱼': { hv: 'Thát tế ngư', nghia: 'Rái cá bắt cá bày la liệt trên bờ như bày lễ cúng' },
    '候雁北': { hv: 'Hậu nhạn Bắc', nghia: 'Chim nhạn theo mùa bay về phương Bắc' },
    '草木萌动': { hv: 'Thảo mộc manh động', nghia: 'Cây cỏ nảy mầm, đâm chồi' },
    // Kinh trap
    '桃始华': { hv: 'Đào thủy hoa', nghia: 'Hoa đào bắt đầu nở' },
    '仓庚鸣': { hv: 'Thương canh minh', nghia: 'Chim vàng anh (thương canh) bắt đầu hót' },
    '鹰化为鸠': { hv: 'Ưng hóa vi cưu', nghia: 'Chim ưng ẩn đi, chim cu xuất hiện nhiều; người xưa tưởng ưng hóa thành chim cu' },
    // Xuan phan
    '玄鸟至': { hv: 'Huyền điểu chí', nghia: 'Chim én bay về' },
    '雷乃发声': { hv: 'Lôi nãi phát thanh', nghia: 'Bắt đầu có tiếng sấm' },
    '始电': { hv: 'Thủy điện', nghia: 'Trời bắt đầu có chớp' },
    // Thanh minh
    '桐始华': { hv: 'Đồng thủy hoa', nghia: 'Cây bào đồng bắt đầu nở hoa' },
    '田鼠化为鴽': { hv: 'Điền thử hóa vi như', nghia: 'Chuột đồng ẩn vào hang, chim cút ra đồng nhiều; người xưa tưởng chuột hóa thành chim cút' },
    '虹始见': { hv: 'Hồng thủy hiện', nghia: 'Cầu vồng bắt đầu xuất hiện' },
    // Coc vu
    '萍始生': { hv: 'Bình thủy sinh', nghia: 'Bèo bắt đầu mọc trên mặt nước' },
    '鸣鸠拂其羽': { hv: 'Minh cưu phất kỳ vũ', nghia: 'Chim cu gáy vừa kêu vừa vỗ cánh, giũ lông' },
    '戴胜降于桑': { hv: 'Đái thắng giáng vu tang', nghia: 'Chim đầu rìu (đái thắng) đậu xuống cây dâu', lyDo: 'Hai nguồn đối chiếu chỉ ghi âm Nôm "đội" cho 戴; âm Hán–Việt là "đái" (bất cộng đái thiên 不共戴天).' },
    // Lap ha
    '蝼蝈鸣': { hv: 'Lâu quắc minh', nghia: 'Dế dũi (có sách nói là ếch nhái) bắt đầu kêu' },
    '蚯蚓出': { hv: 'Khưu dẫn xuất', nghia: 'Giun đất bò lên mặt đất' },
    '王瓜生': { hv: 'Vương qua sinh', nghia: 'Dây vương qua (loài dưa dại leo) mọc lan' },
    // Tieu man
    '苦菜秀': { hv: 'Khổ thái tú', nghia: 'Rau khổ thái (rau đắng) tốt tươi, trổ hoa' },
    '靡草死': { hv: 'Mỹ thảo tử', nghia: 'Các loài cỏ mảnh ưa mát lụi tàn dưới nắng hè' },
    '麦秋至': { hv: 'Mạch thu chí', nghia: 'Lúa mì chín, đến mùa gặt lúa mì' },
    // Mang chung
    '螳螂生': { hv: 'Đường lang sinh', nghia: 'Bọ ngựa nở ra' },
    '鵙始鸣': { hv: 'Quyết thủy minh', nghia: 'Chim bách thanh bắt đầu kêu' },
    '反舌无声': { hv: 'Phản thiệt vô thanh', nghia: 'Chim bách thiệt (loài hót nhại tiếng chim khác) im tiếng' },
    // Ha chi
    '鹿角解': { hv: 'Lộc giác giải', nghia: 'Hươu rụng sừng' },
    '蜩始鸣': { hv: 'Điêu thủy minh', nghia: 'Ve sầu bắt đầu kêu' },
    '半夏生': { hv: 'Bán hạ sinh', nghia: 'Cây bán hạ (một vị thuốc) mọc lên' },
    // Tieu thu
    '温风至': { hv: 'Ôn phong chí', nghia: 'Gió nóng thổi đến' },
    '蟋蟀居壁': { hv: 'Tất suất cư bích', nghia: 'Dế con chưa đủ cánh, còn nép trong khe vách' },
    '鹰始挚': { hv: 'Ưng thủy chí', nghia: 'Chim ưng non bắt đầu tập bay vồ mồi' },
    // Dai thu
    '腐草为萤': { hv: 'Hủ thảo vi huỳnh', nghia: 'Đom đóm bay ra từ đám cỏ mục; người xưa tưởng cỏ mục hóa thành đom đóm' },
    '土润溽暑': { hv: 'Thổ nhuận nhục thử', nghia: 'Đất ẩm ướt, trời oi nồng' },
    '大雨行时': { hv: 'Đại vũ hành thời', nghia: 'Mưa lớn đổ xuống thường xuyên' },
    // Lap thu
    '凉风至': { hv: 'Lương phong chí', nghia: 'Gió mát thổi đến' },
    '白露降': { hv: 'Bạch lộ giáng', nghia: 'Sáng sớm bắt đầu có sương trắng đọng' },
    '寒蝉鸣': { hv: 'Hàn thiền minh', nghia: 'Ve sầu cuối mùa (hàn thiền) cất tiếng kêu' },
    // Xu thu
    '鹰乃祭鸟': { hv: 'Ưng nãi tế điểu', nghia: 'Chim ưng bắt chim nhỏ, bày ra như cúng tế rồi mới ăn' },
    '天地始肃': { hv: 'Thiên địa thủy túc', nghia: 'Trời đất bắt đầu se lạnh, cây cỏ dần tiêu điều' },
    '禾乃登': { hv: 'Hòa nãi đăng', nghia: 'Lúa chín, vào mùa gặt' },
    // Bach lo
    '鸿雁来': { hv: 'Hồng nhạn lai', nghia: 'Chim hồng nhạn từ phương Bắc bay về phương Nam' },
    '玄鸟归': { hv: 'Huyền điểu quy', nghia: 'Chim én bay đi tránh rét' },
    '群鸟养羞': { hv: 'Quần điểu dưỡng tu', nghia: 'Bầy chim tích trữ thức ăn để qua mùa đông' },
    // Thu phan
    '雷始收声': { hv: 'Lôi thủy thu thanh', nghia: 'Sấm bắt đầu ngừng tiếng' },
    '蛰虫坯户': { hv: 'Trập trùng phôi hộ', nghia: 'Sâu bọ lấy đất đắp kín bớt cửa hang, chuẩn bị ngủ đông' },
    '水始涸': { hv: 'Thủy thủy hạc', nghia: 'Nước sông hồ bắt đầu cạn' },
    // Han lo
    '鸿雁来宾': { hv: 'Hồng nhạn lai tân', nghia: 'Những đàn hồng nhạn sau cùng bay về phương Nam, như khách đến trọ' },
    '雀入大水为蛤': { hv: 'Tước nhập đại thủy vi cáp', nghia: 'Chim sẻ vắng bóng, sò hến ven biển nhiều; người xưa tưởng chim sẻ xuống biển hóa thành sò' },
    '菊有黄花': { hv: 'Cúc hữu hoàng hoa', nghia: 'Hoa cúc nở vàng' },
    // Suong giang
    '豺乃祭兽': { hv: 'Sài nãi tế thú', nghia: 'Chó sói bắt thú, bày ra như cúng tế rồi mới ăn' },
    '草木黄落': { hv: 'Thảo mộc hoàng lạc', nghia: 'Cây cỏ úa vàng, lá rụng' },
    '蛰虫咸俯': { hv: 'Trập trùng hàm phủ', nghia: 'Sâu bọ đều nằm im trong hang, bắt đầu ngủ đông' },
    // Lap dong
    '水始冰': { hv: 'Thủy thủy băng', nghia: 'Nước bắt đầu đóng băng' },
    '地始冻': { hv: 'Địa thủy đông', nghia: 'Mặt đất bắt đầu đông cứng' },
    '雉入大水为蜃': { hv: 'Trĩ nhập đại thủy vi thận', nghia: 'Chim trĩ vắng bóng, trai sò lớn ven biển nhiều; người xưa tưởng chim trĩ xuống nước hóa thành trai lớn' },
    // Tieu tuyet
    '虹藏不见': { hv: 'Hồng tàng bất hiện', nghia: 'Cầu vồng ẩn mất, không còn thấy' },
    '天气上升地气下降': { hv: 'Thiên khí thượng thăng địa khí hạ giáng', nghia: 'Khí trời bốc lên, khí đất chìm xuống, trời đất không giao hòa' },
    '闭塞而成冬': { hv: 'Bế tắc nhi thành đông', nghia: 'Trời đất bế tắc, vạn vật ẩn náu, mùa đông thật sự bắt đầu' },
    // Dai tuyet
    '鹖鴠不鸣': { hv: 'Hạt đán bất minh', nghia: 'Chim hạt đán (loài kêu đêm) im tiếng' },
    '虎始交': { hv: 'Hổ thủy giao', nghia: 'Hổ bắt đầu giao phối' },
    '荔挺出': { hv: 'Lệ đĩnh xuất', nghia: 'Cỏ lệ (mã lận) đâm chồi nhú lên' },
  },
  thaiThan: {
    // Theo ngay, thu tu 60 Giap Ty
    '占门碓 外东南': { hv: 'Chiếm môn đối, ngoại Đông Nam', nghia: 'Thai thần ở cửa, cối giã; phía ngoài hướng Đông Nam' },
    '碓磨厕 外东南': { hv: 'Đối má xí, ngoại Đông Nam', nghia: 'Thai thần ở cối giã, cối xay, nhà xí; phía ngoài hướng Đông Nam' },
    '厨灶炉 外正南': { hv: 'Trù táo lô, ngoại chính Nam', nghia: 'Thai thần ở bếp núc, lò lửa; phía ngoài hướng chính Nam' },
    '仓库门 外正南': { hv: 'Thương khố môn, ngoại chính Nam', nghia: 'Thai thần ở kho, cửa; phía ngoài hướng chính Nam' },
    '房床栖 外正南': { hv: 'Phòng sàng thê, ngoại chính Nam', nghia: 'Thai thần ở buồng, giường, chuồng gà; phía ngoài hướng chính Nam' },
    '占门床 外正南': { hv: 'Chiếm môn sàng, ngoại chính Nam', nghia: 'Thai thần ở cửa, giường; phía ngoài hướng chính Nam' },
    '占碓磨 外正南': { hv: 'Chiếm đối má, ngoại chính Nam', nghia: 'Thai thần ở cối giã, cối xay; phía ngoài hướng chính Nam' },
    '厨灶厕 外西南': { hv: 'Trù táo xí, ngoại Tây Nam', nghia: 'Thai thần ở bếp núc, nhà xí; phía ngoài hướng Tây Nam' },
    '仓库炉 外西南': { hv: 'Thương khố lô, ngoại Tây Nam', nghia: 'Thai thần ở kho, lò lửa; phía ngoài hướng Tây Nam' },
    '房床门 外西南': { hv: 'Phòng sàng môn, ngoại Tây Nam', nghia: 'Thai thần ở buồng, giường, cửa; phía ngoài hướng Tây Nam' },
    '占门栖 外西南': { hv: 'Chiếm môn thê, ngoại Tây Nam', nghia: 'Thai thần ở cửa, chuồng gà; phía ngoài hướng Tây Nam' },
    '碓磨床 外西南': { hv: 'Đối má sàng, ngoại Tây Nam', nghia: 'Thai thần ở cối giã, cối xay, giường; phía ngoài hướng Tây Nam' },
    '厨灶碓 外西南': { hv: 'Trù táo đối, ngoại Tây Nam', nghia: 'Thai thần ở bếp núc, cối giã; phía ngoài hướng Tây Nam' },
    '仓库厕 外正西': { hv: 'Thương khố xí, ngoại chính Tây', nghia: 'Thai thần ở kho, nhà xí; phía ngoài hướng chính Tây' },
    '房床炉 外正西': { hv: 'Phòng sàng lô, ngoại chính Tây', nghia: 'Thai thần ở buồng, giường, lò lửa; phía ngoài hướng chính Tây' },
    '占大门 外正西': { hv: 'Chiếm đại môn, ngoại chính Tây', nghia: 'Thai thần ở cổng chính; phía ngoài hướng chính Tây' },
    '碓磨栖 外正西': { hv: 'Đối má thê, ngoại chính Tây', nghia: 'Thai thần ở cối giã, cối xay, chuồng gà; phía ngoài hướng chính Tây' },
    '厨灶床 外正西': { hv: 'Trù táo sàng, ngoại chính Tây', nghia: 'Thai thần ở bếp núc, giường; phía ngoài hướng chính Tây' },
    '仓库碓 外西北': { hv: 'Thương khố đối, ngoại Tây Bắc', nghia: 'Thai thần ở kho, cối giã; phía ngoài hướng Tây Bắc' },
    '房床厕 外西北': { hv: 'Phòng sàng xí, ngoại Tây Bắc', nghia: 'Thai thần ở buồng, giường, nhà xí; phía ngoài hướng Tây Bắc' },
    '占门炉 外西北': { hv: 'Chiếm môn lô, ngoại Tây Bắc', nghia: 'Thai thần ở cửa, lò lửa; phía ngoài hướng Tây Bắc' },
    '碓磨门 外西北': { hv: 'Đối má môn, ngoại Tây Bắc', nghia: 'Thai thần ở cối giã, cối xay, cửa; phía ngoài hướng Tây Bắc' },
    '厨灶栖 外西北': { hv: 'Trù táo thê, ngoại Tây Bắc', nghia: 'Thai thần ở bếp núc, chuồng gà; phía ngoài hướng Tây Bắc' },
    '仓库床 外西北': { hv: 'Thương khố sàng, ngoại Tây Bắc', nghia: 'Thai thần ở kho, giường; phía ngoài hướng Tây Bắc' },
    '房床碓 外正北': { hv: 'Phòng sàng đối, ngoại chính Bắc', nghia: 'Thai thần ở buồng, giường, cối giã; phía ngoài hướng chính Bắc' },
    '占门厕 外正北': { hv: 'Chiếm môn xí, ngoại chính Bắc', nghia: 'Thai thần ở cửa, nhà xí; phía ngoài hướng chính Bắc' },
    '碓磨炉 外正北': { hv: 'Đối má lô, ngoại chính Bắc', nghia: 'Thai thần ở cối giã, cối xay, lò lửa; phía ngoài hướng chính Bắc' },
    '厨灶门 外正北': { hv: 'Trù táo môn, ngoại chính Bắc', nghia: 'Thai thần ở bếp núc, cửa; phía ngoài hướng chính Bắc' },
    '仓库栖 外正北': { hv: 'Thương khố thê, ngoại chính Bắc', nghia: 'Thai thần ở kho, chuồng gà; phía ngoài hướng chính Bắc' },
    '占房床 房内北': { hv: 'Chiếm phòng sàng, phòng nội Bắc', nghia: 'Thai thần ở buồng, giường; trong buồng, phía Bắc' },
    '占门碓 房内北': { hv: 'Chiếm môn đối, phòng nội Bắc', nghia: 'Thai thần ở cửa, cối giã; trong buồng, phía Bắc' },
    '碓磨厕 房内北': { hv: 'Đối má xí, phòng nội Bắc', nghia: 'Thai thần ở cối giã, cối xay, nhà xí; trong buồng, phía Bắc' },
    '厨灶炉 房内北': { hv: 'Trù táo lô, phòng nội Bắc', nghia: 'Thai thần ở bếp núc, lò lửa; trong buồng, phía Bắc' },
    '仓库门 房内北': { hv: 'Thương khố môn, phòng nội Bắc', nghia: 'Thai thần ở kho, cửa; trong buồng, phía Bắc' },
    '房床栖 房内中': { hv: 'Phòng sàng thê, phòng nội trung', nghia: 'Thai thần ở buồng, giường, chuồng gà; trong buồng, ở giữa' },
    '占门床 房内中': { hv: 'Chiếm môn sàng, phòng nội trung', nghia: 'Thai thần ở cửa, giường; trong buồng, ở giữa' },
    '占碓磨 房内南': { hv: 'Chiếm đối má, phòng nội Nam', nghia: 'Thai thần ở cối giã, cối xay; trong buồng, phía Nam' },
    '厨灶厕 房内南': { hv: 'Trù táo xí, phòng nội Nam', nghia: 'Thai thần ở bếp núc, nhà xí; trong buồng, phía Nam' },
    '仓库炉 房内南': { hv: 'Thương khố lô, phòng nội Nam', nghia: 'Thai thần ở kho, lò lửa; trong buồng, phía Nam' },
    '房床门 房内西': { hv: 'Phòng sàng môn, phòng nội Tây', nghia: 'Thai thần ở buồng, giường, cửa; trong buồng, phía Tây' },
    '占门栖 房内东': { hv: 'Chiếm môn thê, phòng nội Đông', nghia: 'Thai thần ở cửa, chuồng gà; trong buồng, phía Đông' },
    '碓磨床 房内东': { hv: 'Đối má sàng, phòng nội Đông', nghia: 'Thai thần ở cối giã, cối xay, giường; trong buồng, phía Đông' },
    '厨灶碓 房内东': { hv: 'Trù táo đối, phòng nội Đông', nghia: 'Thai thần ở bếp núc, cối giã; trong buồng, phía Đông' },
    '仓库厕 房内东': { hv: 'Thương khố xí, phòng nội Đông', nghia: 'Thai thần ở kho, nhà xí; trong buồng, phía Đông' },
    '房床炉 房内中': { hv: 'Phòng sàng lô, phòng nội trung', nghia: 'Thai thần ở buồng, giường, lò lửa; trong buồng, ở giữa' },
    '占大门 外东北': { hv: 'Chiếm đại môn, ngoại Đông Bắc', nghia: 'Thai thần ở cổng chính; phía ngoài hướng Đông Bắc' },
    '碓磨栖 外东北': { hv: 'Đối má thê, ngoại Đông Bắc', nghia: 'Thai thần ở cối giã, cối xay, chuồng gà; phía ngoài hướng Đông Bắc' },
    '厨灶床 外东北': { hv: 'Trù táo sàng, ngoại Đông Bắc', nghia: 'Thai thần ở bếp núc, giường; phía ngoài hướng Đông Bắc' },
    '仓库碓 外东北': { hv: 'Thương khố đối, ngoại Đông Bắc', nghia: 'Thai thần ở kho, cối giã; phía ngoài hướng Đông Bắc' },
    '房床厕 外东北': { hv: 'Phòng sàng xí, ngoại Đông Bắc', nghia: 'Thai thần ở buồng, giường, nhà xí; phía ngoài hướng Đông Bắc' },
    '占门炉 外东北': { hv: 'Chiếm môn lô, ngoại Đông Bắc', nghia: 'Thai thần ở cửa, lò lửa; phía ngoài hướng Đông Bắc' },
    '碓磨门 外正东': { hv: 'Đối má môn, ngoại chính Đông', nghia: 'Thai thần ở cối giã, cối xay, cửa; phía ngoài hướng chính Đông' },
    '厨灶栖 外正东': { hv: 'Trù táo thê, ngoại chính Đông', nghia: 'Thai thần ở bếp núc, chuồng gà; phía ngoài hướng chính Đông' },
    '仓库床 外正东': { hv: 'Thương khố sàng, ngoại chính Đông', nghia: 'Thai thần ở kho, giường; phía ngoài hướng chính Đông' },
    '房床碓 外正东': { hv: 'Phòng sàng đối, ngoại chính Đông', nghia: 'Thai thần ở buồng, giường, cối giã; phía ngoài hướng chính Đông' },
    '占门厕 外正东': { hv: 'Chiếm môn xí, ngoại chính Đông', nghia: 'Thai thần ở cửa, nhà xí; phía ngoài hướng chính Đông' },
    '碓磨炉 外东南': { hv: 'Đối má lô, ngoại Đông Nam', nghia: 'Thai thần ở cối giã, cối xay, lò lửa; phía ngoài hướng Đông Nam' },
    '厨灶门 外东南': { hv: 'Trù táo môn, ngoại Đông Nam', nghia: 'Thai thần ở bếp núc, cửa; phía ngoài hướng Đông Nam' },
    '仓库栖 外东南': { hv: 'Thương khố thê, ngoại Đông Nam', nghia: 'Thai thần ở kho, chuồng gà; phía ngoài hướng Đông Nam' },
    '占房床 外东南': { hv: 'Chiếm phòng sàng, ngoại Đông Nam', nghia: 'Thai thần ở buồng, giường; phía ngoài hướng Đông Nam' },
    // Theo thang am (thang nhuan khong co)
    '占房床': { hv: 'Chiếm phòng sàng', nghia: 'Thai thần ở buồng, giường' },
    '占户窗': { hv: 'Chiếm hộ song', nghia: 'Thai thần ở cửa, cửa sổ' },
    '占门堂': { hv: 'Chiếm môn đường', nghia: 'Thai thần ở cửa, nhà chính' },
    '占厨灶': { hv: 'Chiếm trù táo', nghia: 'Thai thần ở bếp núc' },
    '占床仓': { hv: 'Chiếm sàng thương', nghia: 'Thai thần ở giường, kho' },
    '占碓磨': { hv: 'Chiếm đối má', nghia: 'Thai thần ở cối giã, cối xay' },
    '占厕户': { hv: 'Chiếm xí hộ', nghia: 'Thai thần ở nhà xí, cửa' },
    '占门房': { hv: 'Chiếm môn phòng', nghia: 'Thai thần ở cửa, buồng' },
    '占灶炉': { hv: 'Chiếm táo lô', nghia: 'Thai thần ở bếp, lò lửa' },
  },
  banhTo: {
    // Can ngay
    '甲不开仓财物耗散': { hv: 'Giáp bất khai thương tài vật hao tán', nghia: 'Ngày Giáp không nên mở kho, tiền của hao tán' },
    '乙不栽植千株不长': { hv: 'Ất bất tài thực thiên chu bất trưởng', nghia: 'Ngày Ất không nên trồng cây, trồng nghìn gốc cũng không lớn' },
    '丙不修灶必见灾殃': { hv: 'Bính bất tu táo tất kiến tai ương', nghia: 'Ngày Bính không nên sửa bếp, ắt gặp tai ương' },
    '丁不剃头头必生疮': { hv: 'Đinh bất thế đầu đầu tất sinh sang', nghia: 'Ngày Đinh không nên cạo đầu, cắt tóc, đầu ắt sinh mụn nhọt' },
    '戊不受田田主不祥': { hv: 'Mậu bất thụ điền điền chủ bất tường', nghia: 'Ngày Mậu không nên nhận ruộng đất, chủ ruộng gặp điều chẳng lành' },
    '己不破券二比并亡': { hv: 'Kỷ bất phá khoán nhị tỷ tịnh vong', nghia: 'Ngày Kỷ không nên hủy giấy giao kèo, cả hai bên đều thiệt' },
    '庚不经络织机虚张': { hv: 'Canh bất kinh lạc chức cơ hư trương', nghia: 'Ngày Canh không nên mắc sợi dệt vải, khung cửi căng ra cũng uổng công' },
    '辛不合酱主人不尝': { hv: 'Tân bất hợp tương chủ nhân bất thường', nghia: 'Ngày Tân không nên làm tương, chủ nhà chẳng được nếm' },
    '壬不泱水更难提防': { hv: 'Nhâm bất ương thủy cánh nan đề phòng', nghia: 'Ngày Nhâm không nên tháo nước, khơi dòng, nước tràn càng khó đề phòng' },
    '癸不词讼理弱敌强': { hv: 'Quý bất từ tụng lý nhược địch cường', nghia: 'Ngày Quý không nên kiện tụng, mình lý yếu mà đối phương mạnh' },
    // Chi ngay
    '子不问卜自惹祸殃': { hv: 'Tý bất vấn bốc tự nhạ họa ương', nghia: 'Ngày Tý không nên xem bói, tự rước tai họa' },
    '丑不冠带主不还乡': { hv: 'Sửu bất quan đới chủ bất hoàn hương', nghia: 'Ngày Sửu không nên làm lễ đội mũ, thắt đai (nhận chức), người ấy khó trở về quê' },
    '寅不祭祀神鬼不尝': { hv: 'Dần bất tế tự thần quỷ bất thường', nghia: 'Ngày Dần không nên cúng tế, thần linh không hưởng' },
    '卯不穿井水泉不香': { hv: 'Mão bất xuyên tỉnh thủy tuyền bất hương', nghia: 'Ngày Mão không nên đào giếng, nước giếng không trong ngọt' },
    '辰不哭泣必主重丧': { hv: 'Thìn bất khốc khấp tất chủ trùng tang', nghia: 'Ngày Thìn không nên khóc lóc, ắt gặp trùng tang', lyDo: 'Hai nguồn đối chiếu chỉ ghi âm Nôm "khóc" cho 哭; âm Hán–Việt là "khốc" (thống khốc 痛哭).' },
    '巳不远行财物伏藏': { hv: 'Tỵ bất viễn hành tài vật phục tàng', nghia: 'Ngày Tỵ không nên đi xa, tiền của dễ thất lạc' },
    '午不苫盖屋主更张': { hv: 'Ngọ bất thiêm cái ốc chủ canh trương', nghia: 'Ngày Ngọ không nên lợp mái nhà, chủ nhà sẽ phải thay đổi, làm lại' },
    '未不服药毒气入肠': { hv: 'Mùi bất phục dược độc khí nhập tràng', nghia: 'Ngày Mùi không nên uống thuốc, độc khí vào ruột' },
    '申不安床鬼祟入房': { hv: 'Thân bất an sàng quỷ túy nhập phòng', nghia: 'Ngày Thân không nên kê giường, ma quỷ vào phòng quấy phá' },
    '酉不会客醉坐颠狂': { hv: 'Dậu bất hội khách túy tọa điên cuồng', nghia: 'Ngày Dậu không nên đãi khách, khách say làm điều điên cuồng' },
    '戌不吃犬作怪上床': { hv: 'Tuất bất cật khuyển tác quái thượng sàng', nghia: 'Ngày Tuất không nên ăn thịt chó, ma quái quấy phá lên tận giường' },
    '亥不嫁娶不利新郎': { hv: 'Hợi bất giá thú bất lợi tân lang', nghia: 'Ngày Hợi không nên cưới gả, bất lợi cho chú rể' },
  },
  loc: {
    // Can ngay co loc o chi X: nguoi tuoi X duoc ho loc
    '子命互禄': { hv: 'Tý mệnh hỗ lộc', nghia: 'Ngày can Quý có lộc ở Tý: người tuổi Tý được hỗ lộc, hưởng lộc của ngày' },
    '寅命互禄': { hv: 'Dần mệnh hỗ lộc', nghia: 'Ngày can Giáp có lộc ở Dần: người tuổi Dần được hỗ lộc, hưởng lộc của ngày' },
    '卯命互禄': { hv: 'Mão mệnh hỗ lộc', nghia: 'Ngày can Ất có lộc ở Mão: người tuổi Mão được hỗ lộc, hưởng lộc của ngày' },
    '巳命互禄': { hv: 'Tỵ mệnh hỗ lộc', nghia: 'Ngày can Bính, Mậu có lộc ở Tỵ: người tuổi Tỵ được hỗ lộc, hưởng lộc của ngày' },
    '午命互禄': { hv: 'Ngọ mệnh hỗ lộc', nghia: 'Ngày can Đinh, Kỷ có lộc ở Ngọ: người tuổi Ngọ được hỗ lộc, hưởng lộc của ngày' },
    '申命互禄': { hv: 'Thân mệnh hỗ lộc', nghia: 'Ngày can Canh có lộc ở Thân: người tuổi Thân được hỗ lộc, hưởng lộc của ngày' },
    '酉命互禄': { hv: 'Dậu mệnh hỗ lộc', nghia: 'Ngày can Tân có lộc ở Dậu: người tuổi Dậu được hỗ lộc, hưởng lộc của ngày' },
    '亥命互禄': { hv: 'Hợi mệnh hỗ lộc', nghia: 'Ngày can Nhâm có lộc ở Hợi: người tuổi Hợi được hỗ lộc, hưởng lộc của ngày' },
    // Chi ngay la cho loc cua can Y: nguoi sinh nam can Y duoc tien loc
    '癸命进禄': { hv: 'Quý mệnh tiến lộc', nghia: 'Ngày chi Tý là chỗ lộc của can Quý: người sinh năm Quý được tiến lộc (lộc tới)' },
    '甲命进禄': { hv: 'Giáp mệnh tiến lộc', nghia: 'Ngày chi Dần là chỗ lộc của can Giáp: người sinh năm Giáp được tiến lộc (lộc tới)' },
    '乙命进禄': { hv: 'Ất mệnh tiến lộc', nghia: 'Ngày chi Mão là chỗ lộc của can Ất: người sinh năm Ất được tiến lộc (lộc tới)' },
    '丙,戊命进禄': { hv: 'Bính, Mậu mệnh tiến lộc', nghia: 'Ngày chi Tỵ là chỗ lộc của can Bính, Mậu: người sinh năm Bính hoặc Mậu được tiến lộc (lộc tới)' },
    '丁,己命进禄': { hv: 'Đinh, Kỷ mệnh tiến lộc', nghia: 'Ngày chi Ngọ là chỗ lộc của can Đinh, Kỷ: người sinh năm Đinh hoặc Kỷ được tiến lộc (lộc tới)' },
    '庚命进禄': { hv: 'Canh mệnh tiến lộc', nghia: 'Ngày chi Thân là chỗ lộc của can Canh: người sinh năm Canh được tiến lộc (lộc tới)' },
    '辛命进禄': { hv: 'Tân mệnh tiến lộc', nghia: 'Ngày chi Dậu là chỗ lộc của can Tân: người sinh năm Tân được tiến lộc (lộc tới)' },
    '壬命进禄': { hv: 'Nhâm mệnh tiến lộc', nghia: 'Ngày chi Hợi là chỗ lộc của can Nhâm: người sinh năm Nhâm được tiến lộc (lộc tới)' },
  },
} satisfies Record<string, Bang>;
