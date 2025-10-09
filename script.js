const quizData = [
  {
    question: "Which language is used for web apps?",
    options: ["Python", "JavaScript", "C++", "Java"],
    answer: "JavaScript"
  },
  {
    question: "What does CSS stand for?",
    options: ["Cascading Style Sheets", "Colorful Style Sheets", "Computer Styled Sections", "Creative Style System"],
    answer: "Cascading Style Sheets"
  },
  {
    question: "Which HTML tag is used to create a hyperlink?",
    options: ["<a>", "<link>", "<href>", "<p>"],
    answer: "<a>"
  },
  {
    question: "Inside which HTML element do we put JavaScript?",
    options: ["<js>", "<javascript>", "<script>", "<code>"],
    answer: "<script>"
  }
];

let currentQuestion = 0;
let score = 0;
let timeLeft = 15;
let timer;

function loadQuestion() {
  const questionEl = document.getElementById("question");
  const optionsEl = document.getElementById("options");
  const timerEl = document.getElementById("timer");
  const progressBar = document.getElementById("progress-bar");

  const q = quizData[currentQuestion];
  questionEl.innerText = `Q${currentQuestion + 1}: ${q.question}`;
  optionsEl.innerHTML = "";

  q.options.forEach(opt => {
    const btn = document.createElement("div");
    btn.classList.add("option");
    btn.innerText = opt;
    btn.onclick = () => selectOption(btn, opt);
    optionsEl.appendChild(btn);
  });

  // Update progress bar
  let progressPercent = (currentQuestion / quizData.length) * 100;
  progressBar.style.width = progressPercent + "%";

  // Reset and start timer
  clearInterval(timer);
  timeLeft = 15;
  timerEl.innerText = `Time Left: ${timeLeft}s`;
  timer = setInterval(() => {
    timeLeft--;
    timerEl.innerText = `Time Left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      nextQuestion();
    }
  }, 1000);
}

// Highlight selected option first
function selectOption(selectedBtn, selected) {
  const allOptions = document.querySelectorAll(".option");
  allOptions.forEach(opt => opt.classList.remove("selected"));
  selectedBtn.classList.add("selected");
  checkAnswer(selectedBtn, selected);
}

function checkAnswer(selectedBtn, selected) {
  clearInterval(timer);
  const correctAnswer = quizData[currentQuestion].answer;
  const options = document.querySelectorAll(".option");

  options.forEach(opt => {
    opt.onclick = null; // disable further clicks
    if (opt.innerText === correctAnswer) {
      opt.classList.add("correct");
    }
  });

  if (selected === correctAnswer) {
    selectedBtn.classList.add("correct");
    score++;
  } else {
    selectedBtn.classList.add("wrong");
  }
}

function nextQuestion() {
  clearInterval(timer);
  currentQuestion++;
  if (currentQuestion < quizData.length) {
    loadQuestion();
  } else {
    document.getElementById("quiz-container").innerHTML =
      `<h2>Quiz Completed 🎉</h2>
       <p class="result">Your Score: ${score} / ${quizData.length}</p>`;
  }
}

loadQuestion();

