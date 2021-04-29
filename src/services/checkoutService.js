import {
  getCheckoutOrderEndpoint,
  getCheckoutGuestOrderEndpoint,
} from "@shopware-pwa/shopware-6-client";

/**
 * Creates an order for logged in users
 * @beta
 */
export async function createOrder(
    params,
  contextInstance
) {
  const resp = await contextInstance.invoke.post(
    getCheckoutOrderEndpoint(),
    params
  );

  return resp.data?.data;
}

/**
 * Creates an order for not logged in users
 * Should be used when the user is logged out, but has items in the cart
 * @beta
 */
export async function createGuestOrder(
  params,
  contextInstance
) {
  if (!params) {
    throw new Error("createGuestOrder method requires GuestOrderParams");
  }

  const resp = await contextInstance.invoke.post(
    getCheckoutGuestOrderEndpoint(),
    params
  );

  return resp.data?.data;
}
