import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

export default function UnitsSection() {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedUnit, setSelectedUnit] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [participantsError, setParticipantsError] = useState(null);

  useEffect(() => {
    async function loadUnits() {
      try {
        setUnits(await api.getUnitProgress());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadUnits();
  }, []);

  const openUnit = async (unit) => {
    setSelectedUnit(unit);
    setParticipants([]);
    setParticipantsError(null);
    setParticipantsLoading(true);
    try {
      setParticipants(await api.getUnitParticipants(unit.unit_id));
    } catch (err) {
      setParticipantsError(err.message);
    } finally {
      setParticipantsLoading(false);
    }
  };

  const closeUnit = () => setSelectedUnit(null);

  return (
    <section className="section" id="progress">
      <div className="container">
        <p className="section__label mono reveal is-visible">UNITS — TIẾN ĐỘ ĐƠN VỊ</p>
        <h2 className="section__title reveal is-visible">Tiến độ đơn vị</h2>
        <p className="section__desc reveal is-visible">
          Số CBNV tham gia hợp lệ được cập nhật sau khi BTC xác minh. Bấm vào từng đơn vị để xem danh sách.
        </p>

        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--clr-ink-3)', padding: '24px' }}>Đang tải tiến độ đơn vị…</p>
        ) : error ? (
          <p style={{ textAlign: 'center', color: '#C25B5B', padding: '24px' }}>Không tải được tiến độ đơn vị: {error}</p>
        ) : units.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--clr-ink-3)', padding: '24px' }}>Chưa có đơn vị nào.</p>
        ) : (
          <div className="hunters__grid">
            {units.map((u) => (
              <button
                key={u.unit_id}
                type="button"
                className="hunter-card unit-card reveal is-visible"
                onClick={() => openUnit(u)}
              >
                <div className="hunter-card__head">
                  <div className="hunter-card__avatar">{u.unit_name.charAt(0)}</div>
                  <div>
                    <h3 className="hunter-card__name">{u.unit_name}</h3>
                    <p className="hunter-card__unit">Xem danh sách người tham gia →</p>
                  </div>
                </div>
                <p className="unit-card__count">
                  <strong>{u.participant_count}</strong> người tham gia
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedUnit && (
        <div className="modal is-open" role="dialog" aria-modal="true">
          <div className="modal__backdrop" onClick={closeUnit}></div>
          <div className="modal__panel">
            <button className="modal__close" onClick={closeUnit} aria-label="Đóng">&times;</button>
            <p className="mono modal__label">Tiến độ đơn vị</p>
            <h3 className="modal__title">{selectedUnit.unit_name}</h3>

            {participantsLoading ? (
              <p style={{ color: 'var(--clr-ink-3)' }}>Đang tải danh sách…</p>
            ) : participantsError ? (
              <p style={{ color: '#C25B5B' }}>Không tải được danh sách: {participantsError}</p>
            ) : participants.length === 0 ? (
              <p style={{ color: 'var(--clr-ink-3)' }}>Đơn vị chưa có người tham gia hợp lệ.</p>
            ) : (
              <>
                <p className="unit-card__count" style={{ marginBottom: '12px' }}>
                  <strong>{participants.length}</strong> người tham gia
                </p>
                <ol className="unit-participants">
                  {participants.map((p, i) => (
                    <li key={p.employee_id} className="unit-participants__item">
                      <span className="unit-participants__name"><span className="unit-participants__index">{i + 1}.</span>{p.full_name}</span>
                      <span className="unit-participants__meta">{p.valid_submissions} bài hợp lệ</span>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
