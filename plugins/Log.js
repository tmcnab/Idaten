import { Buffer } from 'buffer';
import fsys from 'fs';
import path from 'path';
import Reader from 'buffered-file-line-reader-sync';


const PATH = Symbol();      // File Path
const STORE = Symbol();     // Store reference


const $destroyRow = (r) => `-\t${r.ts}\t${r.id}\n`;
const $saveRow = (r) => `+\t${r.ts}\t${r.id}\t${JSON.stringify(r)}\n`;
const $write = (fp, bf) => fsys.appendFileSync(fp, bf, { flag: 'a+' });


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
                let [operation, ts, id, obj] = reader.nextLine().split('\t');
                ts = Number(ts, 10);

                switch (operation) {
                    case '+': {
                        data.upsert(JSON.parse(obj));
                    } break;

                    case '-': {
                        data.drop(id);
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
            sequence.reduce((content, element) => content + $destroyRow(element), "")
        ));
    }

    save (sequence) {
        $write(this[PATH], new Buffer(
            sequence.reduce((content, element) => content + $saveRow(element), "")
        ));
    }

    squash (sync = false) {
        throw new Error('Not Implemented');
    }
}
