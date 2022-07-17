import React from 'react';
import Work from './page/Work';
import Config from './page/Config';
import System from './page/System';
import Sync from './page/Sync';
import Macro from './page/Macro';

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
 * @param {Integer} userRole(option)
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
    link: '/2',
    component: <Work />,
    menuRole: 3,
  },
  {
    title: '글자가 늘어나면',
    link: '/',
    component: <Work />,
    menuRole: 3,
  },
  {
    title: '설정',
    link: 'config',
    routePath: 'config/*',
    component: <Config />,
    menuRole: 1,
    subMenu: [
      {
        id: 5_1,
        title: '업무 등록',
        link: '/work',
        routePath: 'work',
        component: <System />,
      },
      {
        id: 5_2,
        title: '테이블 동기화',
        link: '/sync',
        routePath: 'sync',
        component: <Sync />,
      },
      {
        id: 5_3,
        title: '매크로 설정',
        link: '/macro',
        routePath: 'macro',
        component: <Macro />,
        subMenu: [
          {
            id: 5_4,
            title: '업무 등록1',
            link: '/work',
            routePath: 'work',
            component: <System />,
          },
          {
            id: 5_5,
            title: '테이블 동기화2',
            link: '/sync',
            routePath: 'sync',
            component: <Sync />,
          },
          {
            id: 5_6,
            title: '매크로 설정3',
            link: '/macro',
            routePath: 'macro',
            component: <Macro />,
          },
        ],
      },
    ],
  },
];
