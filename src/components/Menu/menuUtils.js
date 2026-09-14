/**
 * 메뉴 접근/노출 판정의 단일 소스.
 *
 * 세 가지 축을 서로 다른 함수로 분리한다(의도적으로 다르다):
 *  - canShowMenu   : 헤더/사이드 "메뉴에 노출"할지        → display:false면 숨김
 *  - canBeLinkedTo : "이동(링크) 대상"이 될 수 있는지      → display 무관(숨김 페이지도 이동 타깃 가능)
 *  - canRouteTo    : "라우트를 생성"할지(RouteGenerator)  → display 무관, menuRole undefined는 허용
 *
 * role 값: 'y' = 전체 접근(관리자), 'n' = menuRole 기반 제한.
 * (사용자별 필터는 상위 앱에서 선수행되고, 여기서는 최종 노출/게이팅만 담당)
 */

// 역할 기반 접근권만 판정한다(display 무관).
const hasAccess = (menuItem, role) => {
  if (menuItem.isPublic) return true;
  if (role === 'y') return true;
  return !!(menuItem.menuRole && menuItem.menuRole > 0);
};

export const isDisplaySubMenuDepth = subMenu => {
  return subMenu.some(item => item.display !== false);
};

// (1) 메뉴 노출 여부: display:false면 숨김. 접근권이 있거나, 보이는 하위가 하나라도 있으면 노출.
export const canShowMenu = (menuItem, role) => {
  if (menuItem.display === false) {
    return false;
  }

  if (hasAccess(menuItem, role)) {
    return true;
  }

  return (menuItem.subMenu ?? []).some(child => canShowMenu(child, role));
};

// (2) 이동(링크) 대상 가능 여부: 하위가 있으면 접근 가능한 하위가 있는지, 리프면 자신의 접근권.
export const canBeLinkedTo = (menuItem, role) => {
  if (menuItem.subMenu && menuItem.subMenu.length > 0) {
    return menuItem.subMenu.some(child => canBeLinkedTo(child, role));
  }
  return hasAccess(menuItem, role);
};

// (3) 부모 클릭 시 실제로 접근 가능한 첫 리프의 link를 찾아 반환.
export const getAccessibleLink = (currentMenu, role) => {
  if (!currentMenu?.subMenu || currentMenu?.subMenu.length === 0) {
    return currentMenu.link;
  }

  const accessibleChild = currentMenu.subMenu.find(menuItem => canBeLinkedTo(menuItem, role));

  if (!accessibleChild) {
    return currentMenu.link;
  }

  return getAccessibleLink(accessibleChild, role);
};

// (4) 라우트 생성 대상 여부: 노출과 달리 display를 보지 않고, menuRole 미지정은 허용한다
//     (component만 있는 부모 컨테이너 라우트를 보존하기 위함).
export const canRouteTo = (menuItem, role) => {
  if (role !== 'n') return true;
  if (menuItem.isPublic) return true;
  return menuItem.menuRole === undefined || menuItem.menuRole > 0;
};
