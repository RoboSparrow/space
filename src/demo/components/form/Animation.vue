<template>
    <div>
        <section v-if="animation.id" class="mui-form">
            <legend>Animation <small>{{animation.count}}</small></legend>
            <a v-on:click="animation.toggle()" class="mui-btn mui-btn--small mui-btn--primary">
                {{(animation.running) ? 'pause' : 'play'}}
            </a>
            <a v-on:click="show = !show" class="mui-btn mui-btn--small app--btn">Throttle</a>

            <div v-if="show" class="mui-panel">
                <div class="mui-textfield" style="">
                    <input type="range" v-on:change="throttle($event.target.value)" min="0" max="100">
                    <label>fps <small>({{1000 / animation.interval}})</small></label>
                </div>
            </div>
        </section>

    </div>
</template>

<script>
export default {
    name: 'Animation',
    props: ['animation'],
    data: function () {
        return {
            show: false
        };
    },
    methods: {
        throttle: function (value) {
            if (value === null) {
                return;
            }
            value = parseInt(value, 10);
            if (!isNaN(value)) {
                this.animation.fps(value);
            }
        }
    }
};
</script>

<style>
</style>
