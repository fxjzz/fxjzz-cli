'use strict';

const cliService = require('..');
const assert = require('assert').strict;

assert.strictEqual(cliService(), 'Hello from cliService');
console.info("cliService tests passed");
