// Loads: jQuery, bootstrap-sass, lodash, axios
// import { commit } from 'lodash/seq'
require('./bootstrap')

// Adds to global scope: cookie funcions, toggle functions, skuList json, skuOptions json,
require('./functions')

// Pull in vue and use rou sssster
const Vue = require('vue')
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// Pull in vuex
import Vuex from 'vuex'

Vue.use(Vuex)

/*
 Vue Loading ANimation Spinners - https://github.com/greyby/vue-spinner test
 */

import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

Vue.component('pulse-loader', require('vue-spinner/src/PulseLoader.vue'))

/*
 Vue validation plug in - http://vee-validate.logaretm.com/
 */

import VeeValidate from 'vee-validate'

Vue.use(VeeValidate)

// Auto size textarea https://www.npmjs.com/package/vue-textarea-autosize
import VueTextareaAutosize from 'vue-textarea-autosize'

Vue.use(VueTextareaAutosize)

const moment = require('moment')

// Global functions and properties used by packing slip creation
let PackingSlipScope = {}

PackingSlipScope.getCurrentDate = function () {
    let today = new Date()
    today = moment(today).add(7, 'd').format('YYYY-MM-DD')
    return today
}

PackingSlipScope.getAllDigiPos = function () {

    var self = this
    axios.get('getallpos').then((response) => {
        self.allPos = response.data
        return self.allPos
    })

}

PackingSlipScope.currentDate = PackingSlipScope.getCurrentDate()
PackingSlipScope.allPos = PackingSlipScope.getAllDigiPos()

PackingSlipScope.getAllDigiPos()

let startState = {
    shipmentNumber: '',
    vendorInvoices:'',
    shippingLocation: '',
    digiPos: '',
    // invoiceNumbers: '',
    totalsArray: '',
    date: {
        time: PackingSlipScope.currentDate
    },
    currentDate: PackingSlipScope.currentDate,
    allDigiPos: PackingSlipScope.getAllDigiPos(),
    rows: [{
        'Description': '',
        'Digi PO': '',
        'Notes': '',
        'Pallet #': '',
        'QTY(Loose Items)': 0,
        'QTY(Master Cases)': '',
        'SKU': '',
        'Total Units': null,
        'Type': 'Cartridge',
        'Weight': null,
        'Lot Number': '',
        'eLiquid Lot Number': ''
    },
    ],
    shipmentToView: '',
}

/**
 *
 * @type {Store<any>}ss
 */
const store = new Vuex.Store({
    state: {
        shipmentNumber: '',
        shippingLocation: '',
        digiPos: '',
        vendorInvoices:'',
        // invoiceNumbers: '',
        totalsArray: '',
        date: {
            time: PackingSlipScope.currentDate
        },
        skuData: '',
        currentDate: PackingSlipScope.currentDate,
        allDigiPos: PackingSlipScope.getAllDigiPos(),
        rows: [{
            'Description': '',
            'Digi PO': '',
            'Notes': '',
            'Pallet #': '',
            'QTY(Loose Items)': 0,
            'QTY(Master Cases)': '',
            'SKU': '',
            'Total Units': null,
            'Type': 'Cartridge',
            'Weight': null,
            'Lot Number': '',
            'eLiquid Lot Number': ''
        },
        ],
        shipmentToView: '',
    },
    getters: {
        /**
         *
         * @param state
         * @returns {PackingSlipScope.currentDate}
         */
        date: state => {
            return state.date.time
        },
    },
    mutations: {
        addRow: function (state, row) {
            Object.assign(state.rows, row)
        },
        resetState(state) {
            Object.assign(state, startState);
        },
        date(state, payload) {
            state.date = payload
        },
        vendorInvoices(state, payload) {
            state.vendorInvoices = payload
        },
        shippingLocation(state, payload) {
            state.shippingLocation = payload
        },
        skuData(state, payload) {
            state.skuData = payload
        },
        addShipmentNumber(state, payload) {
            state.shipmentNumber = payload
        },
        digiPos(state, payload) {
            state.digiPos = payload
        },
        // invoiceNumbers (state, payload) {
        //   state.invoiceNumbers = payload
        // },
        totalsArray(state, payload) {
            state.totalsArray = payload
        },
        shipmentToView(state, payload) {
            state.shipmentToView = payload
        },
    },
    actions: {
        todaysDate: function ({commit}, value) {
            commit('date', value)
        },
        date: function ({commit}, value) {
            commit('date', value)
        },
    }
})

// Components

// Project tracking module
const Tracking = require('./components/tracking.vue')
Vue.component('md-tracking', Tracking)

// Packing list module
// Creation Form
const Packing = require('./components/Packing.vue')
Vue.component('md-packing', Packing)
// Dashboard
const PackingDashboard = require('./components/Packing-Dashboard.vue')
Vue.component('md-packing-dashboard', PackingDashboard)
// Summary
const PackingSummary = require('./components/Packing-Summary.vue')
Vue.component('md-packing-summary', PackingSummary)

// Summary
const ExistingSummary = require('./components/Existing-Summary.vue')
Vue.component('md-existing-summary', ExistingSummary)

// Define packing list module routes
const routes = [
    {
        path: '/Packing',
        component: Packing
    },
    {
        path: '/',
        component: PackingDashboard
    },
    {
        path: '/Packing-Summary',
        component: PackingSummary
    },
    {
        path: '/Existing-Summary',
        component: ExistingSummary
    }
]

// Initiate router instance with routesvffff
const router = new VueRouter({
    routes
})

// Create vue instance and bind router
const app = new Vue({
    router,
    store: store
}).$mount('#app')



