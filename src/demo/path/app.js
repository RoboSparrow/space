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

        if(bounce.length){//console.log(range, bounce);
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

    let state = {
        segments: 100,
        segmentRange: 10,
        playing: true
    };

    let init = () => {
        canvas = new SPACE.Canvas2d(document.getElementById('Main'), 500, 500, 'rgba(0, 0, 0, .08)', 0.1);
        animation = new SPACE.Animation();
        last = new SPACE.Point.Cartesian(canvas.canvas.width/2, canvas.canvas.height/2);
    };

    let computePath = (segments, range) => {
        let path = new SPACE.Path(last.x, last.y);

        let count = 0;
        while(count < segments){
            let prev = path.last();
            let x = randIntRange(prev.x, [-range, range], [0, canvas.canvas.width]);
            let y = randIntRange(prev.y, [-range, range], [0, canvas.canvas.height]);
            //console.log(x, y);
            path.add(x, y);
            count++;
        }

        last = path.last();
        return path;
    };

    let drawPath = (path) => {

        // point
        // path(p, style);
        // path.add(p, bezier, style)

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
                let path = computePath(state.segments, state.segmentRange);
                drawPath(path);
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
