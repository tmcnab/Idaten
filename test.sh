#!/usr/bin/env bash


# clear screen, destroy any log files in test dir.
clear
rm -f test/*.log


# Run all tests.
6to5-node test/Idaten.Key.js
6to5-node test/Idaten.Plugin.js
