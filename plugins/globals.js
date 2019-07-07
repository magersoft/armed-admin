import Vue from 'vue'

import DateFilter from '@/utils/date.filter'
import CurrencyFilter from '@/utils/currency.filter'
import DecimalsFilter from '@/utils/decimals.filter'

Vue.filter('currency', CurrencyFilter)
Vue.filter('decimals', DecimalsFilter)
Vue.filter('date', DateFilter)
