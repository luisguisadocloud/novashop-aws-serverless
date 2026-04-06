import { randomUUID } from "node:crypto";
import { putOrder } from "../../shared/orders-repository.js";
import { publishDomainEvent } from "../../shared/publish-domain-event.js";
import { jsonResponse } from "../../shared/http.js";

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body ?? "{}");

    const {
      customerId,
      items,
      totalAmount,
      currency = "PEN",
      simulateInventoryFailure = false,
      simulatePaymentFailure = false,
    } = body;

    if (!customerId) {
      return jsonResponse(400, { message: "customerId es obligatorio." });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return jsonResponse(400, { message: "items debe tener al menos un elemento." });
    }

    if (typeof totalAmount !== "number" || totalAmount <= 0) {
      return jsonResponse(400, { message: "totalAmount debe ser un número mayor a 0." });
    }

    const now = new Date().toISOString();
    const orderId = randomUUID();

    const order = {
      orderId,
      customerId,
      items,
      totalAmount,
      currency,
      status: "RECEIVED",
      createdAt: now,
      updatedAt: now,
      simulateInventoryFailure,
      simulatePaymentFailure,
    };

    await putOrder(order);

    await publishDomainEvent({
      detailType: "OrderSubmitted",
      detail: {
        orderId,
        customerId,
        items,
        totalAmount,
        currency,
        simulateInventoryFailure,
        simulatePaymentFailure,
      },
    });

    return jsonResponse(202, {
      message: "Orden recibida y enviada a procesamiento.",
      orderId,
      status: "RECEIVED",
    });
  } catch (error) {
    console.error("create-order error", error);

    return jsonResponse(500, {
      message: "No se pudo registrar la orden.",
      error: error.message,
    });
  }
};