import { randomUUID } from "node:crypto";
import { updateOrderStatus } from "../../shared/orders-repository.js";
import { publishDomainEvent } from "../../shared/publish-domain-event.js";

export const handler = async (event) => {
  const { orderId, customerId, totalAmount } = event;

  if (!orderId) {
    throw new Error("orderId is required");
  }

  const shippingRequestId = `ship-${randomUUID()}`;

  const updatedOrder = await updateOrderStatus({
    orderId,
    expectedStatus: "PAYMENT_AUTHORIZED",
    nextStatus: "COMPLETED",
    extra: {
      shippingRequestId,
    },
  });

  await publishDomainEvent({
    detailType: "OrderCompleted",
    detail: {
      orderId,
      customerId,
      totalAmount,
      shippingRequestId,
      status: "COMPLETED",
    },
  });

  return {
    ...event,
    status: "COMPLETED",
    shippingRequestId,
    order: updatedOrder,
  };
};