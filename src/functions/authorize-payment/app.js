import { randomUUID } from "node:crypto";
import { updateOrderStatus } from "../../shared/orders-repository.js";

export const handler = async (event) => {
  const { orderId, simulatePaymentFailure = false } = event;

  if (!orderId) {
    throw new Error("orderId is required");
  }

  if (simulatePaymentFailure) {
    throw new Error("Payment authorization failed by simulation");
  }

  const paymentAuthorizationId = `pay-${randomUUID()}`;

  await updateOrderStatus({
    orderId,
    expectedStatus: "INVENTORY_RESERVED",
    nextStatus: "PAYMENT_AUTHORIZED",
    extra: {
      paymentAuthorizationId,
    },
  });

  return {
    ...event,
    status: "PAYMENT_AUTHORIZED",
    paymentAuthorizationId,
  };
};