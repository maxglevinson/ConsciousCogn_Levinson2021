'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/* change spellings between American and British (COLOR and CENTER) if necessary */
var clr = 'color';
var ctr = 'center';

//////// FUNCTIONS //////////

var dva_to_length = function dva_to_length(dva, distance) {
    // given visual angle of an object and distance from screen, compute object's physical size ("length")
    // output length is in same units as input distance
    var dva_rad = dva * (Math.PI / 180);
    return 2 * Math.tan(dva_rad / 2) * distance;
};

/* Randomize array in-place using Durstenfeld shuffle algorithm */
// this doesn't output an array; rather the array has to already exist, and this just shuffles the elements //
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

var repeatArray = function repeatArray(arr, repeats) {
    var _ref;

    return (_ref = []).concat.apply(_ref, _toConsumableArray(Array.from({ length: repeats }, function () {
        return arr;
    })));
}; // function to repeat the contents of an array multiple times

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive 
}

/* convert Yxy (Y brightness, x-y hue coordinate) to sRGB */
//// taken from http://www.easyrgb.com/en/math.php ////
function YxytosRGB(Yxy) {
    // Yxy is an array of 3 numbers
    // first Yxy to XYZ
    var Y = Yxy[0];
    var x = Yxy[1];
    var y = Yxy[2];

    var X = x * (Y / y);
    var Z = (1 - x - y) * (Y / y);

    // now XYZ to sRGB
    var var_X = X / 100;
    var var_Y = Y / 100;
    var var_Z = Z / 100;

    var var_R = var_X * 3.2406 + var_Y * -1.5372 + var_Z * -0.4986;
    var var_G = var_X * -0.9689 + var_Y * 1.8758 + var_Z * 0.0415;
    var var_B = var_X * 0.0557 + var_Y * -0.2040 + var_Z * 1.0570;

    if (var_R > 0.0031308) {
        var_R = 1.055 * Math.pow(var_R, 1 / 2.4) - 0.055;
    } else {
        var_R = 12.92 * var_R;
    }
    if (var_G > 0.0031308) {
        var_G = 1.055 * Math.pow(var_G, 1 / 2.4) - 0.055;
    } else {
        var_G = 12.92 * var_G;
    }
    if (var_B > 0.0031308) {
        var_B = 1.055 * Math.pow(var_B, 1 / 2.4) - 0.055;
    } else {
        var_B = 12.92 * var_B;
    }

    if (var_R < 0) {
        var_R = 0;
    } else if (var_R > 1) {
        var_R = 1;
    }
    if (var_G < 0) {
        var_G = 0;
    } else if (var_G > 1) {
        var_G = 1;
    }
    if (var_B < 0) {
        var_B = 0;
    } else if (var_B > 1) {
        var_B = 1;
    }
    var sR = Math.round(var_R * 255);
    var sG = Math.round(var_G * 255);
    var sB = Math.round(var_B * 255);
    var sRGB = [sR, sG, sB];
    return sRGB;
}

/* generate rgb CSS script given an sRGB array */
function rgb(sRGB) {
    return 'rgb(' + sRGB.join(', ') + ')';
}

/* functions to retrieve scale factor, to set canvas size back to whole screen even after scaling */
var get_canvas_width = function get_canvas_width() {
    var scale_factor = jsPsych.data.get().select('scale_factor').values;
    if (scale_factor.length === 0) {
        // if resize plugin was not used
        return window.innerWidth;
    } else if (scale_factor < 1) {
        return window.innerWidth / scale_factor;
    } else if (scale_factor > 1) {
        return window.innerWidth / scale_factor;
    } else {
        return window.innerWidth;
    }
};
var get_canvas_height = function get_canvas_height() {
    var scale_factor = jsPsych.data.get().select('scale_factor').values;
    if (scale_factor.length === 0) {
        // if resize plugin was not used
        return window.innerHeight;
    } else if (scale_factor < 1) {
        return window.innerHeight / scale_factor;
    } else if (scale_factor > 1) {
        return window.innerHeight / scale_factor;
    } else {
        return window.innerHeight;
    }
};

