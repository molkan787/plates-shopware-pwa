import {
    getApplicationContext,
    useSessionContext
  } from "@shopware-pwa/composables"
import { PAGE_ORDER_SUCCESS } from "@/helpers/pages"
import { computed } from '@vue/composition-api'
import { usePaymentInfo } from '../states/paymentInfo'

export const usePaymentService = (rootContext) => {
    const { apiInstance } = getApplicationContext(
        rootContext,
        "usePaymentService"
    );
    const { sessionContext, paymentMethod } = useSessionContext(rootContext)
    const session = sessionContext.value
    const { stripeDigitalWalletsPaymentMethodId } = usePaymentInfo()

    const isStripePay = computed(
        () => paymentMethod.value && paymentMethod.value.shortName === 'stripe.shopware_payment.payment_handler.digital_wallets'
    )
    
    const pay = async (orderId) => {
        const { origin } = window.location
        const url = `${origin}/sales-channel-api/v3/checkout/order/${orderId}/pay`;
        const finishQuery = encodeQuery({
            orderId,
            contextToken: session.token,
            salesChannelId: session.salesChannel.id,
            status: 'success'
        })
        const extraBody = isStripePay.value ? ({
            stripeDigitalWalletsPaymentMethodId: stripeDigitalWalletsPaymentMethodId.value
        }) : undefined

        const { data } = await apiInstance.invoke.post(
            url,
            {
                finishUrl: `${origin}${PAGE_ORDER_SUCCESS}?${finishQuery}`,
                errorUrl: `${origin}${PAGE_ORDER_SUCCESS}?orderId=${orderId}`,
                ...extraBody
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