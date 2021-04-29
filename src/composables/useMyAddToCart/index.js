console.log('use my cart');

import { ref, computed } from "@vue/composition-api";
import {
  useCart,
  useSharedState,
  getApplicationContext,
  INTERCEPTOR_KEYS,
  useIntercept,
} from "@shopware-pwa/composables";
import { getCheckoutCartLineItemEndpoint } from '@shopware-pwa/shopware-6-client';

export const useAddToCart = (
  rootContext,
  product
) => {
  const { apiInstance, contextName } = getApplicationContext(
    rootContext,
    "useAddToCart"
  );
  const { sharedRef } = useSharedState(rootContext);
  const _storeCart = sharedRef(`${contextName}-cart`);
  const { broadcast, intercept } = useIntercept(rootContext);
  const { cartItems, refreshCart } = useCart(rootContext);
  const quantity = ref(1);
  const loading = ref(false);
  const error = ref(null);

  const addToCart = async (customFields) => {
    if (!product || !product.id) {
      error.value =
        "Product has to be passed as a composable argument and needs to have an id property.";
      return;
    }
    loading.value = true;
    error.value = null;
    if (!quantity.value) quantity.value = 1;
    try {
      // await addProduct({ id: product.id, quantity: quantity.value });
      await addProductToCart(product.id, quantity.value, customFields, apiInstance);
      // _storeCart.value = cart;
      await refreshCart();
      broadcast(INTERCEPTOR_KEYS.ADD_TO_CART, {
        product,
        quantity: quantity.value,
      });
      quantity.value = 1;
    } catch (e) {
      const err = e;
      error.value = err;
      broadcast(INTERCEPTOR_KEYS.ERROR, {
        methodName: `[${contextName}][addToCart]`,
        inputParams: {
          product,
          quantity: quantity.value,
        },
        error: err,
      });
    } finally {
      loading.value = false;
    }
  };

  const onAddToCart = (fn) =>
    intercept(INTERCEPTOR_KEYS.ADD_TO_CART, fn);

  const getStock = computed(() => product && product.stock);

  const isInCart = computed(
    () =>
      product &&
      cartItems.value.some((item) => item.referencedId === product.id)
  );

  return {
    addToCart,
    quantity,
    error,
    loading,
    getStock,
    isInCart,
    onAddToCart,
  };
};

async function addProductToCart(
  productId,
  quantity,
  customFields,
  contextInstance
) {
  const item = {
    quantity: quantity,
    type: "product",
    referencedId: productId,
    id: productId,
    payload: {
      customFields: customFields || undefined
    }
  };
  console.log('contextInstance', contextInstance)
  const resp = await contextInstance.invoke.post(
    getCheckoutCartLineItemEndpoint(),
    {
      items: [item],
    }
  );
  return resp.data;
}