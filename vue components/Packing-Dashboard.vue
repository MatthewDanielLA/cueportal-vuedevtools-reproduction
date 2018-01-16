<template xmlns:v-on="http://www.w3.org/1999/xhtml">

    <div class="col-lg-12">
        <div class="card">
            <div class="card-header">
                <i class="fa fa-align-justify"></i>
                Packing List Creation - Dashboard
            </div>
            <div class="card-block">
                <div class="packing-list-dashboard-wrapper">
                    <div class="packing-list-dashboard-new-wrapper">
                    </div>
                    <div class="scroll_table">
                        <table class="table table-bordered table-striped table-condensed table-responsive shipment_table">
                            <thead>
                            <tr>
                                <th v-for="key in columns">
                                    <!--@click="sortBy(key)"-->
                                    <!--:class="{ active: sortKey == key }">-->
                                    {{ key }}
                                    <!--<span class="arrow" :class="ssortOrders[kedy]s > 0 ? 'asc' : 'dsc'"></span>-->
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="shipment in shipmentList">
                                <td class="shipmentNumberTd shipListTd">
                                    <a href="javascript:void(0)" @click="viewShipment(shipment.fields['Ship Ref#'])">{{shipment.fields['Ship Ref#']}}</a>
                                </td>
                                <td class="shipListTd">{{shipment.fields['Status']}}</td>
                                <td class="shipListTd">{{shipment.fields['location']}}</td>
                                <td class="shipListTd">{{shipment.fields['totalUnitsApi']}}</td>
                                <td class="shipListTd"><span v-for="(n, index) in shipment.fields['DigiPosApi']"><span>{{n}}</span><span
                                        v-if="(!(index - 1 < shipment.fields['DigiPosApi']) && index + 1 !== shipment.fields['DigiPosApi'].length)">, </span></span>
                                </td>
                                <td class="shipListTd">{{shipment.fields['Airway Bill']}}</td>
                                <td class="shipListTd">
                                    <a v-if="shipment.fields['Packing List Doc']" target="_blank"
                                       v-bind:href="''+shipment.fields['Packing List Doc'][0].url+''">Packing List</a>
                                    <span v-if="!shipment.fields['Packing List Doc']">Packing List </span>
                                    <span class="seper">|</span>
                                    <a class="invoice" target="_blank" v-if="shipment.fields['Commercial Invoice Doc']"
                                       v-bind:href="''+shipment.fields['Commercial Invoice Doc'][0].url+''"> Commercial
                                        Invoice</a>
                                    <span class="invoice" v-if="!shipment.fields['Commercial Invoice Doc']"> Commercial Invoice</span>
                                </td>
                            </tr>

                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="packing-list-dashboard-new-wrapper">
                    <p class="packing-list-blurb">Generate new packing lists by clicking the "Create" button, if you
                        don't see a newly created shipment click refresh:</p>
                    <router-link to="/Packing" role="button" class="btn btn-primary">Create</router-link>
                    <a class="md-reload" href="javascript:void(0)" @click=" reloadShipments()">Reload Shipments</a>
                </div>
            </div>
        </div>
    </div>

</template>

<script>

    // Comment
    export default {
        data() {
            return {
                shipmentList: [],
                //         shipmentToView : ''
                columns: ['Shipment #', 'Status', 'Destination', 'Total Items', 'Dig Po#s', 'Airway Bill', 'Shipping Documents'],
            }
        },
        computed: {
            shipmentToView: {
                get: function () {
                    return this.$store.state.shipmentToView
                },
                set: function () {
                    this.shipmentNumber = this.$store.state.shipmentNumber
                }
            },
            vendorInvoices() {
                return this.$store.state.vendorInvoices
            }
        },
        mounted() {
            this.getVendorInvoices()
            this.getShipmentList()
        },
        methods: {
            getVendorInvoices() {
                let _self = this
                axios.get('VendorInvoices').then(function (response) {
                    console.log(response.data)
//                   console.log(error)
                    _self.$store.commit('vendorInvoices', response.data)
                }).catch(function (error) {
                  console.log('test')
                    console.log(error)
                })
            },
            checkVendorInvoiceDocs(vendorInvoiceId) {

            },
            getShipmentList() {
                let _self = this
                axios.get('ShipmentGrid').then(function (response) {
                    // console.log(response.data)

                    let result = response.data.map(function (shipment) {

                        let newItem = shipment

                        let location = shipment.fields.ShippingLocationApi[0]
                        newItem.fields.location = location

                        let vendorInvoices = []

                        if(shipment.fields['Vendor Invoices']) {
                            let invoiceIds = shipment.fields['Vendor Invoices']
                            invoiceIds.forEach(function (value) {
                                let singleInvoice;
                                console.log(_self.vendorInvoices)
                                let index = _.findIndex(_self.vendorInvoices, function (record) {
                                    return record.id == value
                                })
                                // use the index to pluck the vendor invoice table line and assign to an object in the vendor invoicesArray
                                console.log(index)
                            })

                            console.log(invoiceIds)
                        }
                        return newItem
                    })

                    result = _.sortBy(result, 'createdTime')

                    _self.shipmentList = result
                })
            },
            viewShipment(shipmentNumber) {
                this.$store.commit('shipmentToView', shipmentNumber)
                this.$router.push('/Existing-Summary')
            },
            reloadShipments() {
                this.getShipmentList()
            },
            sortPos() {

            }
        }
    }
</script>


<style>
    .shipListTd {
        vertical-align: middle !important;
    }

    .shipmentNumberTd {

        font-weight: bold;
    }

    .shipment_table td {
        padding-left: 35px;
        padding-right: 35px;
    }

    .shipment_table {
        width: auto;
        text-align: center !important;
    }

    .shipment_table thead tr th {
        text-align: center;
    }

    .scroll_table {
        display: inline-block;
    }

    .md-reload {
        font-size: 0.875rem;
        margin-left: 15px;
    }
</style>

