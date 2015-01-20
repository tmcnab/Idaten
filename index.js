// Core Imports.
import Plugin from './core/Plugin';
import Store from './core/Store';


// Plugin Imports.
import Log from './plugins/LogPlugin';
import Query from './plugins/QueryPlugin';
import View from './plugins/ViewPlugin';


// Exports.
export default {
    Plugin, Store,
    Plugins: { Log, Query, View }
};
