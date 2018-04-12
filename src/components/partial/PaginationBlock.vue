<template lang="pug">
.pagination-block
    ul.pagination.justify-content-center
        li.page-item(v-if="pageCount > 1", :class="{disabled: currentPage === 1}")
            a.page-link(@click="goPage(currentPage - 1)") {{ $t('page.previous') }}

        li.page-item(v-for="page in pageCount", :class="{active: page === currentPage}")
            a.page-link(@click="goPage(page)") {{ page }}

        li.page-item(v-if="pageCount > 1", :class="{disabled: currentPage === pageCount}")
            a.page-link(@click="goPage(currentPage + 1)") {{ $t('page.next') }}
</template>

<script>
export default {
    name: 'pagination-block',
    props: ['pageCount', 'currentPage'],
    methods: {
        goPage(page) {
            if (page === this.currentPage || page < 1 || page > this.pageCount) {
                return
            }

            this.$emit('goPage', page);
        }
    }
}
</script>

<style lang="scss">
.pagination-block {
    .page-item {
        &.active {
            .page-link {
                background-color: $siteColor;
                border-color: $siteColor;
                color: white;
            }
        }

        a {
            cursor: pointer;
        }
    }
}
</style>
