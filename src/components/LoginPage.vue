<template lang="pug">
.login-page
    ul.nav.nav-pills.justify-content-center
        li.nav-item
            a.nav-link(@click="goBack", href="#") Back
    h4 Login Page

    .alert.alert-danger(v-show="errorMessage", role="alert") {{ errorMessage }}

    .form-group.row
        label(for="email") Email
        input.form-control(type="email", id="email", v-model="email")
    .form-group.row
        label(for="password") Password
        input.form-control(type="password", id="password", v-model="password")
    .form-group.row
        button.btn.btn-primary(type="button", @click="login") Login

</template>

<script>

import Firebase from 'firebase/app'
import 'firebase/auth'

export default {
    name: 'login-page',
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

        login() {
            this.errorMessage = ''

            Firebase.auth().signInWithEmailAndPassword(this.email, this.password)
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
.login-page {
    max-width: 400px;
    margin: 0 auto;

    button {
        margin: 0 auto;
    }
}
</style>



