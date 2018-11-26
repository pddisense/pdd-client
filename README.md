# pdd-client

[![Build Status](https://travis-ci.com/pddisense/pdd-client.svg?branch=master)](https://travis-ci.com/pddisense/pdd-client)

This repository contains the code for the client to the PDD server, which is materialised as an extension for the Chrome browser.
The extension is written in Javascript ES6, transpiled with Babel.
The user interface is written with React.

## Build
To build the extension, you will need to install [Node ≥10](https://nodejs.org) and [Yarn](https://yarnpkg.com).

First clone the repository:
```bash
git clone git@github.com:pddisense/pdd-client.git
cd pdd-client
```

Then build the extension:
```bash
yarn build
```

An unpacked Chrome extension will be generated in the `dist/chrome` directory.
You can then load it in your browser by going to [chrome://extensions](chrome://extensions), toggling the "Developer mode" switch and then clicking on the "Load unpacked" button.
Then point to the content of the `dist/chrome` directory.

## Test
The tests are written with Jest, and are launched via Yarn:
```bash
yarn test
```

Please allow some time for the tests to complete, as the cryptographic operations are quite extensive.

## Release
There is a release script, which is a small helper to create a packaged extension, ready to be uploaded on the Chrome Web store.
```bash
./bin/release
```

This will create a `dist/chrome.zip` package.

## About
Private Data Donor is a research project whose goal is to collect web search queries, in order to identify outbreaks of infectious diseases much earlier than ever before.
It is developed by [UCL's CS department](http://www.cs.ucl.ac.uk/home/), in the frame of the [i-sense project](https://www.i-sense.org.uk/), the EPSRC IRC in Early Warning Sensing Systems for Infectious Diseases.

## License
This project is made available under the GNU General Public License version 3.
