/*
 * PDD is a platform for privacy-preserving Web searches collection.
 * Copyright (C) 2016-2018 Vincent Primault <v.primault@ucl.ac.uk>
 *
 * PDD is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * PDD is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with PDD.  If not, see <http://www.gnu.org/licenses/>.
 */

 const dates = require('./dates');
 const { isToday, isBefore1am } = dates;

test('isToday', () => {
  expect(isToday(Date.now())).toBe(true);
  expect(isToday(Date.now() - 24 * 3600 * 1000)).toBe(false);
  expect(isToday(Date.now() + 24 * 3600 * 1000)).toBe(false);
});

test('isBefore1am', () => {
  const now = new Date();
  expect(isBefore1am(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 45))).toBe(true);
  expect(isBefore1am(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 1, 5))).toBe(false);
  expect(isBefore1am(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 45))).toBe(false);
  expect(isBefore1am(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 45))).toBe(false);
});
