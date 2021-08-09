<template>
  <div class="sw-product-details" v-if="product">
    <div class="product-details__mobile-top">
      <SwProductHeading class="product-details__heading" :product="product" />
    </div>
    <SwPluginSlot name="product-page-description" :slot-context="product">
      <p class="product-details__description" v-html="description" />
    </SwPluginSlot>
    <RegNoFormOption v-if="requireRegNo" :state="optionsState" />
    <div
      v-if="product.optionIds && product.optionIds.length"
      class="product-details__section"
    >
      <div v-for="config in getOptionGroups" :key="config.id">
        <SwProductSelect
          v-if="getSelectedOptions[config.translated.name]"
          :value="getSelectedOptions[config.translated.name]"
          :options="getProductOptions({ product: config })"
          :label="config.translated.name"
          @change="
            handleChange(
              config.translated.name,
              $event,
              onOptionChanged($event)
            )
          "
        />
      </div>
    </div>
    <div class="product-details__section">
      <SfAlert
        :message="$t('Low in stock')"
        type="warning"
        class="product-details__alert mobile-only"
      />
      <div class="error-message" v-if="regNoInputMissing">
        Please enter your Registration NO
      </div>
      <SfAddToCart
        v-model="quantity"
        :stock="stock"
        class="product-details__add-to-cart"
        @click="addToCart"
      >
        <template #add-to-cart-btn>
          <SwButton
            class="sf-button--full-width"
            @click="addToCart"
            data-cy="button-addToCart"
            :disabled="!canAddToCart"
            :loading="addToCartBtnLoading"
          >
            {{ $t("Add To Cart") }}
          </SwButton>
        </template>
      </SfAddToCart>
      <SwPluginSlot
        name="product-page-add-to-cart-button-after"
        :slot-context="product"
      />
      <div
        v-if="getProductNumber(product)"
        class="product-details__product-number"
      >
        <p>
          {{ $t("Product number") }}:
          <span>{{ getProductNumber(product) }}</span>
        </p>
      </div>
    </div>
    <SwProductTabs
      :product-id="product.id"
      :properties="properties"
      :reviews="reviews"
      :manufacturer="manufacturer"
    />
    <RegLegalInfo />
  </div>
</template>
<script>
import { SfAlert, SfAddToCart, SfLoader, SfInput } from "@storefront-ui/vue"
import RegLegalInfo from './RegLegalInfo.vue'
import {
  getProductNumber,
  getProductOptions,
  getProductProperties,
  getProductReviews,
} from "@shopware-pwa/helpers"
import {
//   useAddToCart,
  useProductConfigurator,
  useNotifications
} from "@shopware-pwa/composables"
import { getProductUrl } from "@shopware-pwa/helpers"
import { computed, onMounted, watch, ref } from "@vue/composition-api"
import SwButton from "@/components/atoms/SwButton.vue"
import { useAddToCart } from '../composables/useMyAddToCart';
import { useProductOptions } from '../states/productOptions';
import RegNoFormOption from './RegNoFormOption';

