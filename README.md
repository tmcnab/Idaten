Idaten
======

Idaten is an modular, in-process data store built using ES6 features.


Idaten.Store
------------

```js
import { Store } from 'Idaten';

let db = new Store('app.log');

db.store({ name: 'John', age: 27 });
db.store({ name: 'Jane', age: 34 });
db.store({ name: 'Jill', age: 17 });

let overTwenty = db.query.filter(m => m.age > 20);

overTwenty.toArray().forEach(console.log);
// [{ name: 'John', age: 27 },
//  { name: 'Jane', age: 34 }]



```


### store.






Idaten.Plugin
-------------
