const simonButtons=["red", "blue", "green", "yellow"];
var orderShown=[];
var orderFollowed=[];

var isGameStarted =false;
var level;
var score;

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
        $(this).fadeIn(75).fadeOut(75).fadeIn(75,()=>{
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
   const delay = 500;

   for(i=0;i<level;i++){
    await new Promise((resolve)=>{
        setTimeout(()=>{
            let generatedIndex = Math.floor(Math.random()*simonButtons.length);
            let buttonSelected = simonButtons[generatedIndex];
            orderShown.push(buttonSelected);
       
            $("#" + buttonSelected).fadeIn(75).fadeOut(75).fadeIn(75,()=>{
                PlayAudio(buttonSelected);
                AnimatePressedButton(buttonSelected);
                resolve();
            });
        },delay); 
    })     
   }
   
   // CREATE SYNCHRONOUS DELAY OF 800 MS ONCE ORDER IS DONE
   await new Promise((resolve)=>{
    setTimeout(()=>{
        $(".message").text(" Continue now ").fadeIn(100).fadeOut(400,()=>{
        EnableSimonButtons();
        resolve();
        })   
    },500);
   });
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
                $(".message").text(" Cheers! Level Up ").fadeIn(100).fadeOut(900,()=>{                                                        
                    resolve();
                });
            }, 100);
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
            $(".message").text(" Oops! Wrong Button ").fadeIn(100).fadeOut(900,()=>{
                resolve();
            });                       
        }, 100);
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

