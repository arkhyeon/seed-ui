export const isDisplaySubMenuDepth = subMenu => {
  return subMenu.some(item => item.display !== false);
};

export const canShowMenu = menuItem => {
  if (menuItem.display === false) {
    return false;
  }

  if (menuItem.subMenu && menuItem.subMenu.length > 0) {
    return menuItem.subMenu.some(child => canShowMenu(child));
  }

  return !!menuItem.menuRole;
};

export const getAccessibleLink = currentMenu => {
  if (!currentMenu?.subMenu || currentMenu?.subMenu.length === 0) {
    return currentMenu.link;
  }

  const accessibleChild = currentMenu.subMenu.find(canShowMenu);

  if (!accessibleChild) {
    return currentMenu.link;
  }

  return getAccessibleLink(accessibleChild);
};