import Vue from 'vue'
import VueFbCustomerChat from 'vue-fb-customer-chat'
 
Vue.use(VueFbCustomerChat, {
  page_id: 192087514769361, //  change 'null' to your Facebook Page ID,
  theme_color: '#efd301', // theme color in HEX
  locale: 'en_UK', // default 'en_US'
})