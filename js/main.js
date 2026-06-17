// ── Config ────────────────────────────────────────────────────
const API_URL    = 'http://localhost/phptest/finalsql/project/api/products.php';
const UPLOAD_URL = 'http://localhost/phptest/finalsql/project/api/upload.php';
const BASE_URL   = 'http://localhost/phptest/finalsql/project/';
const PER_PAGE   = 8; // products per page

// ── State ─────────────────────────────────────────────────────
let allProducts  = []; // full list for client-side pagination/sort
let currentPage  = 1;

// ── Cart count is handled by cart.js ─────────────────────────

// ── Toast ─────────────────────────────────────────────────────
function showToast(message, type = 'success') {
    const toastEl  = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');
    if (!toastEl || !toastMsg) return;
    toastMsg.textContent = message;
    toastEl.className = `toast align-items-center text-white border-0 bg-${type === 'success' ? 'success' : 'danger'}`;
    bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 3000 }).show();
}

// ── Helpers ───────────────────────────────────────────────────
function formatPrice(price) { return '$' + parseFloat(price).toFixed(2); }
function getParam(name)      { return new URLSearchParams(window.location.search).get(name); }

function stockBadge(stock) {
    return parseInt(stock) > 0
        ? `<span class="badge bg-success-subtle text-success border border-success-subtle">In Stock</span>`
        : `<span class="badge bg-danger-subtle text-danger border border-danger-subtle">Out of Stock</span>`;
}

// ── Build a product card ──────────────────────────────────────
function buildCard(p) {
    const imgSrc = p.image && p.image.startsWith('http')
        ? p.image : BASE_URL + (p.image || 'uploads/placeholder.png');
    return `
    <div class="col-6 col-md-4 col-lg-3" data-price="${p.price}" data-name="${p.name}">
        <div class="card product-card h-100 border-0 shadow-sm">
            <img src="${imgSrc}" class="card-img-top" alt="${p.name}"
                 onerror="this.src='https://placehold.co/400x300?text=No+Image'">
            <div class="card-body">
                <div class="cat-badge">${p.category}</div>
                <div class="product-name" title="${p.name}">${p.name}</div>
                <div class="d-flex justify-content-between align-items-center mt-1 mb-1">
                    <div class="product-price">${formatPrice(p.price)}</div>
                    ${stockBadge(p.stock)}
                </div>
                <div class="product-stock">Stock: ${p.stock}</div>
            </div>
            <div class="card-footer">
                <div class="d-flex gap-2">
                    <button class="btn-view flex-grow-1" onclick="location.href='detail.html?id=${p.id}'">
                        <i class="bi bi-eye me-1"></i> View
                    </button>
                    <button class="btn-cart" onclick="addToCart(${p.id}, '${p.name.replace(/'/g, "\\'")}', ${p.price}, '${imgSrc}')">
                        <i class="bi bi-bag-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>`;
}

// ── Render current page ───────────────────────────────────────
function renderPage(products, page) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    const start   = (page - 1) * PER_PAGE;
    const slice   = products.slice(start, start + PER_PAGE);

    if (slice.length === 0) {
        grid.innerHTML = `
            <div class="col-12 text-center text-muted py-5">
                <i class="bi bi-search" style="font-size:3rem;opacity:.3"></i>
                <p class="mt-2">No products found</p>
            </div>`;
    } else {
        grid.innerHTML = slice.map(buildCard).join('');
    }

    // Product count
    const totalEl = document.getElementById('product-total');
    if (totalEl) totalEl.textContent = `${products.length} product${products.length !== 1 ? 's' : ''} found`;

    renderPagination(products.length, page);
}

// ── Pagination ────────────────────────────────────────────────
function renderPagination(total, page) {
    const wrap = document.getElementById('pagination');
    if (!wrap) return;

    const pages = Math.ceil(total / PER_PAGE);
    if (pages <= 1) { wrap.innerHTML = ''; return; }

    let html = `<nav><ul class="pagination pagination-sm mb-0">`;

    html += `<li class="page-item ${page === 1 ? 'disabled' : ''}">
        <button class="page-link text-dark" onclick="goPage(${page - 1})">‹</button></li>`;

    for (let i = 1; i <= pages; i++) {
        html += `<li class="page-item ${i === page ? 'active' : ''}">
            <button class="page-link ${i === page ? 'bg-dark border-dark text-white' : 'text-dark'}"
                onclick="goPage(${i})">${i}</button></li>`;
    }

    html += `<li class="page-item ${page === pages ? 'disabled' : ''}">
        <button class="page-link text-dark" onclick="goPage(${page + 1})">›</button></li>`;

    html += `</ul></nav>`;
    wrap.innerHTML = html;
}

