window.onload = async function () {
  await fetch(`${API_BASE_URL}/cart?accountId=1`)
    .then((response) => {
      if (!response.ok) throw new Error("Lỗi khi lấy chi tiết giỏ hàng");
      return response.json();
    })
    .then(async (data) => await renderCartItem(data))
    .catch((error) => {
      console.error(error);
      document.body.innerHTML = "<p>Lỗi khi tải dữ liệu giỏ hàng.</p>";
    });
};
function renderCartItem(datas) {
  const tbody = document.querySelector(".detail-table-cart-item");
  tbody.innerHTML = "";
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
          <td><button>X</button></td>
    `;
    tbody.appendChild(row);
    count++;
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
      }
    });
  });
  document.querySelectorAll(".des").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const button = event.target;
      const id = button.dataset.id;
      const quantityInput =
        button.parentElement.querySelector(".quantity").value;
      const quantity = parseInt(quantityInput) - 1;
      const resp = await fetch(
        `${API_BASE_URL}/cart/update/${id}?quantity=${quantity}`,
        {
          method: "POST",
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
      }
    });
  });
}
