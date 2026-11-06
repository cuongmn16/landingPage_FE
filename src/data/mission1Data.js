/* ============================================================
   MISSION 1 — JOURNEY MAP
   Data theo Tài liệu bàn giao kỹ thuật V2 (bản khóa logic)
   ============================================================ */

export const M1_CONFIG = {
  id: 1,
  slug: 'journey-map',
  title: 'NHIỆM VỤ 01 – BẢN ĐỒ HÀNH TRÌNH',
  subtitle: 'Giải mã hành trình phát triển CTIN',
  weight: 15,
  points: 1, // điểm nhận được khi hoàn thành Mission 01 (BTC duyệt hợp lệ)
  statusMode: 'open',
  openAt: '2026-10-16T08:00:00+07:00',
  dueAt:  '2026-11-19T23:59:59+07:00'
};

/* ---------- TAB LABELS ---------- */
export const M1_TABS = [
  { id: 1, code: '01', name: 'Bắt đầu' },
  { id: 2, code: '02', name: 'Dòng thời gian' },
  { id: 3, code: '03', name: 'Các giai đoạn' },
  { id: 4, code: '04', name: 'Sự chuyển mình' },
  { id: 5, code: '05', name: 'Điều làm nên CTIN' },
  { id: 6, code: '06', name: 'Hoàn tất' }
];

/* ---------- TAB 01 — BẮT ĐẦU ---------- */
export const M1_INTRO = {
  label: 'MISSION 01 · DISCOVERING THE LEGACY OF CTIN',
  title: 'JOURNEY MAP – GIẢI MÃ HÀNH TRÌNH CTIN',
  description: 'Khám phá các dấu mốc, xác định những giai đoạn phát triển và giải mã sự chuyển mình của CTIN trong suốt hành trình.',
  result: 'Hoàn thành bản đồ hành trình gồm các mốc thời gian, các giai đoạn phát triển, bước ngoặt, sự chuyển mình, vật chứng và xác định tinh thần xuyên suốt đã kết nối, thúc đẩy CTIN phát triển qua các giai đoạn.',
  requirementTitle: 'Yêu cầu thực hiện',
  requirementText: 'Đọc kỹ dữ kiện, lựa chọn phương án phù hợp và hoàn thành phần chia sẻ cá nhân. Kết quả hợp lệ sẽ được ghi nhận vào thành tích chung của đơn vị.',
  confirmLabel: 'Tôi đã hiểu cách chơi và sẵn sàng bắt đầu.'
};

