<template>
    <div class="sw-product-gallery gallery">
        <div v-if="mediaGallery.length > 0" class="gallery__mobile">
            <client-only>
                <Lingallery :items="mediaGallery" :addons="{ enableLargeView: true }" :responsive="true" accentColor="#efd301" />
            </client-only>
            <!-- <template v-if="$device.isMobile">
                <client-only>
                    <Lingallery :items="linItems" :addons="{ enableLargeView: true }" :responsive="true" accentColor="#efd301" />
                </client-only>
            </template>
            <template v-else>
                <slot name="mobile-galery" v-bind="mediaGallery">
                    <SfGallery class="gallery-mobile" :images="mediaGallery" />
                </slot>
            </template> -->
        </div>
    </div>
</template>

<script>
import { SfGallery } from '@storefront-ui/vue'
import { getProductMediaGallery } from '@shopware-pwa/helpers'

export default {
    name: 'SwProductGallery',
    components: {
        SfGallery,
        Lingallery: () => import('lingallery')
    },
    props: {
        product: {
            type: Object,
            default: () => ({}),
        },
    },
    computed: {
        mediaGallery() {
            const media =  getProductMediaGallery({ product: this.product })
            return (media || []).map(
                ({ icon: { url: tURL }, mobile: { url: mURL }, desktop: { url: dURL } }) => ({
                    src: mURL,
                    largeViewSrc: dURL,
                    thumbnail: tURL,
                })
            )
        }
    },
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

@include for-desktop {
    .gallery__mobile {
        margin: var(--spacer-lg) 0 0 0;
    }
}

.gallery__mobile ::v-deep .glide__slide {
    min-width: 100px;
}

.gallery__mobile ::v-deep .sf-gallery__thumbs {
    width: 100%;
}
</style>
