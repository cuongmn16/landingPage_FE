import React from 'react';
import { M1_CARDS } from '../../data/mission1Data';

export default function M1ClustersWorkspace({
  selectedCards,
  confirmedClusters,
  onClearSelected,
  onRemoveCardFromDraft,
  onConfirmCluster,
  onDeleteCluster
}) {
  const selectedDetails = selectedCards
    .map(id => M1_CARDS.find(c => c.id === id))
    .filter(Boolean);

  const hasGroupB = selectedDetails.some(c => c.group === 'B');
  const canConfirm = hasGroupB && selectedDetails.length >= 2;

  return (
    <section className="m1-section m1-section--light" id="m1-clusters">
      <div className="container">
        <p className="m1-section__label mono">SECTION 04 — KHÔNG GIAN GHÉP</p>
        <h2 className="m1-section__title">Cụm manh mối đã ghép</h2>
        <p className="m1-section__desc">
          Chọn 1 thẻ B làm mốc neo → chọn các thẻ C, D, E liên quan → Xác nhận cụm.
          Có thể xóa cụm bất kỳ lúc nào trước hạn nộp.
        </p>

        <div className="m1-cluster-current">
          <div className="m1-cluster-current__head">
            <h3 className="m1-cluster-current__title">Cụm đang tạo</h3>
            {selectedCards.length > 0 && (
              <button
                className="m1-cluster-current__clear"
                onClick={onClearSelected}
                type="button"
              >
                Xóa chọn ({selectedCards.length})
              </button>
            )}
          </div>

          <div className="m1-cluster-current__slots">
            {!selectedCards.length ? (
              <p style={{ fontSize: '0.88rem', color: 'var(--clr-ink-3)', fontStyle: 'italic' }}>
                Chưa chọn thẻ nào. Vui lòng bấm "+ Ghép cụm" ở Kho manh mối phía trên.
              </p>
            ) : (
              selectedDetails.map(card => (
                <span key={card.id} className="m1-cluster-chip">
                  <span><strong>[{card.id}]</strong> {card.teaser}</span>
                  <span
                    className="m1-cluster-chip__remove"
                    onClick={() => onRemoveCardFromDraft(card.id)}
                    title="Bỏ khỏi cụm"
                  >
                    &times;
                  </span>
                </span>
              ))
            )}
          </div>

          <button
            className="btn btn--gold"
            type="button"
            disabled={!canConfirm}
            onClick={onConfirmCluster}
          >
            {canConfirm
              ? 'Xác nhận cụm này'
              : !hasGroupB
              ? 'Cần 1 thẻ B (Time Fragment) làm mốc neo'
              : 'Cần ít nhất 2 thẻ để ghép cụm'}
          </button>
        </div>

        <h3 className="htp__subtitle" style={{ marginTop: '32px' }}>
          Các cụm đã xác nhận ({confirmedClusters.length})
        </h3>

        {!confirmedClusters.length ? (
          <div className="empty-state" style={{ padding: '32px' }}>
            <p className="empty-state__desc">Chưa có cụm nào được xác nhận.</p>
          </div>
        ) : (
          <div className="m1-clusters-list">
            {confirmedClusters.map((cluster, idx) => {
              const anchor = M1_CARDS.find(c => c.id === cluster.anchorId);
              const cardDetails = (cluster.cardIds || [])
                .map(id => M1_CARDS.find(c => c.id === id))
                .filter(Boolean);

              return (
                <div key={idx} className="m1-cluster-item">
                  <div className="m1-cluster-item__info">
                    <h4 className="m1-cluster-item__title">
                      Cụm #{idx + 1}: {anchor ? `${anchor.id} — ${anchor.teaser}` : 'Cụm'}
                    </h4>
                    <div className="m1-cluster-item__chips">
                      {cardDetails.map(c => (
                        <span key={c.id} className="m1-cluster-chip">
                          <strong>[{c.id}]</strong> {c.teaser}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    className="btn btn--outline"
                    style={{ fontSize: '0.8rem', padding: '8px 14px' }}
                    onClick={() => onDeleteCluster(idx)}
                  >
                    Xóa cụm
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
