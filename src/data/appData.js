/* ============================================================
   CTIN TREASURE HUNT — DATA + CONFIG
   ============================================================ */

export const CONFIG = {
  API_BASE: '/api',
  leaderboardTop: 10,
  // Danh sách phòng ban lấy từ backend (GET /api/employees/units), admin quản lý tại trang Admin › Phòng ban
  registerDeadline: '2026-11-15T23:59:59+07:00',
  contact: {
    name: 'Ms. Hương',
    phone: '0366 778 895',
    email: 'huongmtx@ctin.vn'
  }
};

export const HERO = {
  tag: '25 NĂM CTIN · 2001 – 2026',
  title: 'CTIN TREASURE HUNT',
  subtitle: 'Discover the Legacy. Create the Next Chapter.',
  desc: 'Hành trình để mỗi CBNV khám phá một mảnh di sản và cùng đơn vị hoàn thành hành trình CTIN.'
};

export const STORY = {
  paragraph: '25 năm không chỉ được tạo nên bởi những dấu mốc trên giấy. Đó còn là những câu chuyện, những con người, những ký ức và những giá trị đã cùng nhau làm nên CTIN hôm nay. Và giờ là lúc mỗi chúng ta cùng mở lại những "kho báu" ấy — mỗi người một mảnh ghép, cùng đơn vị về đích.',
  note: 'Đây KHÔNG phải cuộc thi kiểm tra kiến thức lịch sử.',
  cards: [
    { title: 'Mỗi người một mảnh ghép',   desc: 'Khám phá cá nhân, đóng góp cho tập thể.' },
    { title: 'Đơn vị cùng về đích',        desc: 'Tỷ lệ CBNV tham gia hợp lệ quyết định kết quả.' },
    { title: 'Câu chuyện thật, tư liệu thật', desc: 'Cách khám phá sâu và cách kể khác biệt.' }
  ]
};

export const HOW_TO_PLAY = {
  intro: {
    title: 'Ai được tham gia?',
    paragraphs: [
      'Toàn thể CBNV đều có thể tham gia.',
      'Mỗi người sử dụng tài khoản cá nhân, tự hoàn thành các Mission và đóng góp kết quả cho đơn vị mình.',
      'Giải đơn vị được xác định theo tỷ lệ CBNV tham gia hợp lệ.'
    ]
  },
  steps: [
    { num: '01', title: 'BTC mở Mission', desc: 'Công bố đề bài, thời hạn và các thẻ hoặc câu hỏi.' },
    { num: '02', title: 'Cá nhân khám phá', desc: 'Mỗi người chơi tự khám phá các tư liệu, giải mã manh mối và hoàn thành nhiệm vụ theo hướng dẫn.' },
    { num: '03', title: 'Lưu và nộp', desc: 'Có thể lưu nháp; chỉ nộp khi đã hoàn thành đủ trường bắt buộc.' },
    { num: '04', title: 'Hệ thống ghi nhận', desc: 'Cập nhật trạng thái cá nhân và tiến độ của đơn vị.' },
    { num: '05', title: 'BTC xác minh', desc: 'Kiểm duyệt đóng góp, công bố tiến độ và mở Mission tiếp theo.' }
  ],
  fairplayTitle: 'Fair play',
  fairplay: [
    { title: 'Nguồn thông tin rõ ràng', desc: 'Tư liệu lịch sử phải có nguồn; ký ức chưa xác minh phải gắn nhãn phù hợp.' },
    { title: 'Chấm chất lượng', desc: 'Không chấm theo tốc độ; đơn vị xếp hạng theo tỷ lệ tham gia hợp lệ.' },
    { title: 'Mỗi người tự nộp', desc: 'Có thể trao đổi và cùng xác minh lịch sử nhưng mỗi người phải tự nộp nội dung cá nhân.' }
  ]
};