/* ---------- TAB 02 — DÒNG THỜI GIAN ---------- */
export const M1_TIMELINE = [
  {
    id: 'T01', year: 1972,
    meaningId: 'M01',
    meaning: 'Khởi nguồn từ nhiệm vụ phục vụ đất nước, đặt nền móng đầu tiên về con người, năng lực kỹ thuật và tinh thần trách nhiệm của CTIN.',
    unlock: {
      title: 'Thành lập Xí nghiệp Sửa chữa Thiết bị Thông tin I (13/01/1972)',
      text: 'Ngày 13/01/1972, Xí nghiệp Sửa chữa Thiết bị Thông tin I được thành lập theo Quyết định số 33/QĐ, mang trọng trách sửa chữa thiết bị thông tin phục vụ chiến trường. Từ đây, đội ngũ kỹ thuật chuyên trách và kỷ luật nghề nghiệp từng bước được hình thành.',
      evidence: 'D01'
    }
  },
  {
    id: 'T02', year: 1985,
    meaningId: 'M02',
    meaning: 'Đánh dấu sự thay đổi về tên gọi và định hướng hoạt động, trong khi sửa chữa, bảo dưỡng vẫn là công việc chủ yếu để đơn vị duy trì hoạt động và lực lượng kỹ thuật.',
    unlock: {
      title: 'Đổi tên thành Xí nghiệp Khoa học Sản xuất Thiết bị Thông tin I (09/10/1985)',
      text: 'Ngày 09/10/1985, đơn vị đổi tên thành Xí nghiệp Khoa học Sản xuất Thiết bị Thông tin I. Tuy nhiên, từ năm sau chiến tranh đến đầu những năm 1990, hoạt động thực tế vẫn chủ yếu là sửa chữa, bảo dưỡng thiết bị truyền dẫn tải ba và một số thiết bị dân dụng như amplifier, bộ nắn điện. Đây là giai đoạn đơn vị nỗ lực duy trì hoạt động và bảo toàn đội ngũ kỹ thuật.',
      evidence: null
    }
  },
  {
    id: 'T03', year: 1992,
    meaningId: 'M03',
    meaning: 'Mở đầu quá trình chuyển từ sửa chữa, bảo dưỡng sang tham gia triển khai các hệ thống viễn thông mới và cung cấp dịch vụ kỹ thuật.',
    unlock: {
      title: 'Tham gia số hóa mạng lưới Bưu điện & hợp tác quốc tế',
      text: 'Từ năm 1992, CTIN bắt đầu tham gia quá trình số hóa mạng lưới Bưu điện thông qua việc phối hợp với Italtel triển khai các hệ thống tổng đài điện tử số. Một dấu mốc tiêu biểu là Tổng đài Linea UT tại Đồng Nai do CTIN và Italtel phối hợp lắp đặt, hòa mạng năm 1993. Sau đó, CTIN tiếp tục mở rộng sang viba số, truyền dẫn quang và mạng thông tin di động, từng bước hình thành năng lực tích hợp hạ tầng viễn thông.',
      evidence: 'D06'
    }
  },
  {
    id: 'T04', year: 2000,
    meaningId: 'M04',
    meaning: 'Mở thêm hướng phát triển về tin học, phần mềm và tích hợp hệ thống tin học bên cạnh nền tảng viễn thông đã tích lũy.',
    unlock: {
      title: 'Thành lập Trung tâm Tin học',
      text: 'Thành lập Trung tâm Tin học, tạo tiền đề cho phát triển mảng Tích hợp hệ thống và phần mềm, nhằm hướng tới mảng kinh doanh trong lĩnh vực tin học và CNTT.',
      evidence: 'D08'
    }
  },
  {
    id: 'T05', year: 2001,
    meaningId: 'M05',
    meaning: 'Thay đổi mô hình sở hữu mở rộng quyền tự chủ đồng thời gắn trách nhiệm rõ hơn với kết quả hoạt động.',
    unlock: {
      title: 'Chuyển từ doanh nghiệp nhà nước sang công ty cổ phần',
      text: 'Năm 2001, CTIN thực hiện chuyển đổi từ doanh nghiệp nhà nước sang công ty cổ phần. Mô hình mới tạo điều kiện để Công ty chủ động hơn trong lựa chọn thị trường và con đường phát triển.',
      evidence: 'D02'
    }
  },
  {
    id: 'T06', year: 2007,
    meaningId: 'M06',
    meaning: 'Từ việc chủ yếu tham gia từng phần công việc, CTIN tiến tới trực tiếp đảm nhận và tích hợp trọn gói một dự án công nghệ có quy mô lớn, yêu cầu phức tạp.',
    unlock: {
      title: 'Nhà tích hợp hệ thống trọn gói cho dự án mạng truyền số liệu quy mô lớn',
      text: 'CTIN trực tiếp đảm nhận dự án cung cấp, lắp đặt hệ thống mạng truyền số liệu, nguồn điện và các hạng mục liên quan cho các cơ quan Đảng và Nhà nước, với khách hàng là Cục Bưu điện Trung ương – CPT. Hợp đồng trị giá 7,4 triệu USD, tương đương hơn 100 tỷ đồng – một dự án có quy mô đặc biệt lớn đối với CTIN tại thời điểm đó. Từ việc chủ yếu cung cấp thiết bị hoặc tham gia thực hiện từng phần công việc, CTIN đã tiến tới chịu trách nhiệm cung cấp, lắp đặt, tích hợp và bàn giao một hệ thống công nghệ hoàn chỉnh. Dự án đánh dấu bước trưởng thành quan trọng, khẳng định CTIN đã trở thành một nhà tích hợp hệ thống trọn gói, đủ năng lực đảm nhận những dự án công nghệ có quy mô lớn và yêu cầu phức tạp.',
      evidence: null
    }
  },
  {
    id: 'T07', year: 2009,
    meaningId: 'M07',
    meaning: 'Chuyển hóa năng lực tích hợp hệ thống và khả năng đảm nhận trọn gói các dự án lớn thành tăng trưởng về doanh thu, quy mô và vị thế trên thị trường',
    unlock: {
      title: 'Thắng thầu dự án MAN-Ethernet & vượt mốc doanh thu 1.000 tỷ đồng',
      text: 'CTIN thắng thầu dự án thiết kế, cung cấp và lắp đặt mạng MAN-Ethernet cho 10 viễn thông tỉnh, thành phố thuộc VNPT. Doanh thu vượt 1.000 tỷ đồng, đạt hơn 1.300 tỷ đồng. Trong năm tài chính 2009, CTIN đồng thời nhận nhiều giải thưởng của Cisco về tích hợp hệ thống, cung cấp dịch vụ và mức độ hài lòng của khách hàng.',
      evidence: null
    }
  },
  {
    id: 'T08', year: 2011,
    meaningId: 'M08',
    meaning: 'Mốc 10 năm cổ phần hóa, khẳng định tính đúng đắn của lựa chọn tự chủ, mở rộng hợp tác và xây dựng năng lực, uy tín của CTIN trên thị trường.',
    unlock: {
      title: '10 năm cổ phần hóa & sự ghi nhận từ các đối tác công nghệ quốc tế',
      text: 'CTIN đạt doanh thu 1.050 tỷ đồng, tăng 12,47 lần so với năm đầu cổ phần hóa. Năng lực triển khai và chất lượng dịch vụ của Công ty được các đối tác công nghệ quốc tế ghi nhận: IBM trao danh hiệu “Đối tác triển khai giải pháp viễn thông xuất sắc nhất năm 2011”; Cisco trao ba giải thưởng về thị trường nhà cung cấp dịch vụ, cung cấp dịch vụ cao cấp và mức độ hài lòng của khách hàng. Những kết quả này cho thấy lựa chọn cổ phần hóa, mở rộng hợp tác quốc tế và kiên trì phát triển năng lực công nghệ đã tạo ra sự trưởng thành rõ rệt về quy mô và vị thế của CTIN.',
      evidence: null
    }
  },
  {
    id: 'T09', year: 2018,
    meaningId: 'M09',
    meaning: 'Mở đầu quá trình chuyển giao thế hệ lãnh đạo và chuẩn bị năng lực cho một chu kỳ phát triển mới.',
    unlock: {
      title: 'Chuyển giao thế hệ lãnh đạo & thành lập Trung tâm Nghiên cứu Phát triển (R&D)',
      text: 'Năm 2018, ông Hà Thanh Hải được bổ nhiệm giữ chức vụ Tổng Giám đốc, đánh dấu sự chuyển giao thế hệ lãnh đạo. Cùng thời điểm, mốc doanh thu trên 3.000 tỷ đồng đạt được năm 2017 đã trở thành một ngưỡng tăng trưởng khó vượt qua khi thị trường viễn thông dần bão hòa. CTIN thành lập Trung tâm Nghiên cứu Phát triển nhằm chủ động nghiên cứu giải pháp, mở rộng thị trường và chuẩn bị những động lực tăng trưởng mới.',
      evidence: null
    }
  },
  {
    id: 'T10', year: 2020,
    meaningId: 'M10',
    meaning: 'Nâng cao vị thế và yêu cầu quản trị trên thị trường vốn, đồng thời hiện thực hóa một hướng dịch vụ mới bên cạnh hoạt động tích hợp hệ thống.',
    unlock: {
      title: 'Niêm yết cổ phiếu ICT trên HOSE & vận hành dịch vụ xổ số Vietlott',
      text: 'Ngày 15/01/2020, cổ phiếu ICT chính thức chuyển niêm yết lên HOSE, đánh dấu bước phát triển mới về vị thế của CTIN trên thị trường vốn, đồng thời đặt ra yêu cầu cao hơn về quản trị doanh nghiệp, minh bạch thông tin và trách nhiệm với cổ đông. Cũng trong năm 2020, CTIN chính thức trở thành đơn vị phát triển và vận hành dịch vụ xổ số Vietlott, đưa một hướng dịch vụ mới vào hoạt động thực tế. Công ty đồng thời tiếp tục củng cố hệ thống quản trị và tổ chức để chuẩn bị cho một chu kỳ phát triển mới.',
      evidence: null
    }
  }
];

