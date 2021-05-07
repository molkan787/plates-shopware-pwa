import { loadStripe } from '@stripe/stripe-js'

let stripe = null;
export async function getStripe(){
    if(stripe === null){
        stripe = await loadStripe('pk_test_e5779kyCYCS0VBUYj8WfQrxO');
    }
    return stripe;
}