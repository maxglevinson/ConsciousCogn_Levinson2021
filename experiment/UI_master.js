"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/* trial classes and custom functions are sourced from trialsfunc.js */

/* create timeline */
var timeline = [];

/* initialize a few things */
var nocomprehension = 0;
var redo_practice = 0; // if practice behavior isn't right, this becomes 1 and changes reminder_trial to show a reminder screen before redoing practice.

/* define welcome message and experiment outline */

var welcome = {
    type: 'instructions',
    pages: ["<div id='instructions' style='text-align:left; font-size:100%'><p>Welcome to the experiment.</p>" + "<p>This is a short study investigating how people perceive " + clr + "s. It involves a lot of staring at the screen." + "<br>The study includes these steps:</p>" + "<p><BLOCKQUOTE>1. We ask for your informed consent to participate.<br>" + "2. We explain how to perform the task, and check your understanding with questions and a short practice. (about 3 minutes)<br>" + "3. You complete the experiment. (about 7 minutes)</BLOCKQUOTE></p>" + "<p>In total, the experiment should take about 10-15 minutes. Please do not use the 'back' button on your browser or close the window until you reach the end." + "<br>If you do, the experiment may not work correctly and you will not be able to receive payment.</p></div>", "<p>If you are using a laptop, please turn up your screen brightness to the highest it can go.</p>"],
    allow_keys: false,
    show_clickable_nav: true,
    on_start: function on_start(trial) {
        document.querySelector('#jspsych-progressbar-container').style.display = 'none';
    },
    on_finish: function (data) {
        data.PROLIFIC_PID = jatos.urlQueryParameters.PROLIFIC_PID;
        data.STUDY_ID = jatos.urlQueryParameters.STUDY_ID;
        data.SESSION_ID = jatos.urlQueryParameters.SESSION_ID;
        jatos.submitResultData(data); // initialize data output
        data.TOTAL_HEIGHT = initial_height;
        data.TOTAL_WIDTH = initial_width;
    }

    /* informed consent */
    // these two global variables are adjusted during the consent process, then added to the trial's data
}; var consent_response;
var secondary_data_response;
var consent = {
    type: 'external-html',
    execute_script: true,
    url: 'UI_consent.html',
    cont_btn: 'submit_consent',
    data: {},
    on_start: function on_start(trial) {
        document.querySelector('.jspsych-display-element').style.overflowY = 'auto';
    },
    on_finish: function on_finish(data) {
        document.querySelector('.jspsych-display-element').style.overflowY = 'hidden';
        data.consent = consent_response;
        data.secondary_data_use = secondary_data_response;
        if (data.consent == 'decline') {
            jsPsych.endExperiment('You declined to participate in this experiment. You may now close the window. Please return your submission in Prolific.');
        }
    },
    check_fn: function check_fn(elem) {
        return true;
    }

    /* enter fullscreen (trial ignored if using safari apparently) */
}; var fullscreen_on = false; // default; we need to change this later if we are using fullscreen
fullscreen_on = true;
var fullscreen = {
    type: 'fullscreen',
    message: '<p>Press the button below to enter full screen mode.' + '<br><br> Please do not exit full screen until the experiment is over.</p>',
    button_label: 'Full screen'
};
/* exit fullscreen (trial ignored if using safari apparently) */
var fullscreen_exit = {
    type: 'fullscreen',
    fullscreen_mode: false
};

