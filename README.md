# pdd-client

[![Build Status](https://travis-ci.com/pddisense/pdd-client.svg?branch=master)](https://travis-ci.com/pddisense/pdd-client)

This repository contains the code for the client to the PDD server, which is materialised as an extension for the Chrome browser.
The extension is written in Javascript ES6, transpiled with Babel.
The user interface is written with React.

## Build
To build the extension, you will need [Node ≥10.9.0](https://nodejs.org) and [Yarn](https://yarnpkg.com).

First clone the repository:
```bash
git clone git@github.com:pddisense/pdd-client.git && cd pdd-client
```

Then build the extension:
```bash
./bin/release
```

An unpacked Chrome extension will be generated in the `dist/chrome` directory.
You can then load it in your browser by going to [chrome://extensions](chrome://extensions), toggling the "Developer mode" switch and then clicking on the "Load unpacked" button.
Then point to the content of the `dist/chrome` directory.

## About
Private Data Donor is a research project whose goal is to gather statistics about Web search queries in a privacy-preserving way.
Collected data is then used to help monitoring and predicting outbreaks of infectious diseases such as flu.
It is developed by [UCL's CS department](http://www.cs.ucl.ac.uk/home/), in the frame of the [i-sense project](https://www.i-sense.org.uk/), the EPSRC IRC in Early Warning Sensing Systems for Infectious Diseases.

## License
This project is made available under the GNU General Public License version 3.
