App.register({
  id: "score",
  title: "計分板",
  icon: "🏆",
  init(el) {
    el.classList.add("tool-root");
    el.dataset.toolRoot = "score";
    el.innerHTML = "<main class=\"shell\">\n    <header class=\"topbar\">\n      <div>\n        <p class=\"eyebrow\">CLASSROOM SCOREBOARD</p>\n        <h1>安靜有分・合作加分</h1>\n        <p class=\"subtitle\">讓好表現被看見，讓每一次合作都值得喝采。</p>\n      </div>\n      <div class=\"toolbar\" aria-label=\"計分板工具\">\n        <button class=\"button\" id=\"score-add-team\" type=\"button\">＋ 新增組別</button>\n        <button class=\"button\" id=\"score-remove-team\" type=\"button\">－ 減少組別</button>\n        <button class=\"button subtle\" id=\"score-ranking-toggle\" type=\"button\" aria-pressed=\"false\">⇅ 排行榜：關</button>\n        <button class=\"button bad\" id=\"score-reset-scores\" type=\"button\">全部歸零</button>\n      </div>\n    </header>\n\n    <section class=\"panel noise-panel\" aria-labelledby=\"score-noise-title\">\n      <div class=\"section-heading\">\n        <h2 id=\"score-noise-title\">🎙️ 班級音量偵測</h2>\n        <span class=\"live-pill\" id=\"score-mic-state\"><span class=\"live-dot\"></span><span>麥克風未啟動</span></span>\n      </div>\n      <div class=\"noise-layout\">\n        <div class=\"meter-area\">\n          <div class=\"meter-meta\">\n            <span>即時音量</span>\n            <span class=\"volume-number\"><span id=\"score-volume-number\">0</span><small>%</small></span>\n          </div>\n          <div class=\"meter\" id=\"score-volume-meter\" role=\"meter\" aria-label=\"即時音量\" aria-valuemin=\"0\" aria-valuemax=\"100\" aria-valuenow=\"0\">\n            <div class=\"meter-fill\" id=\"score-meter-fill\"></div>\n            <div class=\"threshold-marker\" id=\"score-threshold-marker\" aria-hidden=\"true\"></div>\n          </div>\n          <div class=\"meter-labels\"><span>安靜</span><span id=\"score-threshold-caption\">噪音門檻 80%</span><span>大聲</span></div>\n          <div class=\"quiet-progress\" aria-label=\"安靜累積進度\"><div class=\"quiet-fill\" id=\"score-quiet-fill\"></div></div>\n          <div class=\"quiet-meta\"><span>安靜累積</span><span id=\"score-quiet-time\">0 / 30 秒</span></div>\n          <div class=\"audio-actions\">\n            <button class=\"button primary\" id=\"score-mic-toggle\" type=\"button\">開啟麥克風</button>\n            <span class=\"status-pill\" id=\"score-cooldown-status\">扣分冷卻：就緒</span>\n          </div>\n          <p class=\"status-message\" id=\"score-mic-message\" role=\"status\" aria-live=\"polite\">啟動麥克風後，音量會即時顯示在儀表上。</p>\n        </div>\n        <div class=\"noise-controls\">\n          <div class=\"control-card\">\n            <label class=\"control-title\" for=\"score-threshold-input\"><span>噪音門檻</span><output id=\"score-threshold-value\">80%</output></label>\n            <input id=\"score-threshold-input\" type=\"range\" min=\"10\" max=\"100\" step=\"1\" value=\"80\">\n          </div>\n          <div class=\"control-card switch-row\">\n            <div class=\"switch-copy\">吵鬧自動扣分<small>超過門檻時全組扣 1 分，5 秒冷卻</small></div>\n            <label class=\"switch\" aria-label=\"啟用吵鬧自動扣分\">\n              <input id=\"score-penalty-toggle\" type=\"checkbox\" checked>\n              <span class=\"switch-track\"></span>\n            </label>\n          </div>\n          <div class=\"control-card switch-row\">\n            <div class=\"switch-copy\">安靜自動加分<small>安靜達標時全組加 1 分，並重新計時</small></div>\n            <label class=\"switch\" aria-label=\"啟用安靜自動加分\">\n              <input id=\"score-quiet-toggle\" type=\"checkbox\" checked>\n              <span class=\"switch-track\"></span>\n            </label>\n          </div>\n          <div class=\"control-card\">\n            <label class=\"control-title\" for=\"score-quiet-seconds\"><span>連續安靜達標時間</span><output id=\"score-quiet-seconds-value\">30 秒</output></label>\n            <input id=\"score-quiet-seconds\" type=\"range\" min=\"5\" max=\"180\" step=\"1\" value=\"30\">\n          </div>\n        </div>\n      </div>\n    </section>\n\n    <section class=\"score-section\" aria-labelledby=\"score-teams-title\">\n      <div class=\"section-heading score-heading\">\n        <div>\n          <h2 id=\"score-teams-title\">🏆 小組計分板</h2>\n          <p>點組名即可編輯；展開組員可進行個人計分。</p>\n        </div>\n        <span class=\"status-pill\" id=\"score-team-count\">4 組</span>\n      </div>\n      <div class=\"teams\" id=\"score-teams\" aria-live=\"polite\"></div>\n    </section>\n\n    <details class=\"panel import-panel\">\n      <summary>📋 匯入抽籤分組結果</summary>\n      <div class=\"import-content\">\n        <p>貼上分組結果文字；支援「第一組：王小明、陳小華」或每組標題後逐行列出組員。</p>\n        <textarea id=\"score-import-text\" placeholder=\"第一組：王小明、陳小華&#10;第二組：林同學、張同學&#10;第三組：李同學、周同學\"></textarea>\n        <div class=\"import-actions\">\n          <button class=\"button primary\" id=\"score-import-teams\" type=\"button\">匯入並取代目前組別</button>\n          <span class=\"import-status\" id=\"score-import-status\" role=\"status\" aria-live=\"polite\"></span>\n        </div>\n      </div>\n    </details>\n    <p class=\"footer-note\">資料自動儲存在此瀏覽器。麥克風需在安全來源（如 localhost 或 HTTPS）使用，請允許瀏覽器存取麥克風。</p>\n  </main>\n  <div class=\"notice\" id=\"score-notice\" role=\"status\" aria-live=\"assertive\"></div>";
    (() => {
      "use strict";


      const STORAGE_KEY = "classroom-scoreboard-v1";
      const COLORS = ["#48c8ff", "#ff7b72", "#b68cff", "#ffc857", "#59d7a5", "#ff83c6", "#9daeff", "#f28d4e"];
      const DEFAULT_TEAMS = ["第一組", "第二組", "第三組", "第四組"].map((name) => ({
        id: createId(),
        name,
        baseScore: 0,
        members: []
      }));
      const elements = {
        teams: el.querySelector("#score-teams"),
        teamCount: el.querySelector("#score-team-count"),
        addTeam: el.querySelector("#score-add-team"),
        removeTeam: el.querySelector("#score-remove-team"),
        resetScores: el.querySelector("#score-reset-scores"),
        rankingToggle: el.querySelector("#score-ranking-toggle"),
        threshold: el.querySelector("#score-threshold-input"),
        thresholdValue: el.querySelector("#score-threshold-value"),
        thresholdCaption: el.querySelector("#score-threshold-caption"),
        meter: el.querySelector("#score-volume-meter"),
        meterFill: el.querySelector("#score-meter-fill"),
        volumeNumber: el.querySelector("#score-volume-number"),
        penaltyToggle: el.querySelector("#score-penalty-toggle"),
        quietToggle: el.querySelector("#score-quiet-toggle"),
        quietSeconds: el.querySelector("#score-quiet-seconds"),
        quietSecondsValue: el.querySelector("#score-quiet-seconds-value"),
        quietFill: el.querySelector("#score-quiet-fill"),
        quietTime: el.querySelector("#score-quiet-time"),
        micState: el.querySelector("#score-mic-state"),
        micToggle: el.querySelector("#score-mic-toggle"),
        micMessage: el.querySelector("#score-mic-message"),
        cooldownStatus: el.querySelector("#score-cooldown-status"),
        notice: el.querySelector("#score-notice"),
        importText: el.querySelector("#score-import-text"),
        importTeams: el.querySelector("#score-import-teams"),
        importStatus: el.querySelector("#score-import-status")
      };

      let state = loadState();
      let audioContext = null;
      let micStream = null;
      let analyser = null;
      let sourceNode = null;
      let animationFrame = 0;
      let lastFrameAt = 0;
      let quietElapsed = 0;
      let cooldownUntil = 0;
      let noticeTimeout = 0;
      let volume = 0;

      function createId() {
        return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
      }

      function isRecord(value) {
        return value !== null && typeof value === "object" && !Array.isArray(value);
      }

      function normalizeTeam(team) {
        if (!isRecord(team)) return null;
        const name = typeof team.name === "string" && team.name.trim() ? team.name.trim().slice(0, 36) : "未命名組別";
        const members = Array.isArray(team.members)
          ? team.members.filter(isRecord).map((member) => ({
              id: typeof member.id === "string" ? member.id : createId(),
              name: typeof member.name === "string" && member.name.trim() ? member.name.trim().slice(0, 36) : "未命名組員",
              score: Number.isFinite(member.score) ? Math.trunc(member.score) : 0
            }))
          : [];
        return {
          id: typeof team.id === "string" ? team.id : createId(),
          name,
          baseScore: Number.isFinite(team.baseScore) ? Math.trunc(team.baseScore) : 0,
          members
        };
      }

      function loadState() {
        const initial = {
          teams: DEFAULT_TEAMS,
          threshold: 80,
          penaltyEnabled: true,
          quietEnabled: true,
          quietSeconds: 30,
          ranking: false
        };
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (!raw) return initial;
          const parsed = JSON.parse(raw);
          if (!isRecord(parsed)) throw new Error("保存資料格式不正確");
          const savedTeams = Array.isArray(parsed.teams) ? parsed.teams.map(normalizeTeam).filter(Boolean) : [];
          return {
            teams: savedTeams.length ? savedTeams : initial.teams,
            threshold: Number.isFinite(parsed.threshold) ? clamp(Math.round(parsed.threshold), 10, 100) : initial.threshold,
            penaltyEnabled: typeof parsed.penaltyEnabled === "boolean" ? parsed.penaltyEnabled : initial.penaltyEnabled,
            quietEnabled: typeof parsed.quietEnabled === "boolean" ? parsed.quietEnabled : initial.quietEnabled,
            quietSeconds: Number.isFinite(parsed.quietSeconds) ? clamp(Math.round(parsed.quietSeconds), 5, 180) : initial.quietSeconds,
            ranking: typeof parsed.ranking === "boolean" ? parsed.ranking : initial.ranking
          };
        } catch (error) {
          console.error("讀取計分板資料失敗：", error);
          setTimeout(() => setMicMessage("無法讀取已儲存資料，已載入預設組別。請檢查瀏覽器儲存空間設定。", true), 0);
          return initial;
        }
      }

      function saveState() {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (error) {
          console.error("儲存計分板資料失敗：", error);
          setMicMessage("資料無法儲存至此瀏覽器，請檢查儲存空間或隱私設定。", true);
        }
      }

      function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
      }

      function totalScore(team) {
        return team.baseScore + team.members.reduce((sum, member) => sum + member.score, 0);
      }

      function escapeText(value) {
        return String(value);
      }

      function renderTeams() {
        const before = new Map();
        for (const card of elements.teams.children) {
          before.set(card.dataset.teamId, card.getBoundingClientRect());
        }
        const expanded = new Set(
          [...elements.teams.querySelectorAll(".team-card.expanded")].map((card) => card.dataset.teamId)
        );
        const sorted = state.ranking
          ? [...state.teams].sort((a, b) => totalScore(b) - totalScore(a))
          : [...state.teams];
        const fragment = document.createDocumentFragment();
        sorted.forEach((team, index) => fragment.append(createTeamCard(team, index, expanded.has(team.id))));
        elements.teams.replaceChildren(fragment);
        for (const card of elements.teams.children) {
          const oldRect = before.get(card.dataset.teamId);
          if (!oldRect) continue;
          const newRect = card.getBoundingClientRect();
          const deltaX = oldRect.left - newRect.left;
          const deltaY = oldRect.top - newRect.top;
          if (deltaX || deltaY) {
            card.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            requestAnimationFrame(() => {
              card.style.transform = "";
            });
          }
        }
        elements.teamCount.textContent = `${state.teams.length} 組`;
        elements.removeTeam.disabled = state.teams.length <= 1;
        elements.rankingToggle.textContent = state.ranking ? "⇅ 排行榜：開" : "⇅ 排行榜：關";
        elements.rankingToggle.setAttribute("aria-pressed", String(state.ranking));
      }

      function createTeamCard(team, index, expanded) {
        const card = document.createElement("article");
        card.className = `team-card${expanded ? " expanded" : ""}`;
        card.dataset.teamId = team.id;
        card.style.setProperty("--team-color", COLORS[index % COLORS.length]);
        const inner = document.createElement("div");
        inner.className = "team-inner";

        const top = document.createElement("div");
        top.className = "team-topline";
        const rank = document.createElement("span");
        rank.className = "rank-label";
        rank.textContent = state.ranking ? `RANK ${index + 1}` : `TEAM ${String(index + 1).padStart(2, "0")}`;
        const title = document.createElement("button");
        title.className = "team-name-button";
        title.type = "button";
        title.textContent = escapeText(team.name);
        title.title = "點擊編輯組名";
        title.addEventListener("click", () => editTeamName(team, title));
        top.append(rank, title);

        const score = document.createElement("div");
        score.className = "total-score";
        score.dataset.scoreFor = team.id;
        score.textContent = String(totalScore(team));
        const scoreCaption = document.createElement("div");
        scoreCaption.className = "score-caption";
        scoreCaption.textContent = team.members.length ? `小組總分・含 ${team.members.length} 位組員` : "小組總分";

        const controls = document.createElement("div");
        controls.className = "team-controls";
        controls.append(
          makeButton("+1 加分", "button good", () => changeTeamScore(team.id, 1)),
          makeButton("−1 扣分", "button bad", () => changeTeamScore(team.id, -1))
        );

        const footer = document.createElement("div");
        footer.className = "team-footer";
        const memberButton = makeButton(`${expanded ? "收合" : "組員"} · ${team.members.length}`, "text-button", () => {
          const isExpanded = card.classList.toggle("expanded");
          memberButton.textContent = `${isExpanded ? "收合" : "組員"} · ${team.members.length}`;
          memberButton.setAttribute("aria-expanded", String(isExpanded));
        });
        memberButton.setAttribute("aria-expanded", String(expanded));
        const baseLabel = document.createElement("span");
        baseLabel.className = "score-caption";
        baseLabel.textContent = team.members.length ? `小組分 ${team.baseScore}` : "";
        footer.append(memberButton, baseLabel);

        const members = createMembersSection(team);
        inner.append(top, score, scoreCaption, controls, footer, members);
        card.append(inner);
        return card;
      }

      function createMembersSection(team) {
        const section = document.createElement("div");
        section.className = "members";
        const heading = document.createElement("div");
        heading.className = "members-heading";
        heading.textContent = "組員個人分數";
        const list = document.createElement("div");
        list.className = "member-list";
        team.members.forEach((member) => {
          const row = document.createElement("div");
          row.className = "member-row";
          const name = document.createElement("span");
          name.className = "member-name";
          name.textContent = escapeText(member.name);
          name.title = member.name;
          const score = document.createElement("span");
          score.className = "member-score";
          score.textContent = String(member.score);
          const plus = makeButton("+", "button icon good", () => changeMemberScore(team.id, member.id, 1));
          plus.setAttribute("aria-label", `為${member.name}加一分`);
          const minus = makeButton("−", "button icon bad", () => changeMemberScore(team.id, member.id, -1));
          minus.setAttribute("aria-label", `為${member.name}扣一分`);
          const remove = makeButton("×", "button icon subtle member-remove", () => removeMember(team.id, member.id));
          remove.setAttribute("aria-label", `移除${member.name}`);
          row.append(name, score, plus, minus, remove);
          list.append(row);
        });
        const form = document.createElement("form");
        form.className = "add-member-form";
        const input = document.createElement("input");
        input.type = "text";
        input.maxLength = 36;
        input.placeholder = "新增組員姓名";
        input.setAttribute("aria-label", "新增組員姓名");
        const submit = makeButton("加入", "button small", () => {});
        submit.type = "submit";
        form.addEventListener("submit", (event) => {
          event.preventDefault();
          const nameValue = input.value.trim();
          if (!nameValue) {
            input.focus();
            return;
          }
          const current = state.teams.find((item) => item.id === team.id);
          if (!current) return;
          current.members.push({ id: createId(), name: nameValue.slice(0, 36), score: 0 });
          saveAndRender(team.id);
        });
        form.append(input, submit);
        section.append(heading, list, form);
        return section;
      }

      function makeButton(label, className, handler) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = className;
        button.textContent = label;
        button.addEventListener("click", handler);
        return button;
      }

      function editTeamName(team, button) {
        const input = document.createElement("input");
        input.className = "team-name-input";
        input.type = "text";
        input.maxLength = 36;
        input.value = team.name;
        input.setAttribute("aria-label", "編輯組名");
        let finished = false;
        const finish = (save) => {
          if (finished) return;
          finished = true;
          if (save) {
            const name = input.value.trim();
            if (name) team.name = name.slice(0, 36);
          }
          saveAndRender(team.id);
        };
        input.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            finish(true);
          } else if (event.key === "Escape") {
            finish(false);
          }
        });
        input.addEventListener("blur", () => finish(true), { once: true });
        button.replaceWith(input);
        input.focus();
        input.select();
      }

      function saveAndRender(popTeamId) {
        saveState();
        renderTeams();
        if (popTeamId) {
          const score = elements.teams.querySelector(`[data-score-for="${CSS.escape(popTeamId)}"]`);
          if (score) {
            score.classList.remove("score-pop");
            void score.offsetWidth;
            score.classList.add("score-pop");
          }
        }
      }

      function changeTeamScore(teamId, delta, playAudio = true) {
        const team = state.teams.find((item) => item.id === teamId);
        if (!team) return;
        team.baseScore += delta;
        saveAndRender(teamId);
        if (playAudio) playTone(delta > 0 ? "up" : "down");
      }

      function changeMemberScore(teamId, memberId, delta) {
        const team = state.teams.find((item) => item.id === teamId);
        const member = team?.members.find((item) => item.id === memberId);
        if (!team || !member) return;
        member.score += delta;
        saveAndRender(teamId);
        playTone(delta > 0 ? "up" : "down");
      }

      function removeMember(teamId, memberId) {
        const team = state.teams.find((item) => item.id === teamId);
        if (!team) return;
        team.members = team.members.filter((member) => member.id !== memberId);
        saveAndRender(teamId);
      }

      function changeAllScores(delta) {
        state.teams.forEach((team) => {
          team.baseScore += delta;
        });
        saveAndRender();
        showNotice(delta > 0 ? "安靜達標！所有組別加 1 分 ✨" : "音量超過門檻，所有組別扣 1 分", delta < 0);
        playTone(delta > 0 ? "success" : "down");
      }

      function setMicMessage(message, isError = false) {
        elements.micMessage.textContent = message;
        elements.micMessage.classList.toggle("error", isError);
      }

      function showNotice(message, isPenalty = false) {
        elements.notice.textContent = message;
        elements.notice.classList.toggle("penalty", isPenalty);
        elements.notice.classList.add("show");
        window.clearTimeout(noticeTimeout);
        noticeTimeout = window.setTimeout(() => elements.notice.classList.remove("show"), 2800);
      }

      function getAudioContext() {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) throw new Error("此瀏覽器不支援 Web Audio API。");
        if (!audioContext) audioContext = new AudioContextClass();
        return audioContext;
      }

      function playTone(kind) {
        try {
          const context = getAudioContext();
          if (context.state === "suspended") void context.resume();
          const notes = kind === "up" ? [660, 880] : kind === "success" ? [523, 659, 784] : [260, 190];
          const start = context.currentTime;
          notes.forEach((frequency, index) => {
            const oscillator = context.createOscillator();
            const gain = context.createGain();
            const time = start + index * 0.09;
            oscillator.type = kind === "down" ? "triangle" : "sine";
            oscillator.frequency.setValueAtTime(frequency, time);
            gain.gain.setValueAtTime(0.0001, time);
            gain.gain.exponentialRampToValueAtTime(0.13, time + 0.012);
            gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.17);
            oscillator.connect(gain);
            gain.connect(context.destination);
            oscillator.start(time);
            oscillator.stop(time + 0.18);
          });
        } catch (error) {
          console.error("播放音效失敗：", error);
          setMicMessage(`音效無法播放：${error.message}`, true);
        }
      }

      function updateThresholdUI() {
        const threshold = Number(elements.threshold.value);
        elements.thresholdValue.value = `${threshold}%`;
        elements.thresholdCaption.textContent = `噪音門檻 ${threshold}%`;
        elements.meter.style.setProperty("--threshold", `${threshold}%`);
      }

      function updateQuietUI() {
        const target = Number(elements.quietSeconds.value);
        const progress = elements.quietToggle.checked ? Math.min(100, quietElapsed / target * 100) : 0;
        elements.quietFill.style.width = `${progress}%`;
        elements.quietTime.textContent = `${Math.floor(quietElapsed)} / ${target} 秒`;
      }

      function stopMicrophone() {
        if (animationFrame) cancelAnimationFrame(animationFrame);
        animationFrame = 0;
        if (sourceNode) sourceNode.disconnect();
        sourceNode = null;
        analyser = null;
        if (micStream) micStream.getTracks().forEach((track) => track.stop());
        micStream = null;
        volume = 0;
        elements.meter.style.setProperty("--level", "0%");
        elements.volumeNumber.textContent = "0";
        elements.meter.setAttribute("aria-valuenow", "0");
        elements.micState.classList.remove("active");
        elements.micState.lastElementChild.textContent = "麥克風未啟動";
        elements.micToggle.textContent = "開啟麥克風";
        elements.micToggle.disabled = false;
        lastFrameAt = 0;
        quietElapsed = 0;
        updateQuietUI();
      }

      async function startMicrophone() {
        if (!navigator.mediaDevices?.getUserMedia) {
          setMicMessage("此瀏覽器或目前網址不支援麥克風。請改用最新版瀏覽器，並透過 HTTPS 或 localhost 開啟頁面。", true);
          return;
        }
        elements.micToggle.disabled = true;
        setMicMessage("正在請求麥克風權限，請在瀏覽器提示中選擇允許。");
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          micStream = stream;
          const context = getAudioContext();
          if (context.state === "suspended") await context.resume();
          analyser = context.createAnalyser();
          analyser.fftSize = 1024;
          sourceNode = context.createMediaStreamSource(stream);
          sourceNode.connect(analyser);
          elements.micState.classList.add("active");
          elements.micState.lastElementChild.textContent = "麥克風監聽中";
          elements.micToggle.textContent = "關閉麥克風";
          elements.micToggle.disabled = false;
          setMicMessage("麥克風已啟動。若沒有音量反應，請確認瀏覽器已允許麥克風並選對輸入裝置。");
          lastFrameAt = performance.now();
          animationFrame = requestAnimationFrame(readMicrophone);
        } catch (error) {
          stopMicrophone();
          const denied = error.name === "NotAllowedError" || error.name === "SecurityError";
          const message = denied
            ? "無法使用麥克風：權限遭拒或尚未允許。請點網址列左側的鎖頭/網站設定，將麥克風改為「允許」，再重新啟動。"
            : error.name === "NotFoundError"
              ? "找不到可用的麥克風，請連接或選擇一個輸入裝置後重試。"
              : `麥克風啟動失敗：${error.message || "請檢查裝置與瀏覽器權限後重試。"}`;
          setMicMessage(message, true);
        }
      }

      function readMicrophone(timestamp) {
        if (!analyser || !micStream) return;
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b) / data.length;
        volume = Math.min(100, Math.round(avg / 150 * 100));
        elements.volumeNumber.textContent = String(volume);
        elements.meter.style.setProperty("--level", `${volume}%`);
        elements.meter.setAttribute("aria-valuenow", String(volume));

        const elapsed = Math.min(0.25, Math.max(0, (timestamp - lastFrameAt) / 1000));
        lastFrameAt = timestamp;
        const threshold = Number(elements.threshold.value);
        if (volume >= threshold) {
          quietElapsed = 0;
          if (elements.penaltyToggle.checked && timestamp >= cooldownUntil) {
            changeAllScores(-1);
            cooldownUntil = timestamp + 5000;
          }
        } else if (elements.quietToggle.checked) {
          quietElapsed += elapsed;
          if (quietElapsed >= Number(elements.quietSeconds.value)) {
            changeAllScores(1);
            quietElapsed = 0;
          }
        } else {
          quietElapsed = 0;
        }
        const cooldown = Math.max(0, (cooldownUntil - timestamp) / 1000);
        elements.cooldownStatus.textContent = cooldown > 0 ? `扣分冷卻：${cooldown.toFixed(1)} 秒` : "扣分冷卻：就緒";
        updateQuietUI();
        animationFrame = requestAnimationFrame(readMicrophone);
      }

      function splitNames(value) {
        return value
          .replace(/^(?:組員|成員|名單)\s*[:：]\s*/, "")
          .replace(/^[•・\-]\s*/, "")
          .split(/[、，,;；/|\t]+/)
          .map((name) => name.trim())
          .filter(Boolean)
          .map((name) => ({ id: createId(), name: name.slice(0, 36), score: 0 }));
      }

      function parseImportedTeams(text) {
        const groups = [];
        let current = null;
        const headerPattern = /^\s*((?:第?\s*[一二三四五六七八九十百\d]+\s*組)|(?:組別\s*[一二三四五六七八九十百\d]+))\s*[:：\-]?\s*(.*)$/;
        for (const rawLine of text.split(/\r?\n/)) {
          const line = rawLine.trim();
          if (!line) continue;
          const match = line.match(headerPattern);
          if (match) {
            current = { id: createId(), name: match[1].replace(/\s+/g, ""), baseScore: 0, members: [] };
            groups.push(current);
            const names = splitNames(match[2]);
            if (names.length) current.members.push(...names);
          } else if (current) {
            current.members.push(...splitNames(line));
          }
        }
        return groups.filter((team) => team.members.length > 0 || groups.length === 1);
      }

      elements.addTeam.addEventListener("click", () => {
        state.teams.push({ id: createId(), name: `第${state.teams.length + 1}組`, baseScore: 0, members: [] });
        saveAndRender();
        elements.teams.lastElementChild?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
      elements.removeTeam.addEventListener("click", () => {
        if (state.teams.length <= 1) return;
        const removed = state.teams.pop();
        saveAndRender();
        showNotice(`已移除「${removed.name}」`);
      });
      elements.resetScores.addEventListener("click", () => {
        if (!window.confirm("確定要將所有組別與組員分數全部歸零嗎？此動作無法復原。")) return;
        state.teams.forEach((team) => {
          team.baseScore = 0;
          team.members.forEach((member) => { member.score = 0; });
        });
        saveAndRender();
        showNotice("所有分數已歸零");
      });
      elements.rankingToggle.addEventListener("click", () => {
        state.ranking = !state.ranking;
        saveAndRender();
      });
      elements.threshold.addEventListener("input", () => {
        state.threshold = Number(elements.threshold.value);
        updateThresholdUI();
        saveState();
      });
      elements.penaltyToggle.addEventListener("change", () => {
        state.penaltyEnabled = elements.penaltyToggle.checked;
        saveState();
      });
      elements.quietToggle.addEventListener("change", () => {
        state.quietEnabled = elements.quietToggle.checked;
        if (!state.quietEnabled) quietElapsed = 0;
        saveState();
        updateQuietUI();
      });
      elements.quietSeconds.addEventListener("input", () => {
        elements.quietSecondsValue.value = `${elements.quietSeconds.value} 秒`;
        quietElapsed = Math.min(quietElapsed, Number(elements.quietSeconds.value));
        updateQuietUI();
        saveState();
      });
      elements.micToggle.addEventListener("click", () => {
        if (micStream) {
          stopMicrophone();
          setMicMessage("麥克風已關閉。");
        } else {
          void startMicrophone();
        }
      });
      elements.importTeams.addEventListener("click", () => {
        const imported = parseImportedTeams(elements.importText.value);
        if (!imported.length) {
          elements.importStatus.textContent = "找不到組別資料。請使用「第一組：姓名、姓名」格式，並確認組員列在組別標題之後。";
          return;
        }
        if (!window.confirm(`將以 ${imported.length} 組匯入資料取代目前 ${state.teams.length} 組及其分數，確定繼續嗎？`)) return;
        state.teams = imported;
        saveAndRender();
        elements.importStatus.textContent = `已匯入 ${imported.length} 組及 ${imported.reduce((count, team) => count + team.members.length, 0)} 位組員。`;
      });

      elements.threshold.value = String(state.threshold);
      elements.penaltyToggle.checked = state.penaltyEnabled;
      elements.quietToggle.checked = state.quietEnabled;
      elements.quietSeconds.value = String(state.quietSeconds);
      elements.quietSecondsValue.value = `${state.quietSeconds} 秒`;
      updateThresholdUI();
      updateQuietUI();
      renderTeams();

      window.addEventListener("pagehide", stopMicrophone);
    })();
  }
});