function goPage(page) {
    currentPage = page;
    renderPage(getSortedProducts(), page);
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// ── Sort helper ───────────────────────────────────────────────
function getSortedProducts() {
    const mode = document.getElementById('sort-select')?.value || '';
    const arr  = [...allProducts];
    if (mode === 'price-asc')  arr.sort((a, b) => a.price - b.price);
    if (mode === 'price-desc') arr.sort((a, b) => b.price - a.price);
    if (mode === 'name')       arr.sort((a, b) => a.name.localeCompare(b.name));
    return arr;
}

// ═══════════════════════════════════════════════════════════════
// INDEX PAGE
// ═══════════════════════════════════════════════════════════════
async function loadProducts(search = '', category = '') {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    grid.innerHTML = `<div class="col-12 text-center py-5">
        <div class="spinner-border text-dark" role="status"></div>
        <p class="mt-2 text-muted small">Loading...</p></div>`;

    const params = new URLSearchParams();
    if (search)   params.append('search', search);
    if (category) params.append('category', category);
    const url = params.toString() ? `${API_URL}?${params}` : API_URL;

    try {
        const res  = await fetch(url);
        const data = await res.json();

        allProducts  = Array.isArray(data) ? data : [];
        currentPage  = 1;
        renderPage(getSortedProducts(), 1);

    } catch (err) {
        grid.innerHTML = `<div class="col-12">
            <div class="alert alert-danger">
                Failed to load products. Make sure your PHP server is running.
            </div></div>`;
        console.error(err);
    }
}

function initSearch() {
    const form = document.getElementById('search-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const search   = document.getElementById('search-input').value.trim();
        const category = document.getElementById('category-filter').value;
        loadProducts(search, category);
    });

    const catFilter = document.getElementById('category-filter');
    if (catFilter) {
        catFilter.addEventListener('change', () => {
            loadProducts(document.getElementById('search-input').value.trim(), catFilter.value);
        });
    }

    // Category pills
    document.querySelectorAll('.cat-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            document.querySelectorAll('.cat-pill').forEach(p => {
                p.classList.remove('btn-dark', 'active');
                p.classList.add('btn-outline-dark');
            });
            pill.classList.add('btn-dark', 'active');
            pill.classList.remove('btn-outline-dark');

            const cat = pill.dataset.cat;
            if (catFilter) catFilter.value = cat;

            const countEl = document.getElementById('product-count');
            if (countEl) countEl.textContent = cat || 'All Products';

            loadProducts(document.getElementById('search-input').value.trim(), cat);
        });
    });

    // Sort
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            currentPage = 1;
            renderPage(getSortedProducts(), 1);
        });
    }
}

