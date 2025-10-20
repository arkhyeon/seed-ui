export const isDisplaySubMenuDepth = subMenu => {
  return subMenu.some(item => item.display !== false);
};
