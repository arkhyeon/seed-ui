import React, { useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { IoIosArrowForward } from 'react-icons/io';
import MenuContext from './MenuContext';
import { canShowMenu, getAccessibleLink } from './menuUtils';

function SubMenuItem({ menu, depth = 0 }) {
  const { handleMenuSelection, selectedMenus, useDepth, navigate } = useContext(MenuContext);

  const { title, link = '', subMenu = [] } = menu;
  const location = useLocation();

  if (!canShowMenu(menu)) {
    return null;
  }

  const isActive = subMenu.some(s => location.pathname.includes(s.link));

  const hasVisibleSubMenu = subMenu.length > 0 && useDepth;

  if (hasVisibleSubMenu) {
    return (
      <Item>
        <NavLink
          to={getAccessibleLink(menu)}
          onMouseEnter={() => handleMenuSelection(title, depth)}
          className={isActive ? 'active' : ''}
        >
          {title}
          {depth > 0 && <IoIosArrowForward />}
        </NavLink>
        {selectedMenus[depth] === title && (
          <List depth={depth} className="subMenuItem">
            {subMenu.map((child, i) => (
              <SubMenuItem menu={child} key={`sub-${title}${i + 1}`} depth={depth + 1} />
            ))}
          </List>
        )}
      </Item>
    );
  }

  return (
    <Item
      onMouseEnter={() => handleMenuSelection('', depth)}
      onClick={() => {
        handleMenuSelection('', 0);
        if (link) {
          navigate(link);
        }
      }}
      className="mainActive"
    >
      <NavLink
        to={link}
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
  opacity: 0.95;
  transition: 0.5s;
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
