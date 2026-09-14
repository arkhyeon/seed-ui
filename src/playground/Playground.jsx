import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { BlackButton, WhiteButton, RadioButton, SwitchButton } from '../components/Button/Button';
import Radio from '../components/Radio';
import Switch from '../components/Switch';
import Toggle from '../components/Toggle';
import { TextInput, PasswordInput, LabelCheckBox } from '../components/InputComp/InputComponent';
import Count from '../components/Count/Count';
import Tooltip from '../components/Tooltip';
import HelpIcon from '../components/HelpIcon';
import Pagination from '../components/InputComp/Pagination';
import { Accordion } from '../components/Accordion/Accordion';
import DividingLine from '../components/Line/DividingLine';
import Card from '../components/Card/Card/Card';
import Slider from '../components/Slider';
import DatePicker from '../components/DateTime/DatePicker';
import RangeDatePicker from '../components/DateTime/RangeDatePicker';
import TimePicker from '../components/DateTime/TimePicker';
import Modal from '../components/Modal';
import DataList from '../components/InputComp/DataList';
import CustomTextArea from '../components/InputComp/CustomTextArea';
import InputGrid from '../components/InputGrid';
import Counter from '../components/Counter/Counter';
import CountList from '../components/CountList/CountList';
import LabelList from '../components/LabelList/LabelList';
import Article from '../components/Article';
import {
  SideTabs,
  MainTabButton,
  TabButton,
  SideScrollWrap,
  selectSideTab,
} from '../components/SideTabs/SideTabs';
import DNDWrapper from '../FuntionalComponent/dnd/DNDWrapper';
import HeaderCreator from '../components/Menu/HeaderCreator';
import AsideCreator from '../components/Menu/AsideCreator';
import OptionCard from '../components/Card/OptionCard/OptionCard';
import ToastNotify from '../components/Notify/ToastNotify';
import { CLM } from '../R2wZustand';

/**
 * seed-ui 컴포넌트 플레이그라운드.
 * story = { category, name, controls[], initialState?, render(props,{state,setState}), snippet(props) }
 * controls 타입: boolean | select | text | number | color | json
 * - 활성 컴포넌트는 URL(/playground/:name)로 관리되어 새로고침해도 유지된다.
 * - json 컨트롤: 값을 JSON 문자열로 편집 → render에서 parseJson으로 파싱.
 */

const parseJson = (str, fallback) => {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
};

// 순서가 실제로 바뀔 때만 반영해 불필요한 리렌더를 막는다.
const sameOrder = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);

// 컨트롤 key별 공통 설명(HelpIcon). 특정 story에서 control.desc로 덮어쓸 수 있다.
const COMMON_DESC = {
  disabled: '비활성화 — true면 클릭·입력이 막히고 흐리게 표시됩니다.',
  placeholder: '값이 비었을 때 흐리게 보이는 안내 문구입니다.',
  maxLength: '입력 가능한 최대 글자 수입니다.',
  children: '요소 안에 들어갈 내용(텍스트)입니다.',
  label: '옆에 표시되는 라벨 텍스트입니다.',
  text: '표시할 텍스트입니다.',
  title: '제목으로 표시될 텍스트입니다.',
  color: '색상(또는 색상 테마)을 지정합니다.',
  size: '컴포넌트 크기입니다.',
  type: '형태·스타일 종류입니다. 아래 값 중 하나를 선택하세요.',
  direction: '펼쳐지거나 항목이 배치되는 방향입니다.',
  position: '화면에서 표시되는 위치입니다.',
  width: '너비입니다 (예: 400px).',
  height: '높이입니다 (예: 200px).',
  min: '허용되는 최소값입니다.',
  max: '허용되는 최대값입니다.',
  required: '필수 입력 표시(*)를 켭니다.',
  location: '테두리를 표시할 위치입니다.',
  contentPadding: '내용 영역의 우측 여백입니다.',
  itemHeight: '항목 하나의 높이(px)입니다.',
  totalLength: '페이지네이션이 계산할 전체 데이터 개수입니다.',
  buttonLength: '한 번에 보여줄 페이지 번호 버튼 개수입니다.',
  autoPlay: '자동 재생 여부입니다.',
  autoTime: '자동으로 넘어가는 간격(ms)입니다.',
  unit: '개수 뒤에 붙는 단위 텍스트입니다.',
  allowPast: '과거 날짜 선택을 허용합니다.',
  allowFuture: '미래 날짜 선택을 허용합니다.',
  startDate: '선택 가능한 가장 이른 날짜(YYYY-MM-DD)입니다.',
  endDate: '선택 가능한 가장 늦은 날짜(YYYY-MM-DD)입니다.',
  useTime: '시작/종료 "시간" 입력칸을 추가합니다.',
  useApply: '"적용" 버튼을 눌러 확정하는 방식으로 동작합니다.',
  targetValue: '목표 숫자 — 0에서 이 값까지 카운트업합니다.',
  time: '숫자가 1씩 오르는 간격(ms)입니다. 작을수록 빠릅니다.',
  checkColor: '선택됐을 때 체크 표시 색입니다.',
  hoverColor: '마우스를 올렸을 때 뒤에 생기는 원의 색입니다.',
  labelInSpacing: '체크와 글자 사이 간격입니다.',
  labelOutSpacing: '옵션들 사이의 간격입니다.',
  name: '알림 종류입니다 (성공/에러/경고/안내).',
  timeLimit: '알림이 화면에 떠 있는 시간(ms)입니다.',
  modalTitle: '모달 상단에 표시될 제목입니다.',
  movable: '헤더를 잡고 드래그해 모달을 이동할 수 있습니다.',
  isCloseBtn: '우상단 닫기(X) 버튼을 표시합니다.',
  isDrag: '드래그로 순서 변경이 가능한지 여부입니다.',
  tabCount: '데모로 만들 탭 버튼 개수입니다.',
  select: 'true면 드롭다운 선택형, false면 입력+필터형으로 동작합니다.',
  valueList: '선택지의 실제 값 목록입니다 (JSON 배열).',
  labelList: '값 대신 보여줄 라벨 목록입니다. 비우면 값을 그대로 표시합니다.',
  list: '표시할 항목 목록입니다 (JSON).',
  role: "접근 권한 — 'y'는 전체 노출, 'n'은 menuRole>0 이거나 isPublic인 항목만 노출합니다.",
  useDepth: '상단 메뉴의 하위(Depth) 서브메뉴 펼침 기능을 켭니다.',
  menuList:
    '메뉴 구조(JSON)입니다. 각 항목의 title·link·menuRole·display·isPublic·subMenu 등을 직접 편집해 동작을 바꿀 수 있습니다.',
  logo: '로고 자리에 표시할 텍스트입니다.',
  logoLink: '로고 클릭 시 이동할 경로입니다.',
  showChildren: '헤더 우측 children 영역(위젯 등)을 표시합니다.',
  allCollapse: '카드 본문을 접힌 상태로 시작합니다.',
  focusOn: '렌더되자마자 자동으로 포커스를 줍니다.',
  mode: 'textarea는 일반 입력, sql은 코드(SQL) 에디터로 렌더합니다.',
  message: '아이콘에 마우스를 올리면 뜨는 도움말 내용입니다.',
};

