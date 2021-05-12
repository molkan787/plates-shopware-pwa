<template>
  <nuxt-link
    :to="$routing.getUrl('/')"
    class="sf-header__logo"
    data-cy="header-logo"
  >
  <img class="logo" src="@/assets/images/reg4plate_logo.png" alt="Logo">
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
  height: 54px;
  transform: translateY(4px);
}
</style>
