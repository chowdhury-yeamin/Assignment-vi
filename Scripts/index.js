// === Elements
const categoriesContainer = document.getElementById("categories");
const catSpinner = document.getElementById("cat-spinner");
const plantsGrid = document.getElementById("plants-grid");
const gridSpinner = document.getElementById("grid-spinner");
const gridTitle = document.getElementById("grid-title");
const cartList = document.getElementById("cart-list");
const cartTotal = document.getElementById("cart-total");
const modal = document.getElementById("modal");
const modalClose = document.getElementById("modal-close");
const modalContent = document.getElementById("modal-content");

let cart = [];

// === Load Categories
async function loadCategories() {
  try {
    const res = await fetch(
      "https://openapi.programming-hero.com/api/categories"
    );
    const data = await res.json();
    catSpinner.style.display = "none";

    const categories = data.categories || data.data || [];

    categories.forEach((cat) => {
      const catName =
        cat.category || cat.name || cat.category_name || "Unnamed";
      const catId = cat.id || cat.category_id;

      const btn = document.createElement("button");
      btn.textContent = catName;
      btn.className =
        "px-3 py-1  rounded hover:bg-green-500 w-full text-left";
      btn.addEventListener("click", () => loadTreesByCategory(catId, btn));
      categoriesContainer.appendChild(btn);
    });
  } catch (err) {
    console.error(err);
    catSpinner.textContent = "Failed to load categories";
  }
}

// === Load Trees Category
async function loadTreesByCategory(catId, btn) {
  document
    .querySelectorAll("#categories button")
    .forEach((b) => b.classList.remove("bg-green-700", "text-black"));
  btn.classList.add("bg-green-700", "text-black");

  plantsGrid.innerHTML = "";
  gridSpinner.classList.remove("hidden");
  gridTitle.textContent = "Loading Trees...";

  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/category/${catId}`
    );
    const data = await res.json();
    gridSpinner.classList.add("hidden");
    gridTitle.textContent = "Choose Your Trees";

    renderPlants(data.plants || data.data || []);
  } catch (err) {
    console.error(err);
    gridSpinner.classList.add("hidden");
    gridTitle.textContent = "Failed to load trees";
  }
}

// === Load All Plants
async function loadAllPlants() {
  plantsGrid.innerHTML = "";
  gridSpinner.classList.remove("hidden");
  gridTitle.textContent = "Loading all plants...";

  try {
    const res = await fetch("https://openapi.programming-hero.com/api/plants");
    const data = await res.json();
    gridSpinner.classList.add("hidden");
    gridTitle.textContent = "Choose Your Trees";

    renderPlants(data.plants || []);
  } catch (err) {
    console.error(err);
    gridSpinner.classList.add("hidden");
    gridTitle.textContent = "Failed to load plants";
  }
}

// === Render Plants
function renderPlants(plants) {
  plantsGrid.innerHTML = "";
  plants.forEach((tree) => {
    const card = document.createElement("div");
    card.className = "bg-white rounded shadow p-4 flex flex-col items-center";

    card.innerHTML = `
      <img src="${tree.image}" alt="${
      tree.name
    }" class="w-full h-40 object-cover rounded mb-2 cursor-pointer">
      <h3 class="font-bold text-lg mb-1 cursor-pointer">${tree.name}</h3>
      <p class="text-sm mb-1">${tree.description.slice(0, 60)}...</p>
      <p class="text-xs text-gray-500 mb-2">${tree.category}</p>
      <p class="font-semibold mb-2">$${tree.price}</p>
      <button class="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-600 add-cart">Add to Cart</button>
    `;

    card.querySelector("h3").addEventListener("click", () => showModal(tree));
    card.querySelector("img").addEventListener("click", () => showModal(tree));

    card
      .querySelector(".add-cart")
      .addEventListener("click", () => addToCart(tree));

    plantsGrid.appendChild(card);
  });
}

// === Show Modal
function showModal(tree) {
  modalContent.innerHTML = `
    <h2 class="text-xl font-bold mb-2">${tree.name}</h2>
    <img src="${tree.image}" alt="${
    tree.name
  }" class="w-full h-60 object-cover rounded mb-2">
    <p class="mb-2">${tree.description}</p>
    <p class="font-semibold mb-2">Category: ${tree.category}</p>
    <p class="font-bold">Price: $${tree.price}</p>
    <button class="mt-3 bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300" onclick='addToCart(${JSON.stringify(
      tree
    )})'>Add to Cart</button>
  `;
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

modalClose.addEventListener("click", () => {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
});

// === Cart Functions
function addToCart(tree) {
  
  const confirmAdd = confirm(`Do you want to add "${tree.name}" to the cart?`);
  if (!confirmAdd) return; 

  tree.price = parseFloat(tree.price);
  cart.push(tree);
  renderCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

function renderCart() {
  cartList.innerHTML = "";
  if (cart.length === 0) {
    cartList.innerHTML = '<li class="text-gray-500">No items yet.</li>';
    cartTotal.textContent = "$0.00";
    return;
  }

  let total = 0;
  cart.forEach((item, idx) => {
    total += item.price;
    const li = document.createElement("li");
    li.className = "flex justify-between items-center";
    li.innerHTML = `
      <span>${item.name}</span>
      <span class="flex items-center gap-2">
        $${item.price}
        <button class="text-red-500 font-bold remove-cart">❌</button>
      </span>
    `;
    li.querySelector(".remove-cart").addEventListener("click", () =>
      removeFromCart(idx)
    );
    cartList.appendChild(li);
  });

  cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Initialize
loadCategories();
loadAllPlants();
