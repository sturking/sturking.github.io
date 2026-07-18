/* QUIZ ANSWER KEY */

const quizData = [
  { id: "q1", type: "radio", correct: "berners-lee", answer: "Tim Berners-Lee" },
  { id: "q2", type: "radio", correct: "aol", answer: "America Online" },
  { id: "q3", type: "radio", correct: "mosaic", answer: "NCSA Mosaic" },
  {
    id: "q4",
    type: "checkbox",
    correct: ["rendering", "javascript", "networking"],
    answer: "Rendering engine, JavaScript engine, Networking component"
  },
  { id: "q5", type: "radio", correct: "navigator", answer: "Netscape Navigator" },
  { id: "q6", type: "text", correct: ["nexus"], answer: "Nexus" },
  {
    id: "q7",
    type: "checkbox",
    correct: ["bookmarks", "extensions", "syncing", "tabs"],
    answer: "Bookmarking pages, Extensions, Syncing data across devices, Tabbed browsing"
  },
  { id: "q8", type: "text", correct: ["60", "sixty"], answer: "60" },
  { id: "q9", type: "text", correct: ["url", "uniform resource locator"], answer: "URL" },
  { id: "q10", type: "radio", correct: "client", answer: "Client" }
];

/* Scoring: TOTAL and PASSING are calculated, so adding a question to quizData updates them automatically. */
const POINTS = 10;
const TOTAL = quizData.length * POINTS;
const PASSING = TOTAL * 0.6;
 
/* Found once at page load instead of searching on every use. */
const form = document.getElementById("quizForm");
const scorecard = document.getElementById("scorecard");

/* Grade the quiz on submit. preventDefault() cancels the browser's usual reload, which would wipe the results before they appear. */
form.addEventListener("submit", function (event) {
  event.preventDefault();
  gradeQuiz();
});
 
/* Clear the inputs and the results. Passing resetQuiz without parentheses hands over the function to call later, rather than calling it now. */
document.getElementById("resetBtn").addEventListener("click", resetQuiz);

/* Returns true if the array holds this value. Called from isCorrect() for both text and checkbox questions. */
function contains(list, value) {
  for (const item of list) {
    if (item === value) {
      return true;
    }
  }
  return false;
}
 
/* Read whatever the user entered for one question. */
function getResponse(question) {
  /* Ignore extra spaces and capital letters on typed answers. */
  if (question.type === "text") {
    const typed = document.getElementById(question.id).value;
    return typed.trim().toLowerCase();
  }
 
  /* For radio questions, return the checked one's value, or "" if none. */
  if (question.type === "radio") {
    const picked = document.querySelector('input[name="' + question.id + '"]:checked');
    if (picked) {
      return picked.value;
    }
    return "";
  }
 
  /* For checkbox questions, collect the value of every box that is checked. */ 
  const boxes = document.querySelectorAll('input[name="' + question.id + '"]:checked');
  const values = [];
  for (const box of boxes) {
    values.push(box.value);
  }
  return values;
}
 
/* Returns true when the response matches the answer key. */
function isCorrect(question, response) {
  if (question.type === "text") {
    return contains(question.correct, response);
  }
 
  if (question.type === "radio") {
    return response === question.correct;
  }
 
  /* A checkbox group is correct only when every right choice is picked. The picks must match the answer key exactly. */
  if (response.length !== question.correct.length) {
    return false;
  }
  for (const value of question.correct) {
    if (!contains(response, value)) {
      return false;
    }
  }
  return true;
}
 
/* Grade all ten questions and show the results. */
function gradeQuiz() {
  let score = 0;
 
  for (const question of quizData) {
    const response = getResponse(question);
    const box = document.getElementById("box-" + question.id);
    const feedback = document.getElementById("fb-" + question.id);
 
    let points = 0;
    let mark = "INCORRECT";
 
    if (isCorrect(question, response)) {
      points = POINTS;
      mark = "CORRECT";
      box.className = "question is-correct";
    } else {
      box.className = "question is-incorrect";
    }
 
    score = score + points;
 
    feedback.textContent =
      mark + " \n " + points + " / " + POINTS + " points\nAnswer: " + question.answer;
    feedback.hidden = false;
   }

  showScore(score);

  /* Lock the answers so they can't be changed after grading. */
  const inputs = form.querySelectorAll("input");
  for (const input of inputs) {
    input.disabled = true;
  }
  document.querySelector(".btn-check").disabled = true;  
}
 
/* Display the pass/fail verdict and the final score. */
function showScore(score) {
  const percent = Math.round((score / TOTAL) * 100);
  let verdict = "FAIL";
 
  if (score >= PASSING) {
    verdict = "PASS";
    scorecard.className = "scorecard pass";
  } else {
    scorecard.className = "scorecard fail";
  }
 
  scorecard.innerHTML = 
    '<span class="verdict">' + verdict + "!</span>\n" + 
    score + " / " + TOTAL + " points (" + percent + "%)";
  scorecard.hidden = false;
}
 
/* Clear the answers and the results, so the quiz can be retaken. */
function resetQuiz() {
  /* Re-enable the inputs first, or reset() can't clear a disabled field. */
  const inputs = form.querySelectorAll("input");
  for (const input of inputs) {
    input.disabled = false;
  }

/* Re-enable the check button, so the quiz can be graded again. */ 
  document.querySelector(".btn-check").disabled = false;

  form.reset();
 
  for (const question of quizData) {
    document.getElementById("box-" + question.id).className = "question";
    document.getElementById("fb-" + question.id).hidden = true;
  }
 
  scorecard.hidden = true;
  form.scrollIntoView();
}
