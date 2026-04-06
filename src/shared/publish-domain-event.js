import { PutEventsCommand } from "@aws-sdk/client-eventbridge";
import { eventBridge } from "./aws-clients.js";

const EVENT_BUS_NAME = process.env.EVENT_BUS_NAME;

export async function publishDomainEvent({ detailType, detail }) {
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/eventbridge/command/PutEventsCommand/
  // The total entry size must be less than 256KB.
  const response = await eventBridge.send(
    new PutEventsCommand({
      Entries: [
        {
          EventBusName: EVENT_BUS_NAME,
          Source: "com.novashop.orders",
          DetailType: detailType,
          Detail: JSON.stringify(detail),
        },
      ],
    })
  );

  if ((response.FailedEntryCount ?? 0) > 0) {
    throw new Error(
      `EventBridge PutEvents failed: ${JSON.stringify(response.Entries)}`
    );
  }
}