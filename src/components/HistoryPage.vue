<template lang="pug">
.history-page
    .filter-chart(v-if="chartData.labels.length")
        .form-check.form-check-inline
            input.form-check-input(type="radio", id="avgChart", value="avg", v-model="chartField")
            label.form-check-label(for="avgChart") {{ $t('flats.avgPrice') }}
        .form-check.form-check-inline
            input.form-check-input(type="radio", id="medianChart", value="median", v-model="chartField")
            label.form-check-label(for="medianChart") {{ $t('flats.medianPrice') }}
        .form-check.form-check-inline
            input.form-check-input(type="radio", id="oneRoomChart", value="oneRoom", v-model="chartField")
            label.form-check-label(for="oneRoomChart") {{ $t('flats.oneRoomPrice') }}
        .form-check.form-check-inline
            input.form-check-input(type="radio", id="twoRoomChart", value="twoRoom", v-model="chartField")
            label.form-check-label(for="twoRoomChart") {{ $t('flats.twoRoomPrice') }}

    .chart-block
        history-chart(v-if="chartData.labels.length", :chartData="chartData", :options="chartOptions")

    table.table.table-sm(v-if="showDays.length")
        thead
            tr
                th {{ $t('flats.date') }}
                th {{ $t('flats.totalFlats') }}
                th {{ $t('flats.rooms') }}
                th {{ $t('flats.avgPrice') }}, zł
                th {{ $t('flats.medianPrice') }}, zł
                th {{ $t('flats.avgMeter') }}/{{ $t('flats.m2') }}
        tbody
            tr(v-for="day, index in showDays")
                td {{ day.date }}
                td 
                    span {{ day.count }}
                td 
                    div 1 - 
                        span.one-room {{ day.rooms[1].count }} 
                        .
                            , 2 - 
                        span.two-room {{ day.rooms[2].count }}
                td 
                    div 
                        span.value(:class="diffValue(index, 'avgPrice')") {{ day.avgPrice }} 
                        span ( 
                        span 1:&nbsp; 
                        strong {{ day.rooms[1].avgPrice }} 
                        span &nbsp; 
                        span 2:&nbsp; 
                        strong {{ day.rooms[2].avgPrice }} 
                        span )
                td
                    div 
                        span.value(:class="diffValue(index, 'medianPrice')") {{ day.medianPrice }} 
                td 
                    span.value(:class="diffValue(index, 'avgMeter')") {{ day.avgMeter }}
</template>

<script>

import HistoryChart from './partial/HistoryChart.vue'

import axios from 'axios'

