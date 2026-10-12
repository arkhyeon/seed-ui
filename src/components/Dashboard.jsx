import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { GridStack } from 'gridstack';
import styled from '@emotion/styled';
import 'gridstack/dist/gridstack.css';
import { BlackButton, WhiteButton } from './Button/Button';

/**
 * 탭 내용을 렌더링하는 컴포넌트.
 *
 * @param {Object} props
 * @param {string} props.title - 위젯 상단에 표시될 제목
 * @param {Function} props.onRemove - 위젯 메뉴에서 '위젯 제거' 클릭 시 호출되는 콜백 함수
 */
function TabComponent({ title, onRemove }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    // 메뉴 바깥을 클릭했을 때 메뉴를 닫기 위한 이벤트 핸들러
    const handleClickOutside = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 드래그 핸들을 제외한 다른 요소들에서 mousedown 이벤트 막아 의도치 않은 드래그 제한
  const stopDrag = e => {
    e.stopPropagation();
  };

  return (
    <TabItem>
      <WidgetHeader>
        <DragHandle className="drag-handle" title="드래그하여 이동" />
        <WidgetTitle onMouseDown={stopDrag}>{title}</WidgetTitle>
        <MenuContainer ref={menuRef} onMouseDown={stopDrag} className="menu-container">
          <MenuButton onClick={() => setShowMenu(!showMenu)}>⋮</MenuButton>
          {showMenu && (
            <Dropdown>
              <DropdownItem onClick={onRemove}>위젯 제거</DropdownItem>
            </Dropdown>
          )}
        </MenuContainer>
      </WidgetHeader>
      <ContentArea onMouseDown={stopDrag}>
        <div style={{ color: 'var(--x-adb5bd)', fontSize: '12px' }}>위젯 데이터 영역</div>
      </ContentArea>
      <Divider onMouseDown={stopDrag} />
      <WidgetFooter onMouseDown={stopDrag}>
        <FooterLink href="https://aws.amazon.com/" target="_blank" rel="noopener noreferrer">
          상세 보기 &rsaquo;
        </FooterLink>
      </WidgetFooter>
    </TabItem>
  );
}

// 위젯 리사이즈 제약 (최소/최대 너비 및 높이)
const SIZE_LIMIT = { minW: 2, maxW: 8, minH: 2, maxH: 6 };

const defaultRenderWidget = (widget, { onRemove }) => (
  <TabComponent title={widget.title} onRemove={onRemove} />
);

/**
 * 대시보드 메인 레이아웃
 * GridStack 은 위젯 틀(DOM)과 배치만 담당하고, 위젯 내용은 createPortal 로 렌더링한다.
 * → 위젯이 부모 React 트리 안에 있으므로 Provider(테마, 라우터 등) Context 가 그대로 전달된다.
 *
 * @param {Object} props
 * @param {string} props.title - 대시보드 상단 제목
 * @param {string} props.width - 전체 너비
 * @param {number|string} props.height - 전체 높이 (숫자면 px)
 * @param {{ id: string, title: string, x: number, y: number, w: number, h: number }[]} props.currentTabs - 기본 배치
 * @param {{ id: string, title: string, w: number, h: number }[]} props.sidebarTabs - 위젯 라이브러리 목록
 * @param {string|null} [props.storageKey='grid-layout'] - 배치를 저장할 localStorage 키. null 이면 저장 안 함
 * @param {Function} [props.onLayoutChange] - 배치가 바뀔 때 호출. 인자는 currentTabs 와 같은 형태의 배열
 * @param {Function} [props.renderWidget] - (widget: { id, title }, { onRemove }) => ReactNode. 위젯 내용 렌더링
 */
