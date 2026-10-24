App.register({
  id: "timer",
  title: "小組計時",
  icon: "⏱️",
  init(el) {
    el.classList.add("tool-root");
    el.dataset.toolRoot = "timer";
    el.innerHTML = "<main class=\"app\" id=\"timer-app\">\n    <header class=\"topbar\">\n      <div class=\"brand\">\n        <div class=\"brand-mark\" aria-hidden=\"true\">\n          <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n            <circle cx=\"12\" cy=\"13\" r=\"8\"></circle><path d=\"M12 9v4l2.5 1.5M9 2h6M12 2v3\"></path>\n          </svg>\n        </div>\n        <div>\n          <h1>課堂小組計時器</h1>\n          <p>讓每一段學習，都剛剛好</p>\n        </div>\n      </div>\n      <div class=\"top-actions\">\n        <button class=\"icon-button\" id=\"timer-fullscreenButton\" type=\"button\" aria-label=\"進入全螢幕\" title=\"全螢幕展示\">\n          <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\">\n            <path d=\"M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m13-5v3a2 2 0 0 1-2 2h-3\"></path>\n          </svg>\n          全螢幕\n        </button>\n      </div>\n    </header>\n\n    <section class=\"main-layout\" id=\"timer-mainLayout\">\n      <aside class=\"settings-panel\" aria-label=\"計時器設定\">\n        <p class=\"eyebrow\">CLASSROOM TIMER</p>\n        <h2>準備開始活動</h2>\n        <div class=\"mode-switch\" role=\"group\" aria-label=\"計時模式\">\n          <button class=\"mode-button\" id=\"timer-countdownMode\" type=\"button\" aria-pressed=\"true\">倒數計時</button>\n          <button class=\"mode-button\" id=\"timer-stopwatchMode\" type=\"button\" aria-pressed=\"false\">正數碼錶</button>\n        </div>\n\n        <div id=\"timer-durationSettings\">\n          <label class=\"field-label\" for=\"timer-minutesInput\">設定活動時間</label>\n          <div class=\"time-inputs\">\n            <div class=\"input-wrap\">\n              <input id=\"timer-minutesInput\" type=\"number\" inputmode=\"numeric\" min=\"0\" max=\"999\" step=\"1\" value=\"1\" aria-label=\"分鐘\">\n              <span>分鐘</span>\n            </div>\n            <div class=\"input-wrap\">\n              <input id=\"timer-secondsInput\" type=\"number\" inputmode=\"numeric\" min=\"0\" max=\"59\" step=\"1\" value=\"0\" aria-label=\"秒數\">\n              <span>秒</span>\n            </div>\n          </div>\n          <p class=\"input-error\" id=\"timer-durationError\" role=\"alert\" hidden></p>\n          <div class=\"preset-heading\"><span>快速設定</span><span>一鍵套用時間</span></div>\n          <div class=\"preset-grid\" role=\"group\" aria-label=\"快速設定時間\">\n            <button class=\"preset-button\" type=\"button\" data-minutes=\"1\" aria-pressed=\"true\">1 分鐘</button>\n            <button class=\"preset-button\" type=\"button\" data-minutes=\"3\" aria-pressed=\"false\">3 分鐘</button>\n            <button class=\"preset-button\" type=\"button\" data-minutes=\"5\" aria-pressed=\"false\">5 分鐘</button>\n            <button class=\"preset-button\" type=\"button\" data-minutes=\"10\" aria-pressed=\"false\">10 分鐘</button>\n            <button class=\"preset-button\" type=\"button\" data-minutes=\"15\" aria-pressed=\"false\">15 分鐘</button>\n            <button class=\"preset-button\" type=\"button\" data-minutes=\"20\" aria-pressed=\"false\">20 分鐘</button>\n          </div>\n        </div>\n\n        <label class=\"multi-toggle\" for=\"timer-multiToggle\">\n          <span class=\"toggle-copy\"><strong>多組計時</strong><small>同時管理四個小組的進度</small></span>\n          <input id=\"timer-multiToggle\" type=\"checkbox\">\n          <span class=\"switch\" aria-hidden=\"true\"></span>\n        </label>\n        <p class=\"keyboard-hint\">快捷鍵：<kbd>Space</kbd> 開始／暫停　<kbd>R</kbd> 重設</p>\n      </aside>\n\n      <section class=\"timer-area\" aria-label=\"計時器\">\n        <div class=\"single-timer\" id=\"timer-singleTimer\">\n          <p class=\"timer-kicker\" id=\"timer-timerKicker\">活動倒數</p>\n          <div class=\"ring-shell\" id=\"timer-singleRingShell\">\n            <svg class=\"ring-svg\" viewBox=\"0 0 240 240\" aria-hidden=\"true\">\n              <defs>\n                <linearGradient id=\"timer-ringGradient\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\">\n                  <stop offset=\"0%\" stop-color=\"#81f0b5\"></stop>\n                  <stop offset=\"100%\" stop-color=\"#35d98c\"></stop>\n                </linearGradient>\n              </defs>\n              <circle class=\"ring-track\" cx=\"120\" cy=\"120\" r=\"105\"></circle>\n              <circle class=\"ring-progress\" id=\"timer-singleProgress\" cx=\"120\" cy=\"120\" r=\"105\"></circle>\n            </svg>\n            <div class=\"timer-content\">\n              <div class=\"time-display\" id=\"timer-singleDisplay\" role=\"timer\" aria-live=\"off\">01:00</div>\n              <p class=\"timer-status\" id=\"timer-singleStatus\" aria-live=\"polite\">準備就緒</p>\n            </div>\n          </div>\n          <div class=\"control-row timer-actions\">\n            <button class=\"primary-button\" id=\"timer-mainStartButton\" type=\"button\"><span class=\"button-icon\">▶</span>開始</button>\n            <button class=\"secondary-button\" id=\"timer-mainResetButton\" type=\"button\"><span class=\"button-icon\">↺</span>重設</button>\n          </div>\n        </div>\n\n        <div class=\"multi-timers\" id=\"timer-multiTimers\" aria-label=\"四組小組計時器\"></div>\n        <div class=\"multi-global-actions control-row\">\n          <button class=\"primary-button\" id=\"timer-allStartButton\" type=\"button\">▶ 全部開始</button>\n          <button class=\"secondary-button\" id=\"timer-allResetButton\" type=\"button\">↺ 全部重設</button>\n        </div>\n      </section>\n    </section>\n\n    <footer class=\"footer\"><span>專注當下</span><span>一起完成</span><span>每組都精彩</span></footer>\n    <div id=\"timer-announcement\" class=\"visually-hidden\" aria-live=\"assertive\"></div>\n  </main>";
    (() => {
      "use strict";


      const STORAGE_KEY = "classroom-group-timer-settings-v1";
      const CIRCUMFERENCE = 2 * Math.PI * 105;
      const GROUPS = ["第一組", "第二組", "第三組", "第四組"];
      const defaultSettings = { minutes: 1, seconds: 0, mode: "countdown", multi: false, preset: 1 };
      const timers = [];
      let mode = defaultSettings.mode;
      let multiMode = defaultSettings.multi;
      let configuredDurationMs = 60_000;
      let renderTimer = null;
      let alarmAudioContext = null;
      let flashTimeout = null;

      const app = el.querySelector("#timer-app");
      const minutesInput = el.querySelector("#timer-minutesInput");
      const secondsInput = el.querySelector("#timer-secondsInput");
      const durationError = el.querySelector("#timer-durationError");
      const durationSettings = el.querySelector("#timer-durationSettings");
      const multiToggle = el.querySelector("#timer-multiToggle");
      const singleDisplay = el.querySelector("#timer-singleDisplay");
      const singleStatus = el.querySelector("#timer-singleStatus");
      const singleProgress = el.querySelector("#timer-singleProgress");
      const singleRingShell = el.querySelector("#timer-singleRingShell");
      const mainStartButton = el.querySelector("#timer-mainStartButton");
      const announcement = el.querySelector("#timer-announcement");
      const presetButtons = [...el.querySelectorAll(".preset-button")];

      function readSettings() {
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (!stored) return { ...defaultSettings };
          const parsed = JSON.parse(stored);
          const minutes = Number.isInteger(parsed.minutes) && parsed.minutes >= 0 && parsed.minutes <= 999 ? parsed.minutes : defaultSettings.minutes;
          const seconds = Number.isInteger(parsed.seconds) && parsed.seconds >= 0 && parsed.seconds <= 59 ? parsed.seconds : defaultSettings.seconds;
          const preset = [1, 3, 5, 10, 15, 20].includes(parsed.preset) ? parsed.preset : null;
          return {
            minutes,
            seconds,
            mode: parsed.mode === "stopwatch" ? "stopwatch" : "countdown",
            multi: parsed.multi === true,
            preset
          };
        } catch (error) {
          console.warn("無法讀取已保存的計時器設定。", error);
          return { ...defaultSettings };
        }
      }

      function saveSettings() {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            minutes: Number(minutesInput.value),
            seconds: Number(secondsInput.value),
            mode,
            multi: multiMode,
            preset: selectedPreset()
          }));
        } catch (error) {
          console.warn("無法保存計時器設定。", error);
        }
      }

      function selectedPreset() {
        const selected = presetButtons.find(button => button.getAttribute("aria-pressed") === "true");
        return selected ? Number(selected.dataset.minutes) : null;
      }

      function formatTime(totalSeconds) {
        const safeSeconds = Math.max(0, Math.floor(totalSeconds));
        const minutes = Math.floor(safeSeconds / 60);
        const seconds = safeSeconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
      }

      function formatElapsed(milliseconds) {
        return formatTime(Math.floor(milliseconds / 1000));
      }

      function getConfiguredDuration() {
        const minutes = Number(minutesInput.value);
        const seconds = Number(secondsInput.value);
        if (!Number.isInteger(minutes) || minutes < 0 || minutes > 999 ||
            !Number.isInteger(seconds) || seconds < 0 || seconds > 59) {
          return null;
        }
        return (minutes * 60 + seconds) * 1000;
      }

      function syncDurationFromInputs(updateAll = true) {
        const duration = getConfiguredDuration();
        if (duration === null) {
          minutesInput.setAttribute("aria-invalid", "true");
          secondsInput.setAttribute("aria-invalid", "true");
          durationError.textContent = "請輸入 0–999 的整數分鐘，以及 0–59 的整數秒數。";
          durationError.hidden = false;
          return false;
        }
        if (duration === 0 && mode === "countdown") {
          minutesInput.setAttribute("aria-invalid", "true");
          secondsInput.setAttribute("aria-invalid", "true");
          durationError.textContent = "倒數時間必須大於 0 秒。";
          durationError.hidden = false;
          return false;
        }
        minutesInput.removeAttribute("aria-invalid");
        secondsInput.removeAttribute("aria-invalid");
        durationError.hidden = true;
        configuredDurationMs = duration;
        presetButtons.forEach(button => button.setAttribute("aria-pressed", "false"));
        if (updateAll) {
          timers.forEach(timer => {
            if (!timer.running) resetTimer(timer, false);
          });
        }
        saveSettings();
        render();
        return true;
      }

      function createTimer(name, element, isMain = false) {
        return {
          name,
          element,
          isMain,
          running: false,
          finished: false,
          endTime: null,
          startedAt: null,
          remainingMs: configuredDurationMs,
          elapsedBeforeStart: 0,
          durationMs: configuredDurationMs,
          animationFrame: null,
          display: element.querySelector(".time-display"),
          status: element.querySelector(".timer-status"),
          progress: element.querySelector(".ring-progress"),
          startButton: element.querySelector(isMain ? "#timer-mainStartButton" : ".group-start"),
          urgent: false
        };
      }

      function makeGroupCards() {
        const container = el.querySelector("#timer-multiTimers");
        container.innerHTML = "";
        GROUPS.forEach((name, index) => {
          const card = document.createElement("article");
          card.className = "group-card";
          card.innerHTML = `
            <header><h3>${name}</h3><span class="group-badge">討論中</span></header>
            <div class="ring-shell group-ring">
              <svg class="ring-svg" viewBox="0 0 240 240" aria-hidden="true">
                <circle class="ring-track" cx="120" cy="120" r="105"></circle>
                <circle class="ring-progress" cx="120" cy="120" r="105"></circle>
              </svg>
              <div class="timer-content">
                <div class="time-display" role="timer" aria-live="off">01:00</div>
                <p class="timer-status" aria-live="polite">準備就緒</p>
              </div>
            </div>
            <div class="control-row timer-actions">
              <button class="primary-button group-start" type="button" aria-label="開始${name}計時"><span class="button-icon">▶</span>開始</button>
              <button class="secondary-button group-reset" type="button" aria-label="重設${name}計時">↺ 重設</button>
            </div>`;
          container.appendChild(card);
          const timer = createTimer(name, card);
          timer.index = index;
          timers.push(timer);
          card.querySelector(".group-start").addEventListener("click", () => toggleTimer(timer));
          card.querySelector(".group-reset").addEventListener("click", () => resetTimer(timer));
        });
      }

      function timerElapsed(timer, now = Date.now()) {
        if (timer.running) return timer.elapsedBeforeStart + (now - timer.startedAt);
        return timer.elapsedBeforeStart;
      }

      function timerRemaining(timer, now = Date.now()) {
        return timer.running ? Math.max(0, timer.endTime - now) : Math.max(0, timer.remainingMs);
      }

      function clearTimerFrame(timer) {
        if (timer.animationFrame !== null) {
          cancelAnimationFrame(timer.animationFrame);
          timer.animationFrame = null;
        }
      }

      function startTimer(timer) {
        if (timer.running) return;
        if (mode === "countdown") {
          const requestedDuration = getConfiguredDuration();
          if (requestedDuration === null || requestedDuration === 0) {
            syncDurationFromInputs();
            return;
          }
          if (requestedDuration !== configuredDurationMs) syncDurationFromInputs();
        }
        if (timer.finished || (!timer.isMain && timer.remainingMs <= 0)) resetTimer(timer, false);
        if (mode === "stopwatch") {
          timer.startedAt = Date.now();
          timer.running = true;
          timer.finished = false;
        } else {
          const remainingMs = timer.remainingMs;
          if (remainingMs <= 0) return;
          timer.endTime = Date.now() + remainingMs;
          timer.startedAt = Date.now();
          timer.running = true;
          timer.finished = false;
        }
        unlockAudio();
        scheduleRender();
        render();
      }

      function pauseTimer(timer) {
        if (!timer.running) return;
        const now = Date.now();
        if (mode === "stopwatch") {
          timer.elapsedBeforeStart += now - timer.startedAt;
        } else {
          timer.remainingMs = Math.max(0, timer.endTime - now);
        }
        timer.running = false;
        timer.startedAt = null;
        timer.endTime = null;
        clearTimerFrame(timer);
        render();
      }

      function toggleTimer(timer) {
        if (timer.running) pauseTimer(timer);
        else startTimer(timer);
      }

      function resetTimer(timer, shouldRender = true) {
        clearTimerFrame(timer);
        if (timer.finished) clearFinishedFlash();
        timer.running = false;
        timer.finished = false;
        timer.endTime = null;
        timer.startedAt = null;
        timer.remainingMs = mode === "stopwatch" ? 0 : configuredDurationMs;
        timer.elapsedBeforeStart = 0;
        timer.durationMs = configuredDurationMs;
        timer.urgent = false;
        if (shouldRender) render();
      }

      function resetAllTimers() {
        activeTimers().forEach(timer => resetTimer(timer, false));
        clearFinishedFlash();
        render();
      }

      function activeTimers() {
        return multiMode ? timers.slice(1) : [timers[0]];
      }

      function startAllTimers() {
        activeTimers().forEach(timer => {
          if (!timer.running) startTimer(timer);
        });
      }

      function pauseAllTimers() {
        activeTimers().forEach(timer => pauseTimer(timer));
      }

      function ringRatio(timer, now) {
        if (mode === "stopwatch") {
          const elapsed = timerElapsed(timer, now);
          return (elapsed % 60_000) / 60_000;
        }
        if (timer.durationMs <= 0) return 0;
        return timerRemaining(timer, now) / timer.durationMs;
      }

      function statusText(timer) {
        if (timer.finished) return "時間到！";
        if (timer.running) return mode === "stopwatch" ? "碼錶進行中" : "活動進行中";
        if (mode === "stopwatch" && timer.elapsedBeforeStart > 0) return "已暫停";
        if (mode === "stopwatch") return "準備就緒";
        if (timer.remainingMs < timer.durationMs) return "已暫停";
        return "準備就緒";
      }

      function updateTimer(timer, now) {
        if (timer.running && mode !== "stopwatch" && now >= timer.endTime) {
          timer.remainingMs = 0;
          timer.running = false;
          timer.finished = true;
          timer.endTime = null;
          timer.startedAt = null;
          timer.elapsedBeforeStart = timer.durationMs;
          timer.urgent = false;
          clearTimerFrame(timer);
          playAlarm();
          triggerFinishedFlash();
          announcement.textContent = `${timer.name}時間到！`;
        }

        const isStopwatch = mode === "stopwatch";
        const remainingMs = isStopwatch ? 0 : timerRemaining(timer, now);
        const totalSeconds = isStopwatch
          ? Math.floor(timerElapsed(timer, now) / 1000)
          : timer.running ? Math.ceil(remainingMs / 1000) : Math.ceil(timer.remainingMs / 1000);
        const ratio = Math.max(0, Math.min(1, ringRatio(timer, now)));
        const offset = CIRCUMFERENCE * (1 - ratio);
        const urgent = !isStopwatch && timer.running && remainingMs > 0 && remainingMs <= 10_000;
        timer.urgent = urgent;

        timer.display.textContent = formatTime(totalSeconds);
        timer.progress.style.strokeDasharray = String(CIRCUMFERENCE);
        timer.progress.style.strokeDashoffset = String(offset);
        timer.element.classList.toggle("urgent", urgent);
        timer.status.textContent = statusText(timer);
        timer.status.classList.toggle("complete", timer.finished);
        timer.status.classList.toggle("running", timer.running);

        if (timer.startButton) {
          const paused = timer.running;
          timer.startButton.innerHTML = paused
            ? '<span class="button-icon">Ⅱ</span>暫停'
            : '<span class="button-icon">▶</span>開始';
          timer.startButton.setAttribute("aria-label", `${paused ? "暫停" : "開始"}${timer.isMain ? "計時" : timer.name + "計時"}`);
        }
      }

      function render() {
        const now = Date.now();
        timers.forEach(timer => updateTimer(timer, now));
        app.classList.toggle("is-multi", multiMode);
        el.querySelector("#timer-singleTimer").hidden = multiMode;
        el.querySelector("#timer-multiTimers").hidden = !multiMode;
        el.querySelector(".multi-global-actions").hidden = !multiMode;
        durationSettings.hidden = mode === "stopwatch";
        el.querySelector("#timer-countdownMode").setAttribute("aria-pressed", String(mode === "countdown"));
        el.querySelector("#timer-stopwatchMode").setAttribute("aria-pressed", String(mode === "stopwatch"));
        el.querySelector("#timer-timerKicker").textContent = mode === "stopwatch" ? "活動碼錶" : "活動倒數";
        mainStartButton.innerHTML = timers[0].running
          ? '<span class="button-icon">Ⅱ</span>暫停'
          : '<span class="button-icon">▶</span>開始';
        mainStartButton.setAttribute("aria-label", timers[0].running ? "暫停計時" : "開始計時");
        el.querySelector("#timer-allStartButton").textContent = activeTimers().some(timer => timer.running) ? "Ⅱ 全部暫停" : "▶ 全部開始";
      }

      function scheduleRender() {
        if (renderTimer !== null) return;
        const tick = () => {
          renderTimer = null;
          const now = Date.now();
          timers.forEach(timer => {
            if (timer.running) updateTimer(timer, now);
          });
          if (timers.some(timer => timer.running)) {
            renderTimer = window.setTimeout(tick, 50);
          }
        };
        renderTimer = window.setTimeout(tick, 50);
      }

      function clearFinishedFlash() {
        el.classList.remove("finished-flash");
        if (flashTimeout !== null) {
          window.clearTimeout(flashTimeout);
          flashTimeout = null;
        }
      }

      function triggerFinishedFlash() {
        clearFinishedFlash();
        el.classList.remove("finished-flash");
        void el.offsetWidth;
        el.classList.add("finished-flash");
        flashTimeout = window.setTimeout(() => {
          el.classList.remove("finished-flash");
          flashTimeout = null;
        }, 2900);
      }

      function unlockAudio() {
        const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextConstructor) return;
        if (!alarmAudioContext) alarmAudioContext = new AudioContextConstructor();
        if (alarmAudioContext.state === "suspended") {
          alarmAudioContext.resume().catch(error => console.warn("無法啟用響鈴音效。", error));
        }
      }

      function playAlarm() {
        if (!window.AudioContext && !window.webkitAudioContext) {
          console.warn("此瀏覽器不支援 Web Audio API，無法播放響鈴。");
          return;
        }
        unlockAudio();
        if (!alarmAudioContext) return;
        const now = alarmAudioContext.currentTime;
        [0, 0.42, 0.84].forEach(delay => {
          const oscillator = alarmAudioContext.createOscillator();
          const gain = alarmAudioContext.createGain();
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(880, now + delay);
          oscillator.frequency.setValueAtTime(660, now + delay + 0.18);
          gain.gain.setValueAtTime(0.0001, now + delay);
          gain.gain.exponentialRampToValueAtTime(0.22, now + delay + 0.025);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.34);
          oscillator.connect(gain);
          gain.connect(alarmAudioContext.destination);
          oscillator.start(now + delay);
          oscillator.stop(now + delay + 0.36);
        });
      }

      function setMode(nextMode) {
        if (mode === nextMode) return;
        mode = nextMode;
        timers.forEach(timer => resetTimer(timer, false));
        if (mode === "stopwatch") timers.forEach(timer => { timer.remainingMs = 0; });
        saveSettings();
        render();
      }

      function setMultiMode(enabled) {
        timers.forEach(timer => pauseTimer(timer));
        multiMode = enabled;
        multiToggle.checked = enabled;
        saveSettings();
        render();
      }

      function setPreset(minutes) {
        minutesInput.value = String(minutes);
        secondsInput.value = "0";
        presetButtons.forEach(button => {
          button.setAttribute("aria-pressed", String(Number(button.dataset.minutes) === minutes));
        });
        syncDurationFromInputs();
      }

      function toggleFullscreen() {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(error => console.warn("無法離開全螢幕模式。", error));
          return;
        }
        if (app.requestFullscreen) {
          app.requestFullscreen().catch(error => console.warn("無法進入全螢幕模式。", error));
        }
      }

      makeGroupCards();
      const mainTimer = createTimer("活動", el.querySelector("#timer-singleTimer"), true);
      timers.unshift(mainTimer);
      mainTimer.progress.style.strokeDasharray = String(CIRCUMFERENCE);

      const settings = readSettings();
      minutesInput.value = String(settings.minutes);
      secondsInput.value = String(settings.seconds);
      mode = settings.mode;
      configuredDurationMs = (settings.minutes * 60 + settings.seconds) * 1000;
      timers.forEach(timer => {
        timer.durationMs = configuredDurationMs;
        timer.remainingMs = mode === "stopwatch" ? 0 : configuredDurationMs;
      });
      multiMode = settings.multi;
      multiToggle.checked = multiMode;
      if (settings.preset !== null && settings.seconds === 0 && settings.minutes === settings.preset) {
        presetButtons.forEach(button => button.setAttribute("aria-pressed", String(Number(button.dataset.minutes) === settings.preset)));
      } else {
        presetButtons.forEach(button => button.setAttribute("aria-pressed", "false"));
      }

      el.querySelector("#timer-countdownMode").addEventListener("click", () => setMode("countdown"));
      el.querySelector("#timer-stopwatchMode").addEventListener("click", () => setMode("stopwatch"));
      presetButtons.forEach(button => button.addEventListener("click", () => setPreset(Number(button.dataset.minutes))));
      minutesInput.addEventListener("change", () => syncDurationFromInputs());
      secondsInput.addEventListener("change", () => syncDurationFromInputs());
      minutesInput.addEventListener("input", () => presetButtons.forEach(button => button.setAttribute("aria-pressed", "false")));
      secondsInput.addEventListener("input", () => presetButtons.forEach(button => button.setAttribute("aria-pressed", "false")));
      multiToggle.addEventListener("change", () => setMultiMode(multiToggle.checked));
      mainStartButton.addEventListener("click", () => toggleTimer(mainTimer));
      el.querySelector("#timer-mainResetButton").addEventListener("click", () => resetTimer(mainTimer));
      el.querySelector("#timer-allStartButton").addEventListener("click", () => {
        if (activeTimers().some(timer => timer.running)) pauseAllTimers();
        else startAllTimers();
      });
      el.querySelector("#timer-allResetButton").addEventListener("click", resetAllTimers);
      el.querySelector("#timer-fullscreenButton").addEventListener("click", toggleFullscreen);
      document.addEventListener("fullscreenchange", () => {
        const button = el.querySelector("#timer-fullscreenButton");
        const isFullscreen = Boolean(document.fullscreenElement);
        button.setAttribute("aria-label", isFullscreen ? "離開全螢幕" : "進入全螢幕");
        button.title = isFullscreen ? "離開全螢幕" : "全螢幕展示";
      });
      document.addEventListener("keydown", event => {
        if (el.hidden) return;
        if (event.code === "Space" && !event.repeat && !event.target.matches("input, textarea, select, button")) {
          event.preventDefault();
          if (multiMode) {
            if (activeTimers().some(timer => timer.running)) pauseAllTimers();
            else startAllTimers();
          } else {
            toggleTimer(mainTimer);
          }
        }
        if (event.key.toLowerCase() === "r" && !event.repeat && !event.target.matches("input, textarea, select")) {
          if (multiMode) resetAllTimers();
          else resetTimer(mainTimer);
        }
      });
      document.addEventListener("visibilitychange", () => {
        if (!document.hidden) {
          render();
          if (activeTimers().some(timer => timer.running)) scheduleRender();
        }
      });

      render();
    })();
  }
});
