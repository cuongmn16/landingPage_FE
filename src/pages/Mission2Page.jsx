/* ============================================================
   MISSION 2 PAGE — LEGACY STORIES (7 tab, port từ src_demo/mission-2)
   Kể lại một ký ức thật với CTIN — bối cảnh, cảm xúc và điều còn lại.
   ============================================================ */
import React, { useState } from 'react';
import MissionGame from '../components/mission/MissionGame';
import { countWords } from '../components/mission/missionUtils';
import {
  M2_CONFIG, M2_TABS, M2_INTRO, M2_ROLES, M2_PERIODS, M2_KINDS, M2_VERIFIER_RELATIONS,
  M2_PERMISSIONS, M2_VALUES, M2_ARCHIVE_PHOTOS, m2Label, m2PromptsForKind, m2PhotosForPeriod
} from '../data/mission2Data';
import '../styles/mission2.css';

const LS_PREFIX = 'ctin_th_m2_v2_';
const MAX_FILES = 3;
// Khớp với cấu hình backend (app.submission.allowed-extensions, max-file-size-mb)
const ALLOWED_EXT = /\.(jpe?g|png|pdf|docx)$/i;
const MAX_FILE_MB = 10;

const HAS_VERIFIER_OPTIONS = [
  { id: 'yes', label: 'Có người có thể xác nhận' },
  { id: 'no', label: 'Không có hoặc không cần người xác nhận' }
];

const defaultState = () => ({
  agreed: false,
  role: null,
  period: null,
  approxTime: '',
  kind: null,
  archivePhotoId: null,
  promptA: '',
  promptB: '',
  promptC: '',
  title: '',
  story: '',
  people: '',
  hasVerifier: null, // true | false | null
  verifier: '',
  verifierUnit: '',
  verifierRelation: null,
  permission: null,
  value: null,
  takeaway: '',
  currentTab: 1,
  submittedAt: null,
  savedAt: null
});

function normalizeState(data) {
  const base = defaultState();
  if (!data || typeof data !== 'object') return base;
  return { ...base, ...data };
}

const countCharsNormalized = (text) => (text || '').replace(/\s+/g, ' ').trim().length;
const filled = (v) => !!String(v || '').trim();

/* ---------- Validation ---------- */
const isTab1Valid = (s) => !!s.agreed;

const isTab2Valid = (s) => {
  if (!s.role || !s.period || !s.kind) return false;
  return s.period !== 'P06' || filled(s.approxTime);
};

const isTab3Valid = (s) => filled(s.promptA) && filled(s.promptB) && filled(s.promptC);

const isTab4Valid = (s) => filled(s.title) && countCharsNormalized(s.story) >= 200;

const isTab5Valid = (s) => {
  if (!s.permission) return false;
  if (s.hasVerifier === true) return filled(s.verifier) && !!s.verifierRelation;
  return true;
};

const isTab6Valid = (s) => {
  if (!s.value) return false;
  const n = countWords(s.takeaway);
  return n >= 20 && n <= 40;
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
    { label: 'Đã chọn vai trò, thời gian và dạng ký ức', ok: isTab2Valid(s) },
    { label: 'Đã trả lời đủ 3 câu hỏi gợi nhớ', ok: isTab3Valid(s) },
    { label: 'Có tên câu chuyện và nội dung ≥ 200 ký tự', ok: isTab4Valid(s) },
    { label: 'Đã khai báo quyền sử dụng' + (s.hasVerifier === true ? ' và người xác nhận' : ''), ok: isTab5Valid(s) },
    { label: 'Đã chọn giá trị và đúc kết 20–40 từ', ok: isTab6Valid(s) }
  ];
}

function timeLabel(s) {
  if (s.period === 'P06' && s.approxTime) return s.approxTime;
  return m2Label(M2_PERIODS, s.period);
}

const findPhoto = (id) => (id ? M2_ARCHIVE_PHOTOS.find(p => p.id === id) || null : null);