/* Danh sách ý nghĩa (dùng cho dropdown, sẽ xáo trộn) */
export const M1_MEANINGS = M1_TIMELINE.map(t => ({
  id: t.meaningId,
  text: t.meaning
}));

/* ---------- TAB 03 — CÁC GIAI ĐOẠN ---------- */
export const M1_STAGES = [
  {
    id: 'S01',
    start: 1972, end: 1984,
    nameId: 'SN01', name: 'SỨ MỆNH LỊCH SỬ',
    eventId: 'SE01', event: 'Thành lập Xí nghiệp Sửa chữa Thiết bị Thông tin I'
  },
  {
    id: 'S02',
    start: 1985, end: 2000,
    nameId: 'SN02', name: 'NỖ LỰC TỒN TẠI VÀ TÍCH LŨY ĐỂ ĐI LÊN',
    eventId: 'SE02', event: 'Chuyển thành Xí nghiệp Khoa học Sản xuất Thiết bị Thông tin I'
  },
  {
    id: 'S03',
    start: 2001, end: 2006,
    nameId: 'SN03', name: 'TỰ LẬP VÀ VƯƠN LÊN KHẲNG ĐỊNH CHÍNH MÌNH',
    eventId: 'SE03', event: 'Chuyển từ doanh nghiệp nhà nước sang công ty cổ phần'
  },
  {
    id: 'S04',
    start: 2007, end: 2017,
    nameId: 'SN04', name: 'KHẲNG ĐỊNH CHÍNH MÌNH VÀ BỨT PHÁ QUY MÔ',
    eventId: 'SE04', event: 'Trực tiếp đảm nhận và tích hợp trọn gói dự án mạng truyền số liệu quy mô lớn cho các cơ quan Đảng và Nhà nước.'
  },
  {
    id: 'S05',
    start: 2018, end: 'Nay',
    nameId: 'SN05', name: 'CHUYỂN MÌNH CHO CHẶNG ĐƯỜNG MỚI',
    eventId: 'SE05', event: 'Chuyển giao thế hệ lãnh đạo và Thành lập Trung tâm R&D - nay là Trung tâm Tư vấn giải pháp.'
  }
];

