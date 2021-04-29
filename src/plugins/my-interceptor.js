import {
    useAddToCart,
} from "@shopware-pwa/composables";

export default async ({ app }) => {
    const { onAddToCart, addToCart } = useAddToCart(app);
    onAddToCart((params) => {
        console.log('params', params);
    });
};