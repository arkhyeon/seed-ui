import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import SubMenuItem from './SubMenuItem';
import MenuContext from './MenuContext';

/**
 * @param {Array} menus
 * EX) Auth : {userLevel === "1" ? [AdminArray] : [UserArray]}
 *      OR
 *     Common : {[Array]}
 * @param {Boolean} useDepth
 * 사이드 메뉴 사용할 때 Depth를 사용할 것인지 아닌지
 * true : Depth 이용 메뉴
 * false : Depth 없이 메뉴
 * @param {Boolean} display
 * subMenu에서 Route로만 사용할 메뉴에 대해서 분기 처리
 * default : true, false 설정 시 메뉴에 보이지 않음.

 * @returns {JSX.Element} Menu Component
 */

function CreateMenu({ menus, useDepth }) {
  const [selectedMenus, setSelectedMenus] = useState([]);
  const navigate = useNavigate();

  const handleMenuSelection = useCallback((label, depth) => {
    setSelectedMenus(selectedMenusProp => {
      const newSelectedMenus = [...selectedMenusProp];
      newSelectedMenus.length = depth;
      if (label !== '') {
        newSelectedMenus[depth] = label;
      }
      return newSelectedMenus;
    });
  }, []);

  const contextValue = useMemo(
    () => ({ handleMenuSelection, selectedMenus, useDepth, navigate }),
    [handleMenuSelection, selectedMenus, useDepth, navigate],
  );

  return (
    <CreateMenuList onMouseLeave={() => setSelectedMenus([])}>
      <MenuContext.Provider value={contextValue}>
        {menus.map(menu => {
          return <SubMenuItem menu={menu} key={menu.title} />;
        })}
      </MenuContext.Provider>
    </CreateMenuList>
  );
}

const CreateMenuList = styled.ul`
  display: flex;
  justify-content: center;
  gap: 0;
  position: relative;
  z-index: 10;

  & > li {
    & > a {
      width: fit-content;
      height: 55px;
      padding: 0 40px;
      line-height: 55px;
      color: #e0e0e0;
      font-size: 15px;
    }
  }
  & > li:hover > a {
    color: white;
    font-weight: bold;
    background-color: #fb5b5b;
    border-radius: 10px 10px 0 0;
  }
`;

export default CreateMenu;
