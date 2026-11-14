// seed-ui 겹침 순서(z-index) 층 정리
//
//   화면 내용(그리드 사이드바 500, 라벨 선택 998 등)  ~ 1100
//   PAGE_FLOATING  화면에서 연 떠있는 요소(선택 목록·달력·팝오버)   1500
//   HEADER         상단 메뉴(펼침 메뉴 포함)                         2000
//   MODAL          모달·확대 보기 등 화면 전체 덮개                   9999
//                  모달 안에서 연 떠있는 요소 → 모달 + 1              10000
//   알림·확인창 99998~99999, GuideTour 100000
//
// 떠있는 요소는 body로 포털되어 원래 위치의 층 정보를 잃으므로,
// 열릴 때 트리거(입력칸)가 속한 가장 높은 층을 찾아 그 바로 위에 띄운다.
//   - 화면에서 열면 PAGE_FLOATING → 상단 메뉴(HEADER)보다 아래라 메뉴 펼침을 가리지 않음
//   - 모달(9999) 안에서 열면 10000 → 모달 위로 뜸
export const Z_LAYER = {
  PAGE_FLOATING: 1500,
  HEADER: 2000,
  MODAL: 9999,
};

// 트리거 조상 중 z-index가 지정된(positioned) 요소의 최댓값 + 1, 최소 PAGE_FLOATING
export function getFloatingZIndex(reference) {
  let max = 0;
  let el = reference instanceof Element ? reference : null;
  while (el && el !== document.body) {
    const style = window.getComputedStyle(el);
    if (style.position !== 'static' && style.zIndex !== 'auto') {
      const z = parseInt(style.zIndex, 10);
      if (!Number.isNaN(z) && z > max) max = z;
    }
    el = el.parentElement;
  }
  return Math.max(Z_LAYER.PAGE_FLOATING, max + 1);
}
