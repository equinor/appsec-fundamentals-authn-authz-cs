'use strict';

const { test } = require('tap');
var sinon = require('sinon');
const __ = require('underscore');


/*

The chache plugin is example code make and tested by MS for msal.
Not sure if there is a need of any testing as long as we have not
made any changes.

*/


test('Cacheplugin should return expected functions',async (t) => {

    const cacheLocation = '../data/cache.json';
    const cachePlugin = require('../lib/cachePlugin')(cacheLocation);

    t.ok(__.isFunction(cachePlugin.beforeCacheAccess), 'beforeCacheAccess should be available as function');
    t.ok(__.isFunction(cachePlugin.afterCacheAccess), 'afterCacheAccess should be available as function');
       
    t.end();
});