export const MISSIONS = [
  { id: 'M1', num: '01', name: 'NHIỆM VỤ 01 – BẢN ĐỒ HÀNH TRÌNH',          focus: 'Giải mã hành trình phát triển CTIN', duration: '15–20 phút' },
  { id: 'M2', num: '02', name: 'NHIỆM VỤ 02 – CÂU CHUYỆN PHÍA SAU LỊCH SỬ', focus: 'Kể lại những ký ức và câu chuyện của người CTIN', duration: '10–15 phút' },
  { id: 'M3', num: '03', name: 'NHIỆM VỤ 03 – DẤU ẤN NGƯỜI DẪN ĐƯỜNG',      focus: 'Khám phá những quyết định, dấu ấn và phẩm chất lãnh đạo', duration: '10–12 phút' },
  { id: 'M4', num: '04', name: 'NHIỆM VỤ 04 – BẢN SẮC CTIN',                focus: 'Từ những giá trị được gìn giữ đến Chương 26', duration: '8–10 phút' }
];

export const PRIZES = {
  team: {
    title: 'ĐOÀN THÁM HIỂM ĐỒNG LÒNG',
    subtitle: 'Giải tập thể',
    desc: 'Tôn vinh những đơn vị có đông đảo CBNV cùng tham gia và hoàn thành các nhiệm vụ. Kết quả được tính trên mức độ tham gia của toàn đơn vị, không phụ thuộc vào thành tích của một vài cá nhân.',
    tiers: [
      { rank: 'Giải Nhất', count: '01', value: '10.000.000 đồng' },
      { rank: 'Giải Nhì', count: '01', value: '8.000.000 đồng' },
      { rank: 'Giải Ba', count: '01', value: '5.000.000 đồng' },
      { rank: 'Giải Khuyến khích', count: '05', value: '3.000.000 đồng mỗi giải' }
    ]
  },
  explorer: {
    title: 'NHÀ KHÁM PHÁ',
    subtitle: 'Danh hiệu & thưởng cá nhân',
    desc: 'Dành cho tất cả người chơi hoàn thành hợp lệ ít nhất 02 trong tổng số 04 nhiệm vụ. Mức thưởng tăng theo số nhiệm vụ hợp lệ đã hoàn thành.',
    highlight: 'Hoàn thành càng nhiều nhiệm vụ, phần thưởng càng lớn. Tối đa 400.000 đồng khi hoàn thành hợp lệ cả 04 nhiệm vụ.',
    tiers: [
      { missions: '0 hoặc 1', title: 'Chưa đủ điều kiện', reward: '0 đồng' },
      { missions: '02', title: 'Nhà khám phá', reward: '200.000 đồng' },
      { missions: '03', title: 'Nhà khám phá', reward: '300.000 đồng' },
      { missions: '04', title: 'Nhà khám phá', reward: '400.000 đồng' }
    ]
  },
  outstanding: {
    title: '05 NHÀ KHÁM PHÁ XUẤT SẮC',
    subtitle: 'Giải cá nhân xuất sắc',
    desc: 'Tôn vinh 05 người chơi có bài làm nổi bật nhất. Bài làm cần đáp ứng xuất sắc ít nhất một trong bốn nhóm tiêu chí.',
    criteria: [
      {
        name: 'Phát hiện và lưu giữ di sản CTIN',
        desc: 'Cung cấp câu chuyện, thông tin, hình ảnh, tài liệu hoặc hiện vật có nguồn gốc rõ ràng và có giá trị đối với lịch sử CTIN.'
      },
      {
        name: 'Kể câu chuyện CTIN truyền cảm hứng',
        desc: 'Chia sẻ câu chuyện chân thực, giàu cảm xúc, làm rõ ý nghĩa của CTIN đối với mỗi cá nhân và những người đã đồng hành cùng Công ty.'
      },
      {
        name: 'Giải mã hành trình CTIN',
        desc: 'Kết nối chính xác và sâu sắc các dấu mốc, con người, lựa chọn và những chuyển biến quan trọng của CTIN.'
      },
      {
        name: 'Kiến tạo Chương 26',
        desc: 'Đưa ra góc nhìn hoặc đề xuất thực tế, đổi mới và gắn với chặng đường phát triển tiếp theo của CTIN.'
      }
    ]
  },
  calculation: {
    formula: 'Tỷ lệ chinh phục = Tổng số nhiệm vụ hợp lệ của CBNV đơn vị ÷ (Tổng số CBNV đơn vị × 4) × 100%',
    example: 'Đơn vị có 20 CBNV, số nhiệm vụ tối đa là 80. Nếu CBNV hoàn thành 60 nhiệm vụ hợp lệ, tỷ lệ chinh phục là 75%.',
    notes: [
      'Tổng số CBNV lấy theo danh sách nhân sự do Ban Tổ chức chốt trước chương trình.',
      'Mỗi CBNV đóng góp tối đa 04 điểm nhiệm vụ cho đơn vị.',
      'Chỉ nhiệm vụ ở trạng thái Hợp lệ được đưa vào tử số.'
    ],
    tieBreakers: [
      'Tỷ lệ CBNV hoàn thành đủ cả 04 nhiệm vụ cao hơn.',
      'Tỷ lệ CBNV đạt danh hiệu Nhà khám phá cao hơn.',
      'Tỷ lệ CBNV có bài làm Nhiệm vụ 2 hợp lệ cao hơn.',
      'Thời điểm đơn vị đạt kết quả cuối cùng sớm hơn.'
    ]
  },
  personal: [
    { rank: 'Nhà khám phá (02 nhiệm vụ hợp lệ)', desc: '200.000 đồng' },
    { rank: 'Nhà khám phá (03 nhiệm vụ hợp lệ)', desc: '300.000 đồng' },
    { rank: 'Nhà khám phá (04 nhiệm vụ hợp lệ)', desc: '400.000 đồng' },
    { rank: '05 Nhà khám phá xuất sắc', desc: 'Tôn vinh 05 người chơi có bài làm nổi bật nhất theo 4 nhóm tiêu chí.' }
  ],
  unit: [
    { rank: 'Giải Nhất (01 giải)', desc: '10.000.000 đồng' },
    { rank: 'Giải Nhì (01 giải)', desc: '8.000.000 đồng' },
    { rank: 'Giải Ba (01 giải)', desc: '5.000.000 đồng' },
    { rank: 'Giải Khuyến khích (05 giải)', desc: '3.000.000 đồng mỗi giải' }
  ],
  bonus: [
    { rank: 'Phát hiện và lưu giữ di sản CTIN', desc: 'Cung cấp câu chuyện, thông tin, hình ảnh, tài liệu hoặc hiện vật có nguồn gốc rõ ràng.' },
    { rank: 'Kể câu chuyện CTIN truyền cảm hứng', desc: 'Chia sẻ câu chuyện chân thực, giàu cảm xúc về ý nghĩa của CTIN.' },
    { rank: 'Giải mã hành trình CTIN', desc: 'Kết nối chính xác và sâu sắc các dấu mốc, con người và chuyển biến của CTIN.' },
    { rank: 'Kiến tạo Chương 26', desc: 'Đưa ra góc nhìn hoặc đề xuất thực tế, đổi mới cho chặng đường phát triển tiếp theo.' }
  ],
  note: 'Hoàn thành càng nhiều nhiệm vụ, phần thưởng càng lớn. Tối đa 400.000 đồng khi hoàn thành hợp lệ cả 04 nhiệm vụ.'
};

