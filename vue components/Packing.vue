Í
<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <!--<div class="row">-->
    <!--<div class="col-lg-12s">-->
    <div class="card">
        <div class="card-header">
            <i class="fa fa-align-justify"></i>
            Packing List Creation - Add Line Items
        </div>
        <div class="card-block">
            <div class="summary-headers">
                <h6 class="summary-header dataBlue">Shipment Number: <span class="data sumNumber">{{shipmentNumber}}</span></h6>
                <h6 class="summary-header">Related Dig PO Number(s):
                    <span class="data dataBlue"
                          v-for="(n, index) in digiPos"><span>{{n}} </span><span
                            v-if="index+1 < digiPos.length"></span></span></h6>
                <div class="shipDate">
                    <h6 class="summary-header date-header">Expected Ship Date: &nbsp;</h6>
                    <div class="date-wrapper">
                        <date-picker :date="vueDate" :option="option"></date-picker>
                    </div>
                    <div class="date-help">(click date to change)</div>
                </div>
                <div class="shippping-location-div">
                    <h6 class="summary-header location-label">Shipping Location:</h6>
                    <label for="shipping-location" class="sr-only"></label>
                    <select class="location-select" type="text" v-on:change="shipLocation()"
                            :data-vv-name="'shippingLocation'" id="shipping-location" v-model="selectedLocation"
                            data-vv-as="Shipping Location" v-validate data-vv-rules="required|not_in:">
                        <option v-for="location in shippingLocations" v-bind:value="location">{{location}}</option>
                    </select>
                    <h6 class="text-danger location-error" v-if="errors.has('shippingLocation')">{{
                        errors.first('shippingLocation') }}</h6>
                </div>

            </div>
            <div>
                <table class="pkg-list-table table table-bordered table-striped table-condensed table-responsive">
                    <thead>
                    <tr>
                        <td><strong>Pallet</strong></td>
                        <td><strong>Dig PO</strong></td>
                        <td><strong>SKU</strong></td>
                        <td><strong>Description</strong></td>
                        <td><strong>Master Cases</strong></td>
                        <td><strong>Loose Items</strong></td>
                        <td><strong>Total Units</strong></td>
                        <td><strong>Lot</strong></td>
                        <td><strong>eLiquid Lot</strong></td>
                        <td><strong>Notes</strong></td>
                        <td></td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(row, index) in rows" v-bind:key="index">
                        <td>
                            <label for="palletNumberId" class="sr-only"></label>
                            <input size="4" data-vv-as="pallet number" :data-vv-name="'pallet'+index"
                                   v-model="row['Pallet #']" v-validate data-vv-rules="required|decimal:{1}"
                                   id="palletNumberId">

                            <p class="text-danger" v-if="errors.has('pallet'+index)">{{ errors.first('pallet'+index)
                                }}</p>
                        </td>
                        <td>
                            <label for="digi_po_number" class="sr-only"></label>
                            <select type="text" v-on:change="" :data-vv-name="'ponumber'+index" id="digi_po_number"
                                    v-model="row['Digi PO']" data-vv-as="Digi PO" v-validate
                                    data-vv-rules="required|not_in:">
                                <option v-for="(n, index) in allPos" v-bind:key="index">{{n}}</option>
                            </select>
                            <p class="text-danger" v-if="errors.has('ponumber'+index)">{{ errors.first('ponumber'+index)
                                }}</p>

                        </td>
                        <td>
                            <label for="sku_select" class="sr-only"></label>
                            <select id="sku_select" v-model="row['SKU']" v-on:change="onSkuChange(index)"
                                    :data-vv-name="'skuSelect'+index" data-vv-as="SKU" v-validate
                                    data-vv-rules="required|not_in:">
                                <option v-for="option in skuOptions" v-bind:value="option">{{option}}
                                </option>
                            </select>
                            <p class="text-danger" v-if="errors.has('skuSelect'+index)">{{
                                errors.first('skuSelect'+index) }}</p>
                        </td>
                        <td>
                            <p class="desc_p" v-model="row['Description']">{{row['Description']}}</p>
                        </td>
                        <td>
                            <label for="masterId" class="sr-only"></label>
                            <input id="masterId" size="4" v-model="row['QTY(Master Cases)']"
                                   v-on:change="onQtyMasterChange(index)" :data-vv-name="'qtyMaster'+index"
                                   data-vv-as="Master Cases" v-validate data-vv-rules="required|decimal:{1}">
                            <p class="text-danger" v-if="errors.has('qtyMaster'+index)">{{
                                errors.first('qtyMaster'+index) }}</p>
                        </td>
                        <td>
                            <label for="looseId" class="sr-only"></label>
                            <input id="looseId" size="4" v-model="row['QTY(Loose Items)']"
                                   v-on:change="onQtyMasterChange(index)" :data-vv-name="'qtyLoose'+index"
                                   data-vv-as="Loose Items" v-validate data-vv-rules="required|decimal:{1}">
                            <p class="text-danger" v-if="errors.has('qtyLoose'+index)">{{ errors.first('qtyLoose'+index)
                                }}</p>
                        </td>
                        <td>
                            <!--<label for="totalId" class="sr-only"></label>-->
                            <P id="totalId" v-model="row['Total Units']" v-if="!isNaN(row['Total Units'])" readonly>
                                {{row['Total Units']}}</P>
                            <!--<p class="text-danger" v-if="errors.has('qtyTotal'+index)">{{ errors.first('qtyTotal'+index) }}</p>-->
                        </td>
                        <td>
                            <label for="lot_id" class="sr-only"></label>
                            <!--<input id="lot_id" size="4" v-model="row['Lot Number']" v-on:change="" :data-vv-name="'Lot Number'+index" data-vv-as="Lot Number" v-validate data-vv-rules="required">-->
                            <input id="lot_id" size="4" v-model="row['Lot Number']" v-on:change="">
                            <!--<p class="text-danger" v-if="errors.has('Lot Number'+index)">{{ errors.first('Lot Number'+index) }}</p>-->
                        </td>
                        <td>
                            <label for="eliquidlot_id" class="sr-only"></label>
                            <input id="eliquidlot_id" size="4" v-model="row['eLiquid Lot Number']">
                            <!--<input id="eliquidlot_id" size="4" v-model="row['eLiquid Lot Number']" :data-vv-name="'eliquidlot'+index" v-on:change="" data-vv-as="eLiquid Lot Number"  v-validate data-vv-rules="required">-->
                            <p class="text-danger" v-if="errors.has('eliquidlot'+index)">{{
                                errors.first('eliquidlot'+index) }}</p>
                        </td>
                        <td>
                            <textarea-autosize class="no-pad" :min-height="22" id="notesId" rows="1"
                                               v-model="row['Notes']"></textarea-autosize>
                        </td>
                        <td>
                            <button class="btn-danger btn delete_row_btn" v-on:click="removeElement(index);"
                                    style="cursor: pointer">
                                <i class="fa fa-trash"></i>
                            </button>
                        </td>

                    </tr>
                    </tbody>

                </table>
                <div class="pkg-list-btns-wrapper">
                    <div class="md-add-row-wrapper">
                        <button class="btn-primary btn btn-sm" @click="validateBeforeSubmit">
                            <i class="fa fa-plus md-add-row-icon"></i>
                            Add Row
                        </button>
                    </div>
                    <!--todo add a ref so user can see what digi POs they have used-->
                    <div class="btn-group-sm" role="group">
                        <button v-on:click="checkDateAndSave" role="button" class="btn btn-primary">Save</button>
                        <router-link class="router-link" to="/">Cancel</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--</div>-->
    <!--</div>-->
