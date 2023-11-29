import React, { useState } from 'react';
import OptionCard from './Card/OptionCard/OptionCard';

function Testing() {
  const [state, setState] = useState([
    {
      key: 'use_approval',
      val: 'n',
    },
    {
      key: 'use_meta',
      val: 'y',
    },
    {
      key: 'use_separate_server',
      val: 'n',
    },
    {
      key: 'tsmc',
      val: 5,
    },
  ]);
  return (
    <>
      {state.map(opt => (
        <OptionCard key={opt.key} config={CONFIG[opt.key]} option={opt} setOption={setState} />
      ))}
      <button onClick={() => console.log(state)}>저장</button>
    </>
  );
}

export default Testing;

const CONFIG = {
  use_approval: {
    name: '결재',
    desc: 'CLM 결재 기능을 사용합니다.',
    type: 'DataList',
    valueList: ['y', 'n'],
    labelList: ['사용', '사용 안함'],
  },
  tsmc: {
    name: 'tsmc',
    desc: 'CLM 결재 기능을 사용합니다.',
    type: 'Count',
  },
  use_meta: {
    name: '서비스 - 메타 시스템',
    desc: 'CLM 메타 시스템 서비스를 사용합니다.',
    type: 'DataList',
    valueList: ['y', 'n'],
    labelList: ['사용', '사용 안함'],
  },
  use_separate_server: {
    name: '서비스 - 분리보관 조회',
    desc: 'CLM 분리보관 조회 서비스를 사용합니다.',
    type: 'DataList',
    valueList: ['y', 'n'],
    labelList: ['사용', '사용 안함'],
  },
  use_file_trans: {
    name: '업무 - 파일이관',
    desc: 'CLM 파일이관 업무를 사용합니다.',
    type: 'DataList',
    valueList: ['y', 'n'],
    labelList: ['사용', '사용 안함'],
  },
  use_fkey: {
    name: '업무 - FK',
    desc: 'CLM FK 업무를 사용합니다.',
    type: 'DataList',
    valueList: ['y', 'n'],
    labelList: ['사용', '사용 안함'],
  },
  use_pkey: {
    name: '업무 맵 설정 - PK',
    desc: '업무 맵 설정 화면에서 PK 기능을 사용합니다.',
    type: 'DataList',
    valueList: ['y', 'n'],
    labelList: ['사용', '사용 안함'],
  },
  verify_method_id: {
    name: '거래 종료 추출 검증 기준',
    desc: '거래 종료 된 고객 및 계약 번호를 검증할 기준을 설정합니다.',
    type: 'DataList',
    valueList: ['p', 'ps', 'pse'],
    labelList: ['고객 번호', '고객 & 계약 번호', '고객 & 계약 번호 & 만료일'],
  },
  customer_code: {
    name: '고객사 번호',
    desc: '지정된 고객사 번호를 입력해주세요.',
    type: 'TextInput',
  },
  pwd_weight: {
    name: '?',
    desc: '?',
    type: 'TextInput',
  },
};
