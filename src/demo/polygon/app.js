/* globals SPACE */
/* globals Vue */
let App = (function(window, SPACE) {

    'use strict';
    const document = window.document;

    /**
    * Returns a random integer between min (inclusive) and max (inclusive)
    * Using Math.round() will give you a non-uniform distribution!
    */
    function randInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
    * Returns a random integer between min (inclusive) and max (inclusive)
    * Using Math.round() will give you a non-uniform distribution!
    */
    function randIntRange(base, range, bounce = []) {

        if(bounce.length){
            if((base + range[1]) > bounce[1]){
                base -= range[1];
            }
            if((base + range[0]) < bounce[0]){
                base -= range[0];
            }
        }

        let r = base + randInt(range[0], range [1]);
        return r;
    }

    let canvas;
    let animation;
    let last;
    let origin;

    let state = {
        radiusRange: 50,
        segmentRange: 10,
        playing: true
    };

    let init = () => {
        canvas = new SPACE.Canvas2d(document.getElementById('Main'), 500, 500, 'rgba(0, 0, 0, .08)', 0.1);
        animation = new SPACE.Animation();
        origin =  new SPACE.Point.Cartesian(canvas.canvas.width/2, canvas.canvas.height/2);
        last = {radius: 100, segments: 4};
    };

    let compute = (radiusRange, segmentRange) => {
        let radius = randIntRange(last.radius, [-radiusRange, radiusRange]);
        let segments = randIntRange(last.segments, [0, segmentRange]);
        if(segments < 3){
            segments = 3;
        }
        return new SPACE.Polygon(segments, radius, origin);
    };

    let draw = (polygon) => {

        // point
        // path(p, style);
        // path.add(p, bezier, style)
        let path = polygon.path;

        canvas.ctx.beginPath();
        canvas.ctx.moveTo(path.first().x, path.first().y);
        path.points.forEach((point, index)=> {
            if(index === 0){
                return;
            }

            canvas.ctx.lineTo(point.x, point.y);
            canvas.ctx.strokeStyle = 'hsla('+randInt(170,300)+', 100%, '+randInt(50, 75)+'%, 1)';
            canvas.ctx.stroke();
        });
        canvas.ctx.closePath();
    };

    return {
        run: () => {
            init();

            state.animation = new SPACE.Animation();
            state.animation.add(() => {
                canvas.clear();
                let polygon = compute(state.radiusRange, state.segmentRange);
                draw(polygon);
                //state.animation.stop();
            });

            state.animation.play();

        },
        state: state
    };

}(window, SPACE));

document.addEventListener("DOMContentLoaded", function() {

    // app.js
    App.run();
    new Vue({ el: '#Controls', data: App.state });
});
