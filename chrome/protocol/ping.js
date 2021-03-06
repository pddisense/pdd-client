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

import moment from 'moment';
import jstz from 'jstz';

import { searchHistory } from '../browser/history';
import { getData, setData } from '../browser/storage';
import { aggregateCounters } from './history';
import { encryptCounters } from './crypto';
import xhr from '../util/xhr';

/**
 * Contact the API server to get instructions, and rect to them by sending data. We do not handle
 * retries in this function, as it is to be handled by the background pings only (and not those
 * sent manually by the user).
 *
 * @param client Current client.
 */
export default function sendPing(client) {
  // First send a ping request, in order to get instructions from the server.
  console.log(`Pinging the server for client ${client.name}...`);
  const timezone = jstz.determine();
  const obj = {
    timezone: timezone.name(),
    extensionVersion: chrome.runtime.getManifest().version,
  };
  return xhr(
    `/api/clients/${client.name}/ping`,
    { method: 'POST', body: JSON.stringify(obj) }
  ).then(resp => {
    // Collect all asynchronous operations.
    const promises = [];

    if (resp.submit) {
      // Submit each sketch that was requested. This ensures that we capture the outcome of
      // every sketch submitted, but we still return the original response. If there is an error,
      // another attempt will be done later on, this is managed in `background.js`.
      resp.submit.forEach(command => {
        promises.push(submitSketch(client, command)
          .catch(err => console.log(`Failed to send sketch ${command.sketchName}`, err)));
      });
    }

    // Store the latest vocabulary version, if present.
    if (resp.vocabulary) {
      promises.push(setData({ vocabulary: resp.vocabulary })
        .catch(err => console.log('Failed to store vocabulary', err)));
    }

    // Schedule next ping time. Normally, the response comes with a suggested time. If for any
    // reason it is not present, we still schedule one for the next day (otherwise the extension
    // will simply stop sending data).
    const nextPingTime = resp.nextPingTime
      ? moment(resp.nextPingTime)
      : moment().add(1, 'day').hours(2);

    return Promise.all(promises).then(() => nextPingTime);
  });
}

function submitSketch(client, command) {
  console.log(`Submitting sketch ${command.sketchName}...`);
  const startTime = moment(command.startTime);
  const endTime = moment(command.endTime);

  return searchHistory(startTime, endTime)
    .then(history => {
      return getData().then(localData => {
        const blacklist = localData.blacklist || { queries: [] };
        return aggregateCounters(history, command.vocabulary, blacklist);
      });
    })
    .then(rawValues => {
      const encryptedValues = command.collectEncrypted
        ? encryptCounters(command.publicKeys, command.round, client.keyPair, rawValues)
        : [];
      const sketch = { rawValues, encryptedValues };
      return xhr(
        `/api/sketches/${command.sketchName}`,
        { method: 'PATCH', body: JSON.stringify(sketch) }
      );
    });
}
