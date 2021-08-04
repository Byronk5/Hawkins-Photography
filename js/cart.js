const productsDOM = document.getElementById("items-container");
let productsTotal = document.querySelector(".item-total-price");
const cartDOM = document.querySelector(".cart");
const cartButtonNav = document.querySelector(".cart-button-nav");
const clearCartButton = document.querySelector(".clear-button");
const purchaseButton = document.querySelector(".purchase-button");
const cartContent = document.querySelector(".cart-content");
const addToCartNotification = document.querySelector(".cart-notification-add");
const removeFromCartNotification = document.querySelector(
  ".cart-notification-remove"
);

let cart = [];
let inputs = [];

class Products {
  async getProductsJSON() {
    const response = await fetch("../items.json");
    let data = await response.json();
    let products = data.items;
    products.map((item) => {
      const { image } = item.image;
      const { title } = item.title;
      const price = item.price;
      const id = item.id;
      return { image, title, price, id };
    });
    return products;
  }
}
class UI {
  displayProducts(productsData) {
    let result = "";
    productsData.forEach((item) => {
      result += `
      <div class="col-sm">
        <div class="card mt-5">
          <img
            src="${item.image}"
            alt="img"
            class="card-img-top item-image"
          />
         
          <h3 class="item-price">R${item.price}</h3>
          <div class="card-body text-center">
          <button type="button" class="btn btn-light cart-button" data-id=${item.id}> <i class="fas fa-cart-plus fa-2x"></i
          ></button>            
          </div>
        </div>      
       `;
    });

    productsDOM.innerHTML = result;
  }

  getButtons() {
    let buttons = [...document.querySelectorAll(".cart-button")];

    buttons.forEach((button) => {
      let id = button.dataset.id;

      let inCart = cart.find((item) => item.id === id);

      if (inCart) {
        button.disabled = true;
        button.innerHTML = `<i class="fas fa-cart-arrow-down fa-2x"></i>`;
      }

      button.addEventListener("click", () => {
        button.innerHTML = `<i class="fas fa-cart-arrow-down fa-2x"></i>`;
        button.disabled = true;
        purchaseButton.disabled = false;
        let cartItem = { ...Storage.getProductFromStorage(id), amount: 1 };

        cart = [...cart, cartItem];

        Storage.saveCartToStorage(cart);

        this.calculateCartTotal(cart);
        this.updateCart(cartItem);
        this.displayCartOnProductAdd();
        this.addToCartMessage();
        setTimeout(this.removeAddToCartMessage, 2000);
      });
    });

    this.toggleCartOnBtnClick();
    this.hideCart();
  }
  addToCartMessage() {
    addToCartNotification.classList.add("cart-notification-active");
  }

  removeAddToCartMessage() {
    addToCartNotification.classList.remove("cart-notification-active");
  }

  removeFromCartMessage() {
    removeFromCartNotification.classList.add("cart-notification-active");
  }

  deleteRemoveFromCartMessage() {
    removeFromCartNotification.classList.remove("cart-notification-active");
  }

  calculateCartTotal(cart) {
    let total = 0;
    cart.map((item) => {
      total += item.amount * item.price;
    });
    productsTotal.innerText = total;
  }

  updateCart(cartItem) {
    const div = document.createElement("div");

    div.innerHTML = `<div
class="
  cart-items
  d-flex
  justify-content-center
  mt-2
  mb-2
  p-2
  border-top border-bottom border-info
"
>
<div class="d-flex flex-column align-items-center">
  <label for="Picture">${cartItem.title}</label>
  <img src="${cartItem.image}" alt="product" class="cart-image" />
</div>

<div class="d-flex flex-column align-items-center">
  <label for="Quantity">Quanity</label>
  <input
    type="number"
    name="Quantity"
    class="item-quantity"
    id="quantity"
    min="1"
    max="10"
    value="1"
    data-id=${cartItem.id}
  />
</div>

<div class="d-flex flex-column align-items-center mx-2">
  <label for="Price">Price</label>
  <p>R<span class="cart-price">${cartItem.price}</span></p>
</div>
<div class="align-self-center">
  <button
    class="
      delete-button
      btn btn-danger
      remove-cart-item
      d-flex
      justify-content-center
      align-items-center
      mx-2
    "
    data-id=${cartItem.id}
  >
    <i class="fas fa-times"></i>
  </button>
</div>
</div>
`;
    cartContent.appendChild(div);
  }

