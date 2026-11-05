/* ============================================================
   MISSION 3 — LEADERSHIP LEGACIES · Data
   Theo "Mission 3 – Tài liệu bàn giao kỹ thuật V4". Đáp án chuẩn phải khớp
   backend: page/.../service/Mission3Grader.java (cùng contentVersion).
   ============================================================ */
export const M3_CONFIG = {
  missionId: 3,
  code: 'NHIỆM VỤ 03 – DẤU ẤN NGƯỜI DẪN ĐƯỜNG',
  title: 'Khám phá những quyết định, dấu ấn và phẩm chất lãnh đạo',
  shortTitle: 'Mission 03',
  contentVersion: 'm3-2026.10',
  minReflection: 100,
  points: 1 // điểm nhận được khi hoàn thành Mission 03 (BTC duyệt hợp lệ)
};

export const M3_TABS = [
  { id: 1, code: '01', name: 'Bắt đầu' },
  { id: 2, code: '02', name: 'Năm người dẫn đường' },
  { id: 3, code: '03', name: 'Giải mã dấu ấn' },
  { id: 4, code: '04', name: 'Điều được trao lại' },
  { id: 5, code: '05', name: 'Hồ sơ hoàn chỉnh' }
];

export const M3_INTRO = {
  label: 'NHIỆM VỤ 03 – DẤU ẤN NGƯỜI DẪN ĐƯỜNG',
  title: 'Khám phá những quyết định, dấu ấn và phẩm chất lãnh đạo',
  description:
    'Một hành trình dài không chỉ được ghi dấu bằng những cột mốc, mà còn bởi những con người đã lựa chọn hướng đi, dẫn dắt sự thay đổi và truyền lại niềm tin cho thế hệ tiếp theo. Qua năm hồ sơ lãnh đạo, hãy khám phá những quyết định, phẩm chất và dấu ấn đã góp phần tạo nên CTIN hôm nay.',
  result:
    'Mở năm hồ sơ, giải mã quyết định hoặc dấu ấn và phẩm chất của từng người, sau đó chia sẻ điều người CTIN hôm nay cần tiếp tục.',
  requirementTitle: 'Yêu cầu thực hiện',
  requirementText:
    'Đọc hồ sơ, ghép đúng dấu ấn với phẩm chất, chọn điều cần tiếp nối và chia sẻ ngắn. Kết quả hợp lệ được ghi nhận vào thành tích đơn vị.',
  confirmLabel: 'Tôi đã đọc và hiểu yêu cầu nhiệm vụ.'
};

/*
 * 5 lãnh đạo — ID ổn định L01–L05 (không dùng tên làm khóa).
 * Thứ tự hiển thị theo Review Web: Ông Nguyễn Trí Dũng → Ông Tô Hoài Văn → Ông Hoàng Anh Lộc → Ông Lê Thanh Sơn → Ông Hà Thanh Hải.
 * markId / qualityId là mã ngẫu nhiên, không suy ra được từ ID lãnh đạo.
 * Nội dung bối cảnh, dấu ấn, phẩm chất cập nhật chuẩn xác theo file Mission_3_Tai_lieu_ban_giao_ky_thuat_V4.docx.
 */
