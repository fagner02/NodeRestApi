var page = null;
var size = 0;

function add() {
  const text = document.querySelector("textarea").value;
  const title = document.querySelector(".title").value;
  if (text.replace(/ /g, "").length == 0) {
    window.alert("text is empty");
    return;
  }
  if (title.replace(/ /g, "").length == 0) {
    window.alert("title is empty");
    return;
  }
  axios
    .post(
      "http://localhost:9000/.netlify/functions/app/add",
      JSON.stringify({ title, text })
    )
    .then((res) => {
      console.log(res.data);
      document.querySelector("textarea").value = "";
    })
    .catch((err) => {
      console.log(err);
    });
}

async function update() {
  await wait(1000);
  var breaked = false;
  axios
    .get(`http://localhost:9000/.netlify/functions/app/new`, {
      params: { page: page, size: size },
    })
    .then((res) => {
      console.log(res.data);
      if (res.data.list.length <= 0) {
        return;
      }
      if (res.data.shouldUpdate) {
        for (let i = size; i <= res.data.listSize - 1; i++) {
          var box = document.createElement("div");
          box.className = "card-box";

          var card = document.createElement("div");
          card.className = "card";

          var title = document.createElement("h6");
          var text = document.createElement("p");

          text.innerHTML = res.data.list[i].data.text;
          title.innerHTML = res.data.list[i].data.title;

          document.querySelector(".back").appendChild(box);
          box.appendChild(card);
          card.appendChild(title);
          card.appendChild(text);
          size++;
        }
      }
      if (res.data.nextPage != null) {
        console.log(res.data);
        page = res.data.nextPage;
        size = 0;
      }
      update();
    })
    .catch(async () => {
      console.log("error");
      await wait(10000);
      update();
    });
}

update();

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
