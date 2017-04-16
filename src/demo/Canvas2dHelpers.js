const Helpers = {
    drawLine: function (ctx, from, to, theme) {
        ctx.save();

        ctx.fillStyle = theme;
        ctx.strokeStyle = theme;
        //ctx.lineWidth = 0.5;

        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();

        ctx.restore();
    },

    drawPoint: function (ctx, point, name, theme) {
        ctx.save();

        ctx.fillStyle = theme;
        ctx.strokeStyle = theme;

        ctx.fillText(`${name}`, point.x + 10, point.y + 10);
        ctx.fillRect(point.x - 5, point.y - 5, 10, 10);

        ctx.restore();
    },

    drawHandle: function (ctx, point, handle, name, theme) {
        ctx.save();

        ctx.beginPath();
        ctx.fillStyle = theme;
        ctx.strokeStyle = theme;
        ctx.lineWidth = 0.5;
        ctx.fillText(`${name}`, handle.x + 10, handle.y);
        ctx.fillRect(handle.x - 5, handle.y - 5, 10, 10);
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(handle.x, handle.y);
        ctx.stroke();

        ctx.restore();
    }
};

export default Helpers;
