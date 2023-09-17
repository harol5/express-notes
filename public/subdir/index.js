//js subdir
const h2 = document.createElement("h2");
h2.innerHTML = "this h2 was added with DOM manipulation";

const body = document.getElementsByTagName("body")[0];
body.appendChild(h2);
