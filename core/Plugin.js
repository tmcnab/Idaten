export default class Plugin {

    constructor (store) {
        this.store = store;
    }

    afterDestroy (objectSequence) {
        return objectSequence;
    }

    afterSave (tupleSequence) {
        return tupleSequence;
    }

    beforeDestroy (id) {
        return id;
    }

    beforeSave (object) {
        return object;
    }
}
