import { jsonResponse } from "../../shared/http";
import { getOrder } from "../../shared/orders-repository";

export const handler = async (event) => {
  try {
    const orderId = event.pathParameters?.orderId;

    if (!orderId) {
      return jsonResponse(400, { message: "orderId es obligatorio." });
    }

    const order = await getOrder(orderId);

    if (!order) {
      return jsonResponse(404, { message: "Orden no encontrada." });
    }

    return jsonResponse(200, order);
  } catch (error) {
    console.error("get-order error", error);

    return jsonResponse(500, {
      message: "No se pudo consultar la orden.",
      error: error.message,
    });
  }
};