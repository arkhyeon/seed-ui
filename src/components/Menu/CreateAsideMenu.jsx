import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import { canShowMenu, isDisplaySubMenuDepth } from './menuUtils';

// 현재 경로가 이 메뉴(또는 하위)에 속하는지 판정 → 활성 그룹 자동 펼침에 사용.
const isActivePath = (menuItem, pathname) =>
  (!!menuItem.link && pathname.includes(menuItem.link)) ||
  (menuItem.subMenu ?? []).some(child => isActivePath(child, pathname));

function CreateAsideMenu({ currentSideMenu, depth = 0, role }) {
  const [openMap, setOpenMap] = useState({});
  const { pathname } = useLocation();

  // DOM을 뒤지지 않고 현재 경로에서 열림 상태를 파생한다.
  // 활성 경로에 걸린 그룹은 펼치고, 사용자가 수동 토글한 상태는 유지(additive).
  useEffect(() => {
    setOpenMap(prev => {
      const next = { ...prev };
      (currentSideMenu ?? []).forEach(sm => {
        if (isActivePath(sm, pathname)) {
          next[sm.link] = true;
        }
      });
      return next;
    });
  }, [pathname, currentSideMenu]);

  const toggle = link => setOpenMap(prev => ({ ...prev, [link]: !prev[link] }));

  return (
    <ASideMenuWrap>
      {currentSideMenu?.map(sm => {
        if (!canShowMenu(sm, role)) {
          return null;
        }
        const hasChildren = sm.subMenu && isDisplaySubMenuDepth(sm.subMenu);
        return (
          <ASideMenuList key={sm.link} depth={depth}>
            {hasChildren ? (
              <NavLink
                to={sm.link}
                onClick={e => {
                  e.preventDefault();
                  toggle(sm.link);
                }}
              >
                {depth === 0 && sm.icon}
                <p>
                  {sm.title} {openMap[sm.link] ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                </p>
              </NavLink>
            ) : (
              <NavLink to={sm.link}>
                {depth === 0 && sm.icon}
                <p>{sm.title}</p>
              </NavLink>
            )}
            {openMap[sm.link] && sm.subMenu && (
              <CreateAsideMenu currentSideMenu={sm.subMenu} depth={depth + 1} role={role} />
            )}
          </ASideMenuList>
        );
      })}
    </ASideMenuWrap>
  );
}

const ASideMenuWrap = styled.ul`
  position: relative;
`;

const ASideMenuList = styled.li`
  position: relative;
  text-indent: ${props => `${props.depth * 23 + 23}px`};

  // &:before {
  //   background: #e8eefb;
  //   bottom: auto;
  //   content: '';
  //   height: 8px;
  //   left: ${props => `${props.depth * 23 + 19.5}px`};
  //   margin-top: 15px;
  //   position: absolute;
  //   right: auto;
  //   width: 8px;
  //   z-index: 1;
  //   border-radius: 50%;
  // }
  //
  // &:after {
  //   border-left: 1px solid #e8eefb;
  //   bottom: 0;
  //   content: '';
  //   left: ${props => `${props.depth * 23 + 23}px`};
  //   position: absolute;
  //   top: 0;
  //   margin-top: -5px;
  // }
  //
  // &:last-of-type:after {
  //   height: 20px;
  // }

  & p {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
`;

export default CreateAsideMenu;
