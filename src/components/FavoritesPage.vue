<template lang="pug">
.favorites-page
    flats-list(:flats="showFavorites", :order="order", :type="'favorites'", @removeFavorite="removeFavorite")
</template>

<script>
import Firebase from 'firebase/app'
import 'firebase/auth'
import axios from 'axios'

import CurrencyMixin from './mixins/CurrencyMixin'


import FlatsList from './partial/FlatsList.vue'

export default {
    name: 'favorites-page',
    metaInfo() {
        return {
            title: this.$i18n.t('menu.favorites'),
        }
    },
    data() {
        return {
            favorites: [],
            order: 'title'
        }
    },
    components: {FlatsList},
    mixins: [CurrencyMixin],
    created() {
        this.getFavorites()
    },
    computed: {
        showFavorites() {
            let flats = this.favorites.map(flat => {
                let newFlat = Object.assign({}, flat)

                newFlat.price = this.getPrice(flat.price)
                newFlat.meter = this.getPrice(flat.meter)

                return newFlat
            })

            return flats
        }
    },
    methods: {
        getFavorites() {
            let user = Firebase.auth().currentUser
            if (user) {
                axios.get('/api/favorites/flats', {params: {userID: user.uid}}).then((res) => {
                    this.favorites = res.data.favorites
                })
            }
        },

        removeFavorite(flatID) {
            this.favorites = this.favorites.filter(fav => fav.siteID !== flatID)
            this.$forceUpdate()
        }
    }
}
</script>

<style lang="scss">
.favorites-page {
    margin: 20px;
}
</style>


