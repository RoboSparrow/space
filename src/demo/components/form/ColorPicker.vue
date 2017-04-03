<template>
    <div class="app--color-picker">
        <table class="mui-table">
            <tbody>
                <tr>
                    <td>
                        <input type="range" v-model.number="RGBA[0]" min="0" max="255">
                    </td>
                    <td>
                        <strong class="app--indicator" v-bind:style="{color:'rgb(' + RGBA[0] + ', 0, 0)'}">◼</strong>
                    </td>
                    <td>
                        <small>Red({{ RGBA[0] }})</small>
                    </td>
                </tr>
                <tr>
                    <td>
                        <input type="range" v-model.number="RGBA[1]" min="0" max="255">
                    </td>
                    <td>
                        <strong class="app--indicator" v-bind:style="{color:'rgb(0, ' + RGBA[1] + ', 0)'}">◼</strong>
                    </td>
                    <td>
                        <small>Green({{ RGBA[1] }})</small>
                    </td>
                </tr>
                <tr>
                    <td>
                        <input type="range" v-model.number="RGBA[2]" min="0" max="255">
                    </td>
                    <td>
                        <strong class="app--indicator" v-bind:style="{color:'rgb(0, 0, ' + RGBA[2] + ')'}">◼</strong>
                    </td>
                    <td>
                         <small>Blue({{ RGBA[2] }})</small>
                    </td>
                </tr>
                <tr>
                    <td>
                         <input type="range" v-model.number="RGBA[3]" min="0" max="1" step="0.1">
                    </td>
                    <td></td>
                    <td>
                        <small>Alpha({{ RGBA[3] }})</small>
                    </td>
                </tr>
            </tbody>
        </table>

        <pre class="app--color" v-bind:style="{backgroundColor: rgbaString, color: rgbaStringContrast}">{{rgbaString}}</pre>

        <a  class="mui-btn mui-btn--small mui-btn--primary" v-on:click="setColor()">Set color</a>
    </div>
</template>

<script>
const match = function (str, model) {
    let i;
    let n;
    const matches = str.match(/\d+/g);
    for (i = 0; i < matches.length; i += 1) {
        n = parseInt(matches[i], 10);
        if (!isNaN(n)) {
            model[i] = matches[i];
        }
    }
    return matches;
};

export default {
    name: 'ColorPicker',
    props: [
        'rgba',
        'targ'
    ],
    data: function () {
        return {
            RGBA: match(this.rgba, [0, 0, 0, 1])
        };
    },
    computed: {
        rgbaString: function () {
            return 'rgba(' + this.RGBA.toString() + ')';
        },
        rgbaStringContrast: function () {
            const yiq = ((this.RGBA[0] * 299) + (this.RGBA[1] * 587) + (this.RGBA[2] * 114)) / 1000;
            return (yiq >= 128) ? 'black' : 'white';
        }
    },
    methods: {
        setColor: function () {
            this.$parent.$emit('color-picker:' + this.targ, this.rgbaString);
        }
    },
};
</script>

<style>
    .app--color-picker pre {
        text-align: center;
        border: 1px solid white;
        padding: 10px;
        font-size: 10px;
    }
</style>
