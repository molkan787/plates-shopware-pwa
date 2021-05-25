import { getApplicationContext } from "@shopware-pwa/composables"


export function orderService(rootContext){
    const { apiInstance } = getApplicationContext(
        rootContext,
        "orderService"
    )
    
    const getOrderDetailsByDeepLinkCode = async (deepLinkCode) => {
        const { data } = await apiInstance.invoke.get(`/store-api/v3/order?limit=1&filter[deepLinkCode]=${deepLinkCode}`)
        return data.orders.elements[0] || null
    }

    const getOrderTrackingDetails = async (email, orderNo) => {
        email = encodeURIComponent(email)
        orderNo = encodeURIComponent(orderNo)
        const { data } = await apiInstance.invoke.get(`/store-api/v3/order-tracking/get-tracking-details?orderNo=${orderNo}&email=${email}`)
        return data
    }

    return {
        getOrderDetailsByDeepLinkCode,
        getOrderTrackingDetails
    }

}