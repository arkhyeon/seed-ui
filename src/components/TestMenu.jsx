import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import _ from 'lodash';
import { DepthList1 } from '../assets/DepthMenuList';

function TestMenu({ currentSideMenu, depth = 0 }) {
  const [displayChildren, setDisplayChildren] = useState({});

  return (
    <ASideMenuWrap>
      {currentSideMenu.map((sm) => {
        console.log(sm.link);
        return (
          <ASideMenuList key={sm.link} depth={depth}>
            {sm.subMenu ? (
              <NavLink
                to={sm.link}
                onClick={(e) => {
                  e.preventDefault();
                  setDisplayChildren({
                    ...displayChildren,
                    [sm.link]: !displayChildren[sm.link],
                  });
                }}
              >
                {depth === 0 && sm.icon} {sm.title} {displayChildren[sm.link] ? '-' : '+'}
              </NavLink>
            ) : (
              <NavLink to={'hi'}>
                {depth === 0 && sm.icon} {sm.title} {sm.link}
              </NavLink>
            )}
            {displayChildren[sm.link] && sm.subMenu && (
              <TestMenu currentSideMenu={sm.subMenu} depth={depth + 1} />
            )}
          </ASideMenuList>
        );
      })}
    </ASideMenuWrap>
  );
}

const ASideMenuWrap = styled.ul``;

const ASideMenuList = styled.li`
  text-indent: ${(props) => `${props.depth * 15}px`};

  & svg {
    position: absolute;
    left: 10px;
  }

  & > a {
    display: flex;
  }
`;

export default TestMenu;
