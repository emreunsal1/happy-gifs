// key : 2cX7dYaMvSEiuNamTY03eeJupY40BErq

const apiKey = "2cX7dYaMvSEiuNamTY03eeJupY40BErq";

const bodyDiv = document.getElementById("app");
const searchTxt = document.getElementById("search");

let requestCount = 0;

async function getGifs(Link) {
  const response = await fetch(Link);
  const gifArray = await response.json();
  console.log(gifArray);
  if (requestCount > 0) {
    return renderGifs(gifArray.data, false);
    requestCount = 0;
  }
  renderGifs(gifArray.data, true);
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
document.addEventListener("scroll", function (params) {
  const scrollPosition = window.scrollY;
  const allWindowHeight = document.body.clientHeight;
  const windowHeigt = window.innerHeight;
  const currentBottomLine = scrollPosition + windowHeigt;
  const requestScrollPosition = allWindowHeight - currentBottomLine;
  console.log(requestScrollPosition);
  if (
    200 > requestScrollPosition &&
    requestScrollPosition > 100 &&
    requestCount == 0
  ) {
    getGifs(
      `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=25&offset=25`
    );
    requestCount++;
    console.log("istek gitti");
  }
});

await getGifs(
  `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=25`
);

searchTxt.addEventListener("keyup", function (e) {
  getGifs(
    `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${e.target.value}&limit=25&offset=0&rating=g`
  );
});
