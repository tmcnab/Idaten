import fs from 'fs';
import Log from '../core/Log';
import Test from './test';



const TEST_NAME = "Idaten.Log";
const TEST_FILE = Test.logPath(TEST_NAME);


Test.Suite(TEST_NAME, function *()
{
    process.env.DEBUG = 1;

    yield Test.Unit("Not passing in a filePath causes an exception", () => {
        Test.throws(() => new Log());
    });

    yield Test.Unit("Passing in a filePath creates an instance", () => {
        let log = new Log(TEST_FILE);
    });

    yield Test.Unit("Passing in a filePath creates an instance and a file is created", () => {
        let log = new Log(TEST_FILE);
        Test.that(fs.existsSync(TEST_FILE));
    });

    yield Test.Unit("", () => {
        let log = new Log(TEST_FILE);
        let manualSequence = [`1\t${Date.now()}\tSomeId\t{}\n`];

        

    });
});
