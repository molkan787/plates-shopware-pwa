import { ref } from '@vue/composition-api';

const regNo = ref('');
const flag = ref(8)

export const useProductOptions = () => ({
    regNo,
    flag
})