  displayCartOnProductAdd() {
    cartDOM.classList.add("display-cart");
  }
  toggleCartOnBtnClick() {
    cartButtonNav.addEventListener("click", () => {
      cartDOM.classList.toggle("display-cart");
    });
  }

  hideCart() {
    const closeCart = document.querySelector(".close-cart");
    closeCart.addEventListener("click", () => {
      cartDOM.classList.remove("display-cart");
    });
  }

  setupAppOnLoad() {
    cart = Storage.getCartFromStorage();
    this.calculateCartTotal(cart);
    this.displayCartFromStorage(cart);
    this.cartIsPopulated(cart);
  }

  cartIsPopulated(cart) {
    let isPopulated = cart.find((item) => item.id);
    if (isPopulated) {
      purchaseButton.disabled = false;
    } else {
      purchaseButton.disabled = true;
    }
  }

  displayCartFromStorage(cart) {
    cart.forEach((item) => {
      this.updateCart(item);
    });
  }

  cartLogic() {
    clearCartButton.addEventListener("click", () => {
      this.removeItemFromCart();
    });

    purchaseButton.addEventListener("click", (e) => {
      alert("Thank you for your purchase!");
      this.removeItemFromCart();
    });

    cartContent.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-button")) {
        let deleteButton = e.target;
        let id = deleteButton.dataset.id;
        this.deleteItem(id);
        this.cartIsPopulated(cart);
        this.removeFromCartMessage();
        setTimeout(this.deleteRemoveFromCartMessage, 2000);
        deleteButton.parentElement.parentElement.remove();
      } else if (e.target.classList.contains("item-quantity")) {
        let input = e.target;
        let id = input.dataset.id;
        let tempItem = cart.find((item) => item.id === id);
        tempItem.amount = input.value;
        Storage.saveCartToStorage(cart);
        this.calculateCartTotal(cart);
      }
    });
  }

  removeItemFromCart() {
    let cartItems = cart.map((item) => item.id);

    cartItems.forEach((cartItemId) => {
      this.deleteItem(cartItemId);
    });

    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }

    purchaseButton.disabled = true;
  }

  deleteItem(cartItemId) {
    cart = cart.filter((item) => item.id !== cartItemId);

    this.calculateCartTotal(cart);
    Storage.saveCartToStorage(cart);

    this.getSingleButton(cartItemId);
  }

  getSingleButton(cartItemId) {
    let buttons = [...document.querySelectorAll(".cart-button")];
    buttons.forEach((button) => {
      let buttonId = button.dataset.id;

      if (buttonId === cartItemId) {
        button.innerHTML = `<i class="fas fa-cart-plus fa-2x"></i>`;
        button.disabled = false;
      }
    });
  }
}
class Storage {
  static saveProductsToStorage(productsData) {
    localStorage.setItem("products", JSON.stringify(productsData));
  }

  static getProductFromStorage(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((product) => product.id === id);
  }
  static saveCartToStorage(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  static getCartFromStorage() {
    const isTrue = localStorage.getItem("cart");
    if (isTrue) {
      return JSON.parse(localStorage.getItem("cart"));
    } else {
      return [];
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();
  ui.setupAppOnLoad();
  products
    .getProductsJSON()
    .then((productsData) => {
      ui.displayProducts(productsData);
      Storage.saveProductsToStorage(productsData);
    })
    .then(() => {
      ui.getButtons();
      ui.cartLogic();
    })
    .catch((error) => {
      console.log(error);
    });
});
