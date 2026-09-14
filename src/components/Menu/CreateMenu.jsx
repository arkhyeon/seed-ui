import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
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

 * @returns {JSX.Element} Menu Component
 */

// 메뉴에서 마우스가 벗어난 뒤 실제로 닫히기까지의 유예 시간(ms).
// 대각선 이동이나 서브메뉴 flyout 이동 중 커서가 잠깐 영역 밖으로 삐끗해도
// 메뉴가 즉시 닫히지 않도록 완충 역할을 한다.
const MENU_CLOSE_DELAY = 300;

function CreateMenu({ menus, useDepth, role }) {
  const [selectedMenus, setSelectedMenus] = useState([]);
  const navigate = useNavigate();
  const closeTimerRef = useRef(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => setSelectedMenus([]), MENU_CLOSE_DELAY);
  }, [clearCloseTimer]);

  // 언마운트 시 남은 타이머 정리
  useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);

  const handleMenuSelection = useCallback(
    (label, depth) => {
      clearCloseTimer();
      setSelectedMenus(selectedMenusProp => {
        const newSelectedMenus = [...selectedMenusProp];
        newSelectedMenus.length = depth;
        if (label !== '') {
          newSelectedMenus[depth] = label;
        }
        return newSelectedMenus;
      });
    },
    [clearCloseTimer],
  );

  const contextValue = useMemo(
    () => ({ handleMenuSelection, selectedMenus, useDepth, navigate }),
    [handleMenuSelection, selectedMenus, useDepth, navigate],
  );

  return (
    <CreateMenuList onMouseLeave={scheduleClose} onMouseEnter={clearCloseTimer}>
      <MenuContext.Provider value={contextValue}>
        {menus.map(menu => (
          <SubMenuItem menu={menu} key={menu.title} role={role} />
        ))}
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