var get_left_top_width_height = function get_left_top_width_height(curr_canvas) {
    var scalar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var horizOffset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var vertOffset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    /* coordinates for top left corner of the stimulus, and width + height */
    var centerX = curr_canvas.width / 2 + horizOffset * curr_canvas.width;
    var centerY = curr_canvas.height / 2 + vertOffset * curr_canvas.height;
    var peripheryWidthPixels = curr_canvas.width * scalar;
    var peripheryHeightPixels = curr_canvas.height * scalar;
    var leftX = centerX - peripheryWidthPixels / 2;
    var topY = centerY - peripheryHeightPixels / 2;
    return [leftX, topY, peripheryWidthPixels, peripheryHeightPixels]; // output is x, y, width, height array (pixels)
};

/* function to draw fixation point
* translated from Thaler et al., 2013, Vision Research */
function drawFixation(canvas, context) {
    var scalar = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    var horizOffset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var vertOffset = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

    // optional argument scalar: multiplies size of fixation target by scalar
    // optional arguments horizOffset and vertOffset: moves fixation point from center (0, 0). values: -.5 to +.5
    var dOut = 0.6; // diameter of outer circle in degrees of visual angle
    var dIn = 0.2; // diameter of inner circle
    var dOutInches = dva_to_length(dOut, distance_from_screen);
    var dInInches = dva_to_length(dIn, distance_from_screen);
    var dOutPixels = dOutInches * scalescreen.pixels_per_unit * scalar;
    var dInPixels = dInInches * scalescreen.pixels_per_unit * scalar;
    var centerX = canvas.width / 2 + horizOffset * canvas.width;
    var centerY = canvas.height / 2 + vertOffset * canvas.height;
    context.beginPath();
    context.fillStyle = 'white';
    context.arc(centerX, centerY, dOutPixels / 2, 0, 2 * Math.PI); // outer circle
    context.fill();
    context.closePath();
    context.strokeStyle = 'black';
    context.lineWidth = dInPixels;
    context.beginPath();
    context.moveTo(centerX - dOutPixels / 2, centerY);
    context.lineTo(centerX + dOutPixels / 2, centerY); // horizontal line in cross
    context.stroke();
    context.closePath();
    context.beginPath();
    context.moveTo(centerX, centerY - dOutPixels / 2);
    context.lineTo(centerX, centerY + dOutPixels / 2); // vertical line in cross
    context.stroke();
    context.closePath();
    context.beginPath();
    context.arc(centerX, centerY, dInPixels / 2, 0, 2 * Math.PI); // inner circle
    context.fill();
    context.closePath();
}

//////// STIMULUS TRIALS //////////

/* trial containing fixation cross only */
var fixationTrial = {
    type: 'psychophysics',
    stimuli: [{
        obj_type: 'manual',
        drawFunc: function drawFunc(stimulus, canvas, context) {
            drawFixation(canvas, context);
        }
    }],
    trial_duration: 1000,
    canvas_width: get_canvas_width,
    canvas_height: get_canvas_height,
    choices: jsPsych.NO_KEYS, // no response allowed
    on_start: function on_start(trial) {
        document.body.style.cursor = 'none';
    },
    on_finish: function on_finish(data) {
        document.body.style.cursor = 'auto';
    }

    /* click to begin next trial */
}; var startTrial = {
    type: 'html-keyboard-response',
    stimulus: "Press the space bar to begin the next trial.",
    choices: [' '],
    on_load: function on_load() {
        document.querySelector('#jspsych-progressbar-container').style.display = 'initial';
    },
    on_finish: function on_finish() {
        document.querySelector('#jspsych-progressbar-container').style.display = 'none';
    }

    /* after each trial, suggest moving eyes and blinking */
}; var moveBlinkTrial = {
    timeline: [{
        type: 'html-keyboard-response',
        stimulus: "Move your eyes around and blink a bit before the next trial starts.",
        choices: jsPsych.NO_KEYS,
        trial_duration: 2500
    }],
    conditional_function: function conditional_function() {
        // check if there was a response in the previous illusion trial, and only run if there was NO click
        var clickTime = JSON.parse(jsPsych.data.get().filter({ trial_type: 'psychophysics', response_type: 'mouse' }).last(1).values()[0].rt);
        if (clickTime == null) {
            return true;
        } else {
            return false;
        }
    }
};

