<template>
    <div class="stripe-pay-form">
        <template v-if="!loading && !notAvailable">
            <h5>The order will be automatically placed once you select your payment method</h5>
            <br>
        </template>
        <div v-if="loading">
            <Loader :primaryColor="true" />
        </div>
        <div v-if="!loading && notAvailable" class="not-available">
            Neither Apple Pay nor Google Pay are available on this device / in this browser. Please select a different payment method.
        </div>
        <div id="stripePay-paymentRequestButtonWrapper"></div>
    </div>
</template>

<script>
import { onMounted, ref, watch } from '@vue/composition-api'
import { useCart } from '@shopware-pwa/composables'
import { usePaymentInfo } from '../states/paymentInfo'
import { getStripe } from '../services/stripeService'
import Loader from './Loader.vue'

export default {
    components: {
        Loader
    },
    setup(_, { root, emit }){
        const {
            totalPrice,
        } = useCart(root)
        const { stripeDigitalWalletsPaymentMethodId } = usePaymentInfo()

        const loading = ref(true)
        const notAvailable = ref(false)
        
        onMounted(async () => {
            const stripe = await getStripe(root)
            const paymentRequest = stripe.paymentRequest({
                country: 'GB',
                currency: 'gbp',
                total: {
                    label: 'Order total',
                    amount: Math.floor(totalPrice.value * 100),
                },
                requestPayerName: true,
                requestPayerEmail: true,
            })
            watch(totalPrice, (total) => {
                if(total > 0){
                    paymentRequest.update({
                        total: {
                            label: 'Order total',
                            amount: Math.floor(totalPrice.value * 100),
                        },
                    })
                }
            })
            const elements = stripe.elements()
            const prButton = elements.create('paymentRequestButton', {
                paymentRequest: paymentRequest,
            })
            paymentRequest.canMakePayment().then(function(result) {
                if (result) {
                    prButton.mount('#stripePay-paymentRequestButtonWrapper');
                } else {
                    notAvailable.value = true
                }
                loading.value = false
            })
            paymentRequest.on('paymentmethod', ev => {
                const pmId = ev.paymentMethod.id;
                stripeDigitalWalletsPaymentMethodId.value = pmId
                emit('payment-submited')
            })
        })

        return {
            loading,
            notAvailable
        }
    }
}
</script>

<style lang="scss" scoped>
.stripe-pay-form{
    .not-available{
        color: var(--c-danger);
    }
}
</style>