export const TIMELINE = [
  {
    date: '2026-11-06',
    endDate: '2026-11-15',
    title: 'HÀNH TRÌNH TRUY TÌM KHO BÁU',
    desc: `Cả 04 nhiệm vụ được mở đồng thời. Người chơi tự do lựa chọn thứ tự khám phá và hoàn thành theo tiến độ cá nhân:
- Nhiệm vụ 01 – Bản đồ hành trình
- Nhiệm vụ 02 – Câu chuyện phía sau lịch sử
- Nhiệm vụ 03 – Dấu ấn người dẫn đường
- Nhiệm vụ 04 – Bản sắc CTIN
Hệ thống tự động lưu tiến độ trong suốt thời gian chương trình.`
  },
  {
    date: '2026-11-16',
    endDate: '2026-11-18',
    title: 'XÁC NHẬN THÀNH QUẢ',
    desc: 'Ban Tổ chức kiểm tra bài làm, xác nhận các nhiệm vụ hợp lệ và chốt kết quả của cá nhân, đơn vị.'
  },
  {
    date: '2026-11-20',
    endDate: null,
    title: 'CÔNG BỐ VÀ VINH DANH',
    desc: 'Công bố giải tập thể và cá nhân. Giải tập thể và cá nhân xuất sắc sẽ được trao trong đêm Gala.'
  }
];

