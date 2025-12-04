export const isDisplaySubMenuDepth = subMenu => {
  return subMenu.some(item => item.display !== false);
};

export const canShowMenu = (menuItem, role) => {
  if (menuItem.display === false) {
    return false;
  }

  // isPublic 플래그가 있으면 항상 메뉴 표시
  if (menuItem.isPublic) {
    return true;
  }

  const hasVisibleDescendant =
    menuItem.subMenu && menuItem.subMenu.length > 0
      ? menuItem.subMenu.some(child => canShowMenu(child, role))
      : false;

  const hasOwnRole = role === 'y' || (menuItem.menuRole && menuItem.menuRole > 0);

  return hasOwnRole || hasVisibleDescendant;
};

export const canBeLinkedTo = (menuItem, role) => {
  if (menuItem.subMenu && menuItem.subMenu.length > 0) {
    return menuItem.subMenu.some(child => canBeLinkedTo(child, role));
  }
  return menuItem.isPublic || (menuItem.menuRole && menuItem.menuRole > 0) || role === 'y';
};

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
