
function addBanner(img, link) {
	const newDiv = `
		<div class="item">
			<a target="_blank" href="${link}">
				<img src="${img}" alt="Banner">
			</a>
		</div>
	`;
	const banner = document.querySelector('.owl-carousel');
	if (banner) {
		banner.insertAdjacentHTML('beforeend', newDiv);
	}
}

window.onload = function () {
	
	var bannerFiles = [
	  "img/banners/banner0.png",
	  "img/banners/banner1.jpg",
	  "img/banners/banner2.jpg",
	  "img/banners/banner3.png"];

	for (var i = 0; i < bannerFiles.length; i++) {
    addBanner(bannerFiles[i], bannerFiles[i]);
	}

	
	setTimeout(function () {
		$('.owl-carousel').owlCarousel({
			items: 1, 
			margin: 100,
			center: true,
			loop: true, 
			smartSpeed: 450,
			autoplay: true,
			autoplayTimeout: 3500
		});
	}, 100); 
};

// thêm sản phẩm
// function renderHomeProducts() {
//     const container = document.getElementById('home-product-container');
//     if (!container) return;

//     container.innerHTML = '';

    
//     const latestProducts = products.slice(0, 8);

//     latestProducts.forEach(product => {
//         const item = document.createElement('div');
//         item.className = 'product-item';
//         item.innerHTML = `
//             <img src="${product.image}" alt="${product.name}">
//             <h3>${product.name}</h3>
//             <p>Giá: ${product.price.toLocaleString('vi-VN')} VND</p>
//         `;
//         container.appendChild(item);
//     });
// }

// window.addEventListener('DOMContentLoaded', function() {
//     renderHomeProducts();
// });



