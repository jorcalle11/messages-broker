'use strict';

const casual = require('casual');
const queue = require('@messages-broker/queue');
const utils = require('@messages-broker/utils');
const cli = require('@messages-broker/cli');

async function sender() {
  const queueName = process.env.QUEUE_NAME;
  let totalMessagesCount = 0;
  let sendLatencyTime = 0;

  const table = cli.table({
    headers: ['Queue_Name', 'Total_Messages_Sent', 'Latency'],
    initData: [queueName, totalMessagesCount, `${sendLatencyTime} ms`],
    title: ' Messages Broker - Producer '
  });

  while (true) {
    const message = prepareMessage();
    const startTime = Date.now();
    await queue.sendMessage(message);
    const endTime = Date.now();

    sendLatencyTime = endTime - startTime;
    totalMessagesCount++;
    table.renderData([queueName, totalMessagesCount, `${sendLatencyTime} ms`]);
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
