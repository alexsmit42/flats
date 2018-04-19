
<script>

import { Line, mixins } from 'vue-chartjs'

export default {
    name: 'history-chart',
    extends: Line,
    props: ['chartData', 'options'],
    mixins: [mixins.reactiveProp],
    mounted () {
        this.renderChart(this.chartData, this.options)
    },
    watch: {
        chartData() {
            this.renderChart(this.chartData, this.options)
        }
    }
}
</script>

