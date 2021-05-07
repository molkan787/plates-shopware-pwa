<template>
    <div class="stripe-card-form">
        <h5>Fill in your card details</h5>
        <br>
        <div ref="wrapper" class="stripe-element-wrapper"></div>
    </div>
</template>

<script>
import { getStripe } from './stripeService'
import { useSwStripeService } from './swStripeService'

export default {
    setup(_, { root }) {
        const { sendCard } = useSwStripeService(root)
        return {
            sendCard
        }
    },
    data: () => ({
        stripe: null,
        cardEl: null
    }),
    methods: {
        async setupForm(){
            const stripe = await getStripe()
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
            } catch (error) {
                console.error(error)    
            }
        },
        onCardChange(event){
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