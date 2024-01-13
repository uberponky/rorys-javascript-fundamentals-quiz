// Get button elements
const startBtn = document.getElementById('start');
const submitBtn = document.getElementById('submit');

// Get screens
const startScreen = document.getElementById('start-screen');
const questionsScreen = document.getElementById('questions');
const endScreen = document.getElementById('end-screen');

// Get individual elements
const questionTitle = document.getElementById('question-title');
const choices = document.getElementById('choices');
const feedback = document.getElementById('feedback');
const feedbackTxt = document.getElementById('feedback-txt');
const initials = document.getElementById('initials');

// Get UI elements
const timer = document.getElementById('time');

// Add event listeners
startBtn.addEventListener('click', startQuiz);
submitBtn.addEventListener('click', submitScore);

// Declare global vars
let questionIndex = 0;
let resultTimeoutID;
let score = 0;
let remainingSeconds;
let scoreObj = {
  score: '',
  time: '',
  initials: ''
}

// One time function used to start quiz and begin countdown timer
function startQuiz() {
  startScreen.classList.add('hide');          // Hide start screen
  questionsScreen.classList.remove('hide')    // Show questions screen
  loadNextQuestion();                         // Load first question
  countdown();                                // Begin timer
}

// Hide existing question and load next question
function loadNextQuestion(result) {
  // If there are no more questions, load end screen
  if (questionIndex >= questions.length) {
    endQuiz()
    return
  }

  // Load in questions title from global array defined in questions.js
  questionObj = questions[questionIndex]
  questionTitle.innerHTML = questionObj.title; 

  // Clear existing and load new answers
  choices.innerHTML = "";
  questionObj.answers.forEach((answer, index) => {
    let el = document.createElement('button');    // <button> </button>
    el.textContent = answer;                      // <button> {answer} </button>
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
    score++;
  } else {
    feedbackTxt.textContent = 'Incorrect!'
  }

  // Set up timer to hide feedback after 1 second
  resultTimeoutID = setTimeout(() => {feedback.classList.add('hide')}, 1500)
}

function checkAns(event) {
  console.log(questionIndex)
  // Get index of selected answer
  let ans = event.target.dataset.index;

  // Compare to current question
  if (ans == questions[questionIndex].answer) {
    questionIndex++;
    loadNextQuestion(true)
  } else {
    questionIndex++;
    loadNextQuestion(false)
  }
}

// One time function to end quiz
function endQuiz() {
  // Load end screen
  questionsScreen.classList.add('hide');
  endScreen.classList.remove('hide');

  // Move feedback element into end-screen to show user last item of feedback
  endScreen.append(feedback);

  // Add values to score object
  scoreObj.score = score;
  scoreObj.time = remainingSeconds;
}

function submitScore() {
  // Validate initials input
  let scores;
  let userInitials = initials.value;
  let regex = /^[a-zA-Z]{1,3}$/; // Credit - https://www.geeksforgeeks.org/javascript-program-to-check-if-a-string-contains-only-alphabetic-characters/
  
  // Input contained invalid characters
  if (!regex.test(userInitials)) {
    // TODO # Tell user it must be alphanumeric characters only
    alert('Initials must be between 1 - 3 characters, and only use alphabet characters')
    return
  }

  // Add initials to score object
  scoreObj.initials = userInitials;

  // Store score object in local storage
  // 1: If local storage exists, add object to array
  if (scores = localStorage.getItem('scores')) {
    scores = JSON.parse(scores);
    scores.push(scoreObj);
    scores = JSON.stringify(scores);
    localStorage.setItem('scores', scores);
  } else {
  // 2: If local storage does not exist, create first entry
    scores = [scoreObj];
    scores = JSON.stringify(scores);
    localStorage.setItem('scores', scores);
  }

  // Redirect to highscores page
  window.location.href = "/highscores.html";
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

    // Convert into seconds and store in global object for use in scoring later
    remainingSeconds = totalSeconds - Math.floor(elapsedTime / 1000);

    if (questionIndex >= questions.length) {
      // User has finished quiz, stop timer in current place
      return
    }

    if (remainingSeconds >= 0) {
      // Format the time as MM:SS
      let formattedTime = Math.floor(remainingSeconds / 60).toString().padStart(2, "0") + ":" + (remainingSeconds % 60).toString().padStart(2, "0");

      // Set text on timer element
      timer.textContent = formattedTime;

      // Request the next update using browsers repaint function
      requestAnimationFrame(updateTimer);
    } else {
      timer.textContent = '00:00'
      timeUp()
    }
  }

  // Start the countdown
  updateTimer();
}

// End quiz with no score
function timeUp() {

}