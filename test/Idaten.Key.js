import Idaten from '..';
import Test from './test';


const TEST_NAME = "Idaten.Key";


Test.Suite(TEST_NAME, function* ()
{
    const testKey = (k) => {
        Test.that(!!k.id);
        Test.that(!!k.ts);
        Test.that(typeof k.id === 'string');
        Test.that(typeof k.ts === 'number');
    };

    yield Test.Unit("Constructs with empty arguments", () => {
        let key = new Idaten.Key();
        testKey(key);
    });

    yield Test.Unit("Constructs with provided id", () => {
        let key = new Idaten.Key("qwertyuiop");
        testKey(key);
    });

    yield Test.Unit("Constructs with provided id, timestamp", () => {
        let key = new Idaten.Key("qwertyuiop", 12345);
        testKey(key);
    });

    yield Test.Unit("Doesn't accept non-numeric (or convertable to) timestamp", () => {
        Test.throws(() => new Idaten.Key("qwertyuiop", "qwertyuiop"));
    });
});
