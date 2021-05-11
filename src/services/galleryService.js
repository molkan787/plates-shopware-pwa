import { getApplicationContext } from "@shopware-pwa/composables";

export const useGalleryService = (rootContext) => {
    const { apiInstance } = getApplicationContext(
        rootContext,
        "useGalleryService"
    )

    const getImages = async () => {
        const url = `/store-api/v3/gallery-media`
        const response = await apiInstance.invoke.get(url)
        
        return response.data
    }

    return {
        getImages
    }
}