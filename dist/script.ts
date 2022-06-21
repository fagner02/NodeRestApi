import axios from "axios";

function add() {
  axios.get("http://localhost:9000/.netlify/functions/app").then((res) => {
    var n = document.createElement("h1");
    n.innerHTML = res.data;
    document.body.appendChild(n);
  });
}

function ss() {
  axios
    .post("http://localhos   t:9000/.netlify/functions/app/p")
    .then((res) => {
      console.log(res.data);
    });
}
