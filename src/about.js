// function getAboutText() {
//   const xhr = new XMLHttpRequest();
//   xhr.open("GET", "/About/Data", true);
//   xhr.onreadystatechange = function () {
//     if (xhr.readyState === 4 && xhr.status === 200) {
//       const data = JSON.parse(xhr.responseText);
//       const text = data.text;
//       console.log(text);
//       document.getElementById("about").innerText = text;
//     }
//   };
//   xhr.send();
// }

// document.addEventListener("DOMContentLoaded", getAboutText);

const loadingIcon = document.querySelector(".loading-icon");

loadingIcon.style.display = "none";

fetch("/About/Data")
  .then((response) => response.json())
  .then((data) => {
    const { text } = data;
    document.getElementById("about").innerText = text;
  })
  .catch((error) => console.log(error))
  .finally(() => (loadingIcon.style.display = "none"));

loadingIcon.style.display = "flex";
