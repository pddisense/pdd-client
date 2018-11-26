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

 const crypto = require('./crypto');
 const BN = require('bn.js');

test('generateKeyPair should return public and private key', () => {
  const keyPair = crypto.generateKeyPair();
  expect(keyPair).toHaveProperty('publicKey');
  expect(keyPair).toHaveProperty('privateKey');
});

test('generateKeyPair should return a serializable JSON object', () => {
  const keyPair = crypto.generateKeyPair();
  expect(JSON.parse(JSON.stringify(keyPair))).toEqual(keyPair);
});

test('encryptCounters should generate noise whose sum equals to zero', () => {
  const N = 5; // Number of users to simulate.
  const L = 10;  // Number of data points to simulate.

  const keyPairs = [];
  const publicKeys = [];
  const counters = [];
  const groundTruth = new Array(L);
  groundTruth.fill(0);

  for (let i = 0; i < N; i++) {
    // Generate a key pair and data points for each user.
    keyPairs.push(crypto.generateKeyPair());
    publicKeys.push(keyPairs[i].publicKey);
    counters.push([]);

    for (let j = 0; j < L; j++) {
      counters[i].push(randomInt(100));
      groundTruth[j] += counters[i][j];
    }
  }

  const decrypted = new Array(L);
  decrypted.fill(new BN(0));

  for (let i = 0; i < N; i++) {
    // Simulate the encryption and decryption process.
    const encrypted = crypto.encryptCounters(publicKeys, 0, keyPairs[i], counters[i]);
    expect(encrypted).toHaveLength(L);
    for (let j = 0; j < L; j++) {
      // This is a sanity check preventing a trivial implementation returning
      // the raw data points. I don't think we have a formal guarantee that
      // the following statement will always hold, but it seems reasonable to
      // believe it should be true in the very large majority of the cases.
      expect('' + encrypted[j]).not.toBe('' + counters[i][j]);
      decrypted[j] = decrypted[j].add(new BN(encrypted[j]));
    }
  }

  for (let i = 0; i < L; i++) {
    decrypted[i] = decrypted[i].toNumber();
  }
  expect(decrypted).toEqual(groundTruth);
});

function randomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
