import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


import axios from "axios";
const key = "38303120-77261ecd691aecbe62c4afdac";
const baseUrl = "https://pixabay.com/api/";

export async function fetchPhotos(query, page, perPage) {
  const response = await axios.get(
    `${baseUrl}?key=${key}&q=${query}&image_type=photo&orientation=horizontal&safesearch=false&page=${page}&per_page=${perPage}`
  );
  return response.data;
}


export default function createGallery(photos) {
  const markup = photos
    .map((photo) => {
      const {
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = photo;
      return `<div class="photo-card">
            <a class="gallery-link" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</a></div>`;
    })
    .join("");

  return markup;
}


let simpleLightBox = new SimpleLightbox(".gallery a");
let query = "";
let page = 1;
const perPage = 40;

const searchFormEl = document.querySelector(".search-form");
const galleryListEl = document.querySelector(".gallery");
const loadMoreBtnEl = document.querySelector(".load-more");
const inputEl = searchFormEl.firstElementChild;

function getGalleryCardHeight() {
  const galleryCard = document.querySelector(".photo-card");
  const cardHeight = galleryCard.getBoundingClientRect().height;
  return cardHeight;
}

function smoothScroll() {
  const cardHeight = getGalleryCardHeight();
  const scrollAmount = cardHeight * 2;
  window.scrollBy({
    top: scrollAmount,
    behavior: "smooth",
  });
}

function handleSearchFormOnSubmit(event) {
  event.preventDefault();
  if (!loadMoreBtnEl.classList.contains("is-hidden")) {
    loadMoreBtnEl.classList.add("is-hidden");
    console.log("есть");
  }
  query = inputEl.value.trim();
  page = 1;
  if (!query) {
    iziToast.warning({
      title: "Warning",
      message: "The search string cannot be empty.",
      position: "topRight",
      timeout: 3000,
    });
    return;
  }
  fetchPhotos(query, page, perPage)
    .then((data) => {
      console.log(data);
      if (data.totalHits === 0) {
        iziToast.error({
          title: "Error",
          message:
            "Sorry, there are no images matching your search query. Please try again.",
          position: "topRight",
          timeout: 3000,
        });
      } else {
        galleryListEl.innerHTML = createGallery(data.hits);
        simpleLightBox.refresh();
        iziToast.success({
          title: "Success",
          message: `Hooray! We found ${data.totalHits} images.`,
          position: "topRight",
          timeout: 3000,
        });
        if (data.totalHits > perPage) {
          loadMoreBtnEl.classList.remove("is-hidden");
        }
      }
    })
    .catch(onFetchError)
    .finally(() => {
      searchFormEl.reset();
    });
}

function handleMoreBtnClick() {
  page += 1;
  fetchPhotos(query, page, perPage)
    .then((data) => {
      const amountOfPages = Math.ceil(data.totalHits / perPage);

      if (page === amountOfPages || data.totalHits <= perPage) {
        loadMoreBtnEl.classList.add("is-hidden");
        if (amountOfPages === 1) {
          iziToast.warning({
            title: "Warning",
            message:
              "We're sorry, but you've reached the end of search results.",
            position: "topRight",
            timeout: 3000,
          });
        } else {
          iziToast.warning({
            title: "Warning",
            message: "Sorry, there are no more photos.",
            position: "topRight",
            timeout: 3000,
          });
        }
      }

      galleryListEl.insertAdjacentHTML("beforeend", createGallery(data.hits));
      simpleLightBox.refresh();
      smoothScroll();
    })
    .catch(onFetchError);
}


searchFormEl.addEventListener("submit", handleSearchFormOnSubmit);
loadMoreBtnEl.addEventListener("click", handleMoreBtnClick);

function onFetchError(error) {
  Notify.failure("Oops! Something went wrong! Try reloading the page!", {
    position: "topRight",
    timeout: 3000,
    width: "600px",
    fontSize: "24px",
  });
  console.log(error);
}
