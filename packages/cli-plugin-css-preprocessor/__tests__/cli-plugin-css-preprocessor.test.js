'use strict';

const cliPluginCssPreprocessor = require('..');
const assert = require('assert').strict;

assert.strictEqual(cliPluginCssPreprocessor(), 'Hello from cliPluginCssPreprocessor');
console.info("cliPluginCssPreprocessor tests passed");
