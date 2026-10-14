import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { BiFile, BiTrash } from 'react-icons/bi';
import { FaRegEdit } from 'react-icons/fa';
import { IoIosArrowBack } from 'react-icons/io';
import _ from 'lodash';

/**
 * ## 기본적인 사용법 ##
 *
 * 구성 : 메인 버튼 / 전체 탭 / 섹션 제목 + 스크롤 탭 목록 / 하단 고정 탭
 *  - 요소 사이 간격은 SideTabs 의 gap(10px), 탭 목록 안 간격도 SideScrollWrap 의 gap(10px) 으로만 처리
 *  - SideScrollWrap 은 남는 높이를 채우므로 그 뒤에 둔 탭은 사이드 최하단에 고정됨
 *
 * <div> -- 전체 사이즈 설정
 *   <SideTabs>
 *     <MainTabButton onClick={function}>
 *       <TbPlus /> 업무 추가
 *     </MainTabButton>
 *     <DividingLine />
 *     <TabButton value={0} onClick={function}>
 *       <SideTabLabel icon={<TbLayoutGrid />} count={128}>전체 업무</SideTabLabel>
 *     </TabButton>
 *     <DividingLine />
 *     <SideTabSection
 *       title="그룹"
 *       count={data.length}
 *       action={
 *         <SideTabSectionButton title="그룹 추가" onClick={function}>
 *           <TbCategoryPlus />
 *         </SideTabSectionButton>
 *       }
 *     />
 *     <SideScrollWrap>
 *       {data.length === 0 && <SideTabEmpty>등록된 그룹이 없습니다.</SideTabEmpty>}
 *       {data.map(obj => (
 *         <TabButton
 *           key={obj.id}
 *           value={obj.id}
 *           onClick={function}
 *           deleteFunction={function}
 *           updateFunction={function}
 *         >
 *           <SideTabLabel>{obj.name}</SideTabLabel>
 *         </TabButton>
 *       ))}
 *     </SideScrollWrap>
 *     <DividingLine />
 *     <TabButton value={-1} onClick={function}>
 *       <SideTabLabel count={3} muted>미지정</SideTabLabel>
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
        <ResizerBar className="resizer-bar" onMouseDown={handleResizeStart}>
          <IoIosArrowBack onClick={toggleCollapse} size={18} viewBox="0 0 512 512" />
        </ResizerBar>
      </SideTabsWrap>
    </>
  );
}

/**
 * SideTabs 내부의 스크롤 가능한 틀 (탭 목록)
 * - 탭 사이 간격 10px, 세로 한 줄
 * - 남는 높이를 채움 → 뒤에 오는 탭(미지정·설정 등)은 사이드 최하단 고정
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
 * SideTab의 메인 기능 버튼 (사이드 폭 전체, 회색 배경)
 * - children 에 아이콘 + 글자를 넣으면 세로·가로 중앙 정렬 (예: <TbPlus /> 업무 추가)
 * - className="selectedTab" 을 주면 선택 상태로 표시 (해당 기능 페이지에 있을 때 등)
 * - selectOption (기본 true) : 클릭 시 다른 탭 선택을 해제하고 이 버튼을 선택 상태로 만듦
 *   모달만 여는 버튼처럼 페이지가 바뀌지 않으면 false → 닫은 뒤에도 기존 선택 탭 유지
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export function MainTabButton({ selectOption = true, ...props }) {
  return (
    <MainButton
      {...props}
      aria-label="side-tab-button"
      onClick={e => {
        if (selectOption) {
          selectedButton(e);
        }
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
 * AddOn(아이콘에 onClickFunction 지원) — hover 시에만 우측에 표시
 * deleteFunction : 삭제 아이콘
 * updateFunction : 업데이트 아이콘
 * logFunction    : 로그 아이콘
 * 셋 다 없으면 hover 시 우측 패딩을 늘리지 않음 (has-addon 클래스 기준)
 *
 * children 에는 SideTabLabel 사용 권장 (아이콘·개수·말줄임 처리)
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export function TabButton(props) {
  const { deleteFunction, updateFunction, logFunction, selectOption = true, option } = props;
  const hasAddOn = Boolean(deleteFunction || updateFunction || logFunction);
  const wrapClassName = [option && 'option-button', hasAddOn && 'has-addon']
    .filter(Boolean)
    .join(' ');
  return (
    <ButtonWrap className={wrapClassName} onClick={unSelectedOptionButton}>
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

/**
 * 탭 버튼 안 라벨 (TabButton / MainTabButton 의 children)
 * - 이름이 길면 말줄임(…) + title 툴팁
 * - count 를 주면 우측에 흐린 숫자로 표시 (0 도 표시, undefined/null 이면 미표시)
 * - 버튼 글자색을 그대로 상속 → 선택 탭(배경 반전)에서도 대비 유지
 *   (앱 전역 CSS 가 span 색을 덮어써도 상속되도록 !important)
 *
 * @param {React.ReactNode} [icon]    이름 앞 아이콘
 * @param {number}          [count]   우측 개수
 * @param {boolean}         [muted]   흐린 글자 (미지정 등 보조 탭, 선택 시에는 일반 색)
 * @param {string}          [title]   툴팁 (기본 : children 이 문자열이면 그 값)
 * @param {React.ReactNode} children  탭 이름
 * @example
 * <TabButton value={0} onClick={fn}>
 *   <SideTabLabel icon={<TbLayoutGrid />} count={128}>전체 업무</SideTabLabel>
 * </TabButton>
 */
