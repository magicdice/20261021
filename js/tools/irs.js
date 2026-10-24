App.register({
  id: "irs",
  title: "即時問答",
  icon: "🙋",
  init(el) {
    const frame = document.createElement("iframe");
    frame.className = "tool-frame";
    frame.title = "即時問答互動系統";
    frame.src = "index_6.html";
    frame.loading = "eager";
    el.append(frame);
  }
});
