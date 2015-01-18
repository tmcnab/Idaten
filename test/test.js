
export function Suite (name, generator) {
    console.log(`\n ${name} Suite\n`);

    for (let unit of generator()) {}

    console.log();
}

export function Unit (name, fn) {
    const [CROSS, TICK] = ['✗', '✓'];

    let wasClean = true;
    let err = null;
    try {
        fn();
    } catch (error) {
        wasClean = false;
        err = error;
    } finally {
        if (wasClean) {
            console.log(`\t${TICK} ${name}`);
        } else {
            console.error(`\t${CROSS} ${name} [${err.message}]`);
            if (err.stack)
                console.error(err.stack);
        }
    }
}

export function logPath (name) {
    return require('path').join(__dirname, `${name}.log`);
}

export function fail (e) {
    throw e;
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


export let NotImplementedError = new Error('Test Not Implemented');
NotImplementedError.stack = undefined;


// Defining a getter on the exports because loading the giant
// json file is bad practice for tests that dont need it.
Object.defineProperty(module.exports, 'DATA', {
    get: () => require('./fake.json')
});
