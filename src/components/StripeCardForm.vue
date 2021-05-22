<template>
    <div class="stripe-card-form">
        <h5>Fill in your card details</h5>
        <br>
        <div ref="wrapper" class="stripe-element-wrapper"></div>
        <h5 class="error" v-if="error">{{ error.message }}</h5>
    </div>
</template>

<script>
import { getStripe } from '../services/stripeService'
import { useSwStripeService } from '../services/swStripeService'

export default {
    setup(_, { root }) {
        const { sendCard } = useSwStripeService(root)
        return {
            sendCard
        }
    },
    data: () => ({
        stripe: null,
        cardEl: null,
        error: null
    }),
    methods: {
        async setupForm(){
            const stripe = await getStripe(this.$root)
            const elements = stripe.elements()
            const cardEl = elements.getElement('card') || elements.create('card')
            cardEl.mount(this.$refs.wrapper)
            cardEl.on('change', e => this.onCardChange(e))
            this.stripe = stripe
            this.cardEl = cardEl
        },
        async getCardData(){
            try {
                const { paymentMethod } = await this.stripe.createPaymentMethod({
                    type: 'card',
                    card: this.cardEl,
                })
                const { card, id } = paymentMethod
                card.id = id
                return card
            } catch (error) {
                console.error(error)
                return null;
            }

        },
        async sendCardToServer(){
            try {
                const cardData = await this.getCardData()
                await this.sendCard(cardData)
                this.$emit('change', { ready: true })
            } catch (error) {
                console.error(error)    
            }
        },
        onCardChange(event){
            this.error = event.error
            this.$emit('change', { ready: false, error: event.error })
            if(event.complete){
                this.sendCardToServer()
            }
        }
    },
    created(){
        this.setupForm()
    }
}
</script>

<style lang="scss" scoped>
.error{
    color: #eb1c26;
}
</style>