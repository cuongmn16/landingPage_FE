/* ============================================================
   MISSION 1 — DATA
   ============================================================ */

export const M1_CONFIG = {
  id: 'mission-01',
  slug: 'journey-map',
  title: 'JOURNEY MAP',
  subtitle: 'Giải mã hành trình CTIN',
  statusMode: 'open',
  openAt: '2026-10-05T08:00:00+07:00',
  dueAt:  '2026-10-11T23:59:59+07:00',
  weight: 15,
  submissionUrl: '#',
  templateUrl: { journeyMap: '#', explanation: '#' },
  goal: 'Từ các thẻ manh mối do BTC cung cấp và tư liệu đội tự tìm kiếm, tái dựng hành trình phát triển của CTIN; xác định các chặng, bước ngoặt, sự thay đổi sau mỗi bước ngoặt và sợi chỉ đỏ xuyên suốt hành trình.',
  tasks: [
    'Nhận diện và sắp xếp các manh mối theo thời gian.',
    'Lựa chọn tối đa 10 dấu mốc quan trọng.',
    'Chia hành trình thành 4 đến 5 chặng và đặt tên cho từng chặng.',
    'Xác định bước ngoặt quan trọng nhất của mỗi chặng.',
    'Giải thích CTIN đã thay đổi như thế nào sau mỗi bước ngoặt.',
    'Hoàn thành thông điệp về sợi chỉ đỏ xuyên suốt hành trình.'
  ],
  outputs: [
    { code: '01', name: 'Journey Map',
      requirement: '4–5 chặng; tối đa 10 dấu mốc; bước ngoặt mỗi chặng; thay đổi sau bước ngoặt; thẻ B/C/D/E đã sử dụng; sợi chỉ đỏ.',
      format: 'PDF · Khổ ngang A3 hoặc tỷ lệ 16:9 · Tối đa 3 trang', templateUrl: '#' },
    { code: '02', name: 'Bản thuyết minh và nguồn',
      requirement: 'Lý do chia chặng và đặt tên; bảng ghép thẻ; giải thích lựa chọn mốc; nguồn tư liệu; nội dung nào là ký ức hoặc lời kể.',
      format: 'PDF hoặc DOCX · Tối đa 5 trang', templateUrl: '#' }
  ]
};

export const M1_GROUPS = [
  { id: 'B', name: 'Time Fragments',  short: 'Time Fragments', count: 6, color: '#0E6CB0', colorSoft: '#F0A422', icon: '🕰️', desc: 'Mốc thời gian neo hành trình' },
  { id: 'C', name: 'Turning Points',  short: 'Turning Points', count: 8, color: '#0A4E82', colorSoft: '#C97E10', icon: '⚡', desc: 'Các bước ngoặt cần giải mã' },
  { id: 'D', name: 'Visual Evidence', short: 'Visual Evidence', count: 8, color: '#3FB6B2', colorSoft: '#F5BA55', icon: '📸', desc: 'Bằng chứng hình ảnh' },
  { id: 'E', name: 'Voices',          short: 'Voices',          count: 2, color: '#4A3F6B', colorSoft: '#E3C77A', icon: '🎙️', desc: 'Tiếng nói nhân chứng' }
];

