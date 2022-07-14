import React, { Fragment, useState } from 'react';
import { NavLink, Route } from 'react-router-dom';
import styled from '@emotion/styled';

/**
 * @param {Array} menus
 * EX) Auth : {userLevel === "1" ? [AdminArray] : [UserArray]}
 *      OR
 *     Common : {[Array]}
 * @param {Boolean} useDepth
 * 사이드 메뉴 사용할 때 Depth를 사용할 것인지 아닌지
 * true : Depth 이용 메뉴
 * false : Depth 없이 메뉴
 * @param {String} color
 * @param {String} fontColor
 * EX) {"#0b2444"} Or {"red"}
 *      If a color value exists, use the color value first.
 *      If not, use the theme provider color
 *      color 값 O > color 이용
 *      color 값 X > theme provider color 이용
 *      theme provider 사용 시 테마 색을 먼저 이용합니다.
 * @param {String} size
 * EX) {"WidthPadding HeightPaaing"} => {"13px 40px"}
 * @param {Integer} userRole(option)
 * 권한 체크
 * userRole(ulevel)이 menuRole보다 작다면 활성화
 * ex ) userRole[1] > menuRole[3] >> 활성화
 *      userRole[3] > menuRole[1] >> 비활성
 *
 * @returns {JSX.Element} Menu Component
 */

const CreateMenu = (props) => {
  const menus = props.menus;
  const [selectedMenus, setSelectedMenus] = useState([]);

  const handleMenuSelection = (label, depth) => {
    setSelectedMenus((selectedMenus) => {
      const newSelectedMenus = [...selectedMenus];
      newSelectedMenus.length = depth;
      if (label !== '') {
        newSelectedMenus[depth] = label;
      }
      return newSelectedMenus;
    });
  };

  return (
    <>
      {/*<CreateMenu.List onMouseLeave={() => setSelectedMenus([])}>*/}
      <CreateMenu.List>
        {menus.map((menu) => {
          return (
            <SubMenuItem
              menu={menu}
              handleMenuSelection={handleMenuSelection}
              key={menu.title}
              selectedMenus={selectedMenus}
              bgColor={props.bgColor}
              bgHoverColor={props.bgHoverColor}
              fontColor={props.fontColor}
              size={props.size}
              hoverSize={props.hoverSize}
              useDepth={props.useDepth}
              userRole={props.userRole}
            />
          );
        })}
      </CreateMenu.List>
    </>
  );
};

/**
 * @param {Object} menu
 * The object from the repeated sentence.
 * 반복문에서 나온 객체
 * @param {Function} handleMenuSelection
 * Where's my mouse?
 * 어디에 hover 되었는가?
 * @param {Function} selectedMenus
 * useState setState Function
 * 상태 관리
 * @param {Boolean} useDepth
 * 사이드 메뉴 사용할 때 Depth를 사용할 것인지 아닌지
 * true : Depth 이용 메뉴 [default]
 * false : Depth없이 메뉴
 * @param {String} color
 * @param {String} fontColor
 * Color assigned from the outside.
 * CreateMenu 선언부 props에서 할당된 색
 * @param {String} size
 * EX) {"WidthPadding HeightPaaing"} => {"13px 40px"}
 * @param {Integer} userRole(option)
 * 권한 체크
 * userRole(ulevel)이 menuRole보다 작다면 활성화
 * ex ) userRole[1] > menuRole[3] >> 활성화
 *      userRole[3] > menuRole[1] >> 비활성
 * @param {int} depth
 * depth Level
 * @returns {JSX.Element} Menu Unit Component
 */
