const Animation = function () {
    this.id = null;
    this.count = 0;
    this.running = false;
    this.interval = -1;
    this.last = new Date().getTime();
    this.callbacks = [];
};

// throttle - set frames per second
Animation.prototype.fps = function (fps) {
    this.interval = (fps < 0) ? -1 : 1000 / fps;
    return this;
};

// register callback
Animation.prototype.add = function (callback) {
    this.callbacks.push(callback);
    return this;
};

// clear all callbacks
Animation.prototype.clear = function () {
    this.callbacks.splice(0, this.callbacks.length);
    return this;
};

// clear existing callbacks and set one
Animation.prototype.only = function (callback) {
    this.clear().add(callback);
    return this;
};

Animation.prototype.play = function () {
    this.running = true;

    const callback = () => {
        if (!this.running) {
            return;
        }

        const now = new Date().getTime();
        const delta = now - this.last;

        if (this.interval < 0 || delta > this.interval) {
            this.last = now - (delta % this.interval);
            this.callbacks.forEach((fn) => {
                this.count += 1;
                fn();
            });
        }

        this.id = window.requestAnimationFrame(callback);
    };

    this.id = window.requestAnimationFrame(callback);
    return this;
};

Animation.prototype.stop = function () {
    this.running = false;
    this.count = 0;
    return this;
};

Animation.prototype.pause = function () {
    this.running = false;
    return this;
};

Animation.prototype.cancel = function () {
    this.stop();
    window.cancelAnimationFrame(this.id);
    this.id = null;
    return this;
};

Animation.prototype.toggle = function () {
    if (this.running) {
        this.pause();
    } else {
        this.play();
    }
    return this;
};

export default Animation;
