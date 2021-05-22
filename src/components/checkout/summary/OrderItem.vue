<template>
  <SfTableRow :key="product.id" class="table__row">
    <SfTableData class="table__image">
      <SfImage
        :src="product.cover && product.cover.url"
        data-cy="product-image"
        v-if="product.cover && product.type === 'product'"
      />
    </SfTableData>
    <SfTableData class="table__description">
      <div class="product-title">{{ label }}</div>
      <div class="product-sku">{{ product.productNumber }}</div>
      <div class="collected-product__configuration" v-if="options">
        <table>
          <tr v-for="option in options" :key="`${option.group}-${option.option}`" class="sf-property">
            <td class="sf-property__name">{{ option.group }}</td>
            <td class="sf-property__value">{{ option.option }}</td>
          </tr>
        </table>
      </div>
    </SfTableData>
    <SfTableData class="table__data table__quantity" data-cy="table-quantity">
      <SfQuantitySelector
        v-if="product.type === 'product'"
        v-model="quantity"
        class="sf-quantity-selector--secondary"
        data-cy="quantity"
        >{{ product.quantity }}</SfQuantitySelector
      >
    </SfTableData>
    <SfTableData class="table__data table__amount">
      <SfPrice
        :regular="product.price.totalPrice | price"
        class="product-price"
      />
    </SfTableData>
  </SfTableRow>
</template>
<script>
import { useCart } from "@shopware-pwa/composables"
import { ref, watch, computed } from "@vue/composition-api"
import {
  SfTable,
  SfCheckbox,
  SfImage,
  SfIcon,
  SfPrice,
  SfQuantitySelector,
} from "@storefront-ui/vue"
import { useProductDetails } from '../../../composables/useProductDetails'

export default {
  name: "OrderItem",
  components: {
    SfTable,
    SfCheckbox,
    SfImage,
    SfIcon,
    SfPrice,
    SfQuantitySelector,
  },
  props: {
    product: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, { root }) {
    const { removeProduct, changeProductQuantity } = useCart(root)
    console.log(props.product)
    const { label } = useProductDetails(props.product)
    const quantity = ref(props.product.quantity)
    const options = computed(
      () => (props.product && props.product.payload && props.product.payload.options) || []
    )
    watch(quantity, async (qty) => {
      if (qty === props.product.quantity) return
      await changeProductQuantity({ id: props.product.id, quantity: qty })
    })
    return {
      removeProduct,
      quantity,
      label,
      options
    }
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/scss/variables";

.sf-image {
  max-width: 80%;
}

.table {
  &__description {
    text-align: left;
    flex: 0 0 20rem;
  }
  &__data {
    text-align: center;
    &:last-of-type {
      text-align: right;
    }
  }
  &__quantity {
    text-align: center;
    font-size: var(--font-lg);
    & > * {
      --quantity-selector-width: 6rem;
      --quantity-selector-border-width: 0;
    }
  }
  &__amount {
    text-align: right;
  }
}
.sf-property{
  display: table-row;
  .sf-property__name, .sf-property__value{
    font-size: 0.8rem;
    display: table-cell;
  }
}
.collected-product {
  --collected-product-actions-align-items: flex-end;
  --collected-product-title-font-size: var(--font-base);
  margin: var(--spacer-base) 0;

  &__configuration {
    margin-top: var(--spacer-sm);
    align-items: end;
    align-self: baseline;
    @include for-desktop {
      flex-direction: row-reverse;
    }
  }

  @include for-desktop {
    &:hover {
      --cp-actions-opacity: 1;
    }
  }
}
::v-deep .product-price {
  & > * {
    flex: 1;
  }
}
</style>
