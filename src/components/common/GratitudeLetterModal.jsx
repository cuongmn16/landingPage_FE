import React, { useState, useEffect } from 'react';
import { gratitudeLetterApi } from '../../services/api';
import '../../styles/gratitude-letter.css';

function formatYearsDesc(desc) {
  if (!desc) return '';
  let s = desc.replace(/^Hơn\s+/i, '').trim();
  s = s.replace(/(\d+)\s*năm\s*12\s*tháng/gi, (_, y) => `${parseInt(y, 10) + 1} năm`);
  return s;
}

export default function GratitudeLetterModal({ isOpen, onClose, currentUser, previewData }) {
  const [isLetterOpened, setIsLetterOpened] = useState(false);
  const [letterData, setLetterData] = useState(previewData || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsLetterOpened(false);
      return;
    }

    if (previewData) {
      setLetterData(previewData);
      return;
    }

    let isMounted = true;
    const fetchLetter = async () => {
      setLoading(true);
      try {
        const data = await gratitudeLetterApi.getMyLetter();
        if (isMounted && data) {
          setLetterData(data);
        }
      } catch (err) {
        console.warn('Lỗi lấy thư tri ân:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLetter();
    return () => { isMounted = false; };
  }, [isOpen, previewData]);

  if (!isOpen) return null;

  if (loading && !letterData) {
    return (
      <div className="ctin-letter-overlay" role="dialog" aria-modal="true">
        <div className="ctin-vip-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '320px', textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '36px', marginBottom: '16px', animation: 'spin 2s linear infinite' }}>✉️</div>
          <div style={{ color: '#FDE047', fontSize: '18px', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '8px' }}>
            ĐANG TẢI THƯ TRI ÂN...
          </div>
          <p style={{ color: '#cbd5e1', fontSize: '13px', margin: 0 }}>
            Hệ thống đang đồng bộ dữ liệu cống hiến cá nhân hóa của bạn.
          </p>
        </div>
      </div>
    );
  }

  // Dữ liệu cá nhân hóa (ưu tiên data từ backend, fallback từ currentUser)
  const fullName = letterData?.fullName || currentUser?.fullName || 'Người CTIN';
  const unitName = letterData?.unitName || currentUser?.unitName || 'Đại gia đình CTIN';
  const rawSalutation = letterData?.salutation || currentUser?.salutation;
  // Quy đổi danh xưng thân thiện, trẻ trung: Ông -> Anh, Bà -> Chị, Anh -> Anh, Chị -> Chị
  let salutation = 'Anh';
  if (rawSalutation && rawSalutation.trim()) {
    const clean = rawSalutation.trim();
    if (clean === 'Bà' || clean === 'Chị') {
      salutation = 'Chị';
    } else {
      salutation = 'Anh';
    }
  }
  const salutationUpper = salutation.toUpperCase();

  const daysOfService = letterData?.daysOfService ? Number(letterData.daysOfService).toLocaleString('vi-VN') : '3.485';
  const yearsDesc = formatYearsDesc(letterData?.yearsDesc) || '9 năm 6 tháng đầy nhiệt huyết & gắn bó cùng đại gia đình CTIN';

  const handleOpenLetter = () => {
    setIsLetterOpened(true);
    // Báo cho backend ghi nhận trạng thái đã mở thư
    gratitudeLetterApi.markOpened().catch(() => {});
  };

  const handlePrint = (e) => {
    if (e) e.preventDefault();
    window.print();
  };

  return (
    <div className="ctin-letter-overlay" role="dialog" aria-modal="true">
      
      {/* 1. BÌA PHONG THƯ HOÀNG GIA (CHUẨN ẢNH 2) */}
      {!isLetterOpened && (
        <div className="ctin-vip-card">
          
          {/* Nút đóng nhanh góc trên bên phải */}
          <button 
            onClick={onClose} 
            title="Đóng"
            className="ctin-modal-close-btn"
          >
            ✕
          </button>

          {/* Phần trên cùng */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {/* Logo CTIN Nền Trắng Đặt Giữa */}
            <div className="ctin-logo-pill">
              <img src="/assets/ctin-logo.png" alt="CTIN" className="ctin-logo-img" />
            </div>

            {/* Pill Badge Kỷ Niệm 25 Năm */}
            <div className="ctin-anniversary-badge">
              <span>✨ KỶ NIỆM 25 NĂM CỔ PHẦN HÓA</span>
            </div>

            {/* Tiêu Đề Chính Vàng Kim Sang Trọng */}
            <h1 className="ctin-gold-title">
              GỬI NGƯỜI CTIN CỦA<br />NGÀY MAI
            </h1>

            {/* Slogan Giãn Chữ Đầy Đủ */}
            <p className="ctin-slogan-text">
              BEAMING FORWARD – TÂM KHÁT VỌNG, CHÍ VƯƠN<br />CAO
            </p>

            {/* Khung Thông Tin Người Nhận Với Danh Xưng Động */}
            <div className="ctin-recipient-box">
              <div className="ctin-recipient-label">
                GỬI TỚI {salutationUpper}:
              </div>
              <div className="ctin-recipient-name">
                {fullName}
              </div>
              <div className="ctin-recipient-unit">
                {unitName}
              </div>
            </div>

          </div>

          {/* Phần dưới cùng: Con Dấu Sáp Vàng MỞ THƯ */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px' }}>
            {letterData?.isPublished === false && !previewData && currentUser?.role !== 'admin' ? (
              <div style={{ padding: '16px 20px', background: 'rgba(8, 16, 42, 0.85)', borderRadius: '16px', border: '1.5px solid #d97706', maxWidth: '380px', textAlign: 'center', margin: '10px auto' }}>
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>⏳</div>
                <div style={{ color: '#FDE047', fontWeight: 700, fontSize: '13.5px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                  Bức Thư Đang Được Niêm Phong
                </div>
                <p style={{ color: '#cbd5e1', fontSize: '12px', lineHeight: 1.5, margin: 0 }}>
                  Thư Tri Ân CTIN 25 Năm sẽ chính thức được tự động phát hành vào lúc <strong>22:30</strong> (hoặc khi Ban Tổ Chức phát hành chủ động).
                </p>
              </div>
            ) : (
              <button 
                onClick={handleOpenLetter}
                className="ctin-wax-seal-btn"
                title="Xin mời mở thư"
              >
                <div className="ctin-wax-seal-icon">⚜️</div>
                <span className="ctin-wax-seal-text-main" style={{ fontSize: '11px', letterSpacing: '0.06em', textAlign: 'center', lineHeight: 1.25 }}>
                  XIN MỜI<br />MỞ THƯ
                </span>
              </button>
            )}
          </div>

        </div>
      )}


      {/* 2. LÁ THƯ GIẤY DA HOÀNG GIA (THIẾT KẾ BAN ĐẦU SANG TRỌNG) */}
      {isLetterOpened && (
        <div className="ctin-parchment-sheet">
          
          {/* Nút đóng nhanh góc trên bên phải */}
          <button 
            onClick={onClose} 
            title="Đóng thư"
            className="ctin-modal-close-btn-parchment"
          >
            ✕
          </button>

          {/* Header lá thư */}
          <div className="ctin-letter-header">
            <div className="ctin-header-logo-row">
              <div className="ctin-logo-pill" style={{ marginBottom: 0 }}>
                <img src="/assets/ctin-logo.png" alt="CTIN Logo" className="ctin-logo-img" />
              </div>
              <span className="ctin-header-badge-text">
                2001 – 2026 · 25 NĂM
              </span>
            </div>
            <h2 className="ctin-header-title">
              GỬI NGƯỜI CTIN CỦA NGÀY MAI
            </h2>
            <p className="ctin-header-slogan">
              Beaming Forward – Tâm khát vọng, Chí vươn cao
            </p>
          </div>

          {/* Hộp vinh danh cá nhân hóa thiết kế ban đầu */}
          <div className="ctin-honor-box">
            <p className="ctin-honor-salutation">
              Gửi {salutation}: <span className="ctin-honor-name">{fullName}</span>
            </p>
            <div className="ctin-honor-days-row">
              <span className="ctin-honor-days-label">
                Tính đến hôm nay, {salutation} đã đồng hành cùng CTIN:
              </span>
              <span className="ctin-honor-days-badge">
                {daysOfService} NGÀY
              </span>
            </div>
            <p className="ctin-honor-years-desc">
              ({yearsDesc})
            </p>
          </div>

          {/* Toàn văn lá thư với các khung điểm nhấn ban đầu và danh xưng chuẩn */}
          <div className="ctin-letter-body">
            <p>
              Mỗi người đến với CTIN vào một thời điểm khác nhau, mang theo những câu chuyện và khát vọng riêng. Dù hành trình ấy đã trải qua bao lâu, điều đáng quý là từ ngày <strong style={{ color: '#78350f' }}>{salutation}</strong> gia nhập, <strong style={{ color: '#78350f' }}>{salutation}</strong> đã trở thành một phần của câu chuyện CTIN – câu chuyện được viết nên bởi nhiều thế hệ, bằng những nỗ lực, niềm tin và khát vọng không ngừng vươn lên.
            </p>
            <p>
              25 năm qua, CTIN đã đi qua nhiều chặng đường. Có những thành công đáng tự hào, những giai đoạn đầy thử thách, những quyết định không dễ dàng và cả những bước chuyển mình để thích ứng với một thế giới không ngừng vận động.
            </p>
            <p>
              Điều làm nên CTIN hôm nay không chỉ là những con số tăng trưởng, những dự án đã triển khai hay những giải pháp công nghệ được đưa vào thực tiễn.
            </p>
            
            {/* Blockquote viền hổ phách ban đầu */}
            <blockquote className="ctin-letter-quote">
              Đó còn là những con người tận tâm với công việc, những đồng đội luôn sát cánh bên nhau, những khách hàng đã đặt niềm tin, những năng lực được bền bỉ vun đắp, một uy tín được gìn giữ và những giá trị văn hóa được truyền từ thế hệ này sang thế hệ khác.
            </blockquote>
            
            <p>
              Mỗi người CTIN đều có một vị trí trong hành trình ấy. Có những đóng góp được nhiều người biết đến, cũng có những nỗ lực thầm lặng không phải lúc nào cũng được gọi tên. Và với những người vừa bắt đầu, phía trước vẫn còn rất nhiều cơ hội để tạo nên dấu ấn của riêng mình.
            </p>
            
            {/* Hộp lời cảm ơn viền xanh CTIN sang trọng */}
            <div className="ctin-thank-you-box">
              <div className="ctin-thank-you-title">
                Hôm nay, CTIN muốn gửi đến {salutation} một lời cảm ơn:
              </div>
              <div className="ctin-thank-you-item">• Cảm ơn vì {salutation} đã lựa chọn đồng hành cùng CTIN.</div>
              <div className="ctin-thank-you-item">• Cảm ơn vì những điều {salutation} đã và đang đóng góp, dù lớn lao hay giản dị.</div>
              <div className="ctin-thank-you-item">• Và cảm ơn vì đã trở thành một phần của câu chuyện chung mà chúng ta đang cùng nhau viết tiếp.</div>
            </div>

            <p>
              <strong style={{ color: '#071330' }}>{salutation}</strong> thân mến, chúng ta vừa cùng nhau nhìn lại hành trình 25 năm. Nhưng có lẽ điều ý nghĩa nhất của một dịp kỷ niệm không chỉ là nhớ về những gì đã qua, mà còn là nhận ra những gì xứng đáng được mang theo.
            </p>
            <p>
              25 năm tới, CTIN sẽ có những con người mới, những công nghệ mới, những cơ hội và thử thách mà hôm nay chúng ta chưa thể hình dung hết. Sẽ có những điều cần tiếp tục được phát triển để CTIN tiến xa hơn. Nhưng cũng sẽ có những giá trị mà chúng ta mong rằng, dù bao nhiêu năm trôi qua, người CTIN vẫn luôn gìn giữ.
            </p>
            <p>
              Và tương lai ấy sẽ được tạo nên từ những lựa chọn của chúng ta hôm nay. Có thể một ngày nào đó, khi nhìn lại chặng đường này, {salutation} sẽ nhận ra rằng mình đã góp phần tạo nên một điều gì đó đáng tự hào.
            </p>

            {/* Câu trích dẫn trung tâm phong cách cổ điển */}
            <div className="ctin-center-quote">
              "Không nhất thiết phải là một thành tựu lớn. Đôi khi, đó là một công việc bạn đã làm đến cùng. Một đồng nghiệp bạn đã giúp đỡ. Một khách hàng bạn đã giữ trọn niềm tin. Một điều mới bạn đã dũng cảm học hỏi. Hay một giá trị tốt đẹp bạn đã trao lại cho người đến sau."
            </div>

            <p>
              Và khi nghĩ về những năm tháng phía trước, chúng tôi mong {salutation} sẽ luôn giữ cho mình:
            </p>
            <ul style={{ paddingLeft: '24px', marginBottom: '14px', color: '#071330', fontWeight: '600' }}>
              <li style={{ marginBottom: '6px' }}><strong>Tâm khát vọng</strong> – để không ngừng hướng tới những điều tốt đẹp hơn.</li>
              <li><strong>Chí vươn cao</strong> – để dám bước tiếp, dám học hỏi và cùng nhau chinh phục những chân trời mới.</li>
            </ul>
            <p>
              Bởi <em>Beaming Forward</em> không chỉ là hướng về phía trước, mà còn là tiến về phía trước với niềm tin, niềm tự hào và ánh sáng khát vọng từ bên trong mỗi người.
            </p>
            
            {/* Hộp câu hỏi suy ngẫm cho 25 năm sau */}
            <div className="ctin-reflection-box">
              <div className="ctin-reflection-header">
                <span style={{ fontSize: '20px' }}>⏳</span>
                <h4 className="ctin-reflection-title">
                  Dành một chút thời gian cho chính mình...
                </h4>
              </div>
              <p className="ctin-reflection-main">
                Hãy thử tưởng tượng, 25 năm sau, một thế hệ người CTIN mới đang nhìn lại hành trình mà chúng ta đang viết hôm nay.<br />
                <strong style={{ color: '#fde047' }}>{salutation} mong họ sẽ nhớ đến điều gì về thế hệ chúng ta? Và {salutation} muốn mình đã góp phần tạo nên điều gì trong câu chuyện ấy?</strong>
              </p>
              <p className="ctin-reflection-note">
                {salutation} không cần trả lời ngay. Chỉ mong rằng, khi trở lại với công việc thường ngày, {salutation} sẽ mang theo những câu hỏi ấy như một lời nhắc nhở về những điều mình tin tưởng và muốn tiếp tục vun đắp.
              </p>
            </div>

            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 'bold', color: '#071330', fontSize: '18px', textAlign: 'center', marginTop: '24px' }}>
              Cảm ơn {salutation} vì mỗi ngày đã cùng CTIN.<br />
              Và cảm ơn vì những ngày chúng ta sẽ còn cùng nhau viết tiếp.
            </p>
          </div>

          {/* Chân trang & Thao tác ban đầu */}
          <div className="ctin-letter-footer">
            <div>
              <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '11px', color: '#78350f', letterSpacing: '2px', fontWeight: 'bold' }}>BEAMING FORWARD</p>
              <p className="ctin-footer-slogan-main">Tâm khát vọng – Chí vươn cao</p>
              <p className="ctin-footer-slogan-sub">CTIN · Success together</p>
            </div>

            <div className="ctin-actions-row">
              <button 
                onClick={handlePrint} 
                className="ctin-btn-pdf"
              >
                <span>📥</span> Lưu Lá Thư Kỷ Niệm (PDF)
              </button>
              <button 
                onClick={() => setIsLetterOpened(false)} 
                className="ctin-btn-fold"
              >
                ↩ Gấp lại phong thư
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