/* set scaling factor */
var scalescreen = {
    type: 'resize_max_origin',
    item_width: 3 + 3 / 8,
    item_height: 2 + 1 / 8,
    prompt: "<h3> Let's find out what your monitor size is.</h3>" + "<p>Please use any credit card that you have available and hold it up against the screen.<br>" + "(it can also be a membership card, your drivers license, or anything that is of the same format)</p>" + "<p>Click and drag the lower right corner of the box until the box is the same size as your card.</p>" + "<p>(If you don't have access to a real card, you can use a ruler to measure the box width to 3.4inch or 86mm, or make your best guess)</p>" + "<b style='font-style: italic'>Make sure you place the card against your screen.</b><br><br>",
    pixels_per_unit: 100, // 100 pixels per inch
    starting_size: 420,
    on_finish: function on_finish(data) {
        //set text center locations of instructions based on new size of canvas.
        //locations: above stimuli
        instructionsTimeline.timeline[0].stimuli[3].startY = .2 * get_canvas_height() - 70;
        //locations: below stimuli (.5 * height) plus half the height of the text box
        instructionsTimeline.timeline[0].stimuli[4].startY = .5 * get_canvas_height() + 240 / 2;
        instructionsTimeline.timeline[0].stimuli[5].startY = instructionsTimeline.timeline[0].stimuli[4].startY + 15;
        instructionsTimeline.timeline[0].stimuli[6].startY = instructionsTimeline.timeline[0].stimuli[4].startY + 250 / 2 + 60;
        instructionsTimeline.timeline[5].stimuli[2].startY = .5 * get_canvas_height() + 270 / 2 + 10;
        instructionsTimeline.timeline[5].stimuli[3].startY = instructionsTimeline.timeline[5].stimuli[2].startY + 270 / 2 + 60;
    }
};

/* estimate viewing distance */
var virtualChinrest = {
    type: 'external-html',
    execute_script: true,
    url: 'external_virtual_chinrest.html',
    cont_btn: 'continue',
    data: {},
    on_start: function on_start(trial) {
        var el = jsPsych.getDisplayElement();
        trial.data.orig_transformOrigin = el.style.transformOrigin;
        trial.data.new_transformOrigin = "0 0"; // avoid overflow off left and top of screen when resize scale factor > 1
        el.style.transformOrigin = trial.data.new_transformOrigin;
        el.style.margin = '2% auto auto 2%'; // flush to left of screen
        el.style.position = 'fixed';
    },
    on_finish: function on_finish(data) {
        data.distance_mm = chinrestData["viewDistance_mm"];
        var el = jsPsych.getDisplayElement();
        el.style.margin = 'inherit'; // reset back to original
        el.style.position = 'inherit'; // reset back to original
        el.style.transformOrigin = data.orig_transformOrigin; // reset back to original
    },
    check_fn: function check_fn(elem) {
        distance_from_screen = chinrestData["viewDistance_mm"] / 25.4; // convert to inches
        return true;
    }

    /* set default distance from screen, in inches, which will be used if not using virtual chinrest */
}; var distance_from_screen = 30; //24;

////////////  STIMULUS PARAMETERS /////////////
// used in prolific versions
var colorIdx = 0; // 0: blue, 1: red. This is used for demo, practice, and main experiment if only using 1 color.
// final study ended up only using blue.
var colorIdx = jatos.studyJsonInput.colorIdx; // pull current participants' periphery color from JATOS
if (colorIdx == 0) {
    //blue
    var colorPeriphery = [2.5, 0.148, 0.072]; // used for demo
    var colorCenter = [1, 0.148, 0.072];
} else if (colorIdx == 1) {
    // red
    var colorPeriphery = [6.5, 0.59, 0.33];
    var colorCenter = [3, 0.59, 0.33];
}

///////// TRIALS ///////////

var fixTrial = Object.assign({}, fixationTrial);
fixTrial.trial_duration = 1000;

/* demonstration trials */
// get display height to calculate text positions; this will change if we use resize plugin
// check if keys are allowed in fullscreen mode (NO = SAFARI)
var keyboardNotAllowed = typeof Element !== 'undefined' && 'ALLOW_KEYBOARD_INPUT' in Element;
if (keyboardNotAllowed | fullscreen_on == false) {
    // This is Safari, and keyboard events will be disabled. fullscreen is not allowed, so we can just take the window height.
    var initial_height = window.innerHeight;
    var initial_width = window.innerWidth; // widths are just reported with data; not used in calculations
} else {
    // take fullscreen height
    var initial_height = screen.height;
    var initial_width = screen.width; // widths are just reported with data; not used in calculations
}

