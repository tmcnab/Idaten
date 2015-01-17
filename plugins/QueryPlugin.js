import Plugin from '../core/Plugin';
import Query from './Query';


export default class QueryPlugin extends Plugin {
    constructor (store) {
        super();
        Object.defineProperty(store, 'query', {
            get: () => new Query(this.store.cursor)
        });
    }
}
