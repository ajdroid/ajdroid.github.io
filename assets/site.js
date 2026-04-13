// Initialize dark mode widget from the locally hosted library.
(function initializeDarkMode() {
  if (typeof Darkmode === "undefined") {
    return;
  }

  var options = {
    time: "0.5s",
    label: "dark"
  };

  var darkmode = new Darkmode(options);
  darkmode.showWidget();
})();