/* noise trial to help remove after images */
// each pixel has a random greyscale value
var noiseTrial = {
    timeline: [{
        type: 'psychophysics',
        stepFunc: function stepFunc(trial, canvas, context, elapsedTime) {
            var patternCanvas = document.createElement('canvas');
            var patternContext = patternCanvas.getContext('2d');
            patternCanvas.width = canvas.width / 5;
            patternCanvas.height = canvas.height / 5;
            var img = patternContext.createImageData(patternCanvas.width, patternCanvas.height); //, undefined, undefined, canvas.width, canvas.height); 

            var get_rand_rgb_int = function get_rand_rgb_int(maxrgb) {
                return Math.floor(Math.random() * maxrgb);
            };
            var curr_data;
            var maxrgb = 191;
            for (var i = 0; i < img.data.length; i += 4) {
                curr_data = Math.floor(Math.random() * maxrgb); //255);//Math.floor((50 * Math.random()) + 128);
                img.data[i] = get_rand_rgb_int(maxrgb); //curr_data; // r channel
                img.data[i + 1] = get_rand_rgb_int(maxrgb); //curr_data; // g channel
                img.data[i + 2] = get_rand_rgb_int(maxrgb); //curr_data; // b channel
                img.data[i + 3] = 255; // alpha channel
            }
            patternContext.putImageData(img, 0, 0);

            var pat = context.createPattern(patternCanvas, 'repeat');
            context.fillStyle = pat;
            context.fillRect(0, 0, canvas.width, canvas.height);
        },
        canvas_width: get_canvas_width,
        canvas_height: get_canvas_height,
        trial_duration: 2500,
        choices: jsPsych.NO_KEYS, // no response allowed
        stimuli: {} // account for bug in psychophysics plugin if there is no stimuli property defined
    }],
    conditional_function: function conditional_function() {
        // check if there was a response in the previous illusion trial, and only run if there was NO click
        var clickTime = JSON.parse(jsPsych.data.get().filter({ trial_type: 'psychophysics', response_type: 'mouse' }).last(1).values()[0].rt);
        if (clickTime == null) {
            return true;
        } else {
            return false;
        }
    }
};

/* color stimuli */

var colorTrial = function () {
    function colorTrial(colorC, colorP) {
        _classCallCheck(this, colorTrial);

        this.type = 'psychophysics';
        this.trial_duration = 15000;
        this.response_start_time = 0; // just use 0 in case subjects actually perceive uniformity right away. for data quality, rely on catch trials / post-hoc response checking instead.
        this.response_type = 'mouse'; // or 'key'
        this.colorCenter = colorC;
        this.colorPeriphery = colorP;
        this.data = {};
        this.on_start = function (trial) {
            if (trial.colorCenter === trial.colorPeriphery || trial.stimuli.length > 0 && trial.colorCenter === trial.stimuli[0].colorPeriphery) {
                trial.response_start_time = 0; // if no color difference, subjects can report uniformity immediately
            };
            trial.data.colorCenter = trial.colorCenter;
            try {
                trial.data.colorPeriphery = trial.stimuli[0].colorPeriphery;
            } catch (err) {
                trial.data.colorPeriphery = trial.colorPeriphery;
            };
            trial.data.response_start_time = trial.response_start_time;
            document.body.style.cursor = 'none';
        };
        this.on_finish = function (data) {
            document.body.style.cursor = 'auto';
            jatos.appendResultData(data); // send each trial's data to JATOS after it finishes, just in case something goes wrong later
        };
        this.canvas_width = get_canvas_width;
        this.canvas_height = get_canvas_height;
    }


    _createClass(colorTrial, null, [{
        key: 'getCurrColorPeriphery',
        value: function getCurrColorPeriphery(trial_or_stimulus) {
            var currColorPeriphery = trial_or_stimulus.colorPeriphery;
            return currColorPeriphery;
        }
    }]);

    return colorTrial;
}();

