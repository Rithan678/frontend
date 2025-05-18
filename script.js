// --- Flashcards Data ---
const flashcardsData = {
  technology: [
    { front: "What is AI?", back: "Artificial Intelligence is the simulation of human intelligence in machines." },
    { front: "Define Machine Learning", back: "Machine Learning is a subset of AI that enables machines to learn from data." },
    { front: "What is Deep Learning?", back: "Deep Learning is a subset of ML that uses neural networks to analyze data." }
  ],
  ethics: [
    { front: "What is Business Ethics?", back: "Business ethics are moral principles that guide the way a business behaves." },
    { front: "Why is integrity important?", back: "Integrity builds trust and credibility in professional and personal relationships." }
  ],
  history: [
    { front: "Who was the first President of the USA?", back: "George Washington." },
    { front: "What year did World War II end?", back: "1945." }
  ]
};

// --- Progress/Completion Flags ---
let flashcardsCompleted = false;
let quizAttempted = false;
let todaysMarks = 0;

// --- Sidebar Category Filter for Courses and Flashcards ---
document.querySelectorAll('.category').forEach(cat => {
  cat.addEventListener('click', function() {
    document.querySelectorAll('.category').forEach(c => c.classList.remove('active'));
    this.classList.add('active');
    const selected = this.getAttribute('data-category');
    // Filter courses
    document.querySelectorAll('.course-item').forEach(item => {
      if (item.getAttribute('data-category') === selected) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
    // Render flashcards for selected category
    renderFlashcards(selected);
  });
});
// Set the first category as active by default and render its flashcards
const firstCategory = document.querySelector('.category');
if (firstCategory) {
  firstCategory.classList.add('active');
  renderFlashcards(firstCategory.getAttribute('data-category'));
  // Filter courses for the first category
  document.querySelectorAll('.course-item').forEach(item => {
    if (item.getAttribute('data-category') === firstCategory.getAttribute('data-category')) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
}

// --- Sidebar Flashcards Render (for the grid, not the primary viewer) ---
function renderFlashcards(category) {
  const container = document.getElementById('flashcardsContainer');
  if (!container) return;
  container.innerHTML = '';
  (flashcardsData[category] || []).forEach(card => {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'flashcard';
    cardDiv.onclick = function() { this.classList.toggle('flipped'); };
    cardDiv.innerHTML = `
      <div class="flashcard-inner">
        <div class="flashcard-front"><p>${card.front}</p></div>
        <div class="flashcard-back"><p>${card.back}</p></div>
      </div>
    `;
    container.appendChild(cardDiv);
  });
}

// --- Progress and Courses ---
const totalCourses = 5;
let completedCourses = 0;
function completeCourse(idx) {
  const btn = document.getElementById('course-btn-' + idx);
  if (!btn.classList.contains('completed')) {
    btn.textContent = 'Completed';
    btn.classList.add('completed');
    btn.style.background = "#43a047";
    btn.style.color = "#fff";
    btn.disabled = true;
    // Animation
    btn.classList.add("completed-animate");
    showConfetti(btn);
    setTimeout(() => {
      btn.classList.remove("completed-animate");
    }, 1200);
    completedCourses++;
    updateProgress();
  }
}
function updateProgress() {
  const percent = Math.round((completedCourses / totalCourses) * 100);
  document.getElementById('progressBar').style.width = percent + '%';
  document.getElementById('completedPercent').textContent = percent + '%';
  document.getElementById('lessonsCount').textContent = completedCourses + '/' + totalCourses;
}
updateProgress();

// --- Daily Habit Checklist with Progress Bar ---
function updateHabitProgress() {
  const habitCheckboxes = document.querySelectorAll('.habit-checkbox');
  const checked = Array.from(habitCheckboxes).filter(cb => cb.checked).length;
  const percent = habitCheckboxes.length ? Math.round((checked / habitCheckboxes.length) * 100) : 0;
  document.getElementById('habitProgressBar').style.width = percent + '%';
}
document.getElementById('habitList').addEventListener('change', updateHabitProgress);
updateHabitProgress();

// Add Habit Form logic
document.getElementById('addHabitForm').onsubmit = function(e) {
  e.preventDefault();
  const input = document.getElementById('newHabitInput');
  const value = input.value.trim();
  if (!value) return;
  const label = document.createElement('label');
  label.style.display = "flex";
  label.style.alignItems = "center";
  label.style.gap = "8px";
  label.style.marginBottom = "6px";
  label.innerHTML = `<input type="checkbox" class="habit-checkbox" value="${value}"> ${value}`;
  document.getElementById('habitList').appendChild(label);
  input.value = "";
  updateHabitProgress();
};

// --- Primary Flashcard Viewer (simple, no spaced repetition) ---
const primaryFlashcards = [
  { front: "What is AI?", back: "Artificial Intelligence is the simulation of human intelligence in machines." },
  { front: "Define Machine Learning?", back: "Machine Learning is a subset of AI that enables machines to learn from data." },
  { front: "What is Deep Learning?", back: "Deep Learning is a subset of ML that uses neural networks to analyze data." },
  { front: "What is Business Ethics?", back: "Business ethics are moral principles that guide the way a business behaves." },
  { front: "Who was the first President of the USA?", back: "George Washington." }
];
let flashcardIndex = 0;
let flashcardFlipped = false;

function renderPrimaryFlashcard() {
  if (!document.getElementById('primaryFlashcardFront')) return;
  if (flashcardIndex >= primaryFlashcards.length) {
    document.getElementById('primaryFlashcardFront').innerHTML = "<b>All done!</b>";
    document.getElementById('primaryFlashcardBack').innerHTML = "";
    document.getElementById('knowBtn').disabled = true;
    document.getElementById('dontKnowBtn').disabled = true;
    document.getElementById('flashcardProgress').textContent = "";
    document.getElementById('primaryFlashcardInner').style.transform = "";
    flashcardsCompleted = true;
    updateProgressFromCatalog();
    return;
  }
  const card = primaryFlashcards[flashcardIndex];
  document.getElementById('primaryFlashcardFront').textContent = card.front;
  document.getElementById('primaryFlashcardBack').textContent = card.back;
  document.getElementById('knowBtn').disabled = false;
  document.getElementById('dontKnowBtn').disabled = false;
  document.getElementById('primaryFlashcardInner').style.transform = flashcardFlipped ? "rotateY(180deg)" : "";
  document.getElementById('flashcardProgress').textContent =
    `Card ${flashcardIndex + 1} of ${primaryFlashcards.length}`;
}
if (document.getElementById('primaryFlashcard')) {
  document.getElementById('primaryFlashcard').onclick = function() {
    flashcardFlipped = !flashcardFlipped;
    document.getElementById('primaryFlashcardInner').style.transform = flashcardFlipped ? "rotateY(180deg)" : "";
  };
  document.getElementById('knowBtn').onclick = function() {
    flashcardIndex++;
    flashcardFlipped = false;
    renderPrimaryFlashcard();
  };
  document.getElementById('dontKnowBtn').onclick = function() {
    flashcardIndex++;
    flashcardFlipped = false;
    renderPrimaryFlashcard();
  };
  renderPrimaryFlashcard();
}

// --- Enhanced Quiz App with Timer, Bonus, Animated Progress, Sound & Visual Effects ---
const quizData = [
  {
    question: "What is the capital of France?",
    options: ["Paris", "London", "Berlin"],
    answer: 0,
    type: "mc"
  },
  {
    question: "Which language runs in a web browser?",
    options: ["Python", "Java", "JavaScript"],
    answer: 2,
    type: "mc"
  },
  {
    question: "Who designed the first computer algorithm?",
    options: ["Ada Lovelace", "Alan Turing", "Charles Babbage"],
    answer: 0,
    type: "mc"
  },
  {
    question: "The sky is blue. (True/False)",
    options: ["True", "False"],
    answer: 0,
    type: "tf"
  }
];
let quizOrder = [];
let quizIndex = 0;
let quizScore = 0;
let quizAnswered = false;
let quizTimer = 0;
let quizTimerInterval = null;
let quizBonus = 0;
let quizTotalBonus = 0;

// Sound effects
const quizChime = new Audio("https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae6c7.mp3");
const quizBuzz = new Audio("https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae6c7.mp3");
quizChime.volume = 0.5;
quizBuzz.volume = 0.3;

function shuffle(arr) {
  return arr.map(v => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(v => v[1]);
}

function startQuiz() {
  quizOrder = shuffle([...quizData]);
  quizIndex = 0;
  quizScore = 0;
  quizAnswered = false;
  quizTotalBonus = 0;
  document.getElementById('quizScore').textContent = '';
  document.getElementById('quizFeedback').textContent = '';
  document.getElementById('retryBtn').style.display = 'none';
  updateQuizProgressBar();
  showQuizQuestion();
}

function showQuizQuestion() {
  const q = quizOrder[quizIndex];
  const flashcard = Object.values(flashcardsData).flat().find(card =>
    card.front.replace(/\?$/, '').trim().toLowerCase() === q.question.replace(/^Q\d+:\s*/, '').replace(/\?$/, '').trim().toLowerCase()
  );
  document.getElementById('quizQuestion').innerHTML = `Q${quizIndex + 1}: ${q.question}` +
    (flashcard
      ? `<br><button id="showFlashcardBtn" style="margin-top:8px;background:#ffd700;color:#1e3a8a;border:none;border-radius:8px;padding:6px 14px;cursor:pointer;font-size:0.98em;">Show as Flashcard</button>`
      : '');
  const optionsDiv = document.getElementById('quizOptions');
  optionsDiv.innerHTML = '';
  document.getElementById('quizFeedback').textContent = '';
  quizAnswered = false;
  // Timer
  quizTimer = 0;
  document.getElementById('quizTimer').textContent = "00:00";
  if (quizTimerInterval) clearInterval(quizTimerInterval);
  quizTimerInterval = setInterval(() => {
    quizTimer++;
    document.getElementById('quizTimer').textContent = "00:" + quizTimer.toString().padStart(2, "0");
    if (quizTimer >= 30) {
      clearInterval(quizTimerInterval);
      selectQuizOption(-1, null, true);
    }
  }, 1000);

  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.onclick = () => selectQuizOption(i, btn);
    optionsDiv.appendChild(btn);
  });
  updateQuizProgressBar();

  // Attach flashcard button event
  if (flashcard && document.getElementById('showFlashcardBtn')) {
    document.getElementById('showFlashcardBtn').onclick = function() {
      showQuizFlashcard(flashcard.front, flashcard.back);
    };
  }
}

function selectQuizOption(selected, btn, timeout = false) {
  if (quizAnswered) return;
  quizAnswered = true;
  clearInterval(quizTimerInterval);
  const q = quizOrder[quizIndex];
  const correct = selected === q.answer;
  // Bonus: max 5, lose 1 per 3s, min 0
  quizBonus = Math.max(0, 5 - Math.floor(quizTimer / 3));
  if (correct) {
    quizScore++;
    quizTotalBonus += quizBonus;
    btn && (btn.style.background = "#43a047");
    document.getElementById('quizFeedback').textContent = `Correct! +${quizBonus} bonus`;
    document.getElementById('quizFeedback').style.color = "#43a047";
    playQuizChime();
    sparkleEffect(btn);
  } else {
    btn && (btn.style.background = "#e57373");
    document.getElementById('quizFeedback').textContent = timeout ? "Time's up!" : "Incorrect!";
    document.getElementById('quizFeedback').style.color = "#e57373";
    // Highlight correct answer
    const optionBtns = Array.from(document.getElementById('quizOptions').children);
    optionBtns[q.answer].style.background = "#ffd700";
    optionBtns[q.answer].style.color = "#1e3a8a";
    playQuizBuzz();
    shakeEffect(document.getElementById('quizQuestion'));
  }
  // Disable all buttons
  Array.from(document.getElementById('quizOptions').children).forEach(b => b.disabled = true);
  setTimeout(() => {
    quizIndex++;
    if (quizIndex < quizOrder.length) {
      showQuizQuestion();
    } else {
      showQuizResult();
    }
  }, 1100);
}

function showQuizResult() {
  document.getElementById('quizQuestion').textContent = 'Quiz Completed!';
  document.getElementById('quizOptions').innerHTML = '';
  document.getElementById('quizFeedback').textContent = '';
  const total = quizOrder.length;
  const percent = Math.round((quizScore / total) * 100);
  document.getElementById('quizScore').innerHTML =
    `Score: <b>${quizScore}</b> / ${total} &nbsp; (${percent}%)<br>Bonus: <b>${quizTotalBonus}</b>`;
  document.getElementById('retryBtn').style.display = 'inline-block';
  updateQuizProgressBar(true);

  // Mark quiz as attempted and add marks
  quizAttempted = true;
  // Add both quizScore and quizTotalBonus to today's marks
  todaysMarks += quizScore + quizTotalBonus;
  document.getElementById('todaysMarks').textContent = todaysMarks;

  // Also update the bonus points display
  const bonusElem = document.getElementById('bonusPoints');
  if (bonusElem) {
    let currentBonus = parseInt(bonusElem.textContent || "0", 10);
    bonusElem.textContent = currentBonus + quizTotalBonus;
  }

  updateProgressFromCatalog();
}

// Animated progress bar with color
function updateQuizProgressBar(finish = false) {
  const bar = document.getElementById('quizProgressBar');
  const total = quizOrder.length || quizData.length;
  const done = finish ? total : quizIndex;
  const percent = Math.round((done / total) * 100);
  bar.style.width = percent + "%";
  // Color: green >70%, yellow 40-70%, red <40%
  let color = "#43a047";
  if (percent < 40) color = "#e57373";
  else if (percent < 70) color = "#ffd700";
  bar.style.background = color;
}

// Sound and visual effects
function playQuizChime() {
  quizChime.currentTime = 0;
  quizChime.play();
}
function playQuizBuzz() {
  quizBuzz.currentTime = 0;
  quizBuzz.play();
}
function shakeEffect(el) {
  if (!el) return;
  el.style.animation = "quizShake 0.4s";
  el.addEventListener("animationend", () => { el.style.animation = ""; }, { once: true });
}
function sparkleEffect(btn) {
  if (!btn) return;
  const sparkle = document.createElement("span");
  sparkle.innerHTML = "✨";
  sparkle.style.position = "absolute";
  sparkle.style.fontSize = "1.5em";
  sparkle.style.pointerEvents = "none";
  sparkle.style.left = (btn.offsetLeft + btn.offsetWidth / 2 - 10) + "px";
  sparkle.style.top = (btn.offsetTop - 10 + (Math.random() - 0.5) * 10) + "px";
  sparkle.style.animation = "quizSparkle 0.7s forwards";
  btn.parentElement.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 700);
}

// Add quiz shake and sparkle CSS
const quizAnimStyle = document.createElement('style');
quizAnimStyle.textContent = `
  @keyframes quizShake {
    0% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-6px); }
    80% { transform: translateX(6px); }
    100% { transform: translateX(0); }
  }
  @keyframes quizSparkle {
    0% { opacity: 1; transform: scale(1) translateY(0);}
    80% { opacity: 1; transform: scale(1.5) translateY(-20px);}
    100% { opacity: 0; transform: scale(2) translateY(-30px);}
  }
  .quiz-options { position: relative; }
`;
document.head.appendChild(quizAnimStyle);

// Remove or comment out this line so the quiz does NOT start automatically:
// if (document.getElementById('quizQuestion')) startQuiz();

// Instead, set up the Start Quiz button:
document.getElementById('startQuizBtn').onclick = function() {
  document.getElementById('startQuizBtn').style.display = 'none';
  document.getElementById('quizContent').style.display = '';
  startQuiz();
};

// When retrying, show quiz content and hide start button
const origStartQuiz = startQuiz;
startQuiz = function() {
  document.getElementById('quizContent').style.display = '';
  document.getElementById('startQuizBtn').style.display = 'none';
  origStartQuiz();
};

// --- Course Catalog Data & Filter ---
const catalogData = [
  {
    title: "JavaScript Basics",
    topic: "technology",
    time: "2h",
    pdf: "js-basics.pdf",
    done: false,
    quiz: {
      question: "Which of these is a valid JavaScript variable name?",
      options: ["2names", "_name", "first-name"],
      answer: 1
    }
  },
  {
    title: "UI/UX Design Principles",
    topic: "technology",
    time: "1.5h",
    pdf: "uiux.pdf",
    done: false,
    quiz: {
      question: "What does UX stand for?",
      options: ["User Xperience", "User Experience", "Universal Experience"],
      answer: 1
    }
  },
  {
    title: "Digital Marketing 101",
    topic: "technology",
    time: "2h",
    pdf: "marketing.pdf",
    done: false,
    quiz: {
      question: "SEO stands for?",
      options: ["Search Engine Optimization", "Social Engagement Online", "Simple Email Outreach"],
      answer: 0
    }
  },
  {
    title: "Business Ethics",
    topic: "ethics",
    time: "1h",
    pdf: "ethics.pdf",
    done: false,
    quiz: {
      question: "Business ethics are:",
      options: ["Legal requirements", "Moral principles", "Company profits"],
      answer: 1
    }
  },
  {
    title: "World History Overview",
    topic: "history",
    time: "1.5h",
    pdf: "history.pdf",
    done: false,
    quiz: {
      question: "Who was the first President of the USA?",
      options: ["Abraham Lincoln", "George Washington", "John Adams"],
      answer: 1
    }
  }
];
// 2. Render the catalog table with PDF and Mark as Done
function renderCatalogTable(filter = "all") {
  const tbody = document.querySelector("#catalogTable tbody");
  tbody.innerHTML = "";
  catalogData.filter(c => filter === "all" || c.topic === filter)
    .forEach((c, idx) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${c.title}</td>
        <td style="text-transform:capitalize;">${c.topic}</td>
        <td>${c.time}</td>
        <td><a href="${c.pdf}" target="_blank" style="color:#1e3a8a;text-decoration:underline;">PDF</a></td>
        <td>
          <button class="mark-done-btn" data-idx="${idx}" 
            style="background:${c.done ? '#43a047' : '#ffd700'};color:${c.done ? '#fff' : '#1e3a8a'};border:none;border-radius:8px;padding:5px 12px;cursor:pointer;"
            ${c.done ? 'disabled' : ''}>
            ${c.done ? '<i class="fas fa-check-circle" style="margin-right:6px;color:#fff;"></i>Completed' : 'Mark as Done'}
          </button>
        </td>
      `;
      tbody.appendChild(row);
    });

  // Add event listeners for Mark as Done buttons
  document.querySelectorAll('.mark-done-btn').forEach(btn => {
    btn.onclick = function() {
      const idx = +btn.getAttribute('data-idx');
      if (catalogData[idx].done) return;
      showMiniQuiz(idx);
    };
  });
}

// 3. Mini-quiz popup logic
function showMiniQuiz(idx) {
  const course = catalogData[idx];
  document.getElementById('miniQuizTitle').textContent = `Quiz: ${course.title}`;
  document.getElementById('miniQuizQuestion').textContent = course.quiz.question;
  const optionsDiv = document.getElementById('miniQuizOptions');
  optionsDiv.innerHTML = '';
  course.quiz.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.style.margin = "0 6px 6px 0";
    btn.onclick = function() {
      // Disable all buttons after answer
      Array.from(optionsDiv.children).forEach(b => b.disabled = true);
      if (i === course.quiz.answer) {
        btn.style.background = "#43a047"; // green for correct
        btn.style.color = "#fff";
        course.done = true;
        // Add to lessons if not already present
        if (!lessons.some(l => l.title === course.title)) {
          lessons.push({ title: course.title, date: new Date().toISOString().slice(0,10) });
          renderTimeline();
        }
        // Exit quiz immediately
        closeMiniQuiz();
        // Now update the table and animate the new Completed button
        setTimeout(() => {
          renderCatalogTable(document.getElementById("catalogFilter").value);
          updateProgressFromCatalog();
          setTimeout(() => {
            const catalogBtn = document.querySelector(`.mark-done-btn[data-idx="${idx}"]`);
            if (catalogBtn) {
              catalogBtn.classList.add("completed-animate");
              showConfetti(catalogBtn);
              setTimeout(() => {
                catalogBtn.classList.remove("completed-animate");
              }, 1200);
            }
          }, 50);
        }, 100);
      } else {
        btn.style.background = "#e57373"; // red for incorrect
        btn.style.color = "#fff";
        setTimeout(() => {
          alert("Incorrect. Please review the course material and try again.");
          closeMiniQuiz();
        }, 700);
      }
    };
    optionsDiv.appendChild(btn);
  });
  document.getElementById('miniQuizModal').style.display = 'block';
  document.getElementById('miniQuizOverlay').style.display = 'block';
}
function closeMiniQuiz() {
  document.getElementById('miniQuizModal').style.display = 'none';
  document.getElementById('miniQuizOverlay').style.display = 'none';
}

// 4. Update progress bar and lessons count from catalog
function updateProgressFromCatalog() {
  let flashPercent = flashcardsCompleted ? 33 : 0;
  let quizPercent = quizAttempted ? 33 : 0;
  let completed = catalogData.filter(c => c.done).length;
  let total = catalogData.length;
  let catalogPercent = total > 0 ? Math.round((completed / total) * 34) : 0;
  let percent = flashPercent + quizPercent + catalogPercent;
  if (percent > 100) percent = 100;

  document.getElementById('progressBar').style.width = percent + '%';
  document.getElementById('completedPercent').textContent = percent + '%';
  document.getElementById('lessonsCount').textContent = completed + '/' + total;

  // Section progress (optional)
  if (document.getElementById('flashProgress')) document.getElementById('flashProgress').textContent = flashPercent + '%';
  if (document.getElementById('quizProgress')) document.getElementById('quizProgress').textContent = quizPercent + '%';
  if (document.getElementById('catalogProgress')) document.getElementById('catalogProgress').textContent = catalogPercent + '%';
}

// 5. Update timeline header with number of lessons
let lessons = [];
function renderTimeline() {
  const timeline = document.getElementById('lessonTimeline');
  timeline.innerHTML = '';
  lessons.forEach((lesson, idx) => {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.draggable = true;
    item.style.background = '#f8faff';
    item.style.borderRadius = '12px';
    item.style.padding = '12px 18px';
    item.style.minWidth = '140px';
    item.style.boxShadow = '0 2px 8px rgba(30,58,138,0.06)';
    item.style.textAlign = 'center';
    item.style.cursor = 'grab';
    item.style.border = '2px solid #ffd700';
    item.style.userSelect = 'none';
    item.innerHTML = `<b>${lesson.title}</b><br><span style="font-size:0.95em;color:#1e3a8a;">${lesson.date}</span>`;
    item.ondragstart = e => {
      e.dataTransfer.setData('text/plain', idx);
      item.style.opacity = 0.5;
    };
    item.ondragend = () => { item.style.opacity = 1; };
    item.ondragover = e => e.preventDefault();
    item.ondrop = e => {
      e.preventDefault();
      const from = +e.dataTransfer.getData('text/plain');
      const to = idx;
      if (from !== to) {
        const moved = lessons.splice(from, 1)[0];
        lessons.splice(to, 0, moved);
        renderTimeline();
      }
    };
    timeline.appendChild(item);
  });
  // Update lesson count in header
  const header = timeline.closest('.card').querySelector('h3');
  if (header) {
    header.innerHTML = `<i class="fas fa-stream"></i> Lesson Timeline Tracker <span style="font-size:0.9em;color:#888;">(${lessons.length} lessons)</span>`;
  }
}

// 6. Fix catalog filter dropdown (if not already)
const catalogFilter = document.getElementById("catalogFilter");
if (catalogFilter) {
  catalogFilter.innerHTML = `
    <option value="all">All</option>
    <option value="technology">Technology</option>
    <option value="ethics">Ethics</option>
    <option value="history">History</option>
  `;
  catalogFilter.addEventListener("change", function() {
    renderCatalogTable(this.value);
  });
  renderCatalogTable();
}

// 7. Call updateProgressFromCatalog on load
updateProgressFromCatalog();

// --- Confetti Animation for Completed Buttons ---
function showConfetti(btn) {
  if (!btn) return;
  const rect = btn.getBoundingClientRect();
  for (let i = 0; i < 14; i++) {
    const conf = document.createElement('span');
    conf.textContent = "🎉";
    conf.style.position = "fixed";
    conf.style.left = (rect.left + btn.offsetWidth / 2 + (Math.random() - 0.5) * 40) + "px";
    conf.style.top = (rect.top - 10 + (Math.random() - 0.5) * 10) + "px";
    conf.style.fontSize = "1.2em";
    conf.style.pointerEvents = "none";
    conf.style.opacity = 1;
    conf.style.transition = "all 1.2s cubic-bezier(.4,2,.6,1)";
    document.body.appendChild(conf);
    setTimeout(() => {
      conf.style.transform = `translateY(${40 + Math.random() * 40}px) scale(${0.7 + Math.random() * 0.6}) rotate(${Math.random() * 360}deg)`;
      conf.style.opacity = 0;
    }, 10);
    setTimeout(() => conf.remove(), 1300);
  }
}

// --- Reading Log Data & Functions ---
const genreIcons = {
  "Fantasy": "🐉", "Mystery": "🔍", "Biography": "👤", "Sci-Fi": "🚀", "History": "📜", "Other": "📚"
};

let readingLog = [
  {
    title: "Harry Potter",
    author: "J.K. Rowling",
    genre: "Fantasy",
    cover: "https://covers.openlibrary.org/b/id/7984916-L.jpg",
    date: "2024-05-01",
    rating: 5,
    reflection: "Loved the magic and adventure! Would recommend.",
    status: "finished"
  },
  {
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    genre: "Science",
    cover: "",
    date: "2024-04-15",
    rating: 4,
    reflection: "Learned a lot about the universe.",
    status: "finished"
  }
];

let readingLogSort = { key: "date", asc: false };
let readingLogFilter = "all";

function renderReadingLog() {
  const tbody = document.getElementById('readingLogBody');
  if (!tbody) return;
  let filtered = readingLog.filter(b => readingLogFilter === "all" || b.status === readingLogFilter);
  // Sort
  filtered.sort((a, b) => {
    let k = readingLogSort.key;
    if (k === "rating" || k === "date") {
      if (readingLogSort.asc) return (a[k] > b[k] ? 1 : -1);
      else return (a[k] < b[k] ? 1 : -1);
    }
    if (a[k] && b[k]) return a[k].toLowerCase().localeCompare(b[k].toLowerCase()) * (readingLogSort.asc ? 1 : -1);
    return 0;
  });
  tbody.innerHTML = "";
  filtered.forEach((b, idx) => {
    tbody.innerHTML += `
      <tr>
        <td>${b.title}</td>
        <td>${b.author}</td>
        <td><span class="genre-badge">${genreIcons[b.genre] || "📚"} ${b.genre}</span></td>
        <td>${b.cover ? `<img src="${b.cover}" alt="cover" style="width:38px;height:54px;object-fit:cover;border-radius:4px;">` : ""}</td>
        <td>${b.date || ""}</td>
        <td>${renderStars(b.rating)}</td>
        <td>${b.reflection || ""}</td>
      </tr>
    `;
  });
  document.getElementById('booksReadCount').textContent = readingLog.filter(b => b.status === "finished").length;
}
function renderStars(rating) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    stars += `<span style="color:${i <= rating ? '#ffd700' : '#ccc'};font-size:1.2em;cursor:pointer;" onclick="setRating(this,${i})">&#9733;</span>`;
  }
  return stars;
}
function setRating(el, rating) {
  const row = el.closest('tr');
  const idx = Array.from(row.parentNode.children).indexOf(row);
  readingLog[idx].rating = rating;
  renderReadingLog();
}
function sortReadingLog(key) {
  if (readingLogSort.key === key) readingLogSort.asc = !readingLogSort.asc;
  else { readingLogSort.key = key; readingLogSort.asc = true; }
  renderReadingLog();
}
function filterReadingLog(status) {
  readingLogFilter = status;
  renderReadingLog();
}
document.getElementById('addReadingForm').onsubmit = function(e) {
  e.preventDefault();
  readingLog.push({
    title: this.bookTitle.value,
    author: this.bookAuthor.value,
    genre: this.bookGenre.value || "Other",
    cover: this.bookCover.value,
    date: this.bookDate.value,
    rating: parseInt(this.bookRating.value) || 0,
    reflection: this.bookReflection.value,
    status: this.bookStatus ? this.bookStatus.value : "to-read"
  });
  this.reset();
  renderReadingLog();
};
renderReadingLog();

// Simple Markdown to HTML preview (basic: bold, italic, headings, lists)
function renderMarkdown(md) {
  return md
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<b>$1</b>')
    .replace(/\*(.*?)\*/gim, '<i>$1</i>')
    .replace(/^\s*-\s+(.*)$/gim, '<li>$1</li>')
    .replace(/\n$/gim, '<br>');
}
const markdownNotes = document.getElementById('markdownNotes');
const markdownPreview = document.getElementById('markdownPreview');
if (markdownNotes && markdownPreview) {
  markdownNotes.addEventListener('input', function() {
    markdownPreview.innerHTML = renderMarkdown(markdownNotes.value);
  });
}

// Export to PDF
document.getElementById('addToNotesPdfBtn').onclick = function() {
  const text = markdownNotes.value;
  const blob = new Blob([text], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "notes.pdf";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
};

// Export to Word (DOCX)
document.getElementById('addToNotesWordBtn').onclick = function() {
  const text = markdownNotes.value;
  const blob = new Blob([text], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "notes.doc";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
};

// --- Dashboard Central Hub Data (demo, replace with real data as needed) ---

// Example: Today's tasks/lessons
const todaysTasks = [
  "Complete Flashcard Set: Technology",
  "Read 10 pages from 'Harry Potter'",
  "Take Quiz: Week 2",
  "Practice coding for 30 minutes"
];

// Example: Upcoming deadlines/lessons
const upcomingDeadlines = [
  "Math Assignment - Due: 2025-05-20",
  "Science Project - Due: 2025-05-22",
  "Reading Log Update - Due: 2025-05-23"
];

// Example: Recent quizzes and scores
const recentQuizzes = [
  { title: "Quiz: Week 1", score: "8/10" },
  { title: "Quiz: Ethics", score: "7/10" },
  { title: "Quiz: History", score: "9/10" }
];

// Reading progress from the log
function getReadingProgress() {
  const finished = readingLog.filter(b => b.status === "finished").length;
  const total = readingLog.length;
  return total ? Math.round((finished / total) * 100) : 0;
}

// Example: Streaks/daily goals (demo)
const streakDays = 5; // e.g., 5 days in a row
const dailyGoals = [
  { goal: "Read 10 pages", done: true },
  { goal: "Practice coding", done: false },
  { goal: "Take a quiz", done: true }
];

// --- Render Dashboard Central Hub ---
function renderStudentDashboard() {
  // Today's Tasks
  const todayTasksEl = document.getElementById('todayTasks');
  if (todayTasksEl) {
    todayTasksEl.innerHTML = todaysTasks.map(t => `<li>${t}</li>`).join('');
  }
  // Upcoming Deadlines
  const upcomingEl = document.getElementById('upcomingDeadlines');
  if (upcomingEl) {
    upcomingEl.innerHTML = upcomingDeadlines.map(d => `<li>${d}</li>`).join('');
  }
  // Recent Quizzes
  const quizzesEl = document.getElementById('recentQuizzes');
  if (quizzesEl) {
    quizzesEl.innerHTML = recentQuizzes.map(q => `<li>${q.title}: <b>${q.score}</b></li>`).join('');
  }
  // Reading Progress
  const readingEl = document.getElementById('dashboardReadingProgress');
  if (readingEl) {
    const percent = getReadingProgress();
    readingEl.innerHTML = `Books finished: <b>${percent}%</b>`;
  }
  // Streaks & Daily Goals
  const streaksEl = document.getElementById('dashboardStreaks');
  if (streaksEl) {
    streaksEl.innerHTML = `
      <div>Current streak: <b>${streakDays} days</b></div>
      <ul style="margin:6px 0 0 0;padding-left:18px;">
        ${dailyGoals.map(g => `<li>${g.done ? "✅" : "⬜"} ${g.goal}</li>`).join('')}
      </ul>
    `;
  }
}
renderStudentDashboard();

function onMiniQuizAnswered(courseId, isCorrect) {
  if (isCorrect) {
    const course = courseCatalog.find(c => c.id === courseId);
    if (course) {
      course.completed = true;
      renderCourseCatalog(); // Re-render the catalog table
    }
  }
  // ...other logic (feedback, close modal, etc.)
}

function renderCourseCatalog() {
  const tbody = document.querySelector("#catalogTable tbody");
  tbody.innerHTML = "";
  courseCatalog.forEach(course => {
    tbody.innerHTML += `
      <tr>
        <td>${course.course}</td>
        <td>${course.topic}</td>
        <td>${course.estimatedTime}</td>
        <td><a href="${course.pdf}" target="_blank">PDF</a></td>
        <td>
          ${course.completed
            ? '<span style="color:#43a047;font-weight:bold;">Completed</span>'
            : '<span style="color:#e57373;">Not Completed</span>'
          }
        </td>
      </tr>
    `;
  });
}

// Utility to update Today's Marks and Bonus Points
function updateTodaysMarks(points, bonus = 0) {
  const marksElem = document.getElementById('todaysMarks');
  const bonusElem = document.getElementById('bonusPoints');
  let currentMarks = parseInt(marksElem?.textContent || "0", 10);
  let currentBonus = parseInt(bonusElem?.textContent || "0", 10);

  // Add points and bonus
  currentMarks += points;
  currentBonus += bonus;

  if (marksElem) marksElem.textContent = currentMarks;
  if (bonusElem) bonusElem.textContent = currentBonus;
}

// Example: Call this when a quiz question is answered correctly
function onQuizCorrectAnswer() {
  // For example, 10 points for correct answer, 2 bonus points
  updateTodaysMarks(10, 2);
}

// Example: Call this when a quiz question is answered incorrectly (no points, maybe no bonus)
function onQuizWrongAnswer() {
  // No points, no bonus
  updateTodaysMarks(0, 0);
}

// Example quiz data for each course
const courseQuizzes = {
  "COURSE_ID": {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correct: 1 // index of correct answer
  },
  // Add more courses as needed
};

// Open quiz modal when "Mark as Read" is clicked
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('mark-read-btn')) {
    const courseId = e.target.getAttribute('data-course-id');
    showCourseQuiz(courseId, e.target);
  }
});

function showCourseQuiz(courseId, btnElem) {
  const quiz = courseQuizzes[courseId];
  if (!quiz) return;
  document.getElementById('courseQuizModal').style.display = 'block';
  document.getElementById('courseQuizQuestion').textContent = quiz.question;
  const optionsDiv = document.getElementById('courseQuizOptions');
  optionsDiv.innerHTML = '';
  quiz.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.style = "background:#ffd700;color:#1e3a8a;border:none;padding:8px 22px;font-weight:600;margin:6px 0;width:100%;";
    btn.onclick = function() {
      if (idx === quiz.correct) {
        btnElem.textContent = "Completed";
        btnElem.disabled = true;
        btnElem.style.background = "#43a047";
        btnElem.style.color = "#fff";
      }
      closeCourseQuizModal();
    };
    optionsDiv.appendChild(btn);
  });
}

function closeCourseQuizModal() {
  document.getElementById('courseQuizModal').style.display = 'none';
}