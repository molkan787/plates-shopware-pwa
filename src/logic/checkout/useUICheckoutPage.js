import { ref, computed } from "@vue/composition-api"
import { CHECKOUT_STEPS } from "@/logic/checkout/steps"
import { getStepByNumber } from "@/logic/checkout/helpers"
import { getApplicationContext } from "@shopware-pwa/composables"
import { usePersonalDetailsStep } from "@/logic/checkout/usePersonalDetailsStep"
import { useShippingStep } from "@/logic/checkout/useShippingStep"
import { usePaymentStep } from "@/logic/checkout/usePaymentStep"
import { PAGE_ORDER_SUCCESS } from "@/helpers/pages"
import { useCheckout } from '@/composables/useCheckout'
import { useCheckoutAttachments } from '../../states/checkoutAttachments'
import { useFileUploadService } from '../../services/fileUploadService'
import { useOrderAttachment } from '../../composables/useOrderAttachment'

const placingOrder = ref(false)

export const useUICheckoutPage = (rootContext) => {
  const { router, routing } = getApplicationContext(
    rootContext,
    "useUICheckoutPage"
  )
  const { isGuestOrder, createOrder } = useCheckout(rootContext)
  const { upload } = useFileUploadService(rootContext)
  const { proof_of_identity, proof_of_registration_ownership } = useCheckoutAttachments()
  const { requireDocumentsUpload } = useOrderAttachment(rootContext)

  
  const getCheckoutAttachments = async () => {
    return {
        proof_of_identity: proof_of_identity.value instanceof File ? (await upload([proof_of_identity.value]))[0] : undefined,
        proof_of_registration_ownership: proof_of_registration_ownership.value instanceof File ? (await upload([proof_of_registration_ownership.value]))[0] : undefined
    }
  }

  const currentStep = ref(
    isGuestOrder.value ? CHECKOUT_STEPS.PERSONAL_DETAILS : CHECKOUT_STEPS.REVIEW
  )

  const {
    isValid: isPersonalDetailsStepValid,
    validate: validatePersonalDetailsStep,
  } = usePersonalDetailsStep(rootContext)
  const {
    isValid: isShippingStepValid,
    validate: validateShippingStep,
  } = useShippingStep(rootContext)
  const {
    isValid: isPaymentStepValid,
    validate: validatePaymentStep,
  } = usePaymentStep(rootContext)

  const isPersonalDetailsStepCompleted = computed(() => {
    return !isGuestOrder.value || isPersonalDetailsStepValid.value
  })
  const isShippingStepCompleted = computed(() => {
    return !isGuestOrder.value || isShippingStepValid.value
  })
  const isPaymentStepCompleted = computed(() => {
    return !isGuestOrder.value || isPaymentStepValid.value
  })
  const isReviewStepAvailable = computed(() => {
    return !!isPaymentStepCompleted.value
  })

  const stepsStatus = computed(() => {
    return {
      PERSONAL_DETAILS: {
        available: true,
      },
      SHIPPING: {
        available: !!isPersonalDetailsStepCompleted.value,
      },
      PAYMENT: {
        available: !!isShippingStepCompleted.value,
      },
      REVIEW: {
        available: isReviewStepAvailable.value,
      },
    }
  })

  const nextStep = async (stepNumber) => {
    let nextStepNumber = stepNumber || currentStep.value + 1
    if (stepNumber === CHECKOUT_STEPS.PERSONAL_DETAILS)
      nextStepNumber = CHECKOUT_STEPS.PERSONAL_DETAILS

    if (
      currentStep.value === CHECKOUT_STEPS.PERSONAL_DETAILS &&
      currentStep.value !== nextStepNumber
    )
      validatePersonalDetailsStep()
    if (
      currentStep.value === CHECKOUT_STEPS.SHIPPING &&
      currentStep.value !== nextStepNumber
    )
      validateShippingStep()
    if (
      currentStep.value === CHECKOUT_STEPS.PAYMENT &&
      currentStep.value !== nextStepNumber
    )
      validatePaymentStep()

    if (
      currentStep.value === CHECKOUT_STEPS.REVIEW &&
      nextStepNumber > CHECKOUT_STEPS.REVIEW
    ) {
      try {
        placingOrder.value = true
        const customFields = await getCheckoutAttachments()
        if(requireDocumentsUpload.value){
          if(typeof customFields.proof_of_identity === 'undefined' || typeof customFields.proof_of_registration_ownership === 'undefined'){
            placingOrder.value = false
            alert('Please upload all required documents')
            return
          }
        }
        const order = await createOrder(customFields)
        placingOrder.value = false
        console.log('order created!')
        router.push(routing.getUrl(`${PAGE_ORDER_SUCCESS}?orderId=${order.id}`))
      } catch (error) {
        placingOrder.value = false
        throw error
      }
    } else {
      const nextStep = getStepByNumber(nextStepNumber)
      if (stepsStatus.value[nextStep].available) {
        currentStep.value = nextStepNumber
        router.push({
          query: { step: nextStep },
        })
      }
    }
  }

  return {
    currentStep,
    nextStep,
    placingOrder
  }
}