var fillColorTrial = function (_colorTrial) {
    _inherits(fillColorTrial, _colorTrial);

    function fillColorTrial(colorC, colorP) {
        _classCallCheck(this, fillColorTrial);

        return _possibleConstructorReturn(this, (fillColorTrial.__proto__ || Object.getPrototypeOf(fillColorTrial)).call(this, colorC, colorP));
    }

    _createClass(fillColorTrial, null, [{
        key: 'drawBackground',
        value: function drawBackground(canvas, context, currColorPeriphery) {
            var scalar = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
            var horizOffset = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
            var vertOffset = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

            // optional argument scalar proportionally scales the background; default fills whole screen
            // optional arguments horizOffset and vertOffset move the background within the canvas. center (0, 0). values: -.5 to +.5

            /* coordinates for top left corner */
            var centerX = canvas.width / 2 + horizOffset * canvas.width;
            var centerY = canvas.height / 2 + vertOffset * canvas.height;
            var peripheryWidthPixels = canvas.width * scalar;
            var peripheryHeightPixels = get_canvas_height() * scalar;
            var leftX = centerX - peripheryWidthPixels / 2;
            var topY = centerY - peripheryHeightPixels / 2;

            context.fillStyle = rgb(YxytosRGB(currColorPeriphery));
            context.fillRect(leftX, topY, peripheryWidthPixels, peripheryHeightPixels);
        }
    }, {
        key: 'drawCircCenter',
        value: function drawCircCenter(canvas, context, colorC, currColorPeriphery, circleRadiusDVA) {
            var scalar = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;
            var horizOffset = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
            var vertOffset = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;

            /* draw center circle with soft edges */
            var centerX = canvas.width / 2 + horizOffset * canvas.width;
            var centerY = canvas.height / 2 + vertOffset * canvas.height;
            var circleRadiusInches = dva_to_length(circleRadiusDVA, distance_from_screen);
            var circleRadiusPixels = circleRadiusInches * scalescreen.pixels_per_unit * scalar;
            var frameWidth = circleRadiusPixels * 2 * 0.01 * 6; // soft edge is ~30 pixels wide
            var grad = context.createRadialGradient(centerX, centerY, circleRadiusPixels, centerX, centerY, circleRadiusPixels + frameWidth);
            var colorStopRatio = frameWidth / (frameWidth + circleRadiusPixels);
            grad.addColorStop(colorStopRatio, rgb(YxytosRGB(colorC)));
            grad.addColorStop(1, rgb(YxytosRGB(currColorPeriphery)));
            context.fillStyle = grad;
            context.arc(centerX, centerY, circleRadiusPixels + frameWidth, 0, 2 * Math.PI);
            context.fill();

            drawFixation(canvas, context, scalar, horizOffset, vertOffset);
        }
    }, {
        key: 'generateCircStim',
        value: function generateCircStim(colorC, colorP, circleRadiusDVA) {
            var scalar = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
            var horizOffset = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
            var vertOffset = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

            return {
                obj_type: 'manual',
                colorCenter: colorC,
                colorPeriphery: colorP,
                scalar: scalar,
                horizOffset: horizOffset,
                vertOffset: vertOffset,
                drawFunc: function drawFunc(stimulus, canvas, context) {
                    var currColorPeriphery = colorTrial.getCurrColorPeriphery(stimulus, 0);
                    fillColorTrial.drawBackground(canvas, context, currColorPeriphery, scalar, horizOffset, vertOffset);
                    fillColorTrial.drawCircCenter(canvas, context, stimulus.colorCenter, currColorPeriphery, circleRadiusDVA, scalar, horizOffset, vertOffset);
                }
            };
        }
    }]);

    return fillColorTrial;
}(colorTrial);


