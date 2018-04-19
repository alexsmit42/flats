module.exports = {
    data: () => {
        return {
            currencyMarks: {
                'PLN': 'zł',
                'RUB': '₽'
            }
        }
    },
    methods: {
        getPrice(price) {
            let currency = this.$store.state.currentCurrency
            let coeff = this.$store.state.currencies[currency]

            return parseInt(price * coeff)
        },

        getCurrencyMark() {
            let currency = this.$store.state.currentCurrency
            return this.currencyMarks[currency]
        },
    },
    filters: {
        price(value) {
            // return value.toString().replace(/(\d)(?=(\d{3})+\.)/g, '$1 ');
            return value.toLocaleString();
        }
    }
}