export const M1_YEAR_OPTIONS = [1972, 1984, 1985, 2000, 2001, 2006, 2007, 2009, 2017, 2018, 2020, 'Nay'];

export const M1_STAGE_NAMES = M1_STAGES.map(s => ({ id: s.nameId, text: s.name }));
export const M1_STAGE_EVENTS = M1_STAGES.map(s => ({ id: s.eventId, text: s.event }));

/* ---------- TAB 04 — SỰ CHUYỂN MÌNH ---------- */
export const M1_TRANSFORMS = [
  {
    stageId: 'S01',
    stageName: 'KHỞI NGUỒN TỪ SỨ MỆNH LỊCH SỬ',
    contextId: 'C01',
    context: 'Trong điều kiện chiến tranh, ngành thông tin liên lạc cần một lực lượng kỹ thuật chuyên trách để sửa chữa thiết bị, bảo đảm thông tin phục vụ tiền tuyến và yêu cầu của đất nước.',
    changeId: 'CH01',
    change: 'Từ nhiệm vụ sửa chữa thiết bị thông tin phục vụ đất nước, đơn vị từng bước hình thành đội ngũ kỹ thuật chuyên trách. Đây là nền móng con người và nghề nghiệp đầu tiên cho hành trình phát triển lâu dài của CTIN.',
    distractors: {
      contexts: [
        'Doanh nghiệp cần mở rộng hoạt động sang nghiên cứu phần mềm và tích hợp hệ thống.',
        'Công ty đứng trước yêu cầu chuyển đổi từ doanh nghiệp nhà nước sang công ty cổ phần.'
      ],
      changes: [
        'CTIN hình thành như một đơn vị kinh doanh thiết bị viễn thông theo nhu cầu thị trường; trọng tâm ban đầu là mở rộng doanh thu, mạng lưới khách hàng và xây dựng mô hình quản trị thương mại độc lập.',
        'CTIN hình thành với vai trò nghiên cứu và phát triển các giải pháp công nghệ mới; ngay từ đầu đã tập trung xây dựng năng lực phần mềm, tích hợp hệ thống và triển khai dự án quy mô lớn.'
      ]
    },
    profile: {
      message: 'Hình thành nền móng con người và nghề nghiệp đầu tiên cho hành trình phát triển lâu dài của CTIN.',
      details: [
        'CTIN khởi nguồn từ một nhiệm vụ mang tính phục vụ: sửa chữa thiết bị thông tin, bảo đảm yêu cầu liên lạc của đất nước trong điều kiện khó khăn. Môi trường ấy đã hình thành một lực lượng kỹ thuật chuyên trách, có kỷ luật nghề nghiệp, tinh thần trách nhiệm và khả năng xử lý công việc trong những điều kiện hạn chế. Di sản quan trọng nhất của giai đoạn này không chỉ là kỹ năng sửa chữa thiết bị, mà là nền móng con người: trách nhiệm với nhiệm vụ, sự bền bỉ và tinh thần làm việc nghiêm túc.'
      ]
    }
  },
  {
    stageId: 'S02',
    stageName: 'NỖ LỰC TỒN TẠI VÀ TÍCH LŨY ĐỂ ĐI LÊN',
    contextId: 'C02',
    context: 'Từ năm 1975 sau kháng chiến chống Mỹ đến đầu những năm 1990 hoạt động của đơn vị còn nhiều khó khăn, công việc chủ yếu vẫn là sửa chữa, bảo dưỡng thiết bị truyền dẫn tải ba và một số thiết bị dân dụng như amplifier, bộ nắn điện để duy trì hoạt động và giữ lực lượng kỹ thuật.',
    changeId: 'CH02',
    change: 'Từ một đơn vị chủ yếu hoạt động bằng sửa chữa và bảo dưỡng thiết bị, CTIN từng bước tham gia triển khai tổng đài, viba số, hệ thống truyền dẫn và mạng thông tin di động. Quá trình làm việc với các đối tác công nghệ quốc tế giúp Công ty tích lũy đội ngũ, kinh nghiệm thực tiễn và năng lực dịch vụ kỹ thuật, tạo tiền đề để phát triển năng lực tích hợp hệ thống trong giai đoạn sau.',
    distractors: {
      contexts: [
        'CTIN đã khẳng định đầy đủ vai trò nhà tích hợp hệ thống trên thị trường.',
        'Công ty đã có năng lực R&D độc lập và cần thương mại hóa các giải pháp mới.'
      ],
      changes: [
        'Từ nền tảng sửa chữa, CTIN chuyển trọng tâm sang kinh doanh thiết bị nhập khẩu; quá trình hợp tác quốc tế chủ yếu giúp mở rộng danh mục sản phẩm mà chưa tạo ra thay đổi đáng kể về năng lực kỹ thuật và hướng phát triển.',
        'Từ một đơn vị kỹ thuật, CTIN chuyển trực tiếp sang mô hình công ty cổ phần; quyền tự chủ về vốn và thị trường trở thành động lực chính giúp Công ty nhanh chóng đảm nhận vai trò tổng thầu các dự án quốc gia.'
      ]
    },
    profile: {
      message: 'Kiên trì tồn tại bằng nhiệm vụ sửa chữa thiết bị viễn thông, đồng thời chủ động tìm kiếm cơ hội hợp tác quốc tế để tiếp cận công nghệ mới và vươn lên.',
      details: [
        'Trong những năm khó khăn sau chiến tranh, sửa chữa và bảo dưỡng thiết bị giúp đơn vị duy trì hoạt động. Khi ngành Bưu điện bước vào quá trình số hóa, CTIN đã lựa chọn không dừng lại ở công việc sửa chữa mà chủ động tìm kiếm, nắm bắt cơ hội hợp tác với các hãng công nghệ nước ngoài. Thông qua các dự án với Italtel, SIS, Fujitsu, Siemens, Ericsson và nhiều đối tác khác, đội ngũ CTIN từng bước tiếp cận tổng đài điện tử số, viba số, truyền dẫn quang và mạng thông tin di động GSM. Quá trình vừa làm vừa học tại các công trình giúp CTIN tiếp nhận công nghệ, tích lũy kinh nghiệm và hình thành năng lực tích hợp hạ tầng viễn thông, mạng di động. Việc chủ động tìm kiếm cơ hội, dám tiếp cận công nghệ mới và học hỏi từ các đối tác quốc tế thể hiện khát vọng vươn lên, đồng thời tạo nền tảng để CTIN tiếp tục mở rộng sang tích hợp hệ thống tin học trong giai đoạn sau.'
      ]
    }
  },
  {
    stageId: 'S03',
    stageName: 'TỰ LẬP – VƯƠN LÊN KHẲNG ĐỊNH CHÍNH MÌNH',
    contextId: 'C03',
    context: 'CTIN hoạt động theo mô hình doanh nghiệp nhà nước, quyền chủ động trong kinh doanh và phát triển thị trường còn hạn chế.',
    changeId: 'CH03',
    change: 'Cổ phần hóa giúp CTIN chuyển từ cơ chế phụ thuộc sang tự chủ hơn trong lựa chọn thị trường và chịu trách nhiệm về kết quả. Quyền tự chủ ấy được chuyển hóa thành năng lực công nghệ được quốc tế công nhận và khả năng đảm nhận toàn diện các dự án công nghệ quy mô lớn – từ thiết kế, cung cấp thiết bị đến thi công, lắp đặt và bàn giao hệ thống hoàn chỉnh.',
    distractors: {
      contexts: [
        'CTIN đã đạt doanh thu trên 3.000 tỷ đồng và cần tiếp tục mở rộng quy mô.',
        'CTIN đã chuyển niêm yết lên HOSE và cần củng cố hệ thống quản trị.'
      ],
      changes: [
        'Cổ phần hóa chủ yếu làm thay đổi cơ cấu sở hữu và tư cách pháp lý; hoạt động kinh doanh, năng lực công nghệ và vai trò của CTIN trong các dự án về cơ bản chưa có chuyển biến đáng kể trong giai đoạn này.',
        'Sau cổ phần hóa, CTIN chuyển ngay trọng tâm từ tích hợp hệ thống sang nghiên cứu sản phẩm và Dịch vụ số; mô hình kinh doanh của giai đoạn hiện nay đã được hình thành đầy đủ ngay trong những năm đầu.'
      ]
    },
    profile: {
      message: 'Quyết tâm tự chủ và chứng minh năng lực bằng con đường phát triển riêng.',
      details: [
        'Cổ phần hóa tạo ra một thay đổi căn bản: CTIN có thêm quyền chủ động trong lựa chọn thị trường, công nghệ và cơ hội kinh doanh, nhưng đồng thời phải tự chịu trách nhiệm về hiệu quả hoạt động. Quyền tự chủ thúc đẩy Công ty tìm kiếm đối tác, nâng chuẩn năng lực và chủ động đảm nhận những công việc có phạm vi trách nhiệm lớn hơn. Từ chỗ chủ yếu cung cấp thiết bị hoặc tham gia từng phần công việc, CTIN tiến tới cung cấp, lắp đặt, tích hợp và bàn giao hệ thống công nghệ hoàn chỉnh. Giai đoạn này đánh dấu sự trưởng thành của CTIN từ một đơn vị chủ yếu tham gia từng phần công việc trở thành nhà tích hợp hệ thống toàn diện. Qua đó, CTIN từng bước khẳng định uy tín với các đối tác quốc tế và vị thế trong những dự án công nghệ lớn, phức tạp.'
      ]
    }
  },
  {
    stageId: 'S04',
    stageName: 'BỨT PHÁ QUY MÔ',
    contextId: 'C04',
    context: 'CTIN đã tích lũy năng lực công nghệ và tích hợp nhưng cần chứng minh khả năng thực hiện các dự án lớn, phức tạp.',
    changeId: 'CH04',
    change: 'CTIN bước qua giai đoạn xây dựng nền tảng năng lực để chuyển sang giai đoạn triển khai các dự án ở quy mô lớn. Khả năng làm chủ giải pháp và tích hợp hệ thống trọn gói được chuyển hóa thành sự tăng trưởng về quy mô dự án, doanh thu, lợi nhuận và vị thế thị trường. Đồng thời, bắt đầu tìm kiếm những dịch vụ và động lực tăng trưởng mới, thay vì chỉ dựa vào mô hình kinh doanh đã tạo nên thành công trước đó.',
    distractors: {
      contexts: [
        'CTIN mới bắt đầu hình thành năng lực sửa chữa thiết bị viễn thông chuyên dụng.',
        'Công ty đang chuẩn bị chuyển đổi từ doanh nghiệp nhà nước sang công ty cổ phần.'
      ],
      changes: [
        'CTIN ưu tiên duy trì quy mô và tập trung hoàn thiện năng lực kỹ thuật hiện có; kết quả chủ yếu nằm ở việc ổn định hoạt động tích hợp hệ thống, chưa đặt ra yêu cầu mở rộng thị trường hoặc tìm kiếm hướng kinh doanh mới.',
        'CTIN chuyển trọng tâm tăng trưởng sang tự nghiên cứu sản phẩm công nghệ; R&D và Dịch vụ số trở thành hai nguồn doanh thu chủ lực, thay thế phần lớn hoạt động tổng thầu và tích hợp hệ thống truyền thống.'
      ]
    },
    profile: {
      message: 'Chuyển năng lực công nghệ thành quy mô kinh doanh và vị thế trên thị trường.',
      details: [
        'Những năng lực đã được xây dựng trong giai đoạn trước được triển khai trên phạm vi rộng hơn, qua nhiều dự án và khách hàng hơn. CTIN không còn chỉ chứng minh mình có thể thực hiện một dự án lớn, mà từng bước biến năng lực tích hợp hệ thống thành khả năng tăng trưởng ổn định về dự án, doanh thu, lợi nhuận và uy tín với khách hàng, đối tác. Các kết quả sau 10 năm cổ phần hóa cho thấy lựa chọn tự chủ và mở rộng hợp tác đã tạo ra một doanh nghiệp có quy mô và vị thế mới. Đến khi doanh thu vượt 3.000 tỷ đồng, CTIN đã đạt đỉnh cao của một chu kỳ tăng trưởng; đồng thời, đây cũng là ngưỡng khó vượt qua nếu Công ty chỉ tiếp tục dựa vào thị trường viễn thông và mô hình kinh doanh đã tạo nên thành công trước đó.'
      ]
    }
  },
  {
    stageId: 'S05',
    stageName: 'CHUYỂN MÌNH CHO CHẶNG ĐƯỜNG MỚI',
    contextId: 'C05',
    context: 'Mô hình tăng trưởng đã tạo ra thành công nhưng CTIN đứng trước yêu cầu đổi mới cách tiếp cận thị trường, công nghệ và tổ chức.',
    changeId: 'CH05',
    change: 'CTIN chuyển từ tăng trưởng chủ yếu dựa trên năng lực tích hợp sang mô hình kết hợp Tích hợp hệ thống và Dịch vụ số; Cùng với sự chuyển giao thế hệ lãnh đạo, tăng cường năng lực nghiên cứu, chủ động phát triển giải pháp, củng cố quản trị và tái cấu trúc tổ chức để thích ứng với thị trường, vượt qua những giai đoạn khó khăn và chuẩn bị nền tảng cho chu kỳ phát triển tiếp theo.',
    distractors: {
      contexts: [
        'CTIN chưa hình thành nền tảng kỹ thuật và cần xây dựng một đơn vị sửa chữa chuyên trách.',
        'CTIN chưa có quyền tự chủ và đang chuẩn bị thực hiện quá trình cổ phần hóa.'
      ],
      changes: [
        'CTIN tiếp tục duy trì mô hình tăng trưởng dựa chủ yếu trên các dự án tích hợp truyền thống; thay đổi về lãnh đạo, R&D và quản trị chủ yếu nhằm củng cố cách vận hành cũ, chưa làm xuất hiện một hướng phát triển mới.',
        'CTIN chuyển hoàn toàn khỏi lĩnh vực tích hợp hệ thống để tập trung cho Dịch vụ số; các năng lực kỹ thuật và quan hệ thị trường đã tích lũy trước đó không còn giữ vai trò quan trọng trong mô hình phát triển mới.'
      ]
    },
    profile: {
      message: 'Kế thừa nền tảng đã có, đồng thời chuẩn bị năng lực và mô hình phát triển cho một chặng đường mới.',
      details: [
        'Việc chuyển giao thế hệ lãnh đạo diễn ra khi lãnh đạo tiền nhiệm đến tuổi nghỉ hưu, bảo đảm sự kế thừa trong tổ chức. Cùng thời điểm, thị trường viễn thông dần bão hòa và dư địa tăng trưởng từ mô hình truyền thống thu hẹp, đặt CTIN trước yêu cầu phải chủ động hơn về giải pháp, thị trường và phương thức kinh doanh. Công ty thành lập bộ phận R&D, nâng cao chuẩn quản trị và minh bạch khi chuyển niêm yết lên HOSE, đồng thời đưa một hướng dịch vụ mới vào vận hành thông qua Vietlott. Giai đoạn này không phải là sự rời bỏ năng lực tích hợp hệ thống, mà là quá trình củng cố năng lực cốt lõi, kết hợp với nghiên cứu, dịch vụ mới và đổi mới tổ chức để tìm kiếm động lực cho chu kỳ phát triển tiếp theo.'
      ]
    }
  }
];

