// Core Imports.
import Key from './core/Key';
import Plugin from './core/Plugin';
import Store from './core/Store';


// Plugin Imports.
import Log from './plugins/LogPlugin';
import Query from './plugins/QueryPlugin';
import View from './plugins/ViewPlugin';


// Exports.
export default {
    Key, Plugin, Store,
    Plugins: { Log, Query, View }
};
