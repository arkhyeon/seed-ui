import React, { useState, useCallback, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import Group from './Group';
import CreateBtn from './CreateBtn';

/**
 * @param {String} props.unit
 * 그룹 구성 단위의 명칭
 * 그룹을 이루는 것이 사용자인지, 업무 인지 등에 대한 명칭을 기술
 * default 값은 '유닛'
 * @param {Object []} props.groupList
 * 생성된 그룹의 목록
 * {id: number, value: string, cnt: number}의 객체가 모인 배열
 * default 값은 [{ id: 1, value: 'item_1', cnt: 3 }]
 * @param {String []} props.buttonList
 * 그룹 리스트 하단에 생성될 버튼 목록
 * text만 입력하면 버튼은 양식에 따라 자동 완성
 * default 값은 ['설정']
 * @param {Function} props.clickCreate
 * 최상단 추가 버튼 클릭시 발생할 이벤트
 * default 값은 null
 * @param {Function} props.clickGroup
 * 1개의 그룹 클릭 시 발생할 이벤트
 * 첫번째 인자로는 groupList에서 넣은 id 값을 가짐
 * default 값은 (id) => console.log(id)
 * @param {Function} props.clickMenu
 * 각 그룹을 제외한 메뉴를 클릭 시 발생할 이벤트
 * 첫번째 인자로는 menu의 id 값을 가짐
 * 각 메뉴의 id는 미지정 그룹이 0, 그룹 리스트 하단에 추가되는 메뉴들은 그룹의 개수 + 1 부터 차례로 이어짐.
 * default 값은 (id) => console.log(id)
 * @param {Function} props.clickModify
 * 각 그룹의 수정 버튼을 클릭 시 발생할 이벤트
 * 첫번째 인자로는 groupList에서 넣은 id 값을 가짐
 * default 값은 (id) => console.log(id)
 * @param {Function} props.clickDelete
 * 각 그룹의 삭제 버튼을 클릭 시 발생할 이벤트
 * 첫번째 인자로는 groupList에서 넣은 id 값을 가짐
 * default 값은 (id) => console.log(id)
 * @param {Object} props.selectedGroupInfo
 * 외부에서 선택된 그룹 값으로 변경 시켜야 할 때 사용되는 인자
 * { gname: 선택한 그룹 이름}의 형태
 * 필요한 것은 그룹의 이름 뿐이나, 문자열로 받을 경우 똑같은 그룹을 연이어 선택하면 해당 액션을 감지 못하게 되어 Objct 형태를 차선책으로 선택
 * default 값은 {gname: undefined}
 * @returns {JSX.Element} GroupList Component
 */

function GroupList({
  unit = '유닛',
  groupList = [{ id: 1, value: 'item_1', cnt: 3 }],
  buttonList = ['설정'],
  clickCreate = () => console.log('생성 버튼'),
  clickGroup = id => console.log(`${id} 클릭 그룹`),
  clickMenu = id => console.log(`${id} 클릭메뉴`),
  clickModify = id => console.log(id),
  clickDelete = id => console.log(id),
  selectedGroupInfo = { gname: undefined },
}) {
  // const [isShow, setIsShow] = useState(true);
  const itemListRef = useRef(null);
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const menusRef = useRef([]);
  const [selected, setSelected] = useState(0);
  const [currentGroup, setCurrentGroup] = useState(undefined);
  // const [selectUpdate, setSelectUpdate] = useState(false);
  // const [isItemOpen, setIsItemOpen] = useState(false);

  // const handleShow = useCallback(() => {
  //   setIsShow(!isShow);
  // }, [isShow]);

  useEffect(() => {
    setCurrentGroup(selectedGroupInfo.gname);
  }, [selectedGroupInfo]);

  const handleSelect = useCallback(
    idx => {
      setSelected(idx);
    },
    [setSelected],
  );

  useEffect(() => {
    if (currentGroup === undefined) {
      return;
    }

    if (currentGroup === '') {
      clickMenu(0);
      setSelected(0);
      setCurrentGroup(undefined);

      return;
    }

    let targetId = '';
    let targetIdx = '';
    menusRef.current.forEach((el, idx) => {
      if (el?.dataset?.gname === currentGroup) {
        targetIdx = idx;
        targetId = el.dataset.id;
      }
    });
    clickGroup(targetId);
    setSelected(targetIdx);
    setCurrentGroup(undefined);
  }, [selectedGroupInfo, clickGroup, currentGroup, clickMenu]);

  useEffect(() => {
    if (selected >= 1 && selected <= groupList.length + 1) {
      // titleRef.current.style.background = 'rgb(232, 238, 251)';
      titleRef.current.style.background = 'rgb(33, 37, 41)';
      titleRef.current.style.color = 'white';

      for (let i = 0; i <= menusRef.current.length + 1; i++) {
        if (!menusRef.current[i]) {
          continue;
        }
        if (i === selected) {
          menusRef.current[i].classList.add('selectedGroup');
        } else {
          menusRef.current[i].classList.remove('selectedGroup');
          menusRef.current[i].classList.remove('selected');
        }
      }
      return;
    }
    // titleRef.current.style.background = '#eceff1';
    titleRef.current.style.background = 'rgb(232, 238, 251)';
    titleRef.current.style.color = 'black';

    for (let i = 0; i < menusRef.current.length; i++) {
      if (!menusRef.current[i]) {
        continue;
      }

      if (i === selected) {
        menusRef.current[i].classList.add('selected');
      } else {
        menusRef.current[i].classList.remove('selected');
        menusRef.current[i].classList.remove('selectedGroup');
      }
    }
  }, [selected, groupList]);

  const renderItem = useCallback(() => {
    return groupList.map((el, idx) => (
      <Group
        key={`item-${el.value}`}
        idx={idx + 1}
        handleSelect={handleSelect}
        selected={selected}
        id={el.id}
        clickGroup={clickGroup}
        value={el.value}
        cnt={el.cnt}
        menusRef={menusRef}
        clickModify={clickModify}
        clickDelete={clickDelete}
      />
    ));
  }, [groupList, handleSelect, selected, clickGroup, clickModify, clickDelete]);

  const handleMenu = useCallback(
    (idx, type) => {
      if (type === 'button') {
        clickMenu(idx);
        handleSelect(idx);
      } else {
        clickMenu(0);
        handleSelect(0);
      }
    },
    [clickMenu, handleSelect],
  );

  // useEffect(() => {
  //   if (isShow) {
  //     itemListRef.current.classList.remove('close');
  //     containerRef.current.style.width = '220px';
  //   } else {
  //     itemListRef.current.classList.add('close');
  //     containerRef.current.style.width = '30px';
  //   }
  // }, [isShow]);

  // const handleItem = useCallback(() => {
  //   setIsItemOpen(!isItemOpen);
  // }, [isItemOpen]);

  const renderBtns = useCallback(() => {
    return (
      <>
        {buttonList.map((el, idx) => (
          <Button
            key={`itemListBtn-${el}`}
            onClick={() => handleMenu(groupList.length + idx + 2, 'button')}
            ref={el => {
              menusRef.current[groupList.length + 2] = el;
            }}
            className="group-list-menu"
          >
            {el}
          </Button>
        ))}
      </>
    );
  }, [buttonList, groupList.length, handleMenu]);

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <Container ref={containerRef}>
        <Wrapper ref={itemListRef} className="group-list">
          <CreateBtn clickCreate={clickCreate} unit={unit} setSelected={setSelected} />
          <DividingLine className="group-list-divide" />
          <NoneGroup
            onClick={() => handleMenu(0)}
            ref={el => {
              menusRef.current[0] = el;
            }}
            className="group-list-menu"
          >
            미지정 그룹
          </NoneGroup>
          <Content>
            <ItemTitle
              // onClick={handleItem}
              ref={titleRef}
              className="group-list-menu"
            >
              <div>그룹</div>
              {/* {isItemOpen ? <AiOutlineUp /> : <AiOutlineDown />} */}
            </ItemTitle>
            {/* {isItemOpen && renderItem()} */}
            {renderItem()}
          </Content>
          <DividingLine className="group-list-divide" />
          <ButtonWrapper>{renderBtns()}</ButtonWrapper>
        </Wrapper>
      </Container>
      <div>
        <BorderRight />
      </div>
    </div>
  );
}

