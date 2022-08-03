import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/all';

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
    <ul>
      {currentSideMenu.map(sm => {
        return (
          <ASideMenuList key={sm.link} depth={depth}>
            {sm.subMenu ? (
              <NavLink
                activeclassname="sideSelectMenu"
                to={sm.link}
                onClick={e => {
                  if (window.sessionStorage.getItem('AsideWidth') > 83) {
                    e.preventDefault();
                    setDisplayChildren({
                      ...displayChildren,
                      [sm.link]: !displayChildren[sm.link],
                    });
                  }
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
    </ul>
  );
}

const ASideMenuList = styled.li`
  & li {
    text-indent: ${props => `${props.depth * 15 + 25}px`};
  }

  & p {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
`;

export default CreateAsideMenu;
