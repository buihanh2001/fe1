window.onload = function () {
    fetch('https://seven-yaks-find.loca.lt/api/cars')
        .then(response => {
            console.log("fetch response:", response); // Log toàn bộ response
            if (!response.ok) {
                throw new Error('Lỗi mạng: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log("fetch data:", data); // Log dữ liệu thô từ API
            products = data.map(car => ({
                ...car,
                image: defaultImage,
                brand: getBrandFromName(car.name)
            }));
            console.log("mapped products:", products); // Log sau khi map
            populateBrandFilter();
            applyFilters();
        })
        .catch(error => {
            console.error('Lỗi fetch:', error);
            document.querySelector('.product-container').innerHTML = '<p>Không thể tải dữ liệu sản phẩm.</p>';
        });

    document.getElementById('brand-filter').addEventListener('change', () => {
        currentPage = 1;
        applyFilters();
    });
    document.getElementById('price-filter').addEventListener('change', () => {
        currentPage = 1;
        applyFilters();
    });
};


let currentPage = 1;
const itemsPerPage = 12;
let products = [];
const defaultImage = "https://toyotahoankiem.com.vn/Uploads/images/cars/Altis-2020.png";

function renderProducts(productList) {
    console.log("renderProducts called with:", productList);
    const container = document.querySelector('.product-container');
    container.innerHTML = '';

    if (productList.length === 0) {
        container.innerHTML = '<p>Không tìm thấy sản phẩm nào.</p>';
        document.getElementById('pagination').innerHTML = '';
        return;
    }

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedProducts = productList.slice(start, end);

    paginatedProducts.forEach(product => {
        console.log("Rendering product:", product);
        const item = document.createElement('div');
        item.className = 'product-item';
        item.innerHTML = `
            <img src="${product.image || defaultImage}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Giá: ${product.price.toLocaleString('vi-VN')} VND</p>
        `;
        item.addEventListener('click', () => {
            window.location.href = `chitietsanpham.html?id=${product.id}`;
        });
        container.appendChild(item);
    });

    renderPagination(productList.length);
}

function renderPagination(totalItems) {
    console.log("renderPagination called with:", totalItems);
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = (i === currentPage) ? 'active' : '';
        btn.addEventListener('click', () => {
            currentPage = i;
            applyFilters();
            window.scrollTo(0, 0);
        });
        paginationContainer.appendChild(btn);
    }
}

function applyFilters() {
    console.log("applyFilters called");
    const brandFilter = document.getElementById('brand-filter').value;
    const priceFilter = document.getElementById('price-filter').value;

    let filteredProducts = [...products];

    if (brandFilter) {
        filteredProducts = filteredProducts.filter(p => getBrandFromName(p.name) === brandFilter);
    }

    if (priceFilter === 'asc') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (priceFilter === 'desc') {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    renderProducts(filteredProducts);
}

function populateBrandFilter() {
    console.log("populateBrandFilter called");
    const brandSelect = document.getElementById('brand-filter');

    while (brandSelect.options.length > 1) {
        brandSelect.remove(1);
    }

    if (products.length > 0) {
        const brands = [...new Set(products.map(p => getBrandFromName(p.name)))];
        brands.sort();

        brands.forEach(brand => {
            const option = document.createElement('option');
            option.value = brand;
            option.textContent = brand;
            brandSelect.appendChild(option);
        });
    }
}

function getBrandFromName(name) {
    const parts = name.split(' ');
    if (parts.length > 0) {
        return parts[0];
    }
    return '';
}