const SubMenuItem = ({
  menu,
  handleMenuSelection,
  selectedMenus,
  bgColor,
  bgHoverColor,
  fontColor,
  size,
  hoverSize,
  userRole,
  useDepth,
  depth = 0,
}) => {
  const { title, link = '', subMenu = [], menuRole = 99 } = menu;

  if (userRole > menuRole) {
    return null;
  }

  return (
    <>
      {subMenu.length > 0 && useDepth ? (
        <SubMenuItem.Item
          bgColor={bgColor}
          bgHoverColor={bgHoverColor}
          fontColor={fontColor}
          size={size}
          hoverSize={hoverSize}
        >
          <NavLink
            to={link}
            onMouseEnter={() => handleMenuSelection(title, depth)}
            onClick={(event) => event.preventDefault()}
            style={{ cursor: 'default' }}
            bgColor={bgColor}
          >
            {title}
          </NavLink>
          {selectedMenus[depth] === title && (
            <SubMenuItem.List depth={depth} className="subMenuItem" bgColor={bgColor}>
              {subMenu.map((child, i) => {
                const childDepth = depth + 1;
                return (
                  <SubMenuItem
                    menu={child}
                    handleMenuSelection={handleMenuSelection}
                    key={`sub-${title}-${i}`}
                    depth={childDepth}
                    selectedMenus={selectedMenus}
                    bgColor={bgColor}
                    fontColor={fontColor}
                    size={size}
                  />
                );
              })}
            </SubMenuItem.List>
          )}
        </SubMenuItem.Item>
      ) : (
        <SubMenuItem.Item
          bgColor={bgColor}
          fontColor={fontColor}
          size={size}
          onMouseEnter={() => handleMenuSelection('', depth)}
          onClick={() => handleMenuSelection('', 0)}
          className="mainActive"
        >
          <NavLink to={link}>{title}</NavLink>
        </SubMenuItem.Item>
      )}
    </>
  );
};

CreateMenu.List = styled.ul`
  display: flex;
  justify-content: center;
  //gap
  gap: 20px;

  & > li {
    & > a {
      width: fit-content;
      border-radius: 5px;
      //size
      margin: calc(14.5px - 5.5px) 0px;
      //size
      padding: 5.5px 35px;
    }
  }
`;

SubMenuItem.List = styled.ul`
  & li {
    border-bottom: 1px solid ${({ bgColor }) => bgColor};
  }

  & li:nth-of-type(1) {
    border-top: 1px solid ${({ bgColor }) => bgColor};
  }
  & > li > a {
    float: left;
  }
  position: absolute;
  opacity: 0.95;
  transition: 0.5s;
  flex-direction: column;
  display: flex;
  .subMenuItem {
    width: 100%;
    left: 100%;
    float: left;
    margin-top: -1px;
  }
`;

SubMenuItem.Item = styled.li`
  &:hover > a,
  & .active,
  .subMenuItem &:active > a,
  &.mainActive:active > a {
    color: ${({ fontColor }) => fontColor};
    background: ${({ bgHoverColor }) => bgHoverColor};
  }

  & a {
    display: block;
    color: ${({ fontColor }) => fontColor};
    background-color: ${(props) => {
      console.log(props);
      return props.bgColor;
    }};
  }

  & ul li a {
    padding: ${(props) => props.size || '10px 40px'};
    font-size: 0.9rem;
    //hoverSize
    width: 200px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

/**
 * Route Component를 props에 맞게 자동 생성(재귀 SubRoute())
 * @param {Array{Object}} props
 * @param {Integer} auth(option)
 * 권한 체크
 * auth(ulevel)이 menuRole보다 작다면 활성화
 * ex ) auth[1] > menuRole[3] >> 활성화
 *      auth[3] > menuRole[1] >> 비활성
 * @returns
 * Route Component
 */
export const SetRoute = (props, auth) => {
  return (
    <>
      {props.map((route) => {
        if (auth > route.menuRole) {
          return '';
        }
        return SubRoute(route);
      })}
    </>
  );
};

/**
 *
 * @param {Object} route
 * @param {int} depth
 * depth Level
 * @returns
 * Route Component
 */
const SubRoute = (route, depth = 0) => {
  const { component, link = '', title, subMenu = [], routePath } = route;
  return (
    <Fragment key={title}>
      {subMenu.length > 0 ? (
        <Route path={routePath ? routePath : link} element={component}>
          {subMenu.map((child) => {
            const childDepth = depth + 1;
            return SubRoute(child, childDepth);
          })}
        </Route>
      ) : (
        <Route path={routePath ? routePath : link} element={component} />
      )}
    </Fragment>
  );
};

// export const setMsgRoute = () => {
// 	return (
// 		<Route path="Message" element={<Message />}>
// 			<Route path="MessageReceive" element={<MessageList />} />
// 			<Route path="MessageReceive/MessageDetail" element={<MessageDetail />} />
// 			<Route path="MessageDispatch" element={<MessageList />} />
// 			<Route path="MessageDispatch/MessageDetail" element={<MessageDetail />} />
// 			<Route path="MessageWrite" element={<MessageWrite />} />
// 		</Route>
// 	);
// };

export default CreateMenu;