// 본 프로젝트(CLM30)에서의 실제 사용 예 (컴포넌트 이름 → { file, code }).
// story.realUsage가 있으면 그게 우선.
const REAL_USAGE = {
  BlackButton: {
    file: 'components/ExcelButton.jsx',
    code: `import { BlackButton } from 'seed-ui';

// 다운로드 버튼 (진행 중이면 로딩 표시)
<BlackButton onClick={handleFileDownload} disabled={pending}>
  {pending ? <Loading /> : '다운로드'}
</BlackButton>`,
  },
  WhiteButton: {
    file: 'components/LogModal.jsx',
    code: `import { WhiteButton } from 'seed-ui';

// 모달 하단 버튼 목록에 사용
buttonList={[<WhiteButton onClick={handleClose}>닫기</WhiteButton>]}`,
  },
  SwitchButton: {
    file: 'page/project/project/Comp/ProjectRegisterPageStep.jsx',
    code: `import { SwitchButton } from 'seed-ui';

// 스텝 활성/비활성 토글
<SwitchButton
  id={projectStep.sno}
  value={projectStep.active_yn}
  checked={projectStep.active_yn === 'y'}
  onChange={() => handleSwitchOnChange(projectStep.sno)}
/>`,
  },
  Radio: {
    file: 'page/approval/ApprovalInfo/Comps/ApprovalRegister.jsx',
    code: `import { Radio } from 'seed-ui';

// 결재자 선택 타입
<Radio
  checkColor="rgb(64, 64, 64)"
  value={selectedApprovalGroupInfo.aprv_user_type}
  setValue={value => handleChange('aprv_user_type', value)}
/>`,
  },
  Toggle: {
    file: 'page/management/SettingDbms.jsx',
    code: `import { Toggle } from 'seed-ui';

<Toggle list={['Oracle', 'Tibero']} value={dbmsType} setValue={setDbmsType} />`,
  },
  TextInput: {
    file: 'page/approval/ApprovalInfo/modal/ApprovalRequestCancelModal.jsx',
    code: `import { TextInput } from 'seed-ui';

// InputGrid 내용으로, 읽기전용
content: <TextInput value={selectedApproval.title} readOnly />`,
  },
  PasswordInput: {
    file: 'page/management/dbmsManagement/ChangePasswordModal.jsx',
    code: `import { PasswordInput } from 'seed-ui';

content: <PasswordInput name="pwd" onChange={changePwd} />`,
  },
  LabelCheckBox: {
    file: 'page/login/Login.jsx',
    code: `import { LabelCheckBox } from 'seed-ui';

<LabelCheckBox checked={isRemember} onChange={handleRemember} label="사용자 계정 저장" />`,
  },
  DataList: {
    file: 'page/approval/ApprovalInfo/ApprovalCheck.jsx',
    code: `import { DataList } from 'seed-ui';

// 결재 상태 선택 (값/라벨 분리)
<DataList
  name="aprv_status"
  select
  valueList={['pending', 'rejected', 'inProgress', 'canceled', 'completed']}
  labelList={['미결', '반려', '진행중', '취소', '완료']}
  defaultValue={aprvSearchStatus}
  setData={setAprvSearchStatus}
/>`,
  },
  CustomTextArea: {
    file: 'page/project/project/ProjectStepLog.jsx',
    code: `import { CustomTextArea } from 'seed-ui';

// 읽기전용 상세 로그
<CustomTextArea title="상세 로그" textAreaOption={{ readOnly: true, rows: 13, value: sql }} />`,
  },
  InputGrid: {
    file: 'page/management/clmInfo/ClmServerInfo.jsx',
    code: `import { InputGrid } from 'seed-ui';

// 라벨-내용 행 목록을 그리드로
<InputGrid list={serverInfoList} />`,
  },
  TimePicker: {
    file: 'page/project/project/Modal/ProjectStepActivationStopModal.jsx',
    code: `import { TimePicker } from 'seed-ui';

<TimePicker time={data.etime} onChange={handleTimeChange} disabled={!isCheck} />`,
  },
  DatePicker: {
    file: 'page/management/userGroup/UserManageInfo.jsx',
    code: `import { DatePicker } from 'seed-ui';

// 계정 만료일 (오늘 이후만 선택)
<DatePicker
  date={userInfo.expire_dt}
  setDate={value => handleChange({ name: 'expire_dt', value })}
  startDate={new Date()}
/>`,
  },
  RangeDatePicker: {
    file: 'page/history/project/ProjectCriticalHistory.jsx',
    code: `import { RangeDatePicker } from 'seed-ui';

// 기간 검색 (미래 비허용 + 적용 버튼)
<RangeDatePicker
  startDt={searchInfo.start_d}
  setStartDt={value => handleDateChange({ name: 'start_d', value })}
  endDt={searchInfo.end_d}
  setEndDt={value => handleDateChange({ name: 'end_d', value })}
  allowFuture={false}
  onApply={fetchWholeHistory}
/>`,
  },
  HelpIcon: {
    file: 'page/project/project/Modal/TaskAddOrEditModal.jsx',
    code: `import { HelpIcon } from 'seed-ui';

<HelpIcon message="CMD 작업은 CLM 서버에서 실행합니다." size={13.5} />`,
  },
  Modal: {
    file: 'components/PageTemplate/ModalTemplate.jsx',
    code: `import { Modal } from 'seed-ui';

// 공용 모달 래퍼
<Modal modalTitle={modalTitle} handleClose={handleClose} width={width} buttonList={buttonList}>
  {children}
</Modal>`,
  },
  SideTabs: {
    file: 'page/management/clmInfo/ClmInfo.jsx',
    code: `import { SideTabs, TabIconButton } from 'seed-ui';

<SideTabs>
  <TabIconButton value="server" onClick={() => setToggleValue('server')}>CLM 서버</TabIconButton>
  <TabIconButton value="repository" onClick={() => setToggleValue('repository')}>CLM 레파지토리</TabIconButton>
</SideTabs>`,
  },
  DividingLine: {
    file: 'page/management/userGroup/UserGroupSideTab.jsx',
    code: `import { DividingLine } from 'seed-ui';

// SideTabs 안 구분선
<DividingLine />`,
  },
  Card: {
    file: 'page/work/workGroup/WorkGroupDashBoard.jsx',
    code: `import { Card } from 'seed-ui';

<Card
  width={370}
  height={280}
  allCollapse={allCollapse}
  isAllCollapse={isAllCollapse}
  setIsAllCollapse={setIsAllCollapse}
>
  <Card.Header>{bg_name}</Card.Header>
  <Card.Body>...</Card.Body>
</Card>`,
  },
  LabelList: {
    file: 'page/management/userGroup/UserGroupRole.jsx',
    code: `import { LabelList } from 'seed-ui';

// 데이터베이스 다중 선택
<LabelList
  valueList={serverList.map(sl => sl.server_name)}
  direction="right"
  unit="데이터베이스"
  selectedValueList={servers}
  setSelectedValueList={setServers}
/>`,
  },
  HeaderCreator: {
    file: 'Index.jsx',
    code: `import { HeaderCreator } from 'seed-ui';

<HeaderCreator
  logoSetting={{ logo: <Logo />, logoLink: '/', logoColor: 'white' }}
  menuList={DepthList}
  role={role_a}
>
  <Widget />
</HeaderCreator>`,
  },
  AsideCreator: {
    file: 'components/PageTemplate/PageTemplate.jsx',
    code: `import { AsideCreator } from 'seed-ui';

<AsideCreator
  menuList={mainMenu.subMenu}
  title={subMenu}
  logoSetting={{ logo: <Logo />, logoLink: '/' }}
  role={role_a}
>
  {/* 페이지 내용 */}
</AsideCreator>`,
  },
  DNDWrapper: {
    file: 'page/project/project/Comp/ProjectRegisterPageStep.jsx',
    code: `import { DNDWrapper } from 'seed-ui';

// 프로젝트 스텝 카드 순서 변경
<DNDWrapper
  key={projectStep.seq}
  seq={idx}
  itemList={projectStepList}
  setItemList={setProjectStepList}
  isDrag
>
  <StepCover>...</StepCover>
</DNDWrapper>`,
  },
  OptionCard: {
    file: 'page/setting/SettingContent.jsx',
    code: `import { OptionCard } from 'seed-ui';

// 설정 항목들을 config 기반으로 렌더
{state.map(opt => (
  <OptionCard key={opt.key} config={CONFIG[opt.key]} option={opt} setOption={setState} />
))}`,
  },
};

const TOOLTIP_POSITIONS = [
  'top-start',
  'top-center',
  'top-end',
  'right-start',
  'right-center',
  'right-end',
  'bottom-start',
  'bottom-center',
  'bottom-end',
  'left-start',
  'left-center',
  'left-end',
];

const SAMPLE_MENU_JSON = JSON.stringify(
  [
    { title: '대시보드', link: '/dashboard', isPublic: true },
    {
      title: '작업',
      link: '/work',
      menuRole: 3,
      subMenu: [
        { title: '작업 목록', link: '/work/list', menuRole: 3 },
        { title: '작업 추가', link: '/work/add', menuRole: 1 },
      ],
    },
    {
      title: '설정',
      link: '/config',
      subMenu: [
        { title: '일반 설정', link: '/config/general', menuRole: 3 },
        { title: '보안 설정', link: '/config/security', menuRole: 1 },
        { title: '숨김 메뉴(display:false)', link: '/config/hidden', display: false, menuRole: 3 },
      ],
    },
  ],
  null,
  2,
);

