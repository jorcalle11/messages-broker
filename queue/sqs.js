'use strict';

const AWS = require('aws-sdk');

// Get the region from url
const [, region] = process.env.QUEUE_URL.split('.');

// Create SQS service object
const sqs = new AWS.SQS({
  region,
  apiVersion: '2012-11-05',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const queueName = process.env.QUEUE_NAME;
const queueUrl = `${process.env.QUEUE_URL}/${queueName}`;

async function getQueues() {
  return sqs.listQueues().promise();
}

function create({
  queueName,
  delaySeconds = '60',
  messageRetencionPeriod = '86400',
  receiveMessageWaitTimeSeconds = '10',
  visibilityTimeout = '120'
} = {}) {
  return sqs
    .createQueue({
      QueueName: queueName,
      Attributes: {
        DelaySeconds: delaySeconds,
        MessageRetentionPeriod: messageRetencionPeriod,
        ReceiveMessageWaitTimeSeconds: receiveMessageWaitTimeSeconds,
        VisibilityTimeout: visibilityTimeout
      }
    })
    .promise();
}

function remove() {
  return sqs.deleteQueue({ QueueUrl: queueUrl }).promise();
}

function getStatus() {
  return sqs
    .getQueueAttributes({
      QueueUrl: queueUrl,
      AttributeNames: [
        'ApproximateNumberOfMessages',
        'MaximumMessageSize',
        'ApproximateNumberOfMessagesNotVisible',
        'ApproximateNumberOfMessagesDelayed',
        'ReceiveMessageWaitTimeSeconds'
      ]
    })
    .promise();
}

function sendMessage(message = {}, options = { delaySeconds: 10 }) {
  return sqs
    .sendMessage({
      DelaySeconds: options.delaySeconds,
      MessageBody: JSON.stringify(message),
      QueueUrl: queueUrl
    })
    .promise();
}

function receiveMessages({
  visibilityTimeout,
  waitTimeSeconds = 10,
  maxNumberOfMessages = 10,
  messageAttributeNames = ['All']
} = {}) {
  return sqs
    .receiveMessage({
      QueueUrl: queueUrl,
      MaxNumberOfMessages: maxNumberOfMessages,
      MessageAttributeNames: messageAttributeNames,
      VisibilityTimeout: visibilityTimeout,
      WaitTimeSeconds: waitTimeSeconds
    })
    .promise()
    .then(data => {
      const { Messages = [] } = data;
      return Messages.map(m => {
        const parsedBody = JSON.parse(m.Body);
        return { ...m, Body: parsedBody };
      });
    });
}

function deleteMessage(receiptHandle) {
  const params = {
    ReceiptHandle: receiptHandle,
    QueueUrl: queueUrl
  };

  return sqs.deleteMessage(params).promise();
}

module.exports = {
  create,
  deleteMessage,
  getQueues,
  getStatus,
  receiveMessages,
  remove,
  sendMessage
};
