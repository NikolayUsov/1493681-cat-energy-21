const mainNavToggle = document.querySelector(".main-nav__toggle");
const navMain = document.querySelector(".main-nav");
navMain.classList.remove("main-nav--nojs");

mainNavToggle.addEventListener("click", function (evt) {
  evt.preventDefault();
  navMain.classList.toggle("main-nav--open");
});
