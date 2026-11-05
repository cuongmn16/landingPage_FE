/* ============================================================
   MISSION 4 PAGE — CTIN DNA (7 tab, port từ src_demo/mission-4)
   Nhìn lại để hiểu mình – nhìn thẳng để bứt phá – kiến tạo Chương 26.
   ============================================================ */
import React from 'react';
import MissionGame from '../components/mission/MissionGame';
import { shuffle, countWords } from '../components/mission/missionUtils';
import {
  M4_CONFIG, M4_TABS, M4_INTRO, M4_DNA, M4_DNA_MEANINGS, M4_ERA_GROUPS, M4_PRESSURES,
  M4_CHANGES, M4_CHANGE_TARGETS, M4_LEADERSHIP, M4_LEADERSHIP_BEHAVIORS
} from '../data/mission4Data';
import WrapSelect from '../components/mission/WrapSelect';
import '../styles/mission4.css';

const LS_PREFIX = 'ctin_th_m4_v2_';
const ERA_PICK = 2;

/* Thứ tự đáp án được xáo một lần rồi lưu cùng tiến trình, để vào lại vẫn giữ nguyên */
function buildOrder() {
  const era = {};
  M4_ERA_GROUPS.forEach(g => { era[g.id] = shuffle(g.options.map(o => o.id)); });
  return {
    meanings: shuffle(M4_DNA_MEANINGS.map(m => m.id)),
    era,
    changes: shuffle(M4_CHANGE_TARGETS.map(t => t.id)),
    behaviors: shuffle(M4_LEADERSHIP_BEHAVIORS.map(b => b.id))
  };
}

const emptyEra = () => Object.fromEntries(M4_ERA_GROUPS.map(g => [g.id, []]));

const defaultState = () => ({
  agreed: false,
  dna: {},        // dna[valueId] = meaningId
  era: emptyEra(), // era[groupId] = [optId, optId]
  pressure: null,
  challenge: '',
  changes: {},    // changes[changeId] = toId
  leadership: {}, // leadership[msgId] = behaviorId
  priorityMessage: null,
  commitAction: '',
  commitScope: '',
  commitOutcome: '',
  visionPosition: '',
  visionValue: '',
  visionCapability: '',
  currentTab: 1,
  submittedAt: null,
  savedAt: null,
  order: buildOrder()
});

function normalizeState(data) {
  const base = defaultState();
  if (!data || typeof data !== 'object') return base;
  return {
    ...base,
    ...data,
    era: { ...base.era, ...(data.era || {}) },
    order: data.order || base.order
  };
}

/* Sắp lại danh sách theo thứ tự id đã xáo */
const byOrder = (ids, list) => ids.map(id => list.find(x => x.id === id)).filter(Boolean);

/* ---------- Validation ---------- */
const inRange = (n, min, max) => n >= min && n <= max;

const isTab1Valid = (s) => !!s.agreed;

const isTab2Valid = (s) => M4_DNA.every(d => !!s.dna[d.id]);

const isTab3Valid = (s) =>
  M4_ERA_GROUPS.every(g => (s.era[g.id] || []).length === ERA_PICK) &&
  !!s.pressure && true &&
  !!s.pressure;

const isTab4Valid = (s) => M4_CHANGES.every(c => s.changes[c.id] === c.toId);

const isTab5Valid = (s) => M4_LEADERSHIP.every(l => s.leadership[l.id] === l.behaviorId) && !!s.priorityMessage;

function commitFullText(s) {
  const a = (s.commitAction || '').trim();
  const b = (s.commitScope || '').trim();
  const c = (s.commitOutcome || '').trim();
  if (!a || !b || !c) return '';
  return `Trong Chương 26, tôi sẽ ${a}, trong ${b}, để ${c}.`;
}

function visionFullText(s) {
  const a = (s.visionPosition || '').trim();
  const b = (s.visionValue || '').trim();
  const c = (s.visionCapability || '').trim();
  if (!a || !b || !c) return '';
  return `Trong 25 năm tới, tôi hình dung CTIN sẽ ${a}, tạo ra ${b}, bằng ${c}.`;
}

const isTab6Valid = (s) => {
  const commit = commitFullText(s);
  const vision = visionFullText(s);
  if (!commit || !vision) return false;
  return inRange(countWords(commit), 15, 60) && inRange(countWords(vision), 15, 70);
};

