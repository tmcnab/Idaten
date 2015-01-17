// Imports.
import Test from './test';
import Idaten from '..';

const TEST_NAME = "Idaten.Plugins.Query";


// Test Suite.
Test.Suite(TEST_NAME, function* ()
{
    // Setup for testing.
    process.env.DEBUG = 1;
    let store = new Idaten.Store(Test.logPath(TEST_NAME));
    store.save(Test.DATA, true);


    yield Test.Unit("Is loaded into store properly", () => {
        store.use(Idaten.Plugins.Query);
        Test.that('query' in store);
    });

    yield Test.Unit("Something", () => {
        store.__log__.rebuild();
    });

});
