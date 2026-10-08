// 플레이그라운드 컴포넌트 문서 내용 (컴포넌트 이름 → 문서)
// summary   : 무엇을 하는지 한 문장
// whenToUse : 언제 쓰는지
// props     : Controls로 조절 못 하는 props (Controls 항목은 자동으로 Props 표에 들어감)
//             [{ name, type, desc, optional? }]
// notes     : 주의
// badge     : 'NEW' | 'UPDATE' — 사이드바 메뉴 스티커 (신기능·기능 추가)

const fn = (name, type, desc, optional) => ({ name, type, desc, optional });

const COMPONENT_DOCS = {
  // ─── Buttons ─────────────────────────────────
  BlackButton: {
    summary: '화면의 주요 동작(저장·확인·조회)에 쓰는 검정 버튼입니다.',
    whenToUse: ['한 화면에서 가장 중요한 동작 하나', '모달 하단의 확인·저장'],
    props: [fn('onClick', '(e) => void', '눌렀을 때 실행')],
    notes: ['한 영역에 검정 버튼은 하나만 두고, 나머지는 WhiteButton으로 구분하세요.'],
  },
  WhiteButton: {
    summary: '보조 동작(취소·닫기·초기화)에 쓰는 흰 버튼입니다.',
    whenToUse: ['검정 버튼 옆의 취소·닫기', '여러 개를 나란히 둘 일반 동작'],
    props: [fn('onClick', '(e) => void', '눌렀을 때 실행')],
  },
  RadioButton: {
    summary: '여러 값 중 하나를 버튼 묶음 모양으로 고르는 선택 버튼입니다.',
    whenToUse: ['보기 방식(목록/그리드/차트)처럼 2~4개 중 하나를 바로 바꿀 때'],
    props: [
      fn('defaultValue', 'string', '처음 선택된 값'),
      fn('setValue', '(value) => void', '선택이 바뀌면 호출'),
    ],
  },
  SwitchButton: {
    summary: '라벨이 붙은 켜기/끄기 스위치입니다.',
    whenToUse: ['설정을 바로 켜고 끌 때 (저장 버튼 없이 즉시 반영)'],
    props: [
      fn('id', 'string', '라벨과 스위치를 연결하는 고유 id'),
      fn('checked', 'boolean', '켜짐 여부'),
      fn('onChange', '(e) => void', '바뀌면 호출 (e.target.checked)'),
    ],
  },

  // ─── Selection ───────────────────────────────
  Radio: {
    summary: '목록 중 하나를 고르는 라디오 버튼 묶음입니다.',
    whenToUse: ['선택지를 모두 펼쳐 보여주고 하나만 고르게 할 때'],
    props: [
      fn('list', 'Array<{ value, label }>', '선택지 목록'),
      fn('value', 'any', '선택된 값'),
      fn('setValue', '(value) => void', '선택이 바뀌면 호출'),
    ],
  },
  Switch: {
    summary: '라벨 없는 작은 켜기/끄기 스위치입니다.',
    whenToUse: ['표 안, 카드 구석처럼 공간이 좁은 곳의 on/off'],
    props: [fn('value', 'boolean', '켜짐 여부'), fn('setValue', '(value) => void', '바뀌면 호출')],
  },
  Toggle: {
    summary: '붙어 있는 버튼 중 하나를 고르는 탭형 토글입니다.',
    whenToUse: ['전체/활성/비활성처럼 목록을 걸러 볼 때'],
    props: [
      fn('value', 'number', '선택된 항목 번호 (1부터)'),
      fn('setValue', '(value) => void', '선택이 바뀌면 호출'),
    ],
  },

  // ─── Inputs ──────────────────────────────────
  TextInput: {
    summary: '한 줄 글자 입력칸입니다.',
    whenToUse: ['이름·검색어처럼 짧은 글자 입력'],
    props: [
      fn('value', 'string', '입력값 (제어 컴포넌트로 쓸 때)', true),
      fn('onChange', '(e) => void', '입력할 때마다 호출', true),
    ],
    notes: ['input 기본 속성(type, onKeyDown 등)은 그대로 전달됩니다.'],
  },
  PasswordInput: {
    summary: '눈 아이콘으로 보이기/숨기기를 바꿀 수 있는 비밀번호 입력칸입니다.',
    whenToUse: ['로그인, 접속 정보 등록처럼 비밀번호를 받을 때'],
    props: [fn('onChange', '(e) => void', '입력할 때마다 호출', true)],
  },
  LabelCheckBox: {
    badge: 'UPDATE',
    summary: '라벨이 붙은 체크박스입니다. 크기를 px로 정할 수 있습니다.',
    whenToUse: ['동의·사용 여부처럼 켜고 끄는 선택', '표 안 작은 체크 (size로 줄여서)'],
    props: [
      fn(
        'id',
        'string',
        '라벨 클릭과 체크박스를 연결하는 id. 다른 label의 htmlFor로도 연결 가능',
        true,
      ),
      fn('checked', 'boolean', '체크 여부'),
      fn('onChange', '(e) => void', '바뀌면 호출 (e.target.checked)'),
    ],
  },
  Count: {
    summary: '− / + 버튼으로 숫자를 올리고 내리는 입력칸입니다.',
    whenToUse: ['개수·순서처럼 범위가 정해진 정수 입력'],
    props: [fn('value', 'number', '현재 값'), fn('onChange', '(value) => void', '바뀌면 호출')],
  },
  DataList: {
    summary: '목록에서 고르거나, 입력하면서 걸러 고르는 선택칸입니다.',
    whenToUse: ['선택지가 많아 검색이 필요한 드롭다운'],
    props: [
      fn('defaultValue', 'string', '처음 값'),
      fn('setData', '(value) => void', '선택이 바뀌면 호출'),
    ],
  },
  CustomTextArea: {
    summary: '여러 줄 입력칸입니다. sql 모드로 쓰면 코드 에디터가 됩니다.',
    whenToUse: ['설명·메모 입력', 'SQL 쿼리 작성 (mode: sql)'],
    props: [
      fn('textAreaOption', '{ height, placeholder, value, onChange }', '일반 입력 모드 설정', true),
      fn('sqlAreaOption', '{ value, height, onChange }', 'SQL 에디터 모드 설정', true),
    ],
    notes: ['탭 문자를 붙여넣으면 공백으로 바뀝니다.'],
  },
  InputGrid: {
    summary: '제목 | 입력칸 형태의 등록 폼을 줄 맞춰 그려 줍니다.',
    whenToUse: ['등록·수정 화면의 항목 나열'],
    props: [fn('list', 'Array<{ subject, content }>', '줄 목록. content에 입력 컴포넌트(JSX)')],
  },

  // ─── Date & Time ─────────────────────────────
  DatePicker: {
    summary: '달력에서 날짜 하나를 고르는 입력칸입니다.',
    whenToUse: ['기준일·예약일처럼 날짜 하나'],
    props: [fn('date', 'Date', '선택된 날짜'), fn('setDate', '(date) => void', '바뀌면 호출')],
  },
  RangeDatePicker: {
    summary: '시작일~종료일 기간을 고르는 달력입니다. 시간 입력도 붙일 수 있습니다.',
    whenToUse: ['조회 기간, 작업 기간 지정'],
    props: [
      fn('startDt / endDt', 'string', '시작·종료일'),
      fn('setStartDt / setEndDt', '(value) => void', '바뀌면 호출'),
      fn('onApply', '(start, end) => void', 'useApply일 때 적용 버튼을 누르면 호출', true),
    ],
  },
  TimePicker: {
    summary: '시·분을 스크롤해서 고르는 시간 선택칸입니다.',
    whenToUse: ['실행 시각, 예약 시간 입력'],
    props: [
      fn('time', "string ('HH:mm')", '선택된 시간'),
      fn('onChange', '(time) => void', '바뀌면 호출'),
    ],
  },

  // ─── Feedback ────────────────────────────────
  Tooltip: {
    summary: '마우스를 올리면 감싼 요소 옆에 짧은 설명을 띄웁니다.',
    whenToUse: ['아이콘 버튼 이름, 잘린 글자 전체 보기'],
    props: [fn('children', 'ReactNode', '마우스를 올릴 대상')],
  },
  HelpIcon: {
    badge: 'UPDATE',
    summary: '? / ! 아이콘입니다. 마우스를 올리면 도움말을 띄우거나, 누르면 가이드투어를 엽니다.',
    whenToUse: [
      '입력 항목 옆 짧은 도움말 (message)',
      '화면 사용법 안내 시작 버튼 (onClick + GuideTour)',
    ],
    props: [fn('onClick', '() => void', '있으면 버튼으로 렌더. 보통 GuideTour 열기', true)],
  },
  GuideTour: {
    badge: 'NEW',
    summary: '화면을 어둡게 덮고 설명할 곳만 밝게 비추며 단계별로 사용법을 안내합니다.',
    whenToUse: ['처음 쓰는 사람이 헷갈리는 화면의 사용법 안내', '? 아이콘(HelpIcon)과 함께'],
    props: [
      fn('open', 'boolean', '표시 여부'),
      fn(
        'steps',
        'Array<{ target, title, content, onEnter?, onLeave? }>',
        '단계 목록. target은 tourTarget으로 지정',
      ),
      fn('onClose', '() => void', '닫기(×·Esc)·완료 시 호출'),
    ],
    notes: [
      'steps는 useMemo 또는 모듈 상수로 고정하세요. 렌더마다 새 배열이면 처음 단계로 돌아갑니다.',
      '키보드: Esc 닫기, → / Enter 다음, ← 이전.',
    ],
  },
  Popover: {
    badge: 'NEW',
    summary: '버튼을 누르면 버튼 옆에 작은 창을 띄웁니다. 바깥을 누르거나 Esc를 누르면 닫힙니다.',
    whenToUse: [
      '보기 옵션·필터처럼 화면을 가리지 않고 잠깐 여는 설정',
      '모달까지 띄우기엔 가벼운 선택·입력',
    ],
    props: [
      fn('trigger', 'ReactNode', '기본 버튼 안 내용 (아이콘 + 글자)', true),
      fn(
        'renderTrigger',
        '({ open, toggle, close }) => ReactNode',
        '버튼을 직접 그릴 때 (WhiteButton 등)',
        true,
      ),
      fn('triggerTitle', 'string', '기본 버튼에 마우스를 올리면 뜨는 설명', true),
      fn(
        'children',
        'ReactNode | ({ close }) => ReactNode',
        '창 안 내용. 함수면 close를 받아 고른 뒤 닫기',
      ),
      fn('keepOpen', 'boolean', 'true면 바깥 클릭·Esc로 안 닫힘 (가이드 투어 중 등)', true),
      fn('open / onOpenChange', 'boolean / (open) => void', '열림 상태를 밖에서 관리할 때', true),
    ],
    notes: [
      'Esc는 EscStack에 등록돼 모달 위에서도 가장 나중에 연 창부터 닫힙니다.',
      '창 안 제목·항목은 PopoverTitle·PopoverItem을 쓰면 다른 메뉴와 모양이 맞습니다.',
    ],
  },
  MenuButton: {
    badge: 'NEW',
    summary: '누르면 고를 목록을 띄우는 버튼입니다. 항목이 1개면 목록 없이 바로 실행합니다.',
    whenToUse: [
      '정렬 방식처럼 여러 동작 중 하나를 고를 때',
      '대상(서버 등)이 여러 개일 때만 고르게 하고, 하나면 바로 실행할 때',
    ],
    props: [
      fn('options', 'Array', '고를 항목 목록'),
      fn('onSelect', '(option, index) => void', '항목을 고르면 호출 (1개면 버튼 누를 때 바로)'),
      fn(
        'getLabel',
        '(option, index) => ReactNode',
        '항목 표시 글자. 기본 option.label ?? option',
        true,
      ),
      fn('getKey', '(option, index) => key', '항목 key. 기본 option.key ?? index', true),
      fn('ButtonComponent', 'Component', '버튼 컴포넌트. 기본 WhiteButton', true),
    ],
    notes: ['목록 모양은 Popover와 같습니다 (PopoverItem 사용).'],
  },
  Modal: {
    summary: '화면 위에 띄우는 대화상자입니다. ESC로 닫히고 헤더를 잡고 옮길 수 있습니다.',
    whenToUse: ['등록·수정 폼, 확인이 필요한 작업'],
    props: [
      fn('handleClose', '() => void', '닫기(×·ESC·취소)'),
      fn('callback', '() => void', '확인 버튼', true),
      fn('buttonList', 'ReactNode[]', '하단 버튼 직접 지정', true),
      fn('children', 'ReactNode', '본문'),
    ],
    notes: [
      '모달 위에 모달을 열 때는 자식이 아니라 형제로 렌더하세요. ESC는 위에 있는 것부터 닫힙니다.',
    ],
  },
  ToastNotify: {
    summary: '화면 구석에 잠깐 뜨는 알림(성공·실패)과 확인창(confirm)입니다.',
    whenToUse: ['저장 성공·실패 알림', '삭제 전 확인 (await CLM.confirm)'],
    props: [
      fn('CLM.alertSuccess(message)', 'function', '성공 알림'),
      fn('CLM.alertError(message)', 'function', '실패 알림'),
      fn('CLM.confirm({ title, message, buttons? })', 'Promise<boolean>', '확인창. 확인이면 true'),
    ],
    notes: ['<ToastNotify />는 앱 최상단에 한 번만 렌더합니다.'],
  },

  // ─── Navigation ──────────────────────────────
  Pagination: {
    summary: '페이지 번호 버튼으로 목록 페이지를 넘깁니다.',
    whenToUse: ['서버에서 페이지 단위로 받아오는 목록'],
    props: [
      fn('currentPage', 'number', '현재 페이지 (1부터)'),
      fn('pageEvent', '(page) => void', '페이지를 누르면 호출'),
    ],
  },
  SideTabs: {
    summary:
      '화면 왼쪽 세로 탭 메뉴입니다. 위 메인 버튼 + 스크롤되는 그룹 탭 + 아래 고정 탭으로 구성됩니다.',
    whenToUse: ['그룹·프로젝트 목록을 왼쪽에 두고 고르는 화면'],
    props: [
      fn('MainTabButton', 'component', '맨 위 메인 버튼'),
      fn('SideScrollWrap', 'component', '스크롤되는 탭 영역'),
      fn('TabButton', '{ value, onClick }', '탭 하나. value로 selectSideTab과 연결'),
    ],
  },

  // ─── Layout ──────────────────────────────────
  Accordion: {
    summary: '제목을 누르면 본문이 접히고 펼쳐지는 영역입니다.',
    whenToUse: ['자주 안 보는 상세 설정 숨기기'],
    props: [
      fn('collapse', 'boolean', '접힘 여부'),
      fn('setCollapse', '(value) => void', '바뀌면 호출'),
      fn('children', 'ReactNode', '본문'),
    ],
  },
  DividingLine: {
    summary: '영역을 나누는 가로 구분선입니다.',
    whenToUse: ['폼 안 묶음 구분'],
  },
  Card: {
    summary: '제목과 본문으로 된 카드입니다. 여러 카드를 한 번에 접고 펼 수 있습니다.',
    whenToUse: ['대시보드 위젯, 정보 묶음'],
    props: [
      fn('Card.Header / Card.Body', 'component', '카드 제목·본문'),
      fn(
        'isAllCollapse / setIsAllCollapse',
        'boolean / function',
        '여러 카드 전체 접기 상태 공유',
        true,
      ),
    ],
  },

  // ─── Data ────────────────────────────────────
  Counter: {
    summary: '0부터 목표 숫자까지 올라가는 숫자 애니메이션입니다.',
    whenToUse: ['대시보드 건수 강조'],
  },
  CountList: {
    summary: '추가·삭제할 수 있는 값 목록과 그 개수를 보여 줍니다.',
    whenToUse: ['IP·서버처럼 여러 값을 직접 입력받는 칸'],
    props: [
      fn('labelList', 'string[]', '값 목록'),
      fn('setLabelList', '(list) => void', '추가·삭제 시 호출'),
    ],
  },
  LabelList: {
    summary: '여러 항목을 라벨 모양으로 나열하고 눌러서 여러 개 고릅니다.',
    whenToUse: ['그룹·태그 다중 선택'],
    props: [
      fn('selectedValueList', 'string[]', '선택된 값'),
      fn('setSelectedValueList', '(list) => void', '선택이 바뀌면 호출'),
    ],
  },

  // ─── Menu ────────────────────────────────────
  HeaderCreator: {
    summary: '메뉴 데이터로 상단 헤더 메뉴를 그려 줍니다. 권한에 따라 메뉴를 걸러 냅니다.',
    whenToUse: ['앱 상단 메뉴'],
    props: [
      fn('logoSetting', '{ logo, logoLink }', '로고와 클릭 시 이동 경로'),
      fn('children', 'ReactNode', '헤더 오른쪽 위젯 영역', true),
    ],
  },
  AsideCreator: {
    summary: '메뉴 데이터로 왼쪽 사이드 메뉴를 그려 줍니다.',
    whenToUse: ['관리 화면처럼 하위 메뉴가 많은 페이지'],
    props: [
      fn('logoSetting', '{ logo, logoLink }', '로고', true),
      fn('children', 'ReactNode', '메뉴 오른쪽 본문'),
    ],
  },

  // ─── Utility / Media ─────────────────────────
  DNDWrapper: {
    summary: '목록 항목을 끌어서 순서를 바꾸게 해 주는 감싸개입니다.',
    whenToUse: ['우선순위·표시 순서 변경'],
    props: [
      fn('itemList', 'Array', '전체 목록'),
      fn('setItemList', '(list) => void', '순서가 바뀌면 호출'),
      fn('seq', 'number', '이 항목의 순서 (index)'),
    ],
    notes: ['key는 index가 아니라 항목의 고유값(id)을 쓰세요.'],
  },
  Slider: {
    summary: '여러 화면을 좌우로 넘기는 슬라이드입니다. 자동 재생을 지원합니다.',
    whenToUse: ['공지·배너 순환'],
    props: [fn('itemList', 'ReactNode[]', '슬라이드 목록')],
  },
  OptionCard: {
    summary: '옵션 이름·설명과 입력칸을 한 카드에 묶은 설정 항목입니다.',
    whenToUse: ['설정 화면의 옵션 하나하나'],
    props: [
      fn('config', '{ key, type, name, desc }', '옵션 정의 (type = 입력 위젯 종류)'),
      fn('option', '{ key, val }', '현재 값'),
      fn('setOption', '(updater) => void', '값이 바뀌면 호출'),
    ],
  },

  // ─── 문서 페이지 (함수) ──────────────────────
  tourTarget: { badge: 'NEW' },
};

export default COMPONENT_DOCS;
