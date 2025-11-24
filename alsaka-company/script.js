
const getStorage = (key, defaultValue = []) => JSON.parse(localStorage.getItem(key)) || defaultValue;
const setStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value));

let products = getStorage('products', [
    { id: 1, name: 'مجموعة أواني الطهي', price: 250, description: 'أواني عالية الجودة', category: 'مطبخ', stock: 10 },
    { id: 2, name: 'صناديق التخزين', price: 80, description: 'صناديق بلاستيكية شفافة', category: 'تخزين', stock: 15 },
    { id: 3, name: 'أدوات التنظيف', price: 150, description: 'مجموعة شاملة من أدوات التنظيف', category: 'تنظيف', stock: 20 }
]);

let cart = getStorage('cart', []);
let favorites = getStorage('favorites', []);
let users = getStorage('users', []);
let currentUser = getStorage('currentUser', null);
let adminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.querySelector('.loading-screen').style.display = 'none';
    }, 2000);

    setupEventListeners();
    renderHome();
    updateCartCount();
    updateUserMenu();

    if (AOS) {
        AOS.init({
            duration: 1000,
            once: true,
            easing: 'ease-in-out',
        });
    }
});

function setupEventListeners() {
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('hamburger').addEventListener('click', toggleMenu);
    document.getElementById('contactForm')?.addEventListener('submit', handleContact);
    document.getElementById('userLoginForm')?.addEventListener('submit', handleUserLogin);
    document.getElementById('userSignupForm')?.addEventListener('submit', handleUserSignup);
    document.getElementById('adminLoginForm')?.addEventListener('submit', handleAdminLogin);
    document.getElementById('addProductForm')?.addEventListener('submit', handleAddProduct);
    document.getElementById('productImage')?.addEventListener('change', handleImageUpload);
}

let productImageData = null;

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        productImageData = event.target.result;
        const preview = document.getElementById('imagePreview');
        preview.src = productImageData;
        preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const isDark = !document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.getElementById('themeToggle').textContent = isDark ? '🌙' : '☀️';
}

function navigateTo(page) {
    if (page === 'user-profile' && !currentUser) {
        navigateTo('user-login');
        return;
    }
    if (page === 'admin' && !adminLoggedIn) {
        navigateTo('admin-login');
        return;
    }

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const targetPage = document.getElementById(`${page}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
        window.scrollTo(0, 0);

        if (page === 'products') renderProducts();
        if (page === 'categories') renderCategories();
        if (page === 'cart') renderCart();
        if (page === 'favorites') renderFavorites();
        if (page === 'user-profile') renderUserProfile();
        if (page === 'admin') renderProductsTable();
    }
}

function toggleUserMenu() {
    const menu = document.getElementById('userMenu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function updateUserMenu() {
    const profileLink = document.getElementById('profileLink');
    const logoutLink = document.getElementById('logoutLink');
    if (currentUser) {
        profileLink.style.display = 'block';
        logoutLink.style.display = 'block';
    } else {
        profileLink.style.display = 'none';
        logoutLink.style.display = 'none';
    }
}

function renderHome() {

    renderHomeProducts();
}

function renderHomeCategories() {

}

function renderHomeCategories() {
    const categories = [
        { name: 'أدوات المطبخ', image: 'https://via.placeholder.com/150?text=مطبخ', value: 'مطبخ' },
        { name: 'أواني وتخزين', image: 'https://via.placeholder.com/150?text=تخزين', value: 'تخزين' },
        { name: 'أدوات التنظيف', image: 'https://via.placeholder.com/150?text=تنظيف', value: 'تنظيف' },
        { name: 'بلاستيك ومنوعات', image: 'https://via.placeholder.com/150?text=منوعات', value: 'منوعات' }
    ];

    const grid = document.getElementById('homeCategoriesGrid');
    grid.innerHTML = categories.map(cat => `
        <div class="product-card" onclick="filterByCategory('${cat.value}')">
            <div class="product-image">
                <img src="${cat.image}" alt="${cat.name}" style="max-width: 100%; height: auto; border-radius: 8px;">
            </div>
            <h3 class="product-name">${cat.name}</h3>
        </div>
    `).join('');
}

function renderHomeProducts() {
    const grid = document.getElementById('homeProductsGrid');
    grid.innerHTML = products.slice(0, 3).map(p => createProductCard(p)).join('');
}

function renderProducts() {
    const filtered = filterProductsList();
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = filtered.length ? filtered.map(p => createProductCard(p)).join('') : '<p>لا توجد منتجات</p>';
}

function filterProductsList() {
    const category = document.getElementById('categoryFilter')?.value || '';
    const search = document.getElementById('searchInput')?.value.toLowerCase() || '';
    return products.filter(p => (!category || p.category === category) && (!search || p.name.toLowerCase().includes(search)));
}

function filterProducts() {
    renderProducts();
}

function filterByCategory(category) {
    navigateTo('products');
    setTimeout(() => {
        document.getElementById('categoryFilter').value = category;
        filterProducts();
    }, 100);
}

function renderCategories() {
    const categories = [
        { name: 'أدوات المطبخ', icon: '🔪', value: 'مطبخ' },
        { name: 'أواني وتخزين', icon: '📦', value: 'تخزين' },
        { name: 'أدوات التنظيف', icon: '🧹', value: 'تنظيف' },
        { name: 'بلاستيك ومنوعات', icon: '🎁', value: 'منوعات' }
    ];

    const grid = document.getElementById('categoriesGrid');
    grid.innerHTML = categories.map(cat => `
        <div class="product-card" onclick="filterByCategory('${cat.value}')">
            <div class="product-image">${cat.icon}</div>
            <h3 class="product-name">${cat.name}</h3>
            <button class="btn-add-to-cart">عرض المنتجات</button>
        </div>
    `).join('');
}

function createProductCard(product) {
    const imageStyle = product.image ? `style="background-image: url('${product.image}'); background-size: cover; background-position: center;"` : '';
    return `
        <div class="product-card">
            <div class="product-image" ${imageStyle}>${!product.image ? '🛍️' : ''}</div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
        <div class="product-price">${product.price} جنيه</div>
            <button class="btn-add-to-cart" onclick="addToCart(${product.id})">أضف للعربة</button>
            <button class="btn-outline" style="width: 100%; margin-top: 0.5rem;" onclick="addToFavorites(${product.id})">♥ مفضلة</button>
        </div>
    `;
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
    }

    setStorage('cart', cart);
    updateCartCount();
    alert(`تم إضافة "${product.name}" إلى العربة`);
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

function renderCart() {
    const container = document.getElementById('cartItemsContainer');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 2rem;">العربة فارغة</p>';
        document.getElementById('totalItems').textContent = '0';
        document.getElementById('totalPrice').textContent = '0';
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <h3>${item.name}</h3>
                <p>${item.price} ريال</p>
            </div>
            <div class="item-quantity">
                <button onclick="decreaseQuantity(${item.id})">-</button>
                <input type="number" value="${item.quantity}" readonly>
                <button onclick="increaseQuantity(${item.id})">+</button>
            </div>
            <div>${item.price * item.quantity} جنيه</div>
            <button class="btn-add-to-cart" onclick="removeFromCart(${item.id})">حذف</button>
        </div>
    `).join('');

    updateCartSummary();
}

