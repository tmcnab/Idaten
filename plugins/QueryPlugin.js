import Plugin from '../core/Plugin';
import Query from './Query';


export default class QueryPlugin extends Plugin {
    constructor (core_map, store) {
        super(core_map);

        Object.defineProperty(store, 'query', {
            get: () => this.query
        });
    }

    get query () {
        return new Query(this.cursor);
    }
}
