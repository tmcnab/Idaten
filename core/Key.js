import UUID from 'node-uuid';

export default class Key {
    constructor (id = UUID.v4(), ts = Date.now()) {
        this.id = id;
        this.ts = parseInt(ts, 10);

        if (Number.isNaN(this.ts)) {
            throw new TypeError("provided timestamp is not an integer or convertable to one");
        }
    }
}