const stories = [
  // ─── Buttons ──────────────────────────────────────────────
  {
    category: 'Buttons',
    name: 'BlackButton',
    controls: [
      { key: 'children', type: 'text', default: '검정 버튼' },
      { key: 'disabled', type: 'boolean', default: false },
    ],
    render: p => (
      <BlackButton disabled={p.disabled} onClick={() => {}}>
        {p.children}
      </BlackButton>
    ),
    snippet: p =>
      `<BlackButton${p.disabled ? ' disabled' : ''} onClick={() => {}}>\n  ${
        p.children
      }\n</BlackButton>`,
  },
  {
    category: 'Buttons',
    name: 'WhiteButton',
    controls: [
      { key: 'children', type: 'text', default: '흰색 버튼' },
      { key: 'disabled', type: 'boolean', default: false },
    ],
    render: p => (
      <WhiteButton disabled={p.disabled} onClick={() => {}}>
        {p.children}
      </WhiteButton>
    ),
    snippet: p =>
      `<WhiteButton${p.disabled ? ' disabled' : ''} onClick={() => {}}>\n  ${
        p.children
      }\n</WhiteButton>`,
  },
  {
    category: 'Buttons',
    name: 'RadioButton',
    controls: [
      { key: 'valueList', type: 'json', default: '["list", "grid", "chart"]' },
      { key: 'labelList', type: 'json', default: '["목록", "그리드", "차트"]' },
    ],
    initialState: { value: 'list' },
    render: (p, { state, setState }) => (
      <RadioButton
        valueList={parseJson(p.valueList, [])}
        labelList={parseJson(p.labelList, [])}
        defaultValue={state.value}
        setValue={v => setState({ value: v })}
      />
    ),
    snippet: () => `const [value, setValue] = useState('list');

<RadioButton
  valueList={['list', 'grid', 'chart']}
  labelList={['목록', '그리드', '차트']}
  defaultValue={value}
  setValue={setValue}
/>`,
  },
  {
    category: 'Buttons',
    name: 'SwitchButton',
    controls: [
      { key: 'label', type: 'text', default: '자동 통합' },
      { key: 'disabled', type: 'boolean', default: false },
    ],
    initialState: { checked: false },
    render: (p, { state, setState }) => (
      <SwitchButton
        id="pg-switch-button"
        label={p.label}
        disabled={p.disabled}
        checked={state.checked}
        onChange={e => setState({ checked: e.target.checked })}
      />
    ),
    snippet: p => `const [checked, setChecked] = useState(false);

<SwitchButton
  id="auto-merge"
  label="${p.label}"${p.disabled ? '\n  disabled' : ''}
  checked={checked}
  onChange={e => setChecked(e.target.checked)}
/>`,
  },

  // ─── Selection ────────────────────────────────────────────
  {
    category: 'Selection',
    name: 'Radio',
    controls: [
      { key: 'type', type: 'select', options: ['border', 'fill'], default: 'border' },
      { key: 'checkColor', type: 'color', default: '#90caf9' },
      { key: 'hoverColor', type: 'color', default: '#eeeeee' },
      { key: 'labelInSpacing', type: 'text', default: '4px' },
      { key: 'labelOutSpacing', type: 'text', default: '8px' },
      { key: 'disabled', type: 'boolean', default: false },
      {
        key: 'list',
        type: 'json',
        default: JSON.stringify([
          { value: 1, label: '옵션 A' },
          { value: 2, label: '옵션 B' },
          { value: 3, label: '옵션 C' },
        ]),
      },
    ],
    initialState: { value: 1 },
    render: (p, { state, setState }) => (
      <Radio
        type={p.type}
        checkColor={p.checkColor}
        hoverColor={p.hoverColor}
        labelInSpacing={p.labelInSpacing}
        labelOutSpacing={p.labelOutSpacing}
        disabled={p.disabled}
        value={state.value}
        setValue={v => setState({ value: v })}
        list={parseJson(p.list, [])}
      />
    ),
    snippet: p => `const [value, setValue] = useState(1);

<Radio
  type="${p.type}"
  checkColor="${p.checkColor}"
  hoverColor="${p.hoverColor}"${p.disabled ? '\n  disabled' : ''}
  value={value}
  setValue={setValue}
  list={[
    { value: 1, label: '옵션 A' },
    { value: 2, label: '옵션 B' },
  ]}
/>`,
  },
  {
    category: 'Selection',
    name: 'Switch',
    controls: [
      { key: 'size', type: 'select', options: ['middle', 'small'], default: 'middle' },
      {
        key: 'color',
        type: 'select',
        options: ['blue', 'green', 'coral', 'red', 'gray'],
        default: 'blue',
      },
    ],
    initialState: { value: true },
    render: (p, { state, setState }) => (
      <Switch
        size={p.size}
        color={p.color}
        value={state.value}
        setValue={v => setState({ value: v })}
      />
    ),
    snippet: p => `const [value, setValue] = useState(true);

<Switch size="${p.size}" color="${p.color}" value={value} setValue={setValue} />`,
  },
  {
    category: 'Selection',
    name: 'Toggle',
    controls: [{ key: 'list', type: 'json', default: '["전체", "활성", "비활성"]' }],
    initialState: { value: 1 },
    render: (p, { state, setState }) => (
      <Toggle
        list={parseJson(p.list, [])}
        value={state.value}
        setValue={v => setState({ value: v })}
      />
    ),
    snippet: () => `const [value, setValue] = useState(1);

<Toggle list={['전체', '활성', '비활성']} value={value} setValue={setValue} />`,
  },

  // ─── Inputs ───────────────────────────────────────────────
  {
    category: 'Inputs',
    name: 'TextInput',
    controls: [
      { key: 'placeholder', type: 'text', default: '입력해주세요' },
      { key: 'maxLength', type: 'number', default: 100 },
      { key: 'disabled', type: 'boolean', default: false },
    ],
    render: p => (
      <div style={{ width: 260 }}>
        <TextInput placeholder={p.placeholder} maxLength={p.maxLength} disabled={p.disabled} />
      </div>
    ),
    snippet: p =>
      `<TextInput placeholder="${p.placeholder}" maxLength={${p.maxLength}}${
        p.disabled ? ' disabled' : ''
      } />`,
  },
  {
    category: 'Inputs',
    name: 'PasswordInput',
    controls: [
      { key: 'placeholder', type: 'text', default: '비밀번호' },
      { key: 'maxLength', type: 'number', default: 100 },
    ],
    render: p => (
      <div style={{ width: 260 }}>
        <PasswordInput placeholder={p.placeholder} maxLength={p.maxLength} />
      </div>
    ),
    snippet: p => `<PasswordInput placeholder="${p.placeholder}" maxLength={${p.maxLength}} />`,
  },
  {
    category: 'Inputs',
    name: 'LabelCheckBox',
    controls: [
      { key: 'label', type: 'text', default: '동의합니다' },
      { key: 'disabled', type: 'boolean', default: false },
    ],
    initialState: { checked: false },
    render: (p, { state, setState }) => (
      <LabelCheckBox
        id="pg-labelcheckbox"
        label={p.label}
        disabled={p.disabled}
        checked={state.checked}
        onChange={e => setState({ checked: e.target.checked })}
      />
    ),
    snippet: p => `const [checked, setChecked] = useState(false);

<LabelCheckBox
  id="agree"
  label="${p.label}"${p.disabled ? '\n  disabled' : ''}
  checked={checked}
  onChange={e => setChecked(e.target.checked)}
/>`,
  },
  {
    category: 'Inputs',
    name: 'Count',
    controls: [
      { key: 'min', type: 'number', default: 0 },
      { key: 'max', type: 'number', default: 10 },
    ],
    initialState: { value: 1 },
    render: (p, { state, setState }) => (
      <div style={{ width: 160 }}>
        <Count value={state.value} min={p.min} max={p.max} onChange={v => setState({ value: v })} />
      </div>
    ),
    snippet: p => `const [value, setValue] = useState(1);

<Count value={value} min={${p.min}} max={${p.max}} onChange={setValue} />`,
  },
  {
    category: 'Inputs',
    name: 'DataList',
    controls: [
      { key: 'select', type: 'boolean', default: true },
      { key: 'placeholder', type: 'text', default: '선택하세요' },
      { key: 'height', type: 'text', default: '200px' },
      { key: 'disabled', type: 'boolean', default: false },
      { key: 'valueList', type: 'json', default: '["서울", "부산", "대구", "인천", "광주"]' },
      { key: 'labelList', type: 'json', default: '[]' },
    ],
    initialState: { value: '' },
    render: (p, { state, setState }) => (
      <div style={{ width: 240 }}>
        <DataList
          select={p.select}
          placeholder={p.placeholder}
          height={p.height}
          disabled={p.disabled}
          valueList={parseJson(p.valueList, [])}
          labelList={parseJson(p.labelList, [])}
          defaultValue={state.value}
          setData={v => setState({ value: v })}
        />
      </div>
    ),
    snippet: p => `const [value, setValue] = useState('');

<DataList
  select={${p.select}}
  placeholder="${p.placeholder}"
  height="${p.height}"
  valueList={['서울', '부산', '대구']}
  defaultValue={value}
  setData={setValue}
/>`,
  },
  {
    category: 'Inputs',
    name: 'CustomTextArea',
    controls: [
      { key: 'title', type: 'text', default: '메모' },
      { key: 'mode', type: 'select', options: ['textarea', 'sql'], default: 'textarea' },
      { key: 'height', type: 'text', default: '120px' },
      { key: 'placeholder', type: 'text', default: '내용을 입력하세요' },
      { key: 'focusOn', type: 'boolean', default: false },
    ],
    initialState: { sql: 'SELECT * FROM users;' },
    render: (p, { state, setState }) => (
      <div style={{ width: 400 }}>
        <CustomTextArea
          title={p.title}
          focusOn={p.focusOn}
          {...(p.mode === 'sql'
            ? {
                sqlAreaOption: {
                  value: state.sql,
                  height: p.height,
                  placeholder: p.placeholder,
                  onChange: v => setState({ sql: v }),
                },
              }
            : { textAreaOption: { height: p.height, placeholder: p.placeholder } })}
        />
      </div>
    ),
    snippet: p =>
      p.mode === 'sql'
        ? `<CustomTextArea
  title="${p.title}"
  sqlAreaOption={{ value, height: '${p.height}', onChange: setValue }}
/>`
        : `<CustomTextArea
  title="${p.title}"
  textAreaOption={{ height: '${p.height}', placeholder: '${p.placeholder}' }}
/>`,
  },
  {
    category: 'Inputs',
    name: 'InputGrid',
    controls: [
      { key: 'required', type: 'boolean', default: false },
      { key: 'location', type: 'select', options: ['top', 'bottom'], default: 'top' },
      { key: 'contentPadding', type: 'text', default: '10%' },
    ],
    render: p => (
      <div style={{ width: 440 }}>
        <InputGrid
          required={p.required}
          location={p.location}
          contentPadding={p.contentPadding}
          list={[
            { subject: '이름', content: <TextInput placeholder="이름" /> },
            { subject: '설명', content: <TextInput placeholder="설명" /> },
          ]}
        />
      </div>
    ),
    snippet: p => `<InputGrid
  required={${p.required}}
  location="${p.location}"
  contentPadding="${p.contentPadding}"
  list={[
    { subject: '이름', content: <TextInput /> },
    { subject: '설명', content: <TextInput /> },
  ]}
/>`,
  },

  // ─── Date & Time ──────────────────────────────────────────
  {
    category: 'Date & Time',
    name: 'DatePicker',
    controls: [
      { key: 'disabled', type: 'boolean', default: false },
      { key: 'startDate', type: 'text', default: '2023-01-01' },
      { key: 'endDate', type: 'text', default: '2040-12-31' },
    ],
    initialState: { date: '' },
    render: (p, { state, setState }) => (
      <div style={{ width: 240 }}>
        <DatePicker
          disabled={p.disabled}
          date={state.date || new Date()}
          setDate={v => setState({ date: v })}
          startDate={new Date(p.startDate)}
          endDate={new Date(p.endDate)}
        />
      </div>
    ),
    snippet: p => `const [date, setDate] = useState(new Date());

<DatePicker
  date={date}
  setDate={setDate}
  startDate={new Date('${p.startDate}')}
  endDate={new Date('${p.endDate}')}
/>`,
  },
  {
    category: 'Date & Time',
    name: 'RangeDatePicker',
    controls: [
      { key: 'allowPast', type: 'boolean', default: true },
      { key: 'allowFuture', type: 'boolean', default: true },
      { key: 'disabled', type: 'boolean', default: false },
      { key: 'useTime', type: 'boolean', default: false },
      { key: 'useApply', type: 'boolean', default: false },
    ],
    initialState: { start: '', end: '', st: '00:00', et: '00:00' },
    render: (p, { state, setState }) => (
      <div style={{ width: 300 }}>
        <RangeDatePicker
          allowPast={p.allowPast}
          allowFuture={p.allowFuture}
          disabled={p.disabled}
          startDt={state.start}
          setStartDt={v => setState({ start: v })}
          endDt={state.end}
          setEndDt={v => setState({ end: v })}
          {...(p.useTime
            ? {
                startTime: state.st,
                setStartTime: v => setState({ st: v }),
                endTime: state.et,
                setEndTime: v => setState({ et: v }),
              }
            : {})}
          {...(p.useApply ? { onApply: (s, e) => setState({ start: s, end: e }) } : {})}
        />
      </div>
    ),
    snippet: p => `const [start, setStart] = useState('');
const [end, setEnd] = useState('');

<RangeDatePicker
  allowPast={${p.allowPast}}
  allowFuture={${p.allowFuture}}
  startDt={start}
  setStartDt={setStart}
  endDt={end}
  setEndDt={setEnd}${p.useApply ? '\n  onApply={(s, e) => { setStart(s); setEnd(e); }}' : ''}
/>`,
  },
  {
    category: 'Date & Time',
    name: 'TimePicker',
    controls: [
      { key: 'disabled', type: 'boolean', default: false },
      { key: 'itemHeight', type: 'number', default: 32 },
    ],
    initialState: { time: '09:00' },
    render: (p, { state, setState }) => (
      <div style={{ width: 160 }}>
        <TimePicker
          disabled={p.disabled}
          itemHeight={p.itemHeight}
          time={state.time}
          onChange={v => setState({ time: v })}
        />
      </div>
    ),
    snippet: p => `const [time, setTime] = useState('09:00');

<TimePicker time={time} onChange={setTime} itemHeight={${p.itemHeight}} />`,
  },

  // ─── Feedback ─────────────────────────────────────────────
  {
    category: 'Feedback',
    name: 'Tooltip',
    controls: [
      { key: 'text', type: 'text', default: '툴팁 내용입니다' },
      { key: 'position', type: 'select', options: TOOLTIP_POSITIONS, default: 'top-center' },
      { key: 'color', type: 'color', default: '#3e3e3e' },
    ],
    render: p => (
      <div style={{ padding: '60px 80px' }}>
        <Tooltip text={p.text} position={p.position} color={p.color}>
          <span style={{ padding: '8px 14px', background: '#eee', borderRadius: 6 }}>hover me</span>
        </Tooltip>
      </div>
    ),
    snippet: p => `<Tooltip text="${p.text}" position="${p.position}" color="${p.color}">
  <span>hover me</span>
</Tooltip>`,
  },
  {
    category: 'Feedback',
    name: 'HelpIcon',
    controls: [
      { key: 'message', type: 'text', default: '이 항목에 대한 도움말입니다.' },
      { key: 'size', type: 'number', default: 20 },
    ],
    render: p => (
      <span style={{ display: 'inline-flex', alignItems: 'center' }}>
        설정 항목
        <HelpIcon message={p.message} size={p.size} />
      </span>
    ),
    snippet: p => `<HelpIcon message="${p.message}" size={${p.size}} />`,
  },
  {
    category: 'Feedback',
    name: 'Modal',
    controls: [
      { key: 'modalTitle', type: 'text', default: '모달 제목' },
      { key: 'width', type: 'text', default: '480px' },
      { key: 'movable', type: 'boolean', default: true },
      { key: 'isCloseBtn', type: 'boolean', default: true },
    ],
    initialState: { open: false },
    render: (p, { state, setState }) => (
      <>
        <BlackButton onClick={() => setState({ open: true })}>모달 열기</BlackButton>
        {state.open && (
          <Modal
            modalTitle={p.modalTitle}
            width={p.width}
            movable={p.movable}
            isCloseBtn={p.isCloseBtn}
            handleClose={() => setState({ open: false })}
            callback={() => setState({ open: false })}
          >
            <div style={{ fontSize: 14 }}>모달 본문 내용입니다.</div>
          </Modal>
        )}
      </>
    ),
    snippet: p => `const [open, setOpen] = useState(false);

<BlackButton onClick={() => setOpen(true)}>모달 열기</BlackButton>
{open && (
  <Modal
    modalTitle="${p.modalTitle}"
    width="${p.width}"
    movable={${p.movable}}
    isCloseBtn={${p.isCloseBtn}}
    handleClose={() => setOpen(false)}
    callback={() => setOpen(false)}
  >
    <div>모달 본문 내용</div>
  </Modal>
)}`,
  },

  // ─── Navigation ───────────────────────────────────────────
  {
    category: 'Navigation',
    name: 'Pagination',
    controls: [
      { key: 'totalLength', type: 'number', default: 320 },
      { key: 'buttonLength', type: 'number', default: 10 },
    ],
    initialState: { currentPage: 1 },
    render: (p, { state, setState }) => (
      <Pagination
        totalLength={p.totalLength}
        buttonLength={p.buttonLength}
        currentPage={state.currentPage}
        pageEvent={pageNum => setState({ currentPage: pageNum })}
      />
    ),
    snippet: p => `const [page, setPage] = useState(1);

<Pagination
  totalLength={${p.totalLength}}
  buttonLength={${p.buttonLength}}
  currentPage={page}
  pageEvent={(pageNum) => setPage(pageNum)}
/>`,
  },
  {
    category: 'Navigation',
    name: 'SideTabs',
    controls: [{ key: 'tabCount', type: 'number', default: 4 }],
    render: p => {
      const count = Math.max(1, Math.min(p.tabCount || 1, 30));
      return (
        <div style={{ height: 320, display: 'flex', overflow: 'hidden' }}>
          <SideTabs>
            <MainTabButton onClick={() => {}}>메인 버튼</MainTabButton>
            <SideScrollWrap>
              {Array.from({ length: count }, (_, i) => (
                <TabButton key={i} onClick={() => {}}>
                  {`그룹 ${i + 1}`}
                </TabButton>
              ))}
            </SideScrollWrap>
            <TabButton onClick={() => {}}>설정</TabButton>
          </SideTabs>
        </div>
      );
    },
    snippet: () => `<SideTabs>
  <MainTabButton onClick={fn}>메인 버튼</MainTabButton>
  <SideScrollWrap>
    <TabButton onClick={fn}>그룹 1</TabButton>
    <TabButton onClick={fn}>그룹 2</TabButton>
  </SideScrollWrap>
  <TabButton onClick={fn}>설정</TabButton>
</SideTabs>`,
  },

  // ─── Layout ───────────────────────────────────────────────
  {
    category: 'Layout',
    name: 'Accordion',
    controls: [{ key: 'title', type: 'text', default: '섹션 제목' }],
    initialState: { collapse: true },
    render: (p, { state, setState }) => (
      <div style={{ width: 360 }}>
        <Accordion
          title={<span style={{ fontWeight: 600, fontSize: 14 }}>{p.title}</span>}
          collapse={state.collapse}
          setCollapse={v => setState({ collapse: v })}
        >
          <div style={{ padding: '12px 4px', fontSize: 14, color: 'var(--pg-text)' }}>
            아코디언 본문 내용입니다. collapse 값에 따라 열리고 닫힙니다.
          </div>
        </Accordion>
      </div>
    ),
    snippet: p => `const [collapse, setCollapse] = useState(true);

<Accordion
  title={<span>${p.title}</span>}
  collapse={collapse}
  setCollapse={setCollapse}
>
  <div>아코디언 본문 내용</div>
</Accordion>`,
  },
  {
    category: 'Layout',
    name: 'DividingLine',
    controls: [],
    render: () => (
      <div style={{ width: 320 }}>
        <div style={{ fontSize: 14, marginBottom: 10 }}>위 영역</div>
        <DividingLine />
        <div style={{ fontSize: 14, marginTop: 10 }}>아래 영역</div>
      </div>
    ),
    snippet: () => `<DividingLine />`,
  },
  {
    category: 'Layout',
    name: 'Card',
    controls: [
      { key: 'width', type: 'number', default: 280 },
      { key: 'height', type: 'number', default: 140 },
      { key: 'allCollapse', type: 'boolean', default: false },
    ],
    render: p => (
      <Card
        width={p.width}
        height={p.height}
        allCollapse={p.allCollapse}
        isAllCollapse={false}
        setIsAllCollapse={() => {}}
      >
        <Card.Header>카드 제목</Card.Header>
        <Card.Body>
          <div style={{ fontSize: 14, color: '#545454' }}>헤더의 화살표로 접고 펼 수 있습니다.</div>
        </Card.Body>
      </Card>
    ),
    snippet: p => `<Card
  width={${p.width}}
  height={${p.height}}
  allCollapse={${p.allCollapse}}
  isAllCollapse={isAllCollapse}
  setIsAllCollapse={setIsAllCollapse}
>
  <Card.Header>카드 제목</Card.Header>
  <Card.Body>본문 내용</Card.Body>
</Card>`,
  },
  {
    category: 'Layout',
    name: 'Article',
    controls: [],
    render: () => (
      <div style={{ width: 520 }}>
        <Article
          list={[
            { subject: '이름', text: '필수 항목', content: <TextInput placeholder="이름" /> },
            { subject: '이메일', text: '', content: <TextInput placeholder="you@example.com" /> },
          ]}
        />
      </div>
    ),
    snippet: () => `<Article
  list={[
    { subject: '이름', text: '필수 항목', content: <TextInput /> },
    { subject: '이메일', text: '', content: <TextInput /> },
  ]}
/>`,
  },

  // ─── Data ─────────────────────────────────────────────────
  {
    category: 'Data',
    name: 'Counter',
    controls: [
      { key: 'targetValue', type: 'number', default: 100 },
      { key: 'time', type: 'number', default: 20 },
    ],
    render: p => (
      <div style={{ fontSize: 36 }}>
        <Counter targetValue={p.targetValue} time={p.time} />
      </div>
    ),
    snippet: p => `<Counter targetValue={${p.targetValue}} time={${p.time}} />`,
  },
  {
    category: 'Data',
    name: 'CountList',
    controls: [
      { key: 'unit', type: 'text', default: 'IP' },
      { key: 'direction', type: 'select', options: ['right', 'left'], default: 'right' },
    ],
    initialState: { labels: ['192.168.0.1', '192.168.0.2', '10.0.0.5'] },
    render: (p, { state, setState }) => (
      <CountList
        unit={p.unit}
        direction={p.direction}
        labelList={state.labels}
        setLabelList={v => setState({ labels: v })}
      />
    ),
    snippet: p => `const [labels, setLabels] = useState(['192.168.0.1', '192.168.0.2']);

<CountList
  unit="${p.unit}"
  direction="${p.direction}"
  labelList={labels}
  setLabelList={setLabels}
/>`,
  },
  {
    category: 'Data',
    name: 'LabelList',
    controls: [
      { key: 'direction', type: 'select', options: ['left', 'right'], default: 'left' },
      { key: 'unit', type: 'text', default: '그룹' },
      { key: 'disabled', type: 'boolean', default: false },
      { key: 'valueList', type: 'json', default: '["a", "b", "c"]' },
      { key: 'labelList', type: 'json', default: '["그룹 A", "그룹 B", "그룹 C"]' },
    ],
    initialState: { selected: ['a'] },
    render: (p, { state, setState }) => (
      <LabelList
        direction={p.direction}
        unit={p.unit}
        disabled={p.disabled}
        valueList={parseJson(p.valueList, [])}
        labelList={parseJson(p.labelList, [])}
        selectedValueList={state.selected}
        setSelectedValueList={v => setState({ selected: v })}
      />
    ),
    snippet: p => `const [selected, setSelected] = useState(['a']);

<LabelList
  direction="${p.direction}"
  unit="${p.unit}"
  valueList={['a', 'b', 'c']}
  labelList={['그룹 A', '그룹 B', '그룹 C']}
  selectedValueList={selected}
  setSelectedValueList={setSelected}
/>`,
  },

  // ─── Menu ─────────────────────────────────────────────────
  {
    category: 'Menu',
    name: 'HeaderCreator',
    controls: [
      { key: 'role', type: 'select', options: ['y', 'n'], default: 'y' },
      { key: 'useDepth', type: 'boolean', default: true },
      { key: 'logo', type: 'text', default: 'LOGO' },
      { key: 'logoLink', type: 'text', default: '/' },
      { key: 'showChildren', type: 'boolean', default: true },
      { key: 'menuList', type: 'json', default: SAMPLE_MENU_JSON },
    ],
    render: p => {
      let menu = [];
      let err = null;
      try {
        menu = JSON.parse(p.menuList);
      } catch (e) {
        err = e.message;
      }
      return (
        <div style={{ width: '100%' }}>
          {err && <ErrorNote>menuList JSON 오류: {err}</ErrorNote>}
          <HeaderCreator
            logoSetting={{
              logo: (
                <span style={{ color: '#fff', padding: '0 16px', fontWeight: 700 }}>{p.logo}</span>
              ),
              logoLink: p.logoLink,
            }}
            menuList={menu}
            role={p.role}
            useDepth={p.useDepth}
          >
            {p.showChildren ? (
              <span style={{ color: '#fff', padding: '0 16px', fontSize: 13 }}>
                우측 children 영역
              </span>
            ) : (
              <div />
            )}
          </HeaderCreator>
          <div style={{ padding: 16, fontSize: 13, color: 'var(--pg-muted)' }}>
            메뉴별 세부 옵션(menuRole·display·isPublic·icon·routePath·subMenu)은 아래
            menuList(JSON)에서 편집하세요. role=&apos;y&apos;는 전체 노출, &apos;n&apos;은
            menuRole&gt;0 / isPublic만 노출, display:false는 숨김. 상단 메뉴 hover 시 서브메뉴가
            fade로 열려요.
          </div>
        </div>
      );
    },
    snippet: p => `<HeaderCreator
  logoSetting={{ logo: <Logo />, logoLink: '${p.logoLink}' }}
  menuList={menuList}
  role="${p.role}"
  useDepth={${p.useDepth}}
>
  <Widget />
</HeaderCreator>`,
  },
  {
    category: 'Menu',
    name: 'AsideCreator',
    controls: [
      { key: 'role', type: 'select', options: ['y', 'n'], default: 'y' },
      {
        key: 'title',
        type: 'text',
        default: '설정',
        desc: '사이드바에 펼칠 상위 메뉴의 title입니다. menuList에 있는 항목이어야 합니다.',
      },
      { key: 'logo', type: 'text', default: '' },
      { key: 'logoLink', type: 'text', default: '/' },
      { key: 'menuList', type: 'json', default: SAMPLE_MENU_JSON },
    ],
    render: p => {
      let menu = [];
      let err = null;
      try {
        menu = JSON.parse(p.menuList);
      } catch (e) {
        err = e.message;
      }
      const exists = menu.some(m => m.title === p.title);
      return (
        <div style={{ width: '100%', minHeight: 340, display: 'flex', flexDirection: 'column' }}>
          {err && <ErrorNote>menuList JSON 오류: {err}</ErrorNote>}
          {!err && !exists && (
            <ErrorNote>
              title=&apos;{p.title}&apos; 이 menuList에 없습니다. (하위 메뉴 있는 항목 지정)
            </ErrorNote>
          )}
          <div style={{ flex: 1, display: 'flex' }}>
            {exists && (
              <AsideCreator
                menuList={menu}
                title={p.title}
                role={p.role}
                logoSetting={p.logo ? { logo: p.logo, logoLink: p.logoLink } : {}}
              >
                <div style={{ padding: 16, fontSize: 14 }}>메인 컨텐츠 영역 (children)</div>
              </AsideCreator>
            )}
          </div>
        </div>
      );
    },
    snippet: p => `<AsideCreator
  menuList={menuList}
  title="${p.title}"
  role="${p.role}"${p.logo ? `\n  logoSetting={{ logo: <Logo />, logoLink: '${p.logoLink}' }}` : ''}
>
  <YourPageContent />
</AsideCreator>`,
  },

  // ─── Utility ──────────────────────────────────────────────
  {
    category: 'Utility',
    name: 'DNDWrapper',
    controls: [
      { key: 'isDrag', type: 'boolean', default: true },
      {
        key: 'direction',
        type: 'select',
        options: ['vertical', 'horizontal'],
        default: 'vertical',
      },
    ],
    // 항목을 "객체"로 둬서 객체 상태도 되는 걸 보여준다. key는 안정적인 고유값(it.id).
    initialState: {
      items: [
        { id: 1, label: '항목 1' },
        { id: 2, label: '항목 2' },
        { id: 3, label: '항목 3' },
        { id: 4, label: '항목 4' },
      ],
    },
    render: (p, { state, setState }) => {
      const items = state.items || [];
      const setItems = v => {
        if (sameOrder(v, items)) return; // 순서 변화 없으면 무시(불필요 리렌더 방지)
        setState({ items: v });
      };
      const addItem = () => {
        const nextId = items.reduce((m, x) => Math.max(m, x.id), 0) + 1;
        setState({ items: [...items, { id: nextId, label: `항목 ${nextId}` }] });
      };
      const horizontal = p.direction === 'horizontal';
      return (
        <div>
          <div style={{ marginBottom: 8, fontSize: 12, color: 'var(--pg-muted)' }}>
            드래그해서 순서를 바꿔보세요. (끌면 삽입 위치가 빨간 선으로 표시됩니다)
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: horizontal ? 'row' : 'column',
              gap: 6,
              marginBottom: 10,
            }}
          >
            {items.map((it, idx) => (
              <DNDWrapper
                key={it.id}
                itemList={items}
                setItemList={setItems}
                seq={idx}
                isDrag={p.isDrag}
                direction={p.direction}
              >
                <div
                  style={{
                    padding: '10px 14px',
                    background: '#eceff1',
                    border: '1px solid #d2d2d2',
                    borderRadius: 6,
                    fontSize: 14,
                    color: '#212529',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ⠿ {it.label}
                </div>
              </DNDWrapper>
            ))}
          </div>
          <WhiteButton onClick={addItem}>+ 항목 추가</WhiteButton>
        </div>
      );
    },
    snippet: p => `const [items, setItems] = useState([
  { id: 1, label: '항목 1' },
  { id: 2, label: '항목 2' },
]);

{items.map((it, idx) => (
  <DNDWrapper
    key={it.id}
    itemList={items}
    setItemList={setItems}
    seq={idx}
    direction="${p.direction}"
  >
    <div>{it.label}</div>
  </DNDWrapper>
))}`,
  },

  // ─── Media ────────────────────────────────────────────────
  {
    category: 'Media',
    name: 'Slider',
    controls: [
      { key: 'width', type: 'text', default: '520px' },
      { key: 'height', type: 'text', default: '260px' },
      { key: 'autoPlay', type: 'boolean', default: false },
      { key: 'autoTime', type: 'number', default: 3000 },
    ],
    render: p => (
      <Slider
        width={p.width}
        height={p.height}
        autoPlay={p.autoPlay}
        autoTime={p.autoTime}
        itemList={['#6674fe', '#87ba73', '#fb5b5b'].map(bg => (
          <div
            key={bg}
            style={{
              width: '100%',
              height: '100%',
              background: bg,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
            }}
          >
            Slide
          </div>
        ))}
      />
    ),
    snippet: p => `<Slider
  width="${p.width}"
  height="${p.height}"
  autoPlay={${p.autoPlay}}
  autoTime={${p.autoTime}}
  itemList={[<Slide1 />, <Slide2 />, <Slide3 />]}
/>`,
  },
  // ─── 컴포넌트 내부에서 쓰이는 유틸 (참고/데모) ───────────
  {
    category: 'Feedback',
    name: 'EscStack',
    parent: 'Modal',
    realUsage: {
      file: 'components/ToastAlert.jsx',
      code: `import { EscStack } from 'seed-ui';

// 토스트 컴포넌트. id = 이 토스트의 고유 id(prop)
function ToastAlert({ id, interval }) {
  useLayoutEffect(() => {
    // handler = ESC 눌렀을 때 이 토스트를 닫는 함수
    const handler = () => deleteAlert(id);
    EscStack.push(handler);                // 스택 맨 위에 등록 → ESC는 최상단부터 닫음
    return () => EscStack.remove(handler); // 언마운트 시 스택에서 제거
  }, [id]);
}`,
    },
    controls: [],
    initialState: { open1: false, open2: false },
    render: (p, { state, setState }) => (
      <div style={{ maxWidth: 520 }}>
        <div style={{ fontSize: 13, color: 'var(--pg-muted)', marginBottom: 10, lineHeight: 1.7 }}>
          ESC로 닫는 것들을 <b>공용 스택(LIFO)</b>으로 관리합니다. ESC를 누르면 가장 최근에 열린
          것부터 하나씩 닫혀요.
          <br />• <b>seed-ui Modal은 자동 등록</b> — 그냥 쓰면 ESC로 닫힘(직접 안 해도 됨).
          <br />• <b>Modal이 아닌 커스텀 오버레이</b>(토스트 등)만 직접{' '}
          <code>EscStack.push(handler)</code> + 언마운트 시 <code>remove</code>하면, 모달들과 같은
          스택에 얹혀 함께 LIFO로 닫힙니다.
        </div>
        <BlackButton onClick={() => setState({ open1: true })}>모달 1 열기</BlackButton>
        {state.open1 && (
          <Modal
            modalTitle="모달 1"
            handleClose={() => setState({ open1: false })}
            callback={() => setState({ open1: false })}
          >
            <div style={{ fontSize: 14, marginBottom: 10 }}>
              ESC를 누르면 이 모달이 닫혀요. 아래로 모달 2를 겹쳐 열고 ESC를 눌러보세요.
            </div>
            <WhiteButton onClick={() => setState({ open2: true })}>모달 2 열기</WhiteButton>
          </Modal>
        )}
        {/* 모달 2는 모달 1의 자식이 아니라 형제로 둔다. (모달 1이 닫혀도 함께 언마운트되지 않도록) */}
        {state.open2 && (
          <Modal
            modalTitle="모달 2"
            handleClose={() => setState({ open2: false })}
            callback={() => setState({ open2: false })}
          >
            <div style={{ fontSize: 14 }}>
              ESC → 모달 2가 먼저 닫히고, 다시 ESC → 모달 1이 닫힙니다 (스택 순서).
            </div>
          </Modal>
        )}
      </div>
    ),
    snippet: () => `import EscStack from 'seed-ui'; // export { EscStack }

// 컴포넌트에서 ESC 닫기 등록 (Modal이 내부적으로 이렇게 사용)
useLayoutEffect(() => {
  const handler = () => close();
  EscStack.push(handler);
  return () => EscStack.remove(handler);
}, []);`,
  },
  {
    category: 'Navigation',
    name: 'selectSideTab',
    parent: 'SideTabs',
    realUsage: {
      file: 'page/management/userGroup/modal/CreateGroupModal.jsx',
      code: `import { selectSideTab } from 'seed-ui';

// 각 탭은 value를 가짐: <TabButton value={0}>전체</TabButton>
// 그룹 추가/수정 모달을 닫을 때, value=0(전체) 탭을 다시 선택
handleClose={() => {
  handleClose();
  selectSideTab(0); // 인자 = 선택할 탭의 value
}}`,
    },
    controls: [],
    render: () => (
      <div>
        <div style={{ fontSize: 13, color: 'var(--pg-muted)', marginBottom: 10 }}>
          selectSideTab(value)는 SideTabs의 특정 탭을 <b>코드로 강제 선택</b>합니다. TabButton의
          value와 매칭돼요. (SideTabs가 내부에서 쓰는 함수)
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <WhiteButton onClick={() => selectSideTab('b')}>그룹 B 선택</WhiteButton>
          <WhiteButton onClick={() => selectSideTab('c')}>그룹 C 선택</WhiteButton>
        </div>
        <div style={{ height: 260, display: 'flex', overflow: 'hidden' }}>
          <SideTabs>
            <MainTabButton onClick={() => {}}>메인</MainTabButton>
            <SideScrollWrap>
              <TabButton value="a" onClick={() => {}}>
                그룹 A
              </TabButton>
              <TabButton value="b" onClick={() => {}}>
                그룹 B
              </TabButton>
              <TabButton value="c" onClick={() => {}}>
                그룹 C
              </TabButton>
            </SideScrollWrap>
          </SideTabs>
        </div>
      </div>
    ),
    snippet: () => `import { selectSideTab } from 'seed-ui';

<TabButton value="b" onClick={fn}>그룹 B</TabButton>

// 어디서든 코드로 해당 탭을 선택
selectSideTab('b');`,
  },
  {
    category: 'Menu',
    name: 'SetRoute',
    parent: 'HeaderCreator',
    realUsage: {
      file: 'App.jsx',
      code: `import { SetRoute } from 'seed-ui';

// 로그인 후 받은 메뉴(DepthList)와 권한(role_a)으로 라우트 자동 생성
const dynamicRoutes = useMemo(() => {
  if (DepthList.length === 0) return null;
  return SetRoute(DepthList, role_a);
}, [DepthList, role_a]);

// createBrowserRouter / <Routes> 안에서 dynamicRoutes 를 사용`,
    },
    controls: [{ key: 'menuList', type: 'json', default: SAMPLE_MENU_JSON }],
    render: p => {
      let menu = [];
      try {
        menu = JSON.parse(p.menuList);
      } catch {
        menu = [];
      }
      const flat = [];
      const walk = (arr, depth = 0) =>
        arr.forEach(m => {
          flat.push({ depth, path: m.routePath || m.link, title: m.title });
          if (m.subMenu) walk(m.subMenu, depth + 1);
        });
      walk(menu);
      return (
        <div style={{ width: '100%', maxWidth: 560 }}>
          <div style={{ fontSize: 13, color: 'var(--pg-muted)', marginBottom: 10 }}>
            SetRoute(menuList, role)는 menuList를 순회하며 각 항목의 routePath(없으면 link)와
            component로 <b>중첩 &lt;Route&gt;를 자동 생성</b>합니다. App의 &lt;Routes&gt; 안에서
            사용해요. (라우팅 함수 — 별도 UI 없음)
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 1.7 }}>
            <div style={{ color: 'var(--pg-muted)', marginBottom: 4 }}>생성될 라우트 구조:</div>
            {flat.map(r => (
              <div key={`${r.depth}-${r.path}-${r.title}`} style={{ paddingLeft: r.depth * 18 }}>
                {`<Route path="${r.path}">`}{' '}
                <span style={{ color: 'var(--pg-muted)' }}>— {r.title}</span>
              </div>
            ))}
          </div>
        </div>
      );
    },
    snippet: () => `import { SetRoute } from 'seed-ui';

<Routes>
  <Route path="/" element={<Layout />}>
    {SetRoute(menuList, role)}   {/* menuList → 중첩 Route 자동 생성 */}
  </Route>
</Routes>`,
  },

  // ─── CLM 이식: 알림 시스템 (토스트 + 컨펌) ────────────────
  {
    category: 'Feedback',
    name: 'ToastNotify',
    controls: [],
    render: () => (
      // 프리뷰 전용: CLM30 본문 폰트로 미리보기 (실제 배포/컴포넌트엔 폰트 미지정 — 앱 폰트 상속)
      // 버튼/입력은 네이티브 UA 폰트라 상속 안 하므로 inherit 강제
      <NotifyPreview>
        <div style={{ fontSize: 13, color: 'var(--pg-muted)', marginBottom: 10, lineHeight: 1.7 }}>
          <b>CLM</b>은 알림 호출 API, <b>ToastNotify</b>는 화면에 그리는 렌더러(앱 최상단에 1번만
          렌더). CLM30에서 이식한 시스템이에요.{' '}
          <b>(이 미리보기만 NanumGothic 적용 — 실제 앱에선 그 앱 폰트를 상속)</b>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <BlackButton onClick={() => CLM.alertSuccess('성공 토스트입니다.')}>
            alertSuccess
          </BlackButton>
          <BlackButton onClick={() => CLM.alertInfo('정보 토스트입니다.')}>alertInfo</BlackButton>
          <BlackButton onClick={() => CLM.alert('기본 토스트입니다.')}>alert</BlackButton>
          <BlackButton onClick={() => CLM.alertError('에러가 발생했습니다.')}>
            alertError(문자열)
          </BlackButton>
          <BlackButton
            onClick={() =>
              CLM.alertError({ title: '오류', message: '상세 오류 메시지입니다.\n확인해주세요.' })
            }
          >
            alertError(객체·제목형)
          </BlackButton>
          <BlackButton
            onClick={async () => {
              const ok = await CLM.confirm({ title: '확인', message: '정말 진행할까요?' });
              CLM.alert(ok ? '확인을 눌렀습니다.' : '취소했습니다.');
            }}
          >
            confirm (Promise)
          </BlackButton>
        </div>
        <ToastNotify />
      </NotifyPreview>
    ),
    snippet: () => `import { CLM, ToastNotify } from 'seed-ui';

// 1) 앱 최상단에 렌더러 한 번만
<ToastNotify />

// 2) 어디서든 호출
CLM.alertSuccess('저장되었습니다.');
CLM.alertError('실패했습니다.');
const ok = await CLM.confirm({ title: '확인', message: '진행할까요?' }); // Promise<boolean>`,
    realUsage: {
      file: 'assets/R2wZustand.js (정의) · main.jsx (<ToastNotify/>)',
      code: `import { CLM } from 'assets/R2wZustand';

// 저장 성공/실패 알림
await api.save();
CLM.alertSuccess('저장되었습니다.');

// 삭제 전 확인
const ok = await CLM.confirm({ title: '삭제', message: '되돌릴 수 없습니다. 삭제할까요?' });
if (ok) api.delete();`,
    },
  },

  // ─── 추가: OptionCard ─────────────────────────────────────
  {
    category: 'Layout',
    name: 'OptionCard',
    controls: [
      {
        key: 'type',
        type: 'select',
        options: ['TextInput', 'DataList', 'TextArea', 'Count'],
        default: 'TextInput',
        desc: '입력 위젯 종류(config.type). 카드 안의 입력 컴포넌트가 이 값에 따라 바뀝니다.',
      },
      {
        key: 'name',
        type: 'text',
        default: '옵션 이름',
        desc: '카드 왼쪽에 표시될 옵션 이름(config.name)입니다.',
      },
      {
        key: 'desc',
        type: 'text',
        default: '이 옵션에 대한 설명',
        desc: '옵션 이름 아래 표시될 설명 문구(config.desc)입니다.',
      },
    ],
    initialState: { options: [{ key: 'opt', val: '' }] },
    render: (p, { state, setState }) => {
      const options = state.options || [{ key: 'opt', val: '' }];
      const config = {
        key: 'opt',
        type: p.type,
        name: p.name,
        desc: p.desc,
        valueList: ['서울', '부산', '대구'],
        labelList: [],
        min: 0,
        max: 10,
        height: '100px',
        placeholder: '입력하세요',
      };
      return (
        <div style={{ width: 480 }}>
          <OptionCard
            config={config}
            option={options[0]}
            setOption={fn => setState({ options: fn(options) })}
          />
        </div>
      );
    },
    snippet: p => `const [options, setOptions] = useState([{ key: 'opt', val: '' }]);

<OptionCard
  config={{ key: 'opt', type: '${p.type}', name: '${p.name}', desc: '${p.desc}' }}
  option={options[0]}
  setOption={setOptions}
/>`,
  },
];

