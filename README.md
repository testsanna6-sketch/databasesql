# 🛍 ShopDaily — Final Project

A full-stack e-commerce web application built with PHP, MySQL, Bootstrap 5, and vanilla JavaScript.

---

## 📋 Project Requirements

| # | Requirement | Status |
|---|-------------|--------|
| 1 | Create template website | ✅ Done |
| 2 | Write API in PHP | ✅ Done |
| 3 | Connect API with MySQL database | ✅ Done |
| 4 | View, Create, Update, Delete, Search | ✅ Done |
| 5 | Show products on homepage | ✅ Done |
| 6 | View product detail by product_id | ✅ Done |
| 7 | Search product on homepage | ✅ Done |

---

## � Project Flow

```
User visits index.html
        │
        ▼
┌─────────────────────┐
│     Homepage        │  ← Browse products, search, filter by category, sort
│    index.html       │
└────────┬────────────┘
         │
         │  Click product card
         ▼
┌─────────────────────┐
│   Product Detail    │  ← View full info: image, price, stock, description
│    detail.html      │
└────────┬────────────┘
         │
         │  Click "Add to Cart"
         ▼
┌─────────────────────┐
│   Shopping Cart     │  ← Adjust quantity, remove items, see total + tax
│     cart.html       │
└────────┬────────────┘
         │
         │  Click "Proceed to Checkout"
         ▼
    (Checkout page — future feature)


── Admin Flow ──────────────────────────────────────────

Admin visits manage.html
        │
        ▼
┌─────────────────────┐
│    Admin Panel      │  ← View dashboard stats, search & filter products
│    manage.html      │
└────────┬────────────┘
         │
    ┌────┴─────┐
    ▼          ▼
 Create      Edit / Delete
 Product     Product
    │          │
    └────┬─────┘
         ▼
  PHP REST API (api/products.php)
         │
         ▼
   MySQL Database (shop_db)


── Data Flow ───────────────────────────────────────────

Browser (HTML/JS)
    │  fetch()
    ▼
api/products.php  ←→  api/config.php (DB connection)
    │
    ▼
MySQL — shop_db.products table
    │
    ▼
JSON response → rendered in browser
```

---

## �🗂 Project Structure

```
project/
├── api/
│   ├── config.php        → Database connection settings
│   ├── products.php      → REST API (GET, POST, PUT, DELETE)
│   ├── upload.php        → Image file upload handler
│   └── test.php          → Connection test (delete after setup)
├── css/
│   └── style.css         → Custom styles
├── js/
│   ├── main.js           → Product loading, search, pagination, sort
│   └── cart.js           → Shopping cart logic (localStorage)
├── uploads/              → Uploaded product images (auto-created)
├── index.html            → Homepage (products, search, filter, cart)
├── detail.html           → Product detail page
├── cart.html             → Shopping cart & order summary
├── manage.html           → Admin product management
├── database.sql          → MySQL database setup + sample data
└── README.md             → This file
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5, CSS3, Bootstrap 5.3, JavaScript (ES6) |
| Backend | PHP 8.2 |
| Database | MySQL (MariaDB) |
| Server | Apache (XAMPP) |
| Icons | Bootstrap Icons |
| Fonts | Google Fonts — Inter |

---

## ⚙️ Setup Instructions

### 1. Requirements
- XAMPP (Apache + MySQL + PHP)
- Browser (Chrome recommended)

### 2. Install
1. Copy the `project/` folder to:
   ```
   C:\xampp\htdocs\phptest\finalsql\project\
   ```

### 3. Import Database
1. Open `http://localhost/phpmyadmin`
2. Click **New** → type `shop_db` → click **Create**
3. Select `shop_db` → click **Import** tab
4. Choose `database.sql` → click **Import**

### 4. Configure Database (if needed)
Open `api/config.php` and update if your MySQL credentials differ:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');   // your MySQL username
define('DB_PASS', '');       // your MySQL password
define('DB_NAME', 'shop_db');
```
> Default XAMPP setup needs no changes.

### 5. Run
Open your browser and go to:
```
http://localhost/phptest/finalsql/project/index.html
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products.php` | Get all products |
| GET | `/api/products.php?search=phone` | Search by name/description |
| GET | `/api/products.php?category=Electronics` | Filter by category |
| GET | `/api/products.php?action=getOne&id=1` | Get single product by ID |
| POST | `/api/products.php` | Create new product |
| PUT | `/api/products.php?id=1` | Update product by ID |
| DELETE | `/api/products.php?id=1` | Delete product by ID |

---

## 🗄 Database Schema

**Table: `products`**

| Column | Type | Description |
|--------|------|-------------|
| id | INT, AUTO_INCREMENT, PK | Unique product ID |
| name | VARCHAR(255) | Product name |
| description | TEXT | Product description |
| price | DECIMAL(10,2) | Product price |
| image | VARCHAR(500) | Image URL or upload path |
| category | VARCHAR(100) | Electronics / Clothing / Books / Food / Games |
| stock | INT | Available quantity |
| created_at | TIMESTAMP | Date added (auto) |

---

## 📄 Pages

### `index.html` — Homepage
- Full hero section with animated stats
- Category banner strip (click to filter)
- Category filter pills + sort dropdown
- Product grid with pagination (8 per page)
- In Stock / Out of Stock badges
- Add to Cart button with live cart counter
- Newsletter section + full footer

### `detail.html` — Product Detail
- Full product image
- Name, price, category, stock badge
- Description and date added
- Back to shop + Edit product buttons

### `cart.html` — Shopping Cart
- Cart items list with image, name, price
- Quantity +/− controls
- Remove item & Clear all
- Order summary: subtotal, free shipping, 8% tax, total
- Proceed to Checkout button
- Cart data saved in `localStorage`

### `manage.html` — Admin Panel
- Dashboard stats: Total Products, Categories, In Stock, Out of Stock
- Category tab filter (All / Electronics / Clothing / Books / Food / Games)
- Live search within table
- Create / Edit / Delete products
- Image file upload (JPG, PNG, GIF, WEBP — max 5MB)
- Image preview before upload
- Input validation with error messages
- Delete confirmation modal with loading state

---

## ✨ Extra Features (Bonus)

- ✅ Pagination — 8 products per page
- ✅ Sort — Price Low/High, Name A-Z
- ✅ Stock badge — In Stock / Out of Stock
- ✅ Product count display
- ✅ Input validation with inline error messages
- ✅ Delete confirmation modal
- ✅ Loading spinners on save/delete
- ✅ Dashboard statistics
- ✅ Category tabs on admin page
- ✅ Shopping cart with localStorage
- ✅ Image file upload
- ✅ Responsive design (mobile friendly)

---

## 👤 Author

- **Course:** ITE303 / ITE30
- **Year:** 2026
- **Store Name:** ShopDaily

---

## 📸 Screenshots

| Page | URL |
|------|-----|
| Homepage | `http://localhost/phptest/finalsql/project/index.html` |
| Product Detail | `http://localhost/phptest/finalsql/project/detail.html?id=1` |
| Shopping Cart | `http://localhost/phptest/finalsql/project/cart.html` |
| Admin Manage | `http://localhost/phptest/finalsql/project/manage.html` |
| API Test | `http://localhost/phptest/finalsql/project/api/products.php` |
