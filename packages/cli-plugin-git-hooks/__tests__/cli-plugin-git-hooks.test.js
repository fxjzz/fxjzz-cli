'use strict';

const cliPluginGitHooks = require('..');
const assert = require('assert').strict;

assert.strictEqual(cliPluginGitHooks(), 'Hello from cliPluginGitHooks');
console.info("cliPluginGitHooks tests passed");
