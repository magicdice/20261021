App.register({
  id: "board",
  title: "無限白板",
  icon: "🎨",
  init(el) {
    const frame = document.createElement("iframe");
    frame.className = "tool-frame";
    frame.title = "課堂無限白板";
    frame.src = "index_5.html";
    frame.loading = "eager";
    el.append(frame);
  }
});
