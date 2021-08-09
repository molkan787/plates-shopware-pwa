<template>
    <div class="summary">
        <SwTotals
            :total="total"
            :subtotal="subtotal"
            :shipping="shippingTotal"
        />
        <div class="notification" v-if="!cartItems.length">
            <SfNotification
                :visible="true"
                type="info"
                :title="$t('You can not place the order')"
                :message="$t('Your cart is empty')"
            />
        </div>
        <div v-if="requireDocumentsUpload" class="checkout-attachments">
            <div class="col">
                <h4>PROOF OF IDENTITY</h4>
                <input type="file" @change="fileIdentityChanged" />
            </div>
            <div class="col">
                <h4>PROOF OF REGISTRATION OWNERSHIP</h4>
                <input type="file" @change="fileOwnershipChanged" />
            </div>
        </div>
        <div v-if="requireDocumentsUpload" class="accepted-files">
            Allowed file types are: 'gif', 'png', 'jpg', 'jpeg', 'pdf', 'xlsx', 'txt', 'docx'
        </div>
        <div v-if="isStripeCard" class="payment-details">
            <h4>Payment details</h4>
            <StripeCardForm @change="onStripeCardFormChange" />
        </div>
        <div v-else-if="isStripePay" class="payment-details">
            <h4 style="margin-bottom: 1rem">Payment</h4>
            <StripePayForm @payment-submited="onStripePaySubmited" />
        </div>
        <div class="summary__action">
            <SwButton
                class="sf-button--full-width summary__action-button summary__action-button--secondary color-secondary sw-form__button"
                data-cy="go-back-to-payment"
                @click="$emit('click:back')"
            >
                {{ $t('Go back to Payment') }}
            </SwButton>
            <SwButton
                v-if="!isStripePay"
                :disabled="!cartItems.length || !canPlaceOrder"
                :loading="placingOrder"
                class="sf-button--full-width summary__action-button sw-form__button"
                data-cy="place-my-order"
                @click="$emit('proceed')"
            >
                {{ $t('Place my order') }}
            </SwButton>
        </div>
    </div>
</template>
<script>
import { computed, ref } from '@vue/composition-api'
import { useCart, useSessionContext } from '@shopware-pwa/composables'
import SwTotals from '@/components/SwTotals.vue'
import StripeCardForm from '../../StripeCardForm'
import StripePayForm from '../../StripePayForm'

import {
    SfProperty,
    SfCheckbox,
    SfHeading,
    SfNotification
} from '@storefront-ui/vue'
import SwButton from '@/components/atoms/SwButton.vue'
import { useCheckoutAttachments } from '../../../states/checkoutAttachments'
import { useUICheckoutPage } from '../../../logic/checkout/useUICheckoutPage'
import { useOrderAttachment } from '../../../composables/useOrderAttachment'

export default {
    name: 'TotalsSummary',
    components: {
        SfProperty,
        SfHeading,
        SfCheckbox,
        SwButton,
        SfNotification,
        SwTotals,
        StripeCardForm,
        StripePayForm
    },
    data() {
        return {
            terms: false,
        }
    },
    setup(props, { root, emit }) {
        const {
            cartItems,
            subtotal,
            totalPrice,
            removeProduct,
            shippingTotal,
            refreshCart,
        } = useCart(root)
        const { paymentMethod } = useSessionContext(root)
        const { placingOrder } = useUICheckoutPage(root)
        const { requireDocumentsUpload } = useOrderAttachment(root)

        const { proof_of_identity, proof_of_registration_ownership } = useCheckoutAttachments()
        proof_of_identity.value = null;
        proof_of_registration_ownership.value = null;

        const fileIdentityChanged = (event) => {
            const file = event.target.files[0] || null;
            proof_of_identity.value = file;
        }

        const fileOwnershipChanged = (event) => {
            const file = event.target.files[0] || null;
            proof_of_registration_ownership.value = file;
        }

        const isStripeCard = computed(
            () => paymentMethod.value && paymentMethod.value.shortName === 'stripe.shopware_payment.payment_handler.card'
        )
        
        const isStripePay = computed(
            () => paymentMethod.value && paymentMethod.value.shortName === 'stripe.shopware_payment.payment_handler.digital_wallets'
        )

        const isStripeCardFormReady = ref(false)

        const canPlaceOrder = computed(
            () => isStripeCard.value ? isStripeCardFormReady.value : true
        )

        const onStripeCardFormChange = (event) => {
            isStripeCardFormReady.value = event.ready && !event.error
        }

        const onStripePaySubmited = () => {
            emit('proceed')
        }

        return {
            requireDocumentsUpload,
            fileIdentityChanged,
            fileOwnershipChanged,
            cartItems,
            refreshCart,
            subtotal,
            total: totalPrice,
            shippingTotal,
            removeProduct,
            isStripeCard,
            isStripeCardFormReady,
            isStripePay,
            canPlaceOrder,
            onStripeCardFormChange,
            onStripePaySubmited,
            placingOrder
        }
    },
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/variables';
.summary {
    .checkout-attachments {
        padding: var(--spacer-base) var(--spacer-xl);
        display: flex;
        flex-direction: row;
        & > div:first-child{
            margin-right: 2rem;
        }
        @media (max-width: 786px) {
            flex-direction: column;
            & > div:first-child{
                margin-right: 0;
                margin-bottom: 2rem;
            }
        }
    }
    .accepted-files{
        padding: 0 var(--spacer-xl);
        color: #5d5d5d;
        font-size: 13px;
    }
    .payment-details{
        padding: var(--spacer-base) var(--spacer-xl);
    }
    margin: 0 calc(var(--spacer-base) * -1);
    &__group {
        padding: var(--spacer-base) var(--spacer-xl);
        background-color: var(--c-light);
        @include for-desktop {
            background-color: transparent;
            display: flex;
            flex-direction: column;
        }
        .notification {
            margin: auto;
        }
    }
    &__terms {
        flex: 1;
        margin: 0 0 0 var(--spacer-xs);
    }
    &__total {
        margin: 0 0 var(--spacer-xl) 0;
        @include for-desktop {
            padding: 0;
            flex: 0 0 100%;
        }
    }
    &__action {
        padding: var(--spacer-base);
        width: 90%;
        margin: var(--spacer-base) 0 0 0;
        display: table;

        button {
            display: table-cell;
            width: 100%;
            @include for-desktop {
                width: 50%;
            }

            &:last-child {
                margin-top: var(--spacer-base);
            }
        }
    }

    &__property {
        margin: 0 0 var(--spacer-sm) 0;
        --property-value-font-weight: var(--font-semibold);
        --property-value-font-size: var(--font-base);
        @include for-desktop {
            margin: 0 0 var(--spacer-sm) 0;
        }
    }

    &__property-total {
        border-top: 2px solid var(--c-white);
        padding-top: var(--spacer-base);
        margin: var(--spacer-base) 0 0 0;
        @include for-desktop {
            border-color: var(--c-light);
        }
    }
}
</style>
