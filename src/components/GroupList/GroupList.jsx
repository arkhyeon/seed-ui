import React, { useState, useCallback, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';
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
 * @returns {JSX.Element} GroupList Component
 */

function GroupList({
  unit = '유닛',
  groupList = [{ id: 1, value: 'item_1', cnt: 3 }],
  buttonList = ['설정'],
  clickCreate = null,
  clickGroup = id => console.log(id),
  clickMenu = id => console.log(id),
}) {
  // const [isShow, setIsShow] = useState(true);
  const itemListRef = useRef(null);
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const menusRef = useRef([]);
  const [selected, setSelected] = useState(-1);
  const [isItemOpen, setIsItemOpen] = useState(false);

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
    if (selected >= 1 && selected <= groupList.length + 1) {
      titleRef.current.style.background = 'rgb(232, 238, 251)';
    } else {
      titleRef.current.style.background = 'transparent';
    }

    for (let i = 0; i < menusRef.current.length; i++) {
      if (!menusRef.current[i]) {
        continue;
      }

      if (i === selected) {
        menusRef.current[i].classList.add('selected');
      } else {
        menusRef.current[i].classList.remove('selected');
      }
    }
  }, [selected, groupList]);

  useEffect(() => {
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
      />
    ));
  }, [groupList, handleSelect, selected, clickGroup]);

  // useEffect(() => {
  //   if (isShow) {
  //     itemListRef.current.classList.remove('close');
  //     containerRef.current.style.width = '220px';
  //   } else {
  //     itemListRef.current.classList.add('close');
  //     containerRef.current.style.width = '30px';
  //   }
  // }, [isShow]);

  const handleItem = useCallback(() => {
    setIsItemOpen(!isItemOpen);
  }, [isItemOpen]);

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
    <Container ref={containerRef}>
      <Wrapper ref={itemListRef}>
        <CreateBtn clickCreate={clickCreate} unit={unit} />
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
          <ItemTitle onClick={handleItem} ref={titleRef}>
            <div>그룹</div>
            {isItemOpen ? <AiOutlineUp /> : <AiOutlineDown />}
          </ItemTitle>
          {isItemOpen && renderItem()}
        </Content>
        <DividingLine />
        <ButtonWrapper>{renderBtns()}</ButtonWrapper>
      </Wrapper>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  background: white;
  height: 100%;
  width: 260px;
  /* overflow: hidden;
  transition: 0.4s; */
  /* .close {
    transform: translate(-190px, 0);
    transition: 0.4s;
  } */
  border-right: 1px solid #eee;

  .selected {
    background: rgb(33, 37, 41);
    color: #eee;

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
`;

const Wrapper = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  transition: 0.4s;
  padding: 10px 8px;
`;

const DividingLine = styled.div`
  margin-top: 8px;
  width: calc(100% - 16px);
  height: 1px;
  background: #d2d2d2;
`;

const Content = styled.div`
  margin-top: 4px;
`;

const NoneGroup = styled.div`
  margin-top: 8px;
  width: calc(100% - 28px);
  padding-left: 12px;
  padding-top: 4px;
  padding-bottom: 4px;
  border-radius: 5px;
  cursor: pointer;
`;

const ItemTitle = styled.div`
  padding-left: 12px;
  padding-top: 4px;
  padding-bottom: 4px;
  border-radius: 5px;
  cursor: pointer;
  width: calc(100% - 28px);
  display: flex;
  align-items: center;
  justify-content: space-between;

  svg {
    margin-right: 8px;
  }
`;

const ButtonWrapper = styled.div`
  margin-top: 15px;
`;

const Button = styled.button`
  border: none;
  outline: none;
  width: calc(100% - 16px);
  display: flex;
  background: transparent;
  padding-left: 12px;
  padding-top: 4px;
  padding-bottom: 4px;
  border-radius: 5px;
  cursor: pointer;
`;

export default GroupList;