var instructionsTimeline = UI_getInstructions(experiment);

/* a few practice trials to check performance
make sure that highest RT > mean of middle RTs > lowest RT */
var practiceColorCenter = [].concat(colorCenter);
var practiceColorsPeripheries = [[].concat(_toConsumableArray(practiceColorCenter)), [].concat(_toConsumableArray(practiceColorCenter)), [].concat(_toConsumableArray(practiceColorCenter))]; // only 3 trials, [...practiceColorCenter], [...practiceColorCenter]];
if (colorIdx == 0) {
    var practiceLuminancesPeripheries = [practiceColorCenter[0], 1.3, 2];
} else if (colorIdx == 1) {
    var practiceLuminancesPeripheries = [practiceColorCenter[0], 3.9, 6];
}
// 1st array gives same color in center and periphery. then change luminance of the others:
practiceColorsPeripheries[0][0] = practiceLuminancesPeripheries[0]; // low difference (no difference)
practiceColorsPeripheries[1][0] = practiceLuminancesPeripheries[1]; // mid distance 1
practiceColorsPeripheries[2][0] = practiceLuminancesPeripheries[2]; // high difference
shuffleArray(practiceColorsPeripheries);
var practiceCenterRadiusDVA = 6;
// if practice behavior fails three times, experiment ends.
var check_exit_practice_trial = {
    type: 'call-function',
    func: function func() {
        if (redo_practice == 3) {
            jsPsych.endExperiment('You are not performing the task correctly, so we have ended the experiment. Please return your submission on Prolific.');
        }
    }
};

var reminder_trial = {
    type: 'html-keyboard-response',
    stimulus: function stimulus() {
        if (redo_practice) {
            return "<p>Let's try these practice trials one more time." + "<br>REMEMBER: Stare at the " + ctr + " dot until the " + ctr + " and outside " + clr + "s look the same. Then click the mouse." + "<br>If the whole screen never ends up looking the same " + clr + ", don't click the mouse.</p>" + "<br><br><p>Press the space bar to continue.</p>";
        } else {
            return '';
        }
    },
    trial_duration: function trial_duration() {
        if (redo_practice) {
            return null;
        } else {
            return 0; // if first attempt at practice, don't show any instructions
        }
    },
    choices: ' '
};

var params = [practiceColorCenter, null];
params.push(practiceCenterRadiusDVA);
var practiceTrials = {
    timeline: [check_exit_practice_trial, reminder_trial, {
        timeline: [startTrial, fixTrial, generateTrial('illusion', params), noiseTrial, moveBlinkTrial, uniformity_phenomenology_questions]
    }]
};

practiceTrials.timeline[2].timeline_variables = [];
delete practiceTrials.timeline[2].timeline[0].on_start;
delete practiceTrials.timeline[2].timeline[2].colorPeriphery;
for (var i = 0; i < practiceColorsPeripheries.length; i++) {
    var currStimulus = Object.assign({}, practiceTrials.timeline[2].timeline[2].stimuli[0]);
    currStimulus.colorPeriphery = practiceColorsPeripheries[i];
    practiceTrials.timeline[2].timeline_variables.push({ stimuli: [currStimulus] });
}
practiceTrials.timeline[2].timeline[2].stimuli = jsPsych.timelineVariable('stimuli');
practiceTrials.loop_function = function (data) {
    console.log(data.values());
    var values = data.filterCustom(function (tr) {
        return 'colorPeriphery' in tr;
    }).values();
    var low_idx = values.findIndex(function (tr) {
        return tr.colorPeriphery[0] === Math.min.apply(Math, practiceLuminancesPeripheries);
    });
    if (values[low_idx].rt == null) {
        values[low_idx].rt = 15000;
    }
    var low_rt = values[low_idx].rt;
    var high_idx = values.findIndex(function (tr) {
        return tr.colorPeriphery[0] === Math.max.apply(Math, practiceLuminancesPeripheries);
    });
    if (values[high_idx].rt == null) {
        values[high_idx].rt = 15000;
    }
    var high_rt = values[high_idx].rt;
    var mid_mean_rt = function mid_mean_rt() {
        var rt_sum = 0 - low_rt - high_rt;
        for (var i = 0; i < practiceColorsPeripheries.length; i++) {
            if (values[i].rt == null) {
                values[i].rt == 15000;
            }
            rt_sum += values[i].rt;
        }
        return rt_sum / (practiceColorsPeripheries.length - 2);
    };
    console.log(low_rt);
    console.log(high_rt);
    console.log(mid_mean_rt());
    if (low_rt < high_rt) {
        // don't require that mid_mean < high, because maybe they see no illusion in the mids
        // and don't require that low < mid, because maybe afterimage makes low take a bit longer
        // but they are required to press on low - so low has to be less than high.
        return false;
    } else {
        redo_practice += 1;
        return true;
    }
};