function increaseQuantity(id) {
    const item = cart.find(i => i.id === id);
    if (item) item.quantity += 1;
    setStorage('cart', cart);
    renderCart();
}

function decreaseQuantity(id) {
    const item = cart.find(i => i.id === id);
    if (item && item.quantity > 1) item.quantity -= 1;
    setStorage('cart', cart);
    renderCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    setStorage('cart', cart);
    updateCartCount();
    renderCart();
}

function updateCartSummary() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('totalItems').textContent = count;
    document.getElementById('totalPrice').textContent = total;
}

function clearCart() {
    if (confirm('هل تريد تفريغ العربة؟')) {
        cart = [];
        setStorage('cart', cart);
        updateCartCount();
        renderCart();
    }
}

function checkout() {
    if (cart.length === 0) {
        alert('العربة فارغة!');
        return;
    }
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`شكراً لك! تم استقبال طلبك بقيمة ${total} جنيه`);
    cart = [];
    setStorage('cart', cart);
    updateCartCount();
    renderCart();
    navigateTo('home');
}

function addToFavorites(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (!favorites.find(f => f.id === productId)) {
        favorites.push({ id: product.id, name: product.name, price: product.price });
        setStorage('favorites', favorites);
    alert(`تم إضافة "${product.name}" إلى المفضلة`);
    } else {
        alert('هذا المنتج موجود بالفعل في المفضلة');
    }
}

function renderFavorites() {
    const container = document.getElementById('favoritesContent');
    if (!container) return;

    if (favorites.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 2rem;">لا توجد منتجات مفضلة</p>';
        return;
    }

    container.innerHTML = `<div class="grid-3">${favorites.map(fav => `
        <div class="product-card">
            <div class="product-image">🛍️</div>
            <h3 class="product-name">${fav.name}</h3>
            <div class="product-price">${fav.price} ريال</div>
            <button class="btn-add-to-cart" onclick="addToCart(${fav.id})">أضف للعربة</button>
            <button class="btn-outline" style="width: 100%; margin-top: 0.5rem;" onclick="removeFavorite(${fav.id})">حذف</button>
        </div>
    `).join('')}</div>`;
}

function removeFavorite(id) {
    favorites = favorites.filter(f => f.id !== id);
    setStorage('favorites', favorites);
    renderFavorites();
}

