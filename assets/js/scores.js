// Get elements
const clear = document.getElementById('clear');
const highscoresList = document.getElementById('highscores');

// Add event listeners
clear.addEventListener('click', clearScores)

// Get scores from local storage
let highscores = localStorage.getItem('scores');
highscores = JSON.parse(highscores);
highscores.sort((a, b) => {
  if (a.time > b.time) {
    return -1;
  }
  if (a.time < b.time) {
    return 1;
  }
  if (highscores.indexOf(a) > highscores.indexOf(b)) {
    return 1;
  }
  return -1;
})

highscores.forEach((highscore) => {
  let score = document.createElement('li')
  let denomination = (highscore.time == '1') ? 'second' : 'seconds';
  score.innerHTML = `${highscore.initials} - ${highscore.time} ${denomination}`;
  highscoresList.appendChild(score);
})

function clearScores() {
  localStorage.removeItem('scores');
  highscoresList.innerHTML = '';
}