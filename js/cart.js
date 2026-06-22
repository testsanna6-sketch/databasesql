// ── Cart Storage ──────────────────────────────────────────────
function getCart() {
    return JSON.parse(localStorage.getItem('shopdaily_cart') || '[]');
}

function saveCart(cart) {
    localStorage.setItem('shopdaily_cart', JSON.stringify(cart));
}

// ── Add to cart (called from product cards) ───────────────────
function addToCart(id, name, price, image) {
    const cart = getCart();
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({ id, name, price: parseFloat(price), image, qty: 1 });
    }

    saveCart(cart);
    updateCartBadge();
    showToast(`🛍 "${name}" added to cart!`, 'success');
}

// ── Update navbar cart badge ──────────────────────────────────
function updateCartBadge() {
    const cart  = getCart();
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    const badge = document.getElementById('cart-badge');
    if (!badge) return;

    if (total > 0) {
        badge.textContent = total;
        badge.classList.remove('d-none');
        badge.style.transform = 'scale(1.4)';
        setTimeout(() => badge.style.transform = 'scale(1)', 200);
    } else {
        badge.classList.add('d-none');
    }
}

// ── Render cart page ──────────────────────────────────────────
function renderCartPage() {
    const cart      = getCart();
    const container = document.getElementById('cart-items');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5 text-muted">
                <i class="bi bi-bag-x" style="font-size:3rem;opacity:.3"></i>
                <p class="mt-3 fw-semibold">Your cart is empty</p>
                <a href="index.html" class="btn btn-dark rounded-pill px-4 mt-2">Browse Products</a>
            </div>`;
        updateSummary([]);
        document.getElementById('cart-item-count').textContent = '0 items in your cart';
        return;
    }

    const BASE = 'https://shopdaily.great-site.net/project/';

    container.innerHTML = cart.map(item => {
        const imgSrc = item.image && item.image.startsWith('http')
            ? item.image : BASE + (item.image || '');
        return `
        <div class="cart-item d-flex align-items-center gap-3 py-3 border-bottom" id="item-${item.id}">
            <img src="${imgSrc}" alt="${item.name}"
                 onerror="this.src='https://placehold.co/80x80?text=No+Image'"
                 class="rounded-3" style="width:80px;height:70px;object-fit:cover;flex-shrink:0">
            <div class="flex-grow-1">
                <div class="fw-bold">${item.name}</div>
                <div class="text-muted small">$${item.price.toFixed(2)} each</div>
                <div class="d-flex align-items-center gap-2 mt-2">
                    <button class="qty-btn" onclick="changeQty(${item.id}, -1)"><i class="bi bi-dash"></i></button>
                    <span class="fw-bold px-2" id="qty-${item.id}">${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty(${item.id}, 1)"><i class="bi bi-plus"></i></button>
                </div>
            </div>
            <div class="text-end">
                <div class="fw-black fs-6" id="line-${item.id}">$${(item.price * item.qty).toFixed(2)}</div>
                <button class="btn btn-sm text-danger mt-1 p-0" onclick="removeItem(${item.id})" title="Remove">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>`;
    }).join('');

    const totalItems = cart.reduce((s, i) => s + i.qty, 0);
    document.getElementById('cart-item-count').textContent =
        `${totalItems} item${totalItems !== 1 ? 's' : ''} in your cart`;

    updateSummary(cart);
}

// ── Update order summary ──────────────────────────────────────
function updateSummary(cart) {
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const tax      = subtotal * 0.08;
    const total    = subtotal + tax;
    const count    = cart.reduce((s, i) => s + i.qty, 0);

    document.getElementById('sum-count').textContent    = count;
    document.getElementById('sum-subtotal').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('sum-tax').textContent      = '$' + tax.toFixed(2);
    document.getElementById('sum-total').textContent    = '$' + total.toFixed(2);
}

// ── Change quantity ───────────────────────────────────────────
function changeQty(id, delta) {
    const cart = getCart();
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) { removeItem(id); return; }

    saveCart(cart);
    document.getElementById(`qty-${id}`).textContent   = item.qty;
    document.getElementById(`line-${id}`).textContent  = '$' + (item.price * item.qty).toFixed(2);
    const totalItems = cart.reduce((s, i) => s + i.qty, 0);
    document.getElementById('cart-item-count').textContent =
        `${totalItems} item${totalItems !== 1 ? 's' : ''} in your cart`;
    updateSummary(cart);
    updateCartBadge();
}

// ── Remove item ───────────────────────────────────────────────
function removeItem(id) {
    let cart = getCart();
    cart     = cart.filter(i => i.id !== id);
    saveCart(cart);
    renderCartPage();
    updateCartBadge();
}

// ── Clear all ─────────────────────────────────────────────────
function clearCart() {
    if (!confirm('Clear all items from cart?')) return;
    saveCart([]);
    renderCartPage();
    updateCartBadge();
}

// ── Checkout ──────────────────────────────────────────────────
function proceedCheckout() {
    const cart = getCart();
    if (cart.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }
    alert(`✅ Order placed!\n\nTotal: ${document.getElementById('sum-total').textContent}\n\nThank you for shopping at ShopDaily!`);
    saveCart([]);
    updateCartBadge();
    renderCartPage();
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    if (document.getElementById('cart-items')) {
        renderCartPage();
    }
});
