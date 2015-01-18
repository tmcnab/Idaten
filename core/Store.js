// Imports.
import Key from './Key';
import Plugin from './Plugin';


// These symbols help hide the core data and plugins
// (for now exposed through __data__ and __plugins__ props).
let DATA = Symbol();
let WARE = Symbol();


// Utility functions. Probably need to be looked at for perf.
let $prepare = (o) => {
    let d = JSON.parse(JSON.stringify(o));
    Object.freeze(d);
    return d;
};

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
            // TODO
            sequence = sequence.map(id => id.toString()).sort();

            // Match all the elements in data map which correspond to requested ids
            // TODO this really needs some perf love
            //  ordered this[DATA] by key.id
            //  removing sequence elements that have been matched
            //  benchmarking needed for decision
            let elements = [];
            for (let [key, value] of this[DATA].entries()) {
                if (sequence.indexOf(key.id) > -1) {
                    elements.push([key, value]);
                }
            }

            // Invoke the beforeDestroy actions on every plugin.
            this[WARE].forEach(plugin => {
                let result = plugin.beforeDestroy(elements);
                elements = result ? result : elements;
            });

            // Destroy the elements in the core data map.
            let destroyedElements = elements.map(k => [k[0], this[DATA].delete(k[0])]);

            // Notifiy plugins that the items in destroyedElements were removed.
            this[WARE].forEach(plugin => plugin.afterDestroy(destroyedElements));
            return destroyedElements;
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
                let result = plugin.beforeSave(sequence);
                sequence = result ? result : sequence;
            });

            // Save the sequence, return key-val tuples.
            let pairsSequence = sequence.map(elem => {
                let key = new Key(elem.id), val, oldKey;
                elem.id = elem.id || key.id;

                // Find old key.
                for (let dk of this[DATA].keys()) {
                    if (elem.id && dk.id === elem.id) {
                        oldKey = dk;
                        this[DATA].delete(oldKey);
                        break;
                    }
                }

                this[DATA].set(key, val = $prepare(elem));
                return [key, val, oldKey];
            });

            // For every plugin, call the afterSave function and return a [oldKey, newKey] tuple.
            this[WARE].forEach(p => p.afterSave(pairsSequence));
            return pairsSequence.map(ts => [ts[2], ts[0]]);
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
