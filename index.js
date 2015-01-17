// Core Imports.
import Key from './core/Key';
import Plugin from './core/Plugin';
import Store from './core/Store';


// Plugin Imports.
import Index from './plugins/IndexPlugin';
import Log from './plugins/LogPlugin';
import Query from './plugins/QueryPlugin';


// Exports.
export default {
    Key, Plugin, Store,
    Plugins: { Index, Log, Query }
};
