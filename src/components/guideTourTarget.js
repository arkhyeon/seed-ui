// tourTarget — GuideTour steps[].target 생성 헬퍼 (사용법·API: 플레이그라운드 /playground/tourTarget)

// ─── 기본 유틸 (직접 써도 됨) ───────────────────────────────

// ref·요소·함수·생략 → 실제 찾을 범위 요소
export const resolveRoot = root => {
  if (root === undefined) return document;
  if (typeof root === 'function') return root() ?? null;
  if (root && 'current' in root) return root.current ?? null;
  return root ?? null;
};

// 여러 요소(또는 DOMRect)를 모두 감싸는 사각형. 하나도 없으면 null
export const unionRect = items => {
  const rects = items
    .filter(Boolean)
    .map(it => (typeof it.getBoundingClientRect === 'function' ? it.getBoundingClientRect() : it))
    .filter(r => r.width > 0 || r.height > 0);
  if (!rects.length) return null;
  const top = Math.min(...rects.map(r => r.top));
  const left = Math.min(...rects.map(r => r.left));
  const bottom = Math.max(...rects.map(r => r.top + r.height));
  const right = Math.max(...rects.map(r => r.left + r.width));
  return { top, left, width: right - left, height: bottom - top };
};

// 요소가 들어있는 seed-ui Modal 바깥 틀(.modal-wrap)
export const modalWrapOf = el => el?.closest?.('.modal-wrap') ?? null;

// 글자가 정확히 같은 버튼 (앞뒤 공백 무시)
export const findButton = (text, root) =>
  [...(resolveRoot(root)?.querySelectorAll('button') ?? [])].find(
    b => b.textContent.trim() === text,
  ) ?? null;

// ─── target 함수 생성기 ─────────────────────────────────────

const resolveTarget = t => (typeof t === 'function' ? t() : resolveRoot(t));

export const tourTarget = {
  // 대상 없음 → 화면 가운데에 설명창만 (예시 그림을 content에 넣어 안내)
  none: () => null,

  // useRef 로 잡은 요소
  ref: ref => () => ref?.current ?? null,

  // id 로 찾기
  id: id => () => document.getElementById(id),

  // root 안 첫 번째 선택자 일치 요소 (ref·id를 못 다는 라이브러리 내부 요소: ag-grid 등)
  query: (selector, root) => () => resolveRoot(root)?.querySelector(selector) ?? null,

  // root 안 선택자 일치 요소 전부를 감싸는 영역 (표의 한 열, 여러 칸 묶음 등)
  all: (selector, root) => () =>
    unionRect([...(resolveRoot(root)?.querySelectorAll(selector) ?? [])]),

  // 글자로 버튼 찾기 (Modal 하단 버튼처럼 ref를 넘길 수 없는 버튼)
  button: (text, root) => () => findButton(text, root),

  // ref 요소가 들어있는 Modal 틀 — root 인자로 넘기는 용도: button('확인', tourTarget.modalOf(ref))
  modalOf: ref => () => modalWrapOf(resolveRoot(ref)),

  // ref 요소가 들어있는 Modal 안에서 선택자로 찾기
  inModal: (ref, selector) => () => modalWrapOf(resolveRoot(ref))?.querySelector(selector) ?? null,

  // 여러 대상을 한 번에 강조 (target 함수·ref·요소 섞어서 가능)
  union:
    (...targets) =>
    () =>
      unionRect(targets.map(resolveTarget)),

  // 앞에서부터 처음 찾아지는 대상 (없으면 다음 후보로 대체)
  first:
    (...targets) =>
    () =>
      targets.map(resolveTarget).find(Boolean) ?? null,

  // GoJS 등 캔버스 안 요소 → 화면 좌표 영역 (getPart: diagram => go.Part | null)
  diagramPart: (getDiagram, getPart) => () => {
    const diagram = getDiagram?.();
    const part = diagram && getPart?.(diagram);
    const div = diagram?.div;
    if (!part || !div) return null;
    const b = part.actualBounds;
    const p1 = diagram.transformDocToView(b.position);
    const p2 = diagram.transformDocToView(b.position.copy().offset(b.width, b.height));
    const box = div.getBoundingClientRect();
    return { top: box.top + p1.y, left: box.left + p1.x, width: p2.x - p1.x, height: p2.y - p1.y };
  },
};

export default tourTarget;
