<template lang="pug">
.favorites-page
    flats-list(:flats="favorites", :order="order", :type="'favorites'", @removeFavorite="removeFavorite")
</template>

<script>
import Firebase from 'firebase/app'
import 'firebase/auth'
import axios from 'axios'

import FlatsList from './partial/FlatsList.vue'

export default {
    data() {
        return {
            favorites: [],
            order: 'title'
        }
    },
    components: {FlatsList},
    created() {
        this.getFavorites()
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

</style>


