import Idaten from '..';
import Test from './test';
import ViewPlugin from '../plugins/ViewPlugin';


const TEST_NAME = "Idaten.Plugins.View";


Test.Suite(TEST_NAME, function* ()
{
    let store = new Idaten.Store();
    store.use(Idaten.Plugins.View);
    store.save(Test.DATA, true);

    yield Test.Unit("Adds a getter 'views' on store object", () => {
        Test.that(store.views, "didn't find property on object");
        Test.that(store.views instanceof ViewPlugin, "not instanceof ViewPlugin");

        // Ensure that it's a getter-only (it will throw on trying to assign).
        Test.throws(() => store.views = 124);
    });

    yield Test.Unit(".add doesn't accept bad parameters", () => {
        Test.throws(() => store.views.register());
        Test.throws(() => store.views.register(''));
        Test.throws(() => store.views.register('fooo'));
        Test.throws(() => store.views.register('foo', 123));
    });

    yield Test.Unit("Add a view (Query)", () => {
        let vw = store.query.map(p => p.address);
        store.views.register('addresses', vw);

        let results = store.views.materialize('addresses');
        Test.that(results.length === 1000);
        Test.that('street' in results[0]);
    });
});
