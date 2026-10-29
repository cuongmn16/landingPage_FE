/* ============================================================
   MISSION 3 PAGE — LEADERSHIP LEGACIES (5 tab)
   Theo "Mission 3 – Tài liệu bàn giao kỹ thuật":
   - Tab 03 chỉ ghép quyết định/dấu ấn + phẩm chất (không còn bối cảnh,
     quote, câu chuyện, vật chứng).
   - Chỉ đánh giá đúng/sai khi bấm Tiếp tục hoặc Kiểm tra kết quả.
   - Backend tự chấm lại đáp án, điểm và trạng thái hợp lệ khi nộp.
   ============================================================ */
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import MissionGame from '../components/mission/MissionGame';
import { shuffle } from '../components/mission/missionUtils';
import {
  M3_CONFIG, M3_TABS, M3_INTRO, M3_LEADERS, M3_MARKS, M3_QUALITIES, M3_CONTINUATIONS,
  M3_HAS_DRAFT, M3_PUBLISH_BLOCKED, m3Label
} from '../data/mission3Data';
import '../styles/mission1.css';
import '../styles/mission3.css';

const LS_PREFIX = 'ctin_th_m3_v3_';
const MIN_REFLECTION = M3_CONFIG.minReflection;

/* Thứ tự hai ngân hàng đáp án được xáo một lần rồi lưu cùng tiến trình */
const buildOptionOrder = () => ({
  marks: shuffle(M3_MARKS.map(m => m.id)),
  qualities: shuffle(M3_QUALITIES.map(q => q.id))
});

const defaultState = () => ({
  agreed: false,
  viewedLeaders: [],
  markMatches: {},            // leaderId → markId
  qualityMatches: {},         // leaderId → qualityId
  continuationSelections: {}, // leaderId → continuationId
  leadershipReflection: '',
  optionOrder: buildOptionOrder(),
  currentTab: 1,
  done: false,
  submittedAt: null,
  savedAt: null
});

/* Chỉ giữ các trường của mô hình dữ liệu mới — bỏ contextMatches, quote, story,
   evidence… của prototype cũ, và bỏ mọi id không còn tồn tại. */
const LEADER_IDS = M3_LEADERS.map(l => l.id);
const pickMap = (obj, validIds) => {
  const out = {};
  LEADER_IDS.forEach(lid => {
    const v = obj && obj[lid];
    if (v && validIds.includes(v)) out[lid] = v;
  });
  return out;
};
const sameSet = (a, b) => Array.isArray(a) && a.length === b.length && b.every(x => a.includes(x));

function normalizeState(data) {
  const base = defaultState();
  if (!data || typeof data !== 'object') return base;
  const markIds = M3_MARKS.map(m => m.id);
  const qualityIds = M3_QUALITIES.map(q => q.id);
  const order = data.optionOrder || {};
  return {
    ...base,
    agreed: !!data.agreed,
    viewedLeaders: Array.isArray(data.viewedLeaders) ? data.viewedLeaders.filter(id => LEADER_IDS.includes(id)) : [],
    markMatches: pickMap(data.markMatches, markIds),
    qualityMatches: pickMap(data.qualityMatches, qualityIds),
    continuationSelections: pickMap(data.continuationSelections, M3_CONTINUATIONS.map(c => c.id)),
    leadershipReflection: typeof data.leadershipReflection === 'string' ? data.leadershipReflection : '',
    optionOrder: {
      marks: sameSet(order.marks, markIds) ? order.marks : base.optionOrder.marks,
      qualities: sameSet(order.qualities, qualityIds) ? order.qualities : base.optionOrder.qualities
    },
    currentTab: Number(data.currentTab) || 1,
    done: !!data.done,
    submittedAt: data.submittedAt || null,
    savedAt: data.savedAt || null
  };
}

/* Sắp lại danh sách theo thứ tự id đã xáo */
const byOrder = (ids, list) => ids.map(id => list.find(x => x.id === id)).filter(Boolean);

const reflectionLength = (s) => (s.leadershipReflection || '').trim().length;

function initials(name) {
  const parts = (name || '').replace(/^Ông\s+/, '').split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return (name || '?').slice(0, 2).toUpperCase();
}

