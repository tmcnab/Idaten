/*
**
*/
import Idaten from '..';
import Test from './test';


const N = 1000;


function $times (fn, n) {
    let diffs = Array(n);
    for (let counter = 0; counter < n; counter++) {
        diffs[counter] = fn();
    }
    return diffs.reduce((s, d) => s + d, 0) / n;
}

function $singleSave () {
    let store = new Idaten.Store();
    let fakeRecord = { number:123, string:"Hello", bool:false };

    const start = Date.now();

    for (let counter = 0; counter < 1e3; counter++) {
        store.save(fakeRecord, true);
    }

    return (Date.now() - start);
}

function $multiSave () {
    let store = new Idaten.Store();
    let fakeRecord = { number:123, string:"Hello", bool:false };
    let fakeSequence = Array(1000);
    fakeSequence.fill(fakeRecord);

    const start = Date.now();
    store.save(fakeSequence, true);
    return (Date.now() - start);
}


Test.Suite(`Benchmark (N = ${N})`, function* () {

    yield Test.Unit("", () => {
        console.log("\tQ. How fast does a 1K records take (single)?");

        let avg_ms = $times($singleSave, N);

        console.log(`\tA. ${avg_ms}ms`);
    });

    yield Test.Unit("", () => {
        console.log("\tQ. How fast does 1K records take (multi)?");

        let avg_ms = $times($multiSave, N);

        console.log(`\tA. ${avg_ms}ms`);
    });
});
