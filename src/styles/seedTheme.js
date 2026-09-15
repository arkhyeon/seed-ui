/**
 * seed-ui 다크모드 테마 변수.
 *
 * 컴포넌트는 색을 하드코딩하지 않고 아래 CSS 변수(var(--seed-*))를 참조한다.
 * 라이트 = :root 기본값, 다크 = :root[data-theme='dark'] 오버라이드.
 * 소비 앱(예: CLM30)이 <html data-theme="dark">를 토글하면 seed-ui 전체가 다크로 전환된다.
 *
 * 이 모듈을 import 하면(엔트리 index.js) <style id="seed-theme-vars">를 head 에 1회 주입한다.
 * 별도 CSS 파일 import/설정이 필요 없다.
 */

export const SEED_THEME_CSS = `
:root {
  /* 표면 */
  --seed-surface: #ffffff;        /* 카드/입력/모달/기본 버튼 */
  --seed-surface-alt: #f7f7f7;    /* 옅은 보조 표면/스트라이프 */
  --seed-surface-header: #eceff1; /* 헤더/툴패널/모달 헤더 */
  --seed-hover: #e8eefb;          /* 호버 배경 */
  --seed-hover-strong: #455a64;   /* 강조 호버(짙은 청회색) */

  /* 텍스트 */
  --seed-text: #212529;
  --seed-text-secondary: #545454;
  --seed-text-muted: #9e9e9e;

  /* 선 */
  --seed-border: #d2d2d2;
  --seed-border-strong: #9e9e9e;

  /* 브랜드/상태 */
  --seed-primary: #fb5b5b;
  --seed-danger: #e53935;

  /* 라벨 칩(CountList/LabelList 기본 칩 색; 컴포넌트 color prop 으로 개별 override 가능) */
  --seed-chip-bg: #78909c;
  --seed-chip-text: #ffffff;

  /* 헤더 바 배경 (라이트/다크 모두 어두운 바; 다크에선 더 어둡게) */
  --seed-header-bg: #3e3e3e;

  /* 반전(짙은 배지/오버레이 텍스트 등) */
  --seed-invert-bg: #3e3e3e;
  --seed-invert-text: #ffffff;

  /* 강조(선택/활성 상태) — 라이트=어두운 채움, 다크=밝은 채움 */
  --seed-emphasis-bg: #3e3e3e;
  --seed-emphasis-text: #ffffff;

  /* 주 버튼(BlackButton) — 선택상태와 달리 새하양이 아닌 차분한 채움 + 명확한 hover */
  --seed-btn-primary-bg: #3e3e3e;
  --seed-btn-primary-text: #ffffff;
  --seed-btn-primary-hover: #455a64;

  /* 스크롤바/그림자/오버레이 */
  --seed-subject-bg: transparent; /* InputGrid Title: 라이트=투명(원본), 다크만 배경 */
  --seed-scrollbar-track: #eeeeee;
  --seed-scrollbar-thumb: #d3d3d3;
  --seed-shadow: rgba(0, 0, 0, 0.15);
  --seed-overlay: rgba(0, 0, 0, 0.3);

  /* HelpIcon(?): 라이트=원본 반투명 회색/짙은 팝업, 다크만 보이게 */
  --seed-help-border: rgba(108, 117, 125, 0.5);
  --seed-help-popup: rgba(33, 37, 41, 0.9);

  /* 원본보존 변수: 라이트=원래 색 그대로, 다크만 변경 */
  --x-e0e0e0: #e0e0e0; --x-ebebeb: #ebebeb; --x-ced4da: #ced4da; --x-d1d1d1: #d1d1d1;
  --x-d0d0d0: #d0d0d0; --x-bdbdbd: #bdbdbd; --x-e9e9e9: #e9e9e9; --x-e2e2e2: #e2e2e2; --x-ddd: #dddddd;
  --x-c3c3c3: #c3c3c3; --x-a9a9a9: #a9a9a9;
  --x-eee: #eeeeee; --x-f1f3f5: #f1f3f5; --x-f9f9f9: #f9f9f9; --x-f8f9fa: #f8f9fa; --x-f5f5f5: #f5f5f5;
  --x-efefef: #efefef; --x-f0f0f0: #f0f0f0; --x-f7f7f7: #f7f7f7;
  --x-888: #888888; --x-999: #999999; --x-bbb: #bbbbbb; --x-adb5bd: #adb5bd; --x-aaa: #aaaaaa; --x-ccc: #cccccc;
  --x-666: #666666; --x-495057: #495057; --x-6c757d: #6c757d; --x-555: #555555; --x-444: #444444;
  --x-333: #333333; --x-black: #000000; --x-000: #000000;
  --x-3e3e3e: #3e3e3e; --x-545454: #545454; --x-b0bec5: #b0bec5; --x-e91e63: #e91e63; --x-eceff1: #eceff1;
  --x-fde8e8: #fde8e8; --x-f0b0b0: #f0b0b0;
}

[data-theme='dark'] {
  --seed-surface: #262626;
  --seed-surface-alt: #2b2b2b;
  --seed-surface-header: #2b2b2b;
  --seed-hover: #333333;
  --seed-hover-strong: #455a64;

  --seed-text: #e0e0e0;
  --seed-text-secondary: #bcbcbc;
  --seed-text-muted: #8a8a8a;

  --seed-border: #424242;
  --seed-border-strong: #565656;

  --seed-primary: #fb5b5b;
  --seed-danger: #ff6b6b;

  --seed-chip-bg: #37474f;
  --seed-chip-text: #e0e0e0;

  --seed-header-bg: #1c1c1c;

  --seed-invert-bg: #3e3e3e;
  --seed-invert-text: #ffffff;

  --seed-emphasis-bg: #e6e6e6;
  --seed-emphasis-text: #1a1a1a;

  /* 주 버튼: 새하양 대신 표면보다 밝은 중간 회색 → 튀지 않게, hover 시 더 밝게 */
  --seed-btn-primary-bg: #6d6d6d;
  --seed-btn-primary-text: #ffffff;
  --seed-btn-primary-hover: #828282;

  --seed-subject-bg: #2b2b2b;
  --seed-scrollbar-track: #2b2b2b;
  --seed-scrollbar-thumb: #565656;
  --seed-shadow: rgba(0, 0, 0, 0.5);
  --seed-overlay: rgba(0, 0, 0, 0.55);

  --seed-help-border: #8a8a8a;
  --seed-help-popup: #3e3e3e;

  /* 원본보존 변수 다크값 */
  --x-e0e0e0: #424242; --x-ebebeb: #3d3d3d; --x-ced4da: #4a4a4a; --x-d1d1d1: #4a4a4a;
  --x-d0d0d0: #424242; --x-bdbdbd: #4a4a4a; --x-e9e9e9: #3d3d3d; --x-e2e2e2: #424242; --x-ddd: #424242;
  --x-c3c3c3: #565656; --x-a9a9a9: #565656;
  --x-eee: #2b2b2b; --x-f1f3f5: #2b2b2b; --x-f9f9f9: #2b2b2b; --x-f8f9fa: #2b2b2b; --x-f5f5f5: #2b2b2b;
  --x-efefef: #303030; --x-f0f0f0: #2b2b2b; --x-f7f7f7: #2b2b2b;
  --x-888: #9a9a9a; --x-999: #9a9a9a; --x-bbb: #9a9a9a; --x-adb5bd: #9a9a9a; --x-aaa: #9a9a9a; --x-ccc: #9a9a9a;
  --x-666: #b0b0b0; --x-495057: #b0b0b0; --x-6c757d: #b0b0b0; --x-555: #b0b0b0; --x-444: #b0b0b0;
  --x-333: #cbcbcb; --x-black: #cbcbcb; --x-000: #cbcbcb;
  --x-3e3e3e: #cbcbcb; --x-545454: #8a8a8a; --x-b0bec5: #565656; --x-e91e63: #f06292; --x-eceff1: #2b2b2b;
  --x-fde8e8: #3a2626; --x-f0b0b0: #6e4545;
}

/* CodeMirror(sql 에디터): 배경을 입력창(surface)과 동일하게, 보더는 TextInput 과 동일하게 */
[data-theme='dark'] .cm-editor {
  background: var(--seed-surface) !important;
  border-color: var(--seed-border) !important;
}
[data-theme='dark'] .cm-editor .cm-gutters {
  background: var(--seed-surface) !important;
  border-color: var(--seed-border) !important;
}

/* DataList(셀렉트) 우측 화살표: 다크에서 밝은 화살표로 교체 */
[data-theme='dark'] .seed-select-arrow {
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='%23c8c8c8' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3E%3C/svg%3E") !important;
}
`;

if (typeof document !== 'undefined' && !document.getElementById('seed-theme-vars')) {
  const style = document.createElement('style');
  style.id = 'seed-theme-vars';
  style.textContent = SEED_THEME_CSS;
  document.head.appendChild(style);
}
