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

  const thumbnailHTML = product.carImagesUrl
    .map(
      (url, index) =>
        `<img src="${url}" alt="${product.name}" class="thumb ${
          index === 0 ? "active" : ""
        }">`
    )
    .join("");

  container.innerHTML = `
      <div class="product-images-container">
        <img id="main-image" src="${
          product.carImagesUrl[0]
        }" class="main-image" />
        <div class="thumbnails">
          ${thumbnailHTML}
        </div>
      </div>
      <div class="product-info">
        <h1>${product.name}</h1>
        <p>Mô tả: </p>${product.description}
        <p class="price">Giá: <span>${product.price.toLocaleString(
          "vi-VN"
        )}</span> VNĐ</p>
        <p>Hãng xe: <span class="brand">${product.carTypeName}</span></p>
        <p>Số lượng còn lại: <span class="stok">${product.stock}</span></p>
        <p>Lượt xem: <span>${product.viewCount}</span></p>
        ${
          isLoggedIn()
            ? `<p>Số lượng đặt hàng: </p>
        <input type="text" id="quantity" name="quantity" value="1"/>
        <button class="button_add">Thêm vào giỏ hàng</button>`
            : ``
        }
        
      </div>
  `;
  const thumbs = document.querySelectorAll(".thumb");
  function setMainImage(index) {
    document.getElementById("main-image").src = product.carImagesUrl[index];
    thumbs.forEach((t) => t.classList.remove("active"));
    thumbs[index].classList.add("active");
  }
  thumbs.forEach((thumb, index) => {
    thumb.addEventListener("click", () => {
      setMainImage(index);
    });
  });
  if (isLoggedIn()) {
    const buttonAdd = document
      .querySelector(".button_add")
      .addEventListener("click", async function () {
        const quantity = document.getElementById("quantity").value;
        if (!quantity) {
          quantity = 1;
        }
        const userId = localStorage.getItem("userId");
        const res = await fetch(
          `${API_BASE_URL}/cart/add?accountId=${userId}&carId=${id}&quantity=${quantity}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
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
}
