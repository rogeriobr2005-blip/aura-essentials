/**
 * AURA | Essentials & Design - Core Engine
 */

const products = [
    { 
        id: 1, 
        name: "Vaso de Cerâmica Bone", 
        price: 320, 
        description: "Peça esculpida à mão com acabamento fosco e textura orgânica, ideal para composições minimalistas e arranjos secos.", 
        img: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=800" // Imagem de vaso artesanal fosco
    },
    { 
        id: 2, 
        name: "Cadeira Archive Oak", 
        price: 1890, 
        description: "Design ergonômico em carvalho maciço com inspiração escandinava. Uma peça que une conforto e longevidade.", 
        img: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=800" 
    },
    { 
        id: 3, 
        name: "Luminária Noam Brass", 
        price: 950, 
        description: "Luminária de mesa em latão polido. Sua cúpula geométrica proporciona uma luz difusa e acolhedora para escritórios e livings.", 
        img: "https://images.pexels.com/photos/1123262/pexels-photo-1123262.jpeg?auto=compress&cs=tinysrgb&w=800" 
    },
    { 
        id: 4, 
        name: "Mesa de Apoio Nordic", 
        price: 1200, 
        description: "Minimalismo funcional com estrutura em aço carbono e tampo de madeira tratada.", 
        img: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=800" 
    },
    { 
        id: 5, 
        name: "Bowl de Mármore", 
        price: 180, 
        description: "Mármore branco extraído de jazidas selecionadas, com veios naturais únicos em cada peça polida.", 
        img: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800" 
    },
    { 
        id: 6, 
        name: "Espelho Horizon", 
        price: 760, 
        description: "Espelho circular com borda infinita e acabamento bisotado, projetado para ampliar a luz natural.", 
        img: "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=800" 
    }
];

let cart = JSON.parse(localStorage.getItem("aura_luxury_cart")) || [];
const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

// 1. Cursor Engine
function initCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (!cursor || !follower) return;

    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        requestAnimationFrame(() => {
            cursor.style.left = `${x}px`;
            cursor.style.top = `${y}px`;
            follower.style.left = `${x}px`;
            follower.style.top = `${y}px`;
        });
    });

    const interactives = document.querySelectorAll('a, button, .image-box, .method-option, select, input');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-active'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));
    });
}

// 2. Render Engine
function renderProducts(data = products) {
    const grid = document.getElementById("products");
    if(!grid) return;
    
    const countDisplay = document.getElementById("product-results-count");
    countDisplay.innerText = `${data.length} ${data.length === 1 ? 'item encontrado' : 'itens encontrados'}`;
    
    grid.innerHTML = data.map(p => `
        <article class="card">
            <div class="image-box" onclick="openModal(${p.id})">
                <img src="${p.img}" alt="${p.name}" loading="lazy">
                <div class="view-more">Ver detalhes</div>
            </div>
            <div class="card-details">
                <div>
                    <h3 class="card-name">${p.name}</h3>
                    <p class="card-price">${formatter.format(p.price)}</p>
                </div>
            </div>
            <button class="quick-add" onclick="addToCart(${p.id})">Adicionar à Sacola</button>
        </article>
    `).join("");

    initObserver();
}

// 3. Modal Engine
function openModal(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    document.getElementById("modal-img").src = product.img;
    document.getElementById("modal-name").innerText = product.name;
    document.getElementById("modal-price").innerText = formatter.format(product.price);
    document.getElementById("modal-desc").innerText = product.description;
    
    // Configura o botão do modal para adicionar ao carrinho
    const modalBtn = document.getElementById("modal-add-btn");
    modalBtn.onclick = () => {
        addToCart(product.id);
        closeModal();
    };

    document.getElementById("product-modal").classList.add("active");
    document.body.style.overflow = "hidden"; // Trava o scroll
}

function closeModal() {
    document.getElementById("product-modal").classList.remove("active");
    if (!document.getElementById("cart").classList.contains("active")) {
        document.body.style.overflow = "auto";
    }
}

