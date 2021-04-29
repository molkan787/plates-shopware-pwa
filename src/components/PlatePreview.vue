<template>
    <div class="plate-preview">
        <div class="canvas">
            <span class="reg-no">{{ regNo }}</span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        regNo: {
            type: String,
            default: ''
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
        // background-color: rgba(#ff0000, 0.3);
    }
}
</style>
