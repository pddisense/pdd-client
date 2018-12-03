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

import Elliptic from 'elliptic';
import BN from 'bn.js';
import crypto from 'crypto';

const curve = new Elliptic.ec('ed25519');

/**
 * Generate a pair of cryptographic keys.
 */
export function generateKeyPair() {
  const keyPair = curve.genKeyPair();
  return {
    publicKey: keyPair.getPublic('hex'),
    privateKey: keyPair.getPrivate('hex'),
  };
}

/**
 * Encrypt a list of counters.
 *
 * @param publicKeys
 * @param round
 * @param keyPair
 * @param counters
 */
export function encryptCounters(publicKeys, round, keyPair, counters) {
  // Import client's key and check it is present within the group.
  const key = importKeyPair(keyPair);
  const clientIndex = publicKeys.findIndex(pkey => pkey === keyPair.publicKey);
  if (-1 === clientIndex) {
    console.log('Unable to find the client\'s public key among those sent');
    return [];
  }

  // Generate blinding factors.
  const factors = generateBlindingFactors(publicKeys, key, clientIndex, counters.length, round);

  // Encrypt each counter by adding the blinding factor to its value.
  const encrypted = [];
  factors.forEach((factor, idx) => {
    encrypted.push(factor.add(new BN(counters[idx], 16)).mod(curve.n));
  });

  return encrypted.map(n => n.toString());
}

function importKeyPair(struct) {
  const pair = curve.keyFromPrivate(struct.privateKey, 'hex');
  pair.pub = importPublicKey(struct.publicKey);
  return pair;
}

function importPublicKey(str) {
  return curve.keyFromPublic(str, 'hex').pub;
}

function generateBlindingFactors(publicKeys, key, clientIndex, L, round) {
  const factors = [];
  for (let l = 0; l < L; l++) {
    let K_il = curve.curve.zero.fromRed();
    publicKeys.forEach((userKey, idx) => {
      const pubKey = importPublicKey(userKey);
      const share = key.derive(pubKey);
      // It is important to note that the + operator is the string concatenation
      // operator, as required by the protocol, and not an addition.
      const n = new BN(hash(share.toString() + l + round));
      if (idx < clientIndex) {
        K_il = K_il.add(n);
      } else if (idx > clientIndex) {
        K_il = K_il.sub(n);
      }
    });
    factors.push(K_il.mod(curve.n));
  }
  return factors;
}

function hash(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}
