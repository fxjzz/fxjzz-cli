'use strict';

const cliPluginTypescript = require('..');
const assert = require('assert').strict;

assert.strictEqual(cliPluginTypescript(), 'Hello from cliPluginTypescript');
console.info("cliPluginTypescript tests passed");
