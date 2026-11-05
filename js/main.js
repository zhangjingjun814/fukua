/* =========================================================
   《浮夸》专题网站 — 全站交互
   模块：主题切换 / 移动端菜单 / 手风琴 / 小测验 / 表单验证
   纯原生 JavaScript，无任何框架
   ========================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------------
     1. 主题（亮 / 暗）切换
     初始主题已由 <head> 中的内联脚本提前设置，避免页面闪烁。
     这里只负责按钮点击与持久化。
  --------------------------------------------------------- */
  // 对 localStorage 的安全封装：隐私模式或不透明 origin 下可能被禁用
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
        /* 忽略写入失败，主题仍可在当前会话切换 */
      }
    },
  };

  const themeBtn = document.querySelector("[data-theme-toggle]");

  if (themeBtn) {
    const iconSun = themeBtn.querySelector(".icon-sun");
    const iconMoon = themeBtn.querySelector(".icon-moon");

    function syncButton() {
      const isDark = document.documentElement.getAttribute("data-theme") !== "light";
      // 暗色时显示“太阳”（点击可切到亮色），反之显示月亮
      iconSun.hidden = !isDark;
      iconMoon.hidden = isDark;
      themeBtn.setAttribute(
        "aria-label",
        isDark ? "切换到亮色模式" : "切换到暗色模式"
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
     2. 移动端汉堡菜单
  --------------------------------------------------------- */
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navList = document.querySelector(".nav-list");

  if (navToggle && navList) {
    navToggle.addEventListener("click", () => {
      const isOpen = navList.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // 点击导航链接后自动收起菜单（移动端体验）
    navList.addEventListener("click", (event) => {
      if (event.target.tagName === "A") {
        navList.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------------------------------------------------------
     3. 手风琴（主题解析页折叠章节）
  --------------------------------------------------------- */
  document.querySelectorAll(".acc-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!expanded));
      const panel = document.getElementById(
        trigger.getAttribute("aria-controls")
      );
      if (panel) {
        // 展开时给面板一个明确高度，收起时归零
        panel.style.maxHeight = expanded
          ? "0"
          : panel.scrollHeight + "px";
      }
    });
  });

  /* ---------------------------------------------------------
     4. “听懂《浮夸》”小测验
     题目数据驱动渲染，状态保存在 answers 对象中
  --------------------------------------------------------- */
  const quizContainer = document.querySelector("[data-quiz]");

  if (quizContainer) {
    const quizData = [
      {
        id: "q1",
        question: "《浮夸》的填词人是谁？",
        options: ["黄伟文", "林夕", "林振强"],
        answer: 0,
      },
      {
        id: "q2",
        question: "这段旋律最初的英文名字叫什么？",
        options: ["Loneliness", "Depression", "The Show"],
        answer: 1,
      },
      {
        id: "q3",
        question: "《浮夸》收录于陈奕迅的哪张专辑？",
        options: ["《What's Going On…?》", "《H³M》", "《U87》"],
        answer: 2,
      },
      {
        id: "q4",
        question: "这首歌的作曲兼编曲人是谁？",
        options: ["雷颂德", "江志仁（C.Y. Kong）", "陈辉阳"],
        answer: 1,
      },
    ];

    // 用状态对象记录每题所选下标
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
          查看结果
        </button>
        <div class="quiz-result" role="status" aria-live="polite"></div>
      `;
    }

    renderQuiz();

    // 事件委托：监听整份测验内的选择变化
    quizContainer.addEventListener("change", (event) => {
      if (event.target.type === "radio") {
        answers[event.target.name] = Number(event.target.value);
      }
    });

    quizContainer
      .querySelector("[data-quiz-submit]")
      .addEventListener("click", () => {
        const resultEl = quizContainer.querySelector(".quiz-result");

        // 未答完则提示，不判分
        if (Object.keys(answers).length < quizData.length) {
          resultEl.className = "quiz-result show quiz-result--bad";
          resultEl.textContent = "还有题目没有作答，请完成全部题目。";
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
          ? `你答对了 ${score} / ${quizData.length} 题，已经很懂这首歌了！`
          : `你答对了 ${score} / ${quizData.length} 题，建议回到上面的解析再读一遍。`;
      });
  }

  /* ---------------------------------------------------------
     5. 联系表单验证（无后端，仅前端校验）
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
        message = "请输入至少 2 个字符的姓名。";
      } else if (field.name === "email" && !emailPattern.test(value)) {
        message = "请输入有效的邮箱地址，例如 name@example.com。";
      } else if (field.name === "message" && value.length < 10) {
        message = "留言至少需要 10 个字符。";
      }

      setError(field, message);
      return !message;
    }

    // 失焦时即时校验，输入时清除错误
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
          "感谢你的留言！（这是学习演示，表单不会真正发送邮件）";
        form.reset();
      } else {
        status.className = "form-status show";
        status.textContent = "";
        // 聚焦第一个出错的字段，方便键盘用户
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
      }
    });
  }
})();