function ControlLabel({ control }) {
  const desc = control.desc || COMMON_DESC[control.key];
  return (
    <RowLabel>
      <span>{control.key}</span>
      {desc && <HelpIcon message={desc} size={15} />}
    </RowLabel>
  );
}

function ControlRow({ control, value, onChange }) {
  const { type, options } = control;

  if (type === 'json') {
    return (
      <JsonRow>
        <ControlLabel control={control} />
        <textarea
          className="json-editor"
          value={value ?? ''}
          spellCheck={false}
          onChange={e => onChange(e.target.value)}
        />
      </JsonRow>
    );
  }

  return (
    <Row>
      <ControlLabel control={control} />
      <RowField>
        {type === 'boolean' && (
          <input type="checkbox" checked={!!value} onChange={e => onChange(e.target.checked)} />
        )}
        {type === 'text' && (
          <input type="text" value={value ?? ''} onChange={e => onChange(e.target.value)} />
        )}
        {type === 'number' && (
          <input
            type="number"
            value={value ?? 0}
            onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          />
        )}
        {type === 'color' && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="color" value={value} onChange={e => onChange(e.target.value)} />
            <code style={{ fontSize: 12 }}>{value}</code>
          </span>
        )}
        {type === 'select' && (
          <Segmented>
            {options.map(opt => (
              <SegItem key={opt} data-active={opt === value} onClick={() => onChange(opt)}>
                {opt}
              </SegItem>
            ))}
          </Segmented>
        )}
      </RowField>
    </Row>
  );
}

