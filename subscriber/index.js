'use strict';

const fs = require('fs');
const path = require('path');
const queue = require('@messages-broker/queue');
const utils = require('@messages-broker/utils');

async function receiver() {
  let totalMessagesCount = 0;

  while (true) {
    const messages = await queue.receiveMessages();
    if (!messages.length) {
      console.log('No messages received');
    }

    for (const message of messages) {
      try {
        await processMessage(message);
        const receiptHandle = message.ReceiptHandle;
        await queue.deleteMessage(receiptHandle);
        totalMessagesCount++;
      } catch (error) {
        console.log(`the message ${message.MessageId} couldn't be processed`);
      }

      console.log(`${totalMessagesCount} were processed`);
    }
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
