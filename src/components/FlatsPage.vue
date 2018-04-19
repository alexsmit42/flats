<template lang="pug">
.flats-page
    h4 {{ day }}

    district-change(@changeDistrict="changeDistrict")

    .total-line(v-if="total") {{ $t('flats.total') }}: {{ total }}

    .filter-block.form-inline(v-if="flats.length")
        .filter-item
            span.label {{ $t('flats.rooms') }}:
            span.filter
                select.form-control(v-model="filters.rooms")
                    option(value="0") {{ $t('flats.all') }}
                    option(value="1") {{ $t('flats.oneRoom') }}
                    option(value="2") {{ $t('flats.twoRoom') }}
        .filter-item
            span.label {{ $t('flats.price') }}:
            span.filter
                input.form-control(v-model="filters.minPrice", type="text", maxlength="5", :placeholder="$i18n.t('flats.from') + ' ' + getCurrencyMark()") 
                span.separator -
                input.form-control(v-model="filters.maxPrice", type="text", maxlength="5", :placeholder="$i18n.t('flats.to') + ' ' + getCurrencyMark()")
        .filter-item
            span.label {{ $t('flats.area') }}:
            span.filter
                input.form-control(v-model="filters.minArea", type="text", maxlength="3", :placeholder="$i18n.t('flats.from') + ', m2'") 
                span.separator -
                input.form-control(v-model="filters.maxArea", type="text", maxlength="3", :placeholder="$i18n.t('flats.to') + ', m2'")
        .filter-item
            span.label {{ $t('flats.days') }}:
            span.filter
                select.form-control(v-model="filters.days")
                    option(value="0") {{ $t('flats.all') }}
                    option(value="1") {{ $t('flats.upTo._1') }}
                    option(value="2") {{ $t('flats.upTo._2') }}
                    option(value="3") {{ $t('flats.upTo._3') }}
                    option(value="4") {{ $t('flats.upTo._4') }}
                    option(value="5") {{ $t('flats.upTo._5') }}
                    option(value="6") {{ $t('flats.upTo._6') }}
                    option(value="7") {{ $t('flats.upTo._7') }}
        .filter-item
            span.label {{ $t('flats.onPage') }}:
            span.filter
                select.form-control(v-model="perPage")
                    option(value="20") 20
                    option(value="50") 50
                    option(value="100") 100
        .filter-item
            button.btn.btn-outline-dark(type="button", @click="defaultFilters") {{ $t('flats.resetFilters') }}

    flats-list(:flats="showFlats", :order="order", :type="'flats'", @changeOrder="changeOrder")

    pagination-block(v-if="pageCount", :pageCount="pageCount", :currentPage="page", @goPage="goPage")
</template>

<script>

import CurrencyMixin from './mixins/CurrencyMixin'

import axios from 'axios'

import DistrictChange from './partial/DistrictChange.vue'
import FlatsList from './partial/FlatsList.vue'
import PaginationBlock from './partial/PaginationBlock.vue'

export default {
    name: 'flats-page',
    metaInfo() {
        return {
            title: this.$i18n.t('menu.flats'),
        }
    },
    data() {
        return {
            day: '',
            flats: [],
            perPage: 50,
            page: 1,
            filters: {},
            order: {},
            pageCount: 0,
            total: 0
        }
    },
    components: {
        FlatsList,
        PaginationBlock,
        DistrictChange
    },
    mixins: [CurrencyMixin],
    created() {
        this.defaultFilters()
        // this.getFlats()
    },
    computed: { 
        showFlats() {
            let flats = this.flats.map(flat => {
                let newFlat = Object.assign({}, flat)

                newFlat.price = this.getPrice(flat.price)
                newFlat.meter = this.getPrice(flat.meter)

                return newFlat
            })

            flats = this.filterFlats(flats)
            flats = this.sortBy(flats, this.order)

            this.pageCount = 0
            if (flats.length) {
                this.pageCount = parseInt((flats.length - 1) / this.perPage) + 1
            }

            this.total = flats.length

            let startIndex = (this.page - 1) * this.perPage
            flats = flats.slice(startIndex, startIndex + this.perPage)

            return flats
        }
    },
    methods: {
        changeOrder(field) {
            if (this.order.field === field) {
                this.order.asc = !this.order.asc
            } else {
                this.order.asc = true
            }
            this.order.field = field;

            this.$forceUpdate()
        },
        filterFlats(flats) {
            for(let i in this.filters) {
                if (this.filters[i]) {
                    this.filters[i] = parseInt(this.filters[i])
                }
            }

            if (this.filters.rooms) {
                flats = flats.filter(flat => flat.rooms === this.filters.rooms)
            }

            if (this.filters.minPrice) {
                flats = flats.filter(flat => flat.price > this.filters.minPrice)
            }

            if (this.filters.maxPrice) {
                flats = flats.filter(flat => flat.price < this.filters.maxPrice)
            }

            if (this.filters.minArea) {
                flats = flats.filter(flat => flat.area > this.filters.minArea)
            }

            if (this.filters.maxArea) {
                flats = flats.filter(flat => flat.area < this.filters.maxArea)
            }

            if (this.filters.days) {
                flats = flats.filter(flat => flat.days <= this.filters.days)
            }

            return flats
        },
        getFlats(district) {
            // if (Object.keys(this.$store.state.flats).length) {
            //     this.flats = this.$store.state.flats
            //     this.day = this.$store.state.lastDay
            //     this.$forceUpdate
            // } else {
                axios.get('/api/flats', {params: {district}}).then(res => {
                    this.day = res.data.lastDay
                    this.flats = res.data.flats

                    // this.$store.commit('updateFlats', res.data)
                    this.$forceUpdate
                })
            // }
        },
        goPage(page) {
            this.page = page
        },
        sortBy(data, order) {
            function compare(a, b) {
                let compare = 1;

                if (parseFloat(a[order.field]) > parseFloat(b[order.field])) {
                    compare = -1;
                }

                if (order.asc) {
                    compare *= -1;
                }

                return compare;
            }

            data.sort(compare)

            return data
        },
        defaultFilters() {
            this.filters = {
                rooms: 0,
                minPrice: '',
                maxPrice: '',
                minArea: '',
                maxArea: '',
                days: 0
            }

            this.order = {
                field: 'title',
                asc: true
            }
        },
        changeDistrict(district) {
            this.getFlats(district)
        }
    }
}
</script>

<style lang="scss">
.flats-page {
    margin: 20px;

    .total-line {
        text-align: left;
    }

    .filter-block {
        display: flex;
        justify-content: space-around;
        margin: 20px 0 10px;

        .filter-item {
            margin: 10px 20px 10px 0;

            .label {
                margin-right: 10px;
                font-weight: bold;
            }

            input {
                width: 100px;
            }
        }

        .separator {
            padding: 0 10px;
        }
    }
}
</style>


