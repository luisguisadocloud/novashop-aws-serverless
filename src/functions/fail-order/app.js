import { updateOrderStatus } from "../../shared/orders-repository.js";
import { publishDomainEvent } from "../../shared/publish-domain-event.js";

export const handler = async (event) => {
  const { orderId, customerId, totalAmount } = event;

  if (!orderId) {
    throw new Error("orderId is required");
  }

  const failureReason =
    event?.error?.Cause ??
    event?.error?.Error ??
    "Unknown processing error";

  const updatedOrder = await updateOrderStatus({
    orderId,
    nextStatus: "FAILED",
    failureReason,
  });

  await publishDomainEvent({
    detailType: "OrderFailed",
    detail: {
      orderId,
      customerId,
      totalAmount,
      status: "FAILED",
      reason: failureReason,
    },
  });

  return {
    ...event,
    status: "FAILED",
    failureReason,
    order: updatedOrder,
  };
};