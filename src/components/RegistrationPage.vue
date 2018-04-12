<template lang="pug">
.registration-page
    ul.nav.nav-pills.justify-content-center
        li.nav-item
            a.nav-link(@click="goBack", href="#") {{ $t('back') }}

    h4 {{ $t('auth.registrationPage') }}

    .alert.alert-danger(v-show="errorMessage", role="alert") {{ errorMessage }}

    .form-group.row
        label(for="email") {{ $t('auth.email') }}
        input.form-control(type="email", id="email", v-model="email")
    .form-group.row
        label(for="password") {{ $t('auth.password') }}
        input.form-control(type="password", id="password", v-model="password")
    .form-group.row
        button.btn.btn-primary(type="button", @click="registration") {{ $t('auth.registration') }}
</template>

<script>

import Firebase from 'firebase/app'
import 'firebase/auth'

export default {
    name: 'registration-page',
    data() {
        return {
            email: '',
            password: '',
            errorMessage: ''
        }
    },
    methods: {
        goBack() {
            this.$router.go(-1)
        },

        registration() {
            this.errorMessage = ''

            Firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
            .then(
                user => {
                    this.$router.replace('admin');
                },
                error => {
                    this.errorMessage = error.message
                }
            )
        }
    }
}
</script>

<style lang="scss">
.registration-page {
    max-width: 400px;
    margin: 0 auto;

    button {
        margin: 0 auto;
    }
}
</style>