export const M1_CARDS = [
  // ===== GROUP B — TIME FRAGMENTS (6) =====
  { id: 'T01', group: 'B', teaser: '13.01.1972',
    clue: 'Ngày 13/01/1972 — một dấu mốc khởi nguồn cho hành trình kéo dài hơn nửa thế kỷ.',
    coverImage: '/assets/submissions/mission-1/cards/b/T01-cover.png',
    openImage:  '/assets/submissions/mission-1/cards/b/T01-open.png',
    alt: 'Thẻ T01 — mốc 13/01/1972' },
  { id: 'T02', group: 'B', teaser: '09.10.1985',
    clue: 'Ngày 09/10/1985 — một cột mốc về đổi tên và mở rộng chức năng.',
    coverImage: '/assets/submissions/mission-1/cards/b/T02-cover.png',
    openImage:  '/assets/submissions/mission-1/cards/b/T02-open.png',
    alt: 'Thẻ T02 — mốc 09/10/1985' },
  { id: 'T03', group: 'B', teaser: 'Năm 2000',
    clue: 'Năm 2000 — dấu mốc đặt nền móng cho lĩnh vực công nghệ thông tin.',
    coverImage: '/assets/submissions/mission-1/cards/b/T03-cover.png',
    openImage:  '/assets/submissions/mission-1/cards/b/T03-open.png',
    alt: 'Thẻ T03 — mốc năm 2000' },
  { id: 'T04', group: 'B', teaser: '20.11.2001',
    clue: 'Ngày 20/11/2001 — bước ngoặt cổ phần hóa.',
    coverImage: '/assets/submissions/mission-1/cards/b/T04-cover.png',
    openImage:  '/assets/submissions/mission-1/cards/b/T04-open.png',
    alt: 'Thẻ T04 — mốc 20/11/2001' },
  { id: 'T05', group: 'B', teaser: 'Năm 2009',
    clue: 'Năm 2009 — dấu mốc gắn với dự án và sản phẩm công nghệ.',
    coverImage: '/assets/submissions/mission-1/cards/b/T05-cover.png',
    openImage:  '/assets/submissions/mission-1/cards/b/T05-open.png',
    alt: 'Thẻ T05 — mốc năm 2009' },
  { id: 'T06', group: 'B', teaser: '15.01.2020',
    clue: 'Ngày 15/01/2020 — sự kiện niêm yết cổ phiếu ICT.',
    coverImage: '/assets/submissions/mission-1/cards/b/T06-cover.png',
    openImage:  '/assets/submissions/mission-1/cards/b/T06-open.png',
    alt: 'Thẻ T06 — mốc 15/01/2020' },

  // ===== GROUP C — TURNING POINTS (8) =====
  { id: 'TP01', group: 'C', teaser: 'Ra đời giữa thời chiến',
    clue: 'Một đơn vị kỹ thuật được thành lập trong bối cảnh đất nước còn chiến tranh, với nhiệm vụ sửa chữa thiết bị thông tin và bảo đảm hoạt động của mạng lưới.',
    coverImage: '/assets/submissions/mission-1/cards/c/TP01-cover.png',
    openImage:  '/assets/submissions/mission-1/cards/c/TP01-open.png',
    alt: 'Thẻ TP01 — bước ngoặt hình thành đơn vị kỹ thuật' },
  { id: 'TP02', group: 'C', teaser: 'Từ sửa chữa đến sản xuất',
    clue: 'Đơn vị không còn chỉ sửa chữa thiết bị mà từng bước mở rộng sang sản xuất và phát triển khoa học kỹ thuật viễn thông.',
    coverImage: '/assets/submissions/mission-1/cards/c/TP02-cover.png',
    openImage:  '/assets/submissions/mission-1/cards/c/TP02-open.png',
    alt: 'Thẻ TP02 — chuyển từ sửa chữa sang sản xuất' },
  { id: 'TP03', group: 'C', teaser: 'Cánh cửa CNTT',
    clue: 'Một đơn vị mới được thành lập, đặt nền móng cho lĩnh vực tích hợp hệ thống, phần mềm và công nghệ thông tin.',
    coverImage: '/assets/submissions/mission-1/cards/c/TP03-cover.png',
    openImage:  '/assets/submissions/mission-1/cards/c/TP03-open.png',
    alt: 'Thẻ TP03 — cánh cửa CNTT' },
  { id: 'TP04', group: 'C', teaser: 'Vốn 10 tỷ, VNPT 35%',
    clue: 'Vốn điều lệ khi chuyển đổi là 10 tỷ đồng, trong đó tỷ lệ vốn của VNPT chiếm 35%.',
    coverImage: '/assets/submissions/mission-1/cards/c/TP04-cover.png',
    openImage:  '/assets/submissions/mission-1/cards/c/TP04-open.png',
    alt: 'Thẻ TP04 — tự chủ và tìm con đường riêng' },
  { id: 'TP05', group: 'C', teaser: 'Công nghệ mở đường',
    clue: 'CTIN từng bước trở thành đối tác triển khai công nghệ cao của các hãng quốc tế và tham gia các dự án hạ tầng mạng quy mô lớn.',
    coverImage: '/assets/submissions/mission-1/cards/c/TP05-cover.png',
    openImage:  '/assets/submissions/mission-1/cards/c/TP05-open.png',
    alt: 'Thẻ TP05 — công nghệ mở đường' },
  { id: 'TP06', group: 'C', teaser: 'Từ triển khai đến làm chủ',
    clue: 'CTIN vừa triển khai hệ thống mạng quy mô lớn, vừa có sản phẩm công nghệ được ghi nhận tại các giải thưởng quốc gia.',
    coverImage: '/assets/submissions/mission-1/cards/c/TP06-cover.png',
    openImage:  '/assets/submissions/mission-1/cards/c/TP06-open.png',
    alt: 'Thẻ TP06 — từ triển khai đến làm chủ' },
  { id: 'TP07', group: 'C', teaser: 'Chuyển giao thế hệ',
    clue: 'Một thế hệ lãnh đạo mới tiếp nhận trách nhiệm trong bối cảnh thị trường và công nghệ thay đổi nhanh chóng.',
    coverImage: '/assets/submissions/mission-1/cards/c/TP07-cover.png',
    openImage:  '/assets/submissions/mission-1/cards/c/TP07-open.png',
    alt: 'Thẻ TP07 — chuyển giao thế hệ' },
  { id: 'TP08', group: 'C', teaser: 'HOSE 2020',
    clue: 'Hơn 32 triệu cổ phiếu mang mã ICT chính thức được giao dịch trên HOSE.',
    coverImage: '/assets/submissions/mission-1/cards/c/TP08-cover.png',
    openImage:  '/assets/submissions/mission-1/cards/c/TP08-open.png',
    alt: 'Thẻ TP08 — vị thế mới trên sàn HOSE' },

  // ===== GROUP D — VISUAL EVIDENCE (8) =====
  { id: 'V01', group: 'D', teaser: 'Cặp logo CT-IN / CTIN',
    clue: 'Cặp logo CT-IN cũ và CTIN hiện nay.',
    coverImage: '/assets/submissions/mission-1/cards/d/V01-cover.png',
    openImage:  '/assets/submissions/mission-1/cards/d/V01-open.png',
    alt: 'Thẻ V01 — cặp logo CT-IN và CTIN' },
  { id: 'V02', group: 'D', teaser: 'Quyết định cổ phần hóa',
    clue: 'Quyết định cổ phần hóa.',
    coverImage: '/assets/submissions/mission-1/cards/d/V02-cover.png',
    openImage:  '/assets/submissions/mission-1/cards/d/V02-open.png',
    alt: 'Thẻ V02 — quyết định cổ phần hóa' },
  { id: 'V03', group: 'D', teaser: 'Hợp tác công nghệ quốc tế',
    clue: 'Hợp tác công nghệ quốc tế.',
    coverImage: '/assets/submissions/mission-1/cards/d/V03-cover.png',
    openImage:  '/assets/submissions/mission-1/cards/d/V03-open.png',
    alt: 'Thẻ V03 — hợp tác công nghệ quốc tế' },
  { id: 'V04', group: 'D', teaser: 'Hợp đồng MAN-E',
    clue: 'Ký hợp đồng / dự án MAN-E.',
    coverImage: '/assets/submissions/mission-1/cards/d/V04-cover.png',
    openImage:  '/assets/submissions/mission-1/cards/d/V04-open.png',
    alt: 'Thẻ V04 — hợp đồng MAN-E' },
  { id: 'V05', group: 'D', teaser: 'Nhân tài Đất Việt / Sao Khuê',
    clue: 'Giải thưởng Nhân tài Đất Việt hoặc Sao Khuê.',
    coverImage: '/assets/submissions/mission-1/cards/d/V05-cover.png',
    openImage:  '/assets/submissions/mission-1/cards/d/V05-open.png',
    alt: 'Thẻ V05 — giải thưởng Nhân tài Đất Việt / Sao Khuê' },
  { id: 'V06', group: 'D', teaser: 'Cisco Partner Award',
    clue: 'Cisco Partner Award.',
    coverImage: '/assets/submissions/mission-1/cards/d/V06-cover.png',
    openImage:  '/assets/submissions/mission-1/cards/d/V06-open.png',
    alt: 'Thẻ V06 — Cisco Partner Award' },
  { id: 'V07', group: 'D', teaser: 'Chuyển giao TGĐ',
    clue: 'Chuyển giao Tổng Giám đốc.',
    coverImage: '/assets/submissions/mission-1/cards/d/V07-cover.png',
    openImage:  '/assets/submissions/mission-1/cards/d/V07-open.png',
    alt: 'Thẻ V07 — chuyển giao Tổng Giám đốc' },
  { id: 'V08', group: 'D', teaser: 'CTIN hôm nay',
    clue: 'CTIN hôm nay.',
    coverImage: '/assets/submissions/mission-1/cards/d/V08-cover.png',
    openImage:  '/assets/submissions/mission-1/cards/d/V08-open.png',
    alt: 'Thẻ V08 — CTIN hôm nay' },

  // ===== GROUP E — VOICES (2) =====
  { id: 'VC01', group: 'E', teaser: 'Thời kỳ đầu',
    clue: 'Trích lời về thời kỳ đầu — giai đoạn đặt nền móng giá trị.',
    coverImage: '/assets/submissions/mission-1/cards/e/VC01-cover.png',
    openImage:  '/assets/submissions/mission-1/cards/e/VC01-open.png',
    alt: 'Thẻ VC01 — giọng nói thời kỳ đầu' },
  { id: 'VC02', group: 'E', teaser: 'Cổ phần hóa',
    clue: 'Trích lời về cổ phần hóa — bước ngoặt giúp CTIN tự chủ.',
    coverImage: '/assets/submissions/mission-1/cards/e/VC02-cover.png',
    openImage:  '/assets/submissions/mission-1/cards/e/VC02-open.png',
    alt: 'Thẻ VC02 — giọng nói về cổ phần hóa' }
];

/* Định dạng ngày giờ của Mission 1: "hh:mm · dd/mm/yyyy" */
export function m1FmtDateTime(iso) {
  const dt = new Date(iso);
  if (isNaN(dt)) return '—';
  const dd = String(dt.getDate()).padStart(2, '0');
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const yy = dt.getFullYear();
  const hh = String(dt.getHours()).padStart(2, '0');
  const mi = String(dt.getMinutes()).padStart(2, '0');
  return `${hh}:${mi} · ${dd}/${mm}/${yy}`;
}
