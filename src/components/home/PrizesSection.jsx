import React, { useState } from 'react';
import { PRIZES } from '../../data/appData';

export default function PrizesSection() {
  const [activeTab, setActiveTab] = useState('team');
  const [showCalc, setShowCalc] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);

  return (
    <section className="section" id="prizes">
      <div className="container">
        <p className="section__label mono reveal is-visible">REWARDS — GIẢI THƯỞNG</p>
        <h2 className="section__title reveal is-visible">Cơ cấu Giải thưởng</h2>

        {/* Lớp 1: 3 nhóm giải */}
        <div className="prizes__tabs reveal is-visible" role="tablist">
          <button
            type="button"
            className={`prizes__tab ${activeTab === 'team' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('team')}
          >
            Đoàn thám hiểm đồng lòng
          </button>
          <button
            type="button"
            className={`prizes__tab ${activeTab === 'explorer' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('explorer')}
          >
            Nhà khám phá
          </button>
          <button
            type="button"
            className={`prizes__tab ${activeTab === 'outstanding' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('outstanding')}
          >
            05 Nhà khám phá xuất sắc
          </button>
        </div>

        <div className="prizes__panel">
          {activeTab === 'team' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <span className="status-badge status-available status-badge--sm" style={{ marginBottom: '8px', display: 'inline-block' }}>
                  {PRIZES.team.subtitle}
                </span>
                <h3 style={{ fontFamily: 'var(--ff-heading)', fontSize: '1.35rem', color: 'var(--clr-ink)', marginBottom: '8px' }}>
                  {PRIZES.team.title}
                </h3>
                <p style={{ color: 'var(--clr-ink-2)', lineHeight: 1.65 }}>
                  {PRIZES.team.desc}
                </p>
              </div>
              <div className="prizes__grid">
                {PRIZES.team.tiers.map((t, i) => (
                  <article key={i} className="prize-card">
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--clr-orange-dark)', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Số lượng: {t.count} giải
                    </div>
                    <h3 className="prize-card__title">{t.rank}</h3>
                    <p className="prize-card__desc" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--clr-blue)', marginTop: '6px' }}>
                      {t.value}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'explorer' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <span className="status-badge status-available status-badge--sm" style={{ marginBottom: '8px', display: 'inline-block' }}>
                  {PRIZES.explorer.subtitle}
                </span>
                <h3 style={{ fontFamily: 'var(--ff-heading)', fontSize: '1.35rem', color: 'var(--clr-ink)', marginBottom: '8px' }}>
                  {PRIZES.explorer.title}
                </h3>
                <p style={{ color: 'var(--clr-ink-2)', lineHeight: 1.65 }}>
                  {PRIZES.explorer.desc}
                </p>
              </div>
              <div className="prizes__grid">
                {PRIZES.explorer.tiers.map((t, i) => (
                  <article key={i} className="prize-card" style={i === 0 ? { opacity: 0.75 } : {}}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--clr-ink-3)', textTransform: 'uppercase', marginBottom: '6px' }}>
                      {t.missions} nhiệm vụ hợp lệ
                    </div>
                    <h3 className="prize-card__title">{t.title}</h3>
                    <p className="prize-card__desc" style={{ fontSize: '1.1rem', fontWeight: 700, color: i === 0 ? 'var(--clr-ink-3)' : 'var(--clr-blue)', marginTop: '6px' }}>
                      {t.reward}
                    </p>
                  </article>
                ))}
              </div>
              <p style={{ marginTop: '18px', padding: '12px 16px', background: 'var(--clr-orange-pale)', borderLeft: '4px solid var(--clr-orange)', borderRadius: '6px', fontWeight: 600, color: 'var(--clr-ink)' }}>
                💡 {PRIZES.explorer.highlight}
              </p>
            </div>
          )}

          {activeTab === 'outstanding' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <span className="status-badge status-available status-badge--sm" style={{ marginBottom: '8px', display: 'inline-block' }}>
                  {PRIZES.outstanding.subtitle}
                </span>
                <h3 style={{ fontFamily: 'var(--ff-heading)', fontSize: '1.35rem', color: 'var(--clr-ink)', marginBottom: '8px' }}>
                  {PRIZES.outstanding.title}
                </h3>
                <p style={{ color: 'var(--clr-ink-2)', lineHeight: 1.65 }}>
                  {PRIZES.outstanding.desc}
                </p>
              </div>
              <div className="prizes__grid">
                {PRIZES.outstanding.criteria.map((c, i) => (
                  <article key={i} className="prize-card">
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--clr-orange-dark)', marginBottom: '6px' }}>
                      NHÓM TIÊU CHÍ 0{i + 1}
                    </div>
                    <h3 className="prize-card__title">{c.name}</h3>
                    <p className="prize-card__desc">{c.desc}</p>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Lớp 2 & Lớp 3: Nút Xem cách tính và Xem thể lệ chi tiết */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '24px' }}>
          <button
            type="button"
            className="btn btn--outline"
            onClick={() => setShowCalc(prev => !prev)}
          >
            {showCalc ? 'Ẩn cách tính giải & xếp hạng ▲' : 'Cách tính giải & xử lý đồng hạng ▼'}
          </button>
          <button
            type="button"
            className="btn btn--gold"
            onClick={() => setShowRulesModal(true)}
          >
            📖 Xem thể lệ chi tiết
          </button>
        </div>

        {/* Lớp 2: Khối mở rộng Cách tính */}
        {showCalc && (
          <div style={{ marginTop: '20px', background: '#FFFFFF', border: '1px solid var(--clr-line)', borderRadius: '12px', padding: '24px 28px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontFamily: 'var(--ff-heading)', fontSize: '1.15rem', marginBottom: '12px', color: 'var(--clr-ink)' }}>
              Công thức tính Tỷ lệ chinh phục (Giải tập thể)
            </h3>
            <div style={{ padding: '14px 18px', background: 'var(--clr-blue-pale)', borderLeft: '4px solid var(--clr-blue)', borderRadius: '6px', fontWeight: 600, color: 'var(--clr-blue-dark)', marginBottom: '12px' }}>
              {PRIZES.calculation.formula}
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--clr-ink-2)', marginBottom: '12px' }}>
              <strong>Ví dụ:</strong> {PRIZES.calculation.example}
            </p>
            <ul style={{ paddingLeft: '20px', color: 'var(--clr-ink-2)', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '18px' }}>
              {PRIZES.calculation.notes.map((n, idx) => <li key={idx}>{n}</li>)}
            </ul>

            <h4 style={{ fontFamily: 'var(--ff-heading)', fontSize: '1.05rem', marginBottom: '8px', color: 'var(--clr-ink)' }}>
              Nguyên tắc xử lý đồng hạng
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--clr-ink-2)', marginBottom: '8px' }}>
              Nếu từ hai đơn vị trở lên có cùng tỷ lệ chinh phục, hệ thống xếp hạng lần lượt theo:
            </p>
            <ol style={{ paddingLeft: '20px', color: 'var(--clr-ink-2)', fontSize: '0.9rem', lineHeight: 1.65 }}>
              {PRIZES.calculation.tieBreakers.map((tb, idx) => <li key={idx}>{tb}</li>)}
            </ol>
          </div>
        )}

        <p className="prizes__note">{PRIZES.note}</p>
      </div>

      {/* Lớp 3: Modal Thể lệ đầy đủ */}
      {showRulesModal && (
        <div className="modal is-open" role="dialog" aria-modal="true" aria-label="Thể lệ chi tiết">
          <div className="modal__backdrop" onClick={() => setShowRulesModal(false)}></div>
          <div className="modal__panel modal__panel--large" style={{ maxHeight: '88vh', overflowY: 'auto' }}>
            <button className="modal__close" onClick={() => setShowRulesModal(false)} aria-label="Đóng">&times;</button>
            <div style={{ textAlign: 'left', color: 'var(--clr-ink)', lineHeight: 1.65 }}>
              <p className="mono" style={{ color: 'var(--clr-orange)', fontSize: '0.78rem', fontWeight: 700 }}>
                CTIN TREASURE HUNT · THỂ LỆ CHI TIẾT
              </p>
              <h2 style={{ fontFamily: 'var(--ff-heading)', fontSize: '1.5rem', marginBottom: '16px' }}>
                Thể lệ Giải thưởng &amp; Quy định chương trình
              </h2>

              <h3 style={{ fontSize: '1.08rem', fontWeight: 700, marginTop: '18px', marginBottom: '8px', color: 'var(--clr-blue)' }}>
                1. Mục đích và cơ cấu ba nhóm giải
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--clr-ink-2)' }}>
                Chương trình gồm 03 nhóm giải thưởng nhằm khuyến khích toàn thể CBNV CTIN cùng khám phá hành trình phát triển của Công ty, lưu giữ những câu chuyện di sản và đóng góp vào kết quả chung của đơn vị:
              </p>
              <ul style={{ paddingLeft: '20px', fontSize: '0.92rem', color: 'var(--clr-ink-2)' }}>
                <li><strong>Giải tập thể – Đoàn thám hiểm đồng lòng:</strong> 01 Giải Nhất (10.000.000đ), 01 Giải Nhì (8.000.000đ), 01 Giải Ba (5.000.000đ), 06 Giải Khuyến khích (3.000.000đ/giải).</li>
                <li><strong>Danh hiệu &amp; thưởng cá nhân – Nhà khám phá:</strong> Thưởng 200.000đ (02 nhiệm vụ hợp lệ), 300.000đ (03 nhiệm vụ hợp lệ), 400.000đ (04 nhiệm vụ hợp lệ).</li>
                <li><strong>Giải cá nhân xuất sắc – 05 Nhà khám phá xuất sắc:</strong> Tôn vinh 05 người chơi có bài làm nổi bật nhất toàn chương trình.</li>
              </ul>

              <h3 style={{ fontSize: '1.08rem', fontWeight: 700, marginTop: '18px', marginBottom: '8px', color: 'var(--clr-blue)' }}>
                2. Quy định chung và định nghĩa nhiệm vụ hợp lệ
              </h3>
              <ul style={{ paddingLeft: '20px', fontSize: '0.92rem', color: 'var(--clr-ink-2)' }}>
                <li><strong>Chưa thực hiện / Đang thực hiện:</strong> Chưa hoàn thành hoặc mới lưu nháp — không tính vào kết quả.</li>
                <li><strong>Chờ xác nhận:</strong> Đã nộp, cần Ban Tổ chức kiểm tra đối với nhiệm vụ có nội dung tự luận hoặc tải tệp.</li>
                <li><strong>Hợp lệ:</strong> Đã đáp ứng đủ yêu cầu và được hệ thống hoặc Ban Tổ chức xác nhận — được tính chính thức vào kết quả cá nhân và đơn vị.</li>
                <li><strong>Không hợp lệ:</strong> Thiếu nội dung, sao chép, vi phạm quy định hoặc không xác minh được — không tính vào kết quả.</li>
              </ul>

              <h3 style={{ fontSize: '1.08rem', fontWeight: 700, marginTop: '18px', marginBottom: '8px', color: 'var(--clr-blue)' }}>
                3. Giải tập thể – Đoàn thám hiểm đồng lòng
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--clr-ink-2)' }}>
                <strong>Công thức:</strong> <code>{PRIZES.calculation.formula}</code>
              </p>
              <ul style={{ paddingLeft: '20px', fontSize: '0.92rem', color: 'var(--clr-ink-2)' }}>
                {PRIZES.calculation.notes.map((n, i) => <li key={i}>{n}</li>)}
                <li><strong>Ví dụ:</strong> {PRIZES.calculation.example}</li>
              </ul>

              <h3 style={{ fontSize: '1.08rem', fontWeight: 700, marginTop: '18px', marginBottom: '8px', color: 'var(--clr-blue)' }}>
                4. Thứ tự xử lý đồng hạng đơn vị
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--clr-ink-2)' }}>
                Nếu từ hai đơn vị trở lên có cùng tỷ lệ chinh phục, hệ thống xếp hạng lần lượt theo:
              </p>
              <ol style={{ paddingLeft: '20px', fontSize: '0.92rem', color: 'var(--clr-ink-2)' }}>
                {PRIZES.calculation.tieBreakers.map((tb, i) => <li key={i}>{tb}</li>)}
              </ol>

              <h3 style={{ fontSize: '1.08rem', fontWeight: 700, marginTop: '18px', marginBottom: '8px', color: 'var(--clr-blue)' }}>
                5. Danh hiệu cá nhân – Nhà khám phá
              </h3>
              <ul style={{ paddingLeft: '20px', fontSize: '0.92rem', color: 'var(--clr-ink-2)' }}>
                <li>Người chơi hoàn thành dưới 02 nhiệm vụ hợp lệ: chưa đủ điều kiện nhận danh hiệu Nhà khám phá (mức thưởng: 0 đồng).</li>
                <li>Người chơi hoàn thành từ 02 đến 04 nhiệm vụ hợp lệ: đạt danh hiệu <strong>Nhà khám phá</strong> với mức thưởng = <code>Số nhiệm vụ hợp lệ × 100.000 đồng</code> (tối đa 400.000 đồng).</li>
                <li>Một nhiệm vụ chỉ được tính một lần cho mỗi người chơi, kể cả khi chỉnh sửa và nộp lại.</li>
                <li>Mức thưởng hiển thị là dự kiến khi chương trình chưa chốt và chuyển thành chính thức sau khi Ban Tổ chức khóa kết quả.</li>
              </ul>

              <h3 style={{ fontSize: '1.08rem', fontWeight: 700, marginTop: '18px', marginBottom: '8px', color: 'var(--clr-blue)' }}>
                6. Giải 05 Nhà khám phá xuất sắc
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--clr-ink-2)' }}>
                Điều kiện vào danh sách xét: hoàn thành hợp lệ ít nhất 02 nhiệm vụ và có bài làm đáp ứng nổi bật ít nhất một trong bốn nhóm tiêu chí:
              </p>
              <ul style={{ paddingLeft: '20px', fontSize: '0.92rem', color: 'var(--clr-ink-2)' }}>
                {PRIZES.outstanding.criteria.map((c, i) => (
                  <li key={i}><strong>{c.name}:</strong> {c.desc}</li>
                ))}
              </ul>
              <p style={{ fontSize: '0.92rem', color: 'var(--clr-ink-2)' }}>
                Một người chỉ nhận tối đa 01 giải Nhà khám phá xuất sắc. Ban Tổ chức/Hội đồng đánh giá lựa chọn 05 người xuất sắc nhất toàn chương trình.
              </p>

              <h3 style={{ fontSize: '1.08rem', fontWeight: 700, marginTop: '18px', marginBottom: '8px', color: 'var(--clr-blue)' }}>
                7. Quy định xác minh, sử dụng nội dung và công bố kết quả
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--clr-ink-2)' }}>
                Khi tham gia và nộp bài, người chơi xác nhận: <em>“Tôi đã đọc và đồng ý với Thể lệ chương trình; đồng thời đồng ý để Ban Tổ chức sử dụng các nội dung, hình ảnh và tư liệu phù hợp cho mục đích lưu trữ, truyền thông và giới thiệu về hành trình CTIN.”</em> Quyết định cuối cùng thuộc về Ban Tổ chức.
              </p>

              <div style={{ marginTop: '24px', textAlign: 'right' }}>
                <button type="button" className="btn btn--gold" onClick={() => setShowRulesModal(false)}>
                  Đã hiểu &amp; Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