/* ---------- TAB 05 — ĐIỀU LÀM NÊN CTIN ---------- */
export const M1_LEGACIES = [
  {
    stageId: 'S01',
    stageLabel: '1972–1984',
    spiritId: 'SP01',
    spirit: 'Tinh thần trách nhiệm, ý thức phục vụ và sự bền bỉ trước nhiệm vụ khó.',
    capacity: 'Hình thành lực lượng kỹ thuật chuyên trách, kỷ luật nghề nghiệp và khả năng hoàn thành nhiệm vụ trong những điều kiện khó khăn, hạn chế.'
  },
  {
    stageId: 'S02',
    stageLabel: '1985–2000',
    spiritId: 'SP02',
    spirit: 'Kiên trì giữ nghề, chủ động học hỏi và tìm kiếm cơ hội hợp tác để tiếp cận công nghệ mới.',
    capacity: 'Từng bước làm chủ việc triển khai các hệ thống viễn thông hiện đại; hình thành năng lực dịch vụ kỹ thuật và tích hợp hạ tầng viễn thông, mạng di động từ thực tiễn công trình.'
  },
  {
    stageId: 'S03',
    stageLabel: '2001–2007',
    spiritId: 'SP03',
    spirit: 'Khát vọng vươn lên bằng chính năng lực của mình; lựa chọn tự chủ, mở rộng hợp tác và tự chịu trách nhiệm về kết quả.',
    capacity: 'Hình thành khả năng chủ động lựa chọn thị trường, công nghệ và giải pháp; trưởng thành từ đơn vị tham gia từng phần công việc thành nhà tích hợp hệ thống toàn diện, có thể đảm nhận và bàn giao hệ thống công nghệ hoàn chỉnh.'
  },
  {
    stageId: 'S04',
    stageLabel: '2008–2017',
    spiritId: 'SP04',
    spirit: 'Khát vọng phát triển ở quy mô lớn hơn, cùng cam kết thực hiện đến cùng và tạo giá trị cho khách hàng.',
    capacity: 'Chuyển hóa năng lực tích hợp hệ thống thành khả năng triển khai đồng thời nhiều dự án lớn, duy trì chất lượng dịch vụ, mở rộng quy mô kinh doanh và xây dựng uy tín với khách hàng, đối tác.'
  },
  {
    stageId: 'S05',
    stageLabel: '2018–nay',
    spiritId: 'SP05',
    spirit: 'Tinh thần kế thừa, đổi mới và chủ động thích ứng trước những thay đổi của thị trường.',
    capacity: 'Tăng cường năng lực nghiên cứu giải pháp, quản trị minh bạch, phát triển dịch vụ mới và chuyển đổi tổ chức, đồng thời tiếp tục củng cố nền tảng tích hợp hệ thống đã được xây dựng.'
  }
];