var circFillColorTrialIllusion = function (_fillColorTrial3) {
    _inherits(circFillColorTrialIllusion, _fillColorTrial3);

    function circFillColorTrialIllusion(colorC, colorP, circleRadiusDVA) {
        var scalar = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
        var horizOffset = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
        var vertOffset = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

        _classCallCheck(this, circFillColorTrialIllusion);

        var _this4 = _possibleConstructorReturn(this, (circFillColorTrialIllusion.__proto__ || Object.getPrototypeOf(circFillColorTrialIllusion)).call(this, colorC, colorP));

        _this4.data.shape = 'circ';
        _this4.data.centerRadiusDVA = circleRadiusDVA;
        _this4.stimuli = [fillColorTrial.generateCircStim(_this4.colorCenter, _this4.colorPeriphery, circleRadiusDVA, scalar, horizOffset, vertOffset)];
        return _this4;
    }

    return circFillColorTrialIllusion;
}(fillColorTrial);


function generateIllusionStim(params) {
    // params is an array of all the arguments you would normally use to generate the stim
    return fillColorTrial.generateCircStim.apply(fillColorTrial, _toConsumableArray(params));
}

//////// Questions to ask for comprehension before beginning trials ////////
// These questions are repeated until all were answered correctly.
// Feedback is given for each incorrect question.
// First create a global variable called nocomprehension = 0, which tracks how many times they've gotten questions wrong.
// If they answer something wrong 4 times, the experiment ends because they do not understand.
var comprehension_questions_trial = {
    type: 'survey-multi-choice',
    questions: [
        {
            prompt: "<b>When should you click the mouse?</b>",
            options: ["When I see any part of the screen change " + clr + "", "When the entire image looks the same " + clr + "", "When the " + ctr + " and the outside parts are different " + clr + "s"],
            required: true,
            name: 'WhenToClick'
        }, {
            prompt: "<b>What should you do if the entire screen never looks the same " + clr + "?</b>",
            options: ["Click the mouse when I see any part of the screen change " + clr + "", "Do nothing until the image disappears", "Press a different key"],
            required: true,
            name: 'NoUniformityResponse'
        }, {
            prompt: "<b>Where should you focus your eyes while the illusion is onscreen?</b>",
            options: ["Only at the " + ctr + " dot", "Anywhere on the " + clr + "ed screen", "Keep my eyes closed"],
            required: true,
            name: 'EyeLocation'
        }],
    preamble: "<p style='font-size:120%'><b>Please answer a few questions about the experiment.</b></p>",
    on_start: function on_start(trial) {
        document.querySelector('.jspsych-display-element').style.overflowY = 'auto'; // in case questions overflow the y axis
    },
    on_finish: function on_finish(data) {
        data.allcorrect = true; // default to true, but change to false if any answers were wrong
        var responses = JSON.parse(data.responses);
        if (responses.WhenToClick != "When the entire image looks the same " + clr + "") {
            data.allcorrect = false;
        } else if (responses.NoUniformityResponse != "Do nothing until the image disappears") {
            data.allcorrect = false;
        } else if (responses.EyeLocation != "Only at the " + ctr + " dot") {
            data.allcorrect = false;
        }
        if (data.allcorrect == false) {
            // iterate variable counting how many times they've answered wrong. if 5, end the experiment.
            nocomprehension++; // this gives them 4 chances to get each question wrong and receive feedback.
            if (nocomprehension > 4) {
                jsPsych.endExperiment('The experiment was ended because you did not follow the instructions. Please return your submission on Prolific.');
            }
        }
        document.querySelector('.jspsych-display-element').style.overflowY = 'hidden';
    }
};
var comprehension_feedback_trial = {
    type: 'html-keyboard-response',
    stimulus: function stimulus() {
        var last_trial_allcorrect = jsPsych.data.get().last(1).values()[0].allcorrect;
        if (last_trial_allcorrect) {
            // all responses were correct
            return "<p'>Great, you are ready to start the experiment." + '<br><br><br>Please maintain your seating position until the end of the experiment.' + '<br><br>And please remember to keep your eyes on the ' + ctr + ' of the images at all times.' + '<br><br>We will begin with a few practice trials to make sure you understand the task.' + '<br><br>The actual ' + clr + 's may be different across trials.' + '<br><br><br><br>Press the space bar to begin.</p>';
        } else {
            // at least one response was wrong
            var feedback_text = "<p>";
            var responses = JSON.parse(jsPsych.data.get().last(1).values()[0].responses);
            if (responses.WhenToClick != "When the entire image looks the same " + clr + "") {
                feedback_text += '<br><br>You should only click when the entire image looks the same ' + clr + ', not if only part of the image appears to change ' + clr + '.';
            }
            if (responses.NoUniformityResponse != "Do nothing until the image disappears") {
                feedback_text += '<br><br>If you never see the entire image look the same ' + clr + ', you should not press anything.<br>Just wait until the complete illusion finally occurs or until the image disappears from the screen.';
            }
            if (responses.EyeLocation != "Only at the " + ctr + " dot") {
                feedback_text += '<br><br>Keep your eyes focused at the ' + ctr + ' dot at all times.<br>If you move your eyes away from the ' + ctr + ', the illusion will not work.';
            }
            feedback_text += '<br><br><br><br>Please try answering these questions again. Press the space bar.';
            feedback_text += '</p>';
            return feedback_text;
        }
    },
    choices: [' ']

    // loop timeline that repeats if not every question was answered correctly //
}; var comprehension_questions = {
    timeline: [comprehension_questions_trial, comprehension_feedback_trial],
    loop_function: function loop_function(data) {
        var last_trial_allcorrect = jsPsych.data.get().last(2).values()[0].allcorrect;
        if (last_trial_allcorrect) {
            return false;
        } else {
            return true;
        }
    }

    /////////////////////////////////////////////////
    /* questions about phenomenology */

    /* question for trials when subject reported uniformity */
    /* first just ask if center or periphery changed. [NO LONGER: if center, maybe skip the main set of questions] */
}; var uniformity_location_and_persistence_trial = {
    type: 'survey-multi-choice',
    questions: [{
        prompt: "<b>Did the outside change " + clr + ", and/or did the " + ctr + " change " + clr + "?</b>",
        options: ["outside", "" + ctr + "", "Both parts changed", "Both parts were always the same " + clr + ""],
        required: true,
        name: 'ShiftLocation'
    }],
    preamble: "<p style='font-size:120%'><b>Please answer a few questions about what you saw.</b></p>"
};

