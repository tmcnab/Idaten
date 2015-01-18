import http from 'http';
import Idaten from '..';



let store = new Idaten.Store();
store.use(Idaten.Plugins.Query);

store.save({ id: 1, table: 'People', name: 'Craig', wallet: 8 });
store.save({ id: 2, table: 'People', name: 'Suzie', wallet: 9 });
store.save({ id: 8, table: 'Wallet', cash: 1234.98 });
store.save({ id: 9, table: 'Wallet', cash: 9876.54 });

const $tables = () => {
    let items = [];
    let set = store.query.map(k => k.table).reduce((a, k) => {
        a.add(k);
        return a;
    }, new Set());

    for (let value of set) items.push(value);
    return items;
};


http.createServer((req, res) => {
    let parts = req.url.split('/');

    if (parts[1] === '') {
        console.log('/');
        res.write(JSON.stringify($tables(), null, 2));
    } else {
        let tableData = store.query.filter(r => r.table === parts[1]);
        if (parts[2]) {
            let id = parseInt(parts[2], 10);
            let single = tableData.filter(r => r.id === id).toArray()[0];
            res.write(JSON.stringify(single, null, 2));
        } else {
            res.write(JSON.stringify(tableData.toArray(), null, 2));
        }
    }

    res.end();
}).listen(3000);
