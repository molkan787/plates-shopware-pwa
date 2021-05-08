<template>
    <div class="plate-preview">
        <SfSelect label="Car" v-model="selectedCar" class="sf-select--underlined">
            <SfSelectOption
                v-for="car in cars" :key="car.value"
                :value="car.value"
            >
                {{ car.label }}
            </SfSelectOption>
        </SfSelect>
        <div class="canvas" :style="`background-image: url('${selectedCarImageUrl}')`" @resize="onCanvasResized" ref="canvas">
            <div class="reg-no-wrapper" :style="plateWrapperStyle">
                <span class="reg-no">
                    <div v-if="flag > 0 && flag < 24" class="flag-display-wrapper">
                        <FlagDisplay :value="flag" :height="34" />
                    </div>
                    {{ regNo }}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import { cars } from '../resources/carsList'
import { SfSelect  } from '@storefront-ui/vue'
import FlagDisplay from './views/FlagDisplay'

export default {
    components: {
        FlagDisplay,
        SfSelect
    },
    props: {
        regNo: {
            type: String,
            default: ''
        },
        flag: {
            type: Number,
            default: 1
        }
    },
    data: () => ({
        cars: cars,
        selectedCar: cars[0].value,
        plateZoomLevel: 1
    }),
    computed: {
        selectedCarImageUrl(){
            return require(`@/assets/images/cars/${this.selectedCar}.png`)
        },
        plateWrapperStyle(){
            return `transform: scale(${this.plateZoomLevel});`
        }
    },
    methods: {
        onCanvasResized(){
            this.updatePlateZoom()
        },
        updatePlateZoom(){
            this.$nextTick(() => {
                const el = this.$refs.canvas
                const { width } = el.getClientRects()[0]
                const ratio = width / 500
                this.plateZoomLevel = ratio
                console.log('ratio', ratio)
            })
        }
    },
    mounted(){
        this.updatePlateZoom()
    }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";
.plate-preview{
    .canvas{
        position: relative;
        width: 100%;
        aspect-ratio: 500/375;
        background-image: url('~@/assets/images/astonmmartin.png');
        background-size: cover;
        @include for-desktop {
            width: 500px;
        }
    }
    .reg-no-wrapper{
        padding-top: 243px;
        padding-left: 178px;
        transform-origin: 0 0;
        position: absolute;
        @include for-desktop {
            position: unset;
        }
    }
    .reg-no{
        display: inline-block;
        position: relative;
        width: 141px;
        height: 34px;
        text-align: center;
        font-size: 22px;
        font-weight: bold;
        pointer-events: none;
        user-select: none;
        font-family: 'Charles Wright';
        aspect-ratio: 500/375;
        // background-color: rgba(#ff0000, 0.3);
    }
    .flag-display-wrapper{
        float: left;
        border-radius: 4px 0 0 4px;
        overflow: hidden;
        margin-top: -1px;
        margin-left: -1px;
    }
}
</style>
