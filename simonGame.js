var level;
var score;
var started = false;
var i;

var buttoncolors = ["red", "blue", "green", "yellow"];
var gamepattern = [];
var userclickedpattern = []; /* intial value : empty*/

$('.btn').prop('disabled', true);

$('#startButton').on("click", function() {
    if (!started) {
        score = 0;
        level = 0;
        $("#level-title").text("Level :" + level);
        $("#score").text("Score : " + score);
        nextSequence();
        started = true;
    }

});


function nextSequence() { /*this will be called when game has started or user has just leveled up*/
    $(".btn").prop("disabled", true);
    userclickedpattern = []; /*every time, when level will be up , make this empty to store new clicks of user */
    gamepattern = []; /*every time level increase, show new combination, so have to make gamepattern empty*/
    level++; /*increase value of level every time when nextSequence is called*/

    $("#level-title").text("Level : " + level); /* set level */
    $("#whose-turn").text(".. wait ..");
    for (i = 1; i <= level; i++) /*if level=2 ,total colors in combination equals to level(=2) */ {
        setTimeout(function() {
            var randomNo = Math.floor(Math.random() * 4); /* random no between 0 to3 */
            var randomcolor = buttoncolors[randomNo]; /* find random color from buttoncolors array */
            gamepattern.push(randomcolor); /*push color to gamepattern*/
            $("#" + randomcolor).fadeIn(100).fadeOut(100).fadeIn(100); /* show animation to button/color which we get as randomcolor*/
            playSound(randomcolor); /*play sound  to that color*/
            animatePress(randomcolor); /* show decoration on body */
            console.log("Game-Pattern : " + gamepattern);
            $("#whose-turn").text(".. wait ..");
        }, 800 * i);
    }

    setTimeout(function() {
        $("#whose-turn").text("your turn");
        enableButtons();
    }, 1000 * (i - 1));
}

function enableButtons() {
    $('.btn').prop('disabled', false);
}

$(".btn").on("click", function() {
    var userclickedcolor = $(this).attr("id");
    userclickedpattern.push(userclickedcolor);
    playSound(userclickedcolor);
    animatePress(userclickedcolor);
    checksequence(userclickedpattern.length - 1);
});



function checksequence(currentlevel) {
    if (userclickedpattern[currentlevel] === gamepattern[currentlevel]) {
        score += level;
        $("#score").text("Score : " + score);
        if (userclickedpattern.length === gamepattern.length) {
            $("body").addClass("hurray");
            setTimeout(function() {
                $("#whose-turn").text("congrats! Level up");
                $("body").removeClass("hurray");
                playSound("hurray");
            }, 100);
            nextSequence();
        }
    } else {
        playSound("wrong");
        $("#whose-turn").text("oops! pressed wrong button")
        $("#level-title").text("Game Over!");
        started = false;
        level = 0;
        gamepattern = [];
        userClickedPattern = [];
        $("body").addClass("game-over");
        setTimeout(function() {
            $("body").removeClass("game-over");
        }, 100);
    }
}

function playSound(name) { /* play sound */
    var audio = new Audio("Sounds/" + name + ".mp3");
    audio.play();
}

function animatePress(color) { /*show anitmation function according to color*/
    $("#" + color).addClass("pressed");
    setTimeout(function() {
        $("#" + color).removeClass("pressed");
    }, 100);
}