var both_sides_shift_time_trial = {
    type: 'survey-multi-choice',
    questions: [{
        prompt: "<b>Did one part change before the other?</b>",
        options: ["No, both at the same time", "Center first", "Outside first"],
        required: true,
        name: 'FirstChangedArea'
    }, {
        prompt: "<b>Were the " + clr + " changes instantaneous, or did they fade in over some time?</b>",
        options: ["Instantaneous", "Fade over time"],
        required: true,
        name: 'PhenomenologyDetail'
    }],
    preamble: "<p style='font-size:120%'><b>Please answer a few questions about what you saw.</b></p>"
};
var both_sides_shift_time = {
    timeline: [both_sides_shift_time_trial],
    conditional_function: function conditional_function() {
        var responses = JSON.parse(jsPsych.data.get().last(1).values()[0].responses);
        if (responses.ShiftLocation == "Both parts changed") {
            return true;
        } else {
            return false;
        }
    }

    /* wrap the trial itself into a conditional timeline, that only runs if subject reports that the periphery and/or center changed */
}; var uniformity_shift_start_question = {
    type: 'survey-multi-choice',
    questions: function questions() {
        var question = {
            prompt: "<b>Within the part that changed " + clr + ", where did the change begin?</b> Choose the answer that is closest to what you saw.",
            options: ["The whole area changed " + clr + " at the same time", "It spread out from the " + ctr + "", "It spread inwards from the outside", "It started on one side and moved across", "Unsure"],
            required: true,
            name: 'ShiftStartLocation'
        };
        var responses = JSON.parse(jsPsych.data.get().last(1).values()[0].responses);
        if (responses.ShiftLocation == "" + ctr + "") {
            question.prompt += "<br><i>If you saw a faint ring surrounding the center, please ignore it<br>and answer based only on how the change spread across the surface of the " + ctr + ".</i>";
        }
        return [question];
    },
    preamble: "<p style='font-size:120%'><b>Please answer a few questions about what you saw.</b></p>"
    /* wrap this second question into a conditional timeline, only runs if subject's previous answer requires a follow-up */
}; var uniformity_shift_spread_question_trial = {
    type: 'survey-multi-choice',
    questions: function questions() {
        var question = {
            required: true,
            name: "PhenomenologyDetail"
        }; question.prompt = "<b>Was the " + clr + " change instantaneous, or did it fade in over some time?</b>";
        question.options = ["Instantaneous", "Fade over time"];
        return [question];
    },
    preamble: "<p style='font-size:120%'><b>Please answer a few questions about what you saw.</b></p>"
};
var uniformity_shift_spread_question = {
    timeline: [uniformity_shift_spread_question_trial],
    conditional_function: function conditional_function() {
        // get the data from the previous trial,
        // and check which response was given

        var responses = JSON.parse(jsPsych.data.get().last(1).values()[0].responses);
        if (responses.ShiftStartLocation == "It spread out from the " + ctr + "" || responses.ShiftStartLocation == "It spread inwards from the outside" || responses.ShiftStartLocation == "Unsure" || responses.ShiftStartLocation == "It started on one side and moved across") {
            return false;
        } else {
            return true;
        }
    }
};
var uniformity_shift_questions = {
    timeline: [uniformity_shift_start_question, uniformity_shift_spread_question],
    conditional_function: function conditional_function() {
        // get the data from the previous trial,
        // and check which response was given
        var responses = JSON.parse(jsPsych.data.get().last(1).values()[0].responses);
        if (responses.ShiftLocation == "outside" || responses.ShiftLocation == "" + ctr + "") {
            return true;
        } else {
            return false;
        }
    }
};

var uniformity_phenomenology_questions = {
    timeline: [uniformity_location_and_persistence_trial, both_sides_shift_time, uniformity_shift_questions],
    conditional_function: function conditional_function() {
        // check if there was a response in the previous illusion trial,
        var clickTime = JSON.parse(jsPsych.data.get().filter({ trial_type: 'psychophysics', response_type: 'mouse' }).last(1).values()[0].rt);
        if (clickTime == null) {
            return false;
        } else {
            return true;
        }
    }

}; var nouniformity_slider_trial = {
    type: 'html-slider-response',
    stimulus: "<b>About how much of the screen appeared to change " + clr + "?</b>",
    labels: ['nothing changed', 'the entire screen changed'],
    prompt: 'Please make your best estimate.<br><br>',
    require_movement: true
};

var comments = {
    type: 'survey-text',
    questions: [{
        //prompt: "<b>Do you have any comments or feedback about the experiment? Was anything confusing, difficult, painful, frustrating, etc?</b>",
        prompt: "<b>Could you please describe how the illusion occurred for you?</b>",
        name: 'comments'
    }],
    preamble: "<p style='font-size:120%'><b>Thank you for participating.</b></p>"
};