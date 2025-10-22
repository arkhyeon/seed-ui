export const isDisplaySubMenuDepth = subMenu => {
  return subMenu.some(item => item.display !== false);
};

export const canShowMenu = menuItem => {
  if (menuItem.display === false) {
    return false;
  }

  const hasVisibleDescendant =
    menuItem.subMenu && menuItem.subMenu.length > 0
      ? menuItem.subMenu.some(child => canShowMenu(child))
      : false;

  const hasOwnRole = menuItem.menuRole && menuItem.menuRole > 0;

  return hasOwnRole || hasVisibleDescendant;
};

export const canBeLinkedTo = menuItem => {
  if (menuItem.subMenu && menuItem.subMenu.length > 0) {
    return menuItem.subMenu.some(child => canBeLinkedTo(child));
  }
  return menuItem.menuRole && menuItem.menuRole > 0;
};

export const getAccessibleLink = currentMenu => {
  if (!currentMenu?.subMenu || currentMenu?.subMenu.length === 0) {
    return currentMenu.link;
  }

  const accessibleChild = currentMenu.subMenu.find(canBeLinkedTo);

  if (!accessibleChild) {
    return currentMenu.link;
  }

  return getAccessibleLink(accessibleChild);
};
