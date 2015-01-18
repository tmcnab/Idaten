import Idaten from '..';
import Query from '../plugins/Query';
import Test from './test';


const TEST_NAME = "Idaten.Plugins.Query";


Test.Suite(TEST_NAME, function* ()
{
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

    yield Test.Unit(".query.toArray() functions correctly", () => {
        let results = store.query.toArray();
        let DATA = Test.DATA;

        Test.that(results.length === DATA.length);
        Test.that(results[0].id === DATA[0].id);
        Test.that(results[20].id === DATA[20].id);
    });
});
