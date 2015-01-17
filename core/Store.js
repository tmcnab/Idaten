// Imports.
import Key from './Key';
import Plugin from './Plugin';


//
let DATA = Symbol();
let WARE = Symbol();

let $clone = (o) => JSON.parse(JSON.stringify(o));
let $freeze = (o) => { Object.freeze(o); return o; };

export default class Store {

    constructor () {
        this[DATA] = new Map();
        this[WARE] = [];
    }

    get __data__ () {
        return this[DATA];
    }

    get __plugins__ () {
        return this[WARE];
    }

    get cursor () {
        return this[DATA].values();
    }

    destroy (idOrIds, sync = false) {

    }

    save (obj, sync = false) {
        const performTransaction = () => {
            if (typeof obj !== 'object') {
                throw new Error("must save object or sequence of objects");
            }

            // Make obj a sequence regardless.
            let sequence = (obj instanceof Array) ? obj : [obj];

            // Ensure that our sequence is all objects. (TODO make this better, Object.prototype.hasOwnProperty.call)
            if (!sequence.every(elem => typeof elem === 'object')) {
                throw new Error("must save object or sequence of objects");
            }

            // For every plugin, call the beforeSave function.
            sequence = this[WARE].map(p => p.beforeSave(sequence));

            // Save the sequence, return key-val tuples.
            let pairsSequence = sequence.map(elem => {
                let key, val;
                this[DATA].set(
                    key = $freeze(new Key(elem.id)),
                    val = $freeze($clone(elem)));
                return [key, val];
            });

            // For every plugin, call the afterSave function. The afterSave function is not supposed to throw errors
            // so we will wrap them and ignore the errors.
            try { this[WARE].forEach(p => p.afterSave(pairsSequence)); }
            catch (e) {}
        };

        return sync ? performTransaction() : new Promise((success, failure) => {
            try {
                performTransaction();
                success();
            } catch (error) {
                failure(error);
            }
        });
    }

    use (Plugin) {
        // TODO check that it derives from Idaten.Plugin
        let instance = new Plugin();
        instance.store = this;
        this[WARE].push(instance);
    }
}
