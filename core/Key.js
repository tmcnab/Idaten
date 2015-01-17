import UUID from 'node-uuid';

export default class Key {
    constructor (id = UUID.v4(), ts = Date.now()) {
        this.id = id;
        this.ts = ts;
    }
}