</template>


<script>


    // Vuex
    import {mapGetters, mapActions} from 'vuex'

    const moment = require('moment')

    import myDatepicker from 'vue-datepicker'
    //https://github.com/hilongjw/vue-datepicker

    // Define custom validator messages
    import
    {
        Validator
    }
        from
            'vee-validate'

    const dictionary = {
        en: {
            messages: {
                decimal: () => 'Entry must be an integer.',
                not_in: () => 'Please select a value from the list.'
            }
        },
    }

    Validator.updateDictionary(dictionary)

    import {ErrorBag} from 'vee-validate'

    const bag = new ErrorBag()

    export default {

        data() {
            return {
                selectedLocation: this.$store.state.shippingLocation,
                allPos: '',
                shippingLocations: '',
                skuList: window.skuList,
                isDateSelected: false,
                noDate: false,
                vueDate: {
                    time: this.$store.getters.date
                },
                skuOptions: '',
                option: {
                    type: 'day',
                    inputClass: 'md-datepicker',
                    wrapperClass: 'sfdsdfds',
                    week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
                    month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                    format: 'YYYY-MM-DD',
                    //          placeholder: 'when?',
                    inputStyle: {
                        'display': 'inline-block',
                        'padding': '0',
                        'line-height': '1.1',
                        'font-size': '16px',
                        'border': 'none',
                        'font-weight': '500',
                        'text-align': 'left',
                        'cursor': 'pointer',
                        'color': '#00aced',
                        'font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
                    },
                },
            }
        },
        watch: {
            date: function (val) {
                this.$store.commit('date', val)
            },
            time() {
                this.$store.commit('date', this.vueDate)
            },
            deep: true
        },
        computed: {
            time() {
                return this.vueDate.time
            },
            rows() {
                return this.$store.state.rows
            },
            shippingLocation() {
                return this.$store.state.shippingLocation
            },
            shipmentNumber() {
                return this.$store.state.shipmentNumber
            },
            skuData() {
                return this.$store.state.skuData
            },
            digiPos() {
                return this.$store.state.digiPos
            }
        },
        methods: {
            getSkuOptions() {
                let _self = this
                axios.get('skuList').then((response) => {
                    console.log(response)
                    _self.$store.commit('skuData', response.data)
                    let skuArray = []
                    _self.skuData.forEach(function (value) {
                        skuArray.push(value.sku)
                    })
                    _self.skuOptions = skuArray
                })

            },
            // getSkuData() {
            //     axios.get('skuList').then((response) => {
            //         console.log(response)
            //         this.$store.commit('skuData', response.data)
            //     })
            // },
            shipLocation() {
                this.$store.commit('shippingLocation', this.selectedLocation)
            },
            mapActions: ([
                'todaysDate',
                'date'
            ]),
            // Update state with row data
            addRowState(row) {
                this.$store.commit('addRow', row)
            },
            // Validate all fields use when new row is added or list is saved
            validateBeforeSubmit() {
                this.$validator.validateAll()
                // Check for errors and then add row
                if (!this.errors.any()) {
                    this.addRow()
                }
            },
            addRow() {
                document.createElement('tr')
                this.rows.push({
                    'Pallet #': '',
                    'QTY(Master Cases)': 0,
                    'QTY(Loose Items)': 0,
                    'Total Units': 0,
                    'Notes': '',
                    'SKU': '',
                    'Description': '',
                    'Digi PO': '',
                    'Type': '',
                    'Weight': 0,
                    'eLiquid Lot Number': '',
                    'Lot Number': ''
                })
                this.getDigiPos()
                this.addRowState(this.rows)
//        this.shipLocation
            },
            removeElement(index) {
                bag.clear()
                // Check for errors before removing row
                if (!this.errors.any()) {
                    this.rows.splice(index, 1)
                } else {
                    bag.clear()
                    this.rows.splice(index, 1)
                }
                this.getDigiPos()
            },
            onSkuChange(index) {
                let skuKey = this.lookupSkuDescription(index)
                // console.log(skuKey)
                this.rows[index]['Description'] = this.skuData[skuKey].fields.Description
                this.rows[index]['Type'] = this.skuData[skuKey].fields['Product Type']
                this.onQtyMasterChange(index)
            },
            onQtyMasterChange(index) {
                let skuKey = this.lookupSkuDescription(index)
                // console.log(skuKey)
                this.rows[index]['Total Units'] = (this.rows[index]['QTY(Master Cases)'] * this.skuData[skuKey].fields.QtyPerCase) + parseInt(this.rows[index]['QTY(Loose Items)'])
                this.rows[index]['Weight'] = this.rows[index]['Total Units'] * this.skuData[skuKey].fields.Weight
            },
            lookupSkuDescription(row) {
                return _.findKey(this.skuData, ['sku', this.rows[row]['SKU']])
            },
            getShipmentNumber() {

                axios.get('ShipmentRef').then((response) => {
                    let lastShipment = response.data
                    lastShipment++
                    this.$store.commit('addShipmentNumber', lastShipment)
                })
            },
            getAllPos() {
                var self = this
                axios.get('getallpos').then((response) => {
                    self.allPos = response.data
                })
            },
            getDigiPos() {
                let digiPos = []
                this.rows.forEach(function (item) {
                    digiPos.push(item['Digi PO'])
                })
                digiPos = _.uniq(digiPos)
                digiPos = _.sortBy(digiPos)
                this.$store.commit('digiPos', digiPos)
                // this.digiPos = digiPos
            },
            startSummary() {

            },
            checkDateAndSave() {
                this.$validator.validateAll()
                if (!this.errors.any()) {
                    this.$router.push('/Packing-Summary')
                }
            },
            dateSelected() {
                this.isDateSelected = true
                this.noDate = false
            },
            getShippingLocations() {
                let self = this
                axios.get('getlocations').then((response) => {
                    //          response.data.push('Choose One')
                    self.shippingLocations = response.data
                    //          console.log(response)
                })
            }
        }
        ,

        mounted() {
            this.getShippingLocations()
//      this.shipLocation(location)
            this.getAllPos()
            this.addRowState(this.rows)
            this.getShipmentNumber()
            this.getSkuOptions()
        }
        ,
        components: {
            'date-picker':
            myDatepicker
        }
    }
