window.onload = function () {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    document.body.innerHTML = "<p>Không tìm thấy sản phẩm.</p>";
    return;
  }

  fetch(`http://localhost:8080/api/cars/${id}`)
    .then((response) => {
      if (!response.ok) throw new Error("Lỗi khi lấy chi tiết sản phẩm");
      return response.json();
    })
    .then((data) => renderProductDetail(data))
    .catch((error) => {
      console.error(error);
      document.body.innerHTML = "<p>Lỗi khi tải dữ liệu sản phẩm.</p>";
    });
};

function renderProductDetail(product) {
  document.title = product.name;

  const container = document.querySelector(".product-detail");
  container.innerHTML = "";

  const imageHTML = product.carImagesUrl
    .map(
      (url) => `<img src="${url}" alt="${product.name}" class="product-image">`
    )
    .join("");

  container.innerHTML = `
      <h1>${product.name}</h1>
      <div class="product-images">${imageHTML}</div>
      <p><strong>Giá:</strong> ${product.price.toLocaleString("vi-VN")} VND</p>
      <p><strong>Tồn kho:</strong> ${product.stock}</p>
      <p><strong>Loại xe:</strong> ${product.carTypeName}</p>
      <p><strong>Mô tả:</strong> ${product.description}</p>
  `;

  document.body.appendChild(container);
}
