import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';

/**
 * Route Component를 props에 맞게 자동 생성(재귀 SubRoute())
 * @param {[{component, menuRole: number, link: string, title: string},{component, menuRole: number, link: string, title: string},{subMenu: [{routePath: string, component, menuRole: number, link: string, icon, title: string},{routePath: string, subMenu: [{routePath: string, component, link: string, title: string},{routePath: string, component, link: string, title: string}], link: string, icon, title: string},{routePath: string, subMenu: [{routePath: string, component, link: string, title: string},{routePath: string, component, link: string, title: string},{routePath: string, subMenu: [{routePath: string, component, link: string, title: string},{routePath: string, component, link: string, title: string},{routePath: string, component, link: string, title: string}], link: string, title: string}], link: string, icon, title: string}], menuRole: number, link: string, icon, title: string}]} props
 * @param {int} auth(option)
 * 권한 체크
 * auth(ulevel)이 menuRole보다 작다면 활성화
 * ex ) auth[1] > menuRole[3] >> 활성화
 *      auth[3] > menuRole[1] >> 비활성
 * @returns
 * Route Component
 */
export function SetRoute(props, role = 'n') {
  return <>{props.map(route => SubRoute(route, role))}</>;
}

/**
 * @param {Object} route
 * @param {int} depth
 * depth Level
 * @returns
 * Route Component
 */
function SubRoute(route, role, depth = 0) {
  const { component, link = '', title, subMenu = [], routePath, menuRole, isPublic } = route;

  // isPublic이 아니면서, menuRole이 0일때만 경로 생성 방지
  if (role === 'n') {
    if (!isPublic && menuRole !== undefined && menuRole < 1) {
      return null;
    }
  }

  return (
    <Route path={routePath || link} element={component} key={title}>
      {subMenu.length > 0 && subMenu.map(child => SubRoute(child, role, depth + 1))}
    </Route>
  );
}
