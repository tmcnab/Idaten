#!/usr/bin/env bash

bin=./node_modules/.bin


# clear screen, destroy any log files in test dir.
clear
rm -f test/*.log


## Core Package Tests
${bin}/6to5-node test/Idaten.Key.js
${bin}/6to5-node test/Idaten.Plugin.js
${bin}/6to5-node test/Idaten.Store.js

## Bundled Plugin Tests
${bin}/6to5-node test/Idaten.Plugins.Query.js