function buildCode(story, props) {
  const body = story.snippet(props);
  const imports = [`import { ${story.name} } from 'seed-ui';`];
  if (body.includes('useState')) imports.unshift(`import { useState } from 'react';`);
  return `${imports.join('\n')}\n\n${body}`;
}

function Playground() {
  const { name } = useParams();
  const navigate = useNavigate();

  const categories = useMemo(() => {
    const map = new Map();
    stories.forEach(s => {
      if (!map.has(s.category)) map.set(s.category, []);
      map.get(s.category).push(s);
    });
    return [...map.entries()];
  }, []);

  const activeName = stories.some(s => s.name === name) ? name : stories[0].name;
  const active = stories.find(s => s.name === activeName);

  const [propsMap, setPropsMap] = useState({});
  const [stateMap, setStateMap] = useState({});
  const [copied, setCopied] = useState(false);
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem('pg-theme') === 'dark';
    } catch {
      return false;
    }
  });
  const toggleDark = () =>
    setDark(d => {
      const next = !d;
      try {
        localStorage.setItem('pg-theme', next ? 'dark' : 'light');
      } catch {
        /* noop */
      }
      return next;
    });

  const defaults = useMemo(
    () => Object.fromEntries(active.controls.map(c => [c.key, c.default])),
    [active],
  );
  const props = { ...defaults, ...(propsMap[activeName] || {}) };
  const state = { ...(active.initialState || {}), ...(stateMap[activeName] || {}) };

  const setProp = (k, v) =>
    setPropsMap(m => ({ ...m, [activeName]: { ...(m[activeName] || {}), [k]: v } }));
  const setState = patch =>
    setStateMap(m => ({
      ...m,
      [activeName]: { ...(active.initialState || {}), ...(m[activeName] || {}), ...patch },
    }));
  const reset = () => {
    setPropsMap(m => ({ ...m, [activeName]: {} }));
    setStateMap(m => ({ ...m, [activeName]: {} }));
  };

  const code = buildCode(active, props);
  const usage = active.realUsage || REAL_USAGE[active.name];
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 클립보드 접근 불가 환경 — 무시
    }
  };

  const selectStory = storyName => {
    setCopied(false);
    navigate(`/playground/${storyName}`);
  };

  const readoutProps = Object.fromEntries(
    active.controls.filter(c => c.type !== 'json').map(c => [c.key, props[c.key]]),
  );

  return (
    <Layout data-theme={dark ? 'dark' : 'light'}>
      <Sidebar>
        <BrandRow>
          <Brand>seed-ui Playground</Brand>
          <ThemeToggle onClick={toggleDark} title="다크모드 전환">
            {dark ? '☀' : '◐'}
          </ThemeToggle>
        </BrandRow>
        {categories.map(([cat, items]) => {
          const parents = items.filter(s => !s.parent);
          const childrenOf = parentName => items.filter(s => s.parent === parentName);
          return (
            <Group key={cat}>
              <GroupTitle>{cat}</GroupTitle>
              {parents.map(s => (
                <React.Fragment key={s.name}>
                  <NavItem data-active={s.name === activeName} onClick={() => selectStory(s.name)}>
                    {s.name}
                  </NavItem>
                  {childrenOf(s.name).map(c => (
                    <NavSubItem
                      key={c.name}
                      data-active={c.name === activeName}
                      onClick={() => selectStory(c.name)}
                      title={`${s.name} 내부에서 쓰이는 유틸`}
                    >
                      ↳ {c.name}
                    </NavSubItem>
                  ))}
                </React.Fragment>
              ))}
            </Group>
          );
        })}
      </Sidebar>

      <Main>
        <MainHead>
          <h1>{active.name}</h1>
          <Category>{active.category}</Category>
          <UrlHint>/playground/{active.name}</UrlHint>
        </MainHead>

        <Stage>
          <StageInner>{active.render(props, { state, setState })}</StageInner>
        </Stage>

        <Grid>
          <Panel>
            <PanelHead>
              <span>Controls</span>
              <ResetBtn onClick={reset}>reset</ResetBtn>
            </PanelHead>
            {active.controls.length === 0 ? (
              <Empty>조절 가능한 props 없음 (상호작용만 지원)</Empty>
            ) : (
              active.controls.map(c => (
                <ControlRow
                  key={c.key}
                  control={c}
                  value={props[c.key]}
                  onChange={v => setProp(c.key, v)}
                />
              ))
            )}
            {Object.keys(readoutProps).length > 0 && (
              <PropsReadout>
                <span>current props</span>
                <pre>{JSON.stringify(readoutProps, null, 2)}</pre>
              </PropsReadout>
            )}
          </Panel>

          <Panel>
            <PanelHead>
              <span>Code</span>
              <CopyBtn onClick={copyCode} data-copied={copied}>
                {copied ? '✓ 복사됨' : '복사'}
              </CopyBtn>
            </PanelHead>
            <SyntaxHighlighter
              language="jsx"
              style={oneDark}
              customStyle={{
                margin: 0,
                borderRadius: 6,
                fontSize: 12.5,
                padding: '14px 16px',
              }}
              wrapLongLines
            >
              {code}
            </SyntaxHighlighter>
          </Panel>
        </Grid>

        {usage && (
          <Panel style={{ marginTop: 20 }}>
            <PanelHead>
              <span>본 프로젝트(CLM30) 사용 예</span>
              <UrlHint>{usage.file}</UrlHint>
            </PanelHead>
            <SyntaxHighlighter
              language="jsx"
              style={oneDark}
              customStyle={{ margin: 0, borderRadius: 6, fontSize: 12.5, padding: '14px 16px' }}
              wrapLongLines
            >
              {usage.code}
            </SyntaxHighlighter>
          </Panel>
        )}
      </Main>
    </Layout>
  );
}

