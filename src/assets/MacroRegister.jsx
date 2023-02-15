import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { AiOutlineArrowDown, BsArrowUpShort } from 'react-icons/all';
import Card from '../components/Card/Card/Card';
import { BlackButton, RadioButton } from '../components';
import DNDWrapper from '../FuntionalComponent/dnd/DNDWrapper';

const as = {
  step: [
    {
      sname: '추출',
      seq: 1,
    },
    {
      sname: '이관 1',
      seq: 2,
    },
    {
      sname: '이관 2',
      seq: 3,
    },
    {
      sname: '삭제 1',
      seq: 4,
    },
    {
      sname: '삭제 2',
      seq: 5,
    },
  ],
};

function MacroRegister() {
  const { pathname } = useLocation();
  const [stepList, setStepList] = useState([]);

  useEffect(() => {
    setStepList(as.step);
  }, []);

  const [workGroupList, setWorkGroupList] = useState([
    {
      wid: 0,
      h: '업무그룹1',
      seq: 1,
      date: '2022-12-09 12:32:54',
      b: [
        { name: '프로젝트1', date: '2022-12-09 12:32:54' },
        { name: '프로젝트2', date: '2022-12-09 12:32:54' },
        { name: '프로젝트3', date: '2022-12-09 12:32:54' },
        { name: '프로젝트4', date: '2022-12-09 12:32:54' },
        { name: '프로젝트5', date: '2022-12-09 12:32:54' },
        { name: '프로젝트6', date: '2022-12-09 12:32:54' },
        { name: '프로젝트7', date: '2022-12-09 12:32:54' },
        { name: '프로젝트8', date: '2022-12-09 12:32:54' },
      ],
    },
    {
      wid: 1,
      h: '업무그룹2',
      seq: 2,
      date: '2022-12-09 12:32:54',
      b: [
        { name: '프로젝트1', date: '2022-12-09 12:32:54' },
        { name: '프로젝트2', date: '2022-12-09 12:32:54' },
        { name: '프로젝트3', date: '2022-12-09 12:32:54' },
        { name: '프로젝트4', date: '2022-12-09 12:32:54' },
      ],
    },
    {
      wid: 2,
      h: '업무그룹3',
      seq: 3,
      date: '2022-12-09 12:32:54',
      b: [
        { name: '프로젝트1', date: '2022-12-09 12:32:54' },
        { name: '프로젝트2', date: '2022-12-09 12:32:54' },
        { name: '프로젝트3', date: '2022-12-09 12:32:54' },
        { name: '프로젝트4', date: '2022-12-09 12:32:54' },
      ],
    },
    {
      wid: 3,
      h: '업무그룹4',
      seq: 4,
      date: '2022-12-09 12:32:54',
      b: [
        { name: '프로젝트1', date: '2022-12-09 12:32:54' },
        { name: '프로젝트2', date: '2022-12-09 12:32:54' },
        { name: '프로젝트3', date: '2022-12-09 12:32:54' },
        { name: '프로젝트4', date: '2022-12-09 12:32:54' },
        { name: '프로젝트5', date: '2022-12-09 12:32:54' },
      ],
    },
    {
      wid: 4,
      h: '업무그룹5',
      seq: 5,
      date: '2022-12-09 12:32:54',
      b: [
        { name: '프로젝트1', date: '2022-12-09 12:32:54' },
        { name: '프로젝트2', date: '2022-12-09 12:32:54' },
        { name: '프로젝트3', date: '2022-12-09 12:32:54' },
        { name: '프로젝트4', date: '2022-12-09 12:32:54' },
        { name: '프로젝트5', date: '2022-12-09 12:32:54' },
      ],
    },
    {
      wid: 5,
      h: '업무그룹6',
      seq: 5,
      date: '2022-12-09 12:32:54',
      b: [
        { name: '프로젝트1', date: '2022-12-09 12:32:54' },
        { name: '프로젝트2', date: '2022-12-09 12:32:54' },
        { name: '프로젝트3', date: '2022-12-09 12:32:54' },
        { name: '프로젝트4', date: '2022-12-09 12:32:54' },
        { name: '프로젝트5', date: '2022-12-09 12:32:54' },
      ],
    },
    {
      wid: 6,
      h: '업무그룹7',
      seq: 5,
      date: '2022-12-09 12:32:54',
      b: [
        { name: '프로젝트1', date: '2022-12-09 12:32:54' },
        { name: '프로젝트2', date: '2022-12-09 12:32:54' },
        { name: '프로젝트3', date: '2022-12-09 12:32:54' },
        { name: '프로젝트4', date: '2022-12-09 12:32:54' },
        { name: '프로젝트5', date: '2022-12-09 12:32:54' },
      ],
    },
    {
      wid: 7,
      h: '업무그룹8',
      seq: 5,
      date: '2022-12-09 12:32:54',
      b: [
        { name: '프로젝트1', date: '2022-12-09 12:32:54' },
        { name: '프로젝트2', date: '2022-12-09 12:32:54' },
        { name: '프로젝트3', date: '2022-12-09 12:32:54' },
        { name: '프로젝트4', date: '2022-12-09 12:32:54' },
        { name: '프로젝트5', date: '2022-12-09 12:32:54' },
      ],
    },
    {
      wid: 8,
      h: '업무그룹9',
      seq: 5,
      date: '2022-12-09 12:32:54',
      b: [
        { name: '프로젝트1', date: '2022-12-09 12:32:54' },
        { name: '프로젝트2', date: '2022-12-09 12:32:54' },
        { name: '프로젝트3', date: '2022-12-09 12:32:54' },
        { name: '프로젝트4', date: '2022-12-09 12:32:54' },
        { name: '프로젝트5', date: '2022-12-09 12:32:54' },
      ],
    },
  ]);

  const [allCollapse, setAllCollapse] = useState(false);

  return (
    <MRWrap>
      <RadioButton
        valueList={['SSH', 'Telnet', 'RCS']}
        labelList={[<AiOutlineArrowDown />, 'a', 'b']}
        defaultValue="SSH"
      />
      <BlackButton
        onClick={() =>
          setAllCollapse(prevState => {
            return !prevState;
          })
        }
      >
        {allCollapse ? '전체 펼치기' : '전체 접기'}
      </BlackButton>
      {stepList.map((step, index) => {
        const { seq, sname } = step;
        return (
          <DNDWrapper key={seq} seq={index} itemList={stepList} setItemList={setStepList} isDrag>
            <Circle>
              {seq}
              {sname}
            </Circle>
          </DNDWrapper>
        );
      })}
      {/* {workGroupList.map(workGroup => { */}
      {/*  const { wid, h, date, b } = workGroup; */}
      {/*  return ( */}
      {/*    <Card key={wid} width={370} height={280}> */}
      {/*      <Card.Header> */}
      {/*        <TitleWrapper> */}
      {/*          {h} */}
      {/*          <span>{date}</span> */}
      {/*        </TitleWrapper> */}
      {/*      </Card.Header> */}
      {/*      <Card.Body> */}
      {/*        <WGCardTextWrap> */}
      {/*          {b.map(work => { */}
      {/*            return ( */}
      {/*              <WGCardText key={work.name}> */}
      {/*                <p>{work.name}</p> */}
      {/*                <p>{work.date}</p> */}
      {/*              </WGCardText> */}
      {/*            ); */}
      {/*          })} */}
      {/*        </WGCardTextWrap> */}
      {/*      </Card.Body> */}
      {/*    </Card> */}
      {/*  ); */}
      {/* })} */}
    </MRWrap>
  );
}

const MRWrap = styled.div`
  //width: 100%;
  //padding: 15px;
  //box-sizing: border-box;
  //display: flex;
  ////flex-wrap: wrap;
  //justify-content: center;
  //gap: 20px;
`;

const WGCardTextWrap = styled.div`
  overflow-y: auto;
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

const TitleWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;

  span {
    font-weight: normal;
    font-size: 14px;
  }
`;

const WGCardText = styled.div`
  height: 40px;
  padding: 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px dashed #e0e0e0;

  & p {
    font-size: 13px;
  }
`;

const Circle = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 100%;
  background-color: darkgreen;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
`;

export default MacroRegister;
