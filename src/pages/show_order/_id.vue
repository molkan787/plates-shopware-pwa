<template>
    <div class="show-order">
        <Loader v-if="loading" :primaryColor="true" />
        <SwOrderDetails v-if="id" :orderId="id" @order-loaded="loading = false" />
    </div>
</template>

<script>
import { ref, computed, watch } from '@vue/composition-api'
import { orderService } from '../../services/orderService'
import SwOrderDetails from '@/components/SwOrderDetails.vue'
import Loader from '@/components/Loader.vue'
import { useUser, useUIState } from '@shopware-pwa/composables'

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
        const { switchState: switchLoginModalState } = useUIState(
            root,
            "LOGIN_MODAL_STATE"
        )
        const { user } = useUser(root)
        const { getOrderDetailsByDeepLinkCode } = orderService(root)
        const id = ref(null)
        const loading = ref(true)

        const isUserLoggedIn = computed(
            () => typeof user.value.id === 'string'
        )

        watch(isUserLoggedIn, isLoggedIn => {
            if(isLoggedIn){
                window.location.reload()
            }
        })

        return {
            id,
            loading,
            getOrderDetailsByDeepLinkCode,
            isUserLoggedIn,
            switchLoginModalState
        }
    },
    async created(){
        if(this.isUserLoggedIn){
            const order = await this.getOrderDetailsByDeepLinkCode(this.deepLinkCode)
            this.id = order.id
        }else{
            this.$nextTick(() => {
                this.switchLoginModalState(true)
            })
        }
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