// ToastNotify 프리뷰 전용 래퍼: CLM30 폰트(NanumGothic) 미리보기.
// 버튼/입력은 네이티브 UA 폰트라 상속을 안 하므로 inherit로 강제.
const NotifyPreview = styled.div`
  max-width: 520px;
  font-family: 'Nanum Gothic', 'NanumGothic', sans-serif;

  button,
  input,
  textarea {
    font-family: inherit;
  }
`;

const Layout = styled.div`
  --pg-bg: #f4f5f7;
  --pg-panel: #ffffff;
  --pg-border: #e0e0e0;
  --pg-text: #212529;
  --pg-muted: #6c757d;
  --pg-stage: #ffffff;
  --pg-stage-dot: #e9ecef;
  --pg-code-bg: #1e1e22;
  --pg-code-text: #e8e8ea;
  --pg-sidebar: #3e3e3e;
  --pg-sidebar-text: #e0e0e0;
  --pg-row-border: #f1f3f5;
  --pg-field-border: #d2d2d2;
  --pg-field-bg: #ffffff;
  --pg-chip-bg: #e9ecef;

  &[data-theme='dark'] {
    --pg-bg: #17171b;
    --pg-panel: #26262b;
    --pg-border: #3a3a40;
    --pg-text: #e8e8ea;
    --pg-muted: #9a9aa2;
    --pg-stage: #f4f5f7;
    --pg-stage-dot: #d9dce1;
    --pg-code-bg: #101014;
    --pg-code-text: #e8e8ea;
    --pg-sidebar: #101014;
    --pg-sidebar-text: #cfcfd4;
    --pg-row-border: #303036;
    --pg-field-border: #4a4a52;
    --pg-field-bg: #1c1c20;
    --pg-chip-bg: #34343c;
  }

  display: flex;
  height: 100vh;
  overflow: hidden;
  background: var(--pg-bg);
  color: var(--pg-text);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const Sidebar = styled.aside`
  width: 240px;
  flex-shrink: 0;
  background: var(--pg-sidebar);
  color: var(--pg-sidebar-text);
  padding: 20px 0;
  overflow-y: auto;
