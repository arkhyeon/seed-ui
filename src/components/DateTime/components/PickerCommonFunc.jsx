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
