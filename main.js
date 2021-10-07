import "./style.scss";
const apiKey = "2cX7dYaMvSEiuNamTY03eeJupY40BErq";

const bodyDiv = document.getElementById("app");
const searchTxt = document.getElementById("search");

let requestCount = 0;
let offset = 25;

async function getGifs(Link) {
  const response = await fetch(Link);
  const gifArray = await response.json();
  console.log(gifArray);
  if (requestCount > 0) {
    requestCount = 0;
    console.log("sıfırlamadı");
    return renderGifs(gifArray.data, false);
  }
  renderGifs(gifArray.data, true);
  console.log("sıfırladı");
}

function renderGifs(array, resetBody) {
  if (resetBody) {
    bodyDiv.innerHTML = "";
  }
  array.forEach((element) => {
    const image = document.createElement("img");
    image.loading = "lazy";
    image.src = element.images.fixed_height_small.url;
    bodyDiv.appendChild(image);
  });
}
document.addEventListener("scroll", function () {
  const scrollPosition = window.scrollY;
  const allWindowHeight = document.body.clientHeight;
  const windowHeigt = window.innerHeight;
  const currentBottomLine = scrollPosition + windowHeigt;
  const requestScrollPosition = allWindowHeight - currentBottomLine;
  if (
    200 > requestScrollPosition &&
    requestScrollPosition > 100 &&
    requestCount == 0
  ) {
    requestCount++;
    if (searchTxt.value != "") {
      getGifs(
        `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${searchTxt.value}&limit=25&offset=${offset}&rating=g`
      );
    } else {
      getGifs(
        `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=25&offset=${offset}`
      );
    }

    offset += 25;
  }
});

getGifs(`https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=25`);
let timeOut;

searchTxt.addEventListener("keydown", function (e) {
  clearTimeout(timeOut);
});

searchTxt.addEventListener("keyup", function (e) {
  clearTimeout(timeOut);
  timeOut = setTimeout(() => {
    if (e.target.value == "") {
      return getGifs(
        `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=25`
      );
    }

    getGifs(
      `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${e.target.value}&limit=25&offset=0&rating=g`
    );
  }, 500);
});
