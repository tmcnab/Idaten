import Idaten from '..';
import Test from './Test';


const TEST_NAME = "Idaten.Store";


class Patient {
    constructor () {
        this.id = String;
        this.gender = String;
        this.name = {
            first: String,
            last: String
        };
        this.ssn = String;
        this.prescriptions = Array;
        this.address = {
            street: String,
            state: String,
            code: String,
            country: String
        };
        this.phone = String;
    }
}


Test.Suite(TEST_NAME, function* ()
{
    yield Test.Unit("Create a new store", () => {
        let store = new Idaten.Store();
    });

    yield Test.Unit("Save a single object (sync)", () => {
        let store = new Idaten.Store();
        let patient = Test.DATA[0];
        let result = store.save(patient, true);

        Test.that(result.length === 1);
        Test.that(store.__data__.size === 1);
    });

    yield Test.Unit("Save a single object (async)", () => {
        let store = new Idaten.Store();
        let patient = Test.DATA[0];
        let error = (e) => { throw e; };

        store.save(patient).then((result) => {
            Test.that(result.length === 1);
            Test.that(store.__data__.size === 1);
        }, error);
    });

    yield Test.Unit("Save a single object then another (sync)", () => {
        let store = new Idaten.Store();
        let [first, second] = [Test.DATA[0], Test.DATA[1]];
        store.save(first, true);
        let result = store.save(second, true);

        Test.that(result.length === 1);
        Test.that(store.__data__.size === 2);
    });

    yield Test.Unit("Save a sequence of objects (sync)", () => {
        let store = new Idaten.Store();
        let result = store.save(Test.DATA, true);

        Test.that(result.length === 1000);
        Test.that(store.__data__.size === 1000);
    });

    yield Test.Unit("Save a sequence of objects (async)", () => {
        let store = new Idaten.Store();
        let error = (e) => { throw e; };

        store.save(Test.DATA).then(result => {
            Test.that(result.length === 1000);
            Test.that(store.__data__.size === 1000);
        }, error);
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
});

/*
let store = new Idaten.Store();
*/
