<template>
    <div class="show-order">
        <Loader v-if="loading" :primaryColor="true" />
        <SwOrderDetails v-if="id" :orderId="id" @order-loaded="loading = false" />
    </div>
</template>

<script>
import { ref } from '@vue/composition-api'
import { orderService } from '../../services/orderService'
import SwOrderDetails from '@/components/SwOrderDetails.vue'
import Loader from '@/components/Loader.vue'

export default {
    components: {
        SwOrderDetails,
        Loader
    },
    async asyncData({ params, context }){
        const { id: deepLinkCode } = params;
        return {
            deepLinkCode
        }
    },
    setup(_, { root }){
        const { getOrderDetailsByDeepLinkCode } = orderService(root)
        const id = ref(null)
        const loading = ref(true)
        return {
            id,
            loading,
            getOrderDetailsByDeepLinkCode
        }
    },
    async created(){
        const order = await this.getOrderDetailsByDeepLinkCode(this.deepLinkCode)
        this.id = order.id
    }
}
</script>

<style lang="scss" scoped>
.show-order{
    min-height: 600px;
    width: auto;
    display: flex;
    justify-content: center;
}
</style>