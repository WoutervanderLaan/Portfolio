function getAboutText() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "/About/Data", true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      const text = data.text;
      console.log(text);
      document.getElementById("about").innerText = text;
    }
  };
  xhr.send();
}

document.addEventListener("DOMContentLoaded", getAboutText);
