'use strict';

function handleFatalError(error) {
  console.error(`[fatal error]`, error.message);
  console.error(error.stack);
  process.exit(1);
}

module.exports = {
  handleFatalError
};