const Container = styled.div`
  position: relative;
  background: white;
  height: 100%;
  font-size: 14px;
  /* overflow: hidden;
  transition: 0.4s; */
  /* .close {
    transform: translate(-190px, 0);
    transition: 0.4s;
  } */

  .selected {
    background: rgb(33, 37, 41);
    color: #eee;
    font-weight: bold;

    :before {
      background: transparent;
    }

    :after {
      background: transparent;
    }

    :hover {
      background: rgb(33, 37, 41);
      color: #eee;
    }
  }

  .selectedGroup {
    font-weight: bold;
  }
`;

const Wrapper = styled.div`
  /* position: absolute; */
  height: calc(100% - 34px);
  width: 233px;
  transition: 0.4s;
  padding: 18px;
  padding-top: 16px;
`;

const DividingLine = styled.div`
  width: 233px;
  margin-top: 10px;
  margin-bottom: 10px;
  height: 1px;
  background: #bdbdbd;
`;

const Content = styled.div`
  margin-top: 4px;
  width: 233px;
`;

const NoneGroup = styled.div`
  margin-top: 8px;
  width: 223px;
  height: 38px;
  display: flex;
  align-items: center;
  padding-left: 10px;
  font-size: 14px;
  /* background: #eceff1; */

  border-radius: 4px;
  cursor: pointer;
`;

const ItemTitle = styled.div`
  border-radius: 5px;
  width: 223px;
  height: 38px;
  padding-left: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* background: rgb(232, 238, 251); */

  svg {
    margin-right: 8px;
  }
`;

const ButtonWrapper = styled.div``;

const Button = styled.button`
  border: none;
  outline: none;
  width: 233px;
  height: 38px;
  display: flex;
  background: transparent;
  padding-left: 10px;
  display: flex;
  align-items: center;

  border-radius: 5px;
  cursor: pointer;
`;

const BorderRight = styled.div`
  height: calc(100% - 32px);
  width: 1px;
  background: #bdbdbd;
  margin-top: 16px;
  margin-bottom: 16px;
`;

export default GroupList;
