// Данные товаров (локальные изображения)
const products = [
    {
        id: 1,
        name: 'Маргарита',
        description: 'Сыр моцарелла, томатный соус, базилик',
        price: 450,
        category: 'pizza',
        image: 'images/pizza-margherita.jpg'
    },
    {
        id: 2,
        name: 'Пепперони',
        description: 'Острая колбаса пепперони, сыр, томатный соус',
        price: 520,
        category: 'pizza',
        image: 'images/pizza-pepperoni.jpg'
    },
    {
        id: 3,
        name: 'Чизбургер',
        description: 'Котлета из говядины, сыр чеддер, салат, помидор, соус',
        price: 380,
        category: 'burger',
        image: 'images/cheeseburger.jpg'
    },
    {
        id: 4,
        name: 'Бургер с беконом',
        description: 'Котлета, бекон, сыр, карамелизированный лук',
        price: 450,
        category: 'burger',
        image: 'images/bacon-burger.jpg'
    },
    {
        id: 5,
        name: 'Додстер',
        description: 'Куриное филе, сыр, соус, свежие овощи',
        price: 250,
        category: 'zakus',   
        image: 'images/dodster.jpg'
    },
    {
        id: 6,
        name: 'Дэнвич',
        description: 'Котлета из говядины, сыр, бекон, соус BBQ',
        price: 330,
        category: 'zakus',
        image: 'images/denvich.jpg'
    },
    {
        id: 7,
        name: 'Кола',
        description: 'Напиток прохладительный 0.5л',
        price: 120,
        category: 'drinks',
        image: 'images/cola.jpg'
    },
    {
        id: 8,
        name: 'Сок апельсиновый',
        description: 'Свежевыжатый 0.3л',
        price: 180,
        category: 'drinks',
        image: 'images/orange-juice.jpg'
    }
];

// Корзина
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM элементы
const productsGrid = document.getElementById('productsGrid');
const cartCount = document.getElementById('cartCount');
const cartIcon = document.getElementById('cartIcon');
const cartModal = document.getElementById('cartModal');
const cartOverlay = document.getElementById('cartOverlay');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartItemsDiv = document.getElementById('cartItems');
const cartTotalPrice = document.getElementById('cartTotalPrice');
const clearCartBtn = document.getElementById('clearCartBtn');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const checkoutOverlay = document.getElementById('checkoutOverlay');
const closeCheckoutBtn = document.getElementById('closeCheckoutBtn');
const checkoutForm = document.getElementById('checkoutForm');
const categoryFilter = document.getElementById('categoryFilter');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

let currentCategory = 'all';

// Подсветка активного пункта меню при прокрутке
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Обработка формы контактов
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    showToast('Сообщение отправлено! Мы свяжемся с вами.');
    this.reset();
});

// Функции корзины
function renderProducts() {
    const filtered = currentCategory === 'all'
        ? products
        : products.filter(p => p.category === currentCategory);

    productsGrid.innerHTML = filtered.map(product => `
        <div class="product-card" data-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" class="product-card__image">
            <div class="product-card__body">
                <h3 class="product-card__title">${product.name}</h3>
                <p class="product-card__description">${product.description}</p>
                <div class="product-card__footer">
                    <span class="product-card__price">${product.price} ₽</span>
                    <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function renderCart() {
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p style="text-align:center">Корзина пуста</p>';
        cartTotalPrice.textContent = '0 ₽';
        return;
    }

    cartItemsDiv.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="cart-item__image">
            <div class="cart-item__info">
                <div class="cart-item__title">${item.name}</div>
                <div class="cart-item__price">${item.price} ₽</div>
            </div>
            <div class="cart-item__controls">
                <button class="cart-item__decrement" data-id="${item.id}">-</button>
                <span class="cart-item__quantity">${item.quantity}</span>
                <button class="cart-item__increment" data-id="${item.id}">+</button>
                <button class="cart-item__remove" data-id="${item.id}"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotalPrice.textContent = total + ' ₽';
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

function addToCart(productId, productName, productPrice, productImage) {
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
    }
    saveCart();
    showToast('Товар добавлен в корзину');
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

// Обработчики событий
cartIcon.addEventListener('click', () => {
    renderCart();
    cartModal.classList.add('show');
});

closeCartBtn.addEventListener('click', () => cartModal.classList.remove('show'));
cartOverlay.addEventListener('click', () => cartModal.classList.remove('show'));

clearCartBtn.addEventListener('click', () => {
    if (cart.length === 0) return;
    cart = [];
    saveCart();
    renderCart();
    showToast('Корзина очищена');
});

cartItemsDiv.addEventListener('click', (e) => {
    const target = e.target.closest('button');
    if (!target) return;

    const itemDiv = target.closest('.cart-item');
    if (!itemDiv) return;

    const id = parseInt(itemDiv.dataset.id);
    const cartItem = cart.find(item => item.id === id);
    if (!cartItem) return;

    if (target.classList.contains('cart-item__increment')) {
        cartItem.quantity += 1;
        saveCart();
        renderCart();
    } else if (target.classList.contains('cart-item__decrement')) {
        if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
        } else {
            cart = cart.filter(item => item.id !== id);
        }
        saveCart();
        renderCart();
    } else if (target.classList.contains('cart-item__remove')) {
        cart = cart.filter(item => item.id !== id);
        saveCart();
        renderCart();
    }
});

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        showToast('Корзина пуста');
        return;
    }
    cartModal.classList.remove('show');
    checkoutModal.classList.add('show');
});

closeCheckoutBtn.addEventListener('click', () => checkoutModal.classList.remove('show'));
checkoutOverlay.addEventListener('click', () => checkoutModal.classList.remove('show'));

checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Заказ оформлен! Спасибо за покупку');
    cart = [];
    saveCart();
    checkoutModal.classList.remove('show');
    checkoutForm.reset();
});

categoryFilter.addEventListener('click', (e) => {
    const btn = e.target.closest('.category-btn');
    if (!btn) return;

    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    currentCategory = btn.dataset.category;
    renderProducts();
});

productsGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-cart');
    if (!btn) return;

    const id = parseInt(btn.dataset.id);
    const name = btn.dataset.name;
    const price = parseInt(btn.dataset.price);
    const product = products.find(p => p.id === id);
    addToCart(id, name, price, product.image);
});

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('show');
});

mobileMenu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        mobileMenu.classList.remove('show');
    }
});

// Инициализация
renderProducts();
updateCartCount();