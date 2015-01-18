/*
**  Docs    https://github.com/tmcnab/Idaten/wiki/Idaten.Plugins.Query
**  Test    /test/Idaten.Plugins.Query.js
**
**  The Query type takes in an iterator and exposes a number of members which themselves return Query instances or
**  collapse the iterator down to a non-iterator (like reduce or toArray).
**
**  Unresolved issues:
**      - if a consumer passes in a predicate, that predicate is able to modify properties. Either the members
**        of Query should clone when invoking a transformer/predicate (so bad) or the Store should freeze objects
**        on insertion (also bad).
**      - from a performance standpoint, should every member type-check their argument(s)?
*/
import Idaten from "..";


const CURSOR = Symbol();


function $clone (value) {
    return JSON.parse(JSON.stringify(value));
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

function *$take (iter, number) {
    for (let i = 0; i < number; i++) {
        let elem = iter.next();
        if (elem.done) {
            break
        } else {
            yield elem.value;
        }
    }
}


export default class Query {
    constructor (iterator) {
        this[CURSOR] = iterator;
    }

    filter (predicate) {
        return new Query($filter(this[CURSOR], predicate));
    }

    map (transformer) {
        return new Query($map(this[CURSOR], transformer));
    }

    reduce (transformer, initialValue) {
        return $reduce(this[CURSOR], transformer, initialValue);
    }

    take (number) {
        return new Query($take(this[CURSOR], number));
    }

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
