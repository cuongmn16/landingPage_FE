/* ============================================================
 MISSION 4 — CTIN DNA · Data
 ============================================================ */
export const M4_CONFIG = {
  missionId: 4,
  code: 'NHIỆM VỤ 04 – BẢN SẮC CTIN',
  title: 'Từ những giá trị được gìn giữ đến Chương 26',
  shortTitle: 'Mission 04',
  points: 1 // điểm nhận được khi hoàn thành Mission 04 (BTC duyệt hợp lệ)
};

export const M4_TABS = [
  { id: 1, code: '01', name: 'Bắt đầu' },
  { id: 2, code: '02', name: 'DNA CTIN' },
  { id: 3, code: '03', name: 'Thời đại mới' },
  { id: 4, code: '04', name: 'Điều phải thay đổi' },
  { id: 5, code: '05', name: 'Người CTIN mới' },
  { id: 6, code: '06', name: 'Chương 26' },
  { id: 7, code: '07', name: 'Kết quả' }
];

export const M4_INTRO = {
  label: 'NHIỆM VỤ 04 – BẢN SẮC CTIN',
  title: 'Từ những giá trị được gìn giữ đến Chương 26',
  description:
    'Một hành trình đáng kể không chỉ được tạo nên bởi những gì đã đạt được, mà còn bởi khả năng hiểu mình, nhìn thẳng vào thay đổi và cùng nhau lựa chọn cách bước tiếp. Mission cuối cùng là lời chuyển tiếp từ di sản CTIN đến tương lai mà mỗi chúng ta cùng kiến tạo.',
  result:
    'Giải mã đủ 5 giá trị DNA CTIN, nhận diện điều phải thay đổi, hiểu 5 thông điệp lãnh đạo và hoàn thành cam kết cá nhân cho Chương 26.',
  requirementTitle: 'Yêu cầu thực hiện',
  requirementText:
    'Đọc kỹ dữ kiện, hoàn thành các phần ghép kiến thức và chia sẻ cá nhân. Kết quả hợp lệ sẽ được ghi nhận vào thành tích chung của đơn vị.',
  confirmLabel: 'Tôi đã đọc và hiểu yêu cầu nhiệm vụ.'
};

/* Tab 02 — DNA: giá trị → ý nghĩa hành vi đúng */
export const M4_DNA = [
  {
    id: 'D01',
    name: 'Customer Centric',
    nameVi: 'Khách hàng là điểm xuất phát và thước đo cuối cùng',
    meaningId: 'DM01',
    meaning:
      'Không chỉ đáp ứng yêu cầu, mà phải hiểu đúng vấn đề, đồng hành và chịu trách nhiệm đến cùng với giá trị tạo ra cho khách hàng.'
  },
  {
    id: 'D02',
    name: 'Cooperation',
    nameVi: 'Hợp tác để tạo ra sức mạnh chung',
    meaningId: 'DM02',
    meaning:
      'Không dừng ở phối hợp công việc; chủ động chia sẻ thông tin, vượt qua ranh giới đơn vị và đặt thành công chung cao hơn lợi ích cục bộ.'
  },
  {
    id: 'D03',
    name: 'Thirst',
    nameVi: 'Khát vọng vươn xa và không tự bằng lòng',
    meaningId: 'DM03',
    meaning:
      'Luôn tìm kiếm cơ hội lớn hơn, đặt tiêu chuẩn cao hơn và không để những thành công đã có trở thành giới hạn của ngày mai.'
  },
  {
    id: 'D04',
    name: 'Innovation',
    nameVi: 'Đổi mới để tạo ra giá trị thực',
    meaningId: 'DM04',
    meaning:
      'Dám chất vấn cách làm cũ, thử nghiệm cách làm mới và biến ý tưởng thành kết quả tốt hơn cho khách hàng và tổ chức.'
  },
  {
    id: 'D05',
    name: 'New Learning',
    nameVi: 'Học nhanh hơn tốc độ thay đổi',
    meaningId: 'DM05',
    meaning:
      'Chủ động học từ công nghệ, thị trường, khách hàng và đồng nghiệp; biến tri thức cá nhân thành năng lực chung của CTIN.'
  }
];

export const M4_DNA_MEANINGS = M4_DNA.map(d => ({ id: d.meaningId, label: d.meaning }));

