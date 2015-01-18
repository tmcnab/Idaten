all:
	test
	benchmark

test:
	./test/test.sh

benchmark:
	./node_modules/.bin/6to5-node test/benchmark.js

.PHONY: test benchmark
