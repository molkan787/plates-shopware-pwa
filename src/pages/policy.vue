<template>
    <div class="returns_and_exchange_page">
        <SfSection
            title-heading="Policy"
            subtitle-heading=""
        >
            <p>
                <RegLegalInfo />
            </p>

        </SfSection>
    </div>
</template>

<script>
import { SfSection } from "@storefront-ui/vue"
import RegLegalInfo from '../components/RegLegalInfo.vue'
export default {
    components: {
        SfSection,
        RegLegalInfo
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