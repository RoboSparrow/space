<template>
    <div>
        <form class="mui-form">
            <section>
                <div class="mui-checkbox">
                    <label>
                        <input type="checkbox" v-model="show"> {{label}}
                    </label>
                </div>
            </section>
        </form>
        <pre v-if="show">{{data}}</pre>
    </div>
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
