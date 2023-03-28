function getResumeData() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "/Resume/Data", true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);

      data.forEach((item) => {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "name";
        checkbox.value = item.name;

        const tr = document.createElement("tr");
        const tdStart = document.createElement("td");
        const tdEnd = document.createElement("td");
        const tdName = document.createElement("td");
        tdName.style = "padding-left: 20px";

        tdStart.textContent = item.startDate;
        tdEnd.textContent = item.endDate;
        tdName.textContent = item.name;

        tr.appendChild(checkbox);
        tr.appendChild(tdStart);
        tr.appendChild(tdEnd);
        tr.appendChild(tdName);

        if (item.kind === "Education") {
          document.getElementById("education").appendChild(tr);
        } else if (item.kind === "Exhibition") {
          document.getElementById("exhibition").appendChild(tr);
        } else if (item.kind === "Prize") {
          document.getElementById("prize").appendChild(tr);
        } else if (item.kind === "Publication") {
          document.getElementById("publication").appendChild(tr);
        } else if (item.kind === "Other") {
          document.getElementById("other").appendChild(tr);
        }
      });
    }
  };
  xhr.send();
}

function getAboutText() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "/About/Data", true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      const text = data.text;
      if (!text) {
        document.getElementById("aboutText").textContent = "Insert text here.";
      } else {
        document.getElementById("aboutText").textContent = text;
      }
    }
  };
  xhr.send();
}

document.addEventListener("DOMContentLoaded", () => {
  getResumeData();
  getAboutText();
});
