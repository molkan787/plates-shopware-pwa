<template>
    <div class="reg_no_form_wrapper">
        <div class="reg_no_form_option">
            <div class="col" v-if="state.flag.value > 0 && state.flag.value < 24">
                <FlagDisplay :height="46" :value="state.flag.value" @input="state.flag.value = $event" />
            </div>
            <div class="spacer col"></div>
            <div class="col middle">
                <input class="regno-input" v-model="state.regNo.value" maxlength="10"  placeholder="Your Registration" />
            </div>
            <div class="col">
                <SwButton class="sf-button--full-width sf-button--outline" @click="previewClick">
                    Preview
                </SwButton>
            </div>
            <SfModal :visible="previewOpen" @close="previewOpen = false" >
                <PlatePreview :regNo="state.regNo.value" :flag="state.flag.value" />
            </SfModal>
        </div>
        <div class="error-message" v-if="regNoError">{{ regNoError }}</div>
    </div>
</template>

<script>
import { SfModal, SfInput } from "@storefront-ui/vue"
import PlatePreview from './PlatePreview';
import FlagDisplay from './views/FlagDisplay';

export default {
    components: {
        SfInput,
        SfModal,
        SwButton: () => import("@/components/atoms/SwButton.vue"),
        PlatePreview,
        FlagDisplay
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
    background-color: #F7D041;
    & > div.col{
        &.spacer{
            height: 45px;
            width: 0.6rem;
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
    .regno-input{
        border: none;
        background: transparent;
        width: 100%;
        height: 93%;
        font-size: 1.2rem;
        font-family: 'Charles Wright';
        outline: none;
    }
}
.error-message{
    color: var(--c-danger);
}
</style>

<style lang="scss">
@import "@/assets/scss/variables";
.reg_no_form_option{
    .sf-modal__container{
        width: 100% !important;
        @include for-desktop {
            width: fit-content !important;
        }
    }
    & > .col .sf-button{
        background-color: white;
    }
}
</style>