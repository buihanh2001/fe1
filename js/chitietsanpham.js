window.onload = async function () {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    document.body.innerHTML = "<p>Không tìm thấy sản phẩm.</p>";
    return;
  }

  await fetch(`${API_BASE_URL}/cars/${id}`)
    .then((response) => {
      if (!response.ok) throw new Error("Lỗi khi lấy chi tiết sản phẩm");
      return response.json();
    })
    .then(async (data) => await renderProductDetail(data))
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
      <p><strong>Loại xe:</strong> </p>
      <p><strong>Mô tả:</strong> ${product.description}</p>
      <div>
        ${imageHTML}
      </div>
      <div class="product-info">
        <h1>${product.name}</h1>
        <p>Mô tả: <span>${product.description}</span></p>
        <p class="price">Giá: <span>${product.price.toLocaleString(
          "vi-VN"
        )}</span> VNĐ</p>
        <p>Hãng xe: <span class="brand">${product.carTypeName}</span></p>
        <p>Số lượng còn lại: <span class="stok">${product.stock}</span></p>
        <p>Lượt xem: <span>${product.viewCount}</span></p>

        <button class="button_add">Thêm vào giỏ hàng</button>
      </div>
  `;
}
