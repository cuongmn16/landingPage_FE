import React, { useState, useEffect } from 'react';
import { gratitudeLetterApi } from '../../services/api';

export default function GratitudeLetterModal({ isOpen, onClose, currentUser }) {
  const [isLetterOpened, setIsLetterOpened] = useState(false);
  const [letterData, setLetterData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsLetterOpened(false);
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
  }, [isOpen]);

  if (!isOpen) return null;

  // Dữ liệu cá nhân hóa (ưu tiên data từ backend, fallback từ currentUser)
  const fullName = letterData?.fullName || currentUser?.fullName || 'Người CTIN';
  const unitName = letterData?.unitName || currentUser?.unitName || 'Đại gia đình CTIN';
  const rawSalutation = letterData?.salutation || 'Anh/Chị';
  const salutation = (rawSalutation === 'Bà' || rawSalutation === 'Chị') ? 'Chị' : (rawSalutation === 'Ông' || rawSalutation === 'Anh') ? 'Anh' : 'Anh/Chị';
  const salutationUpper = salutation.toUpperCase();

  const daysOfService = letterData?.daysOfService ? Number(letterData.daysOfService).toLocaleString('vi-VN') : '3.485';
  const yearsDesc = letterData?.yearsDesc || 'Hơn 9 năm 6 tháng đầy nhiệt huyết & gắn bó cùng đại gia đình CTIN';

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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      
      {/* 1. BÌA PHONG THƯ HOÀNG GIA (CHUẨN ẢNH 2) */}
      {!isLetterOpened && (
        <div className="relative w-full max-w-[480px] min-h-[640px] bg-gradient-to-b from-[#152042] via-[#0d1633] to-[#070e24] border-2 border-[#a58f46] rounded-3xl p-6 md:p-8 text-center flex flex-col items-center justify-between shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(165,143,70,0.2)] transition-all duration-300">
          
          {/* Nút đóng nhanh góc trên bên phải */}
          <button 
            onClick={onClose} 
            title="Đóng"
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center font-bold text-sm transition-all cursor-pointer"
          >
            ✕
          </button>

          {/* Phần trên cùng */}
          <div className="w-full flex flex-col items-center pt-2">
            
            {/* Logo CTIN Nền Trắng Đặt Giữa */}
            <div className="inline-block px-5 py-2.5 rounded-2xl bg-white shadow-xl border border-amber-400/40 mb-4">
              <img src="/assets/ctin-logo.png" alt="CTIN" className="h-9 w-auto object-contain" />
            </div>

            {/* Pill Badge Kỷ Niệm 25 Năm */}
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#131d3d] border border-[#8c7438] mb-4 shadow-sm">
              <span className="text-[#dfad42] text-xs font-semibold tracking-wide">
                ✨ KỶ NIỆM 25 NĂM CTIN (2001 – 2026)
              </span>
            </div>

            {/* Tiêu Đề Chính Vàng Kim Sang Trọng */}
            <h1 className="text-2xl md:text-3xl font-extrabold leading-tight tracking-wide mb-2 font-serif text-transparent bg-clip-text bg-gradient-to-b from-[#FFF8DB] via-[#F3C44C] to-[#8B5700] drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
              GỬI NGƯỜI CTIN CỦA<br />NGÀY MAI
            </h1>

            {/* Slogan Giãn Chữ Đầy Đủ */}
            <p className="text-[#dfad42] text-[10.5px] md:text-[11.5px] font-bold tracking-[0.22em] uppercase leading-relaxed mb-6 font-serif">
              BEAMING FORWARD – TÂM KHÁT VỌNG, CHÍ VƯƠN<br />CAO
            </p>

            {/* Khung Thông Tin Người Nhận Với Danh Xưng Động */}
            <div className="w-full p-4 md:p-5 mb-4 text-center rounded-2xl bg-[#08102a]/70 border border-[#a58f46]/45 shadow-inner">
              <div className="text-[10px] md:text-[11px] font-semibold tracking-[0.16em] uppercase text-slate-400 mb-1">
                THƯ TRI ÂN GỬI RIÊNG TỚI {salutationUpper}:
              </div>
              <div className="text-xl md:text-2xl font-bold font-serif text-white tracking-wide mb-0.5">
                {fullName}
              </div>
              <div className="text-xs md:text-sm text-amber-300 font-medium">
                {unitName}
              </div>
            </div>

          </div>

          {/* Phần dưới cùng: Con Dấu Sáp Vàng MỞ THƯ & Chú Thích */}
          <div className="w-full flex flex-col items-center justify-center my-2 pb-2">
            <button 
              onClick={handleOpenLetter}
              className="group relative flex flex-col items-center justify-center w-28 h-28 rounded-full cursor-pointer transition-all duration-300 active:scale-95 hover:scale-105 border-[2.5px] border-[#FFEA79] bg-[radial-gradient(circle_at_45%_35%,#FDE047_0%,#EAB308_40%,#B45309_75%,#78350F_100%)] shadow-[0_0_35px_rgba(245,185,40,0.7),0_8px_20px_rgba(0,0,0,0.6)]"
            >
              <div className="text-amber-900/50 text-xl font-bold leading-none mb-0.5">⚜️</div>
              <span className="text-sm font-extrabold tracking-[0.14em] uppercase text-[#451a03] font-serif leading-tight">
                MỞ THƯ
              </span>
              <span className="text-[9.5px] font-bold tracking-wider uppercase text-[#78350f] font-serif mt-0.5">
                CTIN 25 NĂM
              </span>
            </button>

            <p className="text-xs md:text-sm text-[#fde68a] italic mt-4 tracking-wide opacity-90">
              Bấm vào con dấu sáp vàng để mở bức thư của bạn
            </p>
          </div>

        </div>
      )}


      {/* 2. LÁ THƯ GIẤY DA HOÀNG GIA (THIẾT KẾ BAN ĐẦU SANG TRỌNG) */}
      {isLetterOpened && (
        <div className="relative w-full max-w-2xl bg-[radial-gradient(circle_at_50%_25%,#FFFDF8_0%,#FEF8ED_60%,#F7EBD2_100%)] border-[3px] border-[#DFAD54] rounded-3xl p-6 md:p-12 text-slate-900 shadow-[0_25px_70px_rgba(0,0,0,0.85)] my-4 transition-all duration-500 animate-fadeIn">
          
          {/* Nút đóng nhanh góc trên bên phải */}
          <button 
            onClick={onClose} 
            title="Đóng thư"
            className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full bg-amber-900/10 hover:bg-amber-900/25 text-amber-950 flex items-center justify-center font-bold text-base transition-all cursor-pointer shadow-sm"
          >
            ✕
          </button>

          {/* Header lá thư */}
          <div className="text-center border-b-2 border-amber-900/15 pb-7 mb-7">
            <div className="flex items-center justify-center gap-3 md:gap-4 mb-3">
              <div className="bg-white px-3.5 py-1.5 rounded-xl shadow-md border border-amber-400/40">
                <img src="/assets/ctin-logo.png" alt="CTIN Logo" className="h-8 md:h-9 object-contain" />
              </div>
              <span className="text-xs font-mono font-bold text-amber-950 tracking-widest border-l-2 border-amber-800/30 pl-3 md:pl-4">
                2001 – 2026 · 25 NĂM
              </span>
            </div>
            <h2 className="font-serif text-2xl md:text-4xl font-extrabold text-[#071330] mb-1.5 tracking-wide">
              GỬI NGƯỜI CTIN CỦA NGÀY MAI
            </h2>
            <p className="font-serif italic text-amber-900 font-bold text-base md:text-lg">
              Beaming Forward – Tâm khát vọng, Chí vươn cao
            </p>
          </div>

          {/* Hộp vinh danh cá nhân hóa thiết kế ban đầu */}
          <div className="bg-amber-100/80 border-2 border-amber-400/70 rounded-2xl p-5 md:p-6 mb-7 text-center shadow-inner">
            <p className="text-lg md:text-xl font-bold text-blue-950 font-serif">
              Gửi {salutation}: <span className="text-amber-800">{fullName}</span>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
              <span className="text-xs md:text-sm uppercase tracking-wider text-amber-950 font-semibold">
                Tính đến hôm nay, {salutation} đã đồng hành cùng CTIN:
              </span>
              <span className="font-mono font-black text-xl md:text-2xl text-blue-950 bg-white px-3.5 py-1 rounded-xl border border-amber-400 shadow-sm">
                {daysOfService} NGÀY
              </span>
            </div>
            <p className="text-xs text-amber-900/80 italic mt-2">
              ({yearsDesc})
            </p>
          </div>

          {/* Toàn văn lá thư với các khung điểm nhấn ban đầu và danh xưng chuẩn */}
          <div className="space-y-4 text-[15px] md:text-[16px] leading-relaxed text-slate-800 text-justify font-normal max-h-[58vh] overflow-y-auto pr-2 md:pr-3">
            <p>
              Mỗi người đến với CTIN vào một thời điểm khác nhau, mang theo những câu chuyện và khát vọng riêng. Dù hành trình ấy đã trải qua bao lâu, điều đáng quý là từ ngày <span className="font-semibold text-amber-950">{salutation}</span> gia nhập, <span className="font-semibold text-amber-950">{salutation}</span> đã trở thành một phần của câu chuyện CTIN – câu chuyện được viết nên bởi nhiều thế hệ, bằng những nỗ lực, niềm tin và khát vọng không ngừng vươn lên.
            </p>
            <p>
              25 năm qua, CTIN đã đi qua nhiều chặng đường. Có những thành công đáng tự hào, những giai đoạn đầy thử thách, những quyết định không dễ dàng và cả những bước chuyển mình để thích ứng với một thế giới không ngừng vận động.
            </p>
            <p>
              Điều làm nên CTIN hôm nay không chỉ là những con số tăng trưởng, những dự án đã triển khai hay những giải pháp công nghệ được đưa vào thực tiễn.
            </p>
            
            {/* Blockquote viền hổ phách ban đầu */}
            <blockquote className="border-l-4 border-amber-600 pl-4 py-2.5 my-4 bg-amber-500/10 italic text-blue-950 font-semibold rounded-r-xl">
              Đó còn là những con người tận tâm với công việc, những đồng đội luôn sát cánh bên nhau, những khách hàng đã đặt niềm tin, những năng lực được bền bỉ vun đắp, một uy tín được gìn giữ và những giá trị văn hóa được truyền từ thế hệ này sang thế hệ khác.
            </blockquote>
            
            <p>
              Mỗi người CTIN đều có một vị trí trong hành trình ấy. Có những đóng góp được nhiều người biết đến, cũng có những nỗ lực thầm lặng không phải lúc nào cũng được gọi tên. Và với những người vừa bắt đầu, phía trước vẫn còn rất nhiều cơ hội để tạo nên dấu ấn của riêng mình.
            </p>
            
            {/* Hộp lời cảm ơn viền xanh CTIN sang trọng */}
            <div className="bg-amber-100/60 p-5 rounded-2xl border-l-4 border-blue-900 space-y-2 font-medium text-blue-950 shadow-sm my-5">
              <p className="font-bold text-amber-900 uppercase text-xs tracking-wider mb-1">
                Hôm nay, CTIN muốn gửi đến {salutation} một lời cảm ơn:
              </p>
              <p>• Cảm ơn vì {salutation} đã lựa chọn đồng hành cùng CTIN.</p>
              <p>• Cảm ơn vì những điều {salutation} đã và đang đóng góp, dù lớn lao hay giản dị.</p>
              <p>• Và cảm ơn vì đã trở thành một phần của câu chuyện chung mà chúng ta đang cùng nhau viết tiếp.</p>
            </div>

            <p>
              <span className="font-bold text-blue-950">{salutation}</span> thân mến, chúng ta vừa cùng nhau nhìn lại hành trình 25 năm. Nhưng có lẽ điều ý nghĩa nhất của một dịp kỷ niệm không chỉ là nhớ về những gì đã qua, mà còn là nhận ra những gì xứng đáng được mang theo.
            </p>
            <p>
              25 năm tới, CTIN sẽ có những con người mới, những công nghệ mới, những cơ hội và thử thách mà hôm nay chúng ta chưa thể hình dung hết. Sẽ có những điều cần tiếp tục được phát triển để CTIN tiến xa hơn. Nhưng cũng sẽ có những giá trị mà chúng ta mong rằng, dù bao nhiêu năm trôi qua, người CTIN vẫn luôn gìn giữ.
            </p>
            <p>
              Và tương lai ấy sẽ được tạo nên từ những lựa chọn của chúng ta hôm nay. Có thể một ngày nào đó, khi nhìn lại chặng đường này, {salutation} sẽ nhận ra rằng mình đã góp phần tạo nên một điều gì đó đáng tự hào.
            </p>

            {/* Câu trích dẫn trung tâm phong cách cổ điển */}
            <p className="font-serif italic text-base md:text-lg text-amber-900 text-center my-6 py-3.5 border-y border-amber-900/20 bg-amber-50/70 rounded-xl px-4">
              "Không nhất thiết phải là một thành tựu lớn. Đôi khi, đó là một công việc bạn đã làm đến cùng. Một đồng nghiệp bạn đã giúp đỡ. Một khách hàng bạn đã giữ trọn niềm tin. Một điều mới bạn đã dũng cảm học hỏi. Hay một giá trị tốt đẹp bạn đã trao lại cho người đến sau."
            </p>

            <p>
              Và khi nghĩ về những năm tháng phía trước, chúng tôi mong {salutation} sẽ luôn giữ cho mình:
            </p>
            <ul className="list-disc pl-6 space-y-2 font-semibold text-blue-950">
              <li><strong>Tâm khát vọng</strong> – để không ngừng hướng tới những điều tốt đẹp hơn.</li>
              <li><strong>Chí vươn cao</strong> – để dám bước tiếp, dám học hỏi và cùng nhau chinh phục những chân trời mới.</li>
            </ul>
            <p>
              Bởi <em>Beaming Forward</em> không chỉ là hướng về phía trước, mà còn là tiến về phía trước với niềm tin, niềm tự hào và ánh sáng khát vọng từ bên trong mỗi người.
            </p>
            
            {/* Hộp câu hỏi suy ngẫm cho 25 năm sau */}
            <div className="bg-blue-950 text-white rounded-2xl p-6 md:p-8 my-7 shadow-xl border-2 border-amber-400/50">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-amber-400 text-xl">⏳</span>
                <h4 className="font-serif text-amber-300 text-lg md:text-xl font-bold">
                  Dành một chút thời gian cho chính mình...
                </h4>
              </div>
              <p className="text-sm md:text-base text-slate-100 leading-relaxed mb-4">
                Hãy thử tưởng tượng, 25 năm sau, một thế hệ người CTIN mới đang nhìn lại hành trình mà chúng ta đang viết hôm nay.<br />
                <strong className="text-amber-200">{salutation} mong họ sẽ nhớ đến điều gì về thế hệ chúng ta? Và {salutation} muốn mình đã góp phần tạo nên điều gì trong câu chuyện ấy?</strong>
              </p>
              <p className="text-xs text-slate-300 italic">
                {salutation} không cần trả lời ngay. Chỉ mong rằng, khi trở lại với công việc thường ngày, {salutation} sẽ mang theo những câu hỏi ấy như một lời nhắc nhở về những điều mình tin tưởng và muốn tiếp tục vun đắp.
              </p>
            </div>

            <p className="font-serif font-bold text-blue-950 text-lg md:text-xl text-center mt-6">
              Cảm ơn {salutation} vì mỗi ngày đã cùng CTIN.<br />
              Và cảm ơn vì những ngày chúng ta sẽ còn cùng nhau viết tiếp.
            </p>
          </div>

          {/* Chân trang & Thao tác ban đầu */}
          <div className="mt-8 pt-6 border-t-2 border-amber-900/15 flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="text-center md:text-left">
              <p className="font-serif text-xs text-amber-900 tracking-widest font-bold">BEAMING FORWARD</p>
              <p className="font-serif text-xl md:text-2xl font-extrabold text-blue-950">Tâm khát vọng – Chí vươn cao</p>
              <p className="text-xs text-slate-600 mt-0.5">CTIN · Success together</p>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={handlePrint} 
                className="px-5 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-amber-300 font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>📥</span> Lưu Lá Thư Kỷ Niệm (PDF)
              </button>
              <button 
                onClick={() => setIsLetterOpened(false)} 
                className="px-4 py-2.5 rounded-xl border border-amber-900/40 text-amber-950 font-bold text-xs hover:bg-amber-100 transition-all cursor-pointer"
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
