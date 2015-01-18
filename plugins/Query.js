// Imports.
import Idaten from "..";


const CURSOR = Symbol();


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

function $clone (value) {
    return JSON.parse(JSON.stringify(value));
}


export default class Query {
    constructor (iterator) {
        this[CURSOR] = iterator;
    }

    // returns a new query of elements that the predicate returns true for.
    // RETURNS QUERY
    filter (predicate) {
        return new Query( $filter(this[CURSOR], predicate) );
    }

    map (transformer) {
        return new Query( $map(this[CURSOR], transformer) );
    }

    reduce (transformer, initialValue) {
        return $reduce(this[CURSOR], transformer, initialValue);
    }

    // terminates the query, returns array of elements left over.
    // RETURNS ARRAY
    toArray () {
        let result = [];

        let done = false;
        do {
            let obj = this[CURSOR].next();
            if (!obj.done) {
                result.push($clone(obj.value));
            } else {
                done = obj.done;
            }
        } while (!done);

        return result;
    }
}
