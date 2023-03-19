'use strict';

const cliPluginEslint = require('..');
const assert = require('assert').strict;

assert.strictEqual(cliPluginEslint(), 'Hello from cliPluginEslint');
console.info("cliPluginEslint tests passed");
