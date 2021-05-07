<template>
    <div class="flag-selector" :style="style">
        <span
            v-for="f in flags" :key="f.n"
            :style="`width:${FLAG_W}px;height:${FLAG_H}px;top:${f.y}px;left:${f.x}px`"
            class="flag" :class="value == f.n ? 'active' : ''"
            @click="flagClick(f.n)" :data-nbr="f.n >= 20 ? 'true' : ''"
        ></span>
    </div>
</template>

<script>
import { IMG_WIDTH, IMG_HEIGHT, FLAG_W, FLAG_H, COL_W, ROW_H, COLS, HW_RATIO } from '../../resources/flagsImage';

export default {
    props: {
        value: {
            type: Number,
            default: 1
        }
    },
    data: () => ({
        FLAG_W,
        FLAG_H,
        flags: '-'.repeat(23).split('').map((_, i) => {
            const x = i % COLS;
            return {
                n: i + 1,
                x: x * COL_W,
                y: ((i - x) / COLS) * ROW_H
            }
        })
    }),
    computed: {
        style(){
            return {
                width: `${IMG_WIDTH}px`,
                height: `${IMG_HEIGHT}px`,
            }
        }
    },
    methods: {
        flagClick(n){
            this.$emit('input', n);
            this.$emit('flagClick', n);
        }
    }
}
</script>

<style lang="scss" scoped>
.flag-selector{
    position: relative;
    background-image: url('@/assets/images/plate-flags.jpg');
    .flag{
        position: absolute;
        background-color: rgba(255, 255, 255, 0.5);
        cursor: pointer;
        box-sizing: border-box;
        transition: background-color 0.2s;
        &:hover{
            background-color: transparent;
        }
        &.active{
            background-color: transparent;
            border: 2px solid #fd5c5c;
            border-radius: 7px 2px 2px 7px;
            margin-top: 0px;
            margin-left: 0px;
            box-shadow: 0 0 3px rgba(0, 0, 0, 0.25);
            &[data-nbr="true"]{
                border-radius: 2px;
            }
        }
    }
}
</style>