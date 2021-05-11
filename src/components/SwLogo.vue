<template>
  <nuxt-link
    :to="$routing.getUrl('/')"
    class="sf-header__logo"
    data-cy="header-logo"
  >
    <div class="logo">
        <img src="@/assets/images/reg4plate_logo.png" alt="Logo">
    </div>
  </nuxt-link>
</template>

<script>
export default {
  components: {},
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";
.logo{
    display: inline-block;
    width: 42px;
    height: 32px;
    overflow: hidden;
    img{
        width: 42px;
        height: auto;
        aspect-ratio: 1.054;
    }
}
.sf-header__logo {
  height: 2rem;
}
</style>
