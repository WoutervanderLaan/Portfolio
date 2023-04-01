const loadingIcons = document.querySelectorAll(".loading-icon");

loadingIcons.forEach((icon) => (icon.style.display = "none"));

fetch("/Resume/Data")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((item) => {
      const tr = document.createElement("tr");
      const tdStart = document.createElement("td");
      const tdEnd = document.createElement("td");
      const tdName = document.createElement("td");
      tdName.style = "padding-left: 20px";

      tdStart.textContent = item.startDate;
      tdEnd.textContent = item.endDate;
      tdName.textContent = item.name;

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
      } else {
        console.log(item);
      }
    });
  })
  .catch((error) => console.log(error))
  .finally(() => loadingIcons.forEach((icon) => (icon.style.display = "none")));

loadingIcons.forEach((icon) => (icon.style.display = "flex"));
