import Idaten from '..';
import Test from './test';


const TEST_NAME = "Idaten.Store";


Test.Suite(TEST_NAME, function* () {

    yield Test.Unit("Create a new store", () => {
        let store = new Idaten.Store();
    });

    //== .save() tests ==//

    yield Test.Unit("Save a single object", () => {
        let store = new Idaten.Store();
        let patient = Test.DATA[0];
        let result = store.save(patient, true);

        Test.that(result.length === 1, `result.length: expected 1, saw ${result.length}`);
        Test.that(store.size === 1, `store.size: expected 1, saw ${store.size}`);
    });

    yield Test.Unit("Save a single object then another", () => {
        let store = new Idaten.Store();
        let [first, second] = [Test.DATA[0], Test.DATA[1]];
        store.save(first, true);
        let result = store.save(second, true);

        Test.that(result.length === 1, `result.length: expected 1, saw ${result.length}`);
        Test.that(store.size === 2, `store.size: expected 2, saw ${store.size}`);
    });

    yield Test.Unit("Save a sequence of objects", () => {
        let store = new Idaten.Store();
        let result = store.save(Test.DATA, true);

        Test.that(result.length === 1000);
        Test.that(store.__data__.size === 1000);
    });

    yield Test.Unit("Ensure that saved object is different reference", () => {
        let store = new Idaten.Store();
        let original = Test.DATA[0];

        store.save(original, true);

        let retrieved = store.cursor.next();

        Test.that(original !== retrieved);
    });

    yield Test.Unit("Ensure that twice saved object results in only one record", () => {
        let store = new Idaten.Store();
        let patient = Test.DATA[0];

        store.save(patient, true);
        store.save(patient, true);

        Test.that(store.__data__.size === 1, `Saw ${store.__data__.size}, expected 1`);
    });

    yield Test.Unit("Save an object without an id", () => {
        let store = new Idaten.Store();
        let object = { name: 'Peter Parker', age: 27 };
        let result = store.save(object, true);

        Test.that(result.length === 1);
        Test.that(store.__data__.size === 1);
    });

    //== .destroy() tests ==//

    yield Test.Unit("Save, destroy single object", () => {
        let store = new Idaten.Store();
        let patient = Test.DATA[0];

        // Save the patient
        store.save(patient, true);
        Test.that(store.size === 1, `store.size: expected 1, saw ${store.size}`);

        // Destroy the patient
        let result = store.destroy(patient.id, true);
        Test.that(store.size === 0, `saw ${store.size}, expected 0`);
    });

    yield Test.Unit("Save, destroy sequence of objects (sync)", () => {
        let store = new Idaten.Store();

        store.save(Test.DATA, true);
        Test.that(store.__data__.size === 1000);

        let allIds = Test.DATA.map(p => p.id);
        let result = store.destroy(allIds, true);

        Test.that(result.length === allIds.length);
        Test.that(store.__data__.size === 0);
    });

    yield Test.Unit("Save sequence of objects, destroy fewer objects (sync)", () => {
        const N = 5, DATA = Test.DATA;
        let store = new Idaten.Store();

        store.save(DATA, true);
        Test.that(store.__data__.size === 1000);

        let ids = [DATA[0].id, DATA[123].id, DATA[432].id];
        let result = store.destroy(ids, true);

        Test.that(result.length === ids.length, `saw ${result.length}, expected ${ids.length}`);
        Test.that(store.__data__.size === (1000 - ids.length));
    });


    //== .use() tests ==//

    class TestPlugin extends Idaten.Plugin {
        constructor (store) {
            this.store = store;
        }
    }

    yield Test.Unit("Correctly loads plugins", () => {
        let store = new Idaten.Store();

        store.use(TestPlugin);
        Test.that(store.__plugins__.length === 1);
        Test.that(store.__plugins__[0] instanceof TestPlugin);
        Test.that(store.__plugins__[0].store === store);
    });

    yield Test.Unit("Throws error if not derived from Idaten.Plugin", () => {
        let store = new Idaten.Store();

        Test.throws(() => { store.use({}); });
    });

    yield Test.Unit("Only loads a plugin once", () => {
        let store = new Idaten.Store();

        store.use(TestPlugin);
        store.use(TestPlugin);

        Test.that(store.__plugins__.length === 1, `found ${store.__plugins__.length}, expected 1`);
        Test.that(store.__plugins__[0] instanceof TestPlugin);
        Test.that(store.__plugins__[0].store === store);
    });
});
