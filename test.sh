#!/usr/bin/env bash

clear
rm -f test/*.log

# Run all tests.
# 6to5-node test/plugin.query.test.js
6to5-node test/Log.test.js
