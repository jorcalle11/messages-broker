'use strict';

const queue = require('@messages-broker/queue');

async function showQueueStatus() {
  while (true) {
    const { Attributes } = await queue.getStatus();

    console.log({
      visibleMessages: Attributes.ApproximateNumberOfMessages,
      processingMessages: Attributes.ApproximateNumberOfMessagesNotVisible,
      messagesDelayed: Attributes.ApproximateNumberOfMessagesDelayed
    });
  }
}

function handleFatalError(error) {
  console.error(`[fatal error]`, error.message);
  console.error(error.stack);
  process.exit(1);
}

showQueueStatus().catch(handleFatalError);
