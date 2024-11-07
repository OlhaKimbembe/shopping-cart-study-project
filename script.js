// import itemsArr from "./items.json" with {type:"json"};

// console.log(itemsArr);

// const itemsArr = require("./items.json");
// console.log(itemsArr);

const fs = require("fs");

const dataItems = JSON.parse(fs.readFileSync("./items.json"));

// // first we need to display items in the store

function addItemsToPage(dataItems) {
  const itemsWrap = document.querySelector(".items-wrap");
  let template = document.querySelector(".item-card-template");

  dataItems.forEach((item) => {
    const templateContent = template.content.cloneNode(true);
    itemsWrap.appendChild(templateContent);
    const itemCard = itemsWrap.lastElementChild;
    itemCard.dataset.id = item.id;
    itemCard.querySelector(
      ".image"
    ).style.backgroundColor = `#${item.imageColor}`;
    itemCard.querySelector(".category").innerText = item.category;
    itemCard.querySelector(".name").innerText = item.name;
    const price = item.priceCents / 100;
    itemCard.querySelector(".price").innerText = `$${price.toFixed(2)}`;
  });
}

addItemsToPage(dataItems);
