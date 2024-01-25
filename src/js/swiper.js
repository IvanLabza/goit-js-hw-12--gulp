import Swiper from "swiper";

import "swiper/css/bundle";

document.addEventListener("DOMContentLoaded", () => {
  const swiper = new Swiper(".swiper", {
    keyboard: {
      enabled: true,
      onlyOnViewport: true,
      pageUpDown: true, 
    },
    autoplay: {
      delay: 1070,
      stopOnLastSlide: false,
      disableOnInteraction: false, 
    },
    speed: 1000,

    breakpoints: {
      770: {
        slidesPerView: 1,
        spaceBetween: 25,
      },
      980: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
    },
  });

  swiper.init();
});
