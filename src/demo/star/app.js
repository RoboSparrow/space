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
        iRadiusRange: 100,
        oRadiusRange: 50,
        segmentsRange: 20,
        playing: true
    };

    let init = () => {
        canvas = new SPACE.Canvas2d(document.getElementById('Main'), 500, 500, 'rgba(0, 0, 0, .08)', 0.1);
        animation = new SPACE.Animation();
        origin =  new SPACE.Point.Cartesian(canvas.canvas.width/2, canvas.canvas.height/2);
        last = {innerRadius: 10, outerRadius: 100};
    };

    let compute = (segmentsRange, oRadiusRange, iRadiusRange) => {
        let outerRadius = randIntRange(last.outerRadius, [1, oRadiusRange]);
        let innerRadius = randIntRange(last.innerRadius, [1, iRadiusRange]);
        let segments = randIntRange(0, [3, segmentsRange]);
        return new SPACE.Star(segments, outerRadius, innerRadius, origin);
    };

    let draw = (star) => {

        // point
        // path(p, style);
        // path.add(p, bezier, style)
        let path = star.path;

        canvas.ctx.beginPath();
        canvas.ctx.moveTo(path.first().x, path.first().y);
        path.points.forEach((point, index)=> {
            if(index === 0){
                return;
            }

            canvas.ctx.lineTo(point.x, point.y);
            canvas.ctx.strokeStyle = 'rgba(236, 112, 99, .6)';
            canvas.ctx.stroke();

            //canvas.ctx.fillStyle = 'rgba(236, 112, 99, .3)';
            //canvas.ctx.fill();
        });
        canvas.ctx.closePath();
    };

    return {
        run: () => {
            init();

            state.animation = new SPACE.Animation();
            state.animation.add(() => {
                canvas.clear();
                let star = compute(state.segmentsRange, state.oRadiusRange, state.iRadiusRange);
                draw(star);
                //state.animation.stop();
            });

            state.animation.play();

        },
        state: state,
        init: init,
        draw: draw,
        origin: () => { return origin; }
    };

}(window, SPACE));

document.addEventListener("DOMContentLoaded", function() {

    // app.js
    App.run();
    new Vue({ el: '#Controls', data: App.state });

    ///// single
    // App.init();
    // const star = new SPACE.Star(5, 100, 50, App.origin());
    // App.draw(star);
});
