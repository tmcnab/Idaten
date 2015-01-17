export const DATA = require('./fake.json');


export function log () {
    let args = Array.prototype.slice.call(arguments);
    args.unshift('TEST\t');
    console.log.apply(console.log, args);
}


export function Suite (name, generator) {
    console.log(`\n ${name} Suite\n`);

    for (let unit of generator()) {}

    console.log();
}

export function Unit (name, fn) {
    // this can totally be refactored.

    let wasClean = true;
    let error = null;

    try {
        fn();
    } catch (e) {
        wasClean = false;
        error = e;
    }

    let icon = wasClean ? '✓' : '✗';

    console.log(`\t${icon} ${name}`);

    if (error && error.stack) {
        console.error("\n", error.stack);
    }
}

export function logPath (name) {
    return require('path').join(__dirname, `${name}.log`);
}

export function that (test, message) {
    if (!test) {
        let error = new Error(message);
        error.stack = undefined;
        throw error;
    }
}

export function throws (fn, message) {
    let didThrow = false;
    try {
        fn();
    } catch (e) {
        didThrow = true;
    }

    if (!didThrow) {
        throw new Error("didn't throw when it was supposed to");
    }
}