/* Nội dung dễ đọc gửi cho admin chấm (hiển thị ở mục "Ghi chú / Trả lời") */
function buildSubmissionText(s, files) {
  const prompts = m2PromptsForKind(s.kind);
  const photo = findPhoto(s.archivePhotoId);
  const lines = [
    `MISSION 02 · ${M2_CONFIG.code} — ${M2_CONFIG.title}`,
    '',
    `TÊN CÂU CHUYỆN: ${s.title.trim()}`,
    `Dạng ký ức: ${m2Label(M2_KINDS, s.kind)}`,
    `Thời gian: ${timeLabel(s)}`,
    `Vai trò: ${m2Label(M2_ROLES, s.role)}`
  ];
  if (photo) lines.push(`Ảnh gợi nhớ: ${photo.id} · ${photo.title} (chờ xác minh — chỉ gợi nhớ)`);
  lines.push(
    '',
    'GỌI LẠI KÝ ỨC:',
    `1. ${prompts[0]}`, s.promptA.trim(),
    `2. ${prompts[1]}`, s.promptB.trim(),
    `3. ${prompts[2]}`, s.promptC.trim(),
    '',
    'CÂU CHUYỆN:',
    s.story.trim()
  );
  if (filled(s.people)) lines.push('', `NGƯỜI / ĐƠN VỊ LIÊN QUAN: ${s.people.trim()}`);
  if (files.length) lines.push('', `TƯ LIỆU ĐÍNH KÈM: ${files.map(f => f.name).join(', ')}`);
  if (s.hasVerifier === true) {
    lines.push('', 'NGƯỜI CÙNG LƯU GIỮ CÂU CHUYỆN:',
      `${s.verifier.trim()}${filled(s.verifierUnit) ? ` · ${s.verifierUnit.trim()}` : ''} — ${m2Label(M2_VERIFIER_RELATIONS, s.verifierRelation)}`);
  }
  lines.push(
    '',
    `QUYỀN SỬ DỤNG: ${m2Label(M2_PERMISSIONS, s.permission)}`,
    '',
    `ĐIỀU CÒN LẠI: ${m2Label(M2_VALUES, s.value)}`,
    `Câu chuyện này cho tôi thấy (${countWords(s.takeaway)} từ): ${s.takeaway.trim()}`
  );
  return lines.join('\n');
}

function buildAnswers(s, files) {
  return {
    valid_submission: isAllValid(s),
    role: m2Label(M2_ROLES, s.role), role_id: s.role,
    period: m2Label(M2_PERIODS, s.period), period_id: s.period,
    approx_time: s.approxTime || '',
    kind: m2Label(M2_KINDS, s.kind), kind_id: s.kind,
    archive_photo_id: s.archivePhotoId || null,
    prompt_a: s.promptA, prompt_b: s.promptB, prompt_c: s.promptC,
    title: s.title,
    story: s.story,
    people: s.people || '',
    memory_files: files.map(f => ({ name: f.name, size: f.size, type: f.type })),
    has_verifier: s.hasVerifier === true,
    verifier: s.verifier || '',
    verifier_unit: s.verifierUnit || '',
    verifier_relation: m2Label(M2_VERIFIER_RELATIONS, s.verifierRelation) || null,
    verifier_relation_id: s.verifierRelation || null,
    permission: m2Label(M2_PERMISSIONS, s.permission), permission_id: s.permission,
    value: m2Label(M2_VALUES, s.value), value_id: s.value,
    takeaway: s.takeaway
  };
}

/* ============================================================
   UI PARTS
   ============================================================ */
function Choices({ name, list, selected, onSelect, grid }) {
  return (
    <div className={`m2-choices ${grid ? 'm2-choices--grid' : ''}`}>
      {list.map(item => (
        <label key={item.id} className={`m2-choice ${selected === item.id ? 'is-selected' : ''}`}>
          <input type="radio" name={name} value={item.id} checked={selected === item.id} onChange={() => onSelect(item.id)} />
          <span>{item.label}</span>
        </label>
      ))}
    </div>
  );
}

const Optional = ({ children }) => (
  <span style={{ fontWeight: 400, fontSize: '0.9rem', color: 'var(--clr-ink-3)' }}>{children}</span>
);