export const M1_SPIRIT_OPTIONS = M1_LEGACIES.map(l => ({
  id: l.spiritId,
  text: l.spirit + ' → ' + l.capacity
}));

export const M1_RED_THREAD = {
  correctId: 'RT01',
  options: [
    {
      id: 'RT01',
      text: 'Xuyên suốt hành trình CTIN là khát vọng không ngừng vươn lên – khát vọng đã thôi thúc các thế hệ người CTIN học hỏi, làm chủ công nghệ, dám lựa chọn con đường riêng và liên tục chuyển mình để tạo ra giá trị lớn hơn.'
    },
    {
      id: 'RT02',
      text: 'Xuyên suốt hành trình CTIN là tinh thần trách nhiệm với nhiệm vụ và khách hàng – tinh thần đã giúp các thế hệ người CTIN giữ vững kỷ luật kỹ thuật, đáp ứng yêu cầu ngày càng cao và duy trì sự ổn định.'
    },
    {
      id: 'RT03',
      text: 'Xuyên suốt hành trình CTIN là khả năng nắm bắt cơ hội từ thay đổi công nghệ và thị trường – khả năng đã giúp Công ty mở rộng dịch vụ, nâng quy mô dự án và tìm kiếm lĩnh vực mới.'
    }
  ]
};

