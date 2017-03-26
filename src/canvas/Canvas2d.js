/* globals SPACE */

(function (window, Module) {


    const document = window.document;
    const CLASS_NAME = 'canvas';

    const Canvas = function (parent, width, height, bg = null, lineWidth = 1) {

        const canvas = document.createElement('canvas');
        canvas.className = CLASS_NAME;
        canvas.width = width;
        canvas.height = height;
        parent.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        ctx.lineWidth = lineWidth;

        this.canvas = canvas;
        this.ctx = ctx;
        this.bg = bg;

        this.clear();
    };

    Canvas.prototype.clear = function () {
        //@TODO faster if css bg?

        //this.ctx.globalCompositeOperation = 'destination-out';
        //this.ctx.globalCompositeOperation = 'destination-in';
        if (this.bg) {
            this.ctx.fillStyle = this.bg;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        //this.ctx.globalCompositeOperation = 'lighter';
    };

    const Animation = function () {
        this.id = null;
        this.count = 0;
        this.running = false;
        this.callbacks = [];
    };

    // register callback
    Animation.prototype.add = function (callback) {
        this.callbacks.push(callback);
    };

    Animation.prototype.play = function () {
        this.running = true;

        const callback = () => {
            if (!this.running) {
                return;
            }
            this.callbacks.forEach((fn) => {
                this.count++;
                fn();
            });
            this.id = window.requestAnimationFrame(callback);
        };

        this.id = window.requestAnimationFrame(callback);
    };

    Animation.prototype.stop = function () {
        this.running = false;
        this.count = 0;
    };

    Animation.prototype.pause = function () {
        this.running = false;
    };

    Animation.prototype.reset = function () {
        this.running = false;
    };

    Animation.prototype.toggle = function () {
        if (this.running) {
            this.pause();
        } else {
            this.play();
        }
    };

    Module.Canvas2d = Canvas;
    Module.Animation = Animation;

}(window, SPACE || {}));
