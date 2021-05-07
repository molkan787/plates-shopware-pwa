import { getApplicationContext } from "@shopware-pwa/composables";

export const useSwStripeService = (rootContext) => {
    const { apiInstance } = getApplicationContext(
        rootContext,
        "useSwStripeService"
    )

    const sendCard = async (card) => {
        // const url = `/store-api/v3/shopware-pwa/payment-method-settings`;
        const url = `${window.location.origin}/store-api/v3/shopware-pwa/payment-method-settings`;
        const response = await apiInstance.invoke.patch(url, {
            card,
            saveCardForFutureCheckouts: null
        })
        console.log(response)
        return response.data
    }

    return {
        sendCard
    }
}