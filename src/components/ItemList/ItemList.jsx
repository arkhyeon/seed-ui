import React, { useState, useCallback, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import Head from './Head';
import Item from './Item';

/**
 * @param {String} props.title
 * Itemlist 컴포넌트의 제목 (최상단에 표시 됨)
 * default 값은 '제목'
 * @param {Object []} props.itemList
 * 나열될 항목
 * Object의 형태는 {id: Number, value: String}
 * default 값은 [{ id: 1, value: 'item_1' }]
 * @param {Function} props.click
 * 항목 눌렀을 경우 실행될 함수
 * 해당 함수는 첫 번째 인자로 항목의 id 값을 받음
 * default 값은 null
 * @returns {JSX.Element} ItemList Component
 */

function ItemList({ title = '제목', itemList = [{ id: 1, value: 'item_1' }], click = null }) {
  const [isShow, setIsShow] = useState(true);
  const itemListRef = useRef(null);
  const containerRef = useRef(null);
  const [selected, setSelected] = useState(-1);

  const handleShow = useCallback(() => {
    setIsShow(!isShow);
  }, [isShow]);

  const handleSelect = useCallback(
    idx => {
      setSelected(idx);
    },
    [setSelected],
  );

  const renderItem = useCallback(() => {
    return itemList.map((el, idx) => (
      <Item
        key={`item-${el.value}`}
        idx={idx}
        handleSelect={handleSelect}
        selected={selected}
        id={el.id}
        click={click}
      >
        {el.value}
      </Item>
    ));
  }, [itemList, handleSelect, selected, click]);

  useEffect(() => {
    if (isShow) {
      itemListRef.current.classList.remove('close');
      containerRef.current.style.width = '220px';
    } else {
      itemListRef.current.classList.add('close');
      containerRef.current.style.width = '30px';
    }
  }, [isShow]);

  return (
    <Container ref={containerRef}>
      <Wrapper ref={itemListRef}>
        <Head title={title} handleShow={handleShow} />
        <DividingLine />
        <Content>{renderItem()}</Content>
      </Wrapper>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  background: white;
  height: 100%;
  width: 220px;
  overflow: hidden;
  transition: 0.4s;
  .close {
    transform: translate(-190px, 0);
    transition: 0.4s;
  }
`;

const Wrapper = styled.div`
  position: absolute;
  background: white;
  height: 100%;
  width: 220px;
  transition: 0.4s;
`;

const DividingLine = styled.div`
  width: 155px;
  height: 2px;
  background: black;
  margin-left: auto;
  margin-right: auto;
`;

const Content = styled.div`
  margin-top: 10px;
  .selected {
    background: rgb(232, 240, 254);
    color: rgb(66, 130, 219);
    :hover {
      background: rgb(232, 240, 254);
      color: rgb(66, 130, 219);
    }
  }
`;

export default ItemList;
