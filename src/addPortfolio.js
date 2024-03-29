function loadPortfolio() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "/Portfolio/Data", true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);

      const seriesArray = [];
      const portfolioArray = [];

      data.forEach((portfolioItem) => {
        const checkSeriesExistence = seriesArray.includes(portfolioItem.series);

        if (!checkSeriesExistence) {
          ////// Creating new Series //////
          seriesArray.push(portfolioItem.series);

          const seriesDiv = document.createElement("div");
          seriesDiv.id = portfolioItem.series;
          seriesDiv.classList.add("portfolioSeries");

          ////// Creating checkbox for Series //////
          const seriesCheckbox = document.createElement("input");
          seriesCheckbox.type = "checkbox";
          seriesCheckbox.name = "name";
          seriesCheckbox.value = portfolioItem.series;

          const pTitle = document.createElement("p");
          const pMaterial = document.createElement("p");
          const pDimensions = document.createElement("p");
          const pDescription = document.createElement("p");
          pTitle.textContent = portfolioItem.title;
          pMaterial.textContent = portfolioItem.material;
          pDimensions.textContent = portfolioItem.dimensions;
          pDescription.innerText = portfolioItem.description;
          seriesDiv.appendChild(seriesCheckbox);
          seriesDiv.appendChild(pTitle);
          seriesDiv.appendChild(pMaterial);
          seriesDiv.appendChild(pDimensions);
          seriesDiv.appendChild(pDescription);

          const containerDiv = document.createElement("div");
          containerDiv.classList.add("imageContainer");

          ////// Creating new work within series //////
          const workDiv = document.createElement("div");
          workDiv.classList.add("portfolioItem");

          const a = document.createElement("a");
          const img = document.createElement("img");
          a.href = "img/" + portfolioItem.img;
          img.src = "img/" + portfolioItem.img;
          img.alt = portfolioItem.img;
          img.loading = "lazy";
          workDiv.appendChild(a).appendChild(img);

          ////// Attaching work to Series //////
          containerDiv.appendChild(workDiv);
          seriesDiv.appendChild(containerDiv);

          ////// Storing Series in Array for Pick-up //////
          portfolioArray.push(seriesDiv);

          // document.getElementById("portfolio").appendChild(seriesDiv);
        } else {
          ////// Picking-up Series for Appending //////
          const existingDiv = portfolioArray.find((item) => {
            return item.id === portfolioItem.series;
          });
          ////// Creating new Work within Existing Series //////
          const workDiv = document.createElement("div");
          workDiv.classList.add("portfolioItem");

          const a = document.createElement("a");
          const img = document.createElement("img");
          const br = document.createElement("br");
          a.href = "img/" + portfolioItem.img;
          img.src = "img/" + portfolioItem.img;
          img.alt = portfolioItem.img;
          img.loading = "lazy";
          workDiv.appendChild(a).appendChild(img);

          ////// Attaching work to Existing Series //////
          existingDiv.querySelector(".imageContainer").appendChild(workDiv);
        }
      });

      portfolioArray.forEach((series) => {
        document.getElementById("portfolio").appendChild(series);
      });

      seriesArray.forEach((series) => {
        const p = document.createElement("p");
        p.textContent = series;
        p.style = "display: inline; margin: 0 10px;";

        document.getElementById("series").appendChild(p);
      });
    }
  };
  xhr.send();
}

document.addEventListener("DOMContentLoaded", loadPortfolio);
