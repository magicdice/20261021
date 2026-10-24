App.register({
  id: "timer",
  title: "小組計時",
  icon: "⏱️",
  init(el) {
    const frame = document.createElement("iframe");
    frame.className = "tool-frame";
    frame.title = "課堂小組計時器";
    frame.src = "index_3.html";
    frame.loading = "eager";
    el.append(frame);
  }
});
