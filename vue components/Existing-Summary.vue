<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div class="row">
        <div class="col-lg-12">
            <div class="card">
                <div class="card-header">
                    <i class="fa fa-align-justify"></i>
                    Packing List Creation - Shipment Summary
                </div>
                <div class="card-block">
                    <div class="summary-headers">
                        <h6 class="summary-header dataBlue">Shipment Number: <span
                                class="data">{{shipmentNumber}}</span></h6>
                        <h6 class="summary-header dataBlue">Related PO Number(s): <span class="data"
                                                                                        v-for="(n, index) in digiPos"><span>{{n}}</span><span
                                v-if="index+1 < digiPos.length">, </span></span></h6>
                        <h6 class="summary-header dataBlue">Expected Ship Date: <span
                                class="data"> {{shipmentDate}}</span></h6>
                        <h6 class="summary-header dataBlue">Shipment Status: <span
                                class="data"> {{shipmentStatus}}</span></h6>
                    </div>
                    <div class="summarySection">
                        <div class="line-items-title">
                            <h6 class="line-items-header">Line Items:</h6>
                        </div>
                        <table class="table table-bordered table-striped table-condensed table-responsive tablemm">
                            <thead>
                            <tr>
                                <th v-for="key in columns"
                                    @click="sortBy(key)"
                                    :class="{ active: sortKey == key }">
                                    {{ key }}
                                    <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'"></span>
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="row in filteredData">
                                <td>{{row['Pallet #']}}</td>
                                <td>{{row['Digi PO']}}</td>
                                <td>{{row['SKU']}}</td>
                                <td>{{row['Description']}}</td>
                                <td>{{row['QTY(Master Cases)']}}</td>
                                <td>{{row['QTY(Loose Items)']}}</td>
                                <td>{{row['Total Units']}}</td>
                                <td>{{row['Notes']}}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="summarySection">
                        <div class="line-items-title">
                            <h6 class="line-items-header">Totals by SKU:</h6>
                        </div>
                        <table class="table table-bordered table-striped table-condensed table-responsive tablemm">
                            <thead>
                            <tr>
                                <th v-for="key in skuColumns">
                                    {{ key }}
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="row in totalsArray">
                                <td>{{row['SKU']}}</td>
                                <td>{{row['Description']}}</td>
                                <td>{{row['Master Cases']}}</td>
                                <td>{{row['Loose Items']}}</td>
                                <td>{{row['Total Units']}}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="summarySection">
                        <div class="line-items-title">
                            <h6 class="line-items-header">Pallet Weights:</h6>
                        </div>
                        <table class="table table-bordered table-striped table-condensed table-responsive tablemm">
                            <thead>
                            <tr>
                                <th v-for="key in palletColumns">
                                    {{ key }}
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="row in palletWeightArray">
                                <td>{{row['Pallet #']}}</td>
                                <td>{{row['Weight']}}kg</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="summary-totals">
                        <h6 class="pallets-used dataBlue">Pallet Number(s): <span class="data"
                                                                                  v-for="(pallet, index) in palletNumbers"><span>{{pallet}}</span><span
                                class="data" v-if="index+1 < palletNumbers.length">,  </span></span></h6>
                        <h6 class="summary-total dataBlue">Total Weight: <span class="data">{{totalWeight}}kg</span>
                        </h6>
                        <h6 class="summary-total last-total dataBlue">Total Units: <span
                                class="data">{{totalUnits}}</span></h6>
                    </div>
                    <!--<div class="summary-totals docs-div">-->
                        <!--<h6 class="summary-total">Documents:</h6>-->
                        <!--<a v-if="airTableData['ShipLog'][0].fields['Packing List Doc']" target="_blank"-->
                           <!--v-bind:href="''+airTableData['ShipLog'][0].fields['Packing List Doc'][0].url+''">Packing List</a>-->
                        <!--<span v-if="!airTableData['ShipLog'][0].fields['Packing List Doc']">Packing List </span>-->
                        <!--<span class="seper">|</span>-->
                        <!--<a class="invoice" target="_blank" v-if="airTableData['ShipLog'][0].fields['Commercial Invoice Doc']"-->
                           <!--v-bind:href="''+airTableData['ShipLog'][0].fields['Commercial Invoice Doc'][0].url+''"> Commercial Invoice</a>-->
                        <!--<span class="invoice"-->
                              <!--v-if="!airTableData['ShipLog'][0].fields['Commercial Invoice Doc']"> Commercial Invoice</span>-->
                    <!--</div>-->

                    <div class="summary-buttons btn-group-sm">
                        <button v-if="hideSave==false" type="button" class="btn btn-primary editBtn" disabled>Edit
                        </button>
                        <button v-if="hideSave==false" type="button" class="btn btn-primary genPdf" @click="saveData"
                                :disabled="shipmentStatus !== inReview">Generate PDF
                        </button>
                        <pulse-loader :loading="loading" :color="color" :size="size"></pulse-loader>
                        <router-link class="router-link" to="/">Back to shipments</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            let sortOrders = {}
            let columns = ['Pallet', 'Digi PO', 'SKU', 'Description', 'Master Cases', 'Loose Items', 'Total Units', 'Notes']
            let skuColumns = ['SKU', 'Description', 'Master Cases', 'Loose Items', 'Total Units']
            let palletColumns = ['Pallet', 'Weight']
            columns.forEach(function (key) {
                sortOrders[key] = 1
            })
            return {
                inReview: 'Confirmed',
                columns: columns,
                sortOrders: sortOrders,
                sortKey: '',
                palletNumbers: [],
                totalsArray: [],
                skuColumns: skuColumns,
                palletWeightArray: [],
                palletColumns: palletColumns,
                totalWeight: 0,
                totalLoose: '',
                totalMaster: '',
                totalUnits: '',
                loading: false,
                color: '#00ABED',
                size: '20px',
                saveClicked: false,
                hideSave: false,
                pdfDone: false,
                pdfPath: '',
                airTableData: {},
                sortedData: [],
                rows: [],
                shipmentDate: '',
                shippingLocation: '',
                poGroups: '',
                skuPoGroups: [],
                shipmentStatus: ''
            }
        },
        computed: {
            //      rows () {
            //
            //      },

            //      shipmentDate () {
            ////                return this.$store.state.date.time
            //      },
            createdOnDate() {
                //        return this.$store.state.currentDate
            },
            shipmentNumber: {
                get: function () {
                    return this.$store.state.shipmentToView
                },
                set: function () {
                    //              this.shipmentNumber = this.$store.state.shipmentNumber
                }
            },
            digiPos() {
                return this.$store.state.digiPos
            },
            //      invoiceNumbers () {
            //        return this.$store.state.invoiceNumbers
            //      },
            filteredData: function () {
                let data = this.rows
                let sortKey = this.sortKey
                let filterKey = this.filterKey && this.filterKey.toLowerCase()
                let order = this.sortOrders[sortKey] || 1
                if (filterKey) {
                    data = data.filter(function (row) {
                        return Object.keys(row).some(function (key) {
                            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
                        })
                    })
                }
                if (sortKey) {
                    data = data.slice().sort(function (a, b) {
                        a = a[sortKey]
                        b = b[sortKey]
                        return (a === b ? 0 : a > b ? 1 : -1) * order
                    })
                }
                return data
            }
        },
        methods: {
            mapActions: ([
                'digiPos'
            ]),
            countPallets() {
                this.numberOfPallets = this.palletNumbers.length
            },
            saveData() {
                this.hideSave = true
                this.saveClicked = true
                this.loading = true
                this.createPdf()
            },
            getDigiPos() {
                let digiPos = []
                this.rows.forEach(function (item) {
                    digiPos.push(item['Digi PO'])
                })
                digiPos = _.uniq(digiPos)
                digiPos = _.sortBy(digiPos)
                this.$store.commit('digiPos', digiPos)
            },
            //      getInvoiceNumbers () {
            //        let invoiceNumbers = []
            //        this.rows.forEach(function (item) {
            //          invoiceNumbers.push(istem['Kanger Invoice Number'])
            //        })
            //        invoiceNumbers = _.uniq(invoiceNumbers)
            //        invoiceNumbers = _.sortBy(invoiceNumbers)
            //        this.$store.commit('invoiceNumbers', invoiceNumbers)
            //      },
            getPalletNumbers() {
                let palletNumbers = []
                this.rows.forEach(function (item) {
                    palletNumbers.push(item['Pallet #'])
                })
                palletNumbers = _.uniq(palletNumbers)
                palletNumbers = _.sortBy(palletNumbers)
                this.palletNumbers = palletNumbers
            },
            getTotalUnits() {
                let totalUnits = []
                this.rows.forEach(function (item) {
                    totalUnits.push(item['Total Units'])
                })
                this.totalUnits = totalUnits.reduce(function (a, b) {
                    return a + b
                }, 0)
            },
            getTotalWeight() {
                let weights = []
                this.rows.forEach(function (item) {
                    weights.push(item['Weight'])
                })
                this.totalWeight = weights.reduce(function (a, b) {
                    return a + b
                }, 0)
            },
            getTotalUnits() {
                let totalUnits = []
                this.rows.forEach(function (item) {
                    totalUnits.push(item['Total Units'])
                })
                totalUnits = totalUnits.reduce((a, b) => a + b)
                this.totalUnits = totalUnits
            },
            getTotalLoose() {
                let totalLoose = []
                this.rows.forEach(function (item) {
                    totalLoose.push(item['QTY(Loose Items)'])
                })
                totalLoose = totalLoose.reduce((a, b) => a + b)
                this.totalLoose = totalLoose
            },
            getTotalMaster() {
                let totalMaster = []
                this.rows.forEach(function (item) {
                    totalMaster.push(item['QTY(Master Cases)'])
                })
                totalMaster = totalMaster.reduce((a, b) => a + b)
                this.totalMaster = totalMaster
            },
            sortBy(key) {
                this.sortKey = key
                this.sortOrders[key] = this.sortOrders[key] * -1
            },
            createSkuGroups() {
                let result = _(this.rows).groupBy(x => x['SKU']).map((value, key) => ({
                    SKU: key,
                    data: value
                })).value()
                let totals = []
                result.forEach(function (item) {
                    let totalUnits = 0
                    let totalLoose = 0
                    let totalMaster = 0
                    let sku = {}
                    let skuNumber = item.SKU
                    let type = item.data[0].Type
                    let description = item.data[0].Description
                    item.data.forEach(function (item) {
                        totalLoose += parseInt(item['QTY(Loose Items)'])
                        totalMaster += parseInt(item['QTY(Master Cases)'])
                        totalUnits += item['Total Units']
                    })
                    sku['SKU'] = skuNumber
                    sku['Description'] = description
                    sku['Type'] = type

                    switch (type) {
                        case 'Cartridge':
                            sku['qty_per_case'] = 50
                            break
                        case 'Starter Kit':
                            sku['qty_per_case'] = 30
                            break
                        case 'Accessories':
                            sku['qty_per_case'] = 50
                            break
                        default:
                            sku['qty_per_case'] = 0
                    }

                    sku['Loose Items'] = totalLoose
                    sku['Master Cases'] = totalMaster
                    sku['Total Units'] = totalUnits
                    totals.push(sku)
                })
                this.totalsArray = totals
                this.$store.commit('totalsArray', this.totalsArray)

            },
            createPalletGroups() {
                let result = _(this.rows).groupBy(x => x['Pallet #']).map((value, key) => ({
                    Pallet: key,
                    data: value
                })).value()
                let totals = []
                result.forEach(function (item) {
                    let weight = 0
                    let pallet = {}
                    let palletNumber = item['Pallet']
                    item.data.forEach(function (item) {
                        weight += item['Weight']
                    })
                    pallet['Pallet #'] = palletNumber
                    pallet['Weight'] = weight
                    totals.push(pallet)
                })
                this.palletWeightArray = totals
            },
            getAirTableData(shipmentNumber) {
                let _self = this

                axios.post('/ExistingList', {
                    shipmentNumber
                }).then(function (response) {
                    //          console.log(JSON.stringify(response.data['LineItems']))
                    _self.airTableData.ShipLog = response.data['shipLog']

                    console.log(_self.airTableData.ShipLog)

                    //           _self.airTableData.shippingLocation = response.data['shippingLocation']

                    _self.airTableData.LineItems = response.data['LineItems']
                    //          console.log(response.data)
                    _self.sortData()
                }).catch(function (error) {
                    console.log(error)
                })
            },
            sortData() {
                let rows = []
                //          console.log('here12')


                this.shipmentStatus = this.airTableData['ShipLog'][0].fields['Status'];

                this.shippingLocation = this.airTableData['ShipLog'][0].fields['ShippingLocationApi']
                this.shipmentDate = this.airTableData['ShipLog'][0].fields['ETD (ex-factory)']

                this.airTableData['LineItems'].forEach(function (item) {
                    let lineItem = {}

                    lineItem['Description'] = item.fields['Item Desc'][0]
                    lineItem['Digi PO'] = item.fields['DigiPOApi'][0]
                    lineItem['Pallet #'] = item.fields['Pallet #']
                    lineItem['QTY(Loose Items)'] = item.fields['Loose Items']
                    lineItem['QTY(Master Cases)'] = item.fields['Full Cases']
                    lineItem['SKU'] = item.fields['SkuApi'][0]
                    lineItem['Total Units'] = item.fields['Total QTY']
                    lineItem['Weight'] = item.fields['WeightApi']
                    //          lineItem['Kanger Invoice Number'] = item.fields['KT Invoice']
                    lineItem['Notes'] = item.fields['NotesApi']
                    lineItem['Type'] = item.fields['TypeApi']
                    lineItem['Lot Number'] = item.fields['LotApi']
                    lineItem['eLiquid Lot Number'] = item.fields['eLiquidLot']

                    rows.push(lineItem)
                })
                let newRows = this.sort_by_key_value(rows, 'Pallet #')
                this.sortedData = newRows
                this.rows = newRows
                this.getDigiPos()
                this.getPalletNumbers()
                this.getTotalUnits()
                this.createSkuGroups()
                this.createPalletGroups()
                this.getTotalWeight()
                this.countPallets()
                //        this.getInvoiceNumbers()
                this.getTotalLoose()
                this.getTotalMaster()
                this.getTotalUnits()
                this.createPoGroups()
            },
            createPdf() {
                let _self = this
                let data = {}
                data.skuPoGroups = this.skuPoGroups
                data.rows = this.rows
                data.shipmentDate = this.shipmentDate
                data.createdOnDate = this.createdOnDate
                data.digiPos = this.digiPos
                //        data.invoiceNumbers = this.invoiceNumbers
                data.totalsArray = this.totalsArray
                data.totalLoose = this.totalLoose
                data.totalMaster = this.totalMaster
                data.totalWeight = this.totalWeight
                data.totalUnits = this.totalUnits
                data.totalUnits = this.totalUnits
                data.shippingLocation = this.shippingLocation
                data.numberOfPallets = this.numberOfPallets

                data.shipmentNumber = this.shipmentNumber

                data.airtableId = this.airTableData.ShipLog[0].id
                data.ktInvoices = this.airTableData.ShipLog[0].fields['KT Invoices']
                data.shipmentStatus = this.airTableData.ShipLog[0].fields.Status
                console.log(data)

                axios.post('/newPdf', {

                    data
                }).then(function (response) {
                    console.log(response)
                    _self.loading = false
                    _self.hideSave = false
                }).catch(function (error) {
                    _self.loading = false
                    _self.hideSave = false
                    console.log(error)
                })
            },
            createPoGroups() {
                let result = _(this.rows).groupBy(x => x['Digi PO']).map((value, key) => ({
                    PO: key,
                    data: value
                })).value()

                //        console.log('result'+result)

                let someArrays = []
                let totals = []
                let newTotals = []

                result.forEach(function (result, index) {
                    //          console.log(result.data)
                    let groupSkus = _(result.data).groupBy(x => x['SKU']).map((value, key) => ({
                        SKU: key,
                        data: value
                    })).value()

                    someArrays[result.PO] = groupSkus
                })

                let finalArray = []

                someArrays.forEach(function (result, key) {
                    let single = {}
                    single.Po = key
                    single.Data = result
                    //          single.po = key

                    finalArray.push(single)
                })
                let singleSkus = []
                let anotherArray = {}
//        let anotherObject = {}
                finalArray.forEach(function (omgPo, key1) {

                    anotherArray[omgPo.Po] = []
//          let myPo = omgPo.Po

//          anotherObject = {'PO': {}}
//          anotherObject.PoNumber = myPo
//          anotherArray
                    omgPo.Data.forEach(function (skuuu) {
                        let totalUnits = 0
                        let totalLoose = 0
                        let totalMaster = 0
                        let sku = {}
                        let skuNumber = skuuu.SKU
                        let type = skuuu.data[0].Type
                        let description = skuuu.data[0].Description

                        skuuu.data.forEach(function (item) {
                            totalLoose += parseInt(item['QTY(Loose Items)'])
                            totalMaster += parseInt(item['QTY(Master Cases)'])
                            totalUnits += item['Total Units']
                        })

                        sku['SKU'] = skuNumber
                        sku['Description'] = description
                        sku['Type'] = type
                        switch (type) {
                            case 'Cartridge':
                                sku['qty_per_case'] = 50
                                break
                            case 'Starter Kit':
                                sku['qty_per_case'] = 30
                                break
                            case 'Accessories':
                                sku['qty_per_case'] = 50
                                break
                            default:
                                sku['qty_per_case'] = 0
                        }
                        sku['Loose Items'] = totalLoose
                        sku['Master Cases'] = totalMaster
                        sku['Total Units'] = totalUnits
//            let evenAnother = omgPo.Po
                        anotherArray[omgPo.Po].push(sku)
//            anotherArray[omgPo.Po].push(sku)
//            anotherObject[evenAnother] = sku
//             anotherArray.push(anotherObject[evenAnother])
                    })
                })
                this.skuPoGroups = anotherArray
            },
            sort_by_key_value(arr, key) {
                return _.sortBy(arr, function (item) {
                    return String(item[key]).toLowerCase();
                });
            }
        },

        mounted() {
            this.getAirTableData(this.$store.state.shipmentToView)
//          debugger
            //        this.createPoGroups();
            //      this.sortData()
            //            this.getDigiPos()
            //            this.getPalletNumbers()
            //            this.getTotalUnits()
            //            this.createSkuGroups()
            //            this.createPalletGroups()
            //            this.getTotalWeight()
            //            this.getInvoiceNumbers()
            //            this.getTotalLoose()
            //            this.getTotalMaster()
            //            this.getTotalUnits()
        }
    }
</script>

<style>

    .dataBlue span {
        color: #00aced;
    }

    .arrow.asc {
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-bottom: 4px solid #31708f;
    }

    .arrow {
        display: inline-block;
        vertical-align: middle;
        width: 0;
        height: 0;
        margin-left: 5px;
        opacity: 0.66;
    }

    .arrow.dsc {
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 4px solid #31708f;
    }

    .summary-headers {
        padding-bottom: 20px;
    }

    .line-items-title {

    }

    th {
        cursor: pointer;
    }

    .summary-buttons a, .summary-buttons button {
        /*margin-top: 16px;*/
    }

    .data {
        color: green;
    }

    .summarySection {
        padding-bottom: 20px;
    }

    .loader {
        margin-top: 10px;
    }

    .v-spinner {
        display: inline-block;
        vertical-align: bottom;
        margin-left: 20px;
        margin-top: 5px;
    }

    .tablemm thead th,
    .tablemm {
        text-align: center !important;
    }

    .router-link {
        padding-left: 5px;
    }

    .last-total {
        padding-bottom: 15px;
    }

    .genPdf:disabled,
    .editBtn:disabled {
        cursor: not-allowed;
    }

    .docs-div{
        margin-bottom:22px;
    }

</style>