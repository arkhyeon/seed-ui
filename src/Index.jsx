import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import styled from '@emotion/styled';
import { DepthList1 } from './assets/DepthMenuList';
import { HeaderCreator } from './components';
import DateTimePicker from './components/DateTimePicker';
import DatePicker from './components/DatePicker';
import DateTimeBetweenPicker from './components/DateTimeBetweenPicker';
import DateBetweenPicker from './components/DateBetweenPicker';
import TimePicker from './components/TimePicker';
import Radio from './components/Radio';
import Switch from './components/Switch';
import Tooltip from './components/Tooltip';
import Toggle from './components/Toggle';
import Modal from './components/Modal';
import InputGrid from './components/InputGrid';
import Logo from './assets/Logo';
import { BlackButton } from './components/Button/Button';

function Index() {
  const [date1, setDate1] = useState(new Date());

  const [startDate1, setStartDate1] = useState(new Date());
  const [endDate1, setEndDate1] = useState(new Date());

  const [date2, setDate2] = useState(new Date());

  const [startDate2, setStartDate2] = useState(new Date());
  const [endDate2, setEndDate2] = useState(new Date());

  const offset = new Date().getTimezoneOffset() * 60000;

  const [currentTime, setCurrentTime] = useState('00:00');

  const [radio, setRadio] = useState(0);
  const [switch1, setSwitch1] = useState(true);
  const [switch2, setSwitch2] = useState(true);

  const [toggleValue, setToggleValue] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <HeaderCreator
        logoSetting={{
          logo: <Logo />,
          logoLink: '/',
        }}
        menuList={DepthList1}
        useDepth
        userRole={1}
      >
        <div>
          <NavLink to="children">Children</NavLink>
        </div>
      </HeaderCreator>

      <Outlet />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '400px',
          justifyContent: 'space-between',
        }}
      >
        <div>날짜 선택</div>
        <DatePicker date={date1} setDate={setDate1} />

        <div>시작, 종료 날짜 선택</div>
        <DateBetweenPicker
          startDate={startDate1}
          setStartDate={setStartDate1}
          endDate={endDate1}
          setEndDate={setEndDate1}
        />

        <div>날짜와 시간 선택</div>
        <DateTimePicker date={date2} setDate={setDate2} />

        <div>시작, 종료 날짜 및 시간 선택</div>
        <DateTimeBetweenPicker
          startDate={startDate2}
          setStartDate={setStartDate2}
          endDate={endDate2}
          setEndDate={setEndDate2}
        />

        <div>시간 선택</div>
        <TimePicker time={currentTime} setTime={setCurrentTime} />

        <Radio
          value={radio}
          setValue={setRadio}
          list={['test1', 'test2', 'test3']}
          text="답을 선택해주세요."
          type="border"
        />
        <Switch value={switch1} setValue={setSwitch1} color="green" />
        <Switch value={switch2} setValue={setSwitch2} color="green" size="small" />
        <Switch value={switch1} setValue={setSwitch1} color="blue" />
        <Switch value={switch2} setValue={setSwitch2} color="blue" size="small" />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Tooltip>툴팁보기</Tooltip>
      </div>
      <Toggle
        list={['테이블 설정', '레이아웃 설정', '테이블 규칙']}
        value={toggleValue}
        setValue={setToggleValue}
        style={{ fontSize: '0.9rem' }}
      />
      <BlackButton>등록</BlackButton>
      <BlackButton
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        열어봐라
      </BlackButton>
      {isModalOpen && (
        <Modal modalTitle="삭제 SQL" modalState={isModalOpen} handleClose={handleClose} />
      )}
      <InputGrid
        list={[
          { subject: 'test1', content: <input /> },
          { subject: 'test2', content: <input /> },
          { subject: 'test3', content: <input /> },
          { subject: 'test4', content: <input /> },
          [
            { subject: 'test4', content: <input /> },
            { subject: 'test4', content: <input /> },
            { subject: 'test4', content: <input /> },
          ],
        ]}
      />
    </div>
  );
}

export default Index;