export function SideTabLabel({ icon, count, muted = false, title, children }) {
  return (
    <LabelWrap className={muted ? 'muted' : undefined}>
      {icon}
      <LabelName title={title ?? (typeof children === 'string' ? children : undefined)}>
        {children}
      </LabelName>
      {count !== undefined && count !== null && <LabelCount>{count}</LabelCount>}
    </LabelWrap>
  );
}

/**
 * 탭 목록 위 섹션 제목 줄 (예 : "그룹 18 ........ [+]")
 * - 제목 시작 위치를 탭 라벨 글자와 맞춤
 * - action 은 우측 끝에 배치 (권한 처리는 사용하는 쪽에서 감싸서 전달)
 *
 * @param {React.ReactNode} title     섹션 제목
 * @param {number}          [count]   제목 옆 개수 배지
 * @param {React.ReactNode} [action]  우측 버튼 (보통 SideTabSectionButton)
 * @example
 * <SideTabSection
 *   title="그룹"
 *   count={groupList.length}
 *   action={
 *     <SideTabSectionButton title="그룹 추가" onClick={openAddModal}>
 *       <TbCategoryPlus />
 *     </SideTabSectionButton>
 *   }
 * />
 */
export function SideTabSection({ title, count, action }) {
  return (
    <SectionWrap>
      <SectionTitle>
        {title}
        {count !== undefined && count !== null && <SectionCount>{count}</SectionCount>}
      </SectionTitle>
      {action}
    </SectionWrap>
  );
}

/**
 * 섹션 제목 우측의 작은 아이콘 버튼 (24×24)
 * - 아이콘만 있으므로 title 필수 (툴팁 + aria-label 로 사용)
 * - 나머지 props 는 button 에 그대로 전달
 *
 * @param {string}          title     툴팁·접근성 이름 (예 : "그룹 추가")
 * @param {Function}        onClick   클릭 시 실행
 * @param {React.ReactNode} children  아이콘
 */
export const SideTabSectionButton = forwardRef(({ title, children, ...props }, ref) => (
  <SectionButton ref={ref} type="button" title={title} aria-label={title} {...props}>
    {children}
  </SectionButton>
));

/**
 * 탭 목록이 비었을 때 문구 (SideScrollWrap 안에서 사용)
 * @param {React.ReactNode} children  문구 (예 : "등록된 그룹이 없습니다.")
 */
export function SideTabEmpty({ children }) {
  return <EmptyText>{children}</EmptyText>;
}

const SideTabsWrap = styled.div`
  width: 252px;
  min-width: 165px;
  max-width: 300px;
  height: calc(100vh - 203px);
  padding-right: 18px;
  font-size: 14px;
  //position: relative;
  box-sizing: border-box;
  flex-shrink: 0;
  position: sticky;
  top: 18px;

  display: flex;
  flex-direction: column;
  gap: 10px;

  &.narrower .resizer-bar svg {
    transform: rotate(180deg);
  }
`;

const ResizerBar = styled.div`
  width: 4px;
  height: 100%;
  border-right: 1px solid var(--seed-border);
  cursor: ew-resize;
  position: absolute;
  right: -2px;
  box-sizing: border-box;

  &:hover {
    border-right: 3px solid var(--x-a9a9a9);
  }

  & svg {
    background: var(--seed-surface-header);
    border-radius: 100%;
    width: 18px;
    height: 18px;
    top: calc(50% - 8px);
    position: absolute;
    left: -5px;
    cursor: pointer;
    transition: transform 0.2s ease-in-out;
    color: var(--x-333);
  }
`;

