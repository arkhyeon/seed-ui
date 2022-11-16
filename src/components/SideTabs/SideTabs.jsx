import React from 'react';
import styled from '@emotion/styled';
import { BiTrash, FaRegEdit } from 'react-icons/all';

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
export const SideTabs = props => {
  return <SideTabsWrap {...props} />;
};

/**
 * SideTabs 내부의 스크롤 가능한 틀
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export const SideScrollWrap = props => {
  return <ScrollTab {...props} />;
};

/**
 * SideTab 내부 분할선
 * @returns {JSX.Element}
 * @constructor
 */
export const DividingLine = () => {
  return <Line />;
};

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
 * SideTab의 메인 기능 버튼
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export const MainTabButton = props => {
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
};

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
export const TabButton = props => {
  const { deleteFunction, updateFunction } = props;
  return (
    <ButtonWrap>
      <Button
        {...props}
        aria-label="side-tab-button"
        onClick={e => {
          selectedButton(e);
          props.onClick(e);
        }}
      />
      <AddOn>
        {deleteFunction && <BiTrash onClick={deleteFunction} />}
        {updateFunction && <FaRegEdit onClick={updateFunction} />}
      </AddOn>
    </ButtonWrap>
  );
};

const SideTabsWrap = styled.div`
  width: 233px;
  height: 100%;
  padding-right: 18px;
  font-size: 14px;
  border-right: 1px solid #bdbdbd;

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
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: white;
    border: 1px solid #eee;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #d3d3d3;
  }
`;

const Line = styled.div`
  width: 100%;
  height: 1px;
  background: #bdbdbd;
`;

const ButtonWrap = styled.div`
  width: 100%;
  position: relative;

  &:hover div {
    display: flex;
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
  top: calc(50% - 10px);
  right: 15px;
  align-items: center;
  gap: 5px;
  display: none;

  & svg {
    font-size: 19px;
    cursor: pointer;
    &:first-of-type {
      font-size: 20px;
    }

    &:hover {
      fill: #e91e63 !important;
    }
  }
`;