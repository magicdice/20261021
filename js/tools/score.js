App.register({
  id: "score",
  title: "計分板",
  icon: "🏆",
  init(el) {
    const frame = document.createElement("iframe");
    frame.className = "tool-frame";
    frame.title = "課堂計分板";
    frame.src = "index_4.html";
    frame.loading = "eager";
    el.append(frame);
  }
});
