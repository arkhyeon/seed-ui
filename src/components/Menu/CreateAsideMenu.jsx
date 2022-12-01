import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/all';
import { isDisplaySubMenuDepth } from './CreateMenu';

function CreateAsideMenu({ currentSideMenu, depth = 0 }) {
  const [displayChildren, setDisplayChildren] = useState({});
  const { pathname } = useLocation();
  useEffect(() => {
    collapseSubMenu();
  }, [pathname]);

  const collapseSubMenu = () => {
    const activeSubMenu = document.querySelectorAll('a.active[activeclassname="sideSelectMenu"]');
    for (let i = 0; i < activeSubMenu.length; i++) {
      setDisplayChildren({
        ...displayChildren,
        [activeSubMenu[i].pathname]: !displayChildren[activeSubMenu[i].pathname],
      });
    }
  };

  return (
    <ASideMenuWrap>
      {currentSideMenu.map(sm => {
        if (sm.display === false) {
          return '';
        }
        return (
          <ASideMenuList key={sm.link} depth={depth}>
            {sm.subMenu && isDisplaySubMenuDepth(sm.subMenu) ? (
              <NavLink
                activeclassname="sideSelectMenu"
                to={sm.link}
                onClick={e => {
                  e.preventDefault();
                  setDisplayChildren({
                    ...displayChildren,
                    [sm.link]: !displayChildren[sm.link],
                  });
                }}
              >
                {depth === 0 && sm.icon}
                <p>
                  {sm.title}{' '}
                  {displayChildren[sm.link] ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                </p>
              </NavLink>
            ) : (
              <NavLink to={sm.link} activeclassname="sideSelectMenu">
                {depth === 0 && sm.icon}
                <p>{sm.title}</p>
              </NavLink>
            )}
            {displayChildren[sm.link] && sm.subMenu && (
              <CreateAsideMenu currentSideMenu={sm.subMenu} depth={depth + 1} />
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

  &:before {
    background: #e8eefb;
    bottom: auto;
    content: '';
    height: 8px;
    left: ${props => `${props.depth * 23 + 19.5}px`};
    margin-top: 15px;
    position: absolute;
    right: auto;
    width: 8px;
    z-index: 1;
    border-radius: 50%;
  }

  &:after {
    border-left: 1px solid #e8eefb;
    bottom: 0;
    content: '';
    left: ${props => `${props.depth * 23 + 23}px`};
    position: absolute;
    top: 0;
    margin-top: -5px;
  }

  &:last-of-type:after {
    height: 20px;
  }

  & p {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
`;

export default CreateAsideMenu;
