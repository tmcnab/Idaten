// Imports.
import Core from './Core';
import Microtime from 'microtime';
import Plugin from './Plugin';
import UUID from 'node-uuid';


// These symbols help hide the core data and plugins
// (for now exposed through __data__ and __plugins__ props).
let DATA = Symbol();
let WARE = Symbol();


export default class Store {

    constructor () {
        this[DATA] = new Core();
        this[WARE] = [];
    }

    get __data__ () {
        return this[DATA];
    }

    get __plugins__ () {
        return this[WARE];
    }

    get cursor () {
        return this[DATA].iterator;
    }

    get size () {
        return this[DATA].size;
    }

    destroy (idOrIds, sync = false) {
        const performTransaction = () => {
            // 1. Convert id to id array if not already one.
            // 2. Convert sequence to array string if not already
            // 3. Filter items that exist in db.
            let sequence = (idOrIds instanceof Array ? idOrIds : [idOrIds])
                .map(id => id.toString())
                .filter(id => this[DATA].exists(id));

            // Invoke the beforeDestroy actions on every plugin.
            sequence = this[WARE].reduce((seq, plugin) => {
                let result = plugin.beforeDestroy(seq);
                return result ? result : seq;
            }, sequence);

            // Destroy the elements in the core data map.
            sequence = sequence.map(id => {
                const res = { id, ts: Microtime.now() };
                this[DATA].drop(id);
                return res;
            });

            // Notifiy plugins that the items in destroyedElements were removed.
            this[WARE].forEach(plugin => plugin.afterDestroy(sequence));
            return sequence;
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

            // Ensure that our sequence is all objects.
            // TODO check that the object is extensible (id, ts properties can be written to)
            if (!sequence.every(elem => typeof elem === 'object')) {
                throw new Error("must save object or sequence of objects");
            }

            // For every plugin, call the beforeSave function.
            this[WARE].forEach(plugin => {
                let result = plugin.beforeSave(sequence);
                sequence = result ? result : sequence;
            });

            // Update timestamp, id (if none) and save.
            sequence.forEach(item => {
                item.id = item.id || UUID.v4;
                item.ts = Microtime.now();
                this[DATA].upsert(item);
                return item;
            });

            // For every plugin, call the afterSave function and return a [Boolean, Object] tuple.
            this[WARE].forEach(p => p.afterSave(sequence));
            return sequence;
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
        let instance = new CustomPlugin(this);

        if (!(instance instanceof Plugin)) {
            throw new TypeError("Custom plugins must derive from Idaten.Plugin");
        }

        if (!this[WARE].some(plugin => plugin instanceof CustomPlugin)) {
            this[WARE].push(instance);
        }
    }
}
