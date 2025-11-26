import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { BiFile, BiTrash } from 'react-icons/bi';
import { FaRegEdit } from 'react-icons/fa';
import { IoIosArrowBack } from 'react-icons/io';
import _ from 'lodash';

/**
 * ## 기본적인 사용법 ##
 *
 * <div> -- 전체 사이즈 설정
 *   <SideTabs>
 *     <MainTabButton onClick={function}>
 *       메인버튼
 *     </MainTabButton>
 *     <DividingLine />
 *     <SideScrollWrap>
 *       <TabButton onClick={function}>
 *         전체 사용자
 *       </TabButton>
 *       {data.map(obj => {
 *         return (
 *           <TabButton
 *             key={obj.id}
 *             onClick={function}
 *             deleteFunction={function}
 *             updateFunction={function}
 *           >
 *             {obj.name}
 *           </TabButton>
 *         );
 *       })}
 *     </SideScrollWrap>
 *     <DividingLine />
 *     <TabButton onClick={function}>
 *       설정
 *     </TabButton>
 *     <TabButton onClick={function}>
 *       그룹 추가
 *     </TabButton>
 *   </SideTabs>
 * </div>
 *
 */

/**
 * SideTab의 기본적인 틀
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */

const DEFAULT_WIDTH = 252;
const NARROW_WIDTH_THRESHOLD = 183;
const COLLAPSED_WIDTH = 165;
const MIN_WIDTH = 165;
const MAX_WIDTH = 418;

export function SideTabs(props) {
  const asideRef = useRef(null);
  const resizeData = useRef({ startX: 0, startWidth: 0 });
  const [isResizing, setIsResizing] = useState(false);

  const updateWidth = useCallback(width => {
    if (!asideRef.current) return;

    const newWidth = Math.max(MIN_WIDTH, Math.min(width, MAX_WIDTH));

    asideRef.current.style.width = `${newWidth}px`;
    asideRef.current.classList.toggle('narrower', newWidth <= NARROW_WIDTH_THRESHOLD);
    window.sessionStorage.setItem('AsideWidth', String(newWidth));
  }, []);

  useEffect(() => {
    const savedWidth = window.sessionStorage.getItem('AsideWidth');
    updateWidth(savedWidth ? parseInt(savedWidth, 10) : DEFAULT_WIDTH);
  }, [updateWidth]);

  const handleResizeStart = useCallback(e => {
    if (!asideRef.current) return;
    document.body.style.userSelect = 'none';
    resizeData.current = { startX: e.screenX, startWidth: asideRef.current.clientWidth };
    setIsResizing(true);
  }, []);

  useEffect(() => {
    if (!isResizing) {
      return;
    }

    const handleResizing = _.debounce(e => {
      if (!asideRef.current) return;
      const move = e.screenX - resizeData.current.startX;
      const newWidth = resizeData.current.startWidth + move;
      updateWidth(newWidth);
    }, 1);

    const handleResizeDone = () => {
      setIsResizing(false);
    };

    window.addEventListener('mousemove', handleResizing);
    window.addEventListener('mouseup', handleResizeDone);

    return () => {
      handleResizing.cancel();
      window.removeEventListener('mousemove', handleResizing);
      window.removeEventListener('mouseup', handleResizeDone);
      document.body.style.userSelect = 'unset';
    };
  }, [isResizing, updateWidth]);

  const toggleCollapse = useCallback(() => {
    if (!asideRef.current) return;
    if (resizeData.current.startWidth === asideRef.current.clientWidth) {
      const isNarrower = asideRef.current.classList.contains('narrower');
      updateWidth(isNarrower ? DEFAULT_WIDTH : COLLAPSED_WIDTH);
    }
  }, [updateWidth]);

  return (
    <>
      <SideTabsWrap {...props} ref={asideRef}>
        {props.children}
        <ResizerBar onMouseDown={handleResizeStart}>
          <IoIosArrowBack onClick={toggleCollapse} size={18} viewBox="-10 0 512 512" />
        </ResizerBar>
      </SideTabsWrap>
    </>
  );
}

/**
 * SideTabs 내부의 스크롤 가능한 틀
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export function SideScrollWrap(props) {
  return <ScrollTab {...props} />;
}

/**
 * 버튼들 클릭 시 CSS 변경 기능
 * @param e
 */
const selectedButton = e => {
  const tabButtonList = document.querySelectorAll('[aria-label="side-tab-button"]');
  const tabButtonListLength = tabButtonList.length;
  for (let i = 0; i < tabButtonListLength; i++) {
    tabButtonList[i].classList.remove('selectedTab');
  }

  e.currentTarget.classList.add('selectedTab');
};

/**
 * Tab의 value 넣어주면 사이드 탭의 버튼을 강제 선택해준다.
 * @param value
 */
export const selectSideTab = value => {
  const tabButtonList = document.querySelectorAll('[aria-label="side-tab-button"]');
  const tabButtonListLength = tabButtonList.length;
  for (let i = 0; i < tabButtonListLength; i++) {
    if (String(value) === tabButtonList[i].value) {
      tabButtonList[i].click();
    }
  }
};

const selectedOptionButton = e => {
  e.stopPropagation();
  const tabButtonList = document.querySelectorAll('[aria-label="side-tab-option-button"]');
  const tabButtonListLength = tabButtonList.length;
  for (let i = 0; i < tabButtonListLength; i++) {
    tabButtonList[i].classList.remove('selectedOptionTab');
  }
  e.currentTarget.classList.add('selectedOptionTab');
};

