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

const history = require('./history');
const { aggregateCounters, formatQuery } = history;

test('aggregateCounters should aggregate search history items w.r.t. exact searches', () => {
  const searchHistory = [
    { query: 'world cup football', count: 1 },
    { query: 'flu', count: 5 },
    { query: 'flu fever', count: 4 },
    { query: 'weather', count: 3 },
    { query: 'flu fever', count: 2 },
  ];
  const vocabulary = {
    queries: [
      { exact: 'flu fever' },
      { exact: 'cold' },
      { exact: 'flu' },
    ],
  };
  expect(aggregateCounters(searchHistory, vocabulary)).toEqual([15, 6, 0, 5]);
});

test('aggregateCounters should aggregate search history items w.r.t. terms searches', () => {
  const searchHistory = [
    { query: 'world cup football', count: 1 },
    { query: 'flu', count: 5 },
    { query: 'flu night fever', count: 4 },
    { query: 'weather', count: 3 },
    { query: 'flu fever', count: 2 },
  ];
  const vocabulary = {
    queries: [
      { terms: ['flu', 'fever'] },
      { terms: ['cold'] },
      { terms: ['flu'] },
      { exact: 'flu' },
    ],
  };
  expect(aggregateCounters(searchHistory, vocabulary)).toEqual([15, 6, 0, 11, 5]);
});

test('aggregateCounters should honour a blacklist', () => {
  const searchHistory = [
    { query: 'world cup football', count: 1 },
    { query: 'flu', count: 5 },
    { query: 'flu fever', count: 4 },
    { query: 'weather', count: 3 },
    { query: 'flu fever', count: 2 },
  ];
  const vocabulary = {
    queries: [
      { exact: 'flu fever' },
      { exact: 'cold' },
      { exact: 'flu' },
    ],
  };
  const blacklist = {
    queries: [
      { exact: 'flu' },
    ],
  };
  expect(aggregateCounters(searchHistory, vocabulary, blacklist)).toEqual([15, 6, 0, 0]);
});

test('formatQuery should format a vocabulary item in a human-readable way', () => {
  expect(formatQuery({ exact: 'world cup football' })).toBe('world cup football');
  expect(formatQuery({ terms: ['world', 'cup football'] })).toBe('world, cup football');
  expect(formatQuery({ invalid: 'structure' })).toBe('–');
});
