<template lang="pug">
.district-change
    .form-group.row
        label.col-sm-4.col-form-label {{ $t('districts.chooseDistrict') }}:
        .col-sm-8
            select.form-control(v-model="currentDistrict")
                option(v-for="district in districts", :value="district._id") {{ district.title }}
</template>

<script>
import axios from 'axios'

export default {
    name: 'district-change',
    data() {
        return {
            districts: [],
            currentDistrict: ''
        }
    },
    mounted() {
        let storageDistrict = localStorage.getItem('district')

        if (storageDistrict) {
            this.currentDistrict = storageDistrict
        }

        this.getDistricts()
    },
    watch: {
        currentDistrict() {
            localStorage.setItem('district', this.currentDistrict)
            this.changeDistrict()
        }
    },
    methods: {
        getDistricts() {
            axios.get('/api/districts/stat', {}).then(res => {
                this.districts = res.data.districts

                if (!this.currentDistrict) {
                    this.currentDistrict = this.districts[0]._id
                }
            })
        },
        changeDistrict() {
            this.$emit('changeDistrict', this.currentDistrict)
        }
    }
}
</script>

<style lang="scss">
.district-change {
    margin: 20px auto;
    width: 600px;

    select {
        font-weight: bold;
    }
}
</style>


