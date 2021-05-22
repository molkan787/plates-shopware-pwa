<template>
    <div class="loader" :class="{ primaryColor }"></div>
</template>

<script>
export default {
  props: {
    primaryColor: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.loader,
.loader:after {
  border-radius: 50%;
  width: 4em;
  height: 4em;
}
.loader {
  margin: auto;
  font-size: 3px;
  position: relative;
  text-indent: -9999em;
  border-top: 1.1em solid rgba(255, 255, 255, 0.2);
  border-right: 1.1em solid rgba(255, 255, 255, 0.2);
  border-bottom: 1.1em solid rgba(255, 255, 255, 0.2);
  border-left: 1.1em solid #ffffff;
  -webkit-transform: translateZ(0) scale(1.5);
  -ms-transform: translateZ(0) scale(1.5);
  transform: translateZ(0) scale(1.5);
  -webkit-animation: load8 0.7s infinite linear;
  animation: load8 0.7s infinite linear;
  &.primaryColor{
    border-top: 1.1em solid rgba(239, 211, 1, 0.2);
    border-right: 1.1em solid rgba(239, 211, 1, 0.2);
    border-bottom: 1.1em solid rgba(239, 211, 1, 0.2);
    border-left: 1.1em solid #EFD301;
  }
}
@-webkit-keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg) scale(1.5);
    transform: rotate(0deg) scale(1.5);
  }
  100% {
    -webkit-transform: rotate(360deg) scale(1.5);
    transform: rotate(360deg) scale(1.5);
  }
}
@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg) scale(1.5);
    transform: rotate(0deg) scale(1.5);
  }
  100% {
    -webkit-transform: rotate(360deg) scale(1.5);
    transform: rotate(360deg) scale(1.5);
  }
}
</style>