export default {
    name: 'history-page',
    metaInfo() {
        return {
            title: this.$i18n.t('menu.history'),
        }
    },
    data() {
        return {
            days: [],
            chartValues: {
                labels: [],
                datasets: []
            },
            chartOptions: {responsive: true, maintainAspectRatio: false, scales: {}},
            chartField: 'avg'
        }
    },
    components: {
        HistoryChart
    },
    created() {
        this.getDays()
    },
    computed: {
        showDays() {
            let keys = Object.keys(this.days).sort()
            let showDays = []

            showDays = keys.map((key) => {
                let flats = this.days[key];

                let totals = flats.reduce((totals, flat) => {
                    totals.count++
                    totals.price += flat.price
                    totals.area += flat.area
                    totals.meter += Math.round(flat.price / flat.area * 100) / 100
                    totals.prices.push(flat.price)

                    totals.rooms[flat.rooms].count++
                    totals.rooms[flat.rooms].price += flat.price
                    totals.rooms[flat.rooms].area += flat.area

                    return totals
                }, {
                    count: 0,
                    price: 0,
                    area: 0,
                    meter: 0,
                    prices: [],
                    rooms: {
                        1: {
                            count: 0,
                            price: 0,
                            area: 0,
                            avgPrice: 0
                        },
                        2: {
                            count: 0,
                            price: 0,
                            area: 0,
                            avgPrice: 0
                        }
                    }
                })

                let avgPrice = Math.round(totals.price / totals.count)
                let avgMeter = Math.round(totals.meter / totals.count * 100) / 100
                let medianPrice = this.getMedian(totals.prices)
                
                totals.rooms[1].avgPrice = Math.round(totals.rooms[1].price / totals.rooms[1].count)
                totals.rooms[2].avgPrice = Math.round(totals.rooms[2].price / totals.rooms[2].count)

                return {
                    date: key,
                    avgPrice,
                    avgMeter,
                    medianPrice,
                    count: totals.count,
                    rooms: totals.rooms
                }
            })

            if (!this.chartValues.labels.length) {
                this.generateChartData(showDays)
            }

            return showDays.reverse()
        },
        chartData() {
            let chartData = {
                labels: this.chartValues.labels,
                datasets: [this.chartValues.datasets[this.chartField]]
            }

            if (chartData.datasets[0] !== undefined) {
                let {min, max} = chartData.datasets[0].data.reduce((minMax, value) => {
                    if (value < minMax.min) {
                        minMax.min = value
                    }
    
                    if (value > minMax.max) {
                        minMax.max = value
                    }

                    return minMax
                }, {min: 10000, max: 0});
    
                let diff = parseInt((max - min) / 5)
    
                this.chartOptions.scales = {
                    yAxes: [{
                        ticks: {
                            min: min - diff,
                            max: max + diff
                        }
                    }]
                }
            }

            return chartData
        }
    },
    methods: {
        getDays() {
            if (Object.keys(this.$store.state.days).length) {
                this.days = this.$store.state.days
                this.$forceUpdate
            } else {
                axios.get('/api/days', {}).then(res => {
                    this.days = res.data.days
                    this.$store.commit('updateDays', this.days)
                    this.$forceUpdate
                })
            }
        },
        diffValue(index, value) {
            if (this.showDays[index + 1] !== undefined) {
                let curValue = this.showDays[index][value]
                let prevValue = this.showDays[index + 1][value]

                if (curValue > prevValue) {
                    return 'up'
                } else if (curValue < prevValue) {
                    return 'down'
                }
            }

            return ''
        },
        getMedian(arr) {
            arr = arr.sort()
            let length = arr.length
            let median = 0;
            if (length % 2 === 0) {
                let centerIndex = length / 2
                median = (arr[centerIndex] + arr[centerIndex + 1]) / 2
            } else {
                let centerIndex = (length + 1) / 2
                median = arr[centerIndex]
            }

            return Math.round(median * 10) / 10
        },
        generateChartData(days, field = false) {
            let labels = days.map(day => day.date)
            let values = days.reduce((values, day) => {
                values.avg.push(day.avgPrice)
                values.median.push(day.medianPrice)
                values.oneRoom.push(day.rooms[1].avgPrice)
                values.twoRoom.push(day.rooms[2].avgPrice)

                return values
            }, {
                'avg': [],
                'median': [],
                'oneRoom': [],
                'twoRoom': []
            })

            this.chartValues = {
                labels: labels,
                datasets: {
                    'avg': {
                        label: this.$i18n.t('flats.avgPrice'),
                        borderColor: '#020263',
                        data: values.avg
                    },
                    'median': {
                        label: this.$i18n.t('flats.medianPrice'),
                        borderColor: '#523c0f',
                        data: values.median
                    },
                    'oneRoom': {
                        label: this.$i18n.t('flats.oneRoomPrice'),
                        borderColor: '#681212',
                        data: values.oneRoom
                    },
                    'twoRoom': {
                        label: this.$i18n.t('flats.twoRoomPrice'),
                        borderColor: '#14380f',
                        data: values.twoRoom 
                    }
                }
            }
        }
    }
}
</script>

<style lang="scss">
.history-page {

    .filter-chart {
        margin: 20px 0;
    }

    .chart-block {
        max-width: 1000px;
        margin: 20px auto 30px;
    }

    table {
        .one-room {
            color: darkblue;
            font-weight: bold;
        }

        .two-room {
            color: darkmagenta;
            font-weight: bold;
        }

        .value {
            color: #424040;
            font-weight: bold;
        }

        .up {
            color: darkred;
        }

        .down {
            color: green;
        }
    }
}
</style>


