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

    afterSave (sequence) {
        this[LOG].save(sequence);
    }

    afterDestroy (sequence) {
        this[LOG].remove(sequence);
    }
}
