<template lang="pug">
.district-page
    table.table.table-sm(v-if="districts.length")
        thead
            tr
                th {{ $t('districts.district') }}
                th {{ $t('flats.totalFlats') }}
                th {{ $t('flats.oneRoom') }}
                th {{ $t('flats.twoRoom') }}
                th {{ $t('flats.avgPrice') }}, {{ getCurrencyMark() }}
                th {{ $t('flats.medianPrice') }}, {{ getCurrencyMark() }}
                th {{ $t('districts.avgArea') }}, {{ $t('flats.m2') }}
                th {{ $t('flats.avgMeter') }}/{{ $t('flats.m2') }}
        tbody
            tr(v-for="district in districts")
                td
                    a(:href="district.url", target="_blank") {{ district.title }}
                td 
                    span {{ district.total }}
                td 
                    span {{ district.rooms[1] }}
                td
                    span {{ district.rooms[2] }}
                td 
                    span {{ getPrice(district.avgPrice) | price }} 
                td
                    span {{ getPrice(district.medianPrice) | price }} 
                td 
                    span {{ district.avgArea }}
                td 
                    span {{ getPrice(district.avgMeter) | price }}
</template>

<script>

import CurrencyMixin from './mixins/CurrencyMixin'

import axios from 'axios'

export default {
    metaInfo() {
        return {
            title: this.$i18n.t('menu.districts'),
        }
    },
    data() {
        return {
            districts: []
        }
    },
    mixins: [CurrencyMixin],
    mounted() {
        this.getDistricts()
    },
    methods: {
        getDistricts() {
            axios.get('/api/districts/stat', {}).then(res => {
                this.districts = res.data.districts
            })
        }
    }
}
</script>

<style lang="scss">

</style>

