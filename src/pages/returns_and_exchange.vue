<template>
    <div class="returns_and_exchange_page">
        <SfSection
            title-heading="Returns & Exchange"
            subtitle-heading=""
        >
            <p>
                As each number plate is made to order and they are non-refundable. Once you have submitted your details the number plate will be made exactly how you have specified.
Please double check before submitting. If you believe your product is faulty or have an issue please contact us.
            </p>

        </SfSection>
    </div>
</template>

<script>
import { SfSection } from "@storefront-ui/vue"
export default {
    components: {
        SfSection
    }
}
</script>

<style lang="scss" scoped>
.returns_and_exchange_page{
    max-width: 800px;
    margin: auto;
    padding: 1rem;
}
</style>