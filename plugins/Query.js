/*
**
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
        return new Query( $filter(this[CURSOR], predicate) );
    }

    map (transformer) {
        return new Query( $map(this[CURSOR], transformer) );
    }

    reduce (transformer, initialValue) {
        return $reduce(this[CURSOR], transformer, initialValue);
    }

    take (number) {
        // TODO assert number is integer.
        return new Query( $take(this[CURSOR], number) );
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
