import { ref } from '@vue/composition-api';

const stripeDigitalWalletsPaymentMethodId = ref(null)

export const usePaymentInfo = () => ({
    stripeDigitalWalletsPaymentMethodId
})