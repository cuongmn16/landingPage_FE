import React, { useState } from 'react';
import MissionSubmitModal from '../common/MissionSubmitModal';

export default function M1SubmitCTA() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="m1-section m1-section--cta" id="m1-submit">
      <div className="container m1-submit__inner">
        <p className="m1-section__label mono">FINAL STEP — NỘP BÀI ONLINE</p>
        <h2 className="m1-submit__title">Sẵn sàng nộp bài Mission?</h2>
        <ul className="m1-submit__checklist">
          <li>Định dạng cho phép: JPG, PNG, PDF, DOCX</li>
          <li>Dung lượng tối đa: 10 MB / tệp (Tối đa 5 tệp / Mission)</li>
          <li>Hệ thống tự động ghi nhận nhân sự, email, đơn vị, thời gian và lưu bản mới nhất</li>
        </ul>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn--gold btn--large"
          >
            🚀 Nộp bài trực tuyến (Spring Boot &amp; MinIO) →
          </button>
        </div>

        <p className="m1-submit__note" style={{ marginTop: '12px' }}>
          Bài nộp được tự động lưu trữ an toàn trên MinIO Object Storage &amp; cơ sở dữ liệu PostgreSQL.
        </p>

        <MissionSubmitModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </section>
  );
}
