import {
    getApplicationContext,
    useSessionContext
  } from "@shopware-pwa/composables"
import { PAGE_ORDER_SUCCESS } from "@/helpers/pages"

export const usePaymentService = (rootContext) => {
    const { apiInstance } = getApplicationContext(
        rootContext,
        "usePaymentService"
    );
    const { sessionContext } = useSessionContext(rootContext)
    const session = sessionContext.value
    
    const pay = async (orderId) => {
        const { origin } = window.location
        const url = `${origin}/sales-channel-api/v3/checkout/order/${orderId}/pay`;
        const finishQuery = encodeQuery({
            orderId,
            contextToken: session.token,
            salesChannelId: session.salesChannel.id,
            status: 'success'
        })
        const { data } = await apiInstance.invoke.post(
            url,
            {
                finishUrl: `${origin}${PAGE_ORDER_SUCCESS}?${finishQuery}`,
                errorUrl: `${origin}${PAGE_ORDER_SUCCESS}_error?orderId=${orderId}`,
            }
        )
        return data
    }

    return {
        pay
    }

}

function encodeQuery(params){
    return Object.entries(params).map(kv => kv.join('=')).join('&')
}