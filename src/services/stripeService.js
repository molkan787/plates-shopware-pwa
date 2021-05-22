import { loadStripe } from '@stripe/stripe-js'
import { getApplicationContext } from "@shopware-pwa/composables"

const GET_STRIPE_PK_URL = '/store-api/v3/payment/settings/stripe'
let stripe = null;
export async function getStripe(rootContext){
    if(stripe === null){
        const { apiInstance } = getApplicationContext(
            rootContext,
            "getStripe"
        )
        const { data } = await apiInstance.invoke.get(GET_STRIPE_PK_URL)
        stripe = await loadStripe(data.stripePublicKey)
    }
    return stripe;
}