const TAB_CHECKS = [isTab1Valid, isTab2Valid, isTab3Valid, isTab4Valid, isTab5Valid, isTab6Valid];

const isAllValid = (s) => TAB_CHECKS.every(fn => fn(s));

function maxReachableTab(s) {
  let max = 1;
  for (const fn of TAB_CHECKS) {
    if (!fn(s)) break;
    max++;
  }
  return max;
}

function validityChecklist(s) {
  return [
    { label: 'Đã xác nhận hiểu yêu cầu', ok: isTab1Valid(s) },
    { label: 'Đã chọn đủ 5 giá trị DNA CTIN', ok: isTab2Valid(s) },
    { label: 'Chọn 2 tác động/nhóm + áp lực lớn nhất + giải thích 20–40 từ', ok: isTab3Valid(s) },
    { label: 'Ghép đúng 5 chuyển đổi', ok: isTab4Valid(s) },
    { label: 'Ghép đúng 5 thông điệp lãnh đạo + chọn ưu tiên', ok: isTab5Valid(s) },
    { label: 'Cam kết 15–60 từ và tầm nhìn 15–70 từ', ok: isTab6Valid(s) }
  ];
}

const findPriority = (s) => M4_LEADERSHIP.find(l => l.id === s.priorityMessage) || null;
const findPressure = (s) => M4_PRESSURES.find(p => p.id === s.pressure) || null;

function eraSelections(s) {
  return M4_ERA_GROUPS.map(g => ({
    group_id: g.id,
    group_title: g.title,
    selected: (s.era[g.id] || []).map(oid => {
      const opt = g.options.find(o => o.id === oid);
      return { id: oid, label: opt ? opt.label : oid };
    })
  }));
}

/* Nội dung dễ đọc gửi cho admin chấm (hiển thị ở mục "Ghi chú / Trả lời") */
function buildSubmissionText(s) {
  const priority = findPriority(s);
  const pressure = findPressure(s);
  const lines = [
    `MISSION 04 · ${M4_CONFIG.code} — ${M4_CONFIG.title}`,
    '',
    'BẢNG KIỂM:',
    `✓ ${M4_DNA.length}/${M4_DNA.length} giá trị DNA ghép đúng`,
    `✓ ${M4_CHANGES.length}/${M4_CHANGES.length} chuyển đổi ghép đúng`,
    `✓ ${M4_LEADERSHIP.length}/${M4_LEADERSHIP.length} thông điệp lãnh đạo ghép đúng`,
    '',
    'THỜI ĐẠI MỚI — TÁC ĐỘNG QUAN TRỌNG NHẤT:'
  ];
  eraSelections(s).forEach(g => {
    lines.push(`• ${g.group_title}:`);
    g.selected.forEach(o => lines.push(`   - ${o.label}`));
  });
  lines.push(
    '',
    `ÁP LỰC LỚN NHẤT: ${pressure ? pressure.label : '—'}`,
    `Vì sao (${countWords(s.challenge)} từ): ${(s.challenge || '').trim()}`,
    '',
    `THÔNG ĐIỆP ƯU TIÊN: ${priority ? `${priority.en} — ${priority.vi}` : '—'}`,
    '',
    `CAM KẾT CÁ NHÂN (${countWords(commitFullText(s))} từ):`,
    commitFullText(s),
    '',
    `HÌNH DUNG CTIN 25 NĂM TỚI (${countWords(visionFullText(s))} từ):`,
    visionFullText(s)
  );
  return lines.join('\n');
}

function buildAnswers(s) {
  const priority = findPriority(s);
  return {
    valid_submission: isAllValid(s),
    dna: M4_DNA.map(d => ({
      id: d.id, name: d.name, name_vi: d.nameVi, meaning: d.meaning,
      correct: s.dna[d.id] === d.meaningId
    })),
    era: eraSelections(s),
    pressure: findPressure(s)?.label || s.pressure,
    pressure_id: s.pressure,
    challenge: s.challenge,
    changes: M4_CHANGES.map(c => ({ id: c.id, from: c.from, to: c.to, correct: s.changes[c.id] === c.toId })),
    leadership: M4_LEADERSHIP.map(l => ({
      id: l.id, en: l.en, vi: l.vi, behavior: l.behavior,
      correct: s.leadership[l.id] === l.behaviorId
    })),
    priority_message: priority ? { id: priority.id, en: priority.en, vi: priority.vi, behavior: priority.behavior } : null,
    commit_action: s.commitAction,
    commit_scope: s.commitScope,
    commit_outcome: s.commitOutcome,
    commit_full_text: commitFullText(s),
    vision_position: s.visionPosition,
    vision_value: s.visionValue,
    vision_capability: s.visionCapability,
    vision_full_text: visionFullText(s)
  };
}