function Dashboard({
  width,
  height,
  title,
  currentTabs,
  sidebarTabs,
  storageKey = 'grid-layout',
  onLayoutChange,
  renderWidget = defaultRenderWidget,
}) {
  // height 가 숫자면 px 로 보정 (CSS 값에 단위 없으면 무시됨)
  const cssHeight = typeof height === 'number' ? `${height}px` : height;
  const rootContainerRef = useRef(null); // 루트 컨테이너 DOM 참조
  const gridContainerRef = useRef(null); // GridStack이 적용될 컨테이너 DOM 참조
  const sidebarContentRef = useRef(null); // 사이드바 위젯 목록 DOM 참조 (드래그 대상 한정용)
  const gridRef = useRef(null); // GridStack 인스턴스 참조
  const [dashboardWidth, setDashboardWidth] = useState(0); // 현재 화면 너비 (반응형 컬럼 조정을 위함)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 사이드바 열림/닫힘 상태
  const [isEditable, setIsEditable] = useState(true); // 레이아웃 편집 모드 (드래그/리사이즈 활성화 여부)

  // 그리드에 배치된 위젯 — { id, title, itemEl(GridStack 위젯 DOM), contentEl(portal 대상) }
  const [mountedWidgets, setMountedWidgets] = useState([]);

  // 로컬 스토리지에서 저장된 레이아웃을 불러오거나 기본 레이아웃을 설정
  const [initialLayout] = useState(() => {
    const saved = storageKey ? localStorage.getItem(storageKey) : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to parse layout from localStorage', e);
      }
    }
    return currentTabs;
  });

  // GridStack 이벤트 핸들러(마운트 시 1회 등록)에서 항상 최신 props 를 읽기 위한 ref
  const latestRef = useRef({});
  latestRef.current = {
    storageKey,
    onLayoutChange,
    titles: new Map([...sidebarTabs, ...currentTabs, ...initialLayout].map(t => [t.id, t.title])),
  };

  // 화면 크기 변경 감지를 위한 ResizeObserver 설정
  useEffect(() => {
    const handleResize = entries => {
      entries.forEach(entry => {
        setDashboardWidth(entry.contentRect.width);
      });
    };
    const observer = new ResizeObserver(handleResize);
    if (rootContainerRef.current) observer.observe(rootContainerRef.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  // GridStack 초기화 및 이벤트 리스너 등록
  useEffect(() => {
    if (!gridContainerRef.current) return undefined;

    // GridStack 인스턴스 생성
    const grid = GridStack.init(
      {
        cellHeight: 60,
        margin: 10,
        handle: '.drag-handle', // 드래그를 활성화할 CSS 셀렉터
        acceptWidgets: true, // 외부(사이드바)에서 드래그 앤 드롭으로 위젯 추가 허용
        disableOneColumnMode: true, // 모바일에서 강제로 1열 모드로 변하는 것을 방지
        float: false, // true면 위젯들이 위로 빈 공간을 채우지 않고 자유롭게 배치되도록 설정
        resizable: { handles: 'se', autoHide: false }, // 탭 우측 하단 리사이즈 핸들 설정
        alwaysShowPlaceholder: true, // 드래그 중 배치 예정 위치 항상 표시
        animate: true, // 이동/리사이즈 시 애니메이션 적용
      },
      gridContainerRef.current,
    );
    gridRef.current = grid;
    let isLoading = true; // 초기 배치 중에는 저장/onLayoutChange 생략

    /**
     * 현재 배치를 저장하고 onLayoutChange 로 알림 (currentTabs 와 같은 형태)
     */
    const saveLayout = () => {
      if (isLoading) return;
      const { storageKey: key, onLayoutChange: onChange, titles } = latestRef.current;
      const layout = grid.engine.nodes.map(node => ({
        id: node.id,
        title: titles.get(node.id) ?? '새 위젯',
        x: node.x,
        y: node.y,
        w: node.w,
        h: node.h,
      }));
      if (key) {
        if (layout.length > 0) {
          localStorage.setItem(key, JSON.stringify(layout));
        } else {
          localStorage.removeItem(key);
        }
      }
      onChange?.(layout);
    };

    grid.on('change', saveLayout);

    // 새 위젯이 그리드에 추가되었을 때 (초기 배치, 사이드바 드롭) — portal 대상 등록
    grid.on('added', (event, items) => {
      const added = items.map(item => {
        // 추가된 위젯에 동적으로 리사이징 제약 조건 적용 (최소/최대 너비 및 높이)
        grid.update(item.el, SIZE_LIMIT);

        // 사이드바에서 드래그해 올 때 복제된 사이드바 DOM 정리
        const childrenToKeep = [];
        Array.from(item.el.children).forEach(child => {
          const className = child.className || '';
          const isContent =
            typeof className === 'string' && className.includes('grid-stack-item-content');
          const isResizable = typeof className === 'string' && className.includes('ui-resizable');

          if (isContent) {
            // eslint-disable-next-line no-param-reassign
            child.innerHTML = '';
            childrenToKeep.push(child);
          } else if (isResizable) {
            childrenToKeep.push(child);
          }
        });
        while (item.el.firstChild) {
          item.el.removeChild(item.el.firstChild);
        }
        childrenToKeep.forEach(child => {
          item.el.appendChild(child);
        });

        let contentEl = item.el.querySelector('.grid-stack-item-content');
        if (!contentEl) {
          contentEl = document.createElement('div');
          contentEl.className = 'grid-stack-item-content';
          item.el.appendChild(contentEl);
        }
        const id = item.id ?? item.el.getAttribute('data-id');
        const widgetTitle =
          latestRef.current.titles.get(id) ?? item.el.getAttribute('data-title') ?? '새 위젯';
        return { id, title: widgetTitle, itemEl: item.el, contentEl };
      });
      const addedIds = added.map(w => w.id);
      setMountedWidgets(prev => [...prev.filter(w => !addedIds.includes(w.id)), ...added]);
      saveLayout();
    });

    // 위젯이 그리드에서 제거되었을 때 — portal 해제 (React 가 위젯 내용을 언마운트)
    grid.on('removed', (event, items) => {
      const removedIds = items.map(item => item.id);
      setMountedWidgets(prev => prev.filter(w => !removedIds.includes(w.id)));
      saveLayout();
    });

    // 초기 위젯: 위젯 틀은 GridStack 이 만들고, 'added' 이벤트에서 portal 대상으로 등록
    grid.batchUpdate();
    initialLayout.forEach(({ id, x, y, w, h }) => grid.addWidget({ id, x, y, w, h }));
    grid.batchUpdate(false);
    isLoading = false;

    return () => {
      grid.offAll();
      // GridStack 이 만든 위젯 DOM 제거 (StrictMode 재실행 시 중복 방지). 컨테이너는 React 소유라 유지
      grid.removeAll(true, false);
      grid.destroy(false);
      gridRef.current = null;
      setMountedWidgets([]);
    };
    // initialLayout 은 마운트 시 1회 사용하는 초기값 (useState 로 고정)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 편집 모드 상태 변경 시 GridStack 활성화/비활성화 처리
  useEffect(() => {
    if (gridRef.current) {
      if (isEditable) {
        gridRef.current.enable();
      } else {
        gridRef.current.disable();
      }
    }
    // className prop 으로 바꾸면 GridStack 이 붙인 클래스(gs-8 등)까지 덮어쓰므로 classList 로 토글
    gridContainerRef.current?.classList.toggle('is-static', !isEditable);
  }, [isEditable]);

  const activeWidgetIds = mountedWidgets.map(widget => widget.id);
  const activeWidgetKey = activeWidgetIds.join(',');

  // 사이드바가 열렸을 때 드래그 가능한 아이템 설정 — 이 대시보드의 사이드바 요소만 대상으로 한정
  useEffect(() => {
    if (isSidebarOpen) {
      const timer = setTimeout(() => {
        if (!sidebarContentRef.current) return;
        GridStack.setupDragIn(
          Array.from(sidebarContentRef.current.querySelectorAll('.sidebar-item')),
          {
            revert: 'invalid', // 유효하지 않은 드롭 위치일 경우 원래 자리로 되돌아감
            scroll: false,
            appendTo: 'body', // 드래그 헬퍼 요소를 body에 추가하여 z-index 문제 방지
            helper: el => {
              const clone = el.cloneNode(true);
              clone.style.zIndex = '100';
              return clone;
            },
          },
        );
      }, 100);
      return () => clearTimeout(timer);
    }
    return () => {};
  }, [isSidebarOpen, activeWidgetKey]);

  // 반응형 레이아웃 처리: 브라우저 너비에 따라 GridStack의 전체 컬럼 수를 조정
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || dashboardWidth === 0) return;
    let targetColumn;
    if (dashboardWidth < 768) {
      targetColumn = 4;
    } else if (dashboardWidth < 1200) {
      targetColumn = 8;
    } else {
      targetColumn = 12;
    }
    if (grid.getColumn() !== targetColumn) {
      grid.column(targetColumn, 'compact'); // 위젯들이 빈자리를 찾아 촘촘하게 압축되어 재정렬
    }
  }, [dashboardWidth]);

  /**
   * 기본 배치(currentTabs)로 초기화 — 페이지 새로고침 없이 위젯을 다시 배치
   */
  const handleReset = () => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('정말 초기화하시겠습니까?')) return;
    const grid = gridRef.current;
    if (!grid) return;
    // 이벤트 없이 기존 위젯 제거 → 다시 추가할 때 'added' 에서 한 번만 저장/onLayoutChange
    grid.removeAll(true, false);
    setMountedWidgets([]);
    if (storageKey) localStorage.removeItem(storageKey);
    grid.batchUpdate();
    currentTabs.forEach(({ id, x, y, w, h }) => grid.addWidget({ id, x, y, w, h }));
    grid.batchUpdate(false);
  };

  /**
   * 레이아웃 편집 모드를 토글하는 함수
   */
  const handleToggleEditMode = () => {
    if (isEditable) {
      setIsSidebarOpen(false); // 편집 모드 종료 시 사이드바도 함께 닫음
    }
    setIsEditable(prev => !prev);
  };

  const isHeaderNarrow = dashboardWidth > 0 && dashboardWidth < 576;
  const isSidebarNarrow = dashboardWidth > 0 && dashboardWidth < 768;

  return (
    <RootContainer width={width} height={cssHeight} ref={rootContainerRef}>
      <Header isNarrow={isHeaderNarrow}>
        <div style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>{title}</div>
        <HeaderActions>
          <WhiteButton onClick={handleToggleEditMode}>
            {isEditable ? '잠금' : '잠금 해제'}
          </WhiteButton>
          <WhiteButton onClick={handleReset} disabled={!isEditable}>
            초기화
          </WhiteButton>
          <BlackButton onClick={() => setIsSidebarOpen(!isSidebarOpen)} disabled={!isEditable}>
            {isSidebarOpen ? '닫기' : '위젯 추가'}
          </BlackButton>
        </HeaderActions>
      </Header>

      <MainLayout>
        <GridWrapper height={cssHeight}>
          {/* 위젯 DOM 은 GridStack 이 직접 관리 — React 는 컨테이너만 렌더링 */}
          <div className="grid-stack" ref={gridContainerRef} />
          {mountedWidgets.map(widget =>
            createPortal(
              renderWidget(
                { id: widget.id, title: widget.title },
                { onRemove: () => gridRef.current?.removeWidget(widget.itemEl) },
              ),
              widget.contentEl,
              widget.id,
            ),
          )}
        </GridWrapper>

        <Sidebar isOpen={isSidebarOpen} isNarrow={isSidebarNarrow}>
          <SidebarInner isNarrow={isSidebarNarrow}>
            <SidebarHeader>위젯 라이브러리</SidebarHeader>
            <SidebarContent ref={sidebarContentRef}>
              {sidebarTabs
                .filter(item => !activeWidgetIds.includes(item.id))
                .map(item => (
                  <div
                    key={item.id}
                    className="sidebar-item grid-stack-item"
                    gs-id={item.id}
                    gs-w={item.w}
                    gs-h={item.h}
                    data-id={item.id}
                    data-title={item.title}
                    style={{ marginBottom: '10px' }}
                  >
                    <SidebarItemInner>
                      <DragIcon>⠿</DragIcon>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{item.title}</div>
                        <div style={{ fontSize: '12px', color: 'var(--x-888)' }}>
                          {item.w}x{item.h}
                        </div>
                      </div>
                    </SidebarItemInner>
                  </div>
                ))}
            </SidebarContent>
          </SidebarInner>
        </Sidebar>
      </MainLayout>
    </RootContainer>
  );
}

