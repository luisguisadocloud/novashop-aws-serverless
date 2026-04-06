import { GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "./aws-clients.js";

const TABLE_NAME = process.env.ORDERS_TABLE_NAME;

export async function putOrder(order) {
  await ddb.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: order,
      ConditionExpression: "attribute_not_exists(orderId)",
    })
  );

  return order;
}

export async function getOrder(orderId) {
  const response = await ddb.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { orderId },
    })
  );

  return response.Item;
}

export async function updateOrderStatus({
  orderId,
  expectedStatus,
  nextStatus,
  extra = {},
  failureReason,
}) {
  const now = new Date().toISOString();

  const ExpressionAttributeNames = {
    "#status": "status",
  };

  const ExpressionAttributeValues = {
    ":nextStatus": nextStatus,
    ":updatedAt": now,
  };

  let UpdateExpression = "SET #status = :nextStatus, updatedAt = :updatedAt";
  let ConditionExpression;

  if (expectedStatus) {
    ExpressionAttributeValues[":expectedStatus"] = expectedStatus;
    ConditionExpression = "#status = :expectedStatus";
  }

  let index = 0;

  for (const [key, value] of Object.entries(extra)) {
    index += 1;

    const attrName = `#attr${index}`;
    const attrValue = `:value${index}`;

    ExpressionAttributeNames[attrName] = key;
    ExpressionAttributeValues[attrValue] = value;
    UpdateExpression += `, ${attrName} = ${attrValue}`;
  }

  if (failureReason) {
    ExpressionAttributeNames["#failureReason"] = "failureReason";
    ExpressionAttributeValues[":failureReason"] = failureReason;
    UpdateExpression += ", #failureReason = :failureReason";
  }

  const response = await ddb.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { orderId },
      UpdateExpression,
      ConditionExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      ReturnValues: "ALL_NEW",
    })
  );

  return response.Attributes;
}