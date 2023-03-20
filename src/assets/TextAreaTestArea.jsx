import React from 'react';
import { MdOutlineContentCopy, MdOutlineContentPaste } from 'react-icons/md';
import { CgList } from 'react-icons/cg';
import { BiPlus } from 'react-icons/bi';
import styled from '@emotion/styled';
import CustomTextArea from '../components/InputComp/CustomTextArea';

export default function TextAreaTestArea() {
  const copy = () => {
    alert('복사 하였습니다.');
  };
  const paste = () => {
    alert('복사 하였습니다.');
  };
  const cgList = () => {
    alert('CgList');
  };
  const add = () => {
    alert('추가');
  };

  const exampleIconMenu = [
    {
      icon: <MdOutlineContentCopy />,
      handler: copy,
    },
    {
      icon: <MdOutlineContentPaste />,
      handler: paste,
    },
    {
      icon: <CgList />,
      handler: cgList,
    },
    {
      icon: <BiPlus />,
      handler: add,
    },
  ];
  const exampleTextMenu = [
    {
      text: '버튼1',
      handler: copy,
    },
    {
      text: '버튼2',
      handler: paste,
    },
    {
      text: '버튼3',
      handler: cgList,
    },
    {
      text: '버튼4',
      handler: add,
    },
  ];

  return (
    <>
      <AccordionWrap>
        <CustomTextArea
          title="제목만 있는 텍스트 에리어"
          textAreaOption={{
            value: 'text',
            readOnly: true,
            rows: 15,
            height: '200px',
          }}
        />
        <CustomTextArea
          title="텍스트 버튼들이 있는 텍스트 에리어"
          textAreaOption={{
            value: '테스트',
            readOnly: true,
            rows: 15,
            height: '200px',
          }}
          TextButtonList={exampleTextMenu}
        />
      </AccordionWrap>
      <AccordionWrap>
        <CustomTextArea
          title="아이콘 버튼들이 있는 텍스트 에리어"
          textAreaOption={{
            value: 'text',
            readOnly: true,
            rows: 15,
          }}
          IconButtonList={exampleIconMenu}
        />
        <CustomTextArea
          title="텍스트 버튼들이 있는 텍스트 에리어"
          textAreaOption={{
            value: '테스트',
            readOnly: true,
            rows: 15,
          }}
          TextButtonList={exampleTextMenu}
        />
      </AccordionWrap>
      <AccordionWrap>
        <CustomTextArea
          title="제목만 있는 텍스트 에리어"
          textAreaOption={{
            value: '테스트',
            readOnly: true,
            rows: 10,
          }}
        />
        <CustomTextArea
          title="아이콘 버튼들이 있는 텍스트 에리어"
          textAreaOption={{
            value: 'text',
            readOnly: true,
            rows: 10,
          }}
          IconButtonList={exampleIconMenu}
        />
      </AccordionWrap>
      <AccordionWrap>
        <CustomTextArea
          title="아이콘 버튼들이 있는 SQL 에리어"
          sqlAreaOption={{
            value: 'text',
            readOnly: true,
            height: '100px',
          }}
          IconButtonList={exampleIconMenu}
        />
      </AccordionWrap>
      <AccordionWrap>
        <CustomTextArea
          title="제목만 있는 텍스트 에리어"
          textAreaOption={{
            value: '테스트',
            readOnly: true,
            rows: 15,
          }}
        />
        <CustomTextArea
          title="아이콘 버튼들이 있는 SQL 에리어"
          sqlAreaOption={{
            value: 'text',
            readOnly: true,
            rows: 15,
            height: '100px',
          }}
          IconButtonList={exampleIconMenu}
        />
      </AccordionWrap>
    </>
  );
}
const AccordionWrap = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 10px;
  box-sizing: border-box;
`;
