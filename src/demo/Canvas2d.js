const document = window.document;
const CLASS_NAME = 'canvas';

const Canvas2d = function () {
    const canvas = document.createElement('canvas');
    canvas.className = CLASS_NAME;
    const ctx = canvas.getContext('2d');

    this.canvas = canvas;
    this.ctx = ctx;
};

Canvas2d.prototype.clear = function () {
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
};

export default Canvas2d;