const ScrollTab = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: var(--seed-scrollbar-track);
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: var(--seed-scrollbar-thumb);
  }
`;

const ButtonWrap = styled.div`
  width: 100%;
  position: relative;

  // 수정/삭제/로그 아이콘이 있을 때만 hover 시 아이콘 자리만큼 우측 패딩 확보
  &.has-addon:hover button {
    padding: 10px 55px 10px 12px;
  }

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
    background: var(--seed-hover);
  }

  &:has(.selectedTab) .selectedOptionTab[aria-label='side-tab-option-button'] {
    color: var(--seed-emphasis-text);
    fill: var(--seed-emphasis-text);
    background-color: var(--seed-emphasis-bg);
  }
`;

const Button = styled.button`
  border: none;
  outline: none;
  width: 100%;
  height: 36px;
  padding: 10px 15px 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  background-color: var(--seed-surface);
  color: var(--seed-text);
  font-size: 13.5px;
  text-overflow: ellipsis;
  text-align: left;
  transition: background-color 0.15s;

  &.selectedTab {
    background-color: var(--seed-emphasis-bg) !important;
    color: var(--seed-emphasis-text);
    font-weight: 600;
  }

  &.selectedTab + div svg {
    fill: var(--seed-emphasis-text);
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

// 아이콘 + 글자 세로·가로 중앙 정렬
const MainButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background-color: var(--seed-surface-header);

  & > svg {
    flex-shrink: 0;
    font-size: 16px;
  }
`;

const MainSmallButton = styled(Button)`
  width: 50%;
  padding: 0;
  text-align: center;
  background-color: var(--seed-surface-header);
`;

// 수정/삭제/로그 아이콘 : 버튼 높이와 무관하게 세로 중앙
const AddOn = styled.div`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  align-items: center;
  gap: 4px;
  display: flex;
  font-size: 16px;

  & > svg {
    display: none;
    cursor: pointer;

    &:hover {
      fill: var(--x-e91e63) !important;
    }
  }
`;

const OptionWrap = styled.div`
  width: 100%;
  height: 36px;
  padding: 0 10px;
  border: 1px solid var(--seed-hover);
  box-sizing: border-box;
  border-radius: 0 0 5px 5px;
  display: none;
  justify-content: space-around;
  align-items: center;

  button.selectedTab ~ & {
    display: flex;
    border-color: var(--seed-border-strong);
  }
`;

const Option = styled.div`
  width: 28px;
  height: 24px;
  border: 1px solid var(--x-bdbdbd);
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  cursor: pointer;
  color: var(--seed-text);

  & svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background-color: var(--seed-hover-strong);
    color: var(--seed-invert-text);
    & svg {
      fill: var(--seed-invert-text);
    }
  }
`;

// span 사용 : ButtonWrap 이 hover 시 내부 div/svg 를 display:flex 로 바꾸므로 div 회피
const LabelWrap = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  color: inherit !important;

  &.muted {
    color: var(--seed-text-secondary) !important;
  }

  .selectedTab &.muted {
    color: inherit !important;
  }

  & > svg {
    flex-shrink: 0;
    font-size: 17px;
    opacity: 0.75;
  }

  .selectedTab & > svg {
    opacity: 1;
  }
`;

const LabelName = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: inherit !important;
`;

const LabelCount = styled.span`
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 400;
  font-variant-numeric: tabular-nums;
  opacity: 0.8;
  color: inherit !important;
`;

// padding-left : 탭 라벨 글자 시작 위치와 정렬
const SectionWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 12px;
`;

const SectionTitle = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--seed-text-secondary);
`;

const SectionCount = styled.span`
  min-width: 18px;
  height: 18px;
  padding: 0 6px;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  background: var(--seed-surface-header);
  font-size: 11px;
`;

const SectionButton = styled.button`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--seed-border);
  border-radius: 5px;
  background: var(--seed-surface);
  color: var(--seed-text);
  font-size: 15px;
  cursor: pointer;
  transition: background-color 0.15s;

  &:hover {
    background: var(--seed-hover);
  }
`;

const EmptyText = styled.div`
  padding-left: 12px;
  font-size: 12px;
  color: var(--seed-text-secondary);
`;
