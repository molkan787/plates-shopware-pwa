<template>
  <SfFooter :column="4" multiple class="footer">
    <SfFooterColumn title="Reg4Plate">
      <SfList>
        <SfListItem
          v-for="item in main"
          :key="item.name"
        >
          <SfMenuItem
            :label="item.name"
            :link="item.link"
          />
        </SfListItem>
      </SfList>
    </SfFooterColumn>
    <SfFooterColumn title="Social">
      <div class="footer__socials">
        <SfImage v-for="item in social" :key="item.name" class="footer__social-image"
          :src="`/icons/${item.icon}`" :alt="item.name.toUpperCase()" :width="item.size || 32" :height="item.size || 32"
          @click="openUrl(item.link)" />
      </div>
    </SfFooterColumn>
    <SfFooterColumn class="footer__notice" title="Reg4Plates is DVLA Approved RNPS"></SfFooterColumn>
  </SfFooter>
</template>

<script>
import { SfFooter, SfList, SfImage, SfMenuItem } from '@storefront-ui/vue';
export default {
  components: {
    SfFooter,
    SfList,
    SfImage,
    SfMenuItem
  },
  data() {
    return {
      // aboutUs: ['Who we are', 'Quality in the details', 'Customer Reviews'],
      // departments: ['Women fashion', 'Men fashion', 'Kidswear', 'Home'],
      // help: ['Customer service', 'Size guide', 'Contact us'],
      // paymentsDelivery: ['Purchase terms', 'Guarantee'],
      main: [
        { name: 'Home', link: '/'  },
        { name: 'Track order', link: '/track-order'  },
        { name: 'Gallery', link: '/gallery'},
        { name: 'Returns & Exchange', link: '/returns_and_exchange'},
        { name: 'Policy', link: '/policy'}
      ],
      social: [
        { name: 'facebook', icon: 'facebook.png', link: 'http://fb.me/reg4plates', size: 31  },
        { name: 'instagram', icon: 'instagram.ico', link: 'https://www.instagram.com/justplatesuk'}
      ],
      isMobile: false,
      desktopMin: 1024
    };
  },
  methods: {
    openUrl(url){
      window.open(url, '_blank')
    }
  }
};
</script>

<style lang="scss">
.footer {
  margin-bottom: 3.75rem;
  background-color: rgb(241, 241, 241);
  @media (min-width:1025px) {
    margin-bottom: 0;
  }
  &__socials {
    display: flex;
    justify-content: center;
    margin: 0 auto var(--spacer-lg);
    padding: var(--spacer-base) var(--spacer-xl);
    @media (min-width:1025px) {
      justify-content: flex-start;
      padding: var(--spacer-xs) 0;
      margin: 0 auto;
    }
  }
  &__social-image {
    margin: 0 var(--spacer-2xs) 0 0;
    cursor: pointer;
  }
  &__notice {
    text-align: left;
    white-space: nowrap;
    .sf-footer-column__chevron{
      display: none;
    }
  }
}
.sf-footer {
  @media (min-width:1025px) {
    border-top: var(--spacer-xs) solid var(--c-primary);
    padding-bottom: 0;
    margin-top: var(--spacer-2xl);
  }
  &__container {
    margin: var(--spacer-sm);
    @media (min-width:1025px) {
      max-width: 69rem;
      margin: 0 auto;
    }
  }
}
</style>