/* ---------- Kiểm tra hợp lệ V01–V06 ---------- */
const V = {
  V01: (s) => !!s.agreed,
  V02: (s) => LEADER_IDS.every(id => s.viewedLeaders.includes(id)),
  V03: (s) => M3_LEADERS.every(l => s.markMatches[l.id] && s.qualityMatches[l.id]),
  V04: (s) => M3_LEADERS.every(l => s.markMatches[l.id] === l.markId && s.qualityMatches[l.id] === l.qualityId),
  V05: (s) => M3_LEADERS.every(l => s.continuationSelections[l.id]),
  V06: (s) => reflectionLength(s) >= MIN_REFLECTION
};

const MESSAGES = {
  V01: 'Vui lòng xác nhận đã hiểu yêu cầu nhiệm vụ.',
  V02: 'Hãy mở đủ năm hồ sơ lãnh đạo.',
  V03: 'Hãy hoàn thành đủ hai lựa chọn cho mỗi người dẫn đường.',
  V04: 'Một số kết nối chưa chính xác. Hãy xem lại hồ sơ và thử lại.',
  V05: 'Hãy lựa chọn điều cần tiếp nối từ cả năm người dẫn đường.',
  V06: `Phần chia sẻ cần có ít nhất ${MIN_REFLECTION} ký tự.`
};

/* Mã kiểm tra của từng tab (tab 5 không có bước tiếp) */
const TAB_RULES = { 1: ['V01'], 2: ['V02'], 3: ['V03', 'V04'], 4: ['V05', 'V06'] };

const isTabValid = (tab, s) => (TAB_RULES[tab] || []).every(code => V[code](s));
const isAllValid = (s) => Object.keys(V).every(code => V[code](s));

function maxReachableTab(s) {
  let max = 1;
  for (const tab of [1, 2, 3, 4]) {
    if (!isTabValid(tab, s)) break;
    max++;
  }
  return max;
}

/* Khối đầu tiên còn thiếu để cuộn tới khi bấm Tiếp tục */
function firstMissingId(code, s) {
  if (code === 'V01') return 'm3Agree';
  if (code === 'V02') {
    const l = M3_LEADERS.find(x => !s.viewedLeaders.includes(x.id));
    return l ? `m3Card${l.id}` : null;
  }
  if (code === 'V03') {
    const l = M3_LEADERS.find(x => !s.markMatches[x.id] || !s.qualityMatches[x.id]);
    return l ? `m3Block${l.id}` : null;
  }
  if (code === 'V04') return 'm3MatchAlert'; // không chỉ ra trực tiếp ô sai
  if (code === 'V05') {
    const l = M3_LEADERS.find(x => !s.continuationSelections[x.id]);
    return l ? `m3Cont${l.id}` : null;
  }
  if (code === 'V06') return 'm3Reflection';
  return null;
}

function checkTab(tab, s) {
  const failed = (TAB_RULES[tab] || []).find(code => !V[code](s));
  if (!failed) return null;
  return { code: failed, message: MESSAGES[failed], focusId: firstMissingId(failed, s) };
}

/* Default: nút Tiếp tục khóa cho tới khi người chơi đã thao tác trên tab.
   Tab 01 và Tab 04 theo tài liệu: chỉ mở khi đã đạt điều kiện. */
function canTryNext(tab, s) {
  if (tab === 1) return V.V01(s);
  if (tab === 2) return s.viewedLeaders.length > 0;
  if (tab === 3) return Object.keys(s.markMatches).length + Object.keys(s.qualityMatches).length > 0;
  if (tab === 4) return V.V05(s) && V.V06(s);
  return false;
}

function validityChecklist(s) {
  return [
    { code: 'V01', tab: 1, label: 'Đã xác nhận hiểu yêu cầu nhiệm vụ' },
    { code: 'V02', tab: 2, label: 'Đã mở đủ 5 hồ sơ lãnh đạo' },
    { code: 'V03', tab: 3, label: 'Đủ 10 lựa chọn dấu ấn và phẩm chất' },
    { code: 'V04', tab: 3, label: 'Tất cả kết nối dấu ấn – phẩm chất đều chính xác' },
    { code: 'V05', tab: 4, label: 'Đã chọn điều cần tiếp nối cho cả 5 người' },
    { code: 'V06', tab: 4, label: `Chia sẻ cá nhân tối thiểu ${MIN_REFLECTION} ký tự` }
  ].map(item => ({ ...item, ok: V[item.code](s) }));
}

