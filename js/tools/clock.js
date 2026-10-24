App.register({
  id: "clock",
  title: "時間管理",
  icon: "⏰",
  init(el) {
    el.classList.add("tool-root");
    el.dataset.toolRoot = "clock";
    el.innerHTML = "<div class=\"app\" id=\"clock-app\">\n    <header class=\"topbar\">\n      <h1 class=\"brand\">課堂時間管理系統</h1>\n      <div class=\"top-actions\">\n        <span class=\"sound-note\">首次播放音效時，請點擊任一打鐘或計時按鈕以啟用瀏覽器音效。</span>\n        <button class=\"button small subtle\" id=\"clock-fullscreenButton\" type=\"button\">⛶ 全螢幕投影</button>\n      </div>\n    </header>\n\n    <nav class=\"tabs\" role=\"tablist\" aria-label=\"時間管理模組\">\n      <button class=\"tab\" id=\"clock-tab-exam\" role=\"tab\" aria-selected=\"true\" aria-controls=\"clock-panel-exam\" type=\"button\">考試大鐘</button>\n      <button class=\"tab\" id=\"clock-tab-bells\" role=\"tab\" aria-selected=\"false\" aria-controls=\"clock-panel-bells\" type=\"button\">上下課鐘</button>\n      <button class=\"tab\" id=\"clock-tab-tomato\" role=\"tab\" aria-selected=\"false\" aria-controls=\"clock-panel-tomato\" type=\"button\">讀書番茄鐘</button>\n    </nav>\n\n    <main>\n      <section class=\"panel active\" id=\"clock-panel-exam\" role=\"tabpanel\" aria-labelledby=\"clock-tab-exam\">\n        <div class=\"exam-layout\">\n          <div class=\"card clock-card\">\n            <div class=\"date-line\" id=\"clock-currentDate\">--年--月--日 星期-</div>\n            <div class=\"clock-time\" id=\"clock-currentTime\" aria-label=\"現在時間\">--:--:--</div>\n            <div class=\"exam-countdown\" id=\"clock-examCountdown\">請設定考試結束時間</div>\n            <div class=\"exam-summary\">\n              <span>科目：<strong id=\"clock-summarySubject\">未設定</strong></span>\n              <span>考試時間：<strong id=\"clock-summaryTime\">未設定</strong></span>\n              <span>監考：<strong id=\"clock-summaryTeacher\">未設定</strong></span>\n              <span>缺考：<strong class=\"absent-value\" id=\"clock-summaryAbsent\">0 人</strong></span>\n            </div>\n            <div class=\"ticker-wrap\" aria-label=\"考試注意事項\">\n              <div class=\"ticker-track\" id=\"clock-tickerTrack\"><span>請設定考試注意事項</span><span aria-hidden=\"true\">請設定考試注意事項</span></div>\n            </div>\n          </div>\n          <form class=\"card settings-card\" id=\"clock-examForm\">\n            <h2 class=\"section-heading\">考試資訊設定</h2>\n            <div class=\"field\">\n              <label for=\"clock-examSubject\">考試科目</label>\n              <input id=\"clock-examSubject\" name=\"subject\" type=\"text\" placeholder=\"例如：數學\">\n            </div>\n            <div class=\"two-col\">\n              <div class=\"field\">\n                <label for=\"clock-examStart\">開始時間</label>\n                <input id=\"clock-examStart\" name=\"start\" type=\"time\">\n              </div>\n              <div class=\"field\">\n                <label for=\"clock-examEnd\">結束時間</label>\n                <input id=\"clock-examEnd\" name=\"end\" type=\"time\">\n              </div>\n            </div>\n            <div class=\"field\">\n              <label for=\"clock-examTeacher\">監考老師</label>\n              <input id=\"clock-examTeacher\" name=\"teacher\" type=\"text\" placeholder=\"例如：王老師\">\n            </div>\n            <div class=\"two-col\">\n              <div class=\"field\">\n                <label for=\"clock-expectedCount\">應到人數</label>\n                <input id=\"clock-expectedCount\" name=\"expected\" type=\"number\" min=\"0\" step=\"1\" value=\"0\">\n              </div>\n              <div class=\"field\">\n                <label for=\"clock-actualCount\">實到人數</label>\n                <input id=\"clock-actualCount\" name=\"actual\" type=\"number\" min=\"0\" step=\"1\" value=\"0\">\n              </div>\n            </div>\n            <div class=\"field\">\n              <label>缺考人數（自動計算）</label>\n              <div class=\"absent-value\" id=\"clock-absentCount\">0 人</div>\n            </div>\n            <div class=\"field\">\n              <label for=\"clock-examNotice\">考試注意事項</label>\n              <textarea id=\"clock-examNotice\" name=\"notice\" placeholder=\"例如：請將手機關機，考試結束前不得離場。\"></textarea>\n            </div>\n          </form>\n        </div>\n      </section>\n\n      <section class=\"panel\" id=\"clock-panel-bells\" role=\"tabpanel\" aria-labelledby=\"clock-tab-bells\" hidden>\n        <div class=\"bells-layout\">\n          <div class=\"card bell-controls\">\n            <h2 class=\"section-heading\">手動打鐘</h2>\n            <div class=\"bell-buttons\">\n              <button class=\"button green bell-button\" id=\"clock-classBellButton\" type=\"button\">🔔 上課鈴<span>開始上課</span></button>\n              <button class=\"button primary bell-button\" id=\"clock-dismissalBellButton\" type=\"button\">🔔 下課鈴<span>下課休息</span></button>\n            </div>\n          </div>\n          <div class=\"card schedule-card\">\n            <div class=\"schedule-header\">\n              <h2 class=\"section-heading\">課表管理</h2>\n              <div class=\"schedule-actions\">\n                <label class=\"switch-label\"><input id=\"clock-autoBellToggle\" type=\"checkbox\"> 啟用自動打鐘</label>\n                <label class=\"button small import-label\" for=\"clock-csvFile\">匯入 CSV 課表<input id=\"clock-csvFile\" type=\"file\" accept=\".csv,text/csv\"></label>\n              </div>\n            </div>\n            <p class=\"muted\">CSV 每行格式：節次名稱,上課時間,下課時間（例如：第一節,08:10,09:00）</p>\n            <div class=\"table-scroll\">\n              <table>\n                <thead><tr><th>節次</th><th>上課時間</th><th>下課時間</th><th>操作</th></tr></thead>\n                <tbody id=\"clock-scheduleRows\"></tbody>\n              </table>\n            </div>\n            <form class=\"schedule-form\" id=\"clock-scheduleForm\">\n              <div class=\"field period-name\"><label for=\"clock-periodName\">節次名稱</label><input id=\"clock-periodName\" type=\"text\" placeholder=\"例如：第一節\" required></div>\n              <div class=\"field\"><label for=\"clock-periodStart\">上課時間</label><input id=\"clock-periodStart\" type=\"time\" required></div>\n              <div class=\"field\"><label for=\"clock-periodEnd\">下課時間</label><input id=\"clock-periodEnd\" type=\"time\" required></div>\n              <button class=\"button primary\" type=\"submit\">新增時段</button>\n            </form>\n          </div>\n        </div>\n      </section>\n\n      <section class=\"panel\" id=\"clock-panel-tomato\" role=\"tabpanel\" aria-labelledby=\"clock-tab-tomato\" hidden>\n        <div class=\"tomato-layout\">\n          <div class=\"card tomato-main\">\n            <div class=\"phase-pill\" id=\"clock-phaseLabel\">專注時間</div>\n            <div class=\"tomato-time\" id=\"clock-tomatoTime\" aria-live=\"off\">25:00</div>\n            <div class=\"round-count\">第 <strong id=\"clock-roundNumber\">1</strong> 輪</div>\n            <div class=\"tomato-controls\">\n              <button class=\"button green\" id=\"clock-startPauseButton\" type=\"button\">開始</button>\n              <button class=\"button\" id=\"clock-resetButton\" type=\"button\">重設</button>\n              <button class=\"button primary\" id=\"clock-skipButton\" type=\"button\">跳過</button>\n            </div>\n          </div>\n          <div class=\"card tomato-settings\">\n            <h2 class=\"section-heading\">番茄鐘設定</h2>\n            <div class=\"field\">\n              <label for=\"clock-focusMinutes\">專注時間（分鐘）</label>\n              <input id=\"clock-focusMinutes\" type=\"number\" min=\"1\" max=\"180\" step=\"1\" value=\"25\">\n            </div>\n            <div class=\"field\">\n              <label for=\"clock-breakMinutes\">休息時間（分鐘）</label>\n              <input id=\"clock-breakMinutes\" type=\"number\" min=\"1\" max=\"60\" step=\"1\" value=\"5\">\n            </div>\n            <div class=\"stat-card\">\n              <span class=\"muted\">今日累計專注時間</span>\n              <strong id=\"clock-focusTotal\">0 分鐘</strong>\n            </div>\n            <p class=\"muted\">計時器依系統時鐘校準；切換頁籤或重新整理後仍會接續計時。</p>\n          </div>\n        </div>\n      </section>\n    </main>\n    <p class=\"status-message\" id=\"clock-statusMessage\" role=\"status\" aria-live=\"polite\"></p>\n    <button class=\"button small exit-fullscreen\" id=\"clock-exitFullscreenButton\" type=\"button\">退出全螢幕</button>\n  </div>";
    (() => {
      "use strict";

      const STORAGE_KEY = "classroom-time-manager-v1";
      const defaults = {
        exam: { subject: "", start: "", end: "", teacher: "", expected: 0, actual: 0, notice: "" },
        schedule: [],
        autoBell: false,
        lastAutoMinute: "",
        tomato: {
          focusMinutes: 25,
          breakMinutes: 5,
          phase: "focus",
          round: 1,
          running: false,
          remainingMs: 25 * 60 * 1000,
          deadline: null,
          phaseElapsedMs: 0,
          focusDate: "",
          focusTotalMs: 0
        }
      };

      const $ = (selector) => el.querySelector(selector);
      const statusMessage = $("#clock-statusMessage");
      let statusTimer;
      let audioContext;
      let state = loadState();

      function announce(message) {
        statusMessage.textContent = message;
        clearTimeout(statusTimer);
        statusTimer = setTimeout(() => { statusMessage.textContent = ""; }, 5000);
      }

      function loadState() {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (!raw) return structuredClone(defaults);
          const saved = JSON.parse(raw);
          return {
            ...structuredClone(defaults),
            ...saved,
            exam: { ...defaults.exam, ...(saved.exam || {}) },
            schedule: Array.isArray(saved.schedule) ? saved.schedule : [],
            tomato: { ...defaults.tomato, ...(saved.tomato || {}) }
          };
        } catch (error) {
          console.error("無法讀取已儲存的設定。", error);
          announce("無法讀取已儲存設定，將使用預設值。");
          return structuredClone(defaults);
        }
      }

      function saveState() {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (error) {
          console.error("無法儲存設定。", error);
          announce("無法儲存設定，請確認瀏覽器儲存空間與權限。");
        }
      }

      function setDefaultFormValues() {
        const e = state.exam;
        $("#clock-examSubject").value = e.subject;
        $("#clock-examStart").value = e.start;
        $("#clock-examEnd").value = e.end;
        $("#clock-examTeacher").value = e.teacher;
        $("#clock-expectedCount").value = e.expected;
        $("#clock-actualCount").value = e.actual;
        $("#clock-examNotice").value = e.notice;
        $("#clock-autoBellToggle").checked = Boolean(state.autoBell);
        $("#clock-focusMinutes").value = state.tomato.focusMinutes;
        $("#clock-breakMinutes").value = state.tomato.breakMinutes;
      }

      function updateExamFromForm() {
        state.exam = {
          subject: $("#clock-examSubject").value,
          start: $("#clock-examStart").value,
          end: $("#clock-examEnd").value,
          teacher: $("#clock-examTeacher").value,
          expected: parseNonNegative($("#clock-expectedCount").value),
          actual: parseNonNegative($("#clock-actualCount").value),
          notice: $("#clock-examNotice").value
        };
        $("#clock-absentCount").textContent = `${Math.max(0, state.exam.expected - state.exam.actual)} 人`;
        saveState();
        renderExamSummary();
      }

      function parseNonNegative(value) {
        const number = Number.parseInt(value, 10);
        return Number.isFinite(number) ? Math.max(0, number) : 0;
      }

      function renderExamSummary() {
        const { subject, start, end, teacher, expected, actual, notice } = state.exam;
        $("#clock-summarySubject").textContent = subject.trim() || "未設定";
        $("#clock-summaryTime").textContent = start && end ? `${start}～${end}` : "未設定";
        $("#clock-summaryTeacher").textContent = teacher.trim() || "未設定";
        const absent = Math.max(0, Number(expected) - Number(actual));
        $("#clock-summaryAbsent").textContent = `${absent} 人`;
        $("#clock-absentCount").textContent = `${absent} 人`;
        const message = notice.trim() || "請設定考試注意事項";
        $("#clock-tickerTrack").innerHTML = "";
        for (let index = 0; index < 2; index += 1) {
          const span = document.createElement("span");
          span.textContent = message;
          if (index === 1) span.setAttribute("aria-hidden", "true");
          $("#clock-tickerTrack").append(span);
        }
      }

      function getExamEnd(now) {
        const end = state.exam.end;
        if (!/^\d{2}:\d{2}$/.test(end)) return null;
        const [hour, minute] = end.split(":").map(Number);
        if (hour > 23 || minute > 59) return null;
        const target = new Date(now);
        target.setHours(hour, minute, 0, 0);
        if (state.exam.start && end < state.exam.start) target.setDate(target.getDate() + 1);
        return target;
      }

      function renderClock(now = new Date()) {
        const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        $("#clock-currentDate").textContent = `${now.getFullYear()}年${String(now.getMonth() + 1).padStart(2, "0")}月${String(now.getDate()).padStart(2, "0")}日 ${weekdays[now.getDay()]}`;
        $("#clock-currentTime").textContent = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
        const countdown = $("#clock-examCountdown");
        const target = getExamEnd(now);
        countdown.classList.remove("warning");
        if (!target) {
          countdown.textContent = "請設定考試結束時間";
          return;
        }
        const milliseconds = target.getTime() - now.getTime();
        if (milliseconds <= 0) {
          countdown.textContent = "考試時間已結束";
          return;
        }
        const minutes = Math.ceil(milliseconds / 60000);
        countdown.textContent = `距離考試結束還有 ${minutes} 分鐘`;
        if (minutes <= 10) countdown.classList.add("warning");
      }

      function renderSchedule() {
        const tbody = $("#clock-scheduleRows");
        tbody.replaceChildren();
        if (!state.schedule.length) {
          const row = tbody.insertRow();
          const cell = row.insertCell();
          cell.colSpan = 4;
          cell.className = "empty-row";
          cell.textContent = "尚未新增課表時段";
          return;
        }
        state.schedule.forEach((entry, index) => {
          const row = tbody.insertRow();
          const name = row.insertCell();
          const start = row.insertCell();
          const end = row.insertCell();
          const action = row.insertCell();
          name.textContent = entry.name;
          start.textContent = entry.start;
          end.textContent = entry.end;
          const remove = document.createElement("button");
          remove.type = "button";
          remove.className = "button small red";
          remove.textContent = "刪除";
          remove.setAttribute("aria-label", `刪除${entry.name}時段`);
          remove.addEventListener("click", () => {
            state.schedule.splice(index, 1);
            saveState();
            renderSchedule();
          });
          action.append(remove);
        });
      }

      function enableAudio() {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) {
          announce("此瀏覽器不支援 Web Audio API，無法播放音效。");
          return null;
        }
        if (!audioContext) audioContext = new AudioContextClass();
        if (audioContext.state === "suspended") audioContext.resume().catch((error) => {
          console.error("無法啟用瀏覽器音效。", error);
          announce("無法啟用瀏覽器音效，請再次點擊播放按鈕。");
        });
        return audioContext;
      }

      function playSequence(notes, type = "sine", volume = 0.18) {
        const context = enableAudio();
        if (!context) return;
        const startAt = context.currentTime + 0.03;
        notes.forEach((note) => {
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          oscillator.type = type;
          oscillator.frequency.setValueAtTime(note.frequency, startAt + note.offset);
          gain.gain.setValueAtTime(0.0001, startAt + note.offset);
          gain.gain.exponentialRampToValueAtTime(volume, startAt + note.offset + 0.025);
          gain.gain.setValueAtTime(volume, startAt + note.offset + note.duration * 0.72);
          gain.gain.exponentialRampToValueAtTime(0.0001, startAt + note.offset + note.duration);
          oscillator.connect(gain);
          gain.connect(context.destination);
          oscillator.start(startAt + note.offset);
          oscillator.stop(startAt + note.offset + note.duration + 0.02);
        });
      }

      function playBell(kind) {
        if (kind === "class") {
          playSequence([
            { frequency: 880, offset: 0, duration: 0.42 },
            { frequency: 1174.66, offset: 0.48, duration: 0.62 },
            { frequency: 880, offset: 1.18, duration: 0.42 },
            { frequency: 1174.66, offset: 1.66, duration: 0.72 }
          ], "sine", 0.2);
        } else {
          playSequence([
            { frequency: 783.99, offset: 0, duration: 0.7 },
            { frequency: 659.25, offset: 0.76, duration: 0.7 },
            { frequency: 523.25, offset: 1.52, duration: 1.0 }
          ], "triangle", 0.2);
        }
      }

      function checkAutomaticBell(now) {
        if (!state.autoBell || now.getSeconds() !== 0) return;
        const minuteKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}-${now.getMinutes()}`;
        if (state.lastAutoMinute === minuteKey) return;
        state.lastAutoMinute = minuteKey;
        saveState();
        const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        state.schedule.forEach((entry) => {
          if (entry.start === time) playBell("class");
          if (entry.end === time) playBell("dismissal");
        });
      }

      function parseCsvLine(line) {
        const fields = [];
        let field = "";
        let quoted = false;
        for (let index = 0; index < line.length; index += 1) {
          const char = line[index];
          if (char === '"') {
            if (quoted && line[index + 1] === '"') {
              field += '"';
              index += 1;
            } else {
              quoted = !quoted;
            }
          } else if (char === "," && !quoted) {
            fields.push(field.trim());
            field = "";
          } else {
            field += char;
          }
        }
        fields.push(field.trim());
        return fields;
      }

      function validTime(value) {
        if (!/^\d{2}:\d{2}$/.test(value)) return false;
        const [hour, minute] = value.split(":").map(Number);
        return hour <= 23 && minute <= 59;
      }

      async function importCsv(file) {
        if (!file) return;
        try {
          const text = (await file.text()).replace(/^\uFEFF/, "");
          const lines = text.split(/\r?\n/).filter((line) => line.trim());
          const imported = [];
          const invalid = [];
          lines.forEach((line, index) => {
            const columns = parseCsvLine(line);
            if (index === 0 && columns[0]?.toLowerCase() === "節次") return;
            if (columns.length < 3 || !columns[0] || !validTime(columns[1]) || !validTime(columns[2])) {
              invalid.push(index + 1);
              return;
            }
            imported.push({ id: createId(), name: columns[0], start: columns[1], end: columns[2] });
          });
          if (!imported.length) {
            announce(invalid.length ? `CSV 沒有有效時段，請檢查第 ${invalid.join("、")} 行。` : "CSV 檔案沒有可匯入的時段。");
            return;
          }
          state.schedule = imported;
          saveState();
          renderSchedule();
          announce(`已匯入 ${imported.length} 個課表時段${invalid.length ? `；略過第 ${invalid.join("、")} 行` : ""}。`);
        } catch (error) {
          console.error("讀取 CSV 檔案失敗。", error);
          announce("無法讀取 CSV 檔案，請確認檔案格式與權限。");
        } finally {
          $("#clock-csvFile").value = "";
        }
      }

      function createId() {
        return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      }

      function getTodayKey(now = new Date()) {
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      }

      function syncFocusDate(now = new Date()) {
        const key = getTodayKey(now);
        if (state.tomato.focusDate !== key) {
          state.tomato.focusDate = key;
          state.tomato.focusTotalMs = 0;
        }
      }

      function normalizeTomato() {
        const t = state.tomato;
        if (!["focus", "break"].includes(t.phase)) t.phase = "focus";
        t.focusMinutes = clampInteger(t.focusMinutes, 1, 180, 25);
        t.breakMinutes = clampInteger(t.breakMinutes, 1, 60, 5);
        t.round = clampInteger(t.round, 1, 100000, 1);
        t.phaseElapsedMs = Math.max(0, Number(t.phaseElapsedMs) || 0);
        t.focusTotalMs = Math.max(0, Number(t.focusTotalMs) || 0);
        t.remainingMs = Math.max(0, Number(t.remainingMs) || t[`${t.phase}Minutes`] * 60000);
        if (t.running && (!Number.isFinite(Number(t.deadline)))) {
          t.running = false;
          t.deadline = null;
        }
      }

      function clampInteger(value, minimum, maximum, fallback) {
        const parsed = Number.parseInt(value, 10);
        return Number.isFinite(parsed) ? Math.min(maximum, Math.max(minimum, parsed)) : fallback;
      }

      function currentRemaining(now = Date.now()) {
        const t = state.tomato;
        return t.running ? Math.max(0, Number(t.deadline) - now) : t.remainingMs;
      }

      function addFocusTime(milliseconds, now = new Date()) {
        if (state.tomato.phase !== "focus" || milliseconds <= 0) return;
        syncFocusDate(now);
        state.tomato.focusTotalMs += milliseconds;
      }

      function transitionTomato() {
        const t = state.tomato;
        if (t.phase === "focus") {
          t.phase = "break";
        } else {
          t.phase = "focus";
          t.round += 1;
        }
        t.phaseElapsedMs = 0;
        t.remainingMs = (t.phase === "focus" ? t.focusMinutes : t.breakMinutes) * 60000;
        t.deadline = null;
        t.running = false;
        saveState();
      }

      function updateTomato(now = Date.now()) {
        const t = state.tomato;
        syncFocusDate(new Date(now));
        if (t.running) {
          const remaining = currentRemaining(now);
          if (t.phase === "focus") {
            const elapsed = Math.max(0, t.remainingMs - remaining);
            const additional = elapsed - t.phaseElapsedMs;
            if (additional > 0) {
              addFocusTime(additional, new Date(now));
              t.phaseElapsedMs = elapsed;
            }
          }
          if (remaining <= 0) {
            playSequence([
              { frequency: 880, offset: 0, duration: 0.28 },
              { frequency: 1174.66, offset: 0.34, duration: 0.42 },
              { frequency: 1567.98, offset: 0.82, duration: 0.58 }
            ], "sine", 0.22);
            if (t.phase === "focus") {
              t.phase = "break";
              t.phaseElapsedMs = 0;
              t.remainingMs = t.breakMinutes * 60000;
              t.deadline = now + t.remainingMs;
            } else {
              t.phase = "focus";
              t.round += 1;
              t.phaseElapsedMs = 0;
              t.remainingMs = t.focusMinutes * 60000;
              t.deadline = now + t.remainingMs;
            }
          }
        }
        renderTomato(now);
        saveState();
      }

      function renderTomato(now = Date.now()) {
        const t = state.tomato;
        const remaining = Math.ceil(currentRemaining(now) / 1000);
        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;
        $("#clock-tomatoTime").textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
        $("#clock-phaseLabel").textContent = t.phase === "focus" ? "專注時間" : "休息時間";
        $("#clock-phaseLabel").classList.toggle("break", t.phase === "break");
        $("#clock-roundNumber").textContent = t.round;
        $("#clock-startPauseButton").textContent = t.running ? "暫停" : "開始";
        $("#clock-startPauseButton").classList.toggle("green", !t.running);
        $("#clock-focusTotal").textContent = `${Math.floor(t.focusTotalMs / 60000)} 分鐘`;
      }

      function startOrPauseTomato() {
        const t = state.tomato;
        const now = Date.now();
        if (t.running) {
          const remaining = currentRemaining(now);
          if (t.phase === "focus") {
            const elapsed = Math.max(0, t.remainingMs - remaining);
            addFocusTime(elapsed - t.phaseElapsedMs);
            t.phaseElapsedMs = elapsed;
          }
          t.remainingMs = remaining;
          t.phaseElapsedMs = 0;
          t.running = false;
          t.deadline = null;
        } else {
          if (t.remainingMs <= 0) t.remainingMs = (t.phase === "focus" ? t.focusMinutes : t.breakMinutes) * 60000;
          t.deadline = now + t.remainingMs;
          t.phaseElapsedMs = 0;
          t.running = true;
          enableAudio();
        }
        saveState();
        renderTomato(now);
      }

      function resetTomato() {
        const t = state.tomato;
        t.running = false;
        t.deadline = null;
        t.phaseElapsedMs = 0;
        t.remainingMs = (t.phase === "focus" ? t.focusMinutes : t.breakMinutes) * 60000;
        saveState();
        renderTomato();
      }

      function skipTomato() {
        const t = state.tomato;
        const wasRunning = t.running;
        if (t.running && t.phase === "focus") {
          const remaining = currentRemaining();
          const elapsed = Math.max(0, t.remainingMs - remaining);
          addFocusTime(elapsed - t.phaseElapsedMs);
        }
        transitionTomato();
        if (wasRunning) {
          t.running = true;
          t.deadline = Date.now() + t.remainingMs;
        }
        saveState();
        renderTomato();
      }

      async function toggleFullscreen() {
        try {
          if (!document.fullscreenElement) {
            el.classList.add("fullscreen-mode");
            const app = $("#clock-app");
            if (app.requestFullscreen) await app.requestFullscreen();
            else announce("此瀏覽器不支援全螢幕模式。");
          } else {
            await document.exitFullscreen();
          }
        } catch (error) {
          el.classList.remove("fullscreen-mode");
          console.error("無法切換全螢幕模式。", error);
          announce("無法進入全螢幕，請確認瀏覽器權限。");
        }
      }

      el.querySelectorAll(".tab").forEach((tab) => {
        tab.addEventListener("click", () => {
          el.querySelectorAll(".tab").forEach((item) => item.setAttribute("aria-selected", String(item === tab)));
          el.querySelectorAll(".panel").forEach((panel) => {
            const active = panel.id === tab.getAttribute("aria-controls");
            panel.classList.toggle("active", active);
            panel.hidden = !active;
          });
          if (el.classList.contains("fullscreen-mode") && !document.fullscreenElement) {
            el.classList.remove("fullscreen-mode");
          }
        });
      });

      $("#clock-examForm").addEventListener("input", updateExamFromForm);
      $("#clock-scheduleForm").addEventListener("submit", (event) => {
        event.preventDefault();
        const entry = {
          id: createId(),
          name: $("#clock-periodName").value.trim(),
          start: $("#clock-periodStart").value,
          end: $("#clock-periodEnd").value
        };
        if (!entry.name || !validTime(entry.start) || !validTime(entry.end)) {
          announce("請填寫節次名稱及有效的上課、下課時間。");
          return;
        }
        state.schedule.push(entry);
        saveState();
        renderSchedule();
        event.currentTarget.reset();
      });
      $("#clock-classBellButton").addEventListener("click", () => playBell("class"));
      $("#clock-dismissalBellButton").addEventListener("click", () => playBell("dismissal"));
      $("#clock-autoBellToggle").addEventListener("change", (event) => {
        state.autoBell = event.currentTarget.checked;
        saveState();
        if (state.autoBell) enableAudio();
      });
      $("#clock-csvFile").addEventListener("change", (event) => importCsv(event.currentTarget.files[0]));
      $("#clock-focusMinutes").addEventListener("change", (event) => {
        const value = clampInteger(event.currentTarget.value, 1, 180, 25);
        event.currentTarget.value = value;
        state.tomato.focusMinutes = value;
        if (state.tomato.phase === "focus" && !state.tomato.running) state.tomato.remainingMs = value * 60000;
        saveState();
        renderTomato();
      });
      $("#clock-breakMinutes").addEventListener("change", (event) => {
        const value = clampInteger(event.currentTarget.value, 1, 60, 5);
        event.currentTarget.value = value;
        state.tomato.breakMinutes = value;
        if (state.tomato.phase === "break" && !state.tomato.running) state.tomato.remainingMs = value * 60000;
        saveState();
        renderTomato();
      });
      $("#clock-startPauseButton").addEventListener("click", startOrPauseTomato);
      $("#clock-resetButton").addEventListener("click", resetTomato);
      $("#clock-skipButton").addEventListener("click", skipTomato);
      $("#clock-fullscreenButton").addEventListener("click", toggleFullscreen);
      $("#clock-exitFullscreenButton").addEventListener("click", toggleFullscreen);
      document.addEventListener("fullscreenchange", () => {
        el.classList.toggle("fullscreen-mode", Boolean(document.fullscreenElement));
      });
      document.addEventListener("visibilitychange", () => {
        if (!document.hidden) {
          renderClock();
          updateTomato();
        }
      });

      normalizeTomato();
      syncFocusDate();
      setDefaultFormValues();
      renderExamSummary();
      renderSchedule();
      renderClock();
      renderTomato();
      setInterval(() => {
        const now = new Date();
        renderClock(now);
        checkAutomaticBell(now);
        updateTomato(now.getTime());
      }, 250);
    })();
  }
});