/* ---------- VẬT CHỨNG ---------- */
export const M1_EVIDENCE = {
  D01: {
    code: 'D01',
    name: 'Quyết định số 33/QĐ ngày 13/01/1972',
    stage: '1972–1984',
    images: ['/assets/submissions/mission-1/evidence/d01-quyet-dinh-thanh-lap-1972.jpg'],
    caption: 'Quyết định thành lập Xí nghiệp Sửa chữa Thiết bị Thông tin I',
    status: 'ready'
  },
  D02: {
    code: 'D02',
    name: 'Quyết định cổ phần hóa',
    stage: '2001–2006',
    images: ['/assets/submissions/mission-1/evidence/d02-quyet-dinh-co-phan-hoa-2001.png'],
    caption: 'Quyết định chuyển đổi sang công ty cổ phần',
    status: 'ready'
  },
  D03: {
    code: 'D03',
    name: 'Đối tác công nghệ cao Cisco',
    stage: '2001–2006',
    images: ['/assets/submissions/mission-1/evidence/d03-doi-tac-cisco-2002.jpg'],
    caption: 'Hợp tác Cisco',
    status: 'ready'
  },
  D05: {
    code: 'D05',
    name: 'Doanh thu vượt 1.000 tỷ',
    stage: '2007–2017',
    images: [],
    caption: '',
    status: 'pending'
  },
  D06: {
    code: 'D06',
    name: 'Hợp tác Italtel và Fujitsu',
    stage: '1985–2000',
    images: [
      '/assets/submissions/mission-1/evidence/d06-italtel-dong-nai-1993.jpg',
      '/assets/submissions/mission-1/evidence/d06-fujitsu-hop-tac-cong-nghe.jpg'
    ],
    caption: 'Hợp tác công nghệ quốc tế',
    status: 'ready'
  },
  D07: {
    code: 'D07',
    name: 'Lãnh đạo, R&D, HOSE hoặc Vietlott',
    stage: '2018–nay',
    images: [],
    caption: '',
    status: 'pending'
  },
  D08: {
    code: 'D08',
    name: 'Hội nghị kế hoạch 1999–2000',
    stage: '1985–2000',
    images: [
      '/assets/submissions/mission-1/evidence/d08-hoi-nghi-ke-hoach-1999-2000-a.jpg',
      '/assets/submissions/mission-1/evidence/d08-hoi-nghi-ke-hoach-1999-2000-b.jpg'
    ],
    caption: 'Hội nghị kế hoạch',
    status: 'ready'
  }
};