/* Nội dung dễ đọc gửi cho admin chấm (hiển thị ở mục "Ghi chú / Trả lời") */
function buildSubmissionText(s) {
  const lines = [
    `MISSION 03 · ${M3_CONFIG.code} — ${M3_CONFIG.title}`,
    '',
    'HỒ SƠ KẾT QUẢ:'
  ];
  M3_LEADERS.forEach(l => {
    lines.push(
      `• ${l.name}`,
      `   Dấu ấn: ${m3Label(M3_MARKS, s.markMatches[l.id]) || '—'}`,
      `   Phẩm chất: ${m3Label(M3_QUALITIES, s.qualityMatches[l.id]) || '—'}`,
      `   Điều tiếp nối: ${m3Label(M3_CONTINUATIONS, s.continuationSelections[l.id]) || '—'}`
    );
  });
  lines.push(
    '',
    `CHIA SẺ CÁ NHÂN (${reflectionLength(s)} ký tự):`,
    (s.leadershipReflection || '').trim()
  );
  return lines.join('\n');
}

/* Payload theo mục 11 tài liệu; score / isValid do backend xác nhận */
function buildAnswers(s) {
  return {
    missionId: 'M3',
    contentVersion: M3_CONFIG.contentVersion,
    agreed: !!s.agreed,
    viewedLeaders: [...s.viewedLeaders],
    markMatches: { ...s.markMatches },
    qualityMatches: { ...s.qualityMatches },
    continuationSelections: { ...s.continuationSelections },
    leadershipReflection: (s.leadershipReflection || '').trim()
  };
}

/* ============================================================
   UI PARTS
   ============================================================ */
function Avatar({ leader, className }) {
  if (leader.imageUrl) {
    return <img className={`${className} ${className}--img`} src={leader.imageUrl} alt={leader.name} />;
  }
  return <div className={className} aria-hidden="true">{initials(leader.name)}</div>;
}

/* ============================================================
   TAB CONTENTS
   ============================================================ */
