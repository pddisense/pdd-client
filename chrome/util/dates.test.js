const dates = require('./dates');

test('isToday', () => {
  expect(dates.isToday(Date.now())).toBe(true);
  expect(dates.isToday(Date.now() - 24 * 3600 * 1000)).toBe(false);
  expect(dates.isToday(Date.now() + 24 * 3600 * 1000)).toBe(false);
});

test('isBefore1am', () => {
  const now = new Date();
  expect(dates.isBefore1am(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 45))).toBe(true);
  expect(dates.isBefore1am(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 1, 5))).toBe(false);
  expect(dates.isBefore1am(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 45))).toBe(false);
  expect(dates.isBefore1am(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 45))).toBe(false);
});
