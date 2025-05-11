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
    .then(async (data) => await renderProductDetail(data, id))
    .catch((error) => {
      console.error(error);
      document.body.innerHTML = "<p>Lỗi khi tải dữ liệu sản phẩm.</p>";
    });
};

function renderProductDetail(product, id) {
  document.title = product.name;

  const container = document.querySelector(".product-detail");
  container.innerHTML = "";

  const imageHTML = product.carImagesUrl
    .map(
      (url) => `<img src="${url}" alt="${product.name}" class="product-image">`
    )
    .join("");

  container.innerHTML = `
      <div class="product-images-container">
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
        <p>Số lượng đặt hàng: </p>
        <input type="text" id="quantity" name="quantity" value="1"/>
        <button class="button_add">Thêm vào giỏ hàng</button>
      </div>
  `;
  const buttonAdd = document
    .querySelector(".button_add")
    .addEventListener("click", async function () {
      const quantity = document.getElementById("quantity").value;
      if (!quantity) {
        quantity = 1;
      }
      const res = await fetch(
        `${API_BASE_URL}/cart/add?accountId=1&carId=${id}&quantity=${quantity}`,
        {
          method: "POST",
        }
      );
      if (!res.ok) {
        alert("Lỗi khi thêm sản phẩm vào giỏ hàng");
      } else {
        alert("Thành công khi thêm sản phẩm vào giỏ hàng");
      }
    });
  document.getElementById("quantity").addEventListener("input", function (e) {
    if (e.target.value.includes("-"))
      e.target.value = e.target.value.replace("-", "");
    const rawValue = e.target.value.replace(/[^\d]/g, "");
    if (rawValue) {
      e.target.value = Number(rawValue);
    } else {
      e.target.value = "";
    }
  });
}
