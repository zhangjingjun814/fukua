/* =========================================================
   Exaggerated Feature Site — Site-wide interactions
   Modules: theme toggle / mobile menu / accordion / quiz / form validation
   Plain vanilla JavaScript, no frameworks
   ========================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------------
     1. Theme (light / dark) toggle
     The initial theme is set early by the inline script in <head>
     to avoid a flash. Here we only handle the button and persistence.
  --------------------------------------------------------- */
  // Safe wrapper around localStorage: it may be disabled in private
  // mode or on an opaque origin.
  const safeStorage = {
    get(key) {
      try {
        return localStorage.getItem(key);
      } catch (err) {
        return null;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch (err) {
        /* Ignore write failures; the theme still toggles in this session */
      }
    },
  };

  const themeBtn = document.querySelector("[data-theme-toggle]");

  if (themeBtn) {
    const iconSun = themeBtn.querySelector(".icon-sun");
    const iconMoon = themeBtn.querySelector(".icon-moon");

    function syncButton() {
      const isDark = document.documentElement.getAttribute("data-theme") !== "light";
      // In dark mode show the "sun" (click to go light), otherwise the moon.
      iconSun.hidden = !isDark;
      iconMoon.hidden = isDark;
      themeBtn.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
      );
    }

    themeBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      safeStorage.set("theme", next);
      syncButton();
    });

    syncButton();
  }

  /* ---------------------------------------------------------
     2. Mobile hamburger menu
  --------------------------------------------------------- */
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navList = document.querySelector(".nav-list");

  if (navToggle && navList) {
    navToggle.addEventListener("click", () => {
      const isOpen = navList.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close the menu after a navigation link is tapped (mobile UX).
    navList.addEventListener("click", (event) => {
      if (event.target.tagName === "A") {
        navList.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------------------------------------------------------
     3. Accordion (collapsible sections on the Analysis page)
  --------------------------------------------------------- */
  document.querySelectorAll(".acc-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!expanded));
      const panel = document.getElementById(
        trigger.getAttribute("aria-controls")
      );
      if (panel) {
        // Give the panel an explicit height when open, zero when closed.
        panel.style.maxHeight = expanded
          ? "0"
          : panel.scrollHeight + "px";
      }
    });
  });

  /* ---------------------------------------------------------
     4. "How Well Do You Know Exaggerated" quiz
     Rendered from data; state is kept in the answers object.
  --------------------------------------------------------- */
  const quizContainer = document.querySelector("[data-quiz]");

  if (quizContainer) {
    const quizData = [
      {
        id: "q1",
        question: "Who wrote the lyrics for “Exaggerated”?",
        options: ["Wyman Wong", "Albert Leung", "Richard Lam"],
        answer: 0,
      },
      {
        id: "q2",
        question: "What was the original English title of the melody?",
        options: ["Loneliness", "Depression", "The Show"],
        answer: 1,
      },
      {
        id: "q3",
        question: "Which Eason Chan album features “Exaggerated”?",
        options: ["What's Going On…?", "H³M", "U87"],
        answer: 2,
      },
      {
        id: "q4",
        question: "Who composed and arranged the song?",
        options: ["Mark Lui", "C.Y. Kong", "Chan Fai-young"],
        answer: 1,
      },
    ];

    // Record the selected index of each question in a state object.
    const answers = {};

    function renderQuiz() {
      const fieldsets = quizData
        .map((item, qIndex) => {
          const radios = item.options
            .map((option, oIndex) => {
              return `
                <label class="quiz-option">
                  <input type="radio" name="${item.id}" value="${oIndex}" />
                  <span>${option}</span>
                </label>`;
            })
            .join("");

          return `
            <div class="quiz-question">
              <fieldset>
                <legend>${qIndex + 1}. ${item.question}</legend>
                ${radios}
              </fieldset>
            </div>`;
        })
        .join("");

      quizContainer.innerHTML = `
        ${fieldsets}
        <button type="button" class="btn btn--primary" data-quiz-submit>
          See Results
        </button>
        <div class="quiz-result" role="status" aria-live="polite"></div>
      `;
    }

    renderQuiz();

    // Event delegation: listen for selections across the whole quiz.
    quizContainer.addEventListener("change", (event) => {
      if (event.target.type === "radio") {
        answers[event.target.name] = Number(event.target.value);
      }
    });

    quizContainer
      .querySelector("[data-quiz-submit]")
      .addEventListener("click", () => {
        const resultEl = quizContainer.querySelector(".quiz-result");

        // If incomplete, prompt instead of scoring.
        if (Object.keys(answers).length < quizData.length) {
          resultEl.className = "quiz-result show quiz-result--bad";
          resultEl.textContent = "Some questions are unanswered. Please answer every question.";
          return;
        }

        let score = 0;
        quizData.forEach((item) => {
          if (answers[item.id] === item.answer) score += 1;
        });

        const passed = score >= 3;
        resultEl.className =
          "quiz-result show " +
          (passed ? "quiz-result--ok" : "quiz-result--bad");
        resultEl.textContent = passed
          ? `You got ${score} / ${quizData.length} right — you already know this song well!`
          : `You got ${score} / ${quizData.length} right. Try revisiting the analysis above.`;
      });
  }

  /* ---------------------------------------------------------
     5. Contact form validation (no back-end, front-end only)
  --------------------------------------------------------- */
  const form = document.querySelector("[data-contact-form]");

  if (form) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setError(field, message) {
      const row = field.closest(".form-row");
      const errorEl = row.querySelector(".field-error");
      row.classList.toggle("invalid", Boolean(message));
      field.setAttribute("aria-invalid", message ? "true" : "false");
      if (errorEl) errorEl.textContent = message;
    }

    function validateField(field) {
      const value = field.value.trim();
      let message = "";

      if (field.name === "name" && value.length < 2) {
        message = "Please enter a name of at least 2 characters.";
      } else if (field.name === "email" && !emailPattern.test(value)) {
        message = "Please enter a valid email address, e.g. name@example.com.";
      } else if (field.name === "message" && value.length < 10) {
        message = "The message needs to be at least 10 characters.";
      }

      setError(field, message);
      return !message;
    }

    // Validate on blur, clear errors while typing.
    form.querySelectorAll("input, textarea").forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
      field.addEventListener("input", () => {
        if (field.closest(".form-row").classList.contains("invalid")) {
          setError(field, "");
          field.setAttribute("aria-invalid", "false");
        }
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const fields = [...form.querySelectorAll("input, textarea")];
      const allValid = fields
        .map((field) => validateField(field))
        .every(Boolean);

      const status = form.querySelector(".form-status");
      if (allValid) {
        status.className = "form-status show form-status--ok";
        status.textContent =
          "Thanks for your message! (This is a learning demo; nothing is actually sent.)";
        form.reset();
      } else {
        status.className = "form-status show";
        status.textContent = "";
        // Focus the first invalid field for keyboard users.
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
      }
    });
  }
})();