export default {
  name: "SwProductDetails",
  components: {
    RegNoFormOption,
    SfAlert,
    SfAddToCart,
    SfLoader,
    SfInput,
    SwButton: () => import("@/components/atoms/SwButton.vue"),
    SwProductHeading: () => import("@/components/SwProductHeading.vue"),
    SwProductSelect: () => import("@/components/SwProductSelect.vue"),
    SwProductTabs: () => import("@/components/SwProductTabs.vue"),
    SwProductColors: () => import("@/components/SwProductColors.vue"),
    SwPluginSlot: () => import("sw-plugins/SwPluginSlot.vue"),
    SwButton,
    RegLegalInfo,
  },
  props: {
    product: {
      type: Object,
    },
  },
  setup({ product }, { root }) {
    // const { addToCart, quantity } = useAddToCart(root, product)
    const { addToCart, quantity } = useAddToCart(root, product);
    const { pushInfo } = useNotifications(root)
    const {
      isLoadingOptions,
      handleChange,
      getOptionGroups,
      getSelectedOptions,
      findVariantForSelectedOptions,
    } = useProductConfigurator(root, product)
    const { regNo } = useProductOptions();

    const description = computed(
      () =>
        (product.translated && product.translated.description) ||
        product.description
    )
    const properties = computed(
      () => product.properties && getProductProperties({ product })
    )
    const manufacturer = computed(() => product.manufacturer)
    const stock = computed(() => product.stock)
    const reviews = computed(() => getProductReviews({ product }))

    // find the best matching variant for current options
    // use it as a callback in handleChange -> onChangeHandled argument
    const onOptionChanged = async (optionId) => {
      // get always the newest options - getSelectedOptions is obsolete for a moment - this is why watch is used
      watch(getSelectedOptions, async (options, prevOptions) => {
        // look for variant with the selected options and perform a redirect to the found product's URL
        const variantFound = await findVariantForSelectedOptions(options)
        if (variantFound) {
          root.$router.push(getProductUrl(variantFound))
        } else {
          // if no product was found - reset other options and try to find a first matching product
          const simpleOptionVariant = await findVariantForSelectedOptions({
            option: optionId,
          })
          if (simpleOptionVariant) {
            root.$router.push(getProductUrl(simpleOptionVariant))
          } else {
            pushInfo(
              root.$t("There is no available product for selected options")
            )
          }
        }
      })
    }

    const addToCartBtnLoading = ref(false)

    const addToCartWrapper = async () => {
        addToCartBtnLoading.value = true
        await addToCart({
            registration_no: regNo.value,
            flag: flag.value
        });
        addToCartBtnLoading.value = false
    }

    const requireRegNo = computed(
      () => product && product.translated && product.translated.customFields && product.translated.customFields.custom_plate_reg_no
    )

    const regNoInputMissing = computed(
      () => requireRegNo.value && regNo.value.replace(/\s/g, '').length < 4
    )

    const canAddToCart = computed(
      () => !regNoInputMissing.value
    )

    const flagOptionGroup = getOptionGroups.value.find(og => og.translated.name == 'Flag')
    const flagOptionsPositions = flagOptionGroup && flagOptionGroup.options.reduce((m, o) => (m[o.id] = o.translated.position) && m, {})

    const flag = computed(
      () => ( flagOptionsPositions  && flagOptionsPositions[getSelectedOptions.value['Flag']] ) || 24
    )

    return {
      stock,
      reviews,
      manufacturer,
      properties,
      description,
      quantity,
      addToCart: addToCartWrapper,
      getProductNumber,
      getOptionGroups,
      getSelectedOptions,
      handleChange,
      isLoadingOptions,
      getProductOptions,
      onOptionChanged,
      optionsState: {
        regNo, flag
      },
      requireRegNo,
      canAddToCart,
      regNoInputMissing,
      addToCartBtnLoading
    }
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

.error-message{
  margin-top: -1.15rem;
  font-size: 0.8rem;
  color: red;
  margin-left: var(--quantity-selector-width, 6.75rem);
  padding-left: 1rem;
  @include for-desktop {
    margin-bottom: -1.5rem;
  }
}

@include for-desktop {
    .legal-info {
        display: none;
    }
}

@mixin for-iOS {
  @supports (-webkit-overflow-scrolling: touch) {
    @content;
  }
}
.product-details-wrapper {
  @include for-desktop {
    height: 0;
    transition: height 0.66s ease-out;
  }

  &__loaded {
    @include for-desktop {
      height: auto;
    }
  }
}

.product-details {
  &__action {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin: var(--spacer-base) 0 calc(var(--spacer-base) / 2);
  }
  &__action-button {
    padding: var(--spacer-xs) 0;
  }
  &__add-to-cart {
    margin: 1.5rem 0;
    @include for-desktop {
      margin: var(--spacer-xl) 0;
    }
  }
  &__alert {
    margin-top: 1.5rem;
  }
  &__attribute {
    margin-bottom: var(--spacer-base);
  }
  &__description {
    margin: var(--spacer-xl) 0;
    font-family: var(--font-family-secondary);
    font-size: var(--font-sm);
  }
  &__heading {
    margin: var(--spacer-base) 0 0 0;
    @include for-desktop {
      margin: var(--spacer-lg) 0 0 0;
    }
  }
  &__mobile-bar {
    display: none;
    padding: var(--spacer-sm) 0;
    box-sizing: border-box;
    .product--is-active & {
      display: block;
      @include for-desktop {
        display: none;
      }
    }
    @include for-desktop {
      display: none;
    }
  }
  &__mobile-top {
    display: flex;
    align-items: center;
    @include for-desktop {
      display: block;
    }
  }
  &__product-number {
    p {
      font-size: var(--font-sm);
      font-weight: bold;

      span {
        font-weight: var(--font-light);
      }
    }
  }
  &__section {
    padding-bottom: 10px;
    padding-top: 20px;
    @include for-desktop {
      padding-bottom: 0;
    }
    // &-attributes {
    //   height: 50px;
    // }
  }
  &__review {
    padding-bottom: var(--spacer-base);
    border-bottom: var(--c-light) solid 1px;
    margin-bottom: var(--spacer-base);
    &:last-of-type {
      border: none;
      padding-bottom: 0;
      margin-bottom: 0;
    }
    @include for-desktop {
      padding-bottom: var(--spacer-xl);
    }
  }
  &__product-property {
    padding: var(--spacer-2xs) 0;
  }
}
</style>
