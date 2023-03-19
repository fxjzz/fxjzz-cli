'use strict';

const cliPluginStylelint = require('..');
const assert = require('assert').strict;

assert.strictEqual(cliPluginStylelint(), 'Hello from cliPluginStylelint');
console.info("cliPluginStylelint tests passed");
