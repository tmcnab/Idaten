import { Buffer } from 'buffer';
import fsys from 'fs';
import Key from '../core/Key';
import path from 'path';
import Reader from 'buffered-file-line-reader-sync';


const PATH = Symbol();      // File Path
const STORE = Symbol();     // Store reference


const $destroyRow = (r) => `-\t-1\t${r[0].ts}\t${r[0].id}\n`;
const $saveRow = (r) => `+\t${r[2]?r[2].ts:-1}\t${r[0].ts}\t${r[0].id}\t${JSON.stringify(r[1])}\n`;
const $write = (fp, bf) => fsys.appendFileSync(fp, bf, { flag: 'a+' });
const $freeze = (o) => {
    Object.freeze(o);
    return o;
};


export default class Log {
    constructor (store) {
        this[PATH] = path.join(process.cwd(), 'idaten.log');
        this[STORE] = store;
    }

    load (sync = false) {
        const work = () => {
            let reader = new Reader(this[PATH]);

            let data = this[STORE].__data__;
            data.clear();

            while(reader.hasNextLine()) {
                let [operation, ots, nts, id, obj] = reader.nextLine().split('\t');
                ots = parseInt(ots, 10);
                let key = new Key(id, parseInt(nts, 10));

                switch (operation) {
                    case '+': {
                        data.set(key, $freeze(JSON.parse(obj)));
                    } break;

                    case '-': {
                        data.delete(key);
                    } break;

                    default: {
                        throw new Error("[Idaten.Plugins.Log] unrecognized operation");
                    }
                }
            }
        };

        work();
        // throw new Error("Not Implemented");
    }

    get path () {
        return this[PATH];
    }

    set path (value) {
        return (this[PATH] = value);
    }

    remove (sequence) {
        $write(this[PATH], new Buffer(
            sequence.reduce((content, element) => content + $destroyRow(element), ""),
            "utf-8"
        ));
    }

    save (sequence) {
        $write(this[PATH], new Buffer(
            sequence.reduce((content, element) => (element[1] ? content + $saveRow(element) : content), ""),
            "utf-8"
        ));
    }

    squash (sync = false) {
        throw new Error('Not Implemented');
    }
}
