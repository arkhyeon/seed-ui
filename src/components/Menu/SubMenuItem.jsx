import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { IoIosArrowForward } from 'react-icons/io';
import MenuContext from './MenuContext';
import { canShowMenu, getAccessibleLink, isDisplaySubMenuDepth } from './menuUtils';

// 마운트/언마운트에 fade transition을 붙이기 위한 훅.
// isOpen이 false가 되면 duration 후에 실제 unmount → fade-out을 재생하면서도
// 닫힌 서브메뉴는 DOM에서 제거되어 overflow(유령 스크롤바)/상시 렌더 부작용이 없다.
const useMountTransition = (isOpen, duration = 200) => {
  const [mounted, setMounted] = useState(isOpen);
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    let raf;
    let timer;
    if (isOpen) {
      setMounted(true);
      // 마운트 직후 한 프레임 뒤 visible=true → opacity 0→0.95 transition(fade-in)
      raf = requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      timer = setTimeout(() => setMounted(false), duration);
    }
    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (timer) clearTimeout(timer);
    };
  }, [isOpen, duration]);

  return { mounted, visible };
};

function SubMenuItem({ menu, depth = 0, role }) {
  const { handleMenuSelection, selectedMenus, useDepth } = useContext(MenuContext);

  const { title, link = '', subMenu = [] } = menu;
  const location = useLocation();
  const isSubMenuOpen = selectedMenus[depth] === title;
  const { mounted, visible } = useMountTransition(isSubMenuOpen, 200);

  if (!canShowMenu(menu, role)) {
    return null;
  }

  const isActive = subMenu.some(s => location.pathname.includes(s.link));

  const hasVisibleSubMenu = subMenu.length > 0 && useDepth && isDisplaySubMenuDepth(subMenu);

  if (hasVisibleSubMenu) {
    return (
      <Item>
        <NavLink
          to={getAccessibleLink(menu, role)}
          onMouseEnter={() => handleMenuSelection(title, depth)}
          className={isActive ? 'active' : ''}
          state={menu.state}
        >
          {title}
          {depth > 0 && <IoIosArrowForward />}
        </NavLink>
        {mounted && (
          <List depth={depth} className="subMenuItem" isOpen={visible}>
            {subMenu.map((child, i) => (
              <SubMenuItem
                menu={child}
                key={`sub-${title}${i + 1}`}
                depth={depth + 1}
                role={role}
              />
            ))}
          </List>
        )}
      </Item>
    );
  }

  const navLink = subMenu.length > 0 ? getAccessibleLink(menu, role) : link;

  return (
    <Item
      onMouseEnter={() => handleMenuSelection('', depth)}
      onClick={() => {
        handleMenuSelection('', 0);
      }}
      className="mainActive"
    >
      <NavLink
        to={navLink}
        state={menu.state}
        onMouseEnter={() => handleMenuSelection(title, depth)}
        className={isActive ? 'active' : ''}
      >
        {title}
      </NavLink>
    </Item>
  );
}

const List = styled.ul`
  & > li > a {
    float: left;
  }
  position: absolute;
  /* isOpen(=visible)에 따라 opacity/transform으로 fade in/out.
     닫히면 상위(useMountTransition)에서 transition 시간만큼 지연 후 unmount하므로
     fade-out이 정상 재생되고, 닫힌 뒤에는 DOM에서 제거된다. */
  opacity: ${({ isOpen }) => (isOpen ? 0.95 : 0)};
  pointer-events: ${({ isOpen }) => (isOpen ? 'auto' : 'none')};
  transform: translateY(${({ isOpen }) => (isOpen ? '0' : '-6px')});
  transition: opacity 0.2s ease, transform 0.2s ease;
  flex-direction: column;
  display: flex;
  padding: 10px 0;
  border: 1px solid #d2d2d2;
  border-radius: 5px;
  background-color: white;
  box-shadow: 1px 1px 3px 0px #d2d2d2;

  .subMenuItem {
    width: 100%;
    left: 100%;
    float: left;
    margin-top: -11px;
  }
`;

const Item = styled.li`
  & ul li:hover > a {
    font-weight: bold;
    background-color: #e8eefb;
  }

  & ul li .active,
  & ul li.mainActive:active > a {
    color: #ffffff;
    font-weight: bold;
    background-color: #3e3e3e !important;
  }

  & a {
    display: block;
  }

  & ul li a {
    width: 190px;
    height: 38px;
    font-size: 14px;
    color: #212529;
    display: flex;
    align-items: center;
    padding: 0 15px;
    justify-content: space-between;
  }
`;

export default SubMenuItem;