/* Tab 03 — Thời đại mới: 4 nhóm × 4 tác động, chọn 2/nhóm */
export const M4_ERA_GROUPS = [
  {
    id: 'E1',
    title: 'Thế giới đã thay đổi',
    subtitle: 'Công nghệ, mô hình kinh doanh và tốc độ dịch chuyển đang tạo ra những luật chơi mới.',
    options: [
      { id: 'E1-1', label: 'Tăng năng lực cập nhật và làm chủ những công nghệ mới' },
      { id: 'E1-2', label: 'Xây dựng khả năng thích ứng trước những biến động khó dự báo' },
      { id: 'E1-3', label: 'Chuẩn hóa nền tảng vận hành để có thể mở rộng nhanh' },
      { id: 'E1-4', label: 'Tăng cường quản trị rủi ro, dữ liệu và an toàn hệ thống' }
    ]
  },
  {
    id: 'E2',
    title: 'Thị trường đã thay đổi',
    subtitle: 'Cơ hội không còn nằm trong những ranh giới và phân khúc quen thuộc.',
    options: [
      { id: 'E2-1', label: 'Mở rộng sang những không gian tăng trưởng và nhóm khách hàng mới' },
      { id: 'E2-2', label: 'Chuyển mạnh từ cung cấp sản phẩm sang tư duy giải pháp và giá trị' },
      { id: 'E2-3', label: 'Khai thác sâu hơn những thị trường và quan hệ khách hàng hiện có' },
      { id: 'E2-4', label: 'Nâng cao năng lực cạnh tranh về chi phí và hiệu quả cung ứng' }
    ]
  },
  {
    id: 'E3',
    title: 'Khách hàng đã thay đổi',
    subtitle: 'Khách hàng kỳ vọng giải pháp toàn diện, tốc độ cao và trách nhiệm đến cùng.',
    options: [
      { id: 'E3-1', label: 'Hiểu sâu hơn bài toán và kết quả khách hàng thực sự mong muốn' },
      { id: 'E3-2', label: 'Mở rộng trách nhiệm đối với hiệu quả xuyên suốt của giải pháp' },
      { id: 'E3-3', label: 'Cá nhân hóa cách tiếp cận và trải nghiệm cho từng nhóm khách hàng' },
      { id: 'E3-4', label: 'Tăng tốc độ phản hồi và tính minh bạch trong quá trình phục vụ' }
    ]
  },
  {
    id: 'E4',
    title: 'Đối thủ đã thay đổi',
    subtitle: 'Đối thủ mới linh hoạt hơn, nhanh hơn và có thể xuất hiện từ những lĩnh vực khác.',
    options: [
      { id: 'E4-1', label: 'Tạo khác biệt bằng năng lực tích hợp giải pháp và thực thi' },
      { id: 'E4-2', label: 'Rút ngắn thời gian quyết định, thử nghiệm và đưa giải pháp ra thị trường' },
      { id: 'E4-3', label: 'Mở rộng hợp tác với các đối tác trong hệ sinh thái công nghệ' },
      { id: 'E4-4', label: 'Tối ưu cấu trúc chi phí để duy trì khả năng cạnh tranh dài hạn' }
    ]
  }
];

export const M4_PRESSURES = [
  { id: 'E1', label: 'Thế giới' },
  { id: 'E2', label: 'Thị trường' },
  { id: 'E3', label: 'Khách hàng' },
  { id: 'E4', label: 'Đối thủ' }
];

/* Tab 04 — Chuyển đổi */
export const M4_CHANGES = [
  {
    id: 'C01',
    from: 'Từ hoàn thành phần việc',
    toId: 'CT01',
    to: 'Đến chịu trách nhiệm về kết quả cuối cùng'
  },
  {
    id: 'C02',
    from: 'Từ chờ đủ thông tin và chỉ đạo',
    toId: 'CT02',
    to: 'Đến chủ động quyết định trong phạm vi trách nhiệm'
  },
  {
    id: 'C03',
    from: 'Từ phối hợp theo ranh giới đơn vị',
    toId: 'CT03',
    to: 'Đến One Team cùng giải quyết vấn đề'
  },
  {
    id: 'C04',
    from: 'Từ dựa vào kinh nghiệm đã có',
    toId: 'CT04',
    to: 'Đến học nhanh, thử nghiệm và cập nhật liên tục'
  },
  {
    id: 'C05',
    from: 'Từ giữ an toàn trong thị trường quen thuộc',
    toId: 'CT05',
    to: 'Đến tiên phong tìm kiếm cơ hội và năng lực mới'
  }
];

export const M4_CHANGE_TARGETS = M4_CHANGES.map(c => ({ id: c.toId, label: c.to }));

/* Tab 05 — Leadership Messages */
export const M4_LEADERSHIP = [
  {
    id: 'L01',
    en: 'Ownership',
    vi: 'Tinh thần làm chủ',
    behaviorId: 'LB01',
    behavior: 'Nhìn thấy việc cần làm, chủ động hành động và chịu trách nhiệm đến cùng về kết quả.'
  },
  {
    id: 'L02',
    en: 'Aspiration',
    vi: 'Khát vọng vươn xa',
    behaviorId: 'LB02',
    behavior: 'Không tự giới hạn bởi vị trí hiện tại; đặt mục tiêu cao và bền bỉ mở rộng năng lực.'
  },
  {
    id: 'L03',
    en: 'Innovation Mindset',
    vi: 'Tinh thần đổi mới',
    behaviorId: 'LB03',
    behavior: 'Dám đặt câu hỏi, thử cách làm mới và học nhanh từ cả thành công lẫn thất bại.'
  },
  {
    id: 'L04',
    en: 'One Team',
    vi: 'Gắn kết và sẻ chia',
    behaviorId: 'LB04',
    behavior: 'Tin tưởng, chia sẻ và phối hợp xuyên ranh giới để cùng đạt mục tiêu chung.'
  },
  {
    id: 'L05',
    en: 'Pioneering Spirit',
    vi: 'Tinh thần tiên phong',
    behaviorId: 'LB05',
    behavior: 'Dám đi trước, nhận việc khó và mở ra cơ hội mới cho CTIN.'
  }
];

export const M4_LEADERSHIP_BEHAVIORS = M4_LEADERSHIP.map(l => ({
  id: l.behaviorId,
  label: l.behavior
}));

export function m4Label(list, id) {
  const item = (list || []).find(x => x.id === id);
  return item ? (item.label || item.name || item.vi || item.en || '') : '';
}

export function m4Shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
