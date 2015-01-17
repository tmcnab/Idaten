// Imports.
import Idaten from "..";


// Query Backing Functions.

function *$cast (iter, type) {
    for (let elem of iter) {
        let inst = new type();
        Object.keys(inst).forEach(k => inst[k] = elem[k]);
        yield inst;
    }
}

function *$filter (iter, pred) {
    for (let elem of iter) {
        if (pred(elem)) {
            yield elem;
        }
    }
}

function *$map (iter, trans) {
    for (let el of iter) {
        yield trans(el);
    }
}

function $reduce (iter, trans, initial) {
    for (let elem of iter) {
        initial = trans(initial, elem);
    }

    return initial;
}


export default class Query {
    constructor (iterator) {
        Object.defineProperty(this, 'cursor', { value: iterator });
    }

    cast (type) {
        return new Query(
            $cast(this.cursor, type));
        }

        // RETURNS BOOLEAN
        contains (predicate) {
            return false;
        }

        // returns the number of elements that the predicate returns true for.
        // RETURNS NUMBER
        count (predicate) {
            return 0;
        }

        // returns true if every element the predicate uses is true
        // RETURNS BOOLEAN
        every (predicate) {
            return false;
        }

        // returns a new query of elements that the predicate returns true for.
        // RETURNS QUERY
        filter (predicate) {
            return new Query( $filter(this.cursor, predicate) );
        }


        map (transformer) {
            return new Query( $map(this.cursor, transformer) );
        }

        reduce (transformer, initialValue) {
            return $reduce(this.cursor, transformer, initialValue);
        }


        // terminates the query, returns array of elements left over.
        // RETURNS ARRAY
        toArray () {
            let result = [];

            let done = false;
            do {
                let obj = this.cursor.next();
                if (!obj.done) {
                    result.push(obj.value);
                } else {
                    done = obj.done;
                }
            } while (!done);

            return result;
        }
    }
