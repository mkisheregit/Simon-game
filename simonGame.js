const simonButtons=["red", "blue", "green", "yellow"];
var orderShown=[];
var orderFollowed=[];

var isGameStarted =false;
var level;
var score;
var buttonAnimationDelay=1100;
var patternDelay = 1000;

// DISABLE BUTTONS WHEN WINDOW ONLOAD
DisableSimonButtons();

$("#playButton").on("click",()=>{
    if(isGameStarted==false){
       level=0;
       score=0; 
       UpdateLevel(level);
       UpdateScore(score);
       isGameStarted=true;
       CreateNewOrder();
       $("#playButton").css("visibility","hidden");
       $(".score-container").css("margin","0 0 0 6rem");
    }
})

$(".btn").on("click",async function(){
    const buttonPressed = $(this).attr("id");
    new Promise((resolve)=>{
        $(this).fadeIn(200).fadeOut(200).fadeIn(200,()=>{
            resolve();
        });
    })  
    orderFollowed.push(buttonPressed);
    let isCorrect = CheckOrderFollowed(orderFollowed.length-1);
    if(isCorrect){
        AnimateButtonAfterCorrectPress();
    }else{
        AnimateButtonAfterWrongPress();
    }
})

async function CreateNewOrder(){
   // DISABLE BUTTONS WHEN PATTERN/ORDER IS BEING CREATED 
   DisableSimonButtons();

   orderShown=[];
   orderFollowed=[];
   level++;
   
   UpdateLevel(level);

   for(i=0;i<level;i++){
    await new Promise((resolve)=>{
        setTimeout(()=>{
            let generatedIndex = Math.floor(Math.random()*simonButtons.length);
            let buttonSelected = simonButtons[generatedIndex];
            orderShown.push(buttonSelected);
       
            $("#" + buttonSelected).fadeIn(100).fadeOut(100).fadeIn(100,()=>{
                PlayAudio(buttonSelected);
                AnimatePressedButton(buttonSelected);
                resolve();
            });
        },buttonAnimationDelay); 
    })  
   }
   
   // CREATE SYNCHRONOUS DELAY OF 500 MS ONCE ORDER IS DONE
   await new Promise((resolve)=>{
    setTimeout(()=>{
        EnableSimonButtons();
        resolve();  
    },patternDelay);
   });
   patternDelay+=100;
}

function CheckOrderFollowed(currentIndex){
    if(orderFollowed[currentIndex] !== orderShown[currentIndex])
    return false;
    else 
    return true;
}

async function AnimateButtonAfterCorrectPress(){
    score += level;
    UpdateScore(score); 

    if (orderFollowed.length === orderShown.length) {
        $("body").addClass("hurray");
        PlayAudio("hurray"); 
        new Promise((resolve)=>{
            setTimeout(()=>{
                orderFollowed=[];        
                CreateNewOrder();
                $("body").removeClass("hurray");                                                      
                    resolve();                
            }, 175);
        })       
    }
    else{
        PlayAudio(orderFollowed[orderFollowed.length-1]);
    }
}

async function AnimateButtonAfterWrongPress(){
    $("body").addClass("game-over");
    PlayAudio("wrong");
    $("#level").text("Game Over!");
    $("#playButton").text("RESTART");
    new Promise((resolve)=>{
        setTimeout(function() {
            $("body").removeClass("game-over");
            DisableSimonButtons();
            isGameStarted = false;
            orderShown=[];
            orderFollowed=[];    
            $("#playButton").css("visibility","visible");
            resolve();                     
        }, 175);
    });
}

// UTILITY FUNCTIONS 
function PlayAudio(buttonSelected) { 
    var audio = new Audio("https://raw.githubusercontent.com/mkisheregit/simon-game/master2/Sounds/"+buttonSelected+".mp3");
    audio.play();
}

function AnimatePressedButton(color) { 
    $("#"+color).addClass("pressed");
    setTimeout(function() {
        $("#"+color).removeClass("pressed");
    }, 100);
}

 function DisableSimonButtons(){
    $(".btn").prop("disabled",true);
}

 function EnableSimonButtons(){
    $(".btn").prop("disabled",false);
}

 function UpdateLevel(level){
    $("#level").html("Level : <b>"+level+"</b>");
}

 function UpdateScore(score){
    $("#score").html("Score : <b>"+score+"</b>");
}