export const M3_LEADERS = [
  {
    id: 'L01',
    name: 'Ông Nguyễn Trí Dũng',
    role: 'Chủ tịch HĐQT kiêm Tổng Giám đốc',
    period: 'Gắn bó với Công ty từ 4/1981\nChủ tịch HĐQT kiêm Tổng giám đốc: 11/2001–9/2018; Chủ tịch HĐQT 10/2018–6/2022.',
    context:
      'Sau cổ phần hóa, CTIN chủ động xác lập con đường phát triển: tự tìm kiếm thị trường, lựa chọn công nghệ, xây dựng đội ngũ và chịu trách nhiệm về kết quả. Công ty lần lượt trải qua quá trình hình thành năng lực tích hợp hệ thống, mở rộng quy mô và vươn tới cột mốc doanh thu trên 3.000 tỷ đồng, lợi nhuận trên 100 tỷ đồng vào năm 2017.',
    markId: 'MK-R4',
    mark: 'Là người đứng đầu CTIN sau cổ phần hóa, ông cùng tập thể lãnh đạo xác lập và kiên trì theo đuổi con đường phát triển tự chủ; dẫn dắt Công ty từ giai đoạn chuyển đổi mô hình, xây dựng năng lực tích hợp hệ thống đến mở rộng quy mô và đạt đỉnh cao của một chu kỳ tăng trưởng vào năm 2017. Ông đồng thời xây dựng đội ngũ kế cận thông qua việc tin tưởng và trao quyền cho cộng sự.',
    qualityId: 'QL-H5',
    quality: 'Bản lĩnh trong những lựa chọn lớn; sẵn sàng gánh vác trách nhiệm cuối cùng; tin tưởng, trao quyền cho cộng sự và là một người sống giản dị.',
    contentStatus: 'approved',
    imageUrl: '/assets/submissions/mission-3/leaders/l01-nguyen-tri-dung.jpg'
  },
  {
    id: 'L02',
    name: 'Ông Tô Hoài Văn',
    role: 'Phó Chủ tịch HĐQT kiêm Phó Tổng Giám đốc',
    period: 'Gia nhập Công ty từ 01/1990; Phó Chủ tịch HĐQT kiêm Phó Tổng Giám đốc 11/2001–1/9/2025.',
    context:
      'Đầu những năm 1990, CTIN vẫn chủ yếu hoạt động bằng sửa chữa, bảo dưỡng thiết bị. Quá trình số hóa ngành Bưu điện mở ra cơ hội để Công ty tiếp cận công nghệ viễn thông hiện đại. Sau đó, khi CTIN mở rộng sang lĩnh vực tin học và công nghệ thông tin, Công ty tiếp tục cần lựa chọn công nghệ, xây dựng quan hệ với các hãng quốc tế và phát triển năng lực tích hợp hệ thống trên phạm vi rộng hơn.',
    markId: 'MK-T7',
    mark: 'Tiên phong thiết lập và dẫn dắt quan hệ hợp tác với các hãng công nghệ quốc tế, đưa CTIN từng bước tham gia tổng đài điện tử số, viba số, truyền dẫn, mạng thông tin di động và sau đó là tích hợp hệ thống công nghệ thông tin. Ông đồng thời tham mưu, đồng hành cùng lãnh đạo Công ty trong việc lựa chọn những hướng công nghệ chiến lược, góp phần tạo nên nền tảng kinh doanh viễn thông và công nghệ thông tin của CTIN.',
    qualityId: 'QL-C8',
    quality: 'Tầm nhìn công nghệ; nhạy bén trong nhận diện cơ hội; khả năng kết nối, tham mưu và kiên trì đồng hành với những lựa chọn chiến lược dài hạn.',
    contentStatus: 'approved',
    imageUrl: '/assets/submissions/mission-3/leaders/l02-to-hoai-van.jpg'
  },
  {
    id: 'L04',
    name: 'Ông Hoàng Anh Lộc',
    role: 'Chủ tịch HĐQT',
    period: 'Gia nhập Công ty từ 9/1994\nGiám đốc Kinh doanh: 1/2010–10/2016; Phó Tổng giám đốc: 11/2016–6/2022; Chủ tịch HĐQT từ 7/2022.',
    context:
      'Sau cổ phần hóa và bước đầu định hình con đường phát triển, CTIN bước vào giai đoạn cạnh tranh mạnh để mở rộng thị trường, chinh phục các dự án lớn và đưa năng lực công nghệ thành thế mạnh trong hoạt động XSKD. Sau khi đạt đỉnh về quy mô, Công ty tiếp tục đối mặt với thị trường viễn thông bão hòa, tác động của Covid-19 và yêu cầu xác lập hướng phát triển mới.',
    markId: 'MK-J9',
    mark: 'Là người tiên phong trên mặt trận kinh doanh, trực tiếp dẫn dắt đội ngũ chinh phục thị trường, đồng thời góp phần quan trọng định hình những lựa chọn chiến lược của CTIN qua các giai đoạn phát triển.',
    qualityId: 'QL-N6',
    quality: 'Tinh thần tiên phong; nhạy bén với thị trường; quyết liệt, bền bỉ và dám dấn thân trong những nhiệm vụ khó.',
    contentStatus: 'approved',
    imageUrl: '/assets/submissions/mission-3/leaders/l04-hoang-anh-loc.jpg'
  },
  {
    id: 'L05',
    name: 'Ông Lê Thanh Sơn',
    role: 'Tổng Giám đốc',
    period: 'Gắn bó với CTIN từ năm 1999; trưởng thành từ lĩnh vực kinh doanh; Phó Tổng Giám đốc kiêm Giám đốc Kinh doanh 7/2022–12/2024; Tổng Giám đốc từ 7/2/2025.',
    context:
      'Trong quá trình mở rộng thị trường, CTIN không chỉ cần nhận diện đúng cơ hội mà còn phải tổ chức thực hiện quyết liệt để chuyển các định hướng chiến lược thành dự án, doanh thu và vị thế trên thị trường. Sau giai đoạn tái cấu trúc, Công ty tiếp tục cần củng cố hoạt động, nâng cao hiệu quả và tìm kiếm những động lực tăng trưởng mới.',
    markId: 'MK-F3',
    mark: 'Gắn bó lâu dài với hoạt động kinh doanh, ông giữ vai trò hạt nhân trong việc tổ chức triển khai các định hướng và cơ hội thị trường thành những dự án, kết quả kinh doanh cụ thể. Trên cương vị Tổng Giám đốc, ông tiếp tục thúc đẩy tinh thần hành động, đổi mới và tập trung vào hiệu quả, dẫn dắt CTIN chuyển hóa định hướng chiến lược thành những bước tiến thực tế trên thị trường.',
    qualityId: 'QL-D2',
    quality: 'Quyết đoán trong điều hành; quyết liệt trong hành động; tiên phong đổi mới; nhạy bén với cơ hội và kiên trì theo đuổi kết quả.',
    contentStatus: 'approved',
    imageUrl: '/assets/submissions/mission-3/leaders/l05-le-thanh-son.jpg'
  },
  {
    id: 'L03',
    name: 'Ông Hà Thanh Hải',
    role: 'Tổng Giám đốc',
    period: 'Phó Tổng giám đốc: 11/2016–9/2018; Tổng Giám đốc: 9/2018–7/2/2025.',
    context:
      'Ông tiếp nhận vai trò Tổng Giám đốc khi CTIN vừa đi qua cột mốc cao nhất về quy mô kinh doanh, nhưng thị trường viễn thông truyền thống bắt đầu bão hòa và cơ hội tăng trưởng ngày càng hạn chế. Sau đó, Công ty tiếp tục chịu tác động của Covid-19, áp lực suy giảm thị trường và yêu cầu phải củng cố, tái cấu trúc tổ chức để thích ứng.',
    markId: 'MK-B2',
    mark: 'Dẫn dắt CTIN trong một trong những giai đoạn nhiều biến động nhất của Công ty; duy trì hoạt động qua thời kỳ Covid-19, củng cố quản trị và thực hiện tái cấu trúc tổ chức. Những nỗ lực này giúp CTIN giữ được sự ổn định, tiếp tục vận hành và tạo nền tảng cho quá trình chuyển giao sang chặng phát triển tiếp theo.',
    qualityId: 'QL-W1',
    quality: 'Kiên định trước áp lực; bình tĩnh trong giai đoạn khó khăn; chủ động thích ứng và quyết liệt dẫn dắt những thay đổi cần thiết của tổ chức.',
    contentStatus: 'approved',
    imageUrl: '/assets/submissions/mission-3/leaders/l03-ha-thanh-hai.jpg'
  }
];

