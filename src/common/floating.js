// 떠있는 요소(포털된 팝오버·드롭다운·달력 등)를 표시하는 공통 속성.
// body로 포털되면 바깥클릭 핸들러가 DOM상 "바깥"으로 오인해 닫아버린다(특히 중첩:
// 달력 안의 연/월 드롭다운). 떠있는 요소에 이 속성을 달고, 바깥클릭 때
// clickedInsideFloating 으로 걸러 유지한다.
export const FLOATING_ATTR = 'data-seed-floating';

// styled/JSX에 `{...FLOATING_PROP}` 로 펼쳐 붙인다.
export const FLOATING_PROP = { [FLOATING_ATTR]: '' };

// 클릭 대상이 어떤 떠있는 요소(포털 포함) 안이면 true → 바깥클릭으로 안 닫음.
export function clickedInsideFloating(target) {
  return !!(target && target.closest && target.closest(`[${FLOATING_ATTR}]`));
}
