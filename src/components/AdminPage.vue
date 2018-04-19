<template lang="pug">
.admin-page
    h4 {{ $t('districts.list') }}

    ul.districts-list.list-group
        li.list-group-item(v-for="district in districts")
            a(:href="district.url", target="_blank") {{ district.title }}
    
    .district-form
        h4 {{ $t('districts.add') }}

        .alert.alert-danger(v-show="errorMessage", role="alert") {{ errorMessage }}

        .form-group.row
            label(for="title") {{ $t('districts.district') }}
            input.form-control(type="text", id="title", v-model="title")
        .form-group.row
            label(for="url") {{ $t('districts.url') }}
            input.form-control(type="text", id="url", v-model="url")
        .form-group.row
            button.btn.btn-primary(type="button", @click="newDistrict") {{ $t('add') }}
</template>

<script>

import axios from 'axios'

export default {
    metaInfo() {
        return {
            title: this.$i18n.t('menu.admin'),
        }
    },
    data() {
        return {
            districts: [],
            title: '',
            url: '',
            errorMessage: ''
        }
    },
    mounted() {
        this.getDistricts()
    },
    methods: {
        getDistricts() {
            axios.get('/api/districts', {}).then(res => {
                this.districts = res.data.districts
            })
        },

        newDistrict() {
            if (!this.title.trim().length || !this.url.trim().length) {
                this.errorMessage = this.$i18n.t('errors.emptyFields')
                return
            }

            axios.post('/api/district', {title: this.title.trim(), url: this.url.trim()}).then(res => {
                if (res.data.success) {
                    this.districts.push({title: this.title, url: this.url})
                    this.title = ''
                    this.url = ''
                } else {
                    this.errorMessage = this.$i18n.t('errors.somethingWrong')
                }
            })
        }
    }
}
</script>

<style lang="scss">
.admin-page {
    max-width: 400px;
    margin: 0 auto;

    .district-form {
        margin: 30px 0 20px;
    }
}
</style>