/* Hai ngân hàng đáp án độc lập cho Tab 03 */
export const M3_MARKS = M3_LEADERS.map(l => ({ id: l.markId, label: l.mark }));
export const M3_QUALITIES = M3_LEADERS.map(l => ({ id: l.qualityId, label: l.quality }));

/* Ngân hàng Điều cần tiếp nối — quan điểm cá nhân, không có đúng sai, được chọn trùng */
export const M3_CONTINUATIONS = [
  { id: 'C01', label: 'Giữ vững niềm tin và trách nhiệm.' },
  { id: 'C02', label: 'Dám mở đường cho hướng đi mới.' },
  { id: 'C03', label: 'Xây dựng đội ngũ và trao cơ hội.' },
  { id: 'C04', label: 'Kết nối con người với mục tiêu chung.' },
  { id: 'C05', label: 'Không ngừng học hỏi và đổi mới.' }
];

/* Chặn phát hành khi còn nội dung chưa duyệt: bật mặc định ở bản build production,
   đặt VITE_M3_ALLOW_DRAFT=true để chạy UAT bằng dữ liệu mẫu. */
export const M3_HAS_DRAFT = M3_LEADERS.some(l => l.contentStatus !== 'approved');
export const M3_PUBLISH_BLOCKED =
  M3_HAS_DRAFT && import.meta.env.PROD && import.meta.env.VITE_M3_ALLOW_DRAFT !== 'true';

export function m3Label(list, id) {
  const item = (list || []).find(x => x.id === id);
  return item ? item.label : '';
}