// ═══════════════════════════════════════════════════════════════
// DETAIL PAGE
// ═══════════════════════════════════════════════════════════════
async function loadProductDetail() {
    const container = document.getElementById('detail-container');
    if (!container) return;

    const id = getParam('id');
    if (!id) { container.innerHTML = '<div class="alert alert-warning">No product ID specified.</div>'; return; }

    try {
        const res = await fetch(`${API_URL}?action=getOne&id=${id}`);
        if (!res.ok) throw new Error('Not found');
        const p = await res.json();

        const imgSrc = p.image && p.image.startsWith('http') ? p.image : BASE_URL + (p.image || '');
        document.title = `ShopAll — ${p.name}`;

        container.innerHTML = `
            <nav aria-label="breadcrumb" class="mb-4">
                <ol class="breadcrumb small">
                    <li class="breadcrumb-item"><a href="index.html" class="text-dark">Home</a></li>
                    <li class="breadcrumb-item active text-muted">${p.name}</li>
                </ol>
            </nav>
            <div class="row g-5">
                <div class="col-md-5">
                    <div class="rounded-4 overflow-hidden border" style="background:#f5f5f5">
                        <img src="${imgSrc}" alt="${p.name}"
                             onerror="this.src='https://placehold.co/400x300?text=No+Image'"
                             class="w-100" style="max-height:440px;object-fit:cover">
                    </div>
                </div>
                <div class="col-md-7 d-flex flex-column justify-content-center">
                    <div class="cat-badge mb-2">${p.category}</div>
                    <h1 class="fw-black mb-2" style="letter-spacing:-1px">${p.name}</h1>
                    <div class="price-tag mb-2">${formatPrice(p.price)}</div>
                    <div class="mb-3">${stockBadge(p.stock)}</div>
                    <p class="text-muted mb-4" style="line-height:1.8">${p.description || 'No description available.'}</p>
                    <div class="d-flex gap-4 mb-4 small text-muted">
                        <span><i class="bi bi-box-seam me-1"></i><strong class="text-dark">${p.stock}</strong> in stock</span>
                        <span><i class="bi bi-calendar3 me-1"></i>Added ${new Date(p.created_at).toLocaleDateString()}</span>
                    </div>
                    <div class="d-flex gap-3">
                        <a href="index.html" class="btn btn-outline-dark rounded-pill px-4">
                            <i class="bi bi-arrow-left me-1"></i> Back
                        </a>
                        <a href="manage.html" class="btn btn-dark rounded-pill px-4">
                            <i class="bi bi-pencil me-1"></i> Edit Product
                        </a>
                    </div>
                </div>
            </div>`;

    } catch (err) {
        container.innerHTML = '<div class="alert alert-danger">Product not found.</div>';
    }
}

// ═══════════════════════════════════════════════════════════════
// MANAGE PAGE
// ═══════════════════════════════════════════════════════════════
let editingId    = null;
let bsModal      = null;
let bsDeleteModal = null;
let deleteTargetId   = null;

// ── Dashboard stats ───────────────────────────────────────────
async function loadDashboardStats() {
    try {
        const res  = await fetch(API_URL);
        const data = await res.json();
        if (!Array.isArray(data)) return;

        document.getElementById('stat-total').textContent      = data.length;
        document.getElementById('stat-categories').textContent = [...new Set(data.map(p => p.category))].length;
        document.getElementById('stat-instock').textContent    = data.filter(p => parseInt(p.stock) > 0).length;
        document.getElementById('stat-outstock').textContent   = data.filter(p => parseInt(p.stock) === 0).length;
    } catch (e) {}
}

// ── Table ─────────────────────────────────────────────────────
async function loadManageTable(search = '', category = '') {
    const tbody = document.getElementById('product-tbody');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-4">Loading...</td></tr>';

    const params = new URLSearchParams();
    if (search)   params.append('search', search);
    if (category) params.append('category', category);
    const url = params.toString() ? `${API_URL}?${params}` : API_URL;

    try {
        const res  = await fetch(url);
        const data = await res.json();

        // Update label and count
        const labelEl = document.getElementById('table-category-label');
        const countEl = document.getElementById('table-count');
        if (labelEl) labelEl.textContent = category || 'All Products';
        if (countEl) countEl.textContent = Array.isArray(data) ? data.length : 0;

        if (!Array.isArray(data) || data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-4">No products found</td></tr>';
            return;
        }

        tbody.innerHTML = data.map(p => {
            const imgSrc = p.image && p.image.startsWith('http') ? p.image : BASE_URL + (p.image || '');
            return `
            <tr>
                <td class="ps-4">${p.id}</td>
                <td><img src="${imgSrc}" alt="${p.name}"
                         onerror="this.src='https://placehold.co/400x300?text=No+Image'"></td>
                <td>${p.name}</td>
                <td><span class="badge bg-dark">${p.category}</span></td>
                <td class="fw-bold">${formatPrice(p.price)}</td>
                <td>${stockBadge(p.stock)} <span class="ms-1 small text-muted">(${p.stock})</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-dark me-1 rounded-pill"
                            onclick="openEditModal(${p.id})">
                        <i class="bi bi-pencil"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-outline-danger rounded-pill"
                            onclick="confirmDelete(${p.id}, '${p.name.replace(/'/g, "\\'")}')">
                        <i class="bi bi-trash"></i> Delete
                    </button>
                </td>
            </tr>`;
        }).join('');

    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-danger py-4">Failed to load products.</td></tr>';
    }
}

