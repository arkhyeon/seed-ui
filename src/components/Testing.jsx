import React, { useState } from 'react';
import DatePicker from './DateTime/DatePicker';

function Testing() {
  const [date, setDate] = useState(new Date());
  return (
    <>
      <DatePicker
        date={date}
        setDate={value => setDate(value)}
        startDate={new Date('2022-4-12')}
        endDate={new Date('2023-11-11')}
      />
    </>
  );
}

export default Testing;
