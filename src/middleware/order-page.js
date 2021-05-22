
export default function ({ route, redirect }){
    const { fullPath } = route;
    if(fullPath.startsWith('/account/order/')){
        const parts = fullPath.split('/')
        const id = parts[parts.length-1]
        return redirect(`/show_order/${id}`)
    }
}