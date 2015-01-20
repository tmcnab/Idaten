/*
**
*/
const OBJ = Symbol();
const TSP = Symbol();


function $freezeClone (object) {
    let d = JSON.parse(JSON.stringify(object));
    Object.freeze(d);
    return d;
}


export default class Core {
    constructor () {
        this[OBJ] = new Map();
        this[TSP] = new Map();
    }

    get iterator () {
        return this[OBJ].values();
    }

    get size () {
        return this[OBJ].size;
    }

    clear () {
        let rOBJ = this[OBJ].clear();
        let rTSP = this[TSP].clear();

        // TODO rollback on bad clear?

        return rOBJ && rTSP;
    }

    drop (id) {
        let rOBJ = this[OBJ].delete(id);
        let rTSP = this[TSP].delete(id);

        // TODO rollback on bad delete.

        return rOBJ && rTSP;
    }

    exists (id) {
        return this[OBJ].has(id);
    }

    upsert (object) {
        this[OBJ].set(object.id, $freezeClone(object));
        this[TSP].set(object.id, object.ts);
    }
}
