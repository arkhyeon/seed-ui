import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import styled from '@emotion/styled';
import GuideTour from '../components/GuideTour';
import { findButton, modalWrapOf, tourTarget, unionRect } from '../components/guideTourTarget';

/**
 * tourTarget 문서용 미리보기
 * 샘플 화면(render)을 그리고, 예시 코드와 같은 target(make)이 가리키는 곳에 테두리를 그림.
 * [투어로 보기] → 그 target 한 단계짜리 GuideTour 실행
 *
 * demo = { code, make: refs => target 함수, render: refs => JSX }
 * refs = { root, input, a, b }  (샘플 화면에서 자유롭게 사용)
 */
export function TargetPreview({ demo, title, desc }) {
  const root = useRef(null);
  const input = useRef(null);
  const a = useRef(null);
  const b = useRef(null);
  const refs = useMemo(() => ({ root, input, a, b }), []);
  const target = useMemo(() => demo.make(refs), [demo, refs]);
  const [box, setBox] = useState(null);
  const [tour, setTour] = useState(false);
  const steps = useMemo(() => [{ target, title, content: desc }], [target, title, desc]);

  // target 위치 → 미리보기 칸 기준 좌표 (요소면 getBoundingClientRect, 영역이면 그대로)
  useLayoutEffect(() => {
    const measure = () => {
      const t = target();
      const host = root.current?.getBoundingClientRect();
      if (!t || !host) return setBox(null);
      const r = typeof t.getBoundingClientRect === 'function' ? t.getBoundingClientRect() : t;
      return setBox({
        // absolute 기준은 테두리 안쪽 → 미리보기 칸 테두리 두께만큼 빼기
        top: r.top - host.top - root.current.clientTop,
        left: r.left - host.left - root.current.clientLeft,
        width: r.width,
        height: r.height,
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root.current);
    return () => ro.disconnect();
  }, [target]);

  return (
    <Wrap>
      <Sandbox ref={root}>
        {demo.render(refs)}
        {box ? (
          // 대상 바깥으로 3px 띄워 감쌈 (GuideTour 스포트라이트처럼)
          <Outline
            style={{
              top: box.top - 3,
              left: box.left - 3,
              width: box.width + 6,
              height: box.height + 6,
            }}
          >
            <span>target</span>
          </Outline>
        ) : (
          <NoTarget>대상 없음 → 화면 가운데에 설명창만 표시</NoTarget>
        )}
      </Sandbox>
      <PlayButton type="button" onClick={() => setTour(true)}>
        ▶ 투어로 보기
      </PlayButton>
      <GuideTour open={tour} steps={steps} onClose={() => setTour(false)} />
    </Wrap>
  );
}

// ─── 샘플 화면 조각 ────────────────────────────────────────

function FakeModal({ inputRef, children }) {
  return (
    <Modalish className="modal-wrap">
      <header>분류 추가</header>
      <Row>
        이름 <input ref={inputRef} placeholder="01서버팀" />
      </Row>
      {children}
      <Foot>
        <button type="button">취소</button>
        <button type="button">확인</button>
      </Foot>
    </Modalish>
  );
}

function FakeGrid({ rootRef }) {
  return (
    <Gridish ref={rootRef}>
      <div className="ag-header">
        <span>업무명</span>
        <span>업무 코드</span>
      </div>
      <div className="ag-body">
        <span>고객</span>
        <span>A01</span>
        <span>계약</span>
        <span>A02</span>
      </div>
    </Gridish>
  );
}

// GoJS 흉내: 문서 좌표 → 화면 좌표 변환만 구현한 가짜 diagram
const point = (x, y) => ({
  x,
  y,
  copy: () => point(x, y),
  offset(dx, dy) {
    return point(x + dx, y + dy);
  },
});
const fakeDiagram = div => ({
  div,
  transformDocToView: p => ({ x: p.x + 10, y: p.y + 10 }),
  findNodeForKey: () => ({ actualBounds: { position: point(60, 16), width: 90, height: 40 } }),
});

// ─── 함수별 데모 (code = 카드에 보이는 코드, make = 실제로 쓰는 target) ─────

export const TOUR_TARGET_DEMOS = {
  ref: {
    code: 'target: tourTarget.ref(inputRef)',
    make: r => tourTarget.ref(r.input),
    render: r => (
      <Row>
        이름 <input ref={r.input} placeholder="inputRef" />
      </Row>
    ),
  },
  button: {
    code: "target: tourTarget.button('추가', 범위)",
    make: r => tourTarget.button('추가', r.root),
    render: () => (
      <Foot>
        <button type="button">취소</button>
        <button type="button">추가</button>
        <button type="button">삭제</button>
      </Foot>
    ),
  },
  inModal: {
    code: "target: tourTarget.inModal(inputRef, '.ag-body')",
    make: r => tourTarget.inModal(r.input, '.ag-body'),
    render: r => (
      <FakeModal inputRef={r.input}>
        <FakeGrid />
      </FakeModal>
    ),
  },
  all: {
    code: `target: tourTarget.all('[data-col="fixed"]', 범위)`,
    make: r => tourTarget.all('[data-col="fixed"]', r.root),
    render: () => (
      <Tableish>
        <span />
        <b data-col="fixed">항상</b>
        <b>확대</b>
        {['서버', '테이블', '관계 컬럼'].map(n => (
          <React.Fragment key={n}>
            <span>{n}</span>
            <i data-col="fixed">☑</i>
            <i>☐</i>
          </React.Fragment>
        ))}
      </Tableish>
    ),
  },
  none: {
    code: 'target: tourTarget.none',
    make: () => tourTarget.none,
    render: () => <Muted>(캔버스 라벨처럼 DOM이 없는 대상은 content에 그림으로 안내)</Muted>,
  },
  query: {
    code: "target: tourTarget.query('.ag-header', gridRef)",
    make: r => tourTarget.query('.ag-header', r.a),
    render: r => <FakeGrid rootRef={r.a} />,
  },
  id: {
    code: "target: tourTarget.id('pg-save-btn')",
    make: () => tourTarget.id('pg-save-btn'),
    render: () => (
      <Foot>
        <button type="button">취소</button>
        <button type="button" id="pg-save-btn">
          저장
        </button>
      </Foot>
    ),
  },
  union: {
    code: "target: tourTarget.union(inputRef, tourTarget.button('저장', 범위))",
    make: r => tourTarget.union(r.input, tourTarget.button('저장', r.root)),
    render: r => (
      <Row>
        이름 <input ref={r.input} placeholder="inputRef" />
        <span style={{ flex: 1 }} />
        <button type="button">취소</button>
        <button type="button">저장</button>
      </Row>
    ),
  },
  first: {
    code: `target: tourTarget.first(
  tourTarget.query('.ag-header-cell[col-id="name"]', gridRef), // 없음
  tourTarget.query('.ag-header', gridRef),                     // ← 대체
)`,
    make: r =>
      tourTarget.first(
        tourTarget.query('.ag-header-cell[col-id="name"]', r.a),
        tourTarget.query('.ag-header', r.a),
      ),
    render: r => <FakeGrid rootRef={r.a} />,
  },
  diagramPart: {
    code: `target: tourTarget.diagramPart(
  () => diagramRef.current?.getDiagram(),
  d => d.findNodeForKey(key),
)`,
    make: r =>
      tourTarget.diagramPart(
        () => r.a.current && fakeDiagram(r.a.current),
        d => d.findNodeForKey('A01'),
      ),
    render: r => (
      <Canvasish ref={r.a}>
        <div style={{ top: 26, left: 70 }}>A01 고객</div>
        <div style={{ top: 26, left: 190 }}>A02 계약</div>
        <small>캔버스 (DOM 없음)</small>
      </Canvasish>
    ),
  },
  modalOf: {
    code: "tourTarget.button('확인', tourTarget.modalOf(inputRef))",
    make: r => tourTarget.button('확인', tourTarget.modalOf(r.input)),
    render: r => <FakeModal inputRef={r.input} />,
  },
  unionRect: {
    code: 'target: () => unionRect([aRef.current, bRef.current])',
    make: r => () => unionRect([r.a.current, r.b.current]),
    render: r => (
      <Foot>
        <button type="button" ref={r.a}>
          a
        </button>
        <button type="button">c</button>
        <button type="button" ref={r.b}>
          b
        </button>
      </Foot>
    ),
  },
  findButton: {
    code: "target: () => findButton('삭제', 범위)",
    make: r => () => findButton('삭제', r.root),
    render: () => (
      <Foot>
        <button type="button">추가</button>
        <button type="button">삭제</button>
      </Foot>
    ),
  },
  modalWrapOf: {
    code: 'target: () => modalWrapOf(inputRef.current)',
    make: r => () => modalWrapOf(r.input.current),
    render: r => <FakeModal inputRef={r.input} />,
  },
};

// ─── 스타일 ────────────────────────────────────────────────

const Wrap = styled.div``;

const Sandbox = styled.div`
  position: relative;
  padding: 16px;
  border: 1px dashed var(--pg-border);
  border-radius: 6px;
  background: var(--pg-stage);
  font-size: 15px;

  input,
  button {
    font: inherit;
  }

  button {
    padding: 4px 10px;
    border: 1px solid var(--pg-border);
    border-radius: 4px;
    background: var(--pg-panel);
    color: var(--pg-text);
  }
`;

const Outline = styled.div`
  position: absolute;
  box-sizing: border-box;
  border: 2px solid #ff6b00;
  border-radius: 4px;
  pointer-events: none;
  box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.2);

  & > span {
    position: absolute;
    top: -18px;
    left: -2px;
    padding: 0 4px;
    border-radius: 3px;
    background: #ff6b00;
    color: #fff;
    font-size: 10px;
    line-height: 16px;
  }
`;

const NoTarget = styled.div`
  margin-top: 8px;
  color: #ff6b00;
  font-size: 12px;
`;

const PlayButton = styled.button`
  margin-top: 10px;
  padding: 0;
  border: none;
  background: none;
  color: var(--pg-muted);
  font-size: 14px;
  cursor: pointer;

  &:hover {
    color: var(--pg-text);
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Foot = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 6px;
`;

const Modalish = styled.div`
  max-width: 360px;
  padding: 12px;
  border: 1px solid var(--pg-border);
  border-radius: 6px;
  background: var(--pg-panel);
  display: grid;
  gap: 10px;

  & > header {
    font-weight: 700;
  }
`;

const Gridish = styled.div`
  border: 1px solid var(--pg-border);
  border-radius: 4px;

  & > div {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 4px 8px;
  }

  & > .ag-header {
    background: var(--pg-chip-bg);
    font-weight: 700;
  }
`;

const Tableish = styled.div`
  display: grid;
  grid-template-columns: 1fr 48px 48px;
  row-gap: 4px;
  max-width: 260px;
  text-align: center;

  & > span {
    text-align: left;
  }

  & > i {
    font-style: normal;
  }
`;

const Canvasish = styled.div`
  position: relative;
  height: 80px;
  border-radius: 4px;
  background: repeating-linear-gradient(45deg, var(--pg-chip-bg) 0 6px, transparent 6px 12px);

  & > div {
    position: absolute;
    box-sizing: border-box; /* 가짜 노드 크기 = actualBounds(90x40) */
    width: 90px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #757575;
    background: #e0e0e0;
    color: #333;
    font-size: 12px;
  }

  & > small {
    position: absolute;
    right: 8px;
    bottom: 4px;
    color: var(--pg-muted);
  }
`;

const Muted = styled.div`
  color: var(--pg-muted);
`;
