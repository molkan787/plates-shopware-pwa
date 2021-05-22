<template>
  <SfTableRow :key="product.id" class="table__row">
    <SfTableData class="table__description">
      <div class="product-title">{{ label }}</div>
      <div class="product-sku">{{ product.productNumber }}</div>
      <div class="collected-product__configuration" v-if="options">
        <div style="width:100%;height: 5px"></div>
        <table>
          <tr v-for="option in options" :key="`${option.group}-${option.option}`" class="sf-property">
            <td class="sf-property__name">{{ option.group }}</td>
            <td class="sf-property__value">{{ option.option }}</td>
          </tr>
        </table>
      </div>
    </SfTableData>
    <SfTableData class="table__data table__price">
      <SfPrice :regular="getUnitPrice | price" class="product-price" />
    </SfTableData>
    <SfTableData class="table__data table__quantity">
      {{ getQuantity }}
    </SfTableData>
    <SfTableData class="table__data table__amount">
      <SfPrice :regular="getTotalPrice | price" class="product-price" />
    </SfTableData>
  </SfTableRow>
</template>
<script>
import {
  SfTable,
  SfCheckbox,
  SfImage,
  SfIcon,
  SfPrice,
  SfQuantitySelector,
} from "@storefront-ui/vue"
import { useProductDetails } from '../composables/useProductDetails'

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
  computed: {
    getName() {
      return this.product.label
    },
    getUnitPrice() {
      return this.product.unitPrice
    },
    getTotalPrice() {
      return this.product.totalPrice
    },
    getQuantity() {
      return this.product.quantity
    },
    options(){
      return this.product.payload && this.product.payload.options
    }
  },
  setup({ product }){
      const { label } = useProductDetails(product)
      console.log(product)
      return {
          label
      }
  }
}
</script>
<style lang="scss" scoped>
.product-price {
  white-space: nowrap;
}
.sf-property{
  display: table-row;
  .sf-property__name, .sf-property__value{
    font-size: 0.8rem;
    display: table-cell;
  }
}
.table {
  & > td {
    flex: 1;
    order: unset;
  }

  &__data {
    order: unset;
    flex: 1;
    --price-regular-font-weight: var(--font-normal);
  }
  &__description {
    padding-right: var(--spacer-sm);
    order: unset;
    flex: 2;
  }

  &__row:hover {
    --table-row-box-shadow: none;
  }
  &__quantity {
    text-align: center;
    font-size: var(--font-lg);
  }
  &__amount {
    text-align: right;
  }
}
::v-deep .product-price {
  & > * {
    flex: 1;
  }
}
</style>
