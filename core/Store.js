// Imports.
import Key from './Key';
import Plugin from './Plugin';


// These symbols help hide the core data and plugins
// (for now exposed through __data__ and __plugins__ props).
let DATA = Symbol();
let WARE = Symbol();


// Utility functions. Probably need to be looked at for perf.
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
        const performTransaction = () => {
            // Convert id to id array if not already one.
            let sequence = idOrIds instanceof Array ? idOrIds : [idOrIds];

            // Convert sequence to sorted array<string> if not already
            sequence = sequence.map(id => id.toString()).sort();

            // console.log(sequence);

            // Match all the elements in data map which correspond to requested ids
            // TODO this really needs some perf love
            //  ordered this[DATA] by key.id
            //  removing sequence elements that have been matched
            //  benchmarking needed for decision
            let elements = [];
            for (let [key, value] of this[DATA].entries()) {
                if (sequence.indexOf(key.id) > -1) {
                    elements.push([key, $clone(value)]);
                }
            }

            // console.log(elements);

            // Invoke the beforeDestroy actions on every plugin, they should return the same format input.
            this[WARE].forEach(p => { elements = p.beforeDestroy(elements); });

            // Destroy the elements in the core data map.
            let destroyedElements = elements.map(k => [k[0], this[DATA].delete(k[0])]);

            // Notifiy plugins that the items in destroyedElements were removed. The afterDestroy action should not
            // be throwing errors, so we'll wrap it.
            try { this[WARE].forEach(plugin => plugin.afterDestroy(destroyedElements)); }
            catch (e) { }
            finally { return destroyedElements; }
        };


        return sync ? performTransaction() : new Promise((success, failure) => {
            try {
                success(performTransaction());
            } catch (error) {
                console.error('[Idaten]\t', error);
                failure(error);
            }
        });
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
            this[WARE].forEach(plugin => {
                sequence = plugin.beforeSave(sequence);
            });

            // Save the sequence, return key-val tuples.
            let pairsSequence = sequence.map(elem => {
                let key, val, oldKey;

                // Find old key.
                for (let dk of this[DATA].keys()) {
                    if (dk.id === elem.id.toString()) {
                        oldKey = dk;
                        this[DATA].delete(oldKey);
                        break;
                    }
                }

                this[DATA].set(
                    key = new Key(elem.id.toString()),
                    val = $clone(elem)
                );
                return [oldKey, key, val];
            });

            // For every plugin, call the afterSave function. The afterSave function is not supposed to throw errors
            // so we will wrap them and ignore the errors.
            try { this[WARE].forEach(p => p.afterSave(pairsSequence)); }
            catch (e) {}
            finally { return pairsSequence.map(ts => ts[0]); }
        };

        return sync ? performTransaction() : new Promise((success, failure) => {
            try {
                success(performTransaction());
            } catch (error) {
                console.error('[Idaten]\t', error);
                failure(error);
            }
        });
    }

    use (CustomPlugin) {
        // TODO check that it derives from Idaten.Plugin
        let instance = new CustomPlugin(this);

        if (!(instance instanceof Plugin)) {
            throw new TypeError("Custom plugins must derive from Idaten.Plugin");
        }

        if (!this[WARE].some(plugin => plugin instanceof CustomPlugin)) {
            this[WARE].push(instance);
        }
    }
}
