// Get elements
const startBtn = document.getElementById('start');
const startScreen = document.getElementById('start-screen');
const questionsScreen = document.getElementById('questions');
const endScreen = document.getElementById('end-screen');
const questionTitle = document.getElementById('question-title');
const choices = document.getElementById('choices');
const feedback = document.getElementById('feedback')
const feedbackTxt = document.getElementById('feedback-txt')
const timer = document.getElementById('time');

// Add event listeners
startBtn.addEventListener('click', startQuiz)

// Declare global vars
let questionIndex = 0;
let resultTimeoutID;

function startQuiz() {
  startScreen.classList.add('hide');          // Hide start screen
  loadNextQuestion();                         // Load first question
  questionsScreen.classList.remove('hide')    // Show questions screen

  // Begin timer
  countdown();
}

// Hide existing question and load next question
function loadNextQuestion(result) {
  questionObj = questions[questionIndex]
  // Load in questions title from global array defined in questions.js
  questionTitle.innerHTML = questionObj.title; 

  // Clear existing and load new answers
  choices.innerHTML = "";
  questionObj.answers.forEach((answer, index) => {
    let el = document.createElement('button');    // <button> </button>
    el.textContent = answer;                      // <button> [answer] </button>
    el.dataset.index = index;                     // <button data-index="{index}"> {answer} </button>
    el.onclick = checkAns;                        // <button onclick='checkAns' data-index="{index}"> {answer} </button>
    choices.appendChild(el);                      // <div id='choices' ... > <button ...> ... </button> </div>
  })

  // Skip remaining code if on first question
  if (questionIndex == 0) return;   

  // Clear existing timeout if user answered question in under 1 second
  clearTimeout(resultTimeoutID);
  
  // Display feedback from previous question
  feedback.classList.remove('hide')
  if (result) {
    feedbackTxt.textContent = 'Correct!'
  } else {
    feedbackTxt.textContent = 'Incorrect!'
  }

  resultTimeoutID = setTimeout(() => {feedback.classList.add('hide')}, 1000)
}

function checkAns(event) {
  // Iterate question index
  questionIndex++;

  // Get index of selected answer
  let ans = event.target.dataset.index;

  // Compare to current question
  if (ans == questions[questionIndex].answer) {
    loadNextQuestion(true)
  } else {
    loadNextQuestion(false)
  }
}

function setTimer() {
  timer.textContent = time;
}

// Control the timer function with a countdown from 180 seconds
function countdown() {
  // Define total allowed time
  let totalSeconds = 180;

  // Get current data to use as frame of reference
  let startTime = Date.now();

  function updateTimer() {
    // Calculate remaining time in seconds
    let elapsedTime = Date.now() - startTime;
    let remainingSeconds = totalSeconds - Math.floor(elapsedTime / 1000);

    if (remainingSeconds >= 0) {
      // Format the time as MM:SS
      let formattedTime = Math.floor(remainingSeconds / 60).toString().padStart(2, "0") + ":" + (remainingSeconds % 60).toString().padStart(2, "0");

      // Set text on timer element
      timer.textContent = formattedTime;

      // Request the next update using browsers repaint function
      requestAnimationFrame(updateTimer);
    } else {
      timer.textContent = '00:00'
    }
  }

  // Start the countdown
  updateTimer();
}
