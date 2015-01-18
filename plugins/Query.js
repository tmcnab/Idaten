/*
**  Docs    https://github.com/tmcnab/Idaten/wiki/Idaten.Plugins.Query
**  Test    /test/Idaten.Plugins.Query.js
**
**  The Query type takes in an iterator and exposes a number of members which themselves return Query instances or
**  collapse the iterator down to a non-iterator (like reduce or toArray).
**
**  Unresolved issues:
**      - from a performance standpoint, should every member type-check their argument(s)?
*/
import Idaten from "..";


const CURSOR = Symbol();


function *$filter (iter, pred) {
    for (let elem of iter) {
        if (pred(elem)) {
            yield elem;
        }
    }
}

function $find (iter, predicate) {
    for (let elem of iter) {
        if (predicate(elem)) {
            return elem;
        }
    }

    return null;
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

function *$skip (iter, number) {
    for (let elem of iter) {
        if (number > 0) {
            number--;
            continue;
        } else {
            yield elem;
        }
    }
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

    find (predicate) {
        return $find(this[CURSOR], predicate);
    }

    map (transformer) {
        return new Query($map(this[CURSOR], transformer));
    }

    reduce (transformer, initialValue) {
        return $reduce(this[CURSOR], transformer, initialValue);
    }

    skip (number) {
        return new Query($skip(this[CURSOR], number));
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
                result.push(obj.value);
            } else {
                done = obj.done;
            }
        } while (!done);

        return result;
    }
}
