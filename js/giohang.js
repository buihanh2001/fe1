window.onload = async function () {
  let cartItemIds = [];
  await fetch(
    `${API_BASE_URL}/cart?accountId=${localStorage.getItem("userId")}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  )
    .then((response) => {
      if (!response.ok) throw new Error("Lỗi khi lấy chi tiết giỏ hàng");
      return response.json();
    })
    .then(async (data) => {
      await renderCartItem(data);
      data.forEach((item) => cartItemIds.push(item.id));
    })
    .catch((error) => {
      console.error(error);
      document.body.innerHTML = "<p>Lỗi khi tải dữ liệu giỏ hàng.</p>";
    });
  await fetch(`${API_BASE_URL}/cars/suggest`)
    .then((response) => {
      console.log("fetch response:", response); // Log toàn bộ response
      if (!response.ok) {
        throw new Error("Lỗi mạng: " + response.status);
      }
      return response.json();
    })
    .then(async (data) => {
      console.log("fetch data:", data); // Log dữ liệu thô từ API
      products = data.map((car) => ({
        ...car,
        image:
          car.carImagesUrl && car.carImagesUrl.length > 0
            ? car.carImagesUrl[0]
            : "",
      }));
      console.log("mapped products:", products); // Log sau khi map
      renderProducts(products);
    })
    .catch((error) => {
      console.error("Lỗi fetch:", error);
      document.querySelector(".product-container").innerHTML =
        "<p>Không thể tải dữ liệu sản phẩm.</p>";
    });
  document.querySelector(".payButton").addEventListener("click", async () => {
    const result = await Swal.fire({
      title: "Đặt cọc",
      text: "Bạn sẽ phải đặt cọc 100.000 vnd. Bạn chắc chắn muốn tiếp tục đặt cọc chứ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Tiếp tục",
      cancelButtonText: "Hủy",
    });
    if (result.isConfirmed) {
    } else {
      return;
    }
    console.log(JSON.stringify(cartItemIds));
    const resp = await fetch(
      `${API_BASE_URL}/orders/${localStorage.getItem("userId")}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(cartItemIds),
      }
    ).then(async (resp) => {
      if (!resp.ok) {
        const error = await resp.text();
        alert(resp.body);
        return;
      } else {
        return resp.json();
      }
    });

    if (resp.resultCode == 0) {
      window.location.href = resp.payUrl;
    } else {
      alert(resp.message);
    }
  });
};
const defaultImage =
  "https://toyotahoankiem.com.vn/Uploads/images/cars/Altis-2020.png";
