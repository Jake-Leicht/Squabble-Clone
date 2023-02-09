/*Variables*/
//*Pages*//
var mainPage = $("#main-content-page");
var blitzPage = $("#blitz-btn-page-content").hide();
var royalePage = $("#squabbleRoyale-btn-page-content").hide();
var guestPage = $("#guest-btn-page-content").hide();
var settingsPage = $("#settings-btn-page-content").hide();
var howToPlayPage = $("#how-to-play-container").hide();
var comingSoonPage = $("#comingSoon-container").hide();
var gamePage = $("#gamePage-container").hide();

/*color blind icon*/
var colorBlindGameIcon = $(".colorBlind-icon-game").hide();
var colorBlindIcon = $(".colorBlind-icon").hide();

/*Other Variables*/
var isGameVisible = false;

/*Button*/
var mainToBlitz = $("#blitz-container-btn");
var blitzToMain = $("#blitz-to-main");
var mainToRoyale = $("#royale-container-btn");
var royaleToMain = $("#royale-to-main");
var mainToGuest = $("#guest-btn");
var guestToMain = $("#arrow-icon-guest-to-main-page");
var mainToSettings = $("#settings-btn");
var settingsToMain = $("#settings-to-main-page");
var mainToHowToPlay = $("#how-to-play-btn");
var howToPlayToMain = $("#howToPlay-close-btn");

/*Word selection*/
const wordList = 
["repos", "clone", "guest", "stair", "mucks",
    "crows", "zebra", "point", "hairs", "exits"];
var rand = 0;
var max = wordList.length - 1;
var word = wordList[0];

/*word input*/
var key;
var letter = "";
var guess = "";
var guessCount = 0;
var letterCount = 0;

var letterRows = [$("#letter-container-row-1"), 
    $("#letter-container-row-2"), 
    $("#letter-container-row-3"), 
    $("#letter-container-row-4"),
    $("#letter-container-row-5"),
    $("#letter-container-row-6")];

var selectedRow = letterRows[0];
var children = "";
var validLetterCount = 0;
var letterCorrectCount = 0;

const lettersInWord = 5;
const guessesInGame = 6;

var iconId = "";

/*select initial input field*/
var autoSelect = "";

var rightLocation = "var(--rightLetter)";
var rightLetter = "var(--wrongLocation)";

