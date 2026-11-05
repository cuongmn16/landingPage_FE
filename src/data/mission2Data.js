/* ============================================================
   MISSION 2 — LEGACY STORIES · Data
   ============================================================ */
export const M2_CONFIG = {
  missionId: 2,
  code: 'NHIỆM VỤ 02 – CÂU CHUYỆN PHÍA SAU LỊCH SỬ',
  title: 'Kể lại những ký ức và câu chuyện của người CTIN',
  shortTitle: 'Mission 02',
  points: 1 // điểm nhận được khi hoàn thành Mission 02 (BTC duyệt hợp lệ)
};

export const M2_TABS = [
  { id: 1, code: '01', name: 'Bắt đầu' },
  { id: 2, code: '02', name: 'Chọn ký ức' },
  { id: 3, code: '03', name: 'Gọi lại ký ức' },
  { id: 4, code: '04', name: 'Viết lại ký ức' },
  { id: 5, code: '05', name: 'Lưu giữ' },
  { id: 6, code: '06', name: 'Điều còn lại' },
  { id: 7, code: '07', name: 'Thẻ ký ức' }
];

export const M2_INTRO = {
  label: 'NHIỆM VỤ 02 – CÂU CHUYỆN PHÍA SAU LỊCH SỬ',
  title: 'Kể lại những ký ức và câu chuyện của người CTIN',
  description:
    'Mỗi dấu mốc lịch sử đều được tạo nên từ những con người và những câu chuyện không phải lúc nào cũng xuất hiện trong hồ sơ chính thức. Hãy kể lại một ký ức giúp chúng ta hiểu thêm CTIN đã đi qua hành trình ấy như thế nào, đồng thời chia sẻ điều CTIN đã để lại trong bạn sau những năm tháng cùng đồng hành.',
  result:
    'Một câu chuyện hoặc kỷ niệm thật, có bối cảnh, cảm xúc, tư liệu hoặc đầu mối xác minh và điều còn lại đối với CTIN.',
  requirementTitle: 'Yêu cầu thực hiện',
  requirementText:
    'Đọc kỹ dữ kiện, lựa chọn phương án phù hợp và hoàn thành phần chia sẻ cá nhân. Kết quả hợp lệ sẽ được ghi nhận vào thành tích chung của đơn vị.',
  confirmLabel: 'Tôi đã đọc và hiểu yêu cầu nhiệm vụ.'
};

/* Tab 02 — Mối liên hệ người kể */
export const M2_ROLES = [
  { id: 'R01', label: 'Đây là câu chuyện tôi đã trực tiếp trải qua' },
  { id: 'R02', label: 'Đây là câu chuyện tôi đã chứng kiến' },
  { id: 'R03', label: 'Đây là câu chuyện tôi được đồng nghiệp hoặc thế hệ đi trước kể lại' }
];

/* Tab 02 — Thời gian */
export const M2_PERIODS = [
  { id: 'P01', label: '1972–1985' },
  { id: 'P02', label: '1985–2000' },
  { id: 'P03', label: '2001–2007' },
  { id: 'P04', label: '2008–2019' },
  { id: 'P05', label: '2020–nay' },
  { id: 'P06', label: 'Tôi không nhớ chính xác' }
];

/* Tab 02 — Dạng ký ức */
export const M2_KINDS = [
  { id: 'K01', label: 'Một lần cùng nhau vượt khó' },
  { id: 'K02', label: 'Một công việc hoặc dự án đáng nhớ' },
  { id: 'K03', label: 'Một thay đổi nhỏ tạo ra kết quả lớn hơn' },
  { id: 'K04', label: 'Một khoảnh khắc với khách hàng' },
  { id: 'K05', label: 'Một người đồng nghiệp hoặc tập thể khiến tôi nhớ' },
  { id: 'K06', label: 'Một khoảnh khắc khiến tôi tự hào về CTIN' },
  { id: 'K07', label: 'Một bài học sau thất bại' },
  { id: 'K08', label: 'Một câu chuyện được thế hệ đi trước kể lại' },
  { id: 'K09', label: 'Một ký ức khác' }
];

/* Tab 03 — Câu hỏi gợi nhớ theo dạng ký ức */
export const M2_PROMPTS = {
  K01: [
    'Khó khăn lớn nhất khi đó là gì?',
    'Ai đã cùng bạn vượt qua?',
    'Khoảnh khắc nào khiến bạn nhớ nhất?'
  ],
  K02: [
    'Bạn đang thực hiện công việc hoặc dự án nào?',
    'Ai đã cùng bạn có mặt?',
    'Điều gì khiến công việc đó trở nên đáng nhớ?'
  ],
  K03: [
    'Trước thay đổi đó, công việc có vấn đề gì?',
    'Ai đã đề xuất hoặc cùng thực hiện?',
    'Thay đổi nhỏ ấy đã tạo ra kết quả gì?'
  ],
  K04: [
    'Khách hàng khi đó cần điều gì?',
    'Bạn và đồng đội đã phản ứng như thế nào?',
    'Điều gì trong khoảnh khắc ấy khiến bạn nhớ?'
  ],
  K05: [
    'Người hoặc tập thể đó đã làm điều gì?',
    'Bạn đã cảm thấy thế nào?',
    'Điều gì từ họ vẫn còn ảnh hưởng đến bạn?'
  ],
  K06: [
    'Điều gì đã xảy ra?',
    'Ai đã cùng bạn có mặt?',
    'Vì sao khoảnh khắc ấy khiến bạn tự hào về CTIN?'
  ],
  K07: [
    'Điều gì đã không diễn ra như mong đợi?',
    'Bạn và đồng đội đã xử lý thế nào?',
    'Bài học nào vẫn còn giá trị đến hôm nay?'
  ],
  K08: [
    'Ai đã kể lại câu chuyện?',
    'Câu chuyện diễn ra trong hoàn cảnh nào?',
    'Chi tiết nào khiến bạn muốn lưu giữ câu chuyện này?'
  ],
  K09: [
    'Câu chuyện diễn ra trong hoàn cảnh nào?',
    'Những ai có mặt?',
    'Điều gì khiến ký ức này có ý nghĩa với bạn?'
  ],
  _default: [
    'Điều gì đã xảy ra?',
    'Những ai có mặt?',
    'Điều gì khiến bạn nhớ nhất?'
  ]
};