const GridWrapper = styled.div`
  flex: 1;
  padding: 15px;

  .grid-stack {
    min-height: ${props => (props.height ? `calc(${props.height} * 0.9)` : 'auto')};
    border: 1px solid gray;
    border-radius: 8px;
    background-color: rgba(0, 0, 0, 0.02);
    transition: all 0.2s ease;
  }

  .grid-stack.is-static .drag-handle,
  .grid-stack.is-static .menu-container,
  .grid-stack.is-static .ui-resizable-se {
    display: none;
  }

  .grid-stack-placeholder > .placeholder-content {
    background: #a8a8a8 !important;
    margin: 5px;
    border-radius: 8px;
  }

  .grid-stack-item-content {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    border: 1px solid #e9ecef;
    margin: 5px;
    overflow: visible !important;
    display: flex;
  }

  .ui-resizable-se {
    width: 12px !important;
    height: 12px !important;
    right: 15px !important;
    bottom: 15px !important;
    background: none !important;
    cursor: se-resize !important;
    display: block !important;
    opacity: 1 !important;
    visibility: visible !important;
    rotate: 45deg;
    z-index: 30 !important;
  }

  .ui-resizable-se::after {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M5 11L11 5M9 11L11 9' stroke='%23879196' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: bottom right;
  }
`;

