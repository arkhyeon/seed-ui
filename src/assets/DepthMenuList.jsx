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
 * @param {String} title
 * 메뉴에 들어갈 텍스트, map key 역할[unique]
 * @param {String} link(option)
 * URL Path
 * NavLink to={link}
 * routePath가 없으면 link가 routePath로 설정
 * @param {String} routePath(option)
 * routePath
 * Route path={routePath}
 * @param {component} component(option)
 * 해당 URL에 보여줄 컴포넌트
 * Route element={component}
 * @param {int} userRole(option)
 * 권한 체크
 * userRole(ulevel)이 menuRole보다 작다면 활성화
 * ex ) userRole[1] > menuRole[3] >> 활성화
 *      userRole[3] > menuRole[1] >> 비활성
 * @param {Array} subMenu(option)
 *  - 해당 메뉴 하위로 나올 메뉴
 *
 * @return
 * function CreateMenu = title, link, subMenu 사용
 * function setRoute   = title, link, subMenu, component 사용
 */
export const DepthList1 = [
  {
    title: '작업',
    link: 'work',
    component: <Work />,
    menuRole: 3,
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
        subMenu: [
          {
            title: '테이블 설정',
            link: '/config/work/table',
            routePath: 'table',
            isPublic: true,
            component: <ConfigSyncTable />,
            display: true,
          },
          {
            title: '동기화 설정',
            link: '/config/work/csync',
            routePath: 'csync',
            menuRole: 1,
            component: <ConfigSync />,
            display: true,
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
