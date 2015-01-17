import Idaten from '..';


export default class ConsolePlugin extends Idaten.Plugin {
    constructor (store) { }

    beforeDestroy (keyValueTupleSequence) {
        let howMany = keyValueTupleSequence.length;
        console.log(`[Idaten] Going to destroy ${howMany} objects.`);
        return keyValueTupleSequence;
    }

    afterDestroy (itemsThatWereDestroyed) {
        let howMany = itemsThatWereDestroyed.filter(i => i[1]).length;
        console.log(`[Idaten] Destroyed ${howMany} objects.`);
    }

    beforeSave (objectSequence) {
        let howMany = objectSequence.length;
        console.log(`[Idaten] Saving ${howMany} objects.`);
        return objectSequence;
    }

    afterSave (keySequence) {
        let howMany = keySequence.length;
        console.log(`[Idaten] Saved ${howMany} objects.`);
    }
}