/* Tab 05 — Mối liên hệ người xác nhận */
export const M2_VERIFIER_RELATIONS = [
  { id: 'VR01', label: 'Cùng trực tiếp tham gia' },
  { id: 'VR02', label: 'Chứng kiến sự việc' },
  { id: 'VR03', label: 'Là người kể lại câu chuyện' },
  { id: 'VR04', label: 'Có liên quan theo cách khác' }
];

/* Tab 05 — Quyền sử dụng */
export const M2_PERMISSIONS = [
  { id: 'U01', label: 'Có thể sử dụng trong truyền thông nội bộ' },
  { id: 'U02', label: 'Cần hỏi lại người liên quan' },
  { id: 'U03', label: 'Chỉ dùng để Ban Tổ chức xác minh' },
  { id: 'U04', label: 'Chưa rõ quyền sử dụng' }
];

/* Tab 06 — Giá trị / tinh thần */
export const M2_VALUES = [
  { id: 'V01', label: 'Khách hàng' },
  { id: 'V02', label: 'Khát vọng' },
  { id: 'V03', label: 'Đổi mới' },
  { id: 'V04', label: 'Học hỏi' },
  { id: 'V05', label: 'Hợp tác' },
  { id: 'V06', label: 'Tự chủ và trách nhiệm' },
  { id: 'V07', label: 'Một giá trị khác' }
];

/* Hành lang ký ức — 22 vị trí (placeholder, chờ BTC khóa ảnh thật) */
export const M2_ARCHIVE_PHOTOS = [
  { id: 'A01', period: 'P01', title: 'Những năm đầu thành lập', caption: 'Chờ xác minh', status: 'pending' },
  { id: 'A02', period: 'P01', title: 'Công việc thời kỳ đầu', caption: 'Chờ xác minh', status: 'pending' },
  { id: 'A03', period: 'P01', title: 'Đồng đội thế hệ đầu', caption: 'Chờ xác minh', status: 'pending' },
  { id: 'A04', period: 'P02', title: 'Mở rộng hoạt động 1985–2000', caption: 'Chờ xác minh', status: 'pending' },
  { id: 'A05', period: 'P02', title: 'Dự án đáng nhớ', caption: 'Chờ xác minh', status: 'pending' },
  { id: 'A06', period: 'P02', title: 'Không gian làm việc cũ', caption: 'Chờ xác minh', status: 'pending' },
  { id: 'A07', period: 'P02', title: 'Sự kiện nội bộ', caption: 'Chờ xác minh', status: 'pending' },
  { id: 'A08', period: 'P03', title: 'Giai đoạn 2001–2006', caption: 'Chờ xác minh', status: 'pending' },
  { id: 'A09', period: 'P03', title: 'Đội ngũ & khách hàng', caption: 'Chờ xác minh', status: 'pending' },
  { id: 'A10', period: 'P03', title: 'Cột mốc tổ chức', caption: 'Chờ xác minh', status: 'pending' },
  { id: 'A11', period: 'P04', title: '2007–2019 · Phát triển', caption: 'Chờ xác minh', status: 'pending' },
  { id: 'A12', period: 'P04', title: 'Dự án lớn', caption: 'Chờ xác minh', status: 'pending' },
  { id: 'A13', period: 'P04', title: 'Đội ngũ chuyên môn', caption: 'Chờ xác minh', status: 'pending' },
  { id: 'A14', period: 'P04', title: 'Không gian làm việc', caption: 'Chờ xác minh', status: 'pending' },
  { id: 'A15', period: 'P04', title: 'Sự kiện CTIN', caption: 'Chờ xác minh', status: 'pending' },
  { id: 'A16', period: 'P05', title: '2020–nay · Chuyển mình', caption: 'Chờ xác minh', status: 'pending' },
  { id: 'A17', period: 'P05', title: 'Làm việc linh hoạt', caption: 'Chờ xác minh', status: 'pending' },
  { id: 'A18', period: 'P05', title: 'Đội ngũ hiện tại', caption: 'Chờ xác minh', status: 'pending' },
  { id: 'A19', period: 'P05', title: 'Khách hàng & đối tác', caption: 'Chờ xác minh', status: 'pending' },
  { id: 'A20', period: 'P05', title: 'Văn hóa tổ chức', caption: 'Chờ xác minh', status: 'pending' },
  { id: 'A21', period: 'P05', title: 'Cột mốc gần đây', caption: 'Chờ xác minh', status: 'pending' },
  { id: 'A22', period: 'P05', title: 'Ký ức tập thể', caption: 'Chờ xác minh', status: 'pending' }
];

export function m2Label(list, id) {
  const item = (list || []).find(x => x.id === id);
  return item ? item.label : '';
}

export function m2PromptsForKind(kindId) {
  return M2_PROMPTS[kindId] || M2_PROMPTS._default;
}

export function m2PhotosForPeriod(periodId) {
  if (!periodId || periodId === 'P06') {
    return M2_ARCHIVE_PHOTOS.slice(0, 8);
  }
  return M2_ARCHIVE_PHOTOS.filter(p => p.period === periodId);
}
