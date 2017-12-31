<template>
    <div>
        <div class="app--micro-form" v-if="path && path.points !== 'undefined'">
            <div v-for="(point, index) in path.points">
                <strong>Point {{index}}</strong>
                <div>
                    <input type="text" v-model.number="point.x" v-on:change="update()" size="3">
                    <label>x</label>
                    <input type="text" v-model.number="point.y" v-on:change="update()" size="3">
                    <label>y</label>
                </div>
                <!-- groups -->
                <div
                    v-if="typeof point.members !== 'undefined' && point.members.length"
                    v-for="(member, i) in point.members">
                    <br><strong>cp[{{i}}]</strong><br>
                    <input type="text" v-model.number="member.x" v-on:change="update()" size="3">
                    <label>x</label>
                    <input type="text" v-model.number="member.y" v-on:change="update()" size="3">
                    <label>.y</label>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'EditPathPoints',
    props: [
        'path'
    ],
    methods: {
        update: function () {
            this.$parent.$emit('edit-path-points:updated');
        }
    }
};
</script>

<style>
</style>
