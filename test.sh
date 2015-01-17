#!/usr/bin/env bash

clear
rm -f test/*.log

# Run all tests.
6to5-node test/Idaten.Key.js
# 6to5-node test/plugins.query.js
