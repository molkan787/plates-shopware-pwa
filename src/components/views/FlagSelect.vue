<template>
    <div class="flag-select">
        <div @click="selectorOpen = true" class="display-wrapper" title="Choose Flag">
            <FlagDisplay :value="value" :height="height" />
        </div>
        <SfModal title="My title" :visible="selectorOpen" @close="selectorOpen = false" cross overlay>
            <div class="selector-wrapper">
                <h3>Choose Flag</h3>
                <FlagSelector :value="value" @input="$emit('input', $event)" @flagClick="selectorOpen = false" />
            </div>
        </SfModal>
    </div>
</template>

<script>
import { SfModal } from "@storefront-ui/vue"
import FlagDisplay from './FlagDisplay';
import FlagSelector from './FlagSelector';

export default {
    components: {
        SfModal,
        FlagDisplay,
        FlagSelector
    },
    props: {
        height: {
            type: Number
        },
        value: {
            type: Number,
            default: 1
        }
    },
    data: () => ({
        selectorOpen: false
    })
}
</script>

<style lang="scss" scoped>
.flag-select{
    .display-wrapper{
        cursor: pointer;
    }
    .selector-wrapper{
        h3{
            margin-bottom: 26px;
        }
    }
}
</style>