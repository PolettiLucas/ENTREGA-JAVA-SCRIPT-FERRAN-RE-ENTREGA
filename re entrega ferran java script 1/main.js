
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartCount = document.getElementById('cart-count');
const cartButton = document.getElementById('cart-button');
const cartModal = document.getElementById('cart-modal');
const closeCartButton = document.getElementById('close-cart');
const productsContainer = document.getElementById('products');
const cartItems = document.getElementById('cart-items');
const totalPrice = document.getElementById('total-price');


fetch('products.json')
    .then(response => response.json())
    .then(data => {
        displayProducts(data);
        updateCart();
    })
    .catch(error => console.error('Error al cargar productos:', error));


function displayProducts(products) {
    productsContainer.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
            <button onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.image}')">Añadir al Carrito</button>
        `;
        productsContainer.appendChild(productCard);
    });
}


function addToCart(id, name, price, image) {
    const existingProduct = cart.find(product => product.id === id);
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}




function updateCart() {
    cartCount.textContent = cart.reduce((acc, product) => acc + product.quantity, 0);
    let total = 0;
    cartItems.innerHTML = '';  

    cart.forEach(product => {
        const listItem = document.createElement('li');
        
        
        listItem.innerHTML = `
            <div class="cart-item">
                <img src="${product.image}" alt="${product.name}" class="cart-item-image">
                <span class="cart-item-name">${product.name} (x${product.quantity})</span>
                <span class="cart-item-price">$${(product.price * product.quantity).toFixed(2)}</span>
                <button onclick="removeFromCart(${product.id})">-</button>
                <button onclick="increaseQuantity(${product.id})">+</button>
            </div>
        `;
        
        cartItems.appendChild(listItem);
        total += product.price * product.quantity;
    });
    
   
    totalPrice.textContent = total.toFixed(2);
}





function removeFromCart(id) {
    const product = cart.find(product => product.id === id);
    if (product) {
        if (product.quantity > 1) {
            product.quantity--;  
        } else {
            const productIndex = cart.findIndex(product => product.id === id);
            cart.splice(productIndex, 1);  
        }
        localStorage.setItem('cart', JSON.stringify(cart));  
        updateCart();  
    }
}




function increaseQuantity(id) {
    const product = cart.find(product => product.id === id);
    if (product) {
        product.quantity++;  
        localStorage.setItem('cart', JSON.stringify(cart));  
        updateCart();  
    }
}



cartButton.addEventListener('click', () => {
    cartModal.style.display = 'flex';
});

closeCartButton.addEventListener('click', () => {
    cartModal.style.display = 'none';
});