function Tab1Intro({ state, update }) {
  return (
    <section className="m1-panel">
      <div className="m1-panel__grid">
        <div className="m1-panel__main">
          <p className="m1-panel__label mono">{M3_INTRO.label}</p>
          <h2 className="m1-panel__title">{M3_INTRO.title}</h2>
          <p className="m1-panel__text">{M3_INTRO.description}</p>
          <h3 className="m1-panel__subtitle">Kết quả cần hoàn thành</h3>
          <p className="m1-panel__text">{M3_INTRO.result}</p>
          <p className="m1-panel__text">Thời lượng dự kiến 8–10 phút. Tiến trình được tự động lưu — bạn có thể thoát ra và quay lại chơi tiếp bất cứ lúc nào.</p>
          {M3_HAS_DRAFT && (
            <p className="m3-draft-note" role="note">
              Bản thử nghiệm: hồ sơ {M3_LEADERS.filter(l => l.contentStatus !== 'approved').map(l => l.name).join(', ')} đang dùng dữ liệu mẫu, chờ BTC phê duyệt.
            </p>
          )}
        </div>
        <aside className="m1-panel__side">
          <div className="m1-req-box">
            <h4 className="m1-req-box__title">{M3_INTRO.requirementTitle}</h4>
            <p className="m1-req-box__text">{M3_INTRO.requirementText}</p>
            <label className="m1-checkbox">
              <input id="m3Agree" type="checkbox" checked={state.agreed} onChange={(e) => update({ agreed: e.target.checked })} />
              <span>{M3_INTRO.confirmLabel}</span>
            </label>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Tab2Leaders({ state, update }) {
  const [activeId, setActiveId] = useState(null);
  const panelRef = useRef(null);
  const n = state.viewedLeaders.length;
  const active = M3_LEADERS.find(l => l.id === activeId) || null;

  // Trên màn hình hẹp, đưa phần bối cảnh vào tầm nhìn sau khi mở hồ sơ
  useEffect(() => {
    if (active && panelRef.current && panelRef.current.scrollIntoView) {
      panelRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeId]);

  function open(id) {
    setActiveId(id);
    update(s => (s.viewedLeaders.includes(id) ? {} : { viewedLeaders: [...s.viewedLeaders, id] }));
  }

  return (
    <section className="m1-panel">
      <h2 className="m1-panel__title">Năm người dẫn đường</h2>
      <p className="m1-panel__text">Mở và đọc hồ sơ của đủ năm lãnh đạo. Bối cảnh giúp bạn suy luận ở bước giải mã sau.</p>
      <p className={`m3-view-count ${n >= M3_LEADERS.length ? 'is-ok' : ''}`}>Đã mở {n}/{M3_LEADERS.length} hồ sơ</p>
      <div className="m3-leader-grid">
        {M3_LEADERS.map(l => {
          const viewed = state.viewedLeaders.includes(l.id);
          return (
            <article
              key={l.id}
              id={`m3Card${l.id}`}
              className={`m3-leader-card ${viewed ? 'is-viewed' : ''} ${activeId === l.id ? 'is-active' : ''}`}
              role="button"
              tabIndex={0}
              aria-pressed={activeId === l.id}
              onClick={() => open(l.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(l.id); }
              }}
            >
              <Avatar leader={l} className="m3-leader-card__avatar" />
              <div className="m3-leader-card__name">{l.name}</div>
              <div className="m3-leader-card__role">{l.role}</div>
              <div className="m3-leader-card__period">{l.period}</div>
              <span className="m3-leader-card__badge">{viewed ? '✓ Đã mở' : 'Mở hồ sơ'}</span>
            </article>
          );
        })}
      </div>
      {active && (
        <div className="m3-context-panel" ref={panelRef} aria-live="polite">
          <div className="m3-context-panel__name">{active.name}</div>
          <div className="m3-context-panel__meta">{active.role} · {active.period}</div>
          <div className="m3-context-panel__label">Bối cảnh</div>
          <p className="m3-context-panel__text">{active.context}</p>
        </div>
      )}
    </section>
  );
}

function Tab3Decode({ state, update, tabError, checkCurrentTab, toast }) {
  const marks = byOrder(state.optionOrder.marks, M3_MARKS);
  const qualities = byOrder(state.optionOrder.qualities, M3_QUALITIES);
  // Chỉ báo lỗi sau khi bấm Tiếp tục / Kiểm tra kết quả; đổi lựa chọn sẽ ẩn thông báo
  const incorrect = tabError && tabError.code === 'V04';
  const missing = tabError && tabError.code === 'V03';

  /* Cơ chế một–một: đáp án đã gán cho người khác bị khóa */
  const usedBy = (matches, exceptLeader) => new Set(
    Object.entries(matches).filter(([lid, v]) => lid !== exceptLeader && v).map(([, v]) => v)
  );

  function pick(field, leaderId, value) {
    update(s => {
      const next = { ...s[field] };
      if (value) next[leaderId] = value;
      else delete next[leaderId];
      return { [field]: next };
    });
  }

  function handleCheck() {
    if (checkCurrentTab()) toast('Tất cả kết nối đã chính xác. Bạn có thể tiếp tục.', 'success');
  }

  return (
    <section className="m1-panel">
      <h2 className="m1-panel__title">Giải mã dấu ấn</h2>
      <p className="m1-panel__text" style={{ marginBottom: '20px' }}>
        Với mỗi người dẫn đường, hãy lựa chọn <strong>quyết định hoặc dấu ấn</strong> tiêu biểu và <strong>phẩm chất lãnh đạo</strong> phù hợp nhất.
      </p>
      <div id="m3MatchAlert" className={`m3-alert m3-alert--error ${incorrect ? 'is-visible' : ''}`} role="alert">
        {MESSAGES.V04}
      </div>
      {M3_LEADERS.map(l => {
        const markSel = state.markMatches[l.id] || '';
        const qualSel = state.qualityMatches[l.id] || '';
        const usedM = usedBy(state.markMatches, l.id);
        const usedQ = usedBy(state.qualityMatches, l.id);
        const isMissing = missing && (!markSel || !qualSel);
        return (
          <div key={l.id} id={`m3Block${l.id}`} className={`m3-match-block ${isMissing ? 'is-missing' : ''}`}>
            <div className="m3-match-block__head">
              <Avatar leader={l} className="m3-match-block__avatar" />
              <div>
                <div className="m3-match-block__name">{l.name}</div>
                <div className="m3-match-block__role">{l.role}</div>
              </div>
            </div>
            <div className="m3-match-field">
              <label className="m3-match-field__label" htmlFor={`m3Mark${l.id}`}>Quyết định / dấu ấn tiêu biểu</label>
              <select id={`m3Mark${l.id}`} value={markSel} onChange={(e) => pick('markMatches', l.id, e.target.value)}>
                <option value="">— Chọn dấu ấn —</option>
                {marks.map(m => (
                  <option key={m.id} value={m.id} disabled={usedM.has(m.id)}>{m.label}</option>
                ))}
              </select>
            </div>
            <div className="m3-match-field">
              <label className="m3-match-field__label" htmlFor={`m3Quality${l.id}`}>Phẩm chất lãnh đạo</label>
              <select id={`m3Quality${l.id}`} value={qualSel} onChange={(e) => pick('qualityMatches', l.id, e.target.value)}>
                <option value="">— Chọn phẩm chất —</option>
                {qualities.map(q => (
                  <option key={q.id} value={q.id} disabled={usedQ.has(q.id)}>{q.label}</option>
                ))}
              </select>
            </div>
          </div>
        );
      })}
      <div className="m3-check-row">
        <button type="button" className="btn btn--outline" onClick={handleCheck}>Kiểm tra kết quả</button>
      </div>
    </section>
  );
}

function Tab4Legacy({ state, update, tabError }) {
  const n = reflectionLength(state);
  const missing = tabError && tabError.code === 'V05';

  return (
    <section className="m1-panel">
      <h2 className="m1-panel__title">Điều được trao lại</h2>
      <p className="m1-panel__text" style={{ marginBottom: '16px' }}>Chọn một điều cần tiếp nối từ mỗi lãnh đạo. Có thể chọn trùng vì đây là quan điểm cá nhân.</p>
      {M3_LEADERS.map(l => {
        const sel = state.continuationSelections[l.id] || '';
        return (
          <div key={l.id} id={`m3Cont${l.id}`} className={`m3-cont-row ${missing && !sel ? 'is-missing' : ''}`}>
            <label className="m3-cont-row__name" htmlFor={`m3ContSel${l.id}`}>{l.name}</label>
            <select
              id={`m3ContSel${l.id}`}
              value={sel}
              onChange={(e) => update(s => {
                const next = { ...s.continuationSelections };
                if (e.target.value) next[l.id] = e.target.value;
                else delete next[l.id];
                return { continuationSelections: next };
              })}
            >
              <option value="">— Điều cần tiếp nối —</option>
              {M3_CONTINUATIONS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
        );
      })}
      <div className="m3-field">
        <label className="m3-field__label" htmlFor="m3Reflection">
          Trong những dấu ấn vừa khám phá, điều gì bạn cho rằng người CTIN hôm nay cần tiếp tục gìn giữ hoặc phát triển?
        </label>
        <textarea
          id="m3Reflection"
          rows={5}
          placeholder="Chia sẻ suy nghĩ của bạn…"
          value={state.leadershipReflection}
          onChange={(e) => update({ leadershipReflection: e.target.value })}
        />
        <p className={`m3-field__meta ${n >= MIN_REFLECTION ? 'is-ok' : 'is-warn'}`}>
          {n} ký tự{n < MIN_REFLECTION ? ` · cần tối thiểu ${MIN_REFLECTION}` : ''}
        </p>
      </div>
    </section>
  );
}

function Tab5Result({ state, goToTab }) {
  return (
    <>
      <p className="m1-panel__text" style={{ marginBottom: '20px' }}>Đây là hồ sơ hoàn chỉnh hành trình khám phá dấu ấn lãnh đạo của bạn.</p>
      {M3_LEADERS.map(l => (
        <div key={l.id} className="m3-result-card">
          <div className="m3-result-card__name">{l.name}</div>
          <div className="m3-result-card__row"><strong>Quyết định / dấu ấn</strong>{m3Label(M3_MARKS, state.markMatches[l.id]) || '—'}</div>
          <div className="m3-result-card__row"><strong>Phẩm chất</strong>{m3Label(M3_QUALITIES, state.qualityMatches[l.id]) || '—'}</div>
          <div className="m3-result-card__row"><strong>Điều tiếp nối</strong>{m3Label(M3_CONTINUATIONS, state.continuationSelections[l.id]) || '—'}</div>
        </div>
      ))}
      <div className="m3-result-card">
        <div className="m3-result-card__name">Chia sẻ cá nhân</div>
        <p className="m3-result-card__reflection">{(state.leadershipReflection || '').trim() || '—'}</p>
      </div>

      <section className="m1-panel" style={{ marginTop: '20px' }}>
        <h3 className="m1-panel__subtitle" style={{ marginTop: 0 }}>Kiểm tra hợp lệ</h3>
        <ul className="m3-check-valid">
          {validityChecklist(state).map(item => (
            <li key={item.code}>
              <span className={`m3-check-valid__icon ${item.ok ? 'is-ok' : 'is-no'}`}>{item.ok ? '✓' : '!'}</span>
              <span className="m3-check-valid__label">{item.label}</span>
              {!item.ok && (
                <button type="button" className="m3-check-valid__fix" onClick={() => goToTab(item.tab)}>
                  Sửa ở Tab 0{item.tab} →
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

/* ============================================================
   PAGE
   ============================================================ */
function renderTab(props) {
  switch (props.tab) {
    case 1: return <Tab1Intro {...props} />;
    case 2: return <Tab2Leaders {...props} />;
    case 3: return <Tab3Decode {...props} />;
    case 4: return <Tab4Legacy {...props} />;
    default: return <Tab5Result {...props} />;
  }
}

const PAGE_CONFIG = {
  id: M3_CONFIG.missionId,
  num: '03',
  points: M3_CONFIG.points,
  code: M3_CONFIG.code,
  title: M3_CONFIG.title,
  desc: 'Mở năm hồ sơ lãnh đạo, giải mã dấu ấn – phẩm chất và chia sẻ điều người CTIN hôm nay cần tiếp nối.'
};

export default function Mission3Page() {
  // Production: chặn phát hành khi còn hồ sơ lãnh đạo chưa được BTC phê duyệt
  if (M3_PUBLISH_BLOCKED) {
    return (
      <main className="m1-page">
        <div className="m1-header">
          <div className="container">
            <p className="m1-header__label mono">{M3_CONFIG.code}</p>
            <h1 className="m1-header__title"><span className="m1-header__num">03</span>{M3_CONFIG.title}</h1>
          </div>
        </div>
        <div className="m1-content">
          <div className="container">
            <section className="m1-panel" style={{ textAlign: 'center' }}>
              <h2 className="m1-panel__title">Mission 03 sắp mở</h2>
              <p className="m1-panel__text">Nội dung hồ sơ lãnh đạo đang chờ Ban Tổ chức phê duyệt. Vui lòng quay lại sau.</p>
              <Link to="/dashboard" className="btn btn--gold" style={{ marginTop: '16px' }}>← Về Dashboard</Link>
            </section>
          </div>
        </div>
      </main>
    );
  }

  return (
    <MissionGame
      config={PAGE_CONFIG}
      tabs={M3_TABS}
      lsPrefix={LS_PREFIX}
      normalizeState={normalizeState}
      maxReachableTab={maxReachableTab}
      isAllValid={isAllValid}
      checkTab={checkTab}
      canTryNext={canTryNext}
      buildSubmission={(s) => ({ longText: buildSubmissionText(s), answers: buildAnswers(s) })}
      renderTab={renderTab}
    />
  );
}
