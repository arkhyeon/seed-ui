import { useFloating, offset, flip, shift, size, hide, autoUpdate } from '@floating-ui/react-dom';

// 트리거가 다른 요소(고정 푸터·그리드 하단 영역 등)에 '덮여' 안 보이는지 검사.
// hide()는 조상 overflow로 잘린 경우만 잡으므로, 트리거 중앙 지점의 최상단 요소로 가림 여부를 본다.
// 결과: middlewareData.occlusion.occluded
const occlusion = () => ({
  name: 'occlusion',
  fn({ elements }) {
    const ref = elements.reference;
    if (!(ref instanceof Element)) return {};
    const r = ref.getBoundingClientRect();
    const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    const visible = !!hit && (ref.contains(hit) || elements.floating.contains(hit));
    return { data: { occluded: !visible } };
  },
});

/**
 * seed-ui 공통 떠있는 요소(팝오버·툴팁·드롭다운) 위치 계산 훅.
 *
 * Floating UI 기반 — 조상 overflow에 안 잘리고(포털은 호출부에서), 화면 밖이면
 * flip(반대 방향)·shift(안으로 밀기)·size(최대높이 제한)로 자동 보정하며,
 * 스크롤/리사이즈 시 autoUpdate로 위치를 다시 계산한다.
 *
 * @param {boolean} open        열림 여부(열렸을 때만 위치 추적)
 * @param {Object}  opts
 * @param {string}  opts.placement  'bottom-start' 등 (기본 'bottom-start')
 * @param {number}  opts.gap        트리거와의 간격 px (기본 6)
 * @param {number}  opts.padding    뷰포트 가장자리 여백 px (기본 8)
 * @param {boolean} opts.matchWidth 트리거 너비에 맞출지 (드롭다운용, 기본 false)
 * @param {boolean} opts.clampHeight 공간에 맞춰 maxHeight 제한할지 (기본 true)
 * @param {boolean} opts.hideWhenDetached 트리거가 스크롤 컨테이너 밖으로 가려지면
 *          middlewareData.hide.referenceHidden=true → 호출부에서 숨김 (ag-grid 셀 등)
 *          다른 요소에 덮여 가려져도 middlewareData.occlusion.occluded=true
 * @returns useFloating 반환값 { refs, floatingStyles, middlewareData, ... }
 *          refs.setReference(트리거), refs.setFloating(떠있는 요소)에 연결하고
 *          floatingStyles를 요소 style로 쓴다.
 */
export default function useSeedFloating(
  open,
  {
    placement = 'bottom-start',
    gap = 6,
    padding = 8,
    matchWidth = false,
    clampHeight = true,
    hideWhenDetached = false,
  } = {},
) {
  return useFloating({
    open,
    placement,
    strategy: 'fixed', // body로 포털 + fixed → 조상 transform/overflow 무시, 스크롤에 안 밀림
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(gap),
      flip({ padding }),
      shift({ padding }),
      size({
        padding,
        apply({ availableHeight, rects, elements }) {
          const s = elements.floating.style;
          if (clampHeight) s.maxHeight = `${Math.max(120, availableHeight)}px`;
          if (matchWidth) s.width = `${rects.reference.width}px`;
        },
      }),
      ...(hideWhenDetached ? [hide(), occlusion()] : []),
    ],
  });
}
