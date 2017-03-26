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
        wRange: 500,
        hRange: 500,
        playing: true
    };

    let init = () => {
        canvas = new SPACE.Canvas2d(document.getElementById('Main'), 500, 500, 'rgba(0, 0, 0, .08)', 0.1);
        animation = new SPACE.Animation();
        origin =  new SPACE.Point.Cartesian(canvas.canvas.width/2, canvas.canvas.height/2);
        last = {width: 100, height: 100};
    };

    let compute = (wRange, hRange) => {
        let width = randIntRange(last.width, [1, wRange]);
        let height = randIntRange(last.height, [1, hRange]);
        return new SPACE.Rectangle(width, height, origin);
    };

    let draw = (rectangle) => {

        // point
        // path(p, style);
        // path.add(p, bezier, style)
        let path = rectangle.path;

        canvas.ctx.beginPath();
        canvas.ctx.moveTo(path.first().x, path.first().y);
        path.points.forEach((point, index)=> {
            if(index === 0){
                return;
            }

            canvas.ctx.lineTo(point.x, point.y);
            //canvas.ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
            //canvas.ctx.stroke();

            canvas.ctx.fillStyle = 'rgba(236, 112, 99, .3)';
            canvas.ctx.fill();
        });
        canvas.ctx.closePath();
    };

    return {
        run: () => {
            init();

            state.animation = new SPACE.Animation();
            state.animation.add(() => {
                canvas.clear();
                let polygon = compute(state.wRange, state.hRange);
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
