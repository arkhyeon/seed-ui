import React, { useCallback } from 'react';
import DataList from '../../InputComp/DataList';
import { arrayRange } from '../timeComponents/PickerCommonFunc';

function Month({ startYear, startMonth, endYear, endMonth, dateViewed, setDateViewed }) {
  const changeMonth = useCallback(
    value => {
      const dupDate = new Date(dateViewed);
      dupDate.setMonth(value - 1);
      setDateViewed(dupDate);
    },
    [dateViewed, setDateViewed],
  );

  const monthRange = useCallback(() => {
    if (startYear === dateViewed.getFullYear()) {
      return arrayRange(13 - startMonth, startMonth);
    }
    if (endYear === dateViewed.getFullYear()) {
      return arrayRange(endMonth, 1);
    }
    return arrayRange(12, 1);
  }, [dateViewed, endMonth, endYear, startMonth, startYear]);

  return (
    <DataList
      valueList={monthRange()}
      setData={changeMonth}
      select
      defaultValue={dateViewed.getMonth() + 1}
      height="200px"
    />
  );
}

export default Month;
