<template>
    <div class="reg_no_form_option">
        <div class="col">
            <SfInput :value="value" @input="onInput" label="Your Registration" />
        </div>
        <div class="col">
            <SwButton class="sf-button--full-width" @click="previewClick">
                Preview
            </SwButton>
        </div>
        <SfModal :visible="previewOpen" @close="previewOpen = false" >
            <PlatePreview :regNo="value" />
        </SfModal>
    </div>
</template>

<script>
import { SfModal, SfInput } from "@storefront-ui/vue"
import PlatePreview from './PlatePreview';

export default {
    components: {
        SfInput,
        SfModal,
        SwButton: () => import("@/components/atoms/SwButton.vue"),
        PlatePreview
    },
    props: {
        value: {
            type: String,
            required: true
        }
    },
    methods: {
        onInput(value){
            this.$emit('input', value);
        },
        previewClick(){
            if(this.value.length > 0){
                this.previewOpen = true;
            }
        }
    },
    data: () => ({
        previewOpen: false
    })
}
</script>

<style lang="scss" scoped>
.reg_no_form_option{
    display: flex;
    flex-direction: row;
    & > div{
        &:first-child{
            flex: 1;
            margin-right: 1rem;
        }
        &:last-of-type{
            width: 8rem;
            & > button{
                height: 46px;
            }
        }
    }
}
</style>

<style lang="scss">
.reg_no_form_option{
    .sf-modal__container{
        width: fit-content !important;
    }
}
</style>