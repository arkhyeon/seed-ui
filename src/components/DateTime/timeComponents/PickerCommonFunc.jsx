export const initNumberList = (heightValue, numbersLength, value = null) => {
  const initHourList = [];
  let count = heightValue * 2;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < numbersLength; j++) {
      initHourList.push({
        number: j.toString().padStart(2, '0'),
        translatedValue: count,
        selected: i === 1 && j === value,
      });

      count -= heightValue;
    }
  }

  return initHourList;
};

export const formatDate = date => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return '';
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const arrayRange = (size, start) => {
  return Array(size)
    .fill(start)
    .map((x, y) => x + y);
};

export const addDays = (day, date = new Date()) => {
  date.setDate(date.getDate() + day);
  return date;
};

export const addMonths = (month, date = new Date()) => {
  date.setMonth(date.getMonth() + month);
  return date;
};
