class QuizEngine {
  constructor() {
      this.config = {
          shuffleQuestions: true,
          showProgress: true
      };

      this.elements = {
          quizContent: document.getElementById('quizContent'),
          resultContainer: document.getElementById('resultContainer'),
          submitBtn: document.getElementById('submitBtn'),
          retryBtn: document.getElementById('retryBtn'),
          reviewBtn: document.getElementById('reviewBtn'),
          progressFill: document.querySelector('.progress-fill')
      };

      this.quizData = [/* Your quiz data array */

        {
          question: 'What is the capital of France?',
          options: ['Paris', 'London', 'Berlin', 'Madrid'],
          answer: 'Paris',
        },
        {
          question: 'What is the largest planet in our solar system?',
          options: ['Mars', 'Saturn', 'Jupiter', 'Neptune'],
          answer: 'Jupiter',
        },
        {
          question: 'Which country won the FIFA World Cup in 2018?',
          options: ['Brazil', 'Germany', 'France', 'Argentina'],
          answer: 'France',
        },
        {
          question: 'What is the tallest mountain in the world?',
          options: ['Mount Everest', 'K2', 'Kangchenjunga', 'Makalu'],
          answer: 'Mount Everest',
        },
        {
          question: 'Which is the largest ocean on Earth?',
          options: ['Pacific Ocean', 'Indian Ocean', 'Atlantic Ocean', 'Arctic Ocean'],
          answer: 'Pacific Ocean',
        },
        {
          question: 'What is the chemical symbol for gold?',
          options: ['Au', 'Ag', 'Cu', 'Fe'],
          answer: 'Au',
        },
        {
          question: 'Who painted the Mona Lisa?',
          options: ['Pablo Picasso', 'Vincent van Gogh', 'Leonardo da Vinci', 'Michelangelo'],
          answer: 'Leonardo da Vinci',
        },
        {
          question: 'Which planet is known as the Red Planet?',
          options: ['Mars', 'Venus', 'Mercury', 'Uranus'],
          answer: 'Mars',
        },
        {
          question: 'What is the largest species of shark?',
          options: ['Great White Shark', 'Whale Shark', 'Tiger Shark', 'Hammerhead Shark'],
          answer: 'Whale Shark',
        },
        {
          question: 'Which animal is known as the King of the Jungle?',
          options: ['Lion', 'Tiger', 'Elephant', 'Giraffe'],
          answer: 'Lion',
        },
      
      ];

      this.state = {
          currentIndex: 0,
          score: 0,
          selectedOption: null,
          incorrectAnswers: [],
          progress: 0
      };

      this.initialize();
  }

  initialize() {
      if (this.config.shuffleQuestions) this.shuffleQuestions();
      this.setupEventListeners();
      this.updateProgress();
      this.renderQuestion();
  }

  setupEventListeners() {
      this.elements.submitBtn.addEventListener('click', () => this.handleSubmission());
      this.elements.retryBtn.addEventListener('click', () => this.restartQuiz());
      this.elements.reviewBtn.addEventListener('click', () => this.showReview());
  }

  shuffleQuestions() {
      this.quizData = this.quizData
          .map(q => ({...q, options: this.shuffleArray([...q.options])}))
          .sort(() => Math.random() - 0.5);
  }

  renderQuestion() {
      const currentQ = this.quizData[this.state.currentIndex];
      
      const questionHTML = `
          <article class="question-card">
              <h2 class="question-text">${currentQ.question}</h2>
              <div class="options-grid">
                  ${currentQ.options.map(opt => `
                      <div class="option" data-value="${opt}">
                          ${opt}
                      </div>
                  `).join('')}
              </div>
          </article>
      `;

      this.elements.quizContent.innerHTML = questionHTML;
      this.setupOptionListeners();
  }

  setupOptionListeners() {
      document.querySelectorAll('.option').forEach(option => {
          option.addEventListener('click', (e) => {
              document.querySelectorAll('.option').forEach(opt => 
                  opt.classList.remove('selected'));
              e.target.classList.add('selected');
              this.state.selectedOption = e.target.dataset.value;
          });
      });
  }

  handleSubmission() {
      if (!this.state.selectedOption) {
          this.showToast('Please select an answer before submitting!');
          return;
      }

      const currentQ = this.quizData[this.state.currentIndex];
      const isCorrect = this.state.selectedOption === currentQ.answer;

      if (isCorrect) {
          this.state.score++;
      } else {
          this.state.incorrectAnswers.push({
              question: currentQ.question,
              selected: this.state.selectedOption,
              correct: currentQ.answer
          });
      }

      this.state.currentIndex++;
      this.state.selectedOption = null;
      this.updateProgress();

      if (this.state.currentIndex < this.quizData.length) {
          this.renderQuestion();
      } else {
          this.showFinalResults();
      }
  }

  updateProgress() {
      this.state.progress = 
          (this.state.currentIndex / this.quizData.length) * 100;
      this.elements.progressFill.style.width = `${this.state.progress}%`;
  }

  showFinalResults() {
      this.elements.quizContent.classList.add('hidden');
      this.elements.submitBtn.classList.add('hidden');
      this.elements.retryBtn.classList.remove('hidden');
      this.elements.reviewBtn.classList.remove('hidden');

      this.elements.resultContainer.innerHTML = `
          <div class="result-card">
              <h3>Quiz Complete! 🎉</h3>
              <p>Your Score: <strong>${this.state.score}/${this.quizData.length}</strong></p>
              <p>${this.getPerformanceFeedback()}</p>
          </div>
      `;
  }

  getPerformanceFeedback() {
      const percentage = (this.state.score / this.quizData.length) * 100;
      if (percentage === 100) return 'Perfect score! Amazing work! 🌟';
      if (percentage >= 80) return 'Excellent performance! Keep it up! 🚀';
      if (percentage >= 60) return 'Good effort! Keep practicing! 💪';
      return 'Keep learning - you\'ll get better! 📚';
  }

  showReview() {
      const reviewHTML = `
          <div class="feedback-list">
              ${this.state.incorrectAnswers.map((item, index) => `
                  <div class="feedback-item incorrect">
                      <h4>Question ${index + 1}</h4>
                      <p>${item.question}</p>
                      <p class="user-answer">Your answer: ${item.selected}</p>
                      <p class="correct-answer">Correct answer: ${item.correct}</p>
                  </div>
              `).join('')}
          </div>
      `;

      this.elements.resultContainer.insertAdjacentHTML('beforeend', reviewHTML);
      this.elements.reviewBtn.classList.add('hidden');
  }

  restartQuiz() {
      this.state = {
          currentIndex: 0,
          score: 0,
          selectedOption: null,
          incorrectAnswers: [],
          progress: 0
      };

      this.elements.quizContent.classList.remove('hidden');
      this.elements.submitBtn.classList.remove('hidden');
      this.elements.retryBtn.classList.add('hidden');
      this.elements.reviewBtn.classList.add('hidden');
      this.elements.resultContainer.innerHTML = '';
      this.updateProgress();
      this.renderQuestion();
  }

  shuffleArray(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
  }

  showToast(message) {
      const toast = document.createElement('div');
      toast.className = 'toast-message';
      toast.textContent = message;
      document.body.appendChild(toast);
      
      setTimeout(() => {
          toast.classList.add('fade-out');
          setTimeout(() => toast.remove(), 300);
      }, 2500);
  }
}

// Initialize the quiz when ready
document.addEventListener('DOMContentLoaded', () => new QuizEngine());