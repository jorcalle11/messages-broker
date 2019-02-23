'use strict';

const path = require('path');
const pathToEnv = path.join(__dirname, '../', '.env');
require('dotenv').config({ path: pathToEnv });

module.exports = require('./sqs');
