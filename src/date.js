const date = new Date();
const year = date.getFullYear();

document.getElementById(
  "copyright"
).innerHTML = `© Wouter van der Laan ${year}`;
