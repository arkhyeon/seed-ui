import React from 'react';
import Work from './Work';
import Project from './Project';
import ConfigWork from './ConfigWork';
import ConfigSyncTable from './ConfigSyncTable';
import ConfigSync from './ConfigSync';
import MacroRegister from './MacroRegister';
import MacroDashboard from './MacroDashboard';
import TextAreaTestArea from './TextAreaTestArea';
import Testing from '../components/Testing';
import Test1Table from './test1';
import Test2Table from './test2';

/**
 * DepthMenuList.jsx
 *
 * 메뉴 구조를 정의하는 파일입니다.
 * 각 메뉴 아이템 객체는 다음과 같은 속성을 가질 수 있습니다.
 *
 * @param {String} title - 메뉴에 표시될 텍스트. React 리스트 렌더링 시 `key`로도 사용됩니다. (필수, 고유값)
 * @param {String} link - 메뉴 클릭 시 이동할 URL 경로. `NavLink`의 `to` 속성에 사용됩니다.
 * @param {String} routePath - (옵션) React Router의 `<Route>` `path` 속성에 사용될 경로. 지정하지 않으면 `link` 값이 사용됩니다.
 * @param {React.Component} component - (옵션) 해당 경로에 렌더링될 React 컴포넌트.
 * @param {Array} subMenu - (옵션) 하위 메뉴를 정의하는 메뉴 아이템 객체의 배열.
 * @param {Number} menuRole - (옵션) 메뉴에 접근하기 위한 권한 레벨. `RouteGenerator`와 `canShowMenu`에서 사용됩니다.
 * @param {Boolean} display - (옵션) `false`로 설정 시, `canShowMenu`가 항상 `false`를 반환하여 메뉴가 숨겨집니다.
 * @param {Boolean} isPublic - (옵션) `true`로 설정 시, `menuRole`에 관계없이 항상 메뉴가 보이고 접근 가능하게 됩니다.
 */
export const DepthList1 = [
  {
    title: '작업',
    link: 'work',
    component: <Work />,
    // menuRole: 3,
  },
  {
    title: '테스팅',
    link: 'testing',
    component: <Testing />,
    isPublic: true, // isPublic: true 이면 menuRole이 없거나 0이라도 항상 보이고 접속 가능
  },
  {
    title: '프로젝트',
    link: 'project',
    component: <Project />,
    menuRole: 3,
  },
  {
    title: '설정',
    link: 'config',
    subMenu: [
      {
        title: '작업 설정',
        link: '/config/work',
        routePath: 'work',
        component: <Project />,
        subMenu: [
          {
            title: '테이블 설정',
            link: '/config/work/table',
            routePath: 'table',
            component: <ConfigSyncTable />,
            display: false,
          },
          {
            title: '동기화 설정',
            link: '/config/work/csync',
            routePath: 'csync',
            menuRole: 1,
            component: <ConfigSync />,
            display: false,
          },
        ],
      },
      {
        title: '테이블 동기화',
        link: '/config/sync',
        routePath: 'sync',
        subMenu: [
          {
            title: '테이블 설정',
            link: '/config/sync/table',
            routePath: 'table',
            component: <Test1Table />,
            display: true,
            menuRole: 1,
          },
          {
            title: '동기화 설정',
            link: '/config/sync/csync',
            routePath: 'csync',
            component: <Test2Table />,
            display: true,
            menuRole: 1,
          },
          {
            title: 'textAreaTestArea',
            link: '/config/sync/textAreaTestArea',
            routePath: 'textAreaTestArea',
            component: <TextAreaTestArea />,
            display: true,
            menuRole: 1,
          },
        ],
      },
      {
        title: '매크로',
        link: '/config/macro',
        routePath: 'macro',
        menuRole: 1,
        subMenu: [
          {
            title: '매크로 등록',
            link: '/config/macro/register',
            routePath: 'register',
            component: <MacroRegister />,
            display: false,
            menuRole: 1,
          },
          {
            title: '대시보드',
            link: '/config/macro/dashboard',
            routePath: 'dashboard',
            component: <MacroDashboard />,
            display: false,
            menuRole: 1,
          },
          {
            title: '명령어',
            link: '/config/macro/command',
            routePath: 'command',
            component: <Work />,
            display: false,
            menuRole: 1,
          },
        ],
      },
    ],
  },
];
