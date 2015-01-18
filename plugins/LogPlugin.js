import fsys from 'fs';
import Log from './Log';
import path from 'path';
import Plugin from '../core/Plugin';


const LOG = Symbol();


export default class LogPlugin extends Plugin {

    constructor (store) {
        this[LOG] = new Log(store);

        Object.defineProperty(store, 'log', {
            get: () => this[LOG]
        });
    }

    afterSave (kvtkSequence) {
        this[LOG].save(kvtkSequence);
    }

    afterDestroy (seq) {
        this[LOG].remove(seq);
    }
}
