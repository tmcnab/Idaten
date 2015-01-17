export default class Plugin {

    constructor () {
        throw new Error("Cannot invoke Idaten.Plugin constructor");
    }

    afterDestroy (objectSequence) {
        return objectSequence;
    }

    afterSave (tupleSequence) {
        return tupleSequence;
    }

    beforeDestroy (keyValueTupleSequence) {
        return keyValueSequence;
    }

    beforeSave (object) {
        return object;
    }
}
