import path from 'path';
import Idaten from '..';
import Test from './test';


const TEST_NAME = "Idaten.Plugins.Log";


Test.Suite(TEST_NAME, function* () {

    let store = new Idaten.Store();
    store.use(Idaten.Plugins.Query);
    store.use(Idaten.Plugins.Log);

    yield Test.Unit("plugin configures and initializes things properly", () => {
        // Check that store has the right properties
        Test.that(!!store.log.path, "store missing log.path property");
        Test.that(!!store.log.load, "store missing log.load property");
        Test.that(!!store.log.squash, "store missing log.squash property");

        // Ensure has default path
        Test.that(store.log.path === path.join(process.cwd(), 'idaten.log'));

        // Ensure that path is r/w
        store.log.path = "idaten.log";
        Test.that(store.log.path === "idaten.log");
    });

    yield Test.Unit("Saves entries properly", () => {
        let [pa, pb, pc] = Test.DATA;
        store.log.path = path.join(__dirname, 'log.test.1.log');

        store.save(pa, true);
        store.save([pb, pc], true);

        pa.presecriptions = [];
        store.save(pa, true);

        store.destroy('af5661ac-b4ca-41d7-aae3-1ff668f391a8', true);
    });

    yield Test.Unit("Loads entries properly", () => {
        const PATH = path.join(__dirname, 'log.test.2.log');
        let [pa, pb, pc] = Test.DATA;

        store.log.path = PATH;

        store.save(pa, true);
        store.save([pb, pc], true);
        store.destroy('af5661ac-b4ca-41d7-aae3-1ff668f391a8', true);

        pa.presecriptions = [];
        store.save(pa, true);



        let rehydrated = new Idaten.Store();
        rehydrated.use(Idaten.Plugins.Query);
        rehydrated.use(Idaten.Plugins.Log);
        rehydrated.log.path = PATH;
        rehydrated.log.load(true);

        console.log(rehydrated.query.toArray().length);
    });

});
