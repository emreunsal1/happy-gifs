// key : 2cX7dYaMvSEiuNamTY03eeJupY40BErq

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
    image.src = element.images.downsized.url;
    bodyDiv.appendChild(image);
  });
}
document.addEventListener("scroll", function (searchBool) {
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
    offset += 25;
    getGifs(
      `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=25&offset=${offset}`
    );

    console.log("istek gitti");
  }
});

getGifs(`https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=25`);

searchTxt.addEventListener("keyup", function (e) {
  const searchText = e.target.value;
  console.log(e.target.value),
    setTimeout(() => {
      if (searchTxt == "") {
        return getGifs(
          `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=25`
        );
      }
      getGifs(
        `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${searchTxt}&limit=25&offset=0&rating=g`
      );
    }, 3000);
});