function renderProducts(productList) {
  console.log("renderProducts called with:", productList);
  const container = document.querySelector(".product-container");
  container.innerHTML = "";

  if (productList.length === 0) {
    container.innerHTML = "<p>Không tìm thấy sản phẩm nào.</p>";
    return;
  }

  productList.forEach((product) => {
    console.log("Rendering product:", product);
    const item = document.createElement("div");
    item.className = "product-item";
    item.innerHTML = `
            <img src="${product.image || defaultImage}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Giá: ${product.price.toLocaleString("vi-VN")} VND</p>
        `;
    item.addEventListener("click", () => {
      window.location.href = `chitietsanpham.html?id=${product.id}`;
    });
    container.appendChild(item);
  });
}
function renderCartItem(datas) {
  const tbody = document.querySelector(".detail-table-cart-item");
  tbody.innerHTML = "";
  let totalPrice = 0;
  count = 1;
  datas.forEach((data) => {
    console.log("Rendering cart item:", data);
    const row = document.createElement("tr");
    row.innerHTML = `
          <td>${count}</td>
          <td>${data.carName}</td>
          <td><p class="price">${data.price.toLocaleString("vi-VN")} đ</p></td>
          <td>
            <button class="des" data-id="${data.id}">-</button>
            <input type="text" class="quantity" data-id="${data.id}" value="${
      data.quantity
    }" />
            <button class="plus" data-id="${data.id}">+</button>
          </td>
          <td><p class="totalAmount">${data.totalAmount.toLocaleString(
            "vi-VN"
          )} đ</p></td>
          <td><button class="deleteRowCartItem" data-id="${
            data.id
          }">X</button></td>
    `;
    tbody.appendChild(row);
    totalPrice += data.totalAmount;
    count++;
  });
  tbody.innerHTML += `
          <tr>
          <td colspan="4"><strong>TỔNG TIỀN:</strong></td>
          <td><p class="totalPrice"><strong>${totalPrice.toLocaleString(
            "vi-VN"
          )} đ</strong></p></td>
          <td><button class="deleteAllRow"><strong>Xóa hết</strong></button></td>
        </tr>`;
  document.querySelectorAll(".quantity").forEach((input) => {
    input.addEventListener("input", function (e) {
      if (e.target.value.includes("-"))
        e.target.value = e.target.value.replace("-", "");
      const rawValue = e.target.value.replace(/[^\d]/g, "");
      if (rawValue) {
        e.target.value = Number(rawValue);
      } else {
        e.target.value = "";
      }
    });
  });
  document
    .querySelector(".deleteAllRow")
    .addEventListener("click", async (event) => {
      const confirmed = confirm("Bạn có chắc là xóa luôn không?");
      if (!confirmed) return;
      const resp = await fetch(
        `${API_BASE_URL}/cart/clear?accountId=${localStorage.getItem(
          "userId"
        )}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      if (!resp.ok) {
        throw new Error("Lỗi khi xóa");
      } else {
        await fetch(
          `${API_BASE_URL}/cart?accountId=${localStorage.getItem("userId")}`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        )
          .then((response) => {
            if (!response.ok) throw new Error("Lỗi khi lấy thông tin giỏ hàng");
            return response.json();
          })
          .then(async (data) => await renderCartItem(data));
      }
    });
  document.querySelectorAll(".deleteRowCartItem").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const confirmed = confirm("Bạn có chắc là xóa luôn không?");
      if (!confirmed) return;
      const button = event.target;
      const id = button.dataset.id;
      const resp = await fetch(`${API_BASE_URL}/cart/remove/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (!resp.ok) {
        throw new Error("Lỗi khi xóa cart item");
      } else {
        await fetch(
          `${API_BASE_URL}/cart?accountId=${localStorage.getItem("userId")}`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        )
          .then((response) => {
            if (!response.ok) throw new Error("Lỗi khi lấy thông tin giỏ hàng");
            return response.json();
          })
          .then(async (data) => await renderCartItem(data));
      }
    });
  });
  document.querySelectorAll(".quantity").forEach((input) => {
    input.addEventListener("blur", async (event) => {
      const input = event.target;
      const id = input.dataset.id;
      const quantity = input.value;
      const resp = await fetch(
        `${API_BASE_URL}/cart/update/${id}?quantity=${quantity}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      if (!resp.ok) {
        throw new Error("Lỗi khi cập nhật số lượng");
      } else {
        input.parentElement.querySelector(".quantity").value = quantity;
        const row = input.closest("tr");
        const price = parseInt(
          row.querySelector(".price").innerText.replace(/[^\d]/g, "")
        );
        row.querySelector(".totalAmount").innerText = `${(
          quantity * price
        ).toLocaleString("vi-VN")} đ`;

        const totalPriceElement = document.querySelector(".totalPrice");
        let totalPrice = 0;
        document.querySelectorAll(".totalAmount").forEach((amount) => {
          totalPrice += parseInt(amount.innerText.replace(/[^\d]/g, ""));
        });
        totalPriceElement.innerHTML = `<strong>${totalPrice.toLocaleString(
          "vi-VN"
        )} đ</strong>`;
      }
    });
  });
  document.querySelectorAll(".des").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const button = event.target;
      const id = button.dataset.id;
      const quantityInput =
        button.parentElement.querySelector(".quantity").value;
      if (quantityInput == 1) {
        const confirmed = confirm("Bạn có chắc là xóa luôn không?");
        if (!confirmed) return;
        const resp = await fetch(`${API_BASE_URL}/cart/remove/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        if (!resp.ok) {
          throw new Error("Lỗi khi xóa cart item");
        } else {
          await fetch(
            `${API_BASE_URL}/cart?accountId=${localStorage.getItem("userId")}`,
            {
              headers: {
                Authorization: `Bearer ${getToken()}`,
              },
            }
          )
            .then((response) => {
              if (!response.ok)
                throw new Error("Lỗi khi lấy thông tin giỏ hàng");
              return response.json();
            })
            .then(async (data) => await renderCartItem(data));
        }
      }
      const quantity = parseInt(quantityInput) - 1;
      const resp = await fetch(
        `${API_BASE_URL}/cart/update/${id}?quantity=${quantity}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      if (!resp.ok) {
        throw new Error("Lỗi khi cập nhật số lượng");
      } else {
        button.parentElement.querySelector(".quantity").value = quantity;
        const row = button.closest("tr");
        const price = parseInt(
          row.querySelector(".price").innerText.replace(/[^\d]/g, "")
        );
        row.querySelector(".totalAmount").innerText = `${(
          quantity * price
        ).toLocaleString("vi-VN")} đ`;
        const totalPriceElement = document.querySelector(".totalPrice");
        let totalPrice = 0;
        document.querySelectorAll(".totalAmount").forEach((amount) => {
          totalPrice += parseInt(amount.innerText.replace(/[^\d]/g, ""));
        });
        totalPriceElement.innerHTML = `<strong>${totalPrice.toLocaleString(
          "vi-VN"
        )} đ</strong>`;
      }
    });
  });
  document.querySelectorAll(".plus").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const button = event.target;
      const id = button.dataset.id;
      const quantityInput =
        button.parentElement.querySelector(".quantity").value;
      const quantity = parseInt(quantityInput) + 1;
      const resp = await fetch(
        `${API_BASE_URL}/cart/update/${id}?quantity=${quantity}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      if (!resp.ok) {
        throw new Error("Lỗi khi cập nhật số lượng");
      } else {
        button.parentElement.querySelector(".quantity").value = quantity;
        const row = button.closest("tr");
        const price = parseInt(
          row.querySelector(".price").innerText.replace(/[^\d]/g, "")
        );
        row.querySelector(".totalAmount").innerText = `${(
          quantity * price
        ).toLocaleString("vi-VN")} đ`;
        const totalPriceElement = document.querySelector(".totalPrice");
        let totalPrice = 0;
        document.querySelectorAll(".totalAmount").forEach((amount) => {
          totalPrice += parseInt(amount.innerText.replace(/[^\d]/g, ""));
        });
        totalPriceElement.innerHTML = `<strong>${totalPrice.toLocaleString(
          "vi-VN"
        )} đ</strong>`;
      }
    });
  });
}
