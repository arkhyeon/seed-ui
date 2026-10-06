/**
 * seed-ui 다크모드 테마 변수 주입기.
 *
 * 토큰 정의는 seedTheme.css(단일 소스)에 있다. 이 모듈은 그 CSS 를 ?raw 로 읽어
 * <style id="seed-theme-vars">로 head 에 1회 주입한다(별도 CSS import 불필요).
 * 빌드 시 seedTheme.css 는 dist 로도 복사돼 소비 앱 IDE 가 var(--seed-*) 를 해석한다.
 */

import seedThemeCss from './seedTheme.css?raw';

// 하위호환: 기존에 SEED_THEME_CSS 를 import 하던 코드 대비 (이제 CSS 파일이 원본)
export const SEED_THEME_CSS = seedThemeCss;

if (typeof document !== 'undefined' && !document.getElementById('seed-theme-vars')) {
  const style = document.createElement('style');
  style.id = 'seed-theme-vars';
  style.textContent = seedThemeCss;
  document.head.appendChild(style);
}
