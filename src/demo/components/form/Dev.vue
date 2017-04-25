<template>
    <section class="mui-form">
        <div class="mui-checkbox">
            <label>
                <input type="checkbox" v-model="show"> Show {{label}}
            </label>
        </div>
        <pre v-if="show">{{data}}</pre>
    </section>
</template>

<script>
export default {
    name: 'Dev',
    props: ['data', 'label'],
    data: function () {
        return {
            show: false
        };
    },
};
</script>

<style>
</style>
