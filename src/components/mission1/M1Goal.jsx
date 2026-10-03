import React from 'react';
import { M1_CONFIG } from '../../data/mission1Data';

export function M1Goal() {
  return (
    <section className="m1-section" id="m1-goal">
      <div className="container">
        <p className="m1-section__label mono">SECTION 01 — MỤC TIÊU</p>
        <h2 className="m1-section__title">Mục tiêu Mission</h2>
        <p className="m1-section__text">{M1_CONFIG.goal}</p>
      </div>
    </section>
  );
}

export function M1Tasks() {
  return (
    <section className="m1-section m1-section--light" id="m1-tasks">
      <div className="container">
        <p className="m1-section__label mono">SECTION 02 — NHIỆM VỤ</p>
        <h2 className="m1-section__title">Sáu nhiệm vụ</h2>
        <ol className="m1-tasks">
          {M1_CONFIG.tasks.map((task, idx) => (
            <li key={idx}>
              <span>{task}</span>
            </li>
          ))}
        </ol>
        <p className="m1-tasks__note">
          <strong>Bắt buộc:</strong> Journey Map phải thể hiện việc sử dụng các thẻ B, C, D, E;
          đội giải thích cơ sở chia giai đoạn và lý do đặt tên từng chặng.
        </p>
      </div>
    </section>
  );
}
