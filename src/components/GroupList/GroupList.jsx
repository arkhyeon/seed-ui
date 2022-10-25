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
 * @returns {JSX.Element} GroupList Component
 */

function GroupList({
  unit = '유닛',
  groupList = [{ id: 1, value: 'item_1', cnt: 3 }],
  buttonList = ['설정'],
  clickCreate = () => console.log('생성 버튼'),
  clickGroup = id => console.log(id),
  clickMenu = id => console.log(id),
  clickModify = id => console.log(id),
  clickDelete = id => console.log(id),
  changeGroup = gname => console.log(gname),
  selectedGroupName = '',
}) {
  // const [isShow, setIsShow] = useState(true);
  const itemListRef = useRef(null);
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const menusRef = useRef([]);
  const [selected, setSelected] = useState(0);
  // const [isItemOpen, setIsItemOpen] = useState(false);

  // const handleShow = useCallback(() => {
  //   setIsShow(!isShow);
  // }, [isShow]);

  const handleSelect = useCallback(
    idx => {
      setSelected(idx);
    },
    [setSelected],
  );

  useEffect(() => {
    if (selectedGroupName === '') {
      return;
    }

    menusRef.current.forEach((el, idx) => {
      if (el.dataset.gname === selectedGroupName) {
        setSelected(idx);
      }
    });
  }, [selectedGroupName]);

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

  useEffect(() => {
    if (selected === -1) {
      return;
    }

    if (selected >= 1 && selected <= groupList.length) {
      return;
    }
    clickMenu(selected);
  }, [selected, clickMenu, groupList]);

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
            onClick={() => handleSelect(groupList.length + idx + 2)}
            ref={el => {
              menusRef.current[groupList.length + 2] = el;
            }}
          >
            {el}
          </Button>
        ))}
      </>
    );
  }, [buttonList, handleSelect, groupList.length]);

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <Container ref={containerRef}>
        <Wrapper ref={itemListRef}>
          <CreateBtn clickCreate={clickCreate} unit={unit} setSelected={setSelected} />
          <DividingLine />
          <NoneGroup
            onClick={() => handleSelect(0)}
            ref={el => {
              menusRef.current[0] = el;
            }}
          >
            미지정 그룹
          </NoneGroup>
          <Content>
            <ItemTitle
              // onClick={handleItem}
              ref={titleRef}
            >
              <div>그룹</div>
              {/* {isItemOpen ? <AiOutlineUp /> : <AiOutlineDown />} */}
            </ItemTitle>
            {/* {isItemOpen && renderItem()} */}
            {renderItem()}
          </Content>
          <DividingLine />
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