</script>

<style type="text/css">

    .dataBlue span {
        color: #00aced;
    }

    td {
        padding-left: 5px;
        padding-right: 5px;
    }

    .delete_row_btn {
        padding: 1px 6px;
    }

    .desc_p {
        margin-top: 0;
        margin-bottom: 0;
    }

    .no-pad {
        padding-left: 10px;
    }

    thead {
        text-align: center !important;
    }

    input {
        text-align: center;
    }

    tbody {
        text-align: center;
    }

    /*.table th, .table td {*/
    /*vertical-align: inherit;*/
    /*}*/



    .summary-headers {
        padding-bottom: 20px;
    }

    .shipDate {
        margin-top: 25px;
    }

    .md-add-row-wrapper {
        margin-top: 25px;
    }

    .vdp-datepicker input {
        color: #00aced;
        font-size: 16px;
        font-weight: 500;
    }

    ::-webkit-input-placeholder {
        color: #00aced;
    }

    ::-moz-placeholder {
        color: #00aced;
    }

    :-ms-input-placeholder {
        color: #00aced;
    }

    :-moz-placeholder {
        color: #00aced;
    }

    .datepicker,
    .date-header {
        float: left;
        line-height: 1.1;
        margin-bottom: 25px;
    }

    .shipDate {
        clear: both;
    }

    .md-datepicker:after {
        content: "\f073";
        font-family: FontAwesome;
    }

    .pkg-list-table thead th,
    .pkg-list-table thead td {
        vertical-align: inherit;
    }

    .shippping-location-div {
        clear: both;
        margin-top: 25px;
    }

    .location-label {
        display: inline-block;
    }

    .location-select {
        margin-left: 5px;
    }

    .router-link {
        padding-left: 6px;
    }

    .location-error {
        font-size: 0.875rem;
    }

    .text-danger {
        font-weight: bold;
    }

</style>
