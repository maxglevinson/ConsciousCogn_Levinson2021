"use strict";

/**
 * Created by Qisheng Li in 11/2019.
 * Modified by Max Levinson, 2020.
 */

//Store all the configuration chinrestData in variable 'chinrestData'
var chinrestData = { "chinrestDataType": "configurationchinrestData" };
chinrestData["ballPosition"] = [];
chinrestData["fullScreenClicked"] = false;
chinrestData["sliderClicked"] = false;

(function (distanceSetup, $) {

    distanceSetup.round = function (value, decimals) {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
    };

    distanceSetup.px2mm = function (cardImageWidth) {
        //distanceSetup.px2mm = function(px2inch) {
        // cardImageWidth: in pixels
        var cardWidth = 85.6; //card dimension: 85.60 × 53.98 mm (3.370 × 2.125 in)
        var px2mm = cardImageWidth / cardWidth;
        chinrestData["px2mm"] = distanceSetup.round(px2mm, 2);
        return px2mm;
    };
})(window.distanceSetup = window.distanceSetup || {}, jQuery);

function configureBlindSpot() {
    var pos = document.getElementById("blind-spot").offsetWidth * .8; // added custom pos to make sure square is closer to edge
    drawBall(pos);
    $('#blind-spot').css({ 'visibility': 'visible' });
    $(document).on('keydown', recordPosition);
};



//=============================
//Ball Animation

function drawBall() {
    var pos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 180;

    // pos: define where the fixation square should be, IN PIXELS. used to be in mm
    // took out card width estimation and instead input value from jsPsych
    var mySVG = SVG("svgDiv");
    var cardWidthPx = scalescreen.pixels_per_unit * 3.37;
    distanceSetup.px2mm(cardWidthPx);
    var rectX = pos;

    var ballX = rectX * 0.8; // define where the ball is
    var ball = mySVG.circle(30).move(ballX, 50).fill("#f00");
    window.ball = ball;
    var square = mySVG.rect(30, 30).move(Math.min(rectX - 50, window.innerWidth - 50), 50); // square position (top left corner)
    chinrestData["squarePosition"] = distanceSetup.round(square.cx(), 2); // square position (center)
    chinrestData['rectX'] = rectX;
    chinrestData['ballX'] = ballX;
};

function animateBall() {
    ball.animate(7000).during(function (pos) {
        var moveX = -pos * chinrestData['ballX'];
        window.moveX = moveX;
        var moveY = 0;
        ball.attr({ transform: "translate(" + moveX + "," + moveY + ")" });
    }).loop(true, false).after(function () {
        animateBall();
    });

    //disable the button after clicked once.
    $("#start").attr("disabled", true);
};

function recordPosition(event) {
    var angle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 13.5;

    // angle: define horizontal blind spot entry point position in degrees.
    if (event.keyCode == '32') {
        //Press "Space"

        chinrestData["ballPosition"].push(distanceSetup.round(ball.cx() + moveX, 2));

        //counter and stop
        var counter = Number($('#click').text());
        counter = counter - 1;
        $('#click').text(Math.max(counter, 0));
        if (counter <= 0) {
            $('#blind-spot').remove();
            ball.stop();
            $(document).off('keydown');
            setTimeout("$('#continue').click();", 50);
            chinrestData["ballPosition"].shift(); // remove first measurement in case subject was confused at first
            var sum = chinrestData["ballPosition"].reduce(function (a, b) {
                return a + b;
            }, 0);
            var ballPosLen = chinrestData["ballPosition"].length;
            chinrestData["avgBallPos"] = distanceSetup.round(sum / ballPosLen, 2);
            var ball_sqr_distance = (chinrestData["squarePosition"] - chinrestData["avgBallPos"]) / chinrestData["px2mm"];
            var viewDistance = ball_sqr_distance / Math.radians(angle);
            console.log(Math.radians(angle));
            chinrestData["viewDistance_mm"] = distanceSetup.round(viewDistance, 2);
            console.log(chinrestData["viewDistance_mm"]);
            return;
        }

        ball.stop();
        animateBall();
    }
}


// Converts from degrees to radians.
Math.radians = function (degrees) {
    return degrees * Math.PI / 180;
};