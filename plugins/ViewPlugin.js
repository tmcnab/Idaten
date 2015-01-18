import Query from './Query';
import Plugin from '../core/Plugin';
import QueryPlugin from './QueryPlugin';


const STORE = Symbol();
const VIEWS = Symbol();


export default class ViewPlugin extends Plugin {

    constructor (store) {
        this[STORE] = store;
        this[VIEWS] = new Map();

        store.use(QueryPlugin);

        Object.defineProperty(store, 'views', {
            get: () => this
        });
    }

    register (name, definition) {
        if (typeof name !== 'string' || name.length < 1) {
            throw new TypeError("argument 'name' must be a string");
        }

        if (!(definition instanceof Query) && (typeof definition !== 'function')) {
            throw new TypeError("argument 'view' must be a Query or Function");
        }

        this[VIEWS].set(name, definition);
    }

    materialize (name) {
        let definition = this[VIEWS].get(name);

        if (!definition) {
            throw new Error(`could not find view definition '${name}'`);
        }

        if (definition instanceof Query) {
            return definition.toArray();
        } else {
            return definition();
        }
    }
}
