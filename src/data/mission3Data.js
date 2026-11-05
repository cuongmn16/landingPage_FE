/* ============================================================
   MISSION 3 — LEADERSHIP LEGACIES · Data
   Theo "Mission 3 – Tài liệu bàn giao kỹ thuật". Đáp án chuẩn phải khớp
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
 * Thứ tự hiển thị: Ông Nguyễn Trí Dũng → Ông Tô Hoài Văn → Ông Hoàng Anh Lộc → Ông Lê Thanh Sơn → Ông Hà Thanh Hải.
 * markId / qualityId là mã ngẫu nhiên, không suy ra được từ ID lãnh đạo.
 * contentStatus: 'approved' | 'draft' — production chỉ phát hành khi tất cả approved.
 */
export const M3_LEADERS = [
  {
    id: 'L01',
    name: 'Ông Nguyễn Trí Dũng',
    role: 'Chủ tịch HĐQT kiêm TGĐ',
    period: 'Chủ tịch HĐQT kiêm TGĐ 11/2001–9/2018; Chủ tịch HĐQT 10/2018–6/2022',
    context:
      'CTIN chuyển từ doanh nghiệp nhà nước sang công ty cổ phần, phải nâng cao quyền tự chủ, tự tìm thị trường và tự chịu trách nhiệm về con đường phát triển.',
    markId: 'MK-R4',
    mark: 'Dẫn dắt CTIN qua giai đoạn đầu cổ phần hóa, xác lập hướng phát triển mới và đưa Công ty đạt quy mô, năng lực và vị thế cao hơn.',
    qualityId: 'QL-H5',
    quality: 'Dám chịu trách nhiệm; tin tưởng và trao quyền cho cộng sự.',
    contentStatus: 'approved',
    imageUrl: '/assets/submissions/mission-3/leaders/l01-nguyen-tri-dung.jpg'
  },
  {
    id: 'L02',
    name: 'Ông Tô Hoài Văn',
    role: 'Phó Chủ tịch HĐQT kiêm Phó TGĐ',
    period: 'Gia nhập 11/1991; Phó Chủ tịch HĐQT kiêm Phó TGĐ 11/2001–1/9/2025',
    context:
      'Trước cổ phần hóa, CTIN cần tìm hướng đi mới, tiếp cận công nghệ hiện đại và mở rộng hợp tác quốc tế.',
    markId: 'MK-T7',
    mark: 'Góp phần mở rộng hợp tác quốc tế; tham gia lựa chọn các hướng phát triển quan trọng, từ truyền dẫn đến hạ tầng mạng di động.',
    qualityId: 'QL-C8',
    quality: 'Tầm nhìn công nghệ; khả năng tham mưu và đồng hành trong những lựa chọn chiến lược.',
    contentStatus: 'approved',
    imageUrl: '/assets/submissions/mission-3/leaders/l02-to-hoai-van.jpg'
  },
  {
    id: 'L04',
    name: 'Ông Hoàng Anh Lộc',
    role: 'Chủ tịch HĐQT',
    period: 'Giám đốc Kinh doanh 1/2010–10/2016; Phó TGĐ 11/2016–6/2022; Chủ tịch HĐQT từ 7/2022',
    context:
      'Từ nền tảng kinh doanh, tham gia điều hành và quản trị trong giai đoạn CTIN cần thích ứng với thị trường thay đổi và chuẩn bị cho chu kỳ phát triển mới.',
    markId: 'MK-J9',
    mark: 'Góp phần củng cố nền tảng kinh doanh và quản trị, chuẩn bị tổ chức cho chu kỳ phát triển mới.',
    qualityId: 'QL-N6',
    quality: 'Năng lực kinh doanh và quản trị; định hướng phát triển bền vững.',
    contentStatus: 'approved',
    imageUrl: '/assets/submissions/mission-3/leaders/l04-hoang-anh-loc.jpg'
  },
  {
    id: 'L05',
    name: 'Ông Lê Thanh Sơn',
    role: 'Tổng Giám đốc',
    period: 'Trưởng thành từ kinh doanh; Phó TGĐ kiêm Giám đốc Kinh doanh 7/2022–12/2024; hiện là TGĐ',
    context:
      'CTIN bước vào giai đoạn chuyển giao điều hành sau tái cấu trúc và cần tìm kiếm động lực tăng trưởng mới.',
    markId: 'MK-F3',
    mark: 'Dẫn dắt giai đoạn chuyển giao điều hành và tìm kiếm động lực tăng trưởng mới.',
    qualityId: 'QL-D2',
    quality: 'Tinh thần tiên phong; kết nối đội ngũ với mục tiêu tăng trưởng.',
    contentStatus: 'approved',
    imageUrl: '/assets/submissions/mission-3/leaders/l05-le-thanh-son.jpg'
  },
  {
    id: 'L03',
    name: 'Ông Hà Thanh Hải',
    role: 'Tổng Giám đốc',
    period: 'Phó TGĐ 11/2016–9/2018; TGĐ 9/2018–7/2/2025',
    context:
      'CTIN bước vào giai đoạn thị trường viễn thông truyền thống thu hẹp, chịu tác động của Covid-19 và phải tái cấu trúc để thích ứng.',
    markId: 'MK-B2',
    mark: 'Dẫn dắt Công ty vượt qua giai đoạn nhiều khó khăn và biến động; củng cố và tái cấu trúc tổ chức để chuẩn bị cho chặng phát triển tiếp theo.',
    qualityId: 'QL-W1',
    quality: 'Kiên định trước áp lực; chủ động dẫn dắt thay đổi và duy trì sự ổn định của tổ chức.',
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