const unSelectedOptionButton = e => {
  const tabButtonList = document.querySelectorAll('[aria-label="side-tab-option-button"]');
  const tabButtonListLength = tabButtonList.length;
  for (let i = 0; i < tabButtonListLength; i++) {
    tabButtonList[i].classList.remove('selectedOptionTab');
  }
};

/**
 * SideTab의 메인 기능 버튼
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export function MainTabButton(props) {
  return (
    <MainButton
      {...props}
      aria-label="side-tab-button"
      onClick={e => {
        selectedButton(e);
        props.onClick(e);
      }}
    />
  );
}

export function MainSmallTabButton(props) {
  return (
    <MainSmallButton
      {...props}
      aria-label="side-tab-button"
      onClick={e => {
        selectedButton(e);
        props.onClick(e);
      }}
    />
  );
}

/**
 * SideTab의 일반 기능 버튼
 *
 * AddOn(아이콘에 onClickFunction 지원)
 * deleteFunction : 삭제 아이콘
 * updateFunction : 업데이트 아이콘
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export function TabButton(props) {
  const { deleteFunction, updateFunction, logFunction, selectOption = true, option } = props;
  return (
    <ButtonWrap className={option && 'option-button'} onClick={unSelectedOptionButton}>
      <Button
        {...props}
        aria-label="side-tab-button"
        onClick={e => {
          if (selectOption) {
            selectedButton(e);
          }
          props.onClick(e);
        }}
      />
      <AddOn>
        {deleteFunction && <BiTrash onClick={deleteFunction} />}
        {updateFunction && <FaRegEdit onClick={updateFunction} />}
        {logFunction && <BiFile onClick={logFunction} />}
      </AddOn>
      {option && (
        <OptionWrap>
          {option.iconList.map((icon, i) => {
            return (
              <Option
                aria-label="side-tab-option-button"
                key={icon.type.name}
                onClick={e => {
                  selectSideTab(props.value);
                  selectedOptionButton(e);
                  option.funcList[i]();
                }}
              >
                {icon}
              </Option>
            );
          })}
        </OptionWrap>
      )}
    </ButtonWrap>
  );
}

export function TabIconButton(props) {
  const { selectOption = true } = props;
  return (
    <ButtonWrap>
      <IconButton
        {...props}
        aria-label="side-tab-button"
        onClick={e => {
          if (selectOption) {
            selectedButton(e);
          }
          props.onClick(e);
        }}
      >
        {props.children}
      </IconButton>
    </ButtonWrap>
  );
}

const SideTabsWrap = styled.div`
  width: 252px;
  min-width: 165px;
  max-width: 418px;
  height: calc(100vh - 203px);
  padding-right: 18px;
  font-size: 14px;
  position: relative;
  box-sizing: border-box;
  flex-shrink: 0;

  display: flex;
  flex-direction: column;
  gap: 10px;

  &.narrower svg {
    transform: rotate(180deg);
  }
`;

const ResizerBar = styled.div`
  width: 4px;
  height: 100%;
  border-right: 1px solid #d2d2d2;
  cursor: ew-resize;
  position: absolute;
  right: -2px;
  box-sizing: border-box;

  &:hover {
    border-right: 3px solid #a9a9a9;
  }

  & svg {
    background: #eceff1;
    border-radius: 100%;
    width: 18px;
    height: 18px;
    top: calc(50% - 8px);
    position: absolute;
    left: -5px;
    cursor: pointer;
    transition: transform 0.2s ease-in-out;
    color: #333;
  }
`;

const ScrollTab = styled.div`
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: #eeeeee;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #d3d3d3;
  }
`;

const ButtonWrap = styled.div`
  width: 100%;
  position: relative;

  & button {
    overflow: hidden;
  }

  &.option-button > button {
    border-radius: 5px 5px 0 0;
  }

  &:hover div,
  &:hover svg {
    display: flex;
  }

  &:hover button {
    background: #e8eefb;
  }

  &:has(.selectedTab) .selectedOptionTab[aria-label='side-tab-option-button'] {
    color: white;
    fill: white;
    background-color: black;
  }
`;

const Button = styled.button`
  border: none;
  outline: none;
  width: 100%;
  height: 38px;
  padding: 10px 55px 10px 10px;
  border-radius: 5px;
  cursor: pointer;
  background-color: white;
  text-overflow: ellipsis;
  text-align: left;

  &.selectedTab {
    background-color: black !important;
    color: white;
  }

  &.selectedTab + div svg {
    fill: #fff;
  }
`;

const IconButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;

  & svg {
    font-size: 16px;
  }
`;

const MainButton = styled(Button)`
  background-color: #eceff1;
`;

const MainSmallButton = styled(Button)`
  width: 50%;
  padding: 0;
  text-align: center;
  background-color: #eceff1;
`;

const AddOn = styled.div`
  position: absolute;
  top: 10px;
  right: 15px;
  align-items: center;
  gap: 2px;
  display: flex;
  font-size: 18px;

  & > svg {
    display: none;
    cursor: pointer;

    &:hover {
      fill: #e91e63 !important;
    }
  }
`;

const OptionWrap = styled.div`
  width: 100%;
  height: 36px;
  padding: 0 10px;
  border: 1px solid #e8eefb;
  box-sizing: border-box;
  border-radius: 0 0 5px 5px;
  display: none;
  justify-content: space-around;
  align-items: center;

  button.selectedTab ~ & {
    display: flex;
    border-color: #9e9e9e;
  }
`;

const Option = styled.div`
  width: 28px;
  height: 24px;
  border: 1px solid #bdbdbd;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  cursor: pointer;

  & svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background-color: #455a64;
    color: white;
    & svg {
      fill: white;
    }
  }
`;
