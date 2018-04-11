<template lang="pug">
#app
    ul.menu-auth.nav.nav-pills.justify-content-center
        template(v-if="isUser")
            li.nav-item
                a.nav-link(@click="logout", href="#") Logout
        template(v-else)
            li.nav-item
                router-link(to="/login", class="nav-link") Login
            li.nav-item
                router-link(to="/registration", class="nav-link") Registration
        

    ul.menu.nav.nav-pills.justify-content-center(v-show="isShowMenu")
        li.nav-item
            router-link(to="/flats", class="nav-link") Flats
        li.nav-item
            router-link(to="/history", class="nav-link") History
        li.nav-item(v-if="isUser")
            router-link(to="/admin", class="nav-link") Admin
        li.nav-item(v-if="isUser")
            router-link(to="/favorites", class="nav-link") Favorites
    router-view
</template>

<script>
import Firebase from 'firebase/app'
import 'firebase/auth'

export default {
    name: 'app',
    data () {
        return {
      
        }
    },
    computed: {
        isShowMenu() {
            if (this.$route.meta.noMenu) {
                return false;
            }
            return true;
        },
        isUser() {
            if (Firebase.auth().currentUser) {
                return true
            }

            return false
        }
    },
    methods: {
        logout() {
            Firebase.auth().signOut().then(() => {
                this.$router.go()
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
    margin: 60px auto;

    max-width: 1500px;

    .menu-auth {
        margin: 0 auto 20px;
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