const RootContainer = styled.div`
  width: ${props => (props.width ? `${props.width}` : 'auto')};
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  min-height: ${props => (props.height ? `${props.height}` : 'auto')};
`;

const Header = styled.div`
  padding: 10px 20px;
  min-height: 56px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 10px 20px;
  z-index: 1100;
  color: #08060d;

  ${props =>
    props.isNarrow &&
    `
    flex-direction: column;
    align-items: flex-start;
  `}
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;
`;

const MainLayout = styled.div`
  display: flex;
  flex: 1;
  position: relative;
`;
const TabItem = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
`;
const WidgetHeader = styled.div`
  height: 44px;
  position: relative;
  flex-shrink: 0;
`;
const DragHandle = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab !important;
  background-color: var(--x-f1f3f5);
  border-radius: 4px;
  color: var(--x-adb5bd);
  z-index: 10;
  &::before {
    content: '⠿';
    font-size: 16px;
  }
  &:hover {
    background-color: #e9ecef;
    color: var(--x-495057);
  }
`;
const WidgetTitle = styled.div`
  position: absolute;
  top: 8px;
  left: 44px;
  right: 44px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: var(--x-495057);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
`;
const MenuContainer = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 20;
`;
const MenuButton = styled.button`
  background: none;
  border: none;
  width: 28px;
  height: 28px;
  font-size: 18px;
  cursor: pointer;
  color: var(--x-adb5bd);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  &:hover {
    background: var(--x-f1f3f5);
    color: var(--x-495057);
  }
