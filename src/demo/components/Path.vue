<template>
    <div>
        <h1>here</h1>
    </div>
</template>

<script>

export default {
    name: 'Path',
    props: [
        'animation',
        'states',
        'canvas'
    ],
    mounted() {
        this.canvas.clear();
    },
    components: {
    },
    data() {
        return {
        };
    }
};

</script>

<style>
</style>
