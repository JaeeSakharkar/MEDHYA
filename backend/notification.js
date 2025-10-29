// Notification util for sending reminders/updates using SNS

const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");
const snsClient = new SNSClient({ region: process.env.AWS_REGION });

/**
 * Send a reminder/notification with SNS Topic ARN from .env
 **/
async function sendNotification(message) {
  const input = {
    TopicArn: process.env.SNS_TOPIC_ARN,
    Message: message
  };
  await snsClient.send(new PublishCommand(input));
  return true;
}

module.exports = {
  sendNotification
};
