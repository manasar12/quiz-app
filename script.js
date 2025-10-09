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
let selectionDelay; // handle the short delay so user sees selected state

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
    // attach click handler to show selection immediately then evaluate
    btn.addEventListener("click", () => selectOption(btn, opt));
    optionsEl.appendChild(btn);
  });

  // Update progress bar (how many completed)
  let progressPercent = (currentQuestion / quizData.length) * 100;
  progressBar.style.width = progressPercent + "%";

  // Reset and start timer
  clearInterval(timer);
  clearTimeout(selectionDelay);
  timeLeft = 15;
  timerEl.innerText = `Time Left: ${timeLeft}s`;
  timer = setInterval(() => {
    timeLeft--;
    timerEl.innerText = `Time Left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      // if time runs out while user hasn't selected, reveal correct and move on
      revealCorrectThenNext();
    }
  }, 1000);
}

// show selected state immediately, then check answer after a short delay
function selectOption(selectedBtn, selected) {
  const allOptions = document.querySelectorAll(".option");
  // remove any previous selected markers
  allOptions.forEach(opt => opt.classList.remove("selected"));

  // add selected class to the clicked one so it's darker immediately
  selectedBtn.classList.add("selected");

  // prevent further clicks right away
  allOptions.forEach(opt => {
    opt.style.pointerEvents = "none";
  });

  // small delay so user can visually see the darker selection before we show correct/wrong
  clearTimeout(selectionDelay);
  selectionDelay = setTimeout(() => {
    checkAnswer(selectedBtn, selected);
  }, 450); // 450ms gives an instant but visible cue
}

function checkAnswer(selectedBtn, selected) {
  clearInterval(timer);
  const correctAnswer = quizData[currentQuestion].answer;
  const options = document.querySelectorAll(".option");

  // reveal which is correct and mark selected as correct/wrong
  options.forEach(opt => {
    opt.style.pointerEvents = "none";
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

function revealCorrectThenNext() {
  // used when time runs out - reveal correct option and then allow manual next
  const correctAnswer = quizData[currentQuestion].answer;
  document.querySelectorAll(".option").forEach(opt => {
    opt.style.pointerEvents = "none";
    if (opt.innerText === correctAnswer) opt.classList.add("correct");
  });
}

function nextQuestion() {
  clearInterval(timer);
  clearTimeout(selectionDelay);
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
