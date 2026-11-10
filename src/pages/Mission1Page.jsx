/* ============================================================
   MISSION 1 PAGE — JOURNEY MAP (6 tab, port từ src_demo/mission-1)
   - User / Guest: chơi và xem giao diện theo 6 tab; tiến trình tự lưu.
     Nộp bài → gửi về admin chấm.
   - Admin: có thể chuyển đổi giữa xem giao diện chơi và xem danh sách bài nộp.
   ============================================================ */
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  M1_CONFIG, M1_TABS, M1_INTRO, M1_TIMELINE, M1_MEANINGS, M1_STAGES, M1_YEAR_OPTIONS,
  M1_STAGE_NAMES, M1_STAGE_EVENTS, M1_TRANSFORMS, M1_LEGACIES, M1_SPIRIT_OPTIONS,
  M1_RED_THREAD, M1_EVIDENCE, M1_FEEDBACK, M1_COMPLETE,
  m1FmtDateTime as fmtDateTime
} from '../data/mission1Data';
import {
  api, auth, submitMissionResponseApi, getMissionProgressApi, saveMissionProgressApi
} from '../services/api';
import { getSubmissionStatus } from '../data/appData';
import WrapSelect from '../components/mission/WrapSelect';
import '../styles/mission1.css';

const LS_PREFIX = 'ctin_th_m1_v3_';
const ADMIN_SHOW_LIMIT = 6;
const SYNC_DELAY_MS = 1500;

/* ---------- Helpers ---------- */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function countWords(text) {
  return (text || '').trim().split(/\s+/).filter(Boolean).length;
}

/* Thứ tự đáp án được xáo một lần rồi lưu cùng tiến trình, để vào lại vẫn giữ nguyên */
function buildOrder() {
  const transforms = {};
  M1_TRANSFORMS.forEach(t => {
    transforms[t.stageId] = {
      contexts: shuffle([
        { id: t.contextId, text: t.context },
        ...t.distractors.contexts.map((txt, i) => ({ id: `${t.contextId}_d${i}`, text: txt }))
      ]),
      changes: shuffle([
        { id: t.changeId, text: t.change },
        ...t.distractors.changes.map((txt, i) => ({ id: `${t.changeId}_d${i}`, text: txt }))
      ])
    };
  });
  return {
    meanings: shuffle(M1_MEANINGS),
    names: shuffle(M1_STAGE_NAMES),
    events: shuffle(M1_STAGE_EVENTS),
    transforms,
    spirits: shuffle(M1_SPIRIT_OPTIONS),
    redThread: shuffle(M1_RED_THREAD.options)
  };
}

/* Đồng bộ nhãn text mới nhất từ mission1Data V2 trong khi giữ nguyên thứ tự xáo trộn đã lưu */
function refreshOrderTexts(savedOrder) {
  const fresh = buildOrder();
  if (!savedOrder || typeof savedOrder !== 'object') return fresh;

  const mapById = (arr) => new Map((arr || []).map(item => [item.id, item.text]));
  const syncList = (oldList, refArr) => {
    if (!Array.isArray(oldList) || oldList.length !== refArr.length) return shuffle(refArr);
    const lookup = mapById(refArr);
    return oldList.map(item => ({ id: item.id, text: lookup.get(item.id) || item.text }));
  };

  const transforms = {};
  M1_TRANSFORMS.forEach(t => {
    const refContexts = [
      { id: t.contextId, text: t.context },
      ...t.distractors.contexts.map((txt, i) => ({ id: `${t.contextId}_d${i}`, text: txt }))
    ];
    const refChanges = [
      { id: t.changeId, text: t.change },
      ...t.distractors.changes.map((txt, i) => ({ id: `${t.changeId}_d${i}`, text: txt }))
    ];
    const oldTf = savedOrder.transforms?.[t.stageId];
    transforms[t.stageId] = {
      contexts: syncList(oldTf?.contexts, refContexts),
      changes: syncList(oldTf?.changes, refChanges)
    };
  });

  return {
    meanings: syncList(savedOrder.meanings, M1_MEANINGS),
    names: syncList(savedOrder.names, M1_STAGE_NAMES),
    events: syncList(savedOrder.events, M1_STAGE_EVENTS),
    transforms,
    spirits: syncList(savedOrder.spirits, M1_SPIRIT_OPTIONS),
    redThread: syncList(savedOrder.redThread, M1_RED_THREAD.options)
  };
}

const defaultState = () => ({
  agreed: false,
  timeline: {},
  stages: {},
  transforms: {},
  legacies: {},
  redThread: null,
  reflection: '',
  altStages: '',
  currentTab: 1,
  submittedAt: null,
  savedAt: null,
  order: buildOrder()
});

function normalizeState(data) {
  const base = defaultState();
  if (!data || typeof data !== 'object') return base;
  return { ...base, ...data, order: refreshOrderTexts(data.order) };
}

function loadState(key) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return normalizeState(JSON.parse(raw));
  } catch { /* storage unavailable */ }
  return defaultState();
}

const savedTime = (s) => (s && s.savedAt ? new Date(s.savedAt).getTime() || 0 : 0);

function saveState(key, state) {
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch { /* storage unavailable */ }
}

