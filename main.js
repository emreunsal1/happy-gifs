import "./style.scss";
import { loadingSvg } from "./loading";
import {
  apiKey,
  popupCont,
  backBtn,
  bodyDiv,
  popularSearchDiv,
  searchTxt,
  switchBtn,
  popupDiv,
  popularSearchArray,
  lightModeLocalStrogeText,
} from "./constants";

let requestCount = 0;
let offset = 25;
let timeOut;

if (!localStorage.getItem(lightModeLocalStrogeText)) {
  setLightMode(false);
}

popularSearchArray.forEach((e) => {
  const newLi = document.createElement("li");
  newLi.innerHTML = "#" + e;
  popularSearchDiv.querySelector("ul").appendChild(newLi);
  newLi.addEventListener("click", () => {
    searchTxt.value = e;
    getGifs(
      `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${e}&limit=25&offset=${offset}&rating=g`
    );
  });
});

async function getGifs(Link) {
  const response = await fetch(Link);
  const gifArray = await response.json();
  if (requestCount > 0) {
    requestCount = 0;
    return renderGifs(gifArray.data, false);
  }
  renderGifs(gifArray.data, true);
}

function renderGifs(array, resetBody) {
  if (resetBody) {
    bodyDiv.innerHTML = "";
  }

  array.forEach((element) => {
    const loadingDiv = document.createElement("div");
    const image = document.createElement("img");
    const imgWrapper = document.createElement("div");
    const borderDiv = document.createElement("div");

    loadingDiv.innerHTML = loadingSvg;
    loadingDiv.style = "display:block";
    borderDiv.className = "border-div";
    borderDiv.style = "cursor:pointer";
    imgWrapper.className = "image-wrapper";
    image.src = element.images.fixed_height_small.url;
    image.style = "display:none";

    image.addEventListener("load", () => {
      loadingDiv.remove();
      image.style = "display:block";
    });

    imgWrapper.addEventListener("click", function () {
      popupCont.querySelector("img").src = element.images.downsized_medium.url;
      popupCont.querySelector("a").href = element.bitly_gif_url;
      popupDiv.style = "display:flex";
      popupDiv.focus();
    });

    imgWrapper.appendChild(loadingDiv);
    imgWrapper.appendChild(image);
    borderDiv.appendChild(imgWrapper);
    bodyDiv.appendChild(borderDiv);
  });
}

popupDiv.addEventListener("keydown", (e) => {
  if (e.key == "Escape") {
    closePopup();
  }
});

function closePopup() {
  popupDiv.style = "display:none";
  popupCont.querySelector("img").src = "";
}

backBtn.addEventListener("click", () => closePopup());

popupDiv.addEventListener("click", function (e) {
  if (e.target.className == "popup") closePopup();
});

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

window.addEventListener("load", () => {
  setLightMode(JSON.parse(localStorage.getItem(lightModeLocalStrogeText)));
  getGifs(`https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=25`);
});

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

switchBtn.addEventListener("click", function (e) {
  setLightMode(e.target.checked);
});
function setLightMode(condition) {
  switchBtn.checked = condition;
  localStorage.setItem(lightModeLocalStrogeText, JSON.stringify(condition));
  document.body.className = condition ? "light" : "";
}