export const FAQ = [
  { q: 'Ai được tham gia?', a: 'Toàn thể CBNV đều có thể tham gia.' },
  { q: 'Có phải đăng ký đội không?', a: 'Không. Người chơi đăng nhập cá nhân; hệ thống tự ghi nhận cho đơn vị.' },
  { q: 'Khi nào được tính là tham gia hợp lệ?', a: 'Khi hoàn thành đủ phần bắt buộc của mỗi Mission và được xác nhận Hợp lệ.' },
  { q: 'Giải đơn vị tính thế nào?', a: 'Tỷ lệ chinh phục = Tổng số nhiệm vụ hợp lệ của CBNV đơn vị ÷ (Tổng số CBNV đơn vị × 4) × 100%.' },
  { q: 'Đăng nhập nhưng chưa hoàn thành có được tính không?', a: 'Không.' },
  { q: 'Có thể làm trên điện thoại không?', a: 'Có. Giao diện ưu tiên mobile và cho phép lưu tiếp tục.' },
  { q: 'Có được trao đổi với đồng nghiệp không?', a: 'Có thể trao đổi và cùng xác minh lịch sử, nhưng mỗi người phải tự nộp nội dung cá nhân.' },
  { q: 'Có được dùng AI không?', a: 'Được hỗ trợ trình bày, biên tập, thiết kế; không được tạo dữ kiện hoặc nhân vật giả.' },
  { q: 'Tư liệu chưa chắc chắn xử lý thế nào?', a: 'Gắn nhãn "ký ức" hoặc "kể lại" và ghi người có thể xác nhận.' },
  { q: 'Thông tin mật xử lý thế nào?', a: 'Không tải hợp đồng đầy đủ, giá trị hợp đồng, dữ liệu khách hàng hoặc kỹ thuật nhạy cảm.' },
  { q: 'Liên hệ ai?', a: 'Ms. Hương — 0366 778 895 — huongmtx@ctin.vn' }
];

/* Helper functions */
export function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function fmtDate(d) {
  if (!d) return '';
  const dt = new Date(d);
  if (isNaN(dt)) return '';
  const dd = String(dt.getDate()).padStart(2, '0');
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${dt.getFullYear()}`;
}

export function fmtDateTime(d) {
  if (!d) return '';
  const dt = new Date(d);
  if (isNaN(dt)) return '';
  const hh = String(dt.getHours()).padStart(2, '0');
  const mi = String(dt.getMinutes()).padStart(2, '0');
  return `${fmtDate(d)} ${hh}:${mi}`;
}

export const SUBMISSION_STATUS = {
  pending:          { label: 'Đã nộp · Chờ xác nhận', cls: 'status-submitted' },
  valid:            { label: 'Hợp lệ',                cls: 'status-valid' },
  needs_supplement: { label: 'Cần bổ sung',           cls: 'status-needs-supplement' },
  invalid:          { label: 'Không hợp lệ',          cls: 'status-invalid' }
};

export const MISSION_STATE_LABELS = {
  not_open: { label: 'Chưa mở',  cls: 'status-locked' },
  open:     { label: 'Đang mở',  cls: 'status-available' },
  closed:   { label: 'Đã đóng',  cls: 'status-closed' }
};

export function getMissionState(mission) {
  if (!mission) return { code: 'not_open', ...MISSION_STATE_LABELS.not_open };
  const s = mission.status || 'locked';
  if (s === 'locked') return { code: 'not_open', ...MISSION_STATE_LABELS.not_open };
  if (s === 'closed') return { code: 'closed',   ...MISSION_STATE_LABELS.closed };
  if (mission.close_at && Date.now() > new Date(mission.close_at).getTime()) {
    return { code: 'closed', ...MISSION_STATE_LABELS.closed };
  }
  return { code: 'open', ...MISSION_STATE_LABELS.open };
}

export function getSubmissionStatus(sub) {
  if (!sub) return { code: 'not_submitted', label: 'Chưa nộp', cls: 'status-not-submitted' };
  const s = sub.status || 'pending';
  const def = SUBMISSION_STATUS[s] || SUBMISSION_STATUS.pending;
  return { code: s, label: def.label, cls: def.cls };
}