/* ---------- Validation ---------- */
const isTimelineComplete = (s) => M1_TIMELINE.every(t => s.timeline[t.id] === t.meaningId);

const isStageCorrect = (stage, ans) => !!ans &&
  Number(ans.start) === Number(stage.start) &&
  String(ans.end) === String(stage.end) &&
  ans.nameId === stage.nameId &&
  ans.eventId === stage.eventId;

const isStagesComplete = (s) => M1_STAGES.every(st => isStageCorrect(st, s.stages[st.id]));

const isTransformCorrect = (t, ans) => !!ans && ans.contextId === t.contextId && ans.changeId === t.changeId;

const isTransformsComplete = (s) => M1_TRANSFORMS.every(t => isTransformCorrect(t, s.transforms[t.stageId]));

const isLegaciesComplete = (s) => M1_LEGACIES.every(l => s.legacies[l.stageId] === l.spiritId);

const isRedThreadCorrect = (s) => s.redThread === M1_RED_THREAD.correctId;

const isReflectionValid = (s) => {
  const n = countWords(s.reflection);
  return n >= 15;
};

const isTab5Complete = (s) => isLegaciesComplete(s) && isRedThreadCorrect(s) && isReflectionValid(s);

const isAllValid = (s) => s.agreed && isTimelineComplete(s) && isStagesComplete(s) &&
  isTransformsComplete(s) && isTab5Complete(s);

function maxReachableTab(s) {
  let max = 1;
  if (s.agreed) max = 2;
  if (max === 2 && isTimelineComplete(s)) max = 3;
  if (max === 3 && isStagesComplete(s)) max = 4;
  if (max === 4 && isTransformsComplete(s)) max = 5;
  if (max === 5 && isTab5Complete(s)) max = 6;
  return max;
}

function canLeaveTab(tab, s) {
  switch (tab) {
    case 1: return s.agreed;
    case 2: return isTimelineComplete(s);
    case 3: return isStagesComplete(s);
    case 4: return isTransformsComplete(s);
    case 5: return isTab5Complete(s);
    default: return false;
  }
}

/* Nội dung dễ đọc gửi cho admin chấm (hiển thị ở mục "Ghi chú / Trả lời") */
function buildSubmissionText(s) {
  const rt = M1_RED_THREAD.options.find(o => o.id === s.redThread);
  const lines = [
    `MISSION 01 · ${M1_CONFIG.title} — ${M1_CONFIG.subtitle}`,
    '',
    'BẢNG KIỂM:',
    `✓ ${M1_TIMELINE.length}/${M1_TIMELINE.length} mốc thời gian kết nối đúng`,
    `✓ ${M1_STAGES.length}/${M1_STAGES.length} giai đoạn: năm, tên, sự kiện tạo đà đúng`,
    `✓ ${M1_TRANSFORMS.length}/${M1_TRANSFORMS.length} giai đoạn: bối cảnh & chuyển biến đúng`,
    `✓ ${M1_LEGACIES.length}/${M1_LEGACIES.length} di sản được chọn đúng`,
    '✓ Sợi chỉ đỏ đúng',
    '',
    'SỢI CHỈ ĐỎ:',
    rt ? rt.text : '—',
    '',
    `ĐIỀU TÔI HIỂU RÕ HƠN VỀ CTIN (${countWords(s.reflection)} từ):`,
    (s.reflection || '').trim()
  ];
  if ((s.altStages || '').trim()) {
    lines.push('', 'GÓC NHÌN KHÁC VỀ CÁC GIAI ĐOẠN (không bắt buộc):', s.altStages.trim());
  }
  return lines.join('\n');
}

const hideSelf = (e) => { e.currentTarget.style.display = 'none'; };

/* ============================================================
   TAB CONTENTS
   ============================================================ */
