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
  document.getElementById("productPrice").value =
    product.price.toLocaleString("vi-VN");
  document.getElementById("loanValue").value = (
    product.price * 0.5
  ).toLocaleString("vi-VN");
  document.getElementById("payBefore").innerText =
    (product.price - product.price * 0.5).toLocaleString("vi-VN") + " VNĐ";
  let payPerMonth = (product.price * 0.5 + product.price * 0.5 * 0.1) / 60;
  document.getElementById("payPerMonth").innerText =
    payPerMonth.toLocaleString("vi-VN") + " VNĐ";
  const thumbs = document.querySelectorAll(".thumb");
  document
    .getElementById("productPrice")
    .addEventListener("input", async () => {
      await calculateLoan(
        document.getElementById("productPrice").value.replaceAll(".", ""),
        document.getElementById("percentOfPrice").value.replaceAll(".", ""),
        document.getElementById("loanValue").value.replaceAll(".", ""),
        document.getElementById("interestRate").value.replaceAll(".", ""),
        document.getElementById("monthNumber").value.replaceAll(".", ""),
        false
      );
    });
  document
    .getElementById("percentOfPrice")
    .addEventListener("input", async () => {
      await calculateLoan(
        document.getElementById("productPrice").value.replaceAll(".", ""),
        document.getElementById("percentOfPrice").value.replaceAll(".", ""),
        document.getElementById("loanValue").value.replaceAll(".", ""),
        document.getElementById("interestRate").value.replaceAll(".", ""),
        document.getElementById("monthNumber").value.replaceAll(".", ""),
        true
      );
    });
  document
    .getElementById("interestRate")
    .addEventListener("input", async () => {
      await calculateLoan(
        document.getElementById("productPrice").value.replaceAll(".", ""),
        document.getElementById("percentOfPrice").value.replaceAll(".", ""),
        document.getElementById("loanValue").value.replaceAll(".", ""),
        document.getElementById("interestRate").value.replaceAll(".", ""),
        document.getElementById("monthNumber").value.replaceAll(".", ""),
        false
      );
    });
  document.getElementById("monthNumber").addEventListener("input", async () => {
    await calculateLoan(
      document.getElementById("productPrice").value.replaceAll(".", ""),
      document.getElementById("percentOfPrice").value.replaceAll(".", ""),
      document.getElementById("loanValue").value.replaceAll(".", ""),
      document.getElementById("interestRate").value.replaceAll(".", ""),
      document.getElementById("monthNumber").value.replaceAll(".", ""),
      false
    );
  });
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
          alert("Đã thêm vào giỏ hàng");
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

  async function calculateLoan(
    productPrice,
    percentOfPrice,
    loanValue,
    interestRate,
    monthNumber,
    isPercentOfPriceInput
  ) {
    if (productPrice == "" || productPrice == undefined) {
      document.getElementById("payPerMonth").innerText = " VNĐ";
      document.getElementById("payBefore").innerText = " VNĐ";
      document.getElementById("percentOfPrice").value = "";
      document.getElementById("loanValue").value = "";
      return;
    } else {
      if (
        (percentOfPrice == "" || percentOfPrice == undefined) &&
        !isPercentOfPriceInput
      ) {
        document.getElementById("percentOfPrice").value = "50";
        document.getElementById("loanValue").value = (
          productPrice * 0.5
        ).toLocaleString("vi-VN");
        document.getElementById("productPrice").value =
          productPrice.toLocaleString("vi-VN");
        percentOfPrice = 50;
        loanValue = productPrice * 0.5;
      }
    }
    if (percentOfPrice == "" || percentOfPrice == undefined) {
      document.getElementById("payPerMonth").innerText = " VNĐ";
      document.getElementById("payBefore").innerText = " VNĐ";
      document.getElementById("loanValue").value = "";
      return;
    }
    if (interestRate == "" || interestRate == undefined) {
      interestRate = 0;
    }
    if (monthNumber == "" || monthNumber == undefined) {
      monthNumber = 1;
    }
    document.getElementById("interestRate").value = interestRate;
    document.getElementById("monthNumber").value = monthNumber;
    loanValue = productPrice * (percentOfPrice / 100);
    document.getElementById("loanValue").value =
      loanValue.toLocaleString("vi-VN");
    let payPerMonth =
      (productPrice * (percentOfPrice / 100) +
        (productPrice * (percentOfPrice / 100) * interestRate) / 100) /
      monthNumber;
    document.getElementById("payPerMonth").innerText =
      payPerMonth.toLocaleString("vi-VN") + " VNĐ";
    document.getElementById("payBefore").innerText =
      (productPrice - productPrice * (percentOfPrice / 100)).toLocaleString(
        "vi-VN"
      ) + " VNĐ";
  }
}
