<template>
    <div class="reg_no_form_option">
        <div class="col">
            <FlagSelect :height="46" :value="state.flag.value" @input="state.flag.value = $event" />
        </div>
        <div class="spacer col"></div>
        <div class="col middle">
            <SfInput class="regno-input" :value="state.regNo.value" @input="state.regNo.value = $event" :errorMessage="regNoError" :valid="!regNoError" label="Your Registration" />
        </div>
        <div class="col">
            <SwButton class="sf-button--full-width" @click="previewClick">
                Preview
            </SwButton>
        </div>
        <SfModal :visible="previewOpen" @close="previewOpen = false" >
            <PlatePreview :regNo="state.regNo.value" :flag="state.flag.value" />
        </SfModal>
    </div>
</template>

<script>
import { SfModal, SfInput } from "@storefront-ui/vue"
import PlatePreview from './PlatePreview';
import FlagSelect from './views/FlagSelect';

export default {
    components: {
        SfInput,
        SfModal,
        SwButton: () => import("@/components/atoms/SwButton.vue"),
        PlatePreview,
        FlagSelect
    },
    props: {
        state: {
            type: Object,
            required: true
        }
    },
    methods: {
        previewClick(){
            if(this.state.regNo.value.length > 0 && !this.regNoError){
                this.previewOpen = true;
            }
        }
    },
    data: () => ({
        previewOpen: false,
    }),
    watch: {
        'state.regNo.value'(val){
            this.state.regNo.value = val.toUpperCase();
        }
    },
    computed: {
        regNoError(){
            const { value: v } = this.state.regNo;
            if(v.includes('1') || v.includes('Z') || v.includes('0')){
                return 'Registration Number cannot include 1, Z, 0 (zero)';
            }else{
                return null;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
$plateColor: #F7D041;
.reg_no_form_option{
    display: flex;
    flex-direction: row;
    & > div.col{
        &.spacer{
            height: 45px;
            width: 0.6rem;
            background-color: #F7D041;
        }
        &.middle{
            flex: 1;
            // margin-right: 1rem;
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
    .regno-input input{
        background-color: #F7D041;
    }
}
</style>