const document = window.document;
const CLASS_NAME = 'svg-canvas';

const Svg = function () {
    const svg = document.createElement('svg');
    svg.version = '1.1';
    svg.baseProfile = 'full';
    svg.width = 300;
    svg.height = 100;
    svg.xmlns = 'http://www.w3.org/2000/svg';

    svg.className = CLASS_NAME;
    this.svg = svg;
};

Svg.prototype.clear = function () {
    while (this.svg.lastChild) {
        this.svg.removeChild(this.svg.lastChild);
    }
};

export default Svg;
