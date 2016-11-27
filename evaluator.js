var questions = [{
    question: "Have you been pregnant before?",
    choices: ["Yes", "No"],
    correctAnswer: 0,
    riskyAnswers: [0],
    riskFactor: 2
}, {
    question: "Do you have access to prenatal vitamins?",
    choices: ["Yes", "No"],
    correctAnswer: 0,
    riskyAnswers: [1],
    riskFactor: 4
}];

var riskTypes = [{
    riskName: "Anaemia",
    riskQuestions:  [1],
    riskMessage: "[message for anaemia]",
    riskFlag: 2

}, {
    riskName: "Iron Deficiency",
    riskQuestions: [1],
    riskMessage: "[message for iron deficiency, steps you should take]",
    riskFlag: 3
}, {
    riskName: "High age",
    riskQuestions: [0],
    riskMessage: "[message for high age]",
    riskFlag: 1
}, {
    riskName: "undefined risk",
    riskQuestions: [0, 2, 4],
    riskMessage: "[message for undefined risk]",
    riskFlag: 20
}];

var currentQuestion = 0;
var correctAnswers = 0;
var totalRisk = [];
for (var i = 0; i<riskTypes.length; i++){
    totalRisk.push(0);
}
console.log(totalRisk)
var quizOver = false;

$(document).ready(function () {

    // Display the first question
    displayCurrentQuestion();
    $(this).find(".quizMessage").hide();

    // On clicking next, display the next question
    $(this).find(".nextButton").on("click", function () {
        if (!quizOver) {

            value = $("input[type='radio']:checked").val();

            if (value == undefined) {
                $(document).find(".quizMessage").text("Please select an answer");
                $(document).find(".quizMessage").show();
            } else {
                // TODO: Remove any message -> not sure if this is efficient to call this each time....
                $(document).find(".quizMessage").hide();

                if (value == questions[currentQuestion].correctAnswer) {
                    correctAnswers++;
                }
                
                for (var i = 0; i<riskTypes.length; i++){
                    if (riskTypes[i].riskQuestions.indexOf(currentQuestion) >= 0){
                        for (var j = 0; j<questions[currentQuestion].riskyAnswers.length; j++){
                            if (value == questions[currentQuestion].riskyAnswers[j]) {
                                totalRisk[i]+=questions[currentQuestion].riskFactor;
                            }
                        }
                    }
                }

                console.log(totalRisk);

                currentQuestion++; // Since we have already displayed the first question on DOM ready
                if (currentQuestion < questions.length) {
                    displayCurrentQuestion();
                } else {
                    displayScore();
                    //                    $(document).find(".nextButton").toggle();
                    //                    $(document).find(".playAgainButton").toggle();
                    // Change the text in the next button to ask if user wants to play again
                    //$(document).find(".nextButton").text("Play Again?");
                    quizOver = true;
                }
            }
        } else { // quiz is over and clicked the next button (which now displays 'Play Again?'
            quizOver = false;
            $(document).find(".nextButton").text("Next Question");
            resetQuiz();
            displayCurrentQuestion();
            hideScore();
        }
    });

});

// This displays the current question AND the choices
function displayCurrentQuestion() {

    var question = questions[currentQuestion].question;
    var questionClass = $(document).find(".quizContainer > .question");
    var choiceList = $(document).find(".quizContainer > .choiceList");
    var numChoices = questions[currentQuestion].choices.length;

    // Set the questionClass text to the current question
    $(questionClass).text(question);

    $(choiceList).find("button").remove();
    $(choiceList).find("br").remove();

    var choice;
    for (i = 0; i < numChoices; i++) {
        choice = questions[currentQuestion].choices[i];
        $('<button class="choice"><input type="radio" style = "display:none;" id='+ i +' value="' + i + '" name="dynradio" /> <label for = "' + i + '">' + choice + '</label></button></br>').appendTo(choiceList);
    }
}

function resetQuiz() {
    currentQuestion = 0;
    correctAnswers = 0;
    hideScore();
}

function displayScore() {
    risks = "";
    isRisk = 0;
    $(document).find(".quizContainer > .result").text("You scored: " + correctAnswers + " out of: " + questions.length);
    for (var i = 0; i<riskTypes.length; i++){
        if (riskTypes[i].riskFlag <= totalRisk[i]){
            isRisk = 1;
            risks+=" "+riskTypes[i].riskName + ",";
        }
    }
    risks = "You're at risk for:"+risks;
    risks = risks.slice(0, -1);
    $(document).find(".quizContainer > .result").text(risks);
    if (isRisk == 0){
        $(document).find(".quizContainer > .result").text("Not at high risk");
    }
    $(document).find(".quizContainer > .result").show();
    $(document).find(".nextButton").text("Start a New Survey");
}

function hideScore() {
    $(document).find(".result").hide();
}