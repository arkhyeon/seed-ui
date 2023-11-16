import React, { useCallback, useMemo } from 'react';
import DataList from '../../InputComp/DataList';
import { arrayRange } from '../timeComponents/PickerCommonFunc';

function Year({ startYear, startMonth, endYear, endMonth, dateViewed, setDateViewed }) {
  const yearRange = useMemo(() => {
    return arrayRange(endYear - startYear + 1, startYear);
  }, [startYear, endYear]);

  const changeYear = useCallback(
    value => {
      const tempDate = new Date(dateViewed);
      tempDate.setFullYear(value);

      if (startYear === value) {
        tempDate.setMonth(startMonth - 1);
      } else if (endYear === value) {
        tempDate.setMonth(endMonth - 1);
      }

      setDateViewed(tempDate);
    },
    [dateViewed, endMonth, endYear, setDateViewed, startMonth, startYear],
  );

  return (
    <DataList
      valueList={yearRange}
      setData={changeYear}
      select
      defaultValue={dateViewed.getFullYear()}
      height="200px"
    />
  );
}

export default React.memo(Year);
