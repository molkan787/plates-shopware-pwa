import { ref } from '@vue/composition-api';

const proof_of_identity = ref(0);
const proof_of_registration_ownership = ref(0);

export const useCheckoutAttachments = () => {
    return {
        proof_of_identity,
        proof_of_registration_ownership
    }
}