<template>
    <SfButton :class="{ 'no-click': loading }" v-bind="{ ...$props, ...$attrs }" v-on="$listeners">
        <Loader v-if="loading" />
        <slot v-else />
    </SfButton>
</template>

<script>
import { SfButton } from '@storefront-ui/vue'
import Loader from '../Loader'

export default {
    name: 'SwButton',
    components: {
        SfButton,
        Loader,
    },
    props: {
        link: {
            type: [String, Object],
            default: '',
        },
        loading: {
            type: Boolean,
            default: false,
        },
    },
    setup(props, { root }) {
        return {}
    },
}
</script>

<style lang="scss" scoped>
.sf-button.no-click{
    pointer-events: none;
}
</style>