////////// EXPERIMENT TRIALS. /////////

// a list of possible center colors. each participant gets one of these randomly.
// periphery colors: n arrays of m colors, where n is the number of possible center colors. each of n arrays contains the set of possible periphery colors for each trial.
var possibleCenterColors = [[1, 0.148, 0.072], [3, 0.59, 0.33]]; // blue or red
var possiblePeripheryColors = [[[1.2, 0.148, 0.072], [1.35, 0.148, 0.072], [1.5, 0.148, 0.072], [1.65, 0.148, 0.072]], // blue
[[3.5, 0.59, 0.33], [4, 0.59, 0.33], [4.5, 0.59, 0.33], [5, 0.59, 0.33]] // red
];

// for one color only
var expColorCenter = possibleCenterColors[colorIdx];
var colorsPeripheries = possiblePeripheryColors[colorIdx];

var nTrialsPerColor = 20;
var peripheryColorIdx = 1;
var peripheryColorIdx = jatos.studyJsonInput.peripheryColorIdx; // uncomment when using JATOS
if (peripheryColorIdx == -1) {
    // if setting periphery = center (physical uniformity)
    var expColorsPeripheriesArray = repeatArray([expColorCenter], nTrialsPerColor);
} else {
    var expColorsPeripheriesArray = repeatArray([colorsPeripheries[peripheryColorIdx]], nTrialsPerColor); // force a color
}
// add 3 catch trials: two with same as center, one with large difference (at end)
// if main task = physical uniformity, then catch trials instead are illusion trials
var largeDiffColors = [[2, 0.148, 0.072], [6, 0.59, 0.33]]; // blue or red
if (peripheryColorIdx == -1) {
    // if setting periphery = center (physical uniformity)
    var catchTrialColor = colorsPeripheries[1]; // the 2nd periphery color (e.g. blue: 1.35 luminance)
    expColorsPeripheriesArray.splice(3, 0, catchTrialColor); expColorsPeripheriesArray.splice(9, 0, catchTrialColor); expColorsPeripheriesArray.splice(18, 0, catchTrialColor); // add 3 catch trials with a difference (in middle)
    // ^ an extra catch trial added to make sure subjects continue looking for the illusion
} else {
    var catchTrialColor = expColorCenter;
    expColorsPeripheriesArray.splice(9, 0, catchTrialColor); expColorsPeripheriesArray.splice(18, 0, catchTrialColor); // add 2 catch trials with no difference (in middle)
}
expColorsPeripheriesArray.push(largeDiffColors[colorIdx]); // add 1 catch trial - two no difference (in middle), one huge difference (at end)
var nTrials = expColorsPeripheriesArray.length;
var expColorsCentersArray = repeatArray([expColorCenter], nTrials);

