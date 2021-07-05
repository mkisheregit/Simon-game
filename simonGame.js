
var level = 0;  /* starting level will be zero*/
var score = 0;  /* intial score will be zero*/
var started=false;   /* boolean to check whether game has started or not */
var i;  /* for loop , intialize i*/

/* use 4 buttons to choose random colors to  show user pattern or combination*/
var buttoncolors=["red","blue","green","yellow"];

/* gamepattern: combination of colors' array which screen will show to user*/
var gamepattern=[]; /* intial value : empty*/

/* userclickedpattern: array   formed by clicks of users */
var userclickedpattern=[]; /* intial value : empty*/

/* if user has pressed any key: game has started */
$(document).keypress(function(){
   if(!started){
     $("#level-title").text("Level :" + level); /* show level to screen*/
     $("#score").text("Score : " + score);    /* show score to screen*/
     nextSequence();       /* call this and it will create and show combination of colors according to game level */
     started=true;  /*once game has started, make startd true so that further key press would not start game from zer0 level*/
   }
  });


  function nextSequence() { /*this will be called when game has started or user has just leveled up*/

      userclickedpattern=[]; /*every time, when level will be up , make this empty to store new clicks of user */
      gamepattern=[]; /*every time level increase, show new combination, so have to make gamepattern empty*/
      level++;  /*increase value of level every time when nextSequence is called*/

       $("#level-title").text("Level : " + level); /* set level */
      $("#whose-turn").text(".. wait ..");
       for(i=1;i<=level;i++)   /*if level=2 ,total colors in combination equals to level(=2) */
       {
         setTimeout(function(){
             var randomNo = Math.floor(Math.random()*4); /* random no between 0 to3 */
             var randomcolor=buttoncolors[randomNo]; /* find random color from buttoncolors array */
             gamepattern.push(randomcolor); /*push color to gamepattern*/
             $("#"+randomcolor).fadeIn(100).fadeOut(100).fadeIn(100); /* show animation to button/color which we get as randomcolor*/
             playSound(randomcolor); /*play sound  to that color*/
             animatePress(randomcolor); /* show decoration on body */
             console.log("Game-Pattern : " + gamepattern);
             $("#whose-turn").text(".. wait .."); /* screen has not finished yet of displaying colors/buttons*/
          },1500*i);/*give time to consecutive buttons/colors */
       }

  setTimeout(function(){
    $("#whose-turn").text("your turn");
  },1800*(i-1)); /*when finished off displaying pattern, infrom user its his turn after 300ms*/
}



 $(".btn").on("click",function(){
   var userclickedcolor= $(this).attr("id");  // we are accessing clicked button property with attri function.
   userclickedpattern.push(userclickedcolor); /*push clicked button/color into userclickedpattern */
  // console.log(userclickedpattern);
   playSound(userclickedcolor);  /*play sound on clicking*/
   animatePress(userclickedcolor); /* show animation*/
   checksequence(userclickedpattern.length-1); /* check whether our current clicked color mathchs the pattern or not*/
 });



function checksequence(currentlevel){

  if(userclickedpattern[currentlevel] === gamepattern[currentlevel]){  /* if ith postions of gamepattern and userclickedpattern is same we are good*/
     score +=level; /* increase score (user will get points equal to level on each correct click if user is at level 5 he can get 5 point on each correct click , if level is 4 ,he will get 4)*/
     $("#score").text("Score : " + score);
    //console.log("success");
    //console.log("user-pattern : " + userclickedpattern);
     if(userclickedpattern.length === gamepattern.length){ /*if length of both array equals, user clicked all colors correctly so time to increase level */
         $("body").addClass("hurray"); /* add class hurray to show animation to body */
         setTimeout(function(){$("#whose-turn").text("congrats! Level up");
         $("body").removeClass("hurray");
         playSound("hurray");} /*play sound hurray*/
         ,100);/* after 100 ms remove animation form body*/
         nextSequence(); /* call nextSequence*/
      }
  }
  else{
    playSound("wrong"); /*wrong key is pressed play wrong sound*/
    //console.log("fail");
    $("#whose-turn").text("oops! pressed wrong key")
    $("#level-title").text("Game Over! Press any key to restart");
    started=false;/*make everything equal to starting of game*/
    level=0;
    gamepattern=[];
    userClickedPattern=[];
    $("body").addClass("game-over");
    setTimeout(function(){
      $("body").removeClass("game-over");
    },100);
  }
}

function playSound(name){  /* play sound */
  var audio= new Audio("https://raw.githubusercontent.com/mkisheregit/simon-game/master/Sounds/"+name+".mp3");
  audio.play();
}

function animatePress(color){ /*show anitmation function according to color*/
  $("#" + color).addClass("pressed");

  setTimeout(function(){
    $("#" + color).removeClass("pressed");
  },100);
}