function Tab1Intro({ state, update }) {
  return (
    <section className="m1-panel">
      <div className="m1-panel__grid">
        <div className="m1-panel__main">
          <p className="m1-panel__label mono">{M1_INTRO.label}</p>
          <h2 className="m1-panel__title">{M1_INTRO.title}</h2>
          <p className="m1-panel__text">{M1_INTRO.description}</p>
          <h3 className="m1-panel__subtitle">Kết quả cần hoàn thành</h3>
          <p className="m1-panel__text">{M1_INTRO.result}</p>
          <h3 className="m1-panel__subtitle">Điểm thưởng</h3>
          <p className="m1-panel__text">
            Hoàn thành Mission 01 và được BTC xác nhận hợp lệ, bạn nhận <strong>{M1_CONFIG.points} điểm</strong>.
            Tiến trình được tự động lưu — bạn có thể thoát ra và quay lại chơi tiếp bất cứ lúc nào.
          </p>
        </div>
        <aside className="m1-panel__side">
          <div className="m1-req-box">
            <h4 className="m1-req-box__title">{M1_INTRO.requirementTitle}</h4>
            <p className="m1-req-box__text">{M1_INTRO.requirementText}</p>
            <label className="m1-checkbox">
              <input
                type="checkbox"
                checked={state.agreed}
                onChange={(e) => update({ agreed: e.target.checked })}
              />
              <span>{M1_INTRO.confirmLabel}</span>
            </label>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Evidence({ code }) {
  const ev = code ? M1_EVIDENCE[code] : null;
  if (!ev) return null;
  if (ev.status === 'ready' && ev.images.length) {
    return (
      <div className="m1-unlock__evidence">
        {ev.images.map(src => (
          <img key={src} className="m1-unlock__img" src={src} alt={ev.caption} loading="lazy" onError={hideSelf} />
        ))}
      </div>
    );
  }
  return null;
}

function Tab2Timeline({ state, update, toast }) {
  function choose(t, value) {
    update(s => ({ timeline: { ...s.timeline, [t.id]: value } }));
    if (value === t.meaningId) toast(M1_FEEDBACK.timeline.correct, 'success');
    else if (value) toast(M1_FEEDBACK.timeline.wrong, 'error');
  }

  return (
    <section className="m1-panel">
      <p className="m1-panel__hint">
        Hãy lựa chọn ý nghĩa phù hợp cho từng mốc. Khi kết nối đúng, sự kiện lịch sử đầy đủ và tư liệu liên quan sẽ được mở ra để bạn khám phá.
      </p>
      <div className="m1-timeline">
        {M1_TIMELINE.map(t => {
          const selected = state.timeline[t.id] || '';
          const isCorrect = selected === t.meaningId;
          return (
            <div key={t.id} className={`m1-tl-item ${isCorrect ? 'is-correct' : ''}`}>
              <div className="m1-tl-item__row">
                <div className="m1-tl-item__year">{t.year}</div>
                <div className="m1-tl-item__body">
                  <WrapSelect
                    className="m1-tl-item__select"
                    value={selected}
                    disabled={isCorrect}
                    onChange={(e) => choose(t, e.target.value)}
                  >
                    <option value="">— Chọn ý nghĩa phù hợp —</option>
                    {state.order.meanings.map(m => <option key={m.id} value={m.id}>{m.text}</option>)}
                  </WrapSelect>
                  {isCorrect && t.unlock && (
                    <div className="m1-unlock">
                      <p className="m1-unlock__title">{t.unlock.title}</p>
                      <p className="m1-unlock__text">{t.unlock.text}</p>
                      <Evidence code={t.unlock.evidence} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function StageFeedback({ stage, ans }) {
  if (!ans.start || !ans.end) return null;
  const rangeOk = Number(ans.start) === Number(stage.start) && String(ans.end) === String(stage.end);
  if (!rangeOk) return <div className="m1-stage-feedback is-error">{M1_FEEDBACK.stages.wrongRange}</div>;
  if (ans.nameId === stage.nameId && ans.eventId === stage.eventId) {
    return <div className="m1-stage-feedback is-ok">{M1_FEEDBACK.stages.allCorrect}</div>;
  }
  if (ans.nameId || ans.eventId) {
    return <div className="m1-stage-feedback is-warn">{M1_FEEDBACK.stages.wrongNameOrEvent}</div>;
  }
  return <div className="m1-stage-feedback is-ok">{M1_FEEDBACK.stages.rangeOk}</div>;
}

function Tab3Stages({ state, update }) {
  function setField(sid, field, value) {
    update(s => ({ stages: { ...s.stages, [sid]: { ...(s.stages[sid] || {}), [field]: value } } }));
  }

  return (
    <section className="m1-panel">
      <p className="m1-panel__hint">
        Dựa trên các dấu mốc chính vừa khám phá, hãy xác định các mốc thời gian để chia hành trình hình thành và phát triển của CTIN thành 5 giai đoạn. Kết quả của bước này sẽ tạo thành khung hành trình để bạn tiếp tục tìm hiểu những chuyển biến quan trọng của CTIN qua từng giai đoạn.
      </p>
      <div className="m1-stages">
        {M1_STAGES.map((s, idx) => {
          const ans = state.stages[s.id] || {};
          const isCorrect = isStageCorrect(s, ans);
          const yearOpts = M1_YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>);
          return (
            <div key={s.id} className={`m1-stage-card ${isCorrect ? 'is-correct' : ''}`}>
              <div className="m1-stage-card__head">
                <span className="m1-stage-card__num">GĐ {String(idx + 1).padStart(2, '0')}</span>
                <span className="m1-stage-card__label">Giai đoạn {idx + 1}</span>
              </div>
              <div className="m1-stage-card__fields">
                <div className="m1-field">
                  <label>Từ năm</label>
                  <WrapSelect value={ans.start || ''} disabled={isCorrect} onChange={(e) => setField(s.id, 'start', e.target.value)}>
                    <option value="">— Chọn —</option>{yearOpts}
                  </WrapSelect>
                </div>
                <div className="m1-field">
                  <label>Đến năm</label>
                  <WrapSelect value={ans.end || ''} disabled={isCorrect} onChange={(e) => setField(s.id, 'end', e.target.value)}>
                    <option value="">— Chọn —</option>{yearOpts}
                  </WrapSelect>
                </div>
                <div className="m1-field">
                  <label>Tên giai đoạn</label>
                  <WrapSelect value={ans.nameId || ''} disabled={isCorrect} onChange={(e) => setField(s.id, 'nameId', e.target.value)}>
                    <option value="">— Chọn tên —</option>
                    {state.order.names.map(n => <option key={n.id} value={n.id}>{n.text}</option>)}
                  </WrapSelect>
                </div>
                <div className="m1-field">
                  <label>Sự kiện tạo đà</label>
                  <WrapSelect value={ans.eventId || ''} disabled={isCorrect} onChange={(e) => setField(s.id, 'eventId', e.target.value)}>
                    <option value="">— Chọn sự kiện —</option>
                    {state.order.events.map(ev => <option key={ev.id} value={ev.id}>{ev.text}</option>)}
                  </WrapSelect>
                </div>
              </div>
              <StageFeedback stage={s} ans={ans} />
            </div>
          );
        })}
      </div>
      <div className="m1-alt-view">
        <h4 className="m1-alt-view__title">Góc nhìn khác (không bắt buộc)</h4>
        <p className="m1-alt-view__desc">Nếu nhìn hành trình CTIN theo một góc độ khác, bạn sẽ thay đổi ranh giới của giai đoạn nào? Vì sao?</p>
        <textarea
          rows={3}
          placeholder="Theo tôi, có thể thay đổi khoảng…"
          value={state.altStages}
          onChange={(e) => update({ altStages: e.target.value })}
        />
      </div>
    </section>
  );
}

function Tab4Transforms({ state, update, toast }) {
  function setField(t, field, value) {
    const ans = { ...(state.transforms[t.stageId] || {}), [field]: value };
    update(s => ({ transforms: { ...s.transforms, [t.stageId]: ans } }));
    if (isTransformCorrect(t, ans)) toast(M1_FEEDBACK.transform.correct, 'success');
  }

  return (
    <section className="m1-panel">
      <p className="m1-panel__hint">
        Với mỗi giai đoạn, hãy kết nối ba thành phần: bối cảnh hoặc điểm xuất phát, sự kiện tạo đà và chuyển biến về bản chất của CTIN. Khi kết nối chính xác, hồ sơ lịch sử chi tiết sẽ được mở.
      </p>
      <div className="m1-transforms">
        {M1_TRANSFORMS.map((t, idx) => {
          const ans = state.transforms[t.stageId] || {};
          const isCorrect = isTransformCorrect(t, ans);
          const opts = state.order.transforms[t.stageId];
          return (
            <div key={t.stageId} className={`m1-tf-card ${isCorrect ? 'is-correct' : ''}`}>
              <div className="m1-tf-card__head">
                <span className="m1-tf-card__badge">Giai đoạn {idx + 1}</span>
                <span className="m1-tf-card__name">{t.stageName}</span>
              </div>
              <div className="m1-tf-card__fields">
                <div className="m1-field">
                  <label>Bối cảnh / Điểm xuất phát</label>
                  <WrapSelect value={ans.contextId || ''} disabled={isCorrect} onChange={(e) => setField(t, 'contextId', e.target.value)}>
                    <option value="">— Chọn bối cảnh —</option>
                    {opts.contexts.map(o => <option key={o.id} value={o.id}>{o.text}</option>)}
                  </WrapSelect>
                </div>
                <div className="m1-field">
                  <label>Sự chuyển biến về bản chất</label>
                  <WrapSelect value={ans.changeId || ''} disabled={isCorrect} onChange={(e) => setField(t, 'changeId', e.target.value)}>
                    <option value="">— Chọn chuyển biến —</option>
                    {opts.changes.map(o => <option key={o.id} value={o.id}>{o.text}</option>)}
                  </WrapSelect>
                </div>
              </div>
              {isCorrect && (
                <div className="m1-profile">
                  <p className="m1-profile__msg">{t.profile.message}</p>
                  <ul className="m1-profile__list">
                    {t.profile.details.map(d => <li key={d}>{d}</li>)}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Tab5Legacy({ state, update }) {
  const n = countWords(state.reflection);
  let fb = { text: '', cls: '' };
  if (n > 0 && n < 15) fb = { text: M1_FEEDBACK.reflection.tooShort, cls: 'is-error' };
  else if (n > 0) fb = { text: M1_FEEDBACK.reflection.ok, cls: 'is-ok' };

  return (
    <section className="m1-panel">
      <p className="m1-panel__intro">
        Tinh thần và cách lựa chọn của con người CTIN đã tạo ra năng lực tổ chức; năng lực ấy tiếp tục được tích lũy để mở ra giai đoạn phát triển tiếp theo.
      </p>

      <h3 className="m1-section-title">1. Di sản được hình thành và tiếp nối qua từng giai đoạn</h3>
      <p className="m1-panel__hint">
        Với mỗi giai đoạn, hãy lựa chọn phương án thể hiện đúng nhất tinh thần, cách CTIN đã lựa chọn hành động và những năng lực được hình thành từ chính những lựa chọn đó.
      </p>
      <div className="m1-legacies">
        {M1_LEGACIES.map(l => {
          const selected = state.legacies[l.stageId] || '';
          const isCorrect = selected === l.spiritId;
          return (
            <div key={l.stageId} className={`m1-leg-item ${isCorrect ? 'is-correct' : ''}`}>
              <span className="m1-leg-item__label">{l.stageLabel}</span>
              <WrapSelect
                value={selected}
                disabled={isCorrect}
                onChange={(e) => update(s => ({ legacies: { ...s.legacies, [l.stageId]: e.target.value } }))}
              >
                <option value="">— Lựa chọn di sản hình thành và tiếp nối —</option>
                {state.order.spirits.map(o => <option key={o.id} value={o.id}>{o.text}</option>)}
              </WrapSelect>
            </div>
          );
        })}
      </div>

      <h3 className="m1-section-title">2. Sợi chỉ đỏ xuyên suốt hành trình CTIN</h3>
      <p className="m1-panel__hint">Từ những di sản đã xác định, hãy lựa chọn nhận định khái quát phù hợp nhất với toàn bộ hành trình.</p>
      <div className="m1-redthread">
        {state.order.redThread.map(o => {
          const sel = state.redThread === o.id;
          const isCorrect = sel && o.id === M1_RED_THREAD.correctId;
          return (
            <label key={o.id} className={`m1-rt-option ${sel ? 'is-selected' : ''} ${isCorrect ? 'is-correct' : ''}`}>
              <input type="radio" name="redThread" value={o.id} checked={sel} onChange={() => update({ redThread: o.id })} />
              <span>{o.text}</span>
            </label>
          );
        })}
      </div>

      <h3 className="m1-section-title">3. Điều tôi hiểu rõ hơn về CTIN</h3>
      <p className="m1-panel__hint">
        Sau khi hoàn thành hành trình này, hãy viết một điều bạn hiểu rõ hơn về CTIN mà trước đây bạn chưa từng chú ý hoặc chưa nhìn nhận đầy đủ.
      </p>
      <div className="m1-reflection">
        <textarea
          rows={4}
          placeholder="Sau khi nhìn lại hành trình CTIN, tôi hiểu rõ hơn rằng…"
          value={state.reflection}
          onChange={(e) => update({ reflection: e.target.value })}
        />
        <div className="m1-reflection__meta">
          <span>{n} / tối thiểu 15 từ</span>
          <span className={`m1-feedback ${fb.cls}`}>{fb.text}</span>
        </div>
      </div>
    </section>
  );
}

function Tab6Summary({ state }) {
  const rtOpt = M1_RED_THREAD.options.find(o => o.id === state.redThread);
  const checks = [
    { ok: state.agreed, label: 'Đã xác nhận hiểu cách chơi' },
    { ok: isTimelineComplete(state), label: '10/10 mốc thời gian kết nối đúng' },
    { ok: isStagesComplete(state), label: '5 giai đoạn: năm, tên, sự kiện tạo đà đúng' },
    { ok: isTransformsComplete(state), label: '5 giai đoạn: bối cảnh & chuyển biến đúng' },
    { ok: isLegaciesComplete(state), label: '5 di sản được chọn đúng' },
    { ok: isRedThreadCorrect(state), label: 'Sợi chỉ đỏ đúng' },
    { ok: isReflectionValid(state), label: 'Chia sẻ cá nhân tối thiểu 15 từ' }
  ];

  return (
    <section className="m1-panel">
      <p className="m1-panel__hint">
        Đây là bản tổng hợp toàn bộ lựa chọn của bạn. Có thể quay lại các tab trước để điều chỉnh trước khi nộp.
      </p>
      {isAllValid(state) && (
        <div className="m1-summary-block">
          <h4>{M1_COMPLETE.title}</h4>
          <p>{M1_COMPLETE.message}</p>
        </div>
      )}

      {M1_STAGES.map((s, idx) => {
        const tf = M1_TRANSFORMS.find(t => t.stageId === s.id);
        const leg = M1_LEGACIES.find(l => l.stageId === s.id);
        return (
          <div key={s.id} className="m1-summary-stage">
            <div className="m1-summary-stage__head">
              <span className="m1-summary-stage__num">GĐ {String(idx + 1).padStart(2, '0')}</span>
              <span className="m1-summary-stage__name">{s.name}</span>
              <span className="m1-summary-stage__years">{s.start} – {s.end}</span>
            </div>
            <div className="m1-summary-row">
              <span className="m1-summary-row__label">Sự kiện tạo đà</span>
              <span className="m1-summary-row__value">{s.event}</span>
            </div>
            <div className="m1-summary-row">
              <span className="m1-summary-row__label">Bối cảnh</span>
              <span className="m1-summary-row__value">{tf ? tf.context : '—'}</span>
            </div>
            <div className="m1-summary-row">
              <span className="m1-summary-row__label">Chuyển biến</span>
              <span className="m1-summary-row__value">{tf ? tf.change : '—'}</span>
            </div>
            <div className="m1-summary-row">
              <span className="m1-summary-row__label">Di sản</span>
              <span className="m1-summary-row__value">{leg ? `${leg.spirit} → ${leg.capacity}` : '—'}</span>
            </div>
          </div>
        );
      })}

      <div className="m1-summary-block">
        <h4>Sợi chỉ đỏ xuyên suốt</h4>
        <p>{rtOpt ? rtOpt.text : '—'}</p>
      </div>

      <div className="m1-summary-block" style={{ background: 'var(--clr-blue-pale)', borderLeftColor: 'var(--clr-blue)' }}>
        <h4 style={{ color: 'var(--clr-blue-dark)' }}>Điều tôi hiểu rõ hơn về CTIN</h4>
        <p>{state.reflection || '—'}</p>
      </div>

      {(state.altStages || '').trim() && (
        <div className="m1-summary-block" style={{ background: '#FAFBFC', borderLeftColor: 'var(--clr-ink-3)' }}>
          <h4 style={{ color: 'var(--clr-ink-3)' }}>Góc nhìn khác (không tính hợp lệ)</h4>
          <p>{state.altStages}</p>
        </div>
      )}

      <div className="m1-checklist">
        <p className="m1-checklist__title">Bảng kiểm hợp lệ</p>
        {checks.map(c => (
          <div key={c.label} className={`m1-check-item ${c.ok ? 'is-ok' : ''}`}>
            <span className={`m1-check-item__icon ${c.ok ? 'is-ok' : 'is-fail'}`}>{c.ok ? '✓' : '✗'}</span>
            <span className="m1-check-item__label">{c.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   PAGE
   ============================================================ */
export default function Mission1Page() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [storageKey, setStorageKey] = useState(null);
  const [state, setState] = useState(null);

  const [mySubmission, setMySubmission] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [adminSubs, setAdminSubs] = useState(null);
  const [adminError, setAdminError] = useState('');

  const [toastState, setToastState] = useState({ msg: '', type: '', visible: false });
  const toastTimerRef = useRef(null);
  const syncTimerRef = useRef(null);
  const pendingRemoteRef = useRef(null);
  const [exiting, setExiting] = useState(false);

  const isAdmin = currentUser?.role === 'admin';

  function toast(msg, type) {
    clearTimeout(toastTimerRef.current);
    setToastState({ msg, type, visible: true });
    toastTimerRef.current = setTimeout(() => setToastState(t => ({ ...t, visible: false })), 2800);
  }
  useEffect(() => () => clearTimeout(toastTimerRef.current), []);

  async function loadMySubmission() {
    try {
      const subs = await api.getUserSubmissions();
      setMySubmission(subs.find(s => Number(s.mission_id) === 1) || null);
    } catch {
      setMySubmission(null);
    }
  }

  /* ---------- INIT ---------- */
  useEffect(() => {
    let cancelled = false;
    async function init() {
      let u = null;
      try { u = await auth.load(); } catch { u = null; }
      if (cancelled) return;
      setCurrentUser(u);
      setUserLoaded(true);

      if (u && u.role === 'admin') {
        try {
          const all = await api.getAllSubmissions();
          if (!cancelled) setAdminSubs(all.filter(s => Number(s.mission_id) === 1));
        } catch (e) {
          if (!cancelled) setAdminError(e.message);
        }
      } else if (u) {
        const key = LS_PREFIX + (u.id || u.email);
        let loaded = loadState(key);
        try {
          const remote = await getMissionProgressApi(M1_CONFIG.id);
          if (remote && savedTime(remote.state) > savedTime(loaded)) loaded = normalizeState(remote.state);
        } catch { /* offline */ }
        if (cancelled) return;
        loaded.currentTab = Math.min(loaded.currentTab || 1, maxReachableTab(loaded));
        setStorageKey(key);
        setState(loaded);
        await loadMySubmission();
      }
    }
    init();
    return () => { cancelled = true; };
  }, []);

  /* ---------- Auto-save ---------- */
  useEffect(() => {
    if (!storageKey || !state) return;
    saveState(storageKey, state);
    if (currentUser && !isAdmin) {
      pendingRemoteRef.current = state;
      clearTimeout(syncTimerRef.current);
      syncTimerRef.current = setTimeout(() => { flushRemote(); }, SYNC_DELAY_MS);
    }
  }, [storageKey, state, currentUser, isAdmin]);

  useEffect(() => {
    const onUnload = () => { flushRemote(); };
    window.addEventListener('beforeunload', onUnload);
    return () => {
      window.removeEventListener('beforeunload', onUnload);
      clearTimeout(syncTimerRef.current);
      flushRemote();
    };
  }, []);

  async function flushRemote() {
    clearTimeout(syncTimerRef.current);
    const pending = pendingRemoteRef.current;
    if (!pending || !currentUser || isAdmin) return true;
    pendingRemoteRef.current = null;
    try {
      await saveMissionProgressApi(M1_CONFIG.id, pending);
      return true;
    } catch {
      if (!pendingRemoteRef.current) pendingRemoteRef.current = pending;
      return false;
    }
  }

  function update(patch) {
    setState(prev => {
      const p = typeof patch === 'function' ? patch(prev) : patch;
      return { ...prev, ...p, savedAt: new Date().toISOString() };
    });
  }

  const maxTab = state ? maxReachableTab(state) : 1;

  function goToTab(id) {
    if (!state || id < 1 || id > 6) return;
    if (id > maxTab) {
      toast('Hãy hoàn thành bước trước đó trước.', 'error');
      return;
    }
    update({ currentTab: id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSaveAndExit() {
    if (storageKey && state) {
      const snapshot = { ...state, savedAt: new Date().toISOString() };
      saveState(storageKey, snapshot);
      if (currentUser && !isAdmin) pendingRemoteRef.current = snapshot;
    }
    if (!currentUser) {
      toast('Đã lưu tiến trình tạm trên trình duyệt này.', 'success');
      setTimeout(() => navigate('/'), 900);
      return;
    }
    setExiting(true);
    const ok = await flushRemote();
    setExiting(false);
    if (ok) toast('Đã lưu tiến trình lên hệ thống. Bạn có thể chơi tiếp trên bất kỳ máy nào.', 'success');
    else toast('Chưa lưu được lên hệ thống — tiến trình tạm lưu trên trình duyệt này.', 'error');
    setTimeout(() => navigate(isAdmin ? '/admin' : '/dashboard'), 1200);
  }

  async function handleSubmit() {
    if (!currentUser) {
      toast('Vui lòng đăng nhập tài khoản CBNV để nộp bài chính thức.', 'error');
      setTimeout(() => navigate('/login'), 1200);
      return;
    }
    if (!isAllValid(state)) {
      toast('Chưa hoàn thành đủ điều kiện hợp lệ.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const answers = {
        agreed: state.agreed,
        timeline: state.timeline,
        stages: state.stages,
        transforms: state.transforms,
        legacies: state.legacies,
        redThread: state.redThread,
        reflection: state.reflection,
        altStages: state.altStages || null,
        valid_submission: true
      };
      await submitMissionResponseApi({
        missionId: M1_CONFIG.id,
        longTextAnswer: buildSubmissionText(state),
        selectedOptionsJson: JSON.stringify(answers),
        evidenceSource: '',
        witnessName: ''
      });
      update({ submittedAt: new Date().toISOString() });
      toast('Hoàn thành Mission 01 thành công! Hệ thống đã tự động ghi nhận điểm hợp lệ.', 'success');
      await loadMySubmission();
    } catch (err) {
      toast(err.message || 'Nộp bài thất bại.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  /* ---------- RENDER PARTS ---------- */
  function renderMyStatus() {
    if (!mySubmission) return null;
    const st = getSubmissionStatus(mySubmission);
    let text;
    if (mySubmission.reopened) text = 'BTC đã mở lại bài của bạn để chỉnh sửa. Hãy cập nhật và nộp lại.';
    else if (st.code === 'valid') text = `Bài của bạn đã được duyệt hợp lệ — bạn nhận ${mySubmission.score != null ? mySubmission.score : M1_CONFIG.points} điểm.`;
    else if (st.code === 'needs_supplement') text = 'BTC yêu cầu bổ sung. Hãy xem lại bài và nộp lại.';
    else if (st.code === 'invalid') text = 'Bài của bạn bị đánh dấu "Không hợp lệ". Liên hệ BTC hoặc nộp lại.';
    else text = 'Bài của bạn đã được gửi và đang chờ BTC chấm.';

    return (
      <div className="m1-summary-block" style={{ marginBottom: '20px' }}>
        <h4 style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          Bài nộp Mission 01
          <span className={`status-badge ${st.cls} status-badge--sm`}>{st.label}</span>
          {mySubmission.score != null && <span className="status-badge status-badge--sm">{mySubmission.score} điểm</span>}
        </h4>
        <p>{text} Nộp lúc {fmtDateTime(mySubmission.submitted_at)}.</p>
      </div>
    );
  }

  function renderAdminSubmissions() {
    if (adminError) return <p style={{ color: '#C25B5B' }}>Không tải được bài nộp: {adminError}</p>;
    if (adminSubs === null) return <p style={{ color: 'var(--clr-ink-3)' }}>Đang tải…</p>;
    if (!adminSubs.length) {
      return (
        <div className="submissions-block submissions-block--empty">
          <div className="empty-state">
            <div className="empty-state__icon">📁</div>
            <h3 className="empty-state__title">Chưa có bài nộp nào</h3>
            <p className="empty-state__desc">Bài làm Mission 1 sẽ hiển thị khi người chơi nộp bài.</p>
          </div>
        </div>
      );
    }

    const visible = adminSubs.slice(0, ADMIN_SHOW_LIMIT);
    return (
      <div className="submissions-block">
        <div className="submissions-block__head">
          <h4>📁 Danh sách bài nộp <span>({adminSubs.length} bài)</span></h4>
          <p className="submissions-block__hint">Nhấn vào từng ô để mở trang chấm bài</p>
        </div>
        <div className="submissions-grid">
          {visible.map(s => {
            const st = getSubmissionStatus(s);
            return (
              <article
                key={s.id}
                className="submission-card"
                tabIndex={0}
                role="button"
                onClick={() => navigate('/admin')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/admin'); }
                }}
              >
                <div className="submission-card__thumb">
                  <div className="submission-card__thumb-placeholder">📝</div>
                  <span className="submission-card__type">Bài làm</span>
                  {s.score != null
                    ? <span className="submission-card__score">{s.score} đ</span>
                    : <span className="submission-card__score submission-card__score--pending">Chưa chấm</span>}
                </div>
                <div className="submission-card__body">
                  <p className="submission-card__team">{s.user_name} · {s.user_unit}</p>
                  <h5 className="submission-card__title">Nộp lúc {fmtDateTime(s.submitted_at)}</h5>
                  <span className={`status-badge ${st.cls} status-badge--sm`} style={{ marginTop: '6px' }}>{st.label}</span>
                </div>
              </article>
            );
          })}
        </div>
        <div className="m1-submissions-toggle">
          <Link to="/mission-1/all-submissions" className="btn btn--outline">Xem toàn bộ {adminSubs.length} bài →</Link>
          <Link to="/admin" className="btn btn--gold" style={{ marginLeft: '10px' }}>Chấm bài tại trang Admin →</Link>
        </div>
      </div>
    );
  }

  function renderBody() {
    if (!userLoaded) {
      return <section className="m1-panel"><p className="m1-panel__text">Đang tải…</p></section>;
    }
    if (!currentUser) {
      return (
        <section className="m1-panel" style={{ textAlign: 'center' }}>
          <h2 className="m1-panel__title">Bạn cần đăng nhập để chơi Mission 01</h2>
          <p className="m1-panel__text">Tiến trình chơi được lưu theo tài khoản CBNV CTIN.</p>
          <Link to="/login" className="btn btn--gold" style={{ marginTop: '16px' }}>Đăng nhập</Link>
        </section>
      );
    }
    if (isAdmin) {
      return (
        <section className="m1-panel" id="m1-submissions">
          <span className="m1-section__label mono">ADMIN — SUBMISSIONS</span>
          <h2 className="m1-panel__title">Danh sách bài nộp Mission 01</h2>
          <p className="m1-panel__text">Hoàn thành Mission 01 hợp lệ = {M1_CONFIG.points} điểm cho người chơi.</p>
          {renderAdminSubmissions()}
        </section>
      );
    }
    if (!state) return null;

    switch (state.currentTab) {
      case 1: return <Tab1Intro state={state} update={update} />;
      case 2: return <Tab2Timeline state={state} update={update} toast={toast} />;
      case 3: return <Tab3Stages state={state} update={update} />;
      case 4: return <Tab4Transforms state={state} update={update} toast={toast} />;
      case 5: return <Tab5Legacy state={state} update={update} />;
      default: return <Tab6Summary state={state} />;
    }
  }

  const playing = !!(currentUser && !isAdmin && state);
  const tab = state?.currentTab || 1;

  return (
    <main className="m1-page">
      <div className="m1-header">
        <div className="container">
          <Link to={isAdmin ? '/admin' : '/dashboard'} className="m1-header__label mono" style={{ display: 'inline-block' }}>
            ← {isAdmin ? 'Trang Admin' : 'Dashboard'}
          </Link>
          <p className="m1-header__label mono">{M1_CONFIG.title}</p>
          <h1 className="m1-header__title">
            <span className="m1-header__num">01</span>
            {M1_CONFIG.subtitle}
          </h1>
          <p className="m1-header__desc">
            Kết nối mốc thời gian, giai đoạn, bước ngoặt và những chuyển biến quan trọng. Hoàn thành: {M1_CONFIG.points} điểm.
          </p>
        </div>
      </div>

      {playing && (
        <div className="m1g-tabs-bar">
          <div className="container">
            <nav className="m1g-tabs" role="tablist">
              {M1_TABS.map(t => {
                let cls = 'm1g-tab';
                if (t.id === tab) cls += ' is-active';
                else if (t.id < maxTab || (t.id === 6 && state.submittedAt)) cls += ' is-done';
                else if (t.id > maxTab) cls += ' is-locked';
                return (
                  <button
                    key={t.id}
                    className={cls}
                    type="button"
                    role="tab"
                    aria-selected={t.id === tab}
                    onClick={() => goToTab(t.id)}
                  >
                    {t.code} · {t.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      <div className="m1-content">
        <div className="container">
          {playing && renderMyStatus()}
          {renderBody()}
        </div>
      </div>

      {playing && (
        <div className="m1-footer-nav">
          <div className="container m1-footer-nav__inner">
            {tab > 1 && (
              <button type="button" className="btn btn--outline" onClick={() => goToTab(tab - 1)}>← Quay lại</button>
            )}
            <div className="m1-footer-nav__spacer"></div>
            <button type="button" className="btn btn--outline" onClick={handleSaveAndExit} disabled={exiting} title="Tiến trình được lưu, lần sau vào sẽ chơi tiếp">
              {exiting ? 'Đang lưu…' : '💾 Lưu & thoát'}
            </button>
            {tab < 6 && (
              <button type="button" className="btn btn--gold" disabled={!canLeaveTab(tab, state)} onClick={() => goToTab(tab + 1)}>
                Tiếp tục →
              </button>
            )}
            {tab === 6 && (
              <button type="button" className="btn btn--gold" disabled={!isAllValid(state) || submitting} onClick={handleSubmit}>
                {submitting ? 'Đang nộp…' : (mySubmission ? 'Nộp lại Mission 01 →' : 'Nộp Mission 01 →')}
              </button>
            )}
          </div>
        </div>
      )}

      <div
        className={`m1-toast ${toastState.type ? 'toast--' + toastState.type : ''} ${toastState.visible ? 'is-visible' : ''}`}
        role="status"
        aria-live="polite"
      >
        {toastState.msg}
      </div>
    </main>
  );
}
