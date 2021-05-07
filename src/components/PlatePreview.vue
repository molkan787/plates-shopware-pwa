<template>
    <div class="plate-preview">
        <div class="canvas">
            <span class="reg-no">
                <div class="flag-display-wrapper">
                    <FlagDisplay :value="flag" :height="37" />
                </div>
                {{ regNo }}
            </span>
        </div>
    </div>
</template>

<script>
import FlagDisplay from './views/FlagDisplay';

export default {
    components: {
        FlagDisplay
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
    }
}
</script>

<style lang="scss" scoped>
.plate-preview{
    .canvas{
        width: 500px;
        height: 375px;
        background-image: url('~@/assets/images/astonmmartin.png');
        background-size: cover;
    }
    .reg-no{
        display: inline-block;
        position: relative;
        width: 150px;
        height: 36px;
        top: 260px;
        left: 180px;
        text-align: center;
        font-size: 22px;
        font-weight: bold;
        pointer-events: none;
        user-select: none;
        font-family: 'Charles Wright';
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
