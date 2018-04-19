<template lang="pug">
#app

    .menu-user
        .menu-lang
            .lang-item(
                v-for="locale in locales", 
                :class="{'active': locale === currentLocale}", 
                :title="$i18n.t(`menu.locale.${locale}`)",
                @click="changeLocale(locale)"
            )
                img(:src="`assets/flags/${locale}.png`")

        .menu-currency
            .currency-item(
                v-for="currency in currencies",
                :class="{'active': currency === currentCurrency}",
                :title="$i18n.t(`currency.${currency}`)",
                @click="changeCurrency(currency)"
            ) {{ currency }}

        ul.menu-auth.nav.nav-pills.justify-content-center
            template(v-if="user")
                li.nav-item 
                    a.nav-link {{ user.email }}
                li.nav-item
                    a.nav-link(@click="logout", href="#") {{ $t('auth.logout') }}
            template(v-else)
                li.nav-item
                    router-link(to="/login", class="nav-link") {{ $t('auth.login') }}
                li.nav-item
                    router-link(to="/registration", class="nav-link") {{ $t('auth.registration') }}
        

    ul.menu.nav.nav-pills.justify-content-center(v-show="isShowMenu")
        li.nav-item
            router-link(to="/flats", class="nav-link") {{ $t('menu.flats') }}
        li.nav-item
            router-link(to="/history", class="nav-link") {{ $t('menu.history') }}
        li.nav-item
            router-link(to="/districts", class="nav-link") {{ $t('menu.districts') }}
        li.nav-item(v-if="user")
            router-link(to="/admin", class="nav-link") {{ $t('menu.admin') }}
        li.nav-item(v-if="user")
            router-link(to="/favorites", class="nav-link") {{ $t('menu.favorites') }}
    router-view
</template>

<script>
import axios from 'axios'

import Firebase from 'firebase/app'
import 'firebase/auth'

export default {
    name: 'app',
    metaInfo() {
        return {
            titleTemplate: `%s | ` + this.$i18n.t('app'),
        }
    },
    data () {
        return {
            locales: ['en', 'ru', 'pl'],
            currencies: ['PLN', 'RUB'],
            currentCurrency: 'PLN'
        }
    },
    mounted() {
        let storageLocale = localStorage.getItem('locale')
        if (!storageLocale) {
            localStorage.setItem('locale', this.$i18n.locale)
        } else {
            this.$i18n.locale = storageLocale
        }

        let storageCurrency = localStorage.getItem('currency')
        if (storageCurrency) {
            this.currentCurrency = storageCurrency
            this.$store.commit('updateCurrentCurrency', storageCurrency)
        }

        axios.get('/api/currency', {}).then(res => {
            let ruble = res.data.value

            this.$store.commit('updateCurrency', {currency: 'RUB', value: ruble})
        })
    },
    watch: {
        currentCurrency() {
            localStorage.setItem('currency', this.currentCurrency)
            this.$store.commit('updateCurrentCurrency', this.currentCurrency)
        }
    },
    computed: {
        currentLocale() {
            return this.$i18n.locale
        },
        isShowMenu() {
            if (this.$route.meta.noMenu) {
                return false;
            }
            return true;
        },
        user() {
            return Firebase.auth().currentUser
        }
    },
    methods: {
        changeLocale(locale) {
            if (locale !== this.currentLocale) {
                localStorage.setItem('locale', locale)
                this.$i18n.locale = locale
            }
        },
        changeCurrency(currency) {
            if (currency !== this.currentCurrency) {
                this.currentCurrency = currency
            }
        },
        logout() {
            Firebase.auth().signOut().then(() => {
                this.$router.replace('flats');
            })
        }
    }
}
</script>

<style lang="scss">
body {
    font-family: "Open Sans", sans-serif;
}

#app {
// font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin: 20px auto;

    max-width: 1500px;

    .menu-user {
        display: flex;
        margin: 40px auto;
        max-width: 900px;
        justify-content: space-around;

        .menu-lang {
            margin: 0 50px;
            display: flex;
            justify-content: space-between;

            .lang-item {
                width: 40px;
                height: 40px;
                border: 4px solid lightgrey;
                border-radius: 100%;
                cursor: pointer;
                opacity: 0.5;

                &.active {
                    opacity: 1;
                }
            }
        }

        .menu-currency {
            display: flex;
            margin: 0 50px;
            justify-content: space-between;
            align-items: center;

            .currency-item {
                width: 50px;
                height: 50px;
                line-height: 50px;
                cursor: pointer;

                &.active {
                    font-size: 120%;
                    font-weight: bold;
                    color: darkgoldenrod;
                }
            }
        }

        .menu-auth {
            margin: 0 50px;
        }
    }


    .menu {
        margin-bottom: 20px;

        .nav-item {
            a {
                color: $siteColor;
            }

            .active {
                background-color: $siteColor;
                color: white;
            }
        }
    }
}
</style>