/* ---------- FEEDBACK MESSAGES ---------- */
export const M1_FEEDBACK = {
  timeline: {
    correct: 'Chính xác! Tư liệu liên quan đã được mở.',
    wrong: 'Chưa chính xác. Hãy thử lại với ý nghĩa phù hợp hơn.'
  },
  stages: {
    missingYear: 'Hãy chọn đủ năm bắt đầu và năm kết thúc của giai đoạn.',
    wrongRange: 'Khoảng thời gian chưa phù hợp. Trong khoảng bạn chọn có thể có một sự kiện tạo đà cho giai đoạn khác. Hãy xem lại Tab 02.',
    rangeOk: 'Khoảng thời gian phù hợp. Tiếp tục xác định tên và sự kiện tạo đà.',
    wrongNameOrEvent: 'Kết nối chưa hoàn chỉnh. Khoảng thời gian phù hợp nhưng tên hoặc sự kiện cần xem lại.',
    allCorrect: 'Giai đoạn đã được xác định phù hợp.'
  },
  transform: {
    correct: 'Kết nối chính xác! Hồ sơ giai đoạn đã được mở.',
    wrong: 'Kết nối chưa đúng. Hãy xem lại bối cảnh và sự chuyển biến.'
  },
  legacy: {
    correct: 'Đúng rồi!',
    wrong: 'Chưa phù hợp. Hãy chọn lại.'
  },
  reflection: {
    tooShort: 'Vui lòng viết tối thiểu 15 từ.',
    ok: 'Đã ghi nhận.'
  }
};

export const M1_COMPLETE = {
  title: 'Bạn đã hoàn thành Journey Map',
  message: 'Bạn đã hoàn thành Journey Map và kết nối được các dấu mốc, giai đoạn, sự chuyển mình cùng những di sản được tích lũy qua hành trình CTIN.',
  redThread: 'Xuyên suốt hành trình CTIN là khát vọng không ngừng vươn lên – khát vọng đã thôi thúc các thế hệ người CTIN học hỏi, làm chủ công nghệ, dám lựa chọn con đường riêng và liên tục chuyển mình để tạo ra giá trị lớn hơn.',
  confirm: 'Bài làm hợp lệ của bạn đã được ghi nhận và đóng góp vào tỷ lệ tham gia của đơn vị.'
};

/* ---------- FORMAT ---------- */
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