function handleUserLogin(e) {
    e.preventDefault();
    const email = document.getElementById('user-login-email').value;
    const password = document.getElementById('user-login-password').value;

    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = user;
        setStorage('currentUser', currentUser);
        updateUserMenu();
        navigateTo('user-profile');
        alert(`مرحباً بك ${user.name}!`);
        e.target.reset();
    } else {
        alert('البريد أو كلمة المرور غير صحيحة!');
    }
}

function handleUserSignup(e) {
    e.preventDefault();
    const name = document.getElementById('user-signup-name').value;
    const email = document.getElementById('user-signup-email').value;
    const phone = document.getElementById('user-signup-phone').value;
    const password = document.getElementById('user-signup-password').value;
    const confirm = document.getElementById('user-signup-confirm').value;

    if (password !== confirm) {
        alert('كلمات المرور غير متطابقة!');
        return;
    }

    if (users.find(u => u.email === email)) {
        alert('هذا البريد مسجل بالفعل!');
        return;
    }

    users.push({
        id: Date.now(),
        name,
        email,
        phone,
        password,
        createdAt: new Date().toLocaleString('ar-SA')
    });

    setStorage('users', users);
    alert('تم إنشاء الحساب! الآن سجل دخول');
    navigateTo('user-login');
    e.target.reset();
}

function renderUserProfile() {
    const container = document.getElementById('userProfileInfo');
    if (!container || !currentUser) return;

    container.innerHTML = `
        <div class="profile-info-item">
            <span class="profile-info-label">الاسم:</span>
            <span>${currentUser.name}</span>
        </div>
        <div class="profile-info-item">
            <span class="profile-info-label">البريد:</span>
            <span>${currentUser.email}</span>
        </div>
        <div class="profile-info-item">
            <span class="profile-info-label">الهاتف:</span>
            <span>${currentUser.phone}</span>
        </div>
        <div class="profile-info-item">
            <span class="profile-info-label">تاريخ الإنشاء:</span>
            <span>${currentUser.createdAt}</span>
        </div>
    `;
}

function editProfile() {
    if (!currentUser) return;
    const newName = prompt('الاسم الجديد:', currentUser.name);
    if (newName === null) return;

    const newPhone = prompt('الهاتف الجديد:', currentUser.phone);
    if (newPhone === null) return;

    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex].name = newName;
        users[userIndex].phone = newPhone;
        currentUser.name = newName;
        currentUser.phone = newPhone;
        setStorage('users', users);
        setStorage('currentUser', currentUser);
        renderUserProfile();
        alert('تم التحديث بنجاح');
    }
}

function logoutUser() {
    if (confirm('هل تريد تسجيل الخروج؟')) {
        currentUser = null;
        localStorage.removeItem('currentUser');
        updateUserMenu();
        navigateTo('home');
        alert('تم تسجيل الخروج');
    }
}

function handleAdminLogin(e) {
    e.preventDefault();
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;

    if (username === 'admin' && password === '123456') {
        adminLoggedIn = true;
        localStorage.setItem('adminLoggedIn', 'true');
        navigateTo('admin');
        alert('مرحباً بك في لوحة التحكم');
        e.target.reset();
    } else {
        alert('بيانات الدخول غير صحيحة!');
    }
}

function logoutAdmin() {
    if (confirm('هل تريد تسجيل الخروج؟')) {
        adminLoggedIn = false;
        localStorage.removeItem('adminLoggedIn');
        navigateTo('home');
        alert('تم تسجيل الخروج');
    }
}

function handleAddProduct(e) {
    e.preventDefault();
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const description = document.getElementById('productDescription').value;
    const category = document.getElementById('productCategory').value;
    const stock = parseInt(document.getElementById('productStock').value);

    products.push({
        id: Date.now(),
        name,
        price,
        description,
        category,
        stock,
        image: productImageData || null
    });

    setStorage('products', products);
    productImageData = null;
    document.getElementById('imagePreview').style.display = 'none';
    renderProductsTable();
    renderHome();
    alert('تم إضافة المنتج بنجاح');
    e.target.reset();
}

function renderProductsTable() {
    const tbody = document.querySelector('#productsTable tbody');
    if (!tbody) return;

    tbody.innerHTML = products.map(p => `
        <tr>
            <td>${p.name}</td>
            <td>${p.price}</td>
            <td>${p.category}</td>
            <td>${p.stock}</td>
            <td>
                <button class="btn-add-to-cart" onclick="deleteProduct(${p.id})">حذف</button>
            </td>
        </tr>
    `).join('');
}

function deleteProduct(id) {
    if (confirm('هل تريد حذف هذا المنتج؟')) {
        products = products.filter(p => p.id !== id);
        setStorage('products', products);
        renderProductsTable();
        renderHome();
        alert('تم الحذف بنجاح');
    }
}

function handleContact(e) {
    e.preventDefault();
    alert('شكراً لتواصلك معنا! سنرد عليك قريباً');
    e.target.reset();
}

function toggleMenu() {
    const nav = document.querySelector('.nav');
    nav.style.display = nav.style.display === 'none' ? 'flex' : 'none';
}

