'use strict';

const fs = require('fs');
const path = require('path');
const queue = require('@messages-broker/queue');
const utils = require('@messages-broker/utils');
const cli = require('@messages-broker/cli');

async function receiver() {
  let totalMessagesCount = 0;
  const queueName = process.env.QUEUE_NAME;
  let receiveTime = 0;
  let processingTime = 0;

  const table = cli.table({
    headers: [
      'Queue_Name',
      'Total_Messages_Processed',
      'Receive_Wait_Time',
      'Processing_Time'
    ],
    initData: [queueName, totalMessagesCount, '0 ms', '0 ms'],
    title: ' Messages Broker - Subscriber ',
    styles: {
      selectedBg: 'black',
      border: { type: 'line', fg: 'green' }
    }
  });

  while (true) {
    const receiveStartTime = Date.now();
    const messages = await queue.receiveMessages();
    const receiveEndTime = Date.now();
    receiveTime = receiveEndTime - receiveStartTime;

    for (const message of messages) {
      try {
        const processingStartTime = Date.now();
        await processMessage(message);

        const receiptHandle = message.ReceiptHandle;
        await queue.deleteMessage(receiptHandle);
        const processingEndTime = Date.now();
        totalMessagesCount++;
        processingTime = processingEndTime - processingStartTime;
      } catch (error) {
        console.log(`the message ${message.MessageId} couldn't be processed`);
      }
    }

    table.renderData([
      process.env.QUEUE_NAME,
      totalMessagesCount,
      `${receiveTime} ms`,
      `${processingTime} ms`
    ]);
  }
}

function processMessage(message) {
  const user = message.Body;
  return saveOnDB(user);
}

async function saveOnDB(user = {}) {
  const dbPath = path.join(__dirname, '../', 'db.txt');
  return new Promise((resolve, reject) => {
    fs.appendFile(dbPath, `${JSON.stringify(user)},`, err => {
      if (err) {
        return reject(err);
      }
      resolve('the data was appended to file');
    });
  });
}

receiver().catch(utils.handleFatalError);
