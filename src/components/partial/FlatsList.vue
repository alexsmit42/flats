<template lang="pug">
table.flats-list.table.table-sm.table-striped(v-if="flats.length")
    thead
        tr
            th.title Title
            th.rooms Rooms
            th.order(@click="changeOrder('price')") Price, zł
                span.direction
                    i.fa.fa-angle-up(v-if="order.field === 'price' && order.asc")
                    i.fa.fa-angle-down(v-if="order.field === 'price' && !order.asc")
            th.order(@click="changeOrder('area')") Area, m
                sup 2
                span.direction
                    i.fa.fa-angle-up(v-if="order.field === 'area' && order.asc")
                    i.fa.fa-angle-down(v-if="order.field === 'area' && !order.asc")
            th.order(@click="changeOrder('meter')") Meter, zł/m
                sup 2
                span.direction
                    i.fa.fa-angle-up(v-if="order.field === 'meter' && order.asc")
                    i.fa.fa-angle-down(v-if="order.field === 'meter' && !order.asc")
            th.order(@click="changeOrder('days')") Days ago
                span.direction
                    i.fa.fa-angle-up(v-if="order.field === 'days' && order.asc")
                    i.fa.fa-angle-down(v-if="order.field === 'days' && !order.asc")
    tbody
        tr(v-for="flat in flats")
            td.title
                i.fa.fa-star(
                    :class="{'is-fav': favorites.indexOf(flat.siteID) !== -1}", 
                    :title="favorites.indexOf(flat.siteID) !== -1 ? 'Remove from favorites' : 'Add to favorites'", 
                    @click="favoriteClick(flat.siteID)"
                )
                a(:href="flat.url", target="_blank") {{ flat.title }}
            td {{ flat.rooms }}
            td(:class="{ordered: order.field === 'price'}") {{ flat.price }} 
            td(:class="{ordered: order.field === 'area'}") {{ flat.area }} 
            td(:class="{ordered: order.field === 'meter'}") {{ flat.meter }} 
            td(:class="{ordered: order.field === 'days'}") {{ flat.days}}
                span.price-change-warning(v-if="flat.uniquePrices.length > 1") (price was changed!)  
</template>

<script>

import { mapGetters } from 'vuex'
import Firebase from 'firebase/app'
import 'firebase/auth'

import axios from 'axios'

export default {
    name: 'flats-list',
    props: ['flats', 'order', 'type'],
    data() {
        return {
            favorites: [],
            user: null
        }
    },
    mounted() {
        this.getUser()
        this.getFavorites()
    },
    methods: {
        getUser() {
            this.user = Firebase.auth().currentUser
        },
        changeOrder(order) {
            this.$emit('changeOrder', order)
        },
        favoriteClick(flatID) {
            if (this.user) {
                axios.put('/api/favorites', {userID: this.user.uid, flatID: flatID}).then(res => {
                    let isNewFavorite = res.data.isNewFavorite

                    if (isNewFavorite) {
                        this.favorites.push(flatID)
                    } else {
                        this.favorites.splice(this.favorites.indexOf(flatID), 1)

                        if (this.type === 'favorites') {
                            this.$emit('removeFavorite', flatID)
                        }
                    }

                    this.$forceUpdate()
                })
            }
        },
        getFavorites() {
            if (!this.user) {
                return []
            }

            axios.get('/api/favorites', {params: {userID: this.user.uid}}).then(res => {
                this.favorites = res.data.favorites
                this.$forceUpdate()
            })
        }
    }
}
</script>

<style lang="scss">
.flats-list {
    .title {
        text-align: left;
    }

    th {
        &.rooms {
            width: 100px;
        }

        &.order {
            width: 200px;
        }

        .direction {
            width: 30px;

            i {
                margin-left: 5px;
                font-size: 110%;
            }
        }
    }

    td {
        .fa-star {
            margin-right: 5px;
            color: silver;
            cursor: pointer;

            &.is-fav {
                color: goldenrod;
            }
        }

        &.ordered {
            background-color: #d3f7d3;
            border-left: 1px solid green;
            border-right: 1px solid green;
        }
    }

    .order {
        color: darkblue;
        cursor: pointer;
    }

    .price-change-warning {
        color: red;
    }
}
</style>

