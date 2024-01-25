const items = document.querySelectorAll(".questions__list-item");

items.forEach((item) => {
  item.addEventListener("click", () => {
    const close = item.querySelector(".close");
    const open = item.querySelector(".open");
    const text = item.querySelector(".questions__list-text");

    text.classList.toggle("is-open");


    open.style.display = text.classList.contains("is-open") ? "none" : "block";
    close.style.display = text.classList.contains("is-open") ? "block" : "none";
    text.style.display = text.classList.contains("is-open") ? "block" : "none";
  });
});
