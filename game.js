var buttonColours = ["red", "blue", "green", "yellow", "purple", "orange"];

var gamePattern = [];
var userClickedPattern = [];

var started = false;
var level = 0;
var score = 0;
var topTen = [];

$(document).keypress(function () {
  if (!started) {
    $("#level-title").text("Level " + level);
    nextSequence();
    started = true;
  }
});

$(".btn").click(function () {
  var userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);

  playSound(userChosenColour);
  animatePress(userChosenColour);

  checkAnswer(userClickedPattern.length - 1);
});

function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
    score++;
    $("#score").text(score);
    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(function () {
        nextSequence();
      }, 1000);
    }
  } else {
    playSound("wrong");
    var name = prompt("Enter your name.");
    topTen.push({ name: name, score: score });
    $(".score-board").html("<h3>Top 10 Scores</h3>");
    topTen.sort(function (a, b) {
      return b.score - a.score;
    });

    topTen.forEach((top) => {
      $(".score-board").append(`<div class="top-scores">${top.name +"  " + top.score}</div>`);
    });
    score = 0;
    $("#score").text("0");
    $("body").addClass("game-over");
    $("#level-title").text("Game Over, A to Restart");

    setTimeout(function () {
      $("body").removeClass("game-over");
    }, 200);
    startOver();
  }
}

function nextSequence() {
  userClickedPattern = [];
  level++;
  $("#level-title").text("Level " + level);
  var randomNumber = Math.floor(Math.random() * 6);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  var i = 0;
  var intervalId = setInterval(function () {
    var colorToPlay = gamePattern[i];
    $("#" + colorToPlay)
      .fadeIn(100)
      .fadeOut(100)
      .fadeIn(100);
    playSound(colorToPlay);
    i++;
    if (i >= gamePattern.length) {
      clearInterval(intervalId);
    }
  }, 700);
}

function playGamePattern(pattern) {
  var i = 0;
  var intervalId = setInterval(function () {
    animatePress(pattern[i]);
    playSound(pattern[i]);
    i++;
    if (i >= pattern.length) {
      clearInterval(intervalId);
    }
  }, 500); // Adjust the delay time between each color as needed
}

function animatePress(currentColor) {
  $("#" + currentColor).addClass("pressed");
  setTimeout(function () {
    $("#" + currentColor).removeClass("pressed");
  }, 100);
}

function playSound(name) {
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

function startOver() {
  level = 0;
  gamePattern = [];
  started = false;
}
