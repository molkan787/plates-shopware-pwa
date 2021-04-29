import { computed } from '@vue/composition-api'
export const useProductDetails = (product) => {

    const regNo = computed(
        () => (product.payload && product.payload.customFields && product.payload.customFields.registration_no)
    )

    const label = computed(
        () => product.label + (regNo.value ? ` "${regNo.value}"` : '')
    )

    return {
        regNo,
        label
    }
    
} 