'use strict';

const casual = require('casual');
const queue = require('@messages-broker/queue');
const utils = require('@messages-broker/utils');

async function sender() {
  let totalMessagesCount = 0;
  while (true) {
    const message = prepareMessage();
    const startTime = Date.now();
    await queue.sendMessage(message);
    const endTime = Date.now();

    totalMessagesCount++;

    console.log({
      totalMessagesSent: totalMessagesCount,
      sendLatency: `${endTime - startTime} ms`
    });
  }
}

function prepareMessage() {
  return {
    type: 'ADD_USER',
    firstName: casual.first_name,
    middleName: casual.first_name,
    lastName: casual.last_name,
    email: casual.email,
    phone: casual.phone,
    address: casual.address
  };
}

sender().catch(utils.handleFatalError);
