import Idaten from '..';
import Test from './test';


const TEST_NAME = "Idaten.Plugin";


class APlugin extends Idaten.Plugin {
    constructor (store) {
    }
}

class BPlugin extends Idaten.Plugin {
    constructor (store) {}

    beforeSave (objectSequence) {
        return "qwertyuiop";
    }
}


Test.Suite(TEST_NAME, function* ()
{
    yield Test.Unit("Creating instance of Idaten.Plugin throws error", () => {
        Test.throws(() => new Idaten.Plugin());
    });

    yield Test.Unit("Can successfully create a subtyped test plugin", () => {
        let ap = new APlugin();
    });

    yield Test.Unit("Test plugin has all appropriate properties of appropriate kind", () => {
        let ap = new APlugin();

        Test.that(ap.beforeSave && typeof ap.beforeSave === 'function');
        Test.that(ap.afterSave && typeof ap.afterSave === 'function');
        Test.that(ap.beforeDestroy && typeof ap.beforeDestroy === 'function');
        Test.that(ap.afterDestroy && typeof ap.afterDestroy === 'function');
    });

    yield Test.Unit("Overriden Idaten.Plugin member executes properly", () => {
            let bp = new BPlugin();
            Test.that(bp.beforeSave() === "qwertyuiop");
    });
});
