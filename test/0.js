import { log } from './test';
import fs from 'fs';
import Idaten from '..';

const $ = (test, message) => require('assert')(test, message);
const filePath = require('path').join(__dirname, 'idaten.0.log');


// Destroy the logfile before starting our tests.
if (fs.existsSync(filePath)) fs.unlinkSync(filePath);


// Create a new store.
var store = new Idaten.Store(filePath);


// Load the store with data.
require('./test-data.json').forEach(object => store.save(object).then(console.log, console.error));


class Record {
    constructor () {
        this.id = Number;
        this.first_name = String;
        this.last_name = String;
        this.email = String;
        this.country = String;
        this.ip_address = String;
    }

    get fullName () {
        return `${this.first_name} ${this.last_name}`;
    }
}
