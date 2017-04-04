<template>
    <div>
        <form v-if="animation.id" class="mui-form--inline">
            <section>
                <legend class="mui--text-subhead">Animation <small>{{animation.count}}</small></legend>
                <a v-on:click="animation.toggle()" class="mui-btn mui-btn--small mui-btn--primary">
                    {{(animation.running) ? 'pause' : 'play'}}
                </a>
                <a v-on:click="show = !show" class="mui-btn mui-btn--small app--btn">
                    Throttle
            </section>
        </form>
        <div class="mui-panel" v-if="show">
            <div class="mui-textfield" style="">
                <input type="range" v-on:change="throttle($event.target.value)" min="0" max="100">
                <label>fps <small>({{1000 / animation.interval}})</small></label>
            </div>
        </div>
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
