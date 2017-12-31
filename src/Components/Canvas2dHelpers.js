const Helpers = {

    ////
    // Controls
    ////

    drawLine: function (ctx, from, to, theme) {
        if (!from) {
            return;
        }
        ctx.save();

        ctx.fillStyle = theme;
        ctx.strokeStyle = theme;
        //ctx.lineWidth = 0.5;
        ctx.setLineDash([2, 2]);

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
        ctx.closePath();

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

    drawCircle: function (ctx, point, name, theme) {
        ctx.save();

        ctx.fillStyle = theme;

        ctx.fillText(`${name}`, point.x + 10, point.y + 10);
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        ctx.fill();

        ctx.closePath();
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

        ctx.closePath();
        ctx.restore();
    },

    drawBoundingBox: function (ctx, path, theme) {
        const bounds = path.bounds();
        if (!path.bounds()) {
            return;
        }
        ctx.save();

        ctx.fillStyle = theme;
        ctx.strokeStyle = theme;
        ctx.lineWidth = 0.2;

        ctx.setLineDash([2, 2]);
        ctx.strokeRect(bounds.min.x, bounds.min.y, bounds.max.x - bounds.min.x, bounds.max.y - bounds.min.y);

        ctx.beginPath();
        ctx.moveTo(bounds.center.x, bounds.min.y);
        ctx.lineTo(bounds.center.x, bounds.max.y);
        ctx.moveTo(bounds.min.x, bounds.center.y);
        ctx.lineTo(bounds.max.x, bounds.center.y);
        ctx.stroke();

        ctx.closePath();
        ctx.restore();
    },

    ////
    // lines
    ////

    line: function (ctx, prev, point) {
        if (!prev) {
            return;
        }
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(point.x, point.y);
    },

    bezierLine: function (ctx, prev, point) {
        if (!prev) {
            return;
        }
        //ctx.moveTo(prev.x, prev.y);//Dev
        const prevM = (prev && typeof prev.members !== 'undefined') ? prev.members.length : 0;
        const pointM = (typeof point.members !== 'undefined') ? point.members.length : 0;

        // line
        if (!prevM && !pointM) {
            ctx.lineTo(point.x, point.y);
            return;
        }
        // middle
        if (prevM > 1 && pointM > 1) {
            ctx.bezierCurveTo(prev.members[1].x, prev.members[1].y, point.members[0].x, point.members[0].y, point.x, point.y);
            return;
        }
        // start
        if (!prevM && pointM) {
            ctx.quadraticCurveTo(point.members[0].x, point.members[0].y, point.x, point.y);
            return;
        }
        // end
        if (prevM && !pointM) {
            ctx.quadraticCurveTo(prev.members[1].x, prev.members[1].y, point.x, point.y);
        }
    }

};

export default Helpers;
