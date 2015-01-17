## Idaten.Log

The`Log`type is not exported outside of the module, however this documentation
is here for reference purposes.

Conceptually, the log is a append-only history of all modifications (insert,
update, destroy) made against a`Idaten.Store`.



---
### `constructor (filePath, packed) => Log`

Constructs a new instance of`Idaten.Log`. If provided file (`filePath`) does
not exist it will be created.

 parameter | default      | description
 --------- | ------------ | -----------
`filePath` | **required** | path to file to save log entries into
`packed`   | `false`      | TBA

```js
import path from 'path';

let fp = path.join(process.cwd(), 'idaten.log');
let log = new Log(fp);

// do log things
```
---
### `record(mode, sequence, sync) => Promise?`

Adds a sequence of records to the log.

 parameter  | default      | description
 ---------- | ------------ | -----------
 `mode`     | **required** | `sequence`items were modified (`1`) or destroyed (`2`)
 `sequence` | **required** | `Array<Diff>`with each element having a root-level `id` property
 `sync`     | `false`      | If`true`, the operation will be performed synchronously.
