/* Imperium Motors — Button ripple effect.
   Навешивает волну от точки клика на все элементы .btn.
   Подключить после разметки: <script src="scripts/ripple.js"></script> */
(function () {
  function createRipple(event) {
    var button = event.currentTarget;
    var circle = document.createElement("span");
    var diameter = Math.max(button.clientWidth, button.clientHeight);
    var radius = diameter / 2;
    var rect = button.getBoundingClientRect();

    circle.className = "ripple";
    circle.style.width = circle.style.height = diameter + "px";
    circle.style.left = (event.clientX - rect.left - radius) + "px";
    circle.style.top = (event.clientY - rect.top - radius) + "px";

    var old = button.getElementsByClassName("ripple")[0];
    if (old) old.remove();

    button.appendChild(circle);
    circle.addEventListener("animationend", function () { circle.remove(); });
  }

  function attach(root) {
    (root || document).querySelectorAll(".btn").forEach(function (btn) {
      if (btn.dataset.ripple) return;
      btn.dataset.ripple = "1";
      btn.addEventListener("click", createRipple);
    });
  }

  if (document.readyState !== "loading") attach();
  else document.addEventListener("DOMContentLoaded", function () { attach(); });

  // экспорт для динамически добавленных кнопок
  window.ImperiumRipple = { attach: attach };
})();
