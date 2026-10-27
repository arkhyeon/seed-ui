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
