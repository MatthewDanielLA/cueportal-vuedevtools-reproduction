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
                        <h6 class="summary-header dataBlue">Shipment Number: <span class="data">{{shipmentNumber}}</span></h6>
                        <h6 class="summary-header dataBlue">Related Dig PO Number(s): <span class="data"
                                                                                   v-for="(n, index) in digiPos"><span>{{n}}</span><span
                                v-if="index+1 < digiPos.length">, </span></span></h6>
                        <h6 class="summary-header dataBlue">Expected Ship Date: <span class="data"> {{shipmentDate}}</span></h6>
                        <!--<h6 class="summary-header">KangerTech Invoice Number: <span class="data"> {{shipmentNumber}}</span></h6>-->
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
                                <td>{{row['Lot Number']}}</td>
                                <td>{{row['eLiquid Lot Number']}}</td>
                                <td>{{row['Notes']}}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="summarySection">
                        <div class="line-items-title">
                            <h6 class="line-items-header">Totals by SKU:</h6>
                        </div>
                        <table class="table table-bordered table-striped table-condensed table-responsive">
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
                        <table class="table table-bordered table-striped table-condensed table-responsive">
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
                        <h6 class="pallets-used">Pallet Number(s): <span class="data"
                                                                         v-for="(pallet, index) in palletNumbers"><span>{{pallet}}</span><span
                                class="data" v-if="index+1 < palletNumbers.length">,  </span></span></h6>
                        <h6 class="summary-total">Total Weight: <span class="data">{{totalWeight}}kg</span></h6>
                        <h6 class="summary-total">Total Units: <span class="data">{{totalUnits}}</span></h6>
                    </div>
                    <div class="summary-buttons">
                        <!--<button to="/Packing" role="button" class="btn btn-primary" :disabled="saveClicked">Edit</button>-->
                        <button v-if="hideSave==false" type="button" class="btn btn-primary" @click="editData"
                                :disabled="saveClicked">Edit
                        </button>
                        <button v-if="hideSave==false" type="button" class="btn btn-primary" @click="saveData"
                                :disabled="saveClicked">Save
                        </button>

                        <pulse-loader :loading="loading" :color="color" :size="size"></pulse-loader>
                        <div class="summary-buttons">
                            <!--<button v-if="pdfDone" type="button" class="btn btn-primary" @click="downloadPdf">Download PDF</button>-->
                        </div>
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
            let columns = ['Pallet', 'Dig PO', 'SKU', 'Description', 'Master Cases', 'Loose Items', 'Total Units', 'Lot', 'eLiquid Lot', 'Notes']
            let skuColumns = ['SKU', 'Description', 'Master Cases', 'Loose Items', 'Total Units']
            let palletColumns = ['Pallet', 'Weight']
            columns.forEach(function (key) {
                sortOrders[key] = 1
            })
            return {
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
                test: 'sds'
            }
        },
        computed: {
            rows() {
                let oldRows = this.$store.state.rows
                // return this.$store.state.rows
                return this.sort_by_key_value(oldRows,'Pallet #')
            },

            shipmentDate() {
                return this.$store.state.date.time
            },
            createdOnDate() {
                return this.$store.state.currentDate
            },
            shippingLocation() {
                return this.$store.state.shippingLocation
            },
            shipmentNumber: {
                get: function () {
                    return this.$store.state.shipmentNumber
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
                'digiPos',
                'resetState'
            ]),
            sort_by_key_value(arr, key) {
                return _.sortBy(arr, function (item) {
                    return String(item[key]).toLowerCase();
                });
            },
            makePdf(data) {
                //        let data = this.rows
                axios.post('/pdf-test', {
                    data
                }).then(function (response) {
                    //          console.log(response)
                }).catch(function (error) {
                    console.log(error)
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
            },
            //      getInvoiceNumbers () {
            //        let invoiceNumbers = []
            //        this.rows.forEach(function (item) {
            //          invoiceNumbers.push(item['Kanger Invoice Number'])
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
                    let description = item.data[0].Description
                    item.data.forEach(function (item) {
                        totalLoose += parseInt(item['QTY(Loose Items)'])
                        totalMaster += parseInt(item['QTY(Master Cases)'])
                        totalUnits += item['Total Units']
                    })
                    sku['SKU'] = skuNumber
                    sku['Description'] = description
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
            downloadPdf() {
                //        let url = 'http://portal.cuevapor.com/' + this.pdfPath
                let url = 'https://s3.amazonaws.com/cue-ops/shipment-docs/28/packing_list_' + this.$store.state.shipmentNumber + '.pdf'
                window.open(url)
            },
            editData() {
                this.$router.push('/Packing')
            },
            saveData() {
                let _self = this
                let data = {}
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
                data.shippingLocation = this.shippingLocation

                this.hideSave = true
                this.saveClicked = true
                this.loading = true
                axios.post('/air', {

                    data
                }).then(function (response) {
                    //          console.log(response)
                    _self.pdfPath = response.data
                    _self.loading = false
                    _self.hideSave = false
                    _self.pdfDone = true
                    _self.$store.commit('resetState')

                    console.log(_self.$store.state.rows)

                    _self.$router.push('/')

                }).catch(function (error) {
                    _self.loading = false
                    _self.hideSave = false
                    console.log(error)
                })

            },
            //      createSkuGroups (shipment_items) {
            //        let result = _(shipment_items).groupBy(x => x['Digi PO']).map((value, key) => ({
            //          PO: key,
            //          data: value
            //        })).value()
            //        let totals = []
            //        result.forEach(function (item) {
            //          let skuArray = {}
            //          let skuNumbers = []
            //          item.data.forEach(function (sku) {
            //            let sku1 = sku.SKU
            //            skuNumbers.push(sku1)
            //          })
            //          skuArray.PO = item.PO
            //          skuArray.skus = _.uniq(skuNumbers)
            //          totals.push(skuArray)
            //        })
            //      return totals
            //      },
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
                let description = item.data[0].Description
                item.data.forEach(function (item) {
                    totalLoose += parseInt(item['QTY(Loose Items)'])
                    totalMaster += parseInt(item['QTY(Master Cases)'])
                    totalUnits += item['Total Units']
                })
                sku['SKU'] = skuNumber
                sku['Description'] = description
                sku['Loose Items'] = totalLoose
                sku['Master Cases'] = totalMaster
                sku['Total Units'] = totalUnits
                totals.push(sku)
            })
            this.totalsArray = totals
            this.$store.commit('totalsArray', this.totalsArray)

        },
        mounted() {
            //      ssthis.getShipmentNumber()s
            this.getDigiPos()
            this.getPalletNumbers()
            this.getTotalUnits()
            this.createSkuGroups()
            this.createPalletGroups()
            this.getTotalWeight()
            //      this.getInvoiceNumbers()
            this.getTotalLoose()
            this.getTotalMaster()
            this.getTotalUnits()
            //      this.createSkuPo()
        }
    }
</script>

<style>
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
        margin-top: 16px;
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

</style>