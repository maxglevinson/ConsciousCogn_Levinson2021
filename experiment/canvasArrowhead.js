'use strict';

/* Draw an arrowhead on a line on an HTML5 canvas.
*
* Based almost entirely off of http://stackoverflow.com/a/36805543/281460 with some modifications
* for readability and ease of use.
*
* @param context The drawing context on which to put the arrowhead.
* @param from A point, specified as an object with 'x' and 'y' properties, where the arrow starts
*             (not the arrowhead, the arrow itself).
* @param to   A point, specified as an object with 'x' and 'y' properties, where the arrow ends
*             (not the arrowhead, the arrow itself).
* @param radius The radius of the arrowhead. This controls how "thick" the arrowhead looks.
* 
* this function is from Scott Johnson, github @jwir3
* modified by Max Levinson, 2020
*/
function drawArrowhead(context, from, to, radius) {
    var x_center = to.x;
    var y_center = to.y;

    var angle;
    var x;
    var y;

    context.beginPath();

    angle = Math.atan2(to.y - from.y, to.x - from.x);
    x = radius * Math.cos(angle) + x_center;
    y = radius * Math.sin(angle) + y_center;

    context.moveTo(x, y);

    angle += 1.0 / 3.0 * (2 * Math.PI);
    x = radius * Math.cos(angle) + x_center;
    y = radius * Math.sin(angle) + y_center;

    context.lineTo(x, y);

    angle += 1.0 / 3.0 * (2 * Math.PI);
    x = radius * Math.cos(angle) + x_center;
    y = radius * Math.sin(angle) + y_center;

    context.lineTo(x, y);

    context.closePath();

    context.fill();
}

/* added functions by ML to get arrow locations from custom canvas */
var getArrowFrom = function getArrowFrom(canvas, vertOffset) {
    return {
        x: canvas.width / 2 + canvas.width * -0.06,
        y: canvas.height / 2 + canvas.height * vertOffset
    };
};
var getArrowTo = function getArrowTo(canvas, vertOffset) {
    return {
        x: canvas.width / 2 + canvas.width * 0.04,
        y: canvas.height / 2 + canvas.height * vertOffset
    };
};

var generateArrowStim = function generateArrowStim(lineWidth, vertOffset) {
    return {
        obj_type: 'manual',
        drawFunc: function drawFunc(stimulus, canvas, context) {
            var from = getArrowFrom(canvas, vertOffset);
            var to = getArrowTo(canvas, vertOffset);
            context.beginPath();
            context.moveTo(from.x, from.y);
            context.lineTo(to.x, to.y);
            context.lineWidth = lineWidth;
            context.stroke();
            context.closePath();
            context.fillStyle = 'black';
            drawArrowhead(context, from, to, lineWidth * 2);
        }
    };
};