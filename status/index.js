'use strict';

const queue = require('@messages-broker/queue');
const cli = require('@messages-broker/cli');
const utils = require('@messages-broker/utils');

async function showQueueStatus() {
  const queueName = process.env.QUEUE_NAME;
  let receiveTime = 0;

  const table = cli.table({
    headers: [
      'Queue_Name',
      'Visible_Messages',
      'Processing_Messages',
      'MessagesDelayed',
      'Receive_Time'
    ],
    initData: [queueName, 0, 0, 0, `${receiveTime} ms`],
    title: ' Messages Broker - Queue Status ',
    styles: {
      selectedBg: 'cyan',
      border: { type: 'line', fg: 'red' }
    }
  });

  while (true) {
    const receiveStartTime = Date.now();
    const { Attributes } = await queue.getStatus();
    const receiveEndTime = Date.now();
    receiveTime = receiveEndTime - receiveStartTime;

    table.renderData([
      queueName,
      Attributes.ApproximateNumberOfMessages,
      Attributes.ApproximateNumberOfMessagesNotVisible,
      Attributes.ApproximateNumberOfMessagesDelayed,
      `${receiveTime} ms`
    ]);
  }
}

showQueueStatus().catch(utils.handleFatalError);