// 4. Cart Engine
function addToCart(id) {
    const existingItem = cart.find(p => p.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        const product = products.find(p => p.id === id);
        cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
    notify("Item adicionado à sacola.");
}

function updateCartUI() {
    localStorage.setItem("aura_luxury_cart", JSON.stringify(cart));
    const count = cart.reduce((acc, curr) => acc + curr.quantity, 0);
    const cartCountEl = document.getElementById("cart-count");
    if(cartCountEl) cartCountEl.innerText = count;
    
    const list = document.getElementById("cart-items-list");
    const totalVal = document.getElementById("cart-total-value");
    if(!list || !totalVal) return;

    if (cart.length === 0) {
        list.innerHTML = `<p style="margin-top:40px; font-weight:200; color:#888; text-align:center">Sua sacola está vazia.</p>`;
        totalVal.innerText = formatter.format(0);
        return;
    }

    list.innerHTML = cart.map(item => `
    <div class="cart-item">
        <img src="${item.img}" alt="${item.name}">
        <div class="cart-item-info">
            <p>${item.name}</p>
            <small style="color:#888">${formatter.format(item.price)}</small>
            <div class="qty-control">
                <button onclick="changeQty(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQty(${item.id}, 1)">+</button>
            </div>
        </div>
        <button onclick="removeItem(${item.id})" class="remove-btn" style="opacity: 0.4; cursor: pointer; border:none; background:none; font-size: 1.2rem;">&times;</button>
    </div>
`).join("");

    const total = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
    totalVal.innerText = formatter.format(total);
}

// 5. Checkout Engine
function proceedToCheckout() {
    if (cart.length === 0) {
        notify("Sua sacola está vazia.");
        return;
    }
    // Redireciona para a nova página
    window.location.href = "pedido.html";
}

// Restante das funções (Observer, Search, UI)
function initObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.card').forEach(card => observer.observe(card));
}

function changeQty(id, delta) {
    const item = cart.find(p => p.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) return removeItem(id);
        updateCartUI();
    }
}

function removeItem(id) {
    cart = cart.filter(i => i.id !== id);
    updateCartUI();
}

function toggleCart() {
    const cartEl = document.getElementById("cart");
    const overlayEl = document.getElementById("overlay");
    cartEl.classList.toggle("active");
    overlayEl.classList.toggle("active");
    document.body.style.overflow = cartEl.classList.contains("active") ? "hidden" : "auto";
}

function notify(msg) {
    const toast = document.getElementById("notification");
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
}

function scrollToProducts() {
    const target = document.getElementById('shop').offsetTop - 100;
    window.scrollTo({ top: target, behavior: 'smooth' });
}

function sortProducts(val) {
    let sorted = [...products];
    if (val === "price-asc") sorted.sort((a,b) => a.price - b.price);
    else if (val === "price-desc") sorted.sort((a,b) => b.price - a.price);
    else if (val === "name") sorted.sort((a,b) => a.name.localeCompare(b.name));
    renderProducts(sorted);
}

// Inicialização Global
document.addEventListener("DOMContentLoaded", () => {
    initCursor();
    renderProducts();
    updateCartUI();

    // Evento de Busca
    const searchInput = document.getElementById("search");
    if(searchInput) {
        searchInput.addEventListener("input", (e) => {
            const val = e.target.value.toLowerCase();
            const filtered = products.filter(p => p.name.toLowerCase().includes(val));
            renderProducts(filtered);
        });
    }
    
    // Efeito do Header no Scroll
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if(header) header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Seleção robusta do botão de checkout
    const checkoutBtn = document.querySelector(".btn-checkout");
    if(checkoutBtn) {
        checkoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            proceedToCheckout();
        });
    }

    // Tecla ESC para fechar tudo
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") {
            closeModal();
            const cart = document.getElementById("cart");
            if(cart && cart.classList.contains("active")) toggleCart();
        }
    });
});