/** Khối tóm tắt “Câu chuyện bạn đang kể” từ Tab 03 trở đi */
function StorySummary({ state, goToTab }) {
  const photo = findPhoto(state.archivePhotoId);
  return (
    <div className="m2-summary">
      <div className="m2-summary__head">
        <span className="m2-summary__label mono">CÂU CHUYỆN BẠN ĐANG KỂ</span>
        <button type="button" className="m2-summary__edit" onClick={() => goToTab(2)}>Thay đổi lựa chọn</button>
      </div>
      <div className="m2-summary__grid">
        <div><span className="m2-summary__k">Dạng ký ức</span><span className="m2-summary__v">{m2Label(M2_KINDS, state.kind) || 'Chưa chọn ký ức'}</span></div>
        <div><span className="m2-summary__k">Thời gian</span><span className="m2-summary__v">{timeLabel(state) || 'Chưa xác định thời gian'}</span></div>
        <div><span className="m2-summary__k">Vai trò</span><span className="m2-summary__v">{m2Label(M2_ROLES, state.role) || 'Chưa xác định vai trò'}</span></div>
        {photo && <div><span className="m2-summary__k">Ảnh gợi nhớ</span><span className="m2-summary__v">{photo.id}</span></div>}
      </div>
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
          <p className="m1-panel__label mono">{M2_INTRO.label}</p>
          <h2 className="m1-panel__title">{M2_INTRO.title}</h2>
          <p className="m1-panel__text">{M2_INTRO.description}</p>
          <h3 className="m1-panel__subtitle">Kết quả cần hoàn thành</h3>
          <p className="m1-panel__text">{M2_INTRO.result}</p>
          <p className="m1-panel__text">Tiến trình được tự động lưu — bạn có thể thoát ra và quay lại chơi tiếp bất cứ lúc nào.</p>
        </div>
        <aside className="m1-panel__side">
          <div className="m1-req-box">
            <h4 className="m1-req-box__title">{M2_INTRO.requirementTitle}</h4>
            <p className="m1-req-box__text">{M2_INTRO.requirementText}</p>
            <label className="m1-checkbox">
              <input type="checkbox" checked={state.agreed} onChange={(e) => update({ agreed: e.target.checked })} />
              <span>{M2_INTRO.confirmLabel}</span>
            </label>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Tab2Choose({ state, update }) {
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const photos = showAllPhotos ? M2_ARCHIVE_PHOTOS : m2PhotosForPeriod(state.period);

  function choosePeriod(id) {
    if (state.period !== id) setShowAllPhotos(false);
    update(s => ({
      period: id,
      // xóa ảnh khi đổi giai đoạn
      archivePhotoId: s.period !== id ? null : s.archivePhotoId,
      approxTime: id !== 'P06' ? '' : s.approxTime
    }));
  }

  return (
    <section className="m1-panel">
      <p className="m1-panel__label mono">BƯỚC 02</p>
      <h2 className="m1-panel__title">Chọn ký ức</h2>
      <p className="m1-panel__text">Mỗi người chỉ cần lựa chọn và hoàn thành <strong>một</strong> câu chuyện.</p>

      <h3 className="m2-section-title">Mối liên hệ của bạn với câu chuyện</h3>
      <Choices name="role" list={M2_ROLES} selected={state.role} onSelect={(id) => update({ role: id })} />

      <h3 className="m2-section-title">Thời gian xảy ra</h3>
      <Choices name="period" list={M2_PERIODS} selected={state.period} onSelect={choosePeriod} grid />
      {state.period === 'P06' && (
        <div className="m2-field" style={{ marginTop: '14px' }}>
          <label className="m2-field__label" htmlFor="m2ApproxTime">Khoảng thời gian ước tính <span>(bắt buộc)</span></label>
          <input
            type="text"
            id="m2ApproxTime"
            placeholder="Ví dụ: khoảng năm 2015"
            value={state.approxTime}
            onChange={(e) => update({ approxTime: e.target.value })}
          />
        </div>
      )}

      <h3 className="m2-section-title">Dạng ký ức</h3>
      <Choices name="kind" list={M2_KINDS} selected={state.kind} onSelect={(id) => update({ kind: id })} />

      <h3 className="m2-section-title">Kho ảnh gợi nhớ <Optional>(không bắt buộc)</Optional></h3>
      <p className="m2-field__hint">Có bức ảnh nào gợi cho bạn một câu chuyện? Ảnh chờ xác minh không được coi là chứng cứ lịch sử.</p>
      <div className="m2-photos">
        {photos.map(p => (
          <button
            key={p.id}
            type="button"
            className={`m2-photo ${state.archivePhotoId === p.id ? 'is-selected' : ''}`}
            onClick={() => update(s => ({ archivePhotoId: s.archivePhotoId === p.id ? null : p.id }))}
          >
            <div className="m2-photo__thumb">{p.id}</div>
            <div className="m2-photo__body">
              <div className="m2-photo__id">{p.id}</div>
              <div className="m2-photo__title">{p.title}</div>
              <div className="m2-photo__status">Chờ xác minh</div>
            </div>
          </button>
        ))}
      </div>
      {state.period && (
        <p className="m2-note">Đang hiển thị ảnh theo giai đoạn đã chọn. Nút xem đủ sẽ mở toàn bộ Hành lang ký ức ({M2_ARCHIVE_PHOTOS.length} vị trí).</p>
      )}
      {state.period && !showAllPhotos && state.period !== 'P06' && (
        <button type="button" className="btn btn--outline" style={{ marginTop: '12px' }} onClick={() => setShowAllPhotos(true)}>
          Xem đủ {M2_ARCHIVE_PHOTOS.length} vị trí
        </button>
      )}
    </section>
  );
}

function Tab3Recall({ state, update, goToTab }) {
  const prompts = m2PromptsForKind(state.kind);
  const fields = ['promptA', 'promptB', 'promptC'];
  return (
    <>
      <StorySummary state={state} goToTab={goToTab} />
      <section className="m1-panel">
        <p className="m1-panel__label mono">BƯỚC 03</p>
        <h2 className="m1-panel__title">Gọi lại ký ức</h2>
        <p className="m1-panel__text">Những câu hỏi dưới đây được gợi ý theo loại ký ức bạn đã chọn. Câu trả lời sẽ giúp bạn viết câu chuyện ở bước tiếp theo.</p>
        {fields.map((f, i) => (
          <div key={f} className="m2-field">
            <label className="m2-field__label" htmlFor={`m2${f}`}>{i + 1}. {prompts[i]}</label>
            <textarea
              id={`m2${f}`}
              rows={3}
              placeholder="Viết câu trả lời của bạn…"
              value={state[f]}
              onChange={(e) => update({ [f]: e.target.value })}
            />
          </div>
        ))}
      </section>
    </>
  );
}

function Tab4Write({ state, update, goToTab }) {
  const chars = countCharsNormalized(state.story);
  return (
    <>
      <StorySummary state={state} goToTab={goToTab} />
      <section className="m1-panel">
        <p className="m1-panel__label mono">BƯỚC 04</p>
        <h2 className="m1-panel__title">Viết lại ký ức</h2>
        <div className="m2-field">
          <label className="m2-field__label" htmlFor="m2StoryTitle">Tên câu chuyện <span>(bắt buộc)</span></label>
          <input
            type="text"
            id="m2StoryTitle"
            placeholder="Đặt một tên ngắn cho ký ức"
            value={state.title}
            onChange={(e) => update({ title: e.target.value })}
          />
        </div>
        <div className="m2-field">
          <label className="m2-field__label" htmlFor="m2StoryBody">Câu chuyện của bạn <span>(bắt buộc)</span></label>
          <p className="m2-field__hint">Hãy kể lại điều đã xảy ra, những người cùng đồng hành, khoảnh khắc hoặc cảm xúc khiến bạn nhớ nhất và ý nghĩa của câu chuyện đối với bạn.</p>
          <textarea
            id="m2StoryBody"
            className="m2-story"
            placeholder="Vào khoảng…, khi tôi/chúng tôi đang… Điều đã xảy ra là… Khoảnh khắc khiến tôi nhớ nhất là… Nhìn lại câu chuyện này, tôi nhận ra…"
            value={state.story}
            onChange={(e) => update({ story: e.target.value })}
          />
          <p className={`m2-field__meta ${chars >= 200 ? 'is-ok' : 'is-warn'}`}>
            {chars} ký tự (tối thiểu 200 sau khi chuẩn hóa khoảng trắng)
          </p>
          {chars < 200 && filled(state.story) && (
            <p className="m2-field__error">Hãy chia sẻ thêm một chút về điều đã xảy ra và vì sao ký ức này có ý nghĩa với bạn.</p>
          )}
        </div>
        <div className="m2-field">
          <label className="m2-field__label" htmlFor="m2StoryPeople">Những người hoặc đơn vị liên quan <span>(không bắt buộc)</span></label>
          <input
            type="text"
            id="m2StoryPeople"
            placeholder="Tên cá nhân, nhóm hoặc đơn vị"
            value={state.people}
            onChange={(e) => update({ people: e.target.value })}
          />
        </div>
      </section>
    </>
  );
}

function Tab5Keep({ state, update, toast, goToTab, files, setFiles }) {
  const hvSel = state.hasVerifier === true ? 'yes' : state.hasVerifier === false ? 'no' : null;
  const photo = findPhoto(state.archivePhotoId);

  function addFiles(e) {
    const picked = Array.from(e.target.files || []);
    e.target.value = '';
    const next = [...files];
    for (const f of picked) {
      if (next.length >= MAX_FILES) {
        toast(`Tối đa ${MAX_FILES} file.`, 'error');
        break;
      }
      if (!ALLOWED_EXT.test(f.name)) {
        toast('Định dạng không hỗ trợ: ' + f.name, 'error');
        continue;
      }
      if (f.size > MAX_FILE_MB * 1024 * 1024) {
        toast(`File vượt quá ${MAX_FILE_MB} MB: ${f.name}`, 'error');
        continue;
      }
      next.push(f);
    }
    setFiles(next);
  }

  function chooseHasVerifier(id) {
    const has = id === 'yes';
    update(has
      ? { hasVerifier: true }
      : { hasVerifier: false, verifier: '', verifierUnit: '', verifierRelation: null });
  }

  return (
    <>
      <StorySummary state={state} goToTab={goToTab} />
      <section className="m1-panel">
        <p className="m1-panel__label mono">BƯỚC 05</p>
        <h2 className="m1-panel__title">Lưu giữ</h2>
        <p className="m1-panel__text">Bạn có thể tải lên ảnh, tài liệu hoặc cung cấp thông tin về người cùng lưu giữ câu chuyện. Nếu đây là ký ức hoặc cảm nhận cá nhân và không có tư liệu hay người xác nhận, bạn vẫn có thể tiếp tục.</p>

        <h3 className="m2-section-title">Ảnh hoặc tài liệu của bạn <Optional>(không bắt buộc, tối đa {MAX_FILES} file)</Optional></h3>
        <div className="m2-upload">
          <p>Chấp nhận: JPG, PNG, PDF, DOCX · tối đa {MAX_FILE_MB} MB/file</p>
          <label className="btn btn--outline m2-upload__btn">
            Chọn file
            <input type="file" accept=".jpg,.jpeg,.png,.pdf,.docx" multiple onChange={addFiles} />
          </label>
          <ul className="m2-file-list">
            {files.map((f, i) => (
              <li key={`${f.name}-${i}`}>
                <span>{f.name} <small style={{ color: 'var(--clr-ink-3)' }}>({Math.round((f.size || 0) / 1024)} KB)</small></span>
                <button type="button" onClick={() => setFiles(files.filter((_, j) => j !== i))}>Xóa</button>
              </li>
            ))}
          </ul>
          <p className="m2-field__hint" style={{ marginTop: '10px', marginBottom: 0 }}>
            File được gửi kèm khi nộp bài và không được lưu nháp — nếu tải lại trang, hãy chọn lại file trước khi nộp.
          </p>
        </div>

        <h3 className="m2-section-title">Người cùng lưu giữ câu chuyện <Optional>(không bắt buộc)</Optional></h3>
        <p className="m2-field__hint">Người có thể chia sẻ thêm hoặc xác nhận câu chuyện, nếu có.</p>
        <Choices name="hasVerifier" list={HAS_VERIFIER_OPTIONS} selected={hvSel} onSelect={chooseHasVerifier} />
        {state.hasVerifier === true && (
          <div style={{ marginTop: '20px' }}>
            <div className="m2-field">
              <label className="m2-field__label" htmlFor="m2VerifierName">Họ và tên <span>(bắt buộc nếu có người xác nhận)</span></label>
              <input type="text" id="m2VerifierName" placeholder="Họ và tên" value={state.verifier} onChange={(e) => update({ verifier: e.target.value })} />
            </div>
            <div className="m2-field">
              <label className="m2-field__label" htmlFor="m2VerifierUnit">Đơn vị / phòng ban <span>(nếu biết)</span></label>
              <input type="text" id="m2VerifierUnit" placeholder="Đơn vị hoặc phòng ban" value={state.verifierUnit} onChange={(e) => update({ verifierUnit: e.target.value })} />
            </div>
            <div className="m2-field">
              <label className="m2-field__label">Mối liên hệ với câu chuyện <span>(bắt buộc)</span></label>
              <Choices name="relation" list={M2_VERIFIER_RELATIONS} selected={state.verifierRelation} onSelect={(id) => update({ verifierRelation: id })} />
            </div>
          </div>
        )}

        <h3 className="m2-section-title">Quyền sử dụng <Optional>(bắt buộc)</Optional></h3>
        <Choices name="permission" list={M2_PERMISSIONS} selected={state.permission} onSelect={(id) => update({ permission: id })} />

        {photo && (
          <>
            <h3 className="m2-section-title">Ảnh Hành lang ký ức đã chọn</h3>
            <p className="m2-note">
              {photo.id} · {photo.title} — Ảnh chỉ gợi nhớ, không thay thế tư liệu cá nhân hoặc thông tin người cùng lưu giữ câu chuyện.
            </p>
          </>
        )}
      </section>
    </>
  );
}

function Tab6Takeaway({ state, update, goToTab }) {
  const n = countWords(state.takeaway);
  return (
    <>
      <StorySummary state={state} goToTab={goToTab} />
      <section className="m1-panel">
        <p className="m1-panel__label mono">BƯỚC 06</p>
        <h2 className="m1-panel__title">Điều còn lại</h2>
        <p className="m1-panel__text">Từ một ký ức cá nhân, hãy nhận diện điều câu chuyện cho thấy về con người và hành trình CTIN.</p>
        <h3 className="m2-section-title">Giá trị hoặc tinh thần được thể hiện</h3>
        <Choices name="value" list={M2_VALUES} selected={state.value} onSelect={(id) => update({ value: id })} grid />
        <div className="m2-field" style={{ marginTop: '24px' }}>
          <label className="m2-field__label" htmlFor="m2Takeaway">Câu chuyện này cho tôi thấy… <span>(20–40 từ)</span></label>
          <textarea
            id="m2Takeaway"
            rows={4}
            placeholder="Viết phần đúc kết cá nhân của bạn…"
            value={state.takeaway}
            onChange={(e) => update({ takeaway: e.target.value })}
          />
          <p className={`m2-field__meta ${n >= 20 && n <= 40 ? 'is-ok' : 'is-warn'}`}>{n} từ (yêu cầu 20–40)</p>
        </div>
      </section>
    </>
  );
}

function Tab7Card({ state, files }) {
  const photo = findPhoto(state.archivePhotoId);
  const value = m2Label(M2_VALUES, state.value);
  const perm = m2Label(M2_PERMISSIONS, state.permission);
  const rel = m2Label(M2_VERIFIER_RELATIONS, state.verifierRelation);

  return (
    <>
      <p className="m1-panel__text" style={{ marginBottom: '20px' }}>Đây là câu chuyện hoàn chỉnh của bạn. Có thể quay lại các bước trước để chỉnh sửa trước khi nộp.</p>
      <article className="m2-card">
        <div className="m2-card__cover">
          <div className="m2-card__cover-label mono">{M2_CONFIG.code}</div>
          <h2 className="m2-card__cover-title">{state.title || 'Chưa đặt tên'}</h2>
          <div className="m2-card__cover-kind">{m2Label(M2_KINDS, state.kind)}</div>
        </div>
        <div className="m2-card__body">
          <div className="m2-card__section">
            <div className="m2-card__section-title">Thông tin câu chuyện</div>
            <div className="m2-card__meta-row">
              <span><strong>Thời gian:</strong> {timeLabel(state) || '—'}</span>
              <span><strong>Vai trò:</strong> {m2Label(M2_ROLES, state.role) || '—'}</span>
            </div>
          </div>
          {photo && (
            <div className="m2-card__section">
              <div className="m2-card__section-title">Ảnh gợi nhớ</div>
              <p>{photo.id} · {photo.title} <em style={{ color: 'var(--clr-ink-3)' }}>(chờ xác minh — chỉ gợi nhớ)</em></p>
            </div>
          )}
          <div className="m2-card__section">
            <div className="m2-card__section-title">Nội dung</div>
            <div className="m2-card__story">{state.story}</div>
          </div>
          {filled(state.people) && (
            <div className="m2-card__section">
              <div className="m2-card__section-title">Người / đơn vị liên quan</div>
              <p>{state.people}</p>
            </div>
          )}
          {files.length > 0 && (
            <div className="m2-card__section">
              <div className="m2-card__section-title">Tư liệu lưu giữ</div>
              <ul style={{ margin: 0, paddingLeft: '18px' }}>
                {files.map((f, i) => <li key={`${f.name}-${i}`}>{f.name}</li>)}
              </ul>
            </div>
          )}
          {state.hasVerifier === true && filled(state.verifier) && (
            <div className="m2-card__section">
              <div className="m2-card__section-title">Người cùng lưu giữ câu chuyện</div>
              <div className="m2-card__meta-row">
                <span><strong>Họ tên:</strong> {state.verifier}</span>
                {filled(state.verifierUnit) && <span><strong>Đơn vị:</strong> {state.verifierUnit}</span>}
                {rel && <span><strong>Mối liên hệ:</strong> {rel}</span>}
              </div>
            </div>
          )}
          <div className="m2-card__section">
            <div className="m2-card__section-title">Điều câu chuyện để lại</div>
            <p><strong>{value || '—'}</strong></p>
            <p style={{ marginTop: '8px', lineHeight: 1.6 }}>{state.takeaway}</p>
          </div>
          {perm && (
            <div className="m2-card__section">
              <div className="m2-card__section-title">Quyền sử dụng</div>
              <p>{perm}</p>
            </div>
          )}
        </div>
      </article>

      <section className="m1-panel" style={{ marginTop: '24px' }}>
        <h3 className="m2-section-title" style={{ marginTop: 0 }}>Kiểm tra hợp lệ</h3>
        <ul className="m2-check">
          {validityChecklist(state).map(item => (
            <li key={item.label}>
              <span className={`m2-check__icon ${item.ok ? 'is-ok' : 'is-no'}`}>{item.ok ? '✓' : '!'}</span>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
        <p className="m2-note" style={{ marginTop: '16px' }}>Bài hợp lệ được tính vào tỷ lệ tham gia của đơn vị. Điểm nội dung dùng cho xếp hạng cá nhân (chờ BTC khóa rubric).</p>
      </section>
    </>
  );
}

/* ============================================================
   PAGE
   ============================================================ */
export default function Mission2Page() {
  // File đính kèm giữ trong bộ nhớ (không lưu nháp được), gửi kèm khi nộp
  const [files, setFiles] = useState([]);

  function renderTab({ tab, state, update, toast, goToTab }) {
    const props = { state, update, toast, goToTab };
    switch (tab) {
      case 1: return <Tab1Intro {...props} />;
      case 2: return <Tab2Choose {...props} />;
      case 3: return <Tab3Recall {...props} />;
      case 4: return <Tab4Write {...props} />;
      case 5: return <Tab5Keep {...props} files={files} setFiles={setFiles} />;
      case 6: return <Tab6Takeaway {...props} />;
      default: return <Tab7Card state={state} files={files} />;
    }
  }

  return (
    <MissionGame
      config={{
        id: M2_CONFIG.missionId,
        num: '02',
        points: M2_CONFIG.points,
        code: M2_CONFIG.code,
        title: M2_CONFIG.title,
        desc: 'Kể lại một ký ức thật với CTIN — bối cảnh, cảm xúc và điều còn lại.'
      }}
      tabs={M2_TABS}
      lsPrefix={LS_PREFIX}
      normalizeState={normalizeState}
      maxReachableTab={maxReachableTab}
      isAllValid={isAllValid}
      buildSubmission={(s) => ({ longText: buildSubmissionText(s, files), answers: buildAnswers(s, files) })}
      renderTab={renderTab}
      getFiles={() => files}
    />
  );
}
