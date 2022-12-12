import React, { useState } from 'react';
import styled from '@emotion/styled';
import {
  AiOutlineUser,
  BiTrash,
  FaRegEdit,
  IoIosArrowDown,
  IoIosArrowUp,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from 'react-icons/all';
import { css } from '@emotion/react';

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
export function SideTabs(props) {
  return <SideTabsWrap {...props} />;
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

  e.target.classList.add('selectedTab');
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
  const { deleteFunction, updateFunction, selectOption = true } = props;
  return (
    <ButtonWrap>
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
      </AddOn>
    </ButtonWrap>
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
export function TabOptionButton(props) {
  const { deleteFunction, updateFunction, selectOption = true, option } = props;
  return (
    <TabOptionButtonWrap onClick={e => console.log(e)}>
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
        {option && (
          <ViewAddOn>
            {/* <IoIosArrowUp /> */}
            <IoIosArrowDown />
          </ViewAddOn>
        )}
      </AddOn>
      {option && (
        <OptionWrap>
          {option.iconList.map((icon, i) => {
            return (
              <Option
                key={icon.type.name}
                onClick={() => {
                  selectSideTab(props.value);
                  option.funcList[i]();
                }}
              >
                {icon}
              </Option>
            );
          })}
        </OptionWrap>
      )}
    </TabOptionButtonWrap>
  );
}

const SideTabsWrap = styled.div`
  width: 233px;
  height: 100%;
  padding-right: 18px;
  font-size: 14px;
  border-right: 1px solid #d2d2d2;

  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ScrollTab = styled.div`
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #d3d3d3;
    border-left: 5px solid white;
    background-clip: padding-box;
  }
`;

const ButtonWrap = styled.div`
  width: 100%;
  position: relative;

  &:hover div {
    & svg {
      display: block;
    }
  }

  &:hover button {
    background: #e8eefb;
  }
`;

const Button = styled.button`
  border: none;
  outline: none;
  width: 100%;
  height: 38px;
  padding: 10px 0 10px 10px;
  border-radius: 5px;
  cursor: pointer;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &.selectedTab {
    background-color: black !important;
    color: white;
  }

  &.selectedTab + div svg {
    fill: #fff;
  }
`;

const MainButton = styled(Button)`
  background-color: #eceff1;
`;

const AddOn = styled.div`
  position: absolute;
  top: 10px;
  right: 15px;
  align-items: center;
  gap: 5px;
  display: flex;

  & svg {
    display: none;
    font-size: 18px;
    cursor: pointer;

    &:hover {
      fill: #e91e63 !important;
    }
  }
`;

const TabOptionButtonWrap = styled(ButtonWrap)`
  &:hover div {
    display: flex;
  }

  & > button {
    border-radius: 5px 5px 0 0;
  }
  & > button:hover {
    background: #e8eefb;
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
  width: 32px;
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
`;

const ViewAddOn = styled.div`
  margin-left: 5px;
  & svg {
    display: block !important;
  }
`;