`;

const BrandRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px 16px;
`;

const Brand = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #fff;
`;

const ThemeToggle = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 16px;
  color: #fff;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const Group = styled.div`
  margin-bottom: 8px;
`;

const GroupTitle = styled.div`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #9e9e9e;
  padding: 10px 20px 4px;
`;

const NavItem = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  color: inherit;
  font-size: 14px;
  padding: 8px 20px;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
  &[data-active='true'] {
    background: #fb5b5b;
    color: #fff;
    font-weight: 600;
  }
`;

// 부모 컴포넌트 아래 들여쓰기되는 하위(유틸) 항목
const NavSubItem = styled(NavItem)`
  padding-left: 36px;
  font-size: 13px;
  color: #b7b7bd;
`;

const Main = styled.main`
  flex: 1;
  padding: 32px 40px;
  overflow-y: auto;
`;

const MainHead = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;

  h1 {
    font-size: 22px;
    font-weight: 700;
  }
`;

const Category = styled.span`
  font-size: 12px;
  color: var(--pg-muted);
  background: var(--pg-chip-bg);
  padding: 2px 8px;
  border-radius: 10px;
`;

const UrlHint = styled.code`
  font-size: 12px;
  color: var(--pg-muted);
`;

const Stage = styled.div`
  background: var(--pg-stage);
  border: 1px solid var(--pg-border);
  border-radius: 8px;
  min-height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  margin-bottom: 20px;
  background-image: radial-gradient(var(--pg-stage-dot) 1px, transparent 1px);
  background-size: 16px 16px;
  color: #212529;
