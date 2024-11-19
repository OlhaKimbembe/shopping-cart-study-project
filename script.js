const fs = require("fs");

const dataItems = JSON.parse(fs.readFileSync("./items.json"));

let total = 0;

let counterBtn = document.querySelector(".count-items-in-cart");

let sortData = [];

let countItems = 0;

// export
module.exports = {
  dataItems,
  loadAddedItemsOnPage,
  showItemsinStore,
};
// load items in store from json
function showItemsinStore(dataItems) {
  const template = document.querySelector(".item-template");

  const itemsWrap = document.querySelector(".items-wrap");

  dataItems.forEach((item) => {
    const templateContent = template.content.cloneNode(true);
    itemsWrap.appendChild(templateContent);
    const currentItem = itemsWrap.lastElementChild;
    currentItem.querySelector(".image").style.backgroundColor =
      item["image-color"];
    currentItem.querySelector(".name").innerText = item.name;
    currentItem.querySelector(".price").innerText = `$${(
      item.priceCents / 100
    ).toFixed(2)}`;
    currentItem.dataset.id = item.id;
  });
}

// load added items in cart on the page
function loadAddedItemsOnPage() {
  dataItems.forEach((item) => {
    if (
      !sessionStorage.getItem(`count${item.id}`) ||
      sessionStorage.getItem(`count${item.id}`) == 0
    ) {
      item.count = 0;
      item.queue = 0;
    } else {
      item.count = Number(sessionStorage.getItem(`count${item.id}`));
      item.queue = Number(sessionStorage.getItem(`queue${item.id}`));
      item.fromReload = "true";
      sortData.push(item);
    }
  });

  sortData.sort((a, b) => {
    return a.queue - b.queue;
  });

  sortData.forEach((item) => {
    addItemsInCartCounter();
    addItem(item);
  });
}
loadAddedItemsOnPage();

// save in storage Count of added items
function saveInStorage(item) {
  sessionStorage.setItem(`count${item.id}`, item.count);
}

// save in storage price
function saveInStoragePrice(total) {
  sessionStorage.setItem("total", total);
}

// save in storage queue of added items
function saveInStorageQueue(item) {
  sessionStorage.setItem(`queue${item.id}`, item.queue);
}

// add to cart button on click
function addToCartBtn() {
  document.addEventListener("click", (e) => {
    if (!e.target.matches(".add-to-cart")) return;
    const currentItem = e.target.closest(".item");
    document.querySelector(".cart-box").classList.remove("invisible");
    let count;
    let currentItemFromData;
    dataItems.forEach((item) => {
      if (item.id == currentItem.dataset.id) {
        item.count += 1;
        saveInStorage(item);
        count = item.count;
        currentItemFromData = item;
      }
    });
    if (count == 1) {
      addItem(currentItemFromData);
      currentItemFromData.queue = Date.now();
      saveInStorageQueue(currentItemFromData);
      addItemsInCartCounter();
    } else {
      addExistItem(currentItemFromData);
    }
  });
}
addToCartBtn();

// add item
function addItem(item) {
  const template = document.querySelector(".cart-template");
  const templateContent = template.content.cloneNode(true);

  const cartBox = document.querySelector(".cart-items-wrapper");
  cartBox.appendChild(templateContent);
  const cartInItem = cartBox.lastElementChild;
  cartInItem.querySelector(".name-in-cart").innerText = item.name;

  cartInItem.dataset.cartId = item.id;

  addExistItem(item);
}

// add exist item
function addExistItem(item) {
  const itemInCart = document.querySelector(`[data-cart-id="${item.id}"]`);
  if (item.count > 1) {
    itemInCart.querySelector(".check").classList.remove("invisible");
  }
  itemInCart.querySelector(".check").innerText = `x${item.count}`;
  let price = item.priceCents * item.count;
  itemInCart.querySelector(".price-in-cart").innerText = `$${(
    price / 100
  ).toFixed(2)}`;
  addToTotalPrice(item);
}

// add to total price
function addToTotalPrice(item) {
  let adding = 0;
  if (item.fromReload) {
    adding = item.priceCents * item.count;
    delete item.fromReload;
  } else {
    adding = item.priceCents;
  }

  total += adding;
  document.querySelector(".total-price").innerText = `$${(total / 100).toFixed(
    2
  )}`;
  saveInStoragePrice(total);
}

// delete from total price
function deleteFromTotalPrice(item) {
  total -= item.priceCents;
  document.querySelector(".total-price").innerText = `$${(total / 100).toFixed(
    2
  )}`;
  saveInStoragePrice(total);
}

// Remove from cart button on click
function removeFromCartBtn() {
  document.addEventListener("click", (e) => {
    if (!e.target.matches(".remove-from-cart")) return;
    const currentItem = e.target.closest(".item-in-cart");
    deleteFromCart(currentItem);
  });
}
removeFromCartBtn();

// delete from cart
function deleteFromCart(item) {
  let itemFromData;
  dataItems.forEach((itemData) => {
    if (itemData.id == item.dataset.cartId) {
      itemFromData = itemData;
    }
  });
  if (itemFromData.count >= 1) {
    itemFromData.count -= 1;
  }
  saveInStorage(itemFromData);

  if (itemFromData.count <= 1) {
    item.querySelector(".check").classList.add("invisible");
  }
  item.querySelector(".check").innerText = `x${itemFromData.count}`;

  deleteFromTotalPrice(itemFromData);
  item.querySelector(".price-in-cart").innerText = `$${(
    (itemFromData.priceCents * itemFromData.count) /
    100
  ).toFixed(2)}`;
  if (itemFromData.count == 0) {
    item.remove();
    removeItemsFromCartCounter();
  }
}

// Make cart button clickable
function cartBtnOnClick() {
  document.querySelector(".cart").addEventListener("click", (e) => {
    if (counterBtn.innerText > 0) {
      document.querySelector(".cart-box").classList.toggle("invisible");
    }
  });
}
cartBtnOnClick();

// add item in cart counter button
function addItemsInCartCounter() {
  countItems += 1;
  counterBtn.innerText = countItems;
  if (counterBtn.innerText > 0) counterBtn.classList.remove("invisible");
}

// remove item from cart counter button
function removeItemsFromCartCounter() {
  countItems -= 1;
  counterBtn.innerText = countItems;
  if (counterBtn.innerText == 0) {
    counterBtn.classList.add("invisible");
    document.querySelector(".cart-box").classList.add("invisible");
  }
}