$(document).ready(function() {
    /*Changing Pages*/
    $("button").click(function(){
        switch(this.id){
            case "blitz-btn":
                switchPages(mainPage, blitzPage);
                break;
            case "blitz-to-main":
                switchPages(blitzPage, mainPage);
                break;
            case "squabbleRoyale-btn":
                switchPages(mainPage, royalePage);
                break;
            case "royale-to-main":
                switchPages(royalePage, mainPage);
                break;
            case "guest-btn":
                switchPages(mainPage, guestPage);
                break;
            case "arrow-icon-guest-to-main-page":
                switchPages(guestPage, mainPage);
                break;
            case "settings-btn":
                switchPages(mainPage, settingsPage);
                break;
            case "settings-to-main-page":
                switchPages(settingsPage, mainPage);
                break;
            case "how-to-play-btn":
                switchPages(mainPage, howToPlayPage);
                break;
            case "howToPlay-close-btn":
                switchPages(howToPlayPage, mainPage);
                break;
            case "comingSoon-btn":
                switchPages(mainPage,comingSoonPage);
                break;
            case "comingSoon-close-btn":
                switchPages(comingSoonPage, mainPage);
                break;
            /*Game page links*/
            case "createGame-blitzPage-btn":
                blitzPage.hide();
                gamePage.show();
                isGameVisible = true;
                beginGame();
                document.getElementById("header-top").style.top = "-60px";
                document.getElementById("header-bottom").style.top = "-60px";
                break;
            case "royalePage-createGame-btn":
                royalePage.hide();
                gamePage.show();
                isGameVisible = true;
                beginGame();
                document.getElementById("header-top").style.top = "-60px";
                document.getElementById("header-bottom").style.top = "-60px";
                break;
            case "game-to-main-btn":
                gamePage.hide();
                mainPage.show();
                isGameVisible = false;
                resetGame();
                document.getElementById("header-top").style.top = "0px";
                document.getElementById("header-bottom").style.top = "0px";
                break;
            case "wordSelect-btn":
                resetGame();
                wordGenerator();
                break;
        }
    });

    /*darkMode code*/
    if ($("input:checkbox").change(function() {
            if ($("#darkMode-btn").is(":not(:checked)")) {
                document.documentElement.style.setProperty("--backgroundColor", "#bda5c7");
            } else {
                document.documentElement.style.setProperty("--backgroundColor", "black");
            }
        }));

    /*colorBlind code*/
    if ($("input:checkbox").change(function() {
            if ($("#colorBlindMode-btn").is(":not(:checked)")) {
                colorBlindIcon.hide();
                $(".right-letter").css("background-color", "var(--rightLetter)");
                $(".wrong-position").css("background-color", "var(--wrongLocation)");
            } else {
                colorBlindIcon.show();
                $(".right-letter").css("background-color", "var(--colorBlindRightLetter)");
                $(".wrong-position").css("background-color", "var(--colorBlindWrongLocation)");
                rightLocation = "var(--colorBlindRightLetter)";
                rightLetter = "var(--colorBlindWrongLocation)";
            }
    }));

    /*Game JS*/
    function wordGenerator(){
        rand = Math.round(Math.random() * max);
        word = wordList[rand];
        return word;
    }

    function resetGame(){
        /*Reset background cell colors*/
        $(".game-letter").css("background-color", "#aa70fc");
        /*Reset letters to null*/
        for (let i = 0; i < guessesInGame; i++){
            for (let j = 0; j < lettersInWord; j++){
                selectedRow = letterRows[i];
                children = selectedRow.children().children("input");
                letter = children[j].value = null;
            }
        }
        /*Reset Input rows*/
        for (let i = 0; i < letterRows.length; i++){
            selectedRow = letterRows[i];
            disableInput();
        }
        selectedRow = letterRows[0];
        enableInput();
        /*Reset count*/
        guessCount = 0;
        /*Reset icons*/
        $(".colorBlind-icon-game").hide();
        /*Reset console*/
        console.clear();
    }

    function beginGame(){
        if(isGameVisible === true){
            hasAutoSelect(document.getElementById("1x1"));
            wordGenerator();
            $(window).keypress(function(e){
                key = e.which
                if(key === 13){
                    disableInput();
                    children = selectedRow.children().children(".game-letter");
                    for (let i = 0; i < children.length; i++){
                        letter = children[i].value.toLowerCase();

                        if(validCharacter(letter) === true){
                            validLetterCount++;
                            letterCheck(letter, i);
                        }
                    }
                    /*checks for game win*/
                    if (letterCorrectCount === lettersInWord){
                        gameWin();
                    }
                    else if((guessCount + 1) === guessesInGame){
                        gameLose();
                    }
                    else{
                        letterCorrectCount = 0;
                        /*checks for num of valid letters*/
                        if(validLetterCount === lettersInWord){
                            guessCount++;
                            validLetterCount = 0;
                        }
                        if(validLetterCount !== lettersInWord){
                            validLetterCount = 0;
                            clearRow();
                        }
                        selectedRow = letterRows[guessCount];
                        enableInput();
                    }
                }
            });
        }
    }

    function letterCheck(inputLetter, location){
        letterInWord = 0;
        for (let i = 0; i < word.length; i++){
            if (word.charAt(i) === inputLetter){
                if (i === location){
                    switch(location){
                        case 0: 
                            selectedRow.children().children(".col-1").css("background-color", rightLocation);
                            letterCorrectCount++;

                            iconId = selectedRow.children().children(".col-1 p:first");
                            colorBlindIconCorrectLetter(iconId, 1);
                            break;
                        case 1:
                            selectedRow.children().children(".col-2").css("background-color", rightLocation);
                            letterCorrectCount++;

                            iconId = selectedRow.children().children(".col-2 p:first");
                            colorBlindIconCorrectLetter(iconId, 2);
                            break;
                        case 2:
                            selectedRow.children().children(".col-3").css("background-color", rightLocation);
                            letterCorrectCount++;

                            iconId = selectedRow.children().children(".col-3 p:first");
                            colorBlindIconCorrectLetter(iconId, 3);
                            break;
                        case 3:
                            selectedRow.children().children(".col-4").css("background-color", rightLocation);
                            letterCorrectCount++;

                            iconId = selectedRow.children().children(".col-4 p:first");
                            colorBlindIconCorrectLetter(iconId, 4);
                            break;
                        case 4:
                            selectedRow.children().children(".col-5").css("background-color", rightLocation);
                            letterCorrectCount++;

                            iconId = selectedRow.children().children(".col-5 p:first");
                            colorBlindIconCorrectLetter(iconId, 5);
                            break;
                    }
                }
                else if(i !== location){
                    switch(location){
                        case 0: 
                            selectedRow.children().children(".col-1").css("background-color", "yellow");

                            iconId = selectedRow.children().children(".col-1 p:nth-child(3)");
                            colorBlindIconCorrectLetter(iconId, 1);
                            break;
                        case 1:
                            selectedRow.children().children(".col-2").css("background-color", rightLetter);

                            iconId = selectedRow.children().children(".col-2 p:nth-child(3)");
                            colorBlindIconCorrectLetter(iconId, 2);
                            break;
                        case 2:
                            selectedRow.children().children(".col-3").css("background-color", rightLetter);
                            
                            iconId = selectedRow.children().children(".col-3 p:nth-child(3)");
                            colorBlindIconCorrectLetter(iconId, 3);
                            break;
                        case 3:
                            selectedRow.children().children(".col-4").css("background-color", rightLetter);
                            
                            iconId = selectedRow.children().children(".col-4 p:nth-child(3)");
                            colorBlindIconCorrectLetter(iconId, 4);
                            break;
                        case 4:
                            selectedRow.children().children(".col-5").css("background-color", rightLetter);
                            
                            iconId = selectedRow.children().children(".col-5 p:nth-child(3)");
                            colorBlindIconCorrectLetter(iconId, 5);
                            break;
                    }
                }
            }
        }
    }

    function clearRow() {
        var currentRow = letterRows[guessCount];

        children = currentRow.children().children("input");
        currentRow.children().children(".colorBlind-icon-game").hide();

        for (var i = 0; i < lettersInWord; i++){
            children[i].value = null;
            children.css("background-color", "#aa70fc");
        }

        hasAutoSelect(document.getElementById(children[0].id));
    }

    function validCharacter(letter){
        if(isNaN(letter) === true){
            if(/[a-z]/.test(letter)){
                return true;
            }
        }
        else {
            return false;
        }
    }

    function disableInput(){
        selectedRow.children().children("input").prop("readonly", true);
    }

    function enableInput(){
        selectedRow.children().children("input").prop("readonly", false);
    }

    function gameLose(){
        $("#game-title").text("You Lose");
        $("game-title").cs("color", "red");
        // resetGame();
        return true;
    }

    function gameWin(){
        $("#game-title").text("You Win");
        $("#game-title").css("color", "darkgreen");
        disableAllInputs();
        return true;
    }

    function disableAllInputs(){
        for (var i = 0; i < guessesInGame; i++) {
            selectedRow = letterRows[i];
            disableInput();
        }
    }

    /*Issue with page switching back tom main menu*/
    function switchPages(currentPage, nextPage){
    if (containsClass(nextPage, "hasPopUp") === true || containsClass(nextPage, "hasPopUp") === true){
        currentPage.hide();
        nextPage.show();
    }
    else{
        currentPage.addClass("transition-animation-out");
        nextPage.addClass("transition-animation-in");
        currentPage.hide();
        nextPage.show();
        }
    }

    function containsClass(element, className){
        return element.hasClass(className);
    }

    function hasAutoSelect(currentElement) {
    autoSelect = currentElement;
    autoSelect.focus();
    autoSelect.select();
}

function colorBlindIconCorrectLetter(currentElement, position){
    if($("#colorBlindMode-btn").is(":checked")){
        currentElement.show();
        if(currentElement.prop("class") === "colorBlind-icon-game correctLocation"){
            switch(position){
                case 1:
                    currentElement.css({"left": "274px"});
                    break;
                case 2:
                    currentElement.css({"left": "380px"});
                    break;
                case 3:
                    currentElement.css({"left": "486px"});
                    break;
                case 4:
                    currentElement.css({"left": "592px"});
                    break;
                case 5:
                    currentElement.css({"left": "698px"});
                    break;
                }
        }
        else{
            switch(position){
                case 1:
                    currentElement.css({"left": "274px"});
                    break;
                case 2:
                    currentElement.css({"left": "380px"});
                    break;
                case 3:
                    currentElement.css({"left": "486px"});
                    break;
                case 4:
                    currentElement.css({"left": "592px"});
                    break;
                case 5:
                    currentElement.css({"left": "698px"});
                    break;
                }
            }
        }
}
});