import { computed } from "@vue/composition-api";
import {
    useCart
} from "@shopware-pwa/composables";

export const useOrderAttachment = (
    rootContext
) => {
    const { cartItems } = useCart(rootContext);

    const requireDocumentsUpload = computed(() => {
        const { value: items } = cartItems;
        for (let item of items) {
            const { custom_plate_reg_no } = (item.payload && item.payload.customFields) || {}
            if (custom_plate_reg_no) return true;
        }
        return false;
    })

    return {
        requireDocumentsUpload
    };
};
