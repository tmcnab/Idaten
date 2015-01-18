import Idaten from '..';
import Query from '../plugins/Query';
import Test from './test';


const TEST_NAME = "Idaten.Plugins.Query";


Test.Suite(TEST_NAME, function* () {

    let store = new Idaten.Store();
    store.use(Idaten.Plugins.Query);
    store.save(Test.DATA, true);

    yield Test.Unit("Adds a getter 'query' on store object", () => {
        Test.that(store.query);
        Test.that(store.query instanceof Query);

        // Ensure that it's a getter-only (it will throw on trying to assign).
        Test.throws(() => store.query = 124);
    });

    yield Test.Unit(".query is configured correctly", () => {
        let q = store.query;

        Test.that(q.filter);
        Test.that(q.map);
        Test.that(q.reduce);
        Test.that(q.skip);
        Test.that(q.take);
        Test.that(q.toArray);
    });

    yield Test.Unit(".query.filter() functions correctly", () => {
        let q = store.query.filter(p => p.gender === "Female");
        Test.that(q instanceof Query);

        let r = q.toArray();
        Test.that(r.length === 518);
    });

    yield Test.Unit(".query.map() functions correctly", () => {
        let q = store.query.map(p => p.name);
        Test.that(q instanceof Query);

        let r = q.toArray();
        Test.that(r.length === 1000);
        Test.that(r.every(n => !!n.first));
    });

    yield Test.Unit(".query.reduce() functions correctly", () => {
        let r = store.query.reduce((a, p) => {
            a.push(`${p.name.first} ${p.name.last}`);
            return a;
        }, []);

        Test.that(r.length === 1000);


        let testPerson = Test.DATA[273];
        let testName = `${testPerson.name.first} ${testPerson.name.last}`;
        Test.that(r[273] === testName);
    });

    yield Test.Unit(".query.skip() functions correctly", () => {
        let q = store.query.skip(500);
        let r = q.toArray();
        Test.that(q instanceof Query, 'result is not a Query object');
        Test.that(r.length === 500, `result length expected 500, got ${r.length}`);


        // Test that if store contains 4 elements and attempt is to skip 5,
        // it will return no values once toArray() is called.
        let store2 = new Idaten.Store();
        store2.use(Idaten.Plugins.Query);
        let testData = [Test.DATA[1], Test.DATA[3], Test.DATA[5], Test.DATA[7]];
        store2.save(testData);
        const qlength = store2.query.skip(5).toArray().length;
        Test.that(qlength === 0, `expected length to be 0, saw ${qlength}`);
    });


    yield Test.Unit(".query.take() functions correctly", () => {
        let q = store.query.take(5);
        let r = q.toArray();
        Test.that(q instanceof Query, 'result is not a Query object');
        Test.that(r.length === 5);


        // Test that if store contains 4 elements and attempt is to take 5,
        // it will only take 4.
        let store2 = new Idaten.Store();
        store2.use(Idaten.Plugins.Query);
        let testData = [Test.DATA[1], Test.DATA[3], Test.DATA[5], Test.DATA[7]];
        store2.save(testData);
        Test.that(store2.query.take(5).toArray().length === 4);
    });

    yield Test.Unit(".query.toArray() functions correctly", () => {
        let results = store.query.toArray();
        let DATA = Test.DATA;

        Test.that(results.length === DATA.length);
        Test.that(results[0].id === DATA[0].id);
        Test.that(results[20].id === DATA[20].id);
    });

});