// ── Create modal ──────────────────────────────────────────────
function openCreateModal() {
    editingId = null;
    document.getElementById('modal-title').textContent = 'Add Product';
    document.getElementById('product-form').reset();
    clearFormErrors();
    document.getElementById('current-image-wrap').classList.add('d-none');
    document.getElementById('image-preview-wrap').classList.add('d-none');
    bsModal.show();
}

// ── Edit modal ────────────────────────────────────────────────
async function openEditModal(id) {
    editingId = id;
    document.getElementById('modal-title').textContent = 'Edit Product';
    clearFormErrors();

    try {
        const res = await fetch(`${API_URL}?action=getOne&id=${id}`);
        const p   = await res.json();

        document.getElementById('f-name').value        = p.name;
        document.getElementById('f-description').value = p.description || '';
        document.getElementById('f-price').value       = p.price;
        document.getElementById('f-category').value    = p.category;
        document.getElementById('f-stock').value       = p.stock;
        document.getElementById('f-image').value       = '';
        document.getElementById('image-preview-wrap').classList.add('d-none');

        const wrap    = document.getElementById('current-image-wrap');
        const preview = document.getElementById('current-image-preview');
        if (p.image) {
            preview.src = p.image.startsWith('http') ? p.image : BASE_URL + p.image;
            wrap.classList.remove('d-none');
        } else {
            wrap.classList.add('d-none');
        }

        bsModal.show();
    } catch (err) {
        showToast('Failed to load product', 'error');
    }
}

// ── Input validation ──────────────────────────────────────────
function validateForm() {
    clearFormErrors();
    let valid = true;

    const name  = document.getElementById('f-name').value.trim();
    const price = parseFloat(document.getElementById('f-price').value);
    const stock = parseInt(document.getElementById('f-stock').value);
    const cat   = document.getElementById('f-category').value;

    if (!name) {
        setError('f-name', 'Product name is required.');
        valid = false;
    }
    if (!document.getElementById('f-price').value || isNaN(price) || price < 0) {
        setError('f-price', 'Price must be a positive number.');
        valid = false;
    }
    if (!cat) {
        setError('f-category', 'Please select a category.');
        valid = false;
    }
    if (isNaN(stock) || stock < 0) {
        setError('f-stock', 'Stock cannot be negative.');
        valid = false;
    }

    return valid;
}

function setError(fieldId, message) {
    const field = document.getElementById(fieldId);
    field.classList.add('is-invalid');
    let fb = field.nextElementSibling;
    if (!fb || !fb.classList.contains('invalid-feedback')) {
        fb = document.createElement('div');
        fb.className = 'invalid-feedback';
        field.after(fb);
    }
    fb.textContent = message;
}

function clearFormErrors() {
    document.querySelectorAll('#product-form .is-invalid').forEach(el => {
        el.classList.remove('is-invalid');
    });
}

// ── Submit (create / update) ──────────────────────────────────
async function submitProduct() {
    if (!validateForm()) return;

    const saveBtn     = document.querySelector('#productModal .btn-dark');
    const saveBtnText = document.getElementById('save-btn-text');
    const saveSpinner = document.getElementById('save-spinner');

    // Show loading state
    saveBtn.disabled = true;
    saveBtnText.textContent = 'Saving...';
    saveSpinner.classList.remove('d-none');

    // Upload image if selected
    let imagePath = '';
    const file = document.getElementById('f-image').files[0];
    if (file) {
        try {
            const formData = new FormData();
            formData.append('image', file);
            const uploadRes  = await fetch(UPLOAD_URL, { method: 'POST', body: formData });
            const uploadData = await uploadRes.json();
            if (!uploadRes.ok) {
                showToast(uploadData.error || 'Image upload failed', 'error');
                resetSaveBtn(saveBtn, saveBtnText, saveSpinner);
                return;
            }
            imagePath = uploadData.path;
        } catch (err) {
            showToast('Image upload failed', 'error');
            resetSaveBtn(saveBtn, saveBtnText, saveSpinner);
            return;
        }
    }

    const body = {
        name:        document.getElementById('f-name').value.trim(),
        description: document.getElementById('f-description').value.trim(),
        price:       document.getElementById('f-price').value,
        image:       imagePath,
        category:    document.getElementById('f-category').value,
        stock:       document.getElementById('f-stock').value || 0,
    };

    const isEdit = editingId !== null;
    const url    = isEdit ? `${API_URL}?id=${editingId}` : API_URL;
    const method = isEdit ? 'PUT' : 'POST';

    try {
        const res  = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const data = await res.json();

        if (res.ok) {
            showToast(isEdit ? 'Product updated!' : 'Product created!', 'success');
            bsModal.hide();
            loadManageTable();
            loadDashboardStats();
        } else {
            showToast(data.error || 'Something went wrong', 'error');
        }
    } catch (err) {
        showToast('Request failed', 'error');
    } finally {
        resetSaveBtn(saveBtn, saveBtnText, saveSpinner);
    }
}

