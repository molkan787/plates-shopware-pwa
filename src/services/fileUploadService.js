import { getApplicationContext } from "@shopware-pwa/composables";

export const useFileUploadService = (rootContext) => {
    const { apiInstance } = getApplicationContext(
        rootContext,
        "useFileUploadService"
    )

    const upload = async (files) => {
        const url = `/store-api/v3/files/upload`

        const formData = new FormData();
        files.forEach(file => (
            formData.append(file.name, file)
        ))
        const response = await apiInstance.invoke.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        return response.data
    }

    return {
        upload
    }
}