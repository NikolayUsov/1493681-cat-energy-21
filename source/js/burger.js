const burgerBtn= document.querySelector(".burger__button");
const burgerMenu = document.querySelector(".burger__menu")
burgerBtn.addEventListener("click",function(evt){
  evt.preventDefault();
  burgerMenu.classList.toggle("burger__menu--show")
});
