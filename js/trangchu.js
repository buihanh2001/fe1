
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




