/* ============================================================
   MISSION 1 — JOURNEY MAP
   Data theo Tài liệu bàn giao kỹ thuật (bản khóa logic)
   ============================================================ */

export const M1_CONFIG = {
  id: 1,
  slug: 'journey-map',
  title: 'JOURNEY MAP',
  subtitle: 'Giải mã hành trình CTIN',
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
  title: 'Giải mã hành trình CTIN',
  description: 'Khám phá các dấu mốc, xác định những giai đoạn phát triển và giải mã sự chuyển mình của CTIN trong suốt hành trình.',
  result: 'Hoàn thành bản đồ hành trình gồm các mốc thời gian, các giai đoạn phát triển, bước ngoặt, sự chuyển mình, vật chứng và xác định tinh thần xuyên suốt đã kết nối, thúc đẩy CTIN phát triển qua các giai đoạn.',
  requirementTitle: 'Yêu cầu thực hiện',
  requirementText: 'Đọc kỹ dữ kiện, lựa chọn phương án phù hợp và hoàn thành phần chia sẻ cá nhân. Kết quả hợp lệ sẽ được ghi nhận vào thành tích chung của đơn vị.',
  confirmLabel: 'Tôi đã đọc và hiểu yêu cầu nhiệm vụ'
};

/* ---------- TAB 02 — DÒNG THỜI GIAN ---------- */
export const M1_TIMELINE = [
  {
    id: 'T01', year: 1972,
    meaningId: 'M01',
    meaning: 'Khởi nguồn từ nhiệm vụ phục vụ đất nước, đặt nền móng cho năng lực kỹ thuật và tinh thần trách nhiệm của CTIN',
    unlock: {
      title: 'Thành lập Xí nghiệp Sửa chữa Thiết bị Thông tin I',
      text: 'Theo Quyết định số 33/QĐ ngày 13/01/1972; sửa chữa thiết bị viễn thông phục vụ chiến trường.',
      evidence: 'D01'
    }
  },
  {
    id: 'T02', year: 1985,
    meaningId: 'M02',
    meaning: 'Chuyển từ nhiệm vụ sửa chữa sang định hướng nghiên cứu, sản xuất và phát triển năng lực kỹ thuật',
    unlock: {
      title: 'Đổi tên thành Xí nghiệp Khoa học Sản xuất Thiết bị Thông tin I',
      text: 'Chuyển từ nhiệm vụ sửa chữa sang định hướng nghiên cứu, sản xuất và phát triển năng lực kỹ thuật.',
      evidence: null
    }
  },
  {
    id: 'T03', year: 1994,
    meaningId: 'M03',
    meaning: 'Chuyển từ sửa chữa theo nhiệm vụ được giao sang chủ động cung cấp dịch vụ kỹ thuật, tham gia số hóa và mở đường hợp tác công nghệ quốc tế',
    unlock: {
      title: 'Tham gia số hóa ngành Bưu điện',
      text: 'Lập tổ đội đi công trình, phát triển dịch vụ kỹ thuật và hợp tác hãng công nghệ quốc tế. Các mốc 1992, 1996, 1997 là dữ kiện bổ trợ.',
      evidence: 'D06'
    }
  },
  {
    id: 'T04', year: 2000,
    meaningId: 'M04',
    meaning: 'Mở hướng phát triển sang tin học, phần mềm và tích hợp hệ thống',
    unlock: {
      title: 'Thành lập Trung tâm Tin học',
      text: 'Tiền đề cho tích hợp hệ thống và phần mềm.',
      evidence: 'D08'
    }
  },
  {
    id: 'T05', year: 2001,
    meaningId: 'M05',
    meaning: 'Thay đổi mô hình sở hữu và vận hành, tăng quyền tự chủ đồng thời gắn trách nhiệm rõ hơn với kết quả hoạt động',
    unlock: {
      title: 'Chuyển từ doanh nghiệp nhà nước sang công ty cổ phần',
      text: 'Vốn Nhà nước 35%; tăng tự chủ và trách nhiệm kết quả.',
      evidence: 'D02'
    }
  },
  {
    id: 'T06', year: 2006,
    meaningId: 'M06',
    meaning: 'Vượt khỏi vai trò thầu phụ, khẳng định năng lực đảm nhận dự án công nghệ quy mô lớn với vai trò tổng thầu',
    unlock: {
      title: 'Tổng thầu dự án mạng truyền số liệu',
      text: 'Cung cấp, lắp đặt mạng truyền số liệu, nguồn điện cho cơ quan Đảng, Nhà nước; khách hàng CPT; 7,4 triệu USD, hơn 100 tỷ đồng.',
      evidence: null
    }
  },
  {
    id: 'T07', year: 2009,
    meaningId: 'M07',
    meaning: 'Chuyển hóa năng lực tích hợp và tổng thầu thành tăng trưởng doanh thu, quy mô và vị thế thị trường',
    unlock: {
      title: 'Thắng dự án MAN-Ethernet',
      text: 'Cho 10 viễn thông tỉnh, thành; doanh thu hơn 1.300 tỷ; nhận các giải thưởng Cisco.',
      evidence: 'D05'
    }
  },
  {
    id: 'T08', year: 2011,
    meaningId: 'M08',
    meaning: 'Đặt nền móng cho hướng phát triển Dịch vụ số, bổ sung động lực tăng trưởng bên cạnh Tích hợp hệ thống',
    unlock: {
      title: 'Nghiên cứu dịch vụ xổ số điện toán',
      text: 'Bắt đầu nghiên cứu và tìm hướng triển khai dịch vụ xổ số điện toán.',
      evidence: null
    }
  },
  {
    id: 'T09', year: 2018,
    meaningId: 'M09',
    meaning: 'Chuyển giao thế hệ lãnh đạo và hình thành định hướng chủ động nghiên cứu, phát triển thị trường',
    unlock: {
      title: 'Chuyển giao lãnh đạo & thành lập R&D',
      text: 'Ông Hà Thanh Hải được bổ nhiệm Tổng Giám đốc nhiệm kỳ 2017–2021; thành lập Trung tâm R&D.',
      evidence: null
    }
  },
  {
    id: 'T10', year: 2020,
    meaningId: 'M10',
    meaning: 'Hiện thực hóa hướng Dịch vụ số qua Vietlott, đồng thời củng cố quản trị và tổ chức cho chu kỳ phát triển mới',
    unlock: {
      title: 'Niêm yết HOSE & vận hành Vietlott',
      text: 'Chuyển niêm yết lên HOSE mã ICT; trở thành đơn vị phát triển, vận hành Vietlott; củng cố hệ thống và tổ chức.',
      evidence: 'D07'
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
    nameId: 'SN01', name: 'KHỞI NGUỒN TỪ SỨ MỆNH',
    eventId: 'SE01', event: 'Thành lập Xí nghiệp Sửa chữa Thiết bị Thông tin I'
  },
  {
    id: 'S02',
    start: 1985, end: 2000,
    nameId: 'SN02', name: 'TÍCH LŨY ĐỂ MỞ ĐƯỜNG',
    eventId: 'SE02', event: 'Chuyển thành Xí nghiệp Khoa học Sản xuất Thiết bị Thông tin I'
  },
  {
    id: 'S03',
    start: 2001, end: 2006,
    nameId: 'SN03', name: 'KHẲNG ĐỊNH CHÍNH MÌNH',
    eventId: 'SE03', event: 'Chuyển từ doanh nghiệp nhà nước sang công ty cổ phần'
  },
  {
    id: 'S04',
    start: 2007, end: 2017,
    nameId: 'SN04', name: 'BỨT PHÁ QUY MÔ, MỞ HƯỚNG MỚI',
    eventId: 'SE04', event: 'Làm tổng thầu dự án mạng truyền số liệu cho cơ quan Đảng, Nhà nước'
  },
  {
    id: 'S05',
    start: 2018, end: 'Nay',
    nameId: 'SN05', name: 'CHUYỂN MÌNH CHO CHẶNG ĐƯỜNG MỚI',
    eventId: 'SE05', event: 'Chuyển giao thế hệ lãnh đạo và thành lập R&D'
  }
];

export const M1_YEAR_OPTIONS = [1972, 1984, 1985, 2000, 2001, 2006, 2007, 2009, 2017, 2018, 2020, 'Nay'];

export const M1_STAGE_NAMES = M1_STAGES.map(s => ({ id: s.nameId, text: s.name }));
export const M1_STAGE_EVENTS = M1_STAGES.map(s => ({ id: s.eventId, text: s.event }));

/* ---------- TAB 04 — SỰ CHUYỂN MÌNH ---------- */
export const M1_TRANSFORMS = [
  {
    stageId: 'S01',
    stageName: 'KHỞI NGUỒN TỪ SỨ MỆNH',
    contextId: 'C01',
    context: 'Ngành viễn thông cần một đơn vị chuyên trách sửa chữa thiết bị thông tin, đáp ứng yêu cầu kỹ thuật phục vụ đất nước.',
    changeId: 'CH01',
    change: 'CTIN hình thành từ một đơn vị thực hiện nhiệm vụ sửa chữa thiết bị thông tin phục vụ đất nước; qua đó xây dựng lực lượng kỹ thuật chuyên trách, kỷ luật nghề nghiệp và tinh thần trách nhiệm – những nền móng đầu tiên cho hành trình phát triển lâu dài.',
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
      message: 'Hình thành tổ chức kỹ thuật chuyên trách và nền tảng nghề nghiệp ban đầu.',
      details: [
        'Thành lập đơn vị; sửa chữa thiết bị phục vụ đất nước.',
        'Hình thành lực lượng kỹ thuật.',
        'Nền móng nghề nghiệp và trách nhiệm.'
      ]
    }
  },
  {
    stageId: 'S02',
    stageName: 'TÍCH LŨY ĐỂ MỞ ĐƯỜNG',
    contextId: 'C02',
    context: 'Năng lực ban đầu chủ yếu tập trung vào sửa chữa thiết bị; yêu cầu phát triển công nghệ và sản xuất ngày càng lớn.',
    changeId: 'CH02',
    change: 'Từ năng lực chủ yếu là sửa chữa, CTIN từng bước mở rộng sang nghiên cứu, sản xuất và dịch vụ kỹ thuật; tham gia số hóa ngành Bưu điện, tiếp nhận công nghệ quốc tế và mở hướng phát triển sang tin học, phần mềm, tích hợp hệ thống.',
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
      message: 'Mở rộng từ sửa chữa sang nghiên cứu, sản xuất.',
      details: [
        'Tham gia số hóa ngành Bưu điện.',
        'Dịch vụ kỹ thuật; hợp tác quốc tế.',
        'Mở hướng tin học, phần mềm, tích hợp.'
      ]
    }
  },
  {
    stageId: 'S03',
    stageName: 'KHẲNG ĐỊNH CHÍNH MÌNH',
    contextId: 'C03',
    context: 'CTIN hoạt động theo mô hình doanh nghiệp nhà nước, quyền chủ động trong kinh doanh và phát triển thị trường còn hạn chế.',
    changeId: 'CH03',
    change: 'Cổ phần hóa giúp CTIN chuyển từ cơ chế phụ thuộc sang tự chủ hơn trong lựa chọn thị trường và chịu trách nhiệm về kết quả. Quyền tự chủ được chuyển hóa thành năng lực công nghệ được quốc tế công nhận và khả năng làm chủ những dự án lớn với vai trò tổng thầu.',
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
      message: 'Giành quyền tự chủ và chứng minh năng lực bằng con đường riêng.',
      details: [
        'Cổ phần hóa, vốn Nhà nước 35%.',
        'Tự chủ và trách nhiệm; quốc tế công nhận.',
        'Tổng thầu dự án 7,4 triệu USD; vượt vai trò thầu phụ.'
      ]
    }
  },
  {
    stageId: 'S04',
    stageName: 'BỨT PHÁ QUY MÔ, MỞ HƯỚNG MỚI',
    contextId: 'C04',
    context: 'CTIN đã tích lũy năng lực công nghệ và tích hợp nhưng cần chứng minh khả năng thực hiện các dự án lớn, phức tạp.',
    changeId: 'CH04',
    change: 'CTIN chuyển hóa năng lực tổng thầu và tích hợp hệ thống thành tăng trưởng thực chất về dự án, doanh thu, lợi nhuận và vị thế thị trường; đồng thời không dừng lại ở mô hình đã thành công mà bắt đầu tìm kiếm động lực tăng trưởng mới từ Dịch vụ số.',
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
      message: 'Bứt phá quy mô và tìm động lực tăng trưởng mới.',
      details: [
        'Dự án lớn; doanh thu vượt 1.000 tỷ năm 2009.',
        'Được ghi nhận; nghiên cứu xổ số điện toán năm 2011.',
        'Doanh thu vượt 3.000 tỷ, lợi nhuận trên 100 tỷ năm 2017.'
      ]
    }
  },
  {
    stageId: 'S05',
    stageName: 'CHUYỂN MÌNH CHO CHẶNG ĐƯỜNG MỚI',
    contextId: 'C05',
    context: 'Mô hình tăng trưởng đã tạo ra thành công nhưng CTIN đứng trước yêu cầu đổi mới cách tiếp cận thị trường, công nghệ và tổ chức.',
    changeId: 'CH05',
    change: 'CTIN chuyển từ tăng trưởng chủ yếu dựa trên năng lực tích hợp sang mô hình kết hợp Tích hợp hệ thống và Dịch vụ số; đồng thời đổi mới thế hệ lãnh đạo, phát triển R&D và củng cố quản trị, tổ chức để chủ động hơn trước chu kỳ phát triển mới.',
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
      message: 'Chuyển mình về lãnh đạo, nghiên cứu, quản trị và mô hình phát triển.',
      details: [
        'Chuyển giao lãnh đạo; R&D; HOSE.',
        'Vietlott; kết hợp Tích hợp hệ thống và Dịch vụ số.',
        'Củng cố tổ chức.'
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
    spirit: 'Tinh thần trách nhiệm và ý thức phục vụ',
    capacity: 'Nền tảng kỹ thuật, kỷ luật nghề nghiệp và khả năng hoàn thành nhiệm vụ khó.'
  },
  {
    stageId: 'S02',
    stageLabel: '1985–2000',
    spiritId: 'SP02',
    spirit: 'Tinh thần học hỏi và chủ động tiếp cận cái mới',
    capacity: 'Mở rộng từ sửa chữa sang nghiên cứu, sản xuất, dịch vụ kỹ thuật và tiếp nhận công nghệ quốc tế.'
  },
  {
    stageId: 'S03',
    stageLabel: '2001–2006',
    spiritId: 'SP03',
    spirit: 'Tinh thần tự chủ gắn với trách nhiệm về kết quả',
    capacity: 'Khả năng lựa chọn thị trường, làm chủ công nghệ và làm tổng thầu dự án lớn.'
  },
  {
    stageId: 'S04',
    stageLabel: '2007–2017',
    spiritId: 'SP04',
    spirit: 'Khát vọng phát triển và cam kết tạo giá trị cho khách hàng',
    capacity: 'Chuyển hóa năng lực tích hợp thành dự án lớn, tăng trưởng, vị thế và khả năng tìm hướng mới.'
  },
  {
    stageId: 'S05',
    stageLabel: '2018–nay',
    spiritId: 'SP05',
    spirit: 'Tinh thần đổi mới, thích ứng và chủ động kiến tạo tương lai',
    capacity: 'R&D, Dịch vụ số và năng lực chuyển đổi tổ chức bên cạnh nền tảng tích hợp.'
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
    caption: '[Ảnh tư liệu năm 2009 – chờ cập nhật]',
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
    caption: '[Ảnh đại diện 2018–2020 – chờ cập nhật]',
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
    tooShort: 'Vui lòng viết từ 15 đến 30 từ.',
    tooLong: 'Vượt quá 30 từ. Hãy rút gọn lại.',
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
