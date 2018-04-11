<template lang="pug">
.flats-page
    h4 {{ day }}

    .total-line(v-if="total") Total: {{ total }}

    .filter-block.form-inline(v-if="flats.length")
        .filter-item
            span.label Rooms:
            span.filter
                select.form-control(v-model="filters.rooms")
                    option(value="0") All
                    option(value="1") 1-room
                    option(value="2") 2-room
        .filter-item
            span.label Price:
            span.filter
                input.form-control(v-model="filters.minPrice", type="text", maxlength="5", placeholder="From, zł") 
                span.separator -
                input.form-control(v-model="filters.maxPrice", type="text", maxlength="5", placeholder="To, zł")
        .filter-item
            span.label Area:
            span.filter
                input.form-control(v-model="filters.minArea", type="text", maxlength="3", placeholder="From, m2") 
                span.separator -
                input.form-control(v-model="filters.maxArea", type="text", maxlength="3", placeholder="To, m2")
        .filter-item
            span.label Days:
            span.filter
                select.form-control(v-model="filters.days")
                    option(value="0") All
                    option(value="1") up to 1 day
                    option(value="2") up to 2 days
                    option(value="3") up to 3 days
                    option(value="4") up to 4 days
                    option(value="5") up to 5 days
                    option(value="6") up to 6 days
                    option(value="7") up to 7 days
        .filter-item
            span.label On page:
            span.filter
                select.form-control(v-model="perPage")
                    option(value="20") 20
                    option(value="50") 50
                    option(value="100") 100
        .filter-item
            button.btn.btn-outline-dark(type="button", @click="defaultFilters") Reset filters

    flats-list(:flats="showFlats", :order="order", :type="'flats'", @changeOrder="changeOrder")

    pagination-block(v-if="pageCount", :pageCount="pageCount", :currentPage="page", @goPage="goPage")
</template>

<script>

import axios from 'axios'

import FlatsList from './partial/FlatsList.vue'
import PaginationBlock from './partial/PaginationBlock.vue'

export default {
    name: 'flats-page',
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
        PaginationBlock
    },
    created() {
        this.defaultFilters()
        this.getFlats()
    },
    computed: { 
        showFlats() {
            let flats = this.filterFlats()
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
        getFlats() {
            if (Object.keys(this.$store.state.flats).length) {
                this.flats = this.$store.state.flats
                this.day = this.$store.state.lastDay
                this.$forceUpdate
            } else {
                axios.get('/api/flats', {}).then(res => {
                    this.day = res.data.lastDay
                    this.flats = res.data.flats

                    this.$store.commit('updateFlats', res.data)
                    this.$forceUpdate
                })
            }
        },
        goPage(page) {
            this.page = page
        },
        filterFlats() {
            let flats = this.flats.slice(0)

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
        changeOrder(field) {
            if (this.order.field === field) {
                this.order.asc = !this.order.asc
            } else {
                this.order.asc = true
            }
            this.order.field = field;

            this.$forceUpdate()
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