function resetSaveBtn(btn, textEl, spinnerEl) {
    btn.disabled = false;
    textEl.textContent = 'Save';
    spinnerEl.classList.add('d-none');
}

// ── Delete with modal ─────────────────────────────────────────
function confirmDelete(id, name) {
    deleteTargetId = id;
    document.getElementById('delete-product-name').textContent = `"${name}"`;
    bsDeleteModal.show();
}

async function executeDelete() {
    if (!deleteTargetId) return;

    const btn     = document.getElementById('confirm-delete-btn');
    const btnText = document.getElementById('delete-btn-text');
    const spinner = document.getElementById('delete-spinner');

    btn.disabled        = true;
    btnText.textContent = 'Deleting...';
    spinner.classList.remove('d-none');

    try {
        const res  = await fetch(`${API_URL}?id=${deleteTargetId}`, { method: 'DELETE' });
        const data = await res.json();

        if (res.ok) {
            showToast('Product deleted', 'success');
            bsDeleteModal.hide();
            loadManageTable();
            loadDashboardStats();
        } else {
            showToast(data.error || 'Delete failed', 'error');
        }
    } catch (err) {
        showToast('Request failed', 'error');
    } finally {
        btn.disabled        = false;
        btnText.textContent = 'Delete';
        spinner.classList.add('d-none');
        deleteTargetId = null;
    }
}

// ── Page Init ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

    // Index page
    if (document.getElementById('product-grid')) {
        loadProducts();
        initSearch();
    }

    // Detail page
    if (document.getElementById('detail-container')) {
        loadProductDetail();
    }

    // Manage page
    if (document.getElementById('product-tbody')) {
        bsModal       = new bootstrap.Modal(document.getElementById('productModal'));
        bsDeleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

        loadManageTable();
        loadDashboardStats();

        // Live search
        const manageSearch = document.getElementById('manage-search');
        if (manageSearch) {
            manageSearch.addEventListener('input', (e) => {
                const activeCat = document.querySelector('.manage-tab.active')?.dataset.cat || '';
                loadManageTable(e.target.value.trim(), activeCat);
            });
        }

        // Category tabs
        document.querySelectorAll('.manage-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.manage-tab').forEach(t => {
                    t.classList.remove('btn-dark', 'active');
                    t.classList.add('btn-outline-dark');
                });
                tab.classList.add('btn-dark', 'active');
                tab.classList.remove('btn-outline-dark');

                const cat    = tab.dataset.cat;
                const search = document.getElementById('manage-search')?.value.trim() || '';
                loadManageTable(search, cat);
            });
        });

        // Confirm delete button
        const confirmBtn = document.getElementById('confirm-delete-btn');
        if (confirmBtn) confirmBtn.addEventListener('click', executeDelete);

        // Image file preview
        const fileInput = document.getElementById('f-image');
        if (fileInput) {
            fileInput.addEventListener('change', () => {
                const file = fileInput.files[0];
                const wrap = document.getElementById('image-preview-wrap');
                const img  = document.getElementById('image-preview');
                if (file) { img.src = URL.createObjectURL(file); wrap.classList.remove('d-none'); }
                else       { wrap.classList.add('d-none'); }
            });
        }

        // Clear validation on input
        document.querySelectorAll('#product-form input, #product-form select, #product-form textarea').forEach(el => {
            el.addEventListener('input', () => el.classList.remove('is-invalid'));
        });
    }
});
