import Core from '../core/Core';
import Test from './test';


const TEST_NAME = "Idaten.Core";


Test.Suite(TEST_NAME, function* () {

    yield Test.Unit("Create a new core", () => {
        let core = new Core();
    });
    
});
