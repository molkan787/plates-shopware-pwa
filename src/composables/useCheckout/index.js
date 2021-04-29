import Vue from "vue";
import { computed, reactive } from "@vue/composition-api";

import {
  getAvailableShippingMethods,
  getAvailablePaymentMethods,
  // createGuestOrder,
  // createOrder as createApiOrder,
} from "@shopware-pwa/shopware-6-client";
import {
  useUser,
  useCart,
  useSessionContext,
  INTERCEPTOR_KEYS,
  useIntercept,
  getApplicationContext
} from "@shopware-pwa/composables";
import {
  createGuestOrder,
  createOrder as createApiOrder
} from '@/services/checkoutService';


const orderData = Vue.observable({
  guestOrderParams: {},
  shippingMethods: [],
  paymentMethods: [],
});

export const useCheckout = (
  rootContext
) => {
  const { apiInstance, contextName } = getApplicationContext(
    rootContext,
    "useCheckout"
  );
  const { broadcast, intercept } = useIntercept(rootContext);
  const { isLoggedIn } = useUser(rootContext);
  const { refreshCart } = useCart(rootContext);
  const { sessionContext } = useSessionContext(rootContext);

  const shippingMethods = computed(
    () => orderData.shippingMethods
  );
  const paymentMethods = computed(
    () => orderData.paymentMethods
  );
  const localOrderData = reactive(orderData);
  const onOrderPlace = (fn) =>
    intercept(INTERCEPTOR_KEYS.ORDER_PLACE, fn);

  const getShippingMethods = async (
    { forceReload } = { forceReload: false }
  ) => {
    if (shippingMethods.value.length && !forceReload) return shippingMethods;
    const shippingMethodsResponse = await getAvailableShippingMethods(
      apiInstance,
      {
        onlyAvailable: true, // depending on the context, some of them can be hidden due to applied rules describing whether a method can be available
      }
    );
    orderData.shippingMethods = shippingMethodsResponse || [];
    return shippingMethods;
  };

  const getPaymentMethods = async (
    { forceReload } = { forceReload: false }
  ) => {
    if (paymentMethods.value.length && !forceReload) return paymentMethods;
    const paymentMethodsResponse = await getAvailablePaymentMethods(
      apiInstance,
      {
        onlyAvailable: true, // depending on the context, some of them can be hidden due to applied rules describing whether a method can be available
      }
    );
    orderData.paymentMethods = paymentMethodsResponse || [];
    return paymentMethods;
  };

  const createOrder = async (customFields) => {
    console.log('my custom createOrder')
    const params = { customFields };
    try {
      let order;
      if (isGuestOrder.value) {
        order = await createGuestOrder(
          { ...params, ... orderData.guestOrderParams },
          apiInstance
        );
      } else {
        order = await createApiOrder(params, apiInstance);
      }
      broadcast(INTERCEPTOR_KEYS.ORDER_PLACE, {
        order,
      });

      return order;
    } catch (e) {
      const err = e;
      broadcast(INTERCEPTOR_KEYS.ERROR, {
        methodName: `[${contextName}][createOrder]`,
        inputParams: {},
        error: err,
      });
      throw err;
    } finally {
      await refreshCart();
    }
  };
  const isGuestOrder = computed(() => !isLoggedIn.value);

  const guestOrderParams = computed(() => localOrderData.guestOrderParams);
  const updateGuestOrderParams = (params) => {
    orderData.guestOrderParams = { ...orderData.guestOrderParams, ...params };
  };

  const shippingAddress = computed(() =>
    isGuestOrder.value
      ? guestOrderParams.value.shippingAddress
      : sessionContext.value?.shippingLocation?.address
  );
  const billingAddress = computed(() =>
    isGuestOrder.value
      ? guestOrderParams.value.billingAddress
      : sessionContext.value?.customer?.activeBillingAddress
  );

  return {
    isGuestOrder,
    getPaymentMethods,
    paymentMethods,
    getShippingMethods,
    shippingMethods,
    createOrder,
    guestOrderParams,
    updateGuestOrderParams,
    shippingAddress,
    billingAddress,
    onOrderPlace,
  };
};