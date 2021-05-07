<template>
    <div class="flag-display">
        <div class="flag" :style="style"></div>
    </div>
</template>

<script>
import { IMG_WIDTH, IMG_HEIGHT, FLAG_W, FLAG_H, COL_W, ROW_H, COLS, HW_RATIO } from '../../resources/flagsImage';

export default {
    props: {
        height: {
            type: Number,
            default: 72
        },
        value: {
            type: Number,
            default: 12
        }
    },
    computed: {
        imgRatio(){
            return this.height / FLAG_H;
        },
        width(){
            return this.height / HW_RATIO;
        },
        position(){
            const n = this.value - 1;
            const x = n % COLS;
            const y = (n - x) / COLS;
            return {
                x: x * COL_W,
                y: y * ROW_H
            }
        },
        style(){
            const { imgRatio, position: { x, y } } = this;
            return {
                'background-size': `${Math.floor(imgRatio * IMG_WIDTH)}px ${Math.floor(imgRatio * IMG_HEIGHT)}px`,
                'background-position': `${-Math.floor(imgRatio * x)}px ${-Math.floor(imgRatio * y)}px`,
                'height': `${Math.floor(this.height)}px`,
                'width': `${Math.floor(this.width)}px`,
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.flag-display{
    .flag{
        width: 100%;
        height: 100%;
        background-image: url('@/assets/images/plate-flags.jpg');
    }
}
</style>