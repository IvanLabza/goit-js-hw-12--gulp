import axios from "axios";
const key = "38303120-77261ecd691aecbe62c4afdac";
const baseUrl = "https://pixabay.com/api/";

export async function fetchPhotos(query, page, perPage) {
  const response = await axios.get(
    `${baseUrl}?key=${key}&q=${query}&image_type=photo&orientation=horizontal&safesearch=false&page=${page}&per_page=${perPage}`
  );
  return response.data;
}
