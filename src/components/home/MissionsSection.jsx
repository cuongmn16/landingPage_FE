import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MISSIONS, getSubmissionStatus } from '../../data/appData';
import { api, auth } from '../../services/api';
import MissionSubmitModal from '../common/MissionSubmitModal';

export default function MissionsSection() {
  const navigate = useNavigate();
  const [selectedMissionId, setSelectedMissionId] = useState('1');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [userSubmissions, setUserSubmissions] = useState([]);

  const fetchUserSubmissions = async () => {
    if (auth.isLoggedIn() && !auth.isAdmin()) {
      try {
        const subs = await api.getUserSubmissions();
        setUserSubmissions(subs || []);
      } catch (e) {}
    } else {
      setUserSubmissions([]);
    }
  };

  useEffect(() => {
    fetchUserSubmissions();
  }, []);

  const handleMissionClick = (mId) => {
    const num = String(mId).replace(/[^0-9]/g, '') || '1';
    // Mission 1, 2, 3, 4 có trang chơi riêng (theo tab, tự lưu tiến trình, nộp bài)
    if (['1', '2', '3', '4'].includes(num)) {
      navigate(`/mission-${num}`);
      return;
    }
    if (!auth.isLoggedIn()) {
      navigate('/login');
      return;
    }
    if (auth.isAdmin()) {
      navigate('/admin?tab=submissions');
      return;
    }
    setSelectedMissionId(num);
    setIsSubmitModalOpen(true);
  };

  return (
    <section className="section section--light" id="missions">
      <div className="container">
        <p className="section__label mono reveal is-visible">CLASSIFIED — 04 MISSIONS</p>
        <h2 className="section__title reveal is-visible">04 Mission</h2>
        <p className="section__desc reveal is-visible">
          Mỗi Mission là một hồ sơ được mở khóa, dẫn bạn đến gần hơn với kho báu di sản CTIN. Bấm vào từng Mission để khám phá và nộp bài.
        </p>
        <div className="missions__path">
          {MISSIONS.map((m, i) => {
            const side = i % 2 === 0 ? 'right' : 'left';
            const num = String(m.num || m.id).replace(/[^0-9]/g, '');
            const sub = userSubmissions.find(s => Number(s.mission_id) === Number(num));
            const subSt = sub ? getSubmissionStatus(sub) : null;

            return (
              <div key={m.id} className={`mission-row mission-row--${side}`}>
                <article
                  className="mission-card-m reveal is-visible"
                  onClick={() => handleMissionClick(m.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Mở Mission ${m.num}`}
                  style={{ cursor: 'pointer', border: sub ? '2px solid #28a745' : undefined }}
                >
                  <div className="mission-card-m__num">{m.num}</div>
                  <h3 className="mission-card-m__name">{m.name}</h3>

                  {subSt && (
                    <div style={{ marginBottom: '8px' }}>
                      <span className={`status-badge ${subSt.cls}`} style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                        ✓ {subSt.label}
                      </span>
                    </div>
                  )}

                  <p className="mission-card-m__focus">{m.focus}</p>
                  <div className="mission-card-m__meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>⏱ {m.duration}</span>
                    <span style={{ color: sub ? '#28a745' : 'var(--clr-gold-dark, #0056b3)', fontWeight: 'bold', fontSize: '0.85rem' }}>
                      {sub ? '✓ Xem bài / Nộp lại →' : 'Nộp bài →'}
                    </span>
                  </div>
                </article>
                <div className="mission-node" aria-hidden="true" style={{ background: sub ? '#28a745' : undefined, color: sub ? '#fff' : undefined }}>
                  {m.num}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MISSION SUBMISSION MODAL FOR ALL 4 MISSIONS */}
      <MissionSubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => {
          setIsSubmitModalOpen(false);
          fetchUserSubmissions();
        }}
        initialMissionId={selectedMissionId}
        onSuccess={() => {
          fetchUserSubmissions();
        }}
      />
    </section>
  );
}
