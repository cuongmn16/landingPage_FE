/* ============================================================
   CTIN TREASURE HUNT — DATA + CONFIG
   ============================================================ */

export const CONFIG = {
  API_BASE: '/api',
  leaderboardTop: 10,
  // Danh sách phòng ban lấy từ backend (GET /api/employees/units), admin quản lý tại trang Admin › Phòng ban
  registerDeadline: '2026-10-15T23:59:59+07:00',
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
      'Toàn thể CBNV CTIN thuộc danh sách đủ điều kiện đều có thể tham gia.',
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
    { title: 'AI hỗ trợ, không được bịa', desc: 'AI được hỗ trợ trình bày, biên tập, thiết kế — nhưng không được tạo dữ kiện hay nhân vật giả.' },
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
  personal: [
    { rank: 'Legacy Explorer',     desc: 'Người hoàn thành sớm nhất với đầy đủ 4 Mission.' },
    { rank: 'Master Investigator', desc: 'Điểm cao nhất toàn chương trình.' },
    { rank: 'Legacy Contributor',  desc: 'Đóng góp di sản nổi bật nhất.' },
    { rank: 'Memory Keeper',       desc: 'Tư liệu/ký ức giá trị nhất.' },
    { rank: 'Lucky Explorer',      desc: 'Người chơi may mắn.' }
  ],
  unit: [
    { rank: 'Đơn vị cùng về đích xuất sắc nhất', desc: 'Tỷ lệ CBNV tham gia hợp lệ cao nhất.' }
  ],
  bonus: [
    { rank: 'Đơn vị lan tỏa mạnh nhất' },
    { rank: 'Đơn vị hoàn thành sớm nhất' },
    { rank: 'Đơn vị đóng góp di sản nổi bật' }
  ],
  note: 'Giá trị và số lượng giải thưởng do BTC quyết định. Giải Mission và giải phụ không cộng vào điểm xếp hạng chung.'
};

export const TIMELINE = [
  { date: '2026-10-01', endDate: '2026-10-15', title: 'Chuẩn bị & kích hoạt tài khoản',              desc: 'Khóa danh sách nhân sự, kích hoạt tài khoản.' },
  { date: '2026-10-16', endDate: '2026-10-22', title: 'NHIỆM VỤ 01 – BẢN ĐỒ HÀNH TRÌNH',          desc: 'Giải mã hành trình phát triển CTIN' },
  { date: '2026-10-23', endDate: '2026-10-29', title: 'NHIỆM VỤ 02 – CÂU CHUYỆN PHÍA SAU LỊCH SỬ', desc: 'Kể lại những ký ức và câu chuyện của người CTIN' },
  { date: '2026-10-30', endDate: '2026-11-05', title: 'NHIỆM VỤ 03 – DẤU ẤN NGƯỜI DẪN ĐƯỜNG',      desc: 'Khám phá những quyết định, dấu ấn và phẩm chất lãnh đạo' },
  { date: '2026-11-06', endDate: '2026-11-12', title: 'NHIỆM VỤ 04 – BẢN SẮC CTIN',                desc: 'Từ những giá trị được gìn giữ đến Chương 26' },
  { date: '2026-11-13', endDate: '2026-11-19', title: 'Catch up',                                    desc: 'Hoàn thành các Mission còn thiếu.' },
  { date: '2026-11-20', endDate: null,         title: 'Xác minh và công bố',                         desc: 'Khóa dữ liệu, công bố kết quả và vinh danh.' }
];

export const FAQ = [
  { q: 'Ai được tham gia?', a: 'Toàn thể CBNV có tên trong danh sách đủ điều kiện do Ban Nhân lực cung cấp.' },
  { q: 'Có phải đăng ký đội không?', a: 'Không. Người chơi đăng nhập cá nhân; hệ thống tự ghi nhận cho đơn vị.' },
  { q: 'Khi nào được tính là tham gia hợp lệ?', a: 'Khi hoàn thành đủ phần bắt buộc của bốn Mission và nộp đúng hạn.' },
  { q: 'Giải đơn vị tính thế nào?', a: 'Theo số người tham gia hợp lệ chia cho tổng nhân sự đủ điều kiện của đơn vị.' },
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
  pending:          { label: 'Đã nộp · Chờ chấm', cls: 'status-submitted' },
  valid:            { label: 'Hợp lệ',            cls: 'status-valid' },
  needs_supplement: { label: 'Cần bổ sung',       cls: 'status-needs-supplement' },
  invalid:          { label: 'Không hợp lệ',      cls: 'status-invalid' }
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
