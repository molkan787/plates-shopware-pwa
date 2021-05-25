<template>
    <div class="track-order">
        <SfSection
            title-heading="Track your order"
            subtitle-heading="Please enter your email address and order no you want to track"
            class="section"
        >
            
            <template v-if="details">
                <table>
                    <tr>
                        <td>Order Number:</td>
                        <td class="status">{{ details.orderNumber }}</td>
                    </tr>
                    <tr>
                        <td>Order Status:</td>
                        <td class="status">{{ details.status }}</td>
                    </tr>
                    <tr>
                        <td>Delivery Status:</td>
                        <td class="status">{{ details.deliveryStatus }}</td>
                    </tr>
                    <tr v-if="details.trackingLink">
                        <td>Tracking Link:</td>
                        <td class="status">
                            <a :href="details.trackingLink" target="_blank">{{ details.trackingLink }}</a>
                        </td>
                    </tr>
                </table>
                <br>
                <br>
                <a v-if="details.trackingLink" :href="details.trackingLink" target="_blank">
                    <SwButton>Open Tracking Link</SwButton>
                </a>
            </template>
            <template v-else>
                <SfInput v-model="email" label="Email Address" />
                <SfInput v-model="orderNo" label="Order No" />
                <SwButton :disabled="!email || !orderNo" :loading="loading" @click="loadOrder" >Track order</SwButton>
            </template>

        </SfSection>
    </div>
</template>

<script>
import { ref } from '@vue/composition-api'
import { useUser } from '@shopware-pwa/composables'
import { orderService } from '../services/orderService'
import { SfSection, SfInput } from "@storefront-ui/vue"
import SwButton from '@/components/atoms/SwButton'

export default {
    components: {
        SfSection,
        SfInput,
        SwButton
    },
    setup(_, { root }){
        const { getOrderTrackingDetails } = orderService(root)
        const { user } = useUser(root)
        const email = ref(user.value ? user.value.email : '')
        const orderNo = ref('')
        const loading = ref(false)
        const details = ref(null)

        const loadOrder = async () => {
            loading.value = true
            try {
                const data = await getOrderTrackingDetails(email.value, orderNo.value)
                console.log(data)
                if(data.error == 'not_found'){
                    alert('Order not found, Please make sure the order no is correct.')
                }else{
                    details.value = data
                }
            } catch (error) {
                console.error(error)
                alert('An error occured, Please try again')
            }
            loading.value = false
        }

        return {
            email,
            orderNo,
            loading,
            loadOrder,
            details
        }
    },

}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables';
.track-order {
    min-height: 60vh;
    padding: 1rem;
    width: 100%;
    margin: auto;
    box-sizing: border-box;
    @include for-desktop {
        padding-top: 1rem;
        width: fit-content;
        max-width: 1200px;
    }
    .status{
        font-weight: bold;
    }
}
</style>