`;

const StageInner = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.div`
  background: var(--pg-panel);
  border: 1px solid var(--pg-border);
  border-radius: 8px;
  padding: 16px 20px;
`;

const PanelHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 12px;
`;

const ResetBtn = styled.button`
  font-size: 12px;
  border: 1px solid var(--pg-field-border);
  background: var(--pg-field-bg);
  color: var(--pg-text);
  border-radius: 5px;
  padding: 3px 10px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

const CopyBtn = styled.button`
  font-size: 12px;
  border: 1px solid var(--pg-field-border);
  background: var(--pg-field-bg);
  color: var(--pg-text);
  border-radius: 5px;
  padding: 3px 12px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  &[data-copied='true'] {
    background: #87ba73;
    border-color: #87ba73;
    color: #fff;
  }
`;

const Empty = styled.div`
  font-size: 13px;
  color: var(--pg-muted);
`;

const ErrorNote = styled.div`
  font-size: 13px;
  color: #fff;
  background: #d13936;
  padding: 6px 12px;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-top: 1px solid var(--pg-row-border);

  input[type='text'],
  input[type='number'] {
    border: 1px solid var(--pg-field-border);
    background: var(--pg-field-bg);
    color: var(--pg-text);
    border-radius: 5px;
    padding: 5px 8px;
    font-size: 13px;
    width: 100%;
    max-width: 220px;
  }
`;

const JsonRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px 0;
  border-top: 1px solid var(--pg-row-border);

  .json-editor {
    width: 100%;
    min-height: 200px;
    resize: vertical;
    border: 1px solid var(--pg-field-border);
    background: var(--pg-field-bg);
    color: var(--pg-text);
    border-radius: 5px;
    padding: 8px 10px;
    font-size: 12px;
    font-family: 'SFMono-Regular', Consolas, monospace;
    line-height: 1.5;
  }
`;

const RowLabel = styled.div`
  width: 128px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  font-size: 13px;
  font-family: monospace;
  color: var(--pg-muted);
`;

const RowField = styled.div`
  flex: 1;
`;

const Segmented = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const SegItem = styled.button`
  font-size: 12px;
  border: 1px solid var(--pg-field-border);
  background: var(--pg-field-bg);
  color: var(--pg-text);
  border-radius: 5px;
  padding: 4px 10px;
  cursor: pointer;

  &[data-active='true'] {
    background: #3e3e3e;
    color: #fff;
    border-color: #3e3e3e;
  }
`;

const PropsReadout = styled.div`
  margin-top: 16px;
  border-top: 1px solid var(--pg-row-border);
  padding-top: 12px;

  span {
    font-size: 12px;
    color: var(--pg-muted);
  }
  pre {
    margin: 6px 0 0;
    background: var(--pg-code-bg);
    color: var(--pg-code-text);
    border-radius: 6px;
    padding: 10px 12px;
    font-size: 12px;
    overflow-x: auto;
  }
`;

export default Playground;