// ALSO SELECT FROM POSSIBLE CENTER SIZES. Each participant gets 1 size for the whole experiment.
// note that the demo / practice trials are different: these are fixed to make sure illusion occurs for everyone.
//var possibleCenterRadiusDVAs = [2, 3, 4, 5, 6];
//var expCenterRadiusDVA = possibleCenterRadiusDVAs[getRandomInt(1, possibleCenterRadiusDVAs.length) - 1];
var expCenterRadiusDVA = jatos.studyJsonInput.expCenterRadiusDVA; // pull from JATOS

function generateTrial(condition, params) {
    // params is an array of all the arguments you would normally use to generate the stim
    if (condition == 'illusion') {
        return new (Function.prototype.bind.apply(circFillColorTrialIllusion, [null].concat(_toConsumableArray(params))))();
    }
}

var expTrials = [];
for (var trial = 0; trial < nTrials; trial++) {
    expTrials.push(startTrial, fixTrial);
    var params = [expColorsCentersArray[trial], expColorsPeripheriesArray[trial]];
    params.push(expCenterRadiusDVA);
    expTrials.push(generateTrial('illusion', params));
    expTrials.push(noiseTrial, moveBlinkTrial);
    expTrials.push(uniformity_phenomenology_questions);
}

var beginExperimentInstructions = { // instructions directly before beginning actual experiment
    type: 'html-keyboard-response',
    stimulus: "<p style='font-size:100%; font-family:Arial'>You will now begin the actual experiment.</p>" + "<p style='font-size:100%; font-family:Arial'>You will view the illusion " + nTrials + " times.</p>" + "<br><p style='font-size:100%; font-family:Arial'>Focus your eyes on the " + ctr + " dot, and click when the whole screen looks the same " + clr + " to you.</p>" + "<br><p style='font-size:100%; font-family:Arial'>Try to notice how the color change spreads across the image." + "<br>After you view each image, you will answer a few questions about what you saw.</p>" + "<br><p style='font-size:100%; font-family:Arial'>It is important that you perform the task appropriately. Otherwise, your payment may be withheld.",
    prompt: "<br><br><br><p style='font-size:100%; font-family:Arial'>Press the space bar to begin.</p>",
    trial_duration: null,
    choices: ' ',
    on_start: function on_start(trial) {
        document.body.style.cursor = 'none';
    },
    on_finish: function on_finish(data) {
        document.body.style.cursor = 'auto';
    }
}

/* create timeline */
timeline.push(welcome); // welcome message
timeline.push(consent);
timeline.push(fullscreen); // enter fullscreen
timeline.push(scalescreen); // resize with credit card
timeline.push(virtualChinrest); // calculate viewing distance
timeline.push(instructionsTimeline); // demo and instructions of experiment
timeline.push(comprehension_questions); // test comprehension of the experiment before beginning
timeline.push(practiceTrials); // practice trials
timeline.push.apply(timeline, [beginExperimentInstructions].concat(expTrials)); // the timeline containing actual experiment trials
timeline.push(comments); // feedback question
timeline.push(fullscreen_exit); // exit fullscreen

/* run experiment */
jsPsych.init({
    timeline: timeline,
    show_progress_bar: true,
    exclusions: { // make sure screen is big enough
        min_width: 900
        //min_height: 600
    },
    on_finish: function on_finish() {
        document.querySelector('.jspsych-display-element').style.overflowY = 'auto';
        var resultJson = jsPsych.data.get().json();
        jatos.submitResultData(resultJson);
        var conditionString = "size: " + expCenterRadiusDVA + " shade: " + peripheryColorIdx + "";
        if (nocomprehension > 4 || redo_practice == 3 || jsPsych.data.get().select('consent').values[0] == "decline") {
            var redirect = false;
            jatos.endStudyAjax(redirect, conditionString);
        } else {
            var redirect = true;
            jatos.endStudy(redirect, conditionString);
        }
    }
});

////////// /* get instructions */ ////////////

