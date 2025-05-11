window.onload = async function () {
  let cartItemIds = [];
  await fetch(`${API_BASE_URL}/cart?accountId=1`)
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
  document.querySelector(".payButton").addEventListener("click", async () => {
    console.log(JSON.stringify(cartItemIds));
    const resp = await fetch(`${API_BASE_URL}/orders/1`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cartItemIds),
    }).then(async (resp) => {
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
          <td><strong>${totalPrice.toLocaleString("vi-VN")} đ</strong></td>
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
      const resp = await fetch(`${API_BASE_URL}/cart/clear?accountId=1`, {
        method: "DELETE",
      });
      if (!resp.ok) {
        throw new Error("Lỗi khi xóa cart item");
      } else {
        await fetch(`${API_BASE_URL}/cart?accountId=1`)
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
      });
      if (!resp.ok) {
        throw new Error("Lỗi khi xóa cart item");
      } else {
        await fetch(`${API_BASE_URL}/cart?accountId=1`)
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
      if (quantityInput == 1) {
        const confirmed = confirm("Bạn có chắc là xóa luôn không?");
        if (!confirmed) return;
        const resp = await fetch(`${API_BASE_URL}/cart/remove/${id}`, {
          method: "DELETE",
        });
        if (!resp.ok) {
          throw new Error("Lỗi khi xóa cart item");
        } else {
          await fetch(`${API_BASE_URL}/cart?accountId=1`)
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
