<template>
    <div class="gallery-page">
        <SfSection
            title-heading="Our Gallery"
            subtitle-heading=""
            class="section"
        >
            <!-- <div class="images-grid">
                
                <div v-for="(row, index) in galleryRows" :key="'row-' + index" class="images-grid__row">
                    <div v-for="img in row" :key="img.url" class="images-grid__col">
                        <SfImage :src="img.url">{{ img.alt }}</SfImage>
                    </div>
                </div>
            </div> -->

            <client-only>
                <VuePictureSwipe v-if="images" :options="{shareEl: false}" :items="images"></VuePictureSwipe>
            </client-only>

        </SfSection>
    </div>
</template>

<script>
import { SfSection } from "@storefront-ui/vue"
import { useGalleryService } from '../services/galleryService'

export default {
    components: {
        SfSection,
        VuePictureSwipe: () => import('vue-picture-swipe')
    },
    data: () => ({
        images: null,
    }),
    async fetch(){
        const images = await this.getImages()
        this.images = images.map(({ url, metaData: { width, height } }) => ({
            src: url,
            thumbnail: url,
            w: width,
            h: height
        }))
    },
    setup(_, { root }){
        const { getImages } = useGalleryService(root)
        return {
            getImages,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables';
.gallery-page {
    min-height: 60vh;
    padding-top: 0.5rem;
    width: 100%;
    margin: auto;
    text-align: center;
    @include for-desktop {
        padding-top: 1rem;
        width: fit-content;
        max-width: 1200px;
    }
}
.images-grid {
    &__row {
        display: flex;
        & + & {
            margin-top: calc(var(--spacer-base) / 2);
            @include for-desktop {
                margin-top: var(--spacer-base);
            }
        }
    }
    &__col {
        margin: 0;
        & + & {
            margin-left: calc(var(--spacer-base) / 2);
            @include for-desktop {
                margin-left: var(--spacer-base);
            }
        }
    }
}
</style>

<style lang="scss">
@import '@/assets/scss/variables';
.gallery-page {
    .gallery-thumbnail {
        margin: 0 !important;
        @include for-desktop {
            margin: 5px !important;
        }
        img{
            width: 100%;
            height: auto;
            @include for-desktop {
                height: 200px;
                width: auto;
            }
        }
    }
}
</style>