// input argument is a string specifying the experiment type
// output is an array of timeline variables to display the instructions
function UI_getInstructions(experiment) {
    var instructions_delay = 3000; // how much time to wait in between sets of instructions
    var demoInstructionsPreAbove = { // instructions above stimuli
        obj_type: 'text',
        content: 'In this experiment you will view a visual illusion many times, shown in the left panel below.' + '\nThe ' + ctr + ' is a different ' + clr + ' than the background.',
        startX: 'center',
        startY: .2 * initial_height - 70,
        font: '100% Arial',
        text_space: 30
    };
    var maintext = 'Your job: Stare at the ' + ctr + ' until the entire screen looks the same ' + clr + ', then click your mouse right away.' + '\nTry your best not to move your eyes or blink while viewing the illusion.';
    var demoInstructionsPreMain = { // main instruction for experiment in bold text: click when uniform.
        obj_type: 'text',
        content: maintext,
        startX: 'center',
        startY: .5 * initial_height + 125, // in the middle of the demoInstructionsPre text
        font: 'bold 110% Arial',
        text_space: 30,
        show_start_time: instructions_delay
    };
    var demoInstructionsPreBelow = { // instructions below stimuli
        obj_type: 'text',
        content: 'If you stare at the ' + ctr + ' for a few seconds, it will look like the two ' + clr + 's merge together.' + '\nThe image will then appear only one color, like what is shown on the right.' + '\n\n\n\nWe will also ask some questions about how you see the colors change.',
        startX: 'center',
        startY: .5 * initial_height + 240 / 2, // ~1 inch below stimulus
        font: '100% Arial',
        text_space: 30,
        show_start_time: instructions_delay
    };

    var demo_trialInstructions = { // instructions directly before showing demo stimulus
        type: 'html-keyboard-response',
        stimulus: "<p style='font-size:100%; font-family:Arial'><b>EXAMPLE IMAGE</b></p>" + "<p style='font-size:100%; font-family:Arial'>The image will appear shortly and fill the whole screen.</p>" + "<p style='font-size:100%; font-family:Arial'>Eventually, the whole screen should look the same " + clr + " to you.</p>" + "<p style='font-size:100%; font-family:Arial'>It may take several seconds for the illusion to occur.</p>" + "<br><p style='font-size:100%; font-family:Arial'>IMPORTANT: This only works if you keep your eyes focused on the center dot at all times.</p>" + "<br><p style='font-size:100%; font-family:Arial'>Feel free to look at this example for as long as you like.</p>" + "<p style='font-size:100%; font-family:Arial'>Once you become familiar with the illusion and are ready to move on, <b>click the mouse.</b></p>",
        prompt: "<br><br><br><p style='font-size:100%; font-family:Arial; color:grey'>Press the space bar to begin.</p>", // set to background color so it's invisible
        trial_duration: instructions_delay * 2,
        choices: jsPsych.NO_KEYS,
        on_start: function on_start(trial) {
            document.body.style.cursor = 'none';
        },
        on_finish: function on_finish(data) {
            document.body.style.cursor = 'auto';
        }
    };
    var demo_trialInstructionsWithSpace = Object.assign({}, demo_trialInstructions); // copy of instructions, while now allowing subject to press space bar to move on
    demo_trialInstructionsWithSpace.prompt = "<br><br><br><p style='font-size:100%; font-family:Arial'>Press the space bar to begin.</p>", // now visible
        demo_trialInstructionsWithSpace.trial_duration = null;
    demo_trialInstructionsWithSpace.choices = ' ';

    var demoInstructionsPost = { // next screen of instructions, explaining when NOT to click
        obj_type: 'text',
        content: 'Sometimes the image will only change a little, like in the image on the left.' + "\nThis is normal. If the illusion doesn't fully occur, just don't click. Wait until the image disappears." + '\n\nAlso, sometimes the whole screen will look the same ' + clr + ' immediately when it appears.\nIf this happens, you must click right away.',
        startX: 'center',
        startY: .5 * initial_height + 270 / 2,
        font: '100% Arial',
        text_space: 30
    };
    var spaceToContinue = {
        obj_type: 'text',
        content: 'Press the space bar to continue.',
        startX: 'center',
        startY: .9 * initial_height, // bottom of screen
        font: '100% Arial',
        show_start_time: instructions_delay * 2
    };
    var spaceToTryIllusion = Object.assign({}, spaceToContinue);
    spaceToTryIllusion.content = 'Press the space bar to try the illusion.';

    var spaceToBeginExperiment = Object.assign({}, spaceToContinue);
    spaceToBeginExperiment.content = 'Press the space bar to begin the experiment.';

    // demos and instructions
    var demoColorCenter = [].concat(colorCenter);
    var demoColorPeriphery = [].concat(demoColorCenter);
    demoColorPeriphery[0] += 1; // make the color difference a bit easier to see
    var exampleColorCenter = [].concat(demoColorCenter);
    var exampleColorPeriphery = [].concat(exampleColorCenter);
    if (colorIdx == 0) {
        exampleColorPeriphery[0] = 1.3;
    } else if (colorIdx == 1) {
        exampleColorPeriphery[0] = 3.9;
    } var demoTrialPre = new fillColorTrial(colorCenter, demoColorPeriphery);
    var leftparams = [demoColorCenter, demoColorPeriphery];
    leftparams.push(5);
    leftparams.push(0.3, -.25, -.15);
    demoTrialPre.stimuli = [generateIllusionStim(leftparams)]; // pre-illusion example
    var rightparams = [].concat(leftparams);
    rightparams[1] = colorCenter; // make center and periphery equal
    rightparams[rightparams.length - 2] = .25; // change xoffset to right side
    demoTrialPre.stimuli.push(generateIllusionStim(rightparams)); // post-illusion example
    demoTrialPre.stimuli[1].show_start_time = instructions_delay; // after 2 seconds of looking at illusion example, show the effect
    demoTrialPre.stimuli.push(generateArrowStim(20, -.15)); // arrow in between two examples, indicating illusory change
    demoTrialPre.stimuli[2].show_start_time = instructions_delay;
    demoTrialPre.stimuli.push(demoInstructionsPreAbove); // instructions above stimuli
    demoTrialPre.stimuli.push(demoInstructionsPreBelow); // instructions below stimuli
    demoTrialPre.stimuli.push(demoInstructionsPreMain); // main point of instructions in bold text
    demoTrialPre.stimuli.push(spaceToTryIllusion);
    demoTrialPre.response_start_time = instructions_delay * 2; // subjects cannot proceed until spaceToContinue text appears
    demoTrialPre.trial_duration = null;
    demoTrialPre.response_type = 'key';
    demoTrialPre.choices = ' ';

    var params = [exampleColorCenter, exampleColorPeriphery];
    params.push(6);
    var demoTrial = generateTrial('illusion', params);
    demoTrial.response_start_time = instructions_delay; // minimum 5s after stimulus begins
    demoTrial.trial_duration = null;

    var almostColorCenter = [].concat(demoColorCenter);
    almostColorCenter[0] = almostColorCenter[0] + .3; // for instruction to NOT click even if colors are very very similar
    var demoTrialPost = new fillColorTrial(demoColorCenter, almostColorCenter);
    var almostleftparams = [].concat(leftparams);
    almostleftparams[1] = almostColorCenter;
    demoTrialPost.stimuli = [generateIllusionStim(almostleftparams), generateIllusionStim(rightparams)];
    demoTrialPost.stimuli.push(demoInstructionsPost);
    demoTrialPost.stimuli.push(spaceToContinue);
    demoTrialPost.response_start_time = instructions_delay * 2; // subjects cannot proceed until spaceToContinue text appears
    demoTrialPost.response_type = 'key';
    demoTrialPost.choices = ' ';
    demoTrialPost.trial_duration = null;
    var instructionsTimeline = {
        timeline: [demoTrialPre, demo_trialInstructions, demo_trialInstructionsWithSpace, demoTrial, uniformity_location_and_persistence_trial, demoTrialPost]
    };
    return instructionsTimeline;
}