/* ============================================================
   UI PARTS
   ============================================================ */
/* Một hàng ghép: nhãn bên trái, dropdown đáp án bên phải (đúng → xanh, sai → đỏ) */
function MatchRow({ label, sub, selected, correctId, options, placeholder, onChange }) {
  let cls = '';
  if (selected) cls = (!correctId || selected === correctId) ? 'is-correct' : 'is-wrong';
  return (
    <div className="m4-match-row">
      <div>
        <span className="m4-match-row__label">{label}</span>
        {sub && <span className="m4-match-row__sub">{sub}</span>}
      </div>
      <WrapSelect className={cls} value={selected || ''} onChange={(e) => onChange(e.target.value || null)}>
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
      </WrapSelect>
    </div>
  );
}

function WordMeta({ text, min, max }) {
  if (!text) return <p className="m4-field__meta"></p>;
  const n = countWords(text);
  return <p className={`m4-field__meta ${inRange(n, min, max) ? 'is-ok' : 'is-warn'}`}>{n} từ (yêu cầu {min}–{max})</p>;
}

function TextField({ id, label, placeholder, value, onChange }) {
  return (
    <div className="m4-field">
      <label className="m4-field__label" htmlFor={id}>{label}</label>
      <input type="text" id={id} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

/* ============================================================
   TAB CONTENTS
   ============================================================ */
function Tab1Intro({ state, update }) {
  return (
    <section className="m1-panel">
      <div className="m1-panel__grid">
        <div className="m1-panel__main">
          <p className="m1-panel__label mono">{M4_INTRO.label}</p>
          <h2 className="m1-panel__title">{M4_INTRO.title}</h2>
          <p className="m1-panel__text">{M4_INTRO.description}</p>
          <h3 className="m1-panel__subtitle">Kết quả cần hoàn thành</h3>
          <p className="m1-panel__text">{M4_INTRO.result}</p>
          <p className="m1-panel__text">Tiến trình được tự động lưu — bạn có thể thoát ra và quay lại chơi tiếp bất cứ lúc nào.</p>
        </div>
        <aside className="m1-panel__side">
          <div className="m1-req-box">
            <h4 className="m1-req-box__title">{M4_INTRO.requirementTitle}</h4>
            <p className="m1-req-box__text">{M4_INTRO.requirementText}</p>
            <label className="m1-checkbox">
              <input type="checkbox" checked={state.agreed} onChange={(e) => update({ agreed: e.target.checked })} />
              <span>{M4_INTRO.confirmLabel}</span>
            </label>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Tab2Dna({ state, update }) {
  const meanings = byOrder(state.order.meanings, M4_DNA_MEANINGS);
  return (
    <section className="m1-panel">
      <p className="m4-act mono">HỒI I · NHÌN LẠI ĐỂ HIỂU MÌNH</p>
      <h2 className="m1-panel__title">Điều gì đã tạo nên CTIN ngày hôm nay?</h2>
      <p className="m1-panel__text">Mỗi doanh nghiệp đều có ngày thành lập. Nhưng chỉ có những doanh nghiệp có bản sắc mới có một hành trình đáng kể.</p>
      <p className="m1-panel__text" style={{ marginBottom: '20px' }}>Hãy kết nối từng giá trị cốt lõi với ý nghĩa mà giá trị đó cần được thể hiện trong hành động.</p>
      {M4_DNA.map(d => (
        <MatchRow
          key={d.id}
          label={d.name}
          sub={d.nameVi}
          selected={state.dna[d.id]}
          correctId={null}
          options={meanings}
          placeholder="— Chọn ý nghĩa hành vi —"
          onChange={(v) => update(s => ({ dna: { ...s.dna, [d.id]: v } }))}
        />
      ))}
      {isTab2Valid(state) && <p className="m4-note">5 giá trị cốt lõi này chính là DNA của CTIN.</p>}
    </section>
  );
}

function Tab3Era({ state, update }) {
  function toggle(gid, oid) {
    update(s => {
      const sel = s.era[gid] || [];
      if (sel.includes(oid)) return { era: { ...s.era, [gid]: sel.filter(x => x !== oid) } };
      if (sel.length >= ERA_PICK) return {};
      return { era: { ...s.era, [gid]: [...sel, oid] } };
    });
  }

  return (
    <section className="m1-panel">
      <p className="m4-act mono">HỒI II · NHÌN THẲNG ĐỂ BỨT PHÁ</p>
      <h2 className="m1-panel__title">Chúng ta đang ở đâu?</h2>
      <p className="m1-panel__text">Thế giới đã thay đổi. Thị trường đã thay đổi. Khách hàng đã thay đổi. Đối thủ đã thay đổi. CTIN cũng phải thay đổi.</p>
      <p className="m1-panel__text" style={{ marginBottom: '20px' }}>Ở mỗi nhóm, hãy lựa chọn <strong>{ERA_PICK} tác động</strong> mà bạn cho là quan trọng nhất đối với CTIN.</p>

      {M4_ERA_GROUPS.map(g => {
        const selected = state.era[g.id] || [];
        const full = selected.length >= ERA_PICK;
        return (
          <div key={g.id} className="m4-era-group">
            <div className="m4-era-group__title">{g.title}</div>
            <div className="m4-era-group__sub">{g.subtitle}</div>
            <div className={`m4-era-group__count ${full ? 'is-ok' : ''}`}>Đã chọn {selected.length}/{ERA_PICK}</div>
            <div className="m4-check-list">
              {byOrder(state.order.era[g.id] || [], g.options).map(o => {
                const checked = selected.includes(o.id);
                const disabled = full && !checked;
                return (
                  <label key={o.id} className={`m4-check ${checked ? 'is-selected' : ''} ${disabled ? 'is-disabled' : ''}`}>
                    <input type="checkbox" checked={checked} disabled={disabled} onChange={() => toggle(g.id, o.id)} />
                    <span>{o.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}

      <h3 className="m1-panel__subtitle" style={{ marginTop: '28px' }}>Thay đổi nào đang tạo ra áp lực lớn nhất đối với CTIN?</h3>
      <div className="m4-priority">
        {M4_PRESSURES.map(p => (
          <label key={p.id} className={state.pressure === p.id ? 'is-selected' : ''}>
            <input type="radio" name="pressure" checked={state.pressure === p.id} onChange={() => update({ pressure: p.id })} />
            <span>{p.label}</span>
          </label>
        ))}
      </div>
      <div className="m4-field" style={{ marginTop: '20px' }}>
        <label className="m4-field__label" htmlFor="m4Challenge">Vì sao? <span>(20–40 từ)</span></label>
        <textarea
          id="m4Challenge"
          rows={3}
          placeholder="Giải thích ngắn gọn nhận định của bạn…"
          value={state.challenge}
          onChange={(e) => update({ challenge: e.target.value })}
        />
        <p className={`m4-field__meta ${inRange(countWords(state.challenge), 20, 40) ? 'is-ok' : 'is-warn'}`}>
          {countWords(state.challenge)} từ (yêu cầu 20–40)
        </p>
      </div>
    </section>
  );
}

function Tab4Changes({ state, update }) {
  const targets = byOrder(state.order.changes, M4_CHANGE_TARGETS);
  return (
    <section className="m1-panel">
      <p className="m4-act mono">ĐIỂM CHUYỂN</p>
      <h2 className="m1-panel__title">Không có tương lai nếu chỉ tự hào về quá khứ</h2>
      <p className="m1-panel__text" style={{ marginBottom: '20px' }}>Với mỗi cách làm hiện tại, hãy lựa chọn trạng thái mà CTIN cần chuyển tới trong giai đoạn mới.</p>
      {M4_CHANGES.map(c => (
        <MatchRow
          key={c.id}
          label={c.from}
          selected={state.changes[c.id]}
          correctId={c.toId}
          options={targets}
          placeholder="— Cần chuyển tới —"
          onChange={(v) => update(s => ({ changes: { ...s.changes, [c.id]: v } }))}
        />
      ))}
    </section>
  );
}

function Tab5Leadership({ state, update }) {
  const behaviors = byOrder(state.order.behaviors, M4_LEADERSHIP_BEHAVIORS);
  return (
    <section className="m1-panel">
      <p className="m4-act mono">HỒI III · KIẾN TẠO TƯƠNG LAI</p>
      <h2 className="m1-panel__title">Người CTIN mới</h2>
      <p className="m1-panel__text" style={{ marginBottom: '20px' }}>Năm thông điệp lãnh đạo không phải khẩu hiệu; đó là những kỳ vọng cần được thể hiện bằng hành vi mỗi ngày.</p>
      {M4_LEADERSHIP.map(l => (
        <MatchRow
          key={l.id}
          label={l.en}
          sub={l.vi}
          selected={state.leadership[l.id]}
          correctId={l.behaviorId}
          options={behaviors}
          placeholder="— Chọn hành vi —"
          onChange={(v) => update(s => ({ leadership: { ...s.leadership, [l.id]: v } }))}
        />
      ))}
      <h3 className="m1-panel__subtitle" style={{ marginTop: '28px' }}>Bạn muốn ưu tiên thực hành thông điệp nào trước?</h3>
      <div className="m4-priority">
        {M4_LEADERSHIP.map(l => (
          <label key={l.id} className={state.priorityMessage === l.id ? 'is-selected' : ''}>
            <input type="radio" name="priority" checked={state.priorityMessage === l.id} onChange={() => update({ priorityMessage: l.id })} />
            <span><strong>{l.en}</strong> — {l.vi}</span>
          </label>
        ))}
      </div>
    </section>
  );
}

function Tab6Chapter26({ state, update }) {
  const priority = findPriority(state);
  const cText = commitFullText(state);
  const vText = visionFullText(state);
  const field = (key) => ({ value: state[key], onChange: (v) => update({ [key]: v }) });

  return (
    <section className="m1-panel">
      <p className="m4-act mono">CHƯƠNG 26 · HÀNH TRÌNH VẪN TIẾP TỤC</p>
      <h2 className="m1-panel__title">Từ điều hiểu được đến điều sẽ làm</h2>
      {priority && (
        <div className="m4-context-chip">
          Thông điệp bạn ưu tiên: <strong>{priority.en}</strong> — {priority.vi}. {priority.behavior}
        </div>
      )}

      <h3 className="m1-panel__subtitle">Cam kết cá nhân</h3>
      <p className="m1-panel__text">Trong Chương 26, tôi sẽ…</p>
      <TextField id="m4CommitAction" label="Tôi sẽ làm gì?" placeholder="Một hành động cụ thể" {...field('commitAction')} />
      <TextField id="m4CommitScope" label="Trong phạm vi nào?" placeholder="Công việc, đội nhóm hoặc khách hàng" {...field('commitScope')} />
      <TextField id="m4CommitOutcome" label="Để tạo ra kết quả gì?" placeholder="Kết quả có thể nhận thấy" {...field('commitOutcome')} />
      <div className="m4-preview">{cText || <em>Câu hoàn chỉnh sẽ hiện tại đây…</em>}</div>
      <WordMeta text={cText} min={15} max={60} />
      <details className="m4-hint">
        <summary>Gợi ý (không bắt buộc)</summary>
        <div className="m4-hint__body">Tôi sẽ chủ động chia sẻ thông tin và phối hợp sớm hơn, trong các công việc liên đơn vị, để vấn đề được giải quyết nhanh và đồng bộ hơn.</div>
      </details>

      <h3 className="m1-panel__subtitle" style={{ marginTop: '32px' }}>Hình dung CTIN trong 25 năm tới</h3>
      <p className="m1-panel__text">Tôi hình dung CTIN trong 25 năm tới…</p>
      <TextField id="m4VisionPosition" label="CTIN sẽ trở thành ai?" placeholder="Vị thế hoặc hình ảnh tương lai" {...field('visionPosition')} />
      <TextField id="m4VisionValue" label="CTIN sẽ tạo ra giá trị gì?" placeholder="Cho khách hàng, xã hội hoặc CBNV" {...field('visionValue')} />
      <TextField id="m4VisionCapability" label="Bằng năng lực/cách làm nào?" placeholder="Năng lực hoặc cách thức cốt lõi" {...field('visionCapability')} />
      <div className="m4-preview">{vText || <em>Câu hoàn chỉnh sẽ hiện tại đây…</em>}</div>
      <WordMeta text={vText} min={15} max={70} />
      <details className="m4-hint">
        <summary>Gợi ý (không bắt buộc)</summary>
        <div className="m4-hint__body">CTIN trở thành doanh nghiệp tích hợp giải pháp công nghệ được khách hàng tin cậy, tạo ra giá trị bền vững, bằng năng lực đổi mới, học hỏi và tinh thần One Team.</div>
      </details>
    </section>
  );
}

function Tab7Result({ state }) {
  const priority = findPriority(state);
  const pressure = findPressure(state);
  return (
    <>
      <p className="m1-panel__text" style={{ marginBottom: '20px' }}>Đây là kết quả tổng hợp hành trình nhìn lại – nhìn thẳng – kiến tạo của bạn.</p>

      <div className="m4-result-block">
        <div className="m4-result-block__act mono">HỒI I · NHÌN LẠI ĐỂ HIỂU MÌNH</div>
        <div className="m4-result-block__title">DNA CTIN</div>
        <ul className="m4-result-list">
          {M4_DNA.map(d => <li key={d.id}><strong>{d.name}</strong> — {d.nameVi}</li>)}
        </ul>
        <p style={{ marginTop: '12px', fontSize: '0.9rem', color: 'var(--clr-ink-2)' }}>Năm giá trị cốt lõi là nền tảng tạo nên cách CTIN lựa chọn, hành động và phát triển.</p>
      </div>

      <div className="m4-result-block">
        <div className="m4-result-block__act mono">HỒI II · NHÌN THẲNG ĐỂ BỨT PHÁ</div>
        <div className="m4-result-block__title">Điều phải thay đổi</div>
        <ul className="m4-result-list">
          {M4_CHANGES.map(c => <li key={c.id}><strong>{c.from}</strong> → {c.to}</li>)}
        </ul>
        {pressure && (
          <>
            <p style={{ marginTop: '12px', fontSize: '0.9rem' }}><strong>Áp lực lớn nhất:</strong> {pressure.label}</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--clr-ink-2)' }}>{state.challenge}</p>
          </>
        )}
      </div>

      <div className="m4-result-block">
        <div className="m4-result-block__act mono">HỒI III · KIẾN TẠO TƯƠNG LAI</div>
        <div className="m4-result-block__title">Người CTIN mới &amp; Chương 26</div>
        <ul className="m4-result-list">
          {M4_LEADERSHIP.map(l => <li key={l.id}><strong>{l.en}</strong> ({l.vi}) — {l.behavior}</li>)}
        </ul>
        {priority && <p style={{ marginTop: '12px' }}><strong>Ưu tiên của bạn:</strong> {priority.en} — {priority.vi}</p>}
        <p style={{ marginTop: '14px', lineHeight: 1.65 }}>{commitFullText(state)}</p>
        <p style={{ marginTop: '10px', lineHeight: 1.65 }}>{visionFullText(state)}</p>
      </div>

      <section className="m1-panel" style={{ marginTop: '20px' }}>
        <h3 className="m1-panel__subtitle" style={{ marginTop: 0 }}>Kiểm tra hợp lệ</h3>
        <ul className="m4-check-valid">
          {validityChecklist(state).map(item => (
            <li key={item.label}>
              <span className={`m4-check-valid__icon ${item.ok ? 'is-ok' : 'is-no'}`}>{item.ok ? '✓' : '!'}</span>
              <span>{item.label}</span>
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
function renderTab({ tab, state, update }) {
  switch (tab) {
    case 1: return <Tab1Intro state={state} update={update} />;
    case 2: return <Tab2Dna state={state} update={update} />;
    case 3: return <Tab3Era state={state} update={update} />;
    case 4: return <Tab4Changes state={state} update={update} />;
    case 5: return <Tab5Leadership state={state} update={update} />;
    case 6: return <Tab6Chapter26 state={state} update={update} />;
    default: return <Tab7Result state={state} />;
  }
}

export default function Mission4Page() {
  return (
    <MissionGame
      config={{
        id: M4_CONFIG.missionId,
        num: '04',
        points: M4_CONFIG.points,
        code: M4_CONFIG.code,
        title: M4_CONFIG.title,
        desc: 'Nhìn lại để hiểu mình – nhìn thẳng để bứt phá – kiến tạo tương lai cho Chương 26.'
      }}
      tabs={M4_TABS}
      lsPrefix={LS_PREFIX}
      normalizeState={normalizeState}
      maxReachableTab={maxReachableTab}
      isAllValid={isAllValid}
      buildSubmission={(s) => ({ longText: buildSubmissionText(s), answers: buildAnswers(s) })}
      renderTab={renderTab}
    />
  );
}
