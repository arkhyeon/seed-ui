import React from 'react';
import {
  DividingLine,
  MainTabButton,
  SideScrollWrap,
  SideTabs,
  TabButton,
} from '../components/SideTabs/SideTabs';
import styled from '@emotion/styled';

function Project() {
  const data2 = [
    'Andi',
    'Stern',
    'Andrea',
    'Ezra',
    'Romy',
    'Shaw',
    'Derek',
    'Yvonne',
    'Nils',
    'Janeen',
  ];

  const data1 = [
    {
      gid: 1,
      gname: 'group2',
      notes: null,
    },
    {
      gid: 2,
      gname: 'group1',
      notes: null,
    },
    {
      gid: 3,
      gname: 'group2',
      notes: null,
    },
    {
      gid: 4,
      gname: 'group1',
      notes: null,
    },
    {
      gid: 5,
      gname: 'group2',
      notes: null,
    },
  ];

  const data = [
    {
      gid: 1,
      gname: 'group2',
      notes: null,
    },
    {
      gid: 2,
      gname: 'group1',
      notes: null,
    },
    {
      gid: 3,
      gname: 'group2',
      notes: null,
    },
    {
      gid: 4,
      gname: 'group1',
      notes: null,
    },
    {
      gid: 5,
      gname: 'group2',
      notes: null,
    },
    {
      gid: 6,
      gname: 'group1',
      notes: null,
    },
    {
      gid: 7,
      gname: 'group2',
      notes: null,
    },
    {
      gid: 8,
      gname: 'group1',
      notes: null,
    },
    {
      gid: 9,
      gname: 'group2',
      notes: null,
    },
    {
      gid: 10,
      gname: 'group1',
      notes: null,
    },
    {
      gid: 11,
      gname: 'group2',
      notes: null,
    },
    {
      gid: 12,
      gname: 'group1',
      notes: null,
    },
    {
      gid: 13,
      gname: 'group2',
      notes: null,
    },
    {
      gid: 14,
      gname: 'group1',
      notes: null,
    },
    {
      gid: 15,
      gname: 'group2',
      notes: null,
    },
    {
      gid: 16,
      gname: 'group1',
      notes: null,
    },
    {
      gid: 17,
      gname: 'group2',
      notes: null,
    },
    {
      gid: 18,
      gname: 'group1',
      notes: null,
    },
    {
      gid: 19,
      gname: 'group2',
      notes: null,
    },
    {
      gid: 20,
      gname: 'group1',
      notes: null,
    },
  ];

  return (
    <Wrap>
      <Wrapper>
        <SideTabs>
          <MainTabButton
            onClick={() => {
              console.log('main');
            }}
          >
            메인버튼
          </MainTabButton>
          <DividingLine />
          <SideScrollWrap>
            <TabButton
              onClick={() => {
                console.log('전체 사용자');
              }}
            >
              전체 사용자
            </TabButton>
            {data.map((obj, index) => {
              return (
                <TabButton
                  key={obj.gid + index}
                  onClick={() => {
                    console.log(obj.gid);
                  }}
                  updateFunction={() => console.log('a')}
                >
                  {obj.gname}
                </TabButton>
              );
            })}
          </SideScrollWrap>
          <DividingLine />
          <TabButton
            onClick={() => {
              console.log('설정');
            }}
          >
            설정
          </TabButton>
          <TabButton
            onClick={() => {
              console.log('설정');
            }}
          >
            앤헤서
          </TabButton>
        </SideTabs>
      </Wrapper>
      <Wrapper>
        <SideTabs>
          <MainTabButton
            onClick={() => {
              console.log('main');
            }}
          >
            메인버튼
          </MainTabButton>
          <DividingLine />
          <SideScrollWrap>
            <TabButton
              onClick={() => {
                console.log('전체 사용자');
              }}
            >
              전체 사용자
            </TabButton>
            {data1.map((obj, index) => {
              return (
                <TabButton
                  key={obj.gid + index}
                  onClick={() => {
                    console.log(obj.gid);
                  }}
                  deleteFunction={() => {
                    console.log('a');
                  }}
                >
                  {obj.gname}
                </TabButton>
              );
            })}
          </SideScrollWrap>
          <DividingLine />
          <TabButton
            onClick={() => {
              console.log('설정');
            }}
          >
            설정
          </TabButton>
          <TabButton
            onClick={() => {
              console.log('설정');
            }}
          >
            앤헤서
          </TabButton>
        </SideTabs>
      </Wrapper>
    </Wrap>
  );
}

export default Project;

const Wrap = styled.div`
  display: flex;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 720px;
  margin: 16px 0;
`;
