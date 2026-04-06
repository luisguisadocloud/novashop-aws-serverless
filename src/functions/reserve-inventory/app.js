import { randomUUID } from "node:crypto";
import { getOrder, updateOrderStatus } from "../../shared/orders-repository.js";

export const handler = async (event) => {
  const { orderId, simulateInventoryFailure = false } = event;

  if (!orderId) {
    throw new Error("orderId is required");
  }

  const order = await getOrder(orderId);

  if (!order) {
    throw new Error(`Order ${orderId} not found`);
  }

  if (simulateInventoryFailure) {
    throw new Error("Inventory reservation failed by simulation");
  }

  const inventoryReservationId = `inv-${randomUUID()}`;

  await updateOrderStatus({
    orderId,
    expectedStatus: "RECEIVED",
    nextStatus: "INVENTORY_RESERVED",
    extra: {
      inventoryReservationId,
    },
  });

  return {
    ...event,
    status: "INVENTORY_RESERVED",
    inventoryReservationId,
  };
};