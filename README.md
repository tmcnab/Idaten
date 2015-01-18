Idaten
======

Idaten is a modular, in-process data store built using ES6 features. It offers
a super-simple interface. Here's an express router using a Store:

```js
import Express from 'express';
import Idaten from 'idaten';

let router = module.exports = Express.Router();
let store = new Idaten.Store();
store.use(Idaten.Plugins.Query);                    // provides store.query

router.get('/', (req, res) => {
    let people = store.query.toArray();             // get all people
    res.render('index', { people });
});

router.post('/', (req, res) => {
    let name = req.body.name;
    let age = parseInt(req.body.age, 10);
    store.save({ age, name }, true);                // sync save
    res.redirect('/');
});

router.get('/:id', (req, res) => {
    let yep = rst => res.redirect('/');
    let nope = err => res.render('error', err);
    store.destroy(req.params.id).then(yep, nope);   // async returns a Promise
});
```

Setup
-----

* To install: `npm install idaten`
* To test: `npm test`

To use in your personal projects, `6to5` is recommended. To import the module
you will need to use `require("6to5/register")({ ignore: false });` before
importing Idaten. This will prevent 6to5 from ignoring Idaten.