`;
const Dropdown = styled.div`
  position: absolute;
  right: 0;
  top: 32px;
  background: white;
  border: 1px solid #dee2e6;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  border-radius: 6px;
  min-width: 120px;
  overflow: hidden;
  z-index: 1000;
`;
const DropdownItem = styled.div`
  padding: 10px 14px;
  font-size: 13px;
  cursor: pointer;
  color: #e03131;
  font-weight: 500;
  &:hover {
    background: #fff5f5;
  }
`;
const ContentArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  font-weight: 600;
  color: #343a40;
  text-align: center;
  word-break: keep-all;
  user-select: none;
  overflow: auto;
`;
const Divider = styled.div`
  height: 1px;
  background-color: #e9ecef;
  margin: 0 10px;
`;
const WidgetFooter = styled.div`
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
  background-color: #fff;
  border-radius: 0 0 8px 8px;
`;
const FooterLink = styled.a`
  font-size: 11px;
  color: #007bff;
  text-decoration: none;
  font-weight: 600;
  &:hover {
    text-decoration: underline;
  }
`;
const Sidebar = styled.div`
  position: sticky;
  top: 15px;
  align-self: flex-start;
  height: auto;
  background: white;
  box-shadow: ${props => (props.isOpen ? '-4px 0 15px rgba(0, 0, 0, 0.08)' : 'none')};
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1050;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;
  width: ${props => {
    if (!props.isOpen) return '0';
    return props.isNarrow ? '200px' : '280px';
  }};
`;
const SidebarInner = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  width: ${props => (props.isNarrow ? '200px' : '280px')};
  min-width: ${props => (props.isNarrow ? '200px' : '280px')};
`;
const SidebarHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid var(--x-f1f3f5);
  font-weight: bold;
  font-size: 16px;
`;
const SidebarContent = styled.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;
`;
const SidebarItemInner = styled.div`
  padding: 12px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: white;
  display: flex;
  align-items: center;
  cursor: grab;
  transition: all 0.2s;
  &:hover {
    border-color: #ec7211;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    transform: translateY(-2px);
  }
`;
const DragIcon = styled.div`
  margin-right: 12px;
  color: #dee2e6;
  font-size: 18px;
`